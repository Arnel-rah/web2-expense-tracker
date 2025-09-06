import pool from "../config/database.js"
export const findProfileById = async (userId) => {
  const result = await pool.query(
    "SELECT user_id, username, email FROM utilisateur WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
};