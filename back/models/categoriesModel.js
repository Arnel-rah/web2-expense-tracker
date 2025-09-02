//lister les catégories
const getCategories = async (userId) =>{
    const result = await pool.query(
    "SELECT * FROM categorie WHERE user_id = $1",
    [userId]
  );
};

// créer une catégorie
const createCategory = async (userId, name) =>{
    const result = await pool.query(
    `INSERT INTO categorie(user_id, name)
    VALUES ($1, $2)
    RETURNING *;`
    [userId, name]
  );
};

//changer  le nom d'une catégorie
const updateCategory = async (categoryId, userId, name) => {
  const result = await pool.query(
    `UPDATE categorie 
     SET name = $1 
     WHERE id = $2 AND user_id = $3
     RETURNING *;`,
    [name, categoryId, userId]
  );

  return result.rows[0]; 
};

//supprimer une catégorie
const deleteCategory = async (categoryId, userId) => {
  const result = await pool.query(
    `DELETE FROM categorie
     WHERE id = $1 AND user_id = $2
     RETURNING *;`,
    [categoryId, userId]
  );

  return result.rows[0]; 
};