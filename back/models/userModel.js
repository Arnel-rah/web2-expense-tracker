import pool from "../config/database.js"; 

// Créer un utilisateur
export const createUser = async ({ username, email, password }) => {
  const query = `
    INSERT INTO utilisateur (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [email, password];
  const result = await pool.query(query, values);
  
  return result.rows[0];
};

// Trouver un utilisateur par email
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM utilisateur WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Trouver un utilisateur par ID
export const findUserById = async (id) => {
  const query = `SELECT * FROM utilisateur WHERE user_id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Mettre à jour le mot de passe d'un utilisateur
export const updatePassword = async (id, newPassword) => {
  const query = `
    UPDATE utilisateur
    SET password = $1
    WHERE user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [newPassword, id]);
  return result.rows[0];
};
