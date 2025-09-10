import pool from '../config/database.js';

// Récupérer toutes les dépenses avec filtres
export const getExpenses = async (req, res) => {
  const { start, end, category, type } = req.query;
  const userId = req.userId;

  let query = `SELECT 
  depense.*,
  categorie.name AS category
  FROM depense
  INNER JOIN categorie ON depense.category_id = categorie.category_id
  WHERE depense.user_id = $1;
`
  const values = [userId];

  if (start) {
    query += ' AND date >= $' + (values.length + 1);
    values.push(new Date(start));
  }
  if (end) {
    query += ' AND date <= $' + (values.length + 1);
    values.push(new Date(end));
  }
  if (category) {
    query += ' AND category_id = $' + (values.length + 1);
    values.push(category);
  }
  if (type) {
    query += ' AND type = $' + (values.length + 1);
    values.push(type);
  }

  try {
    const result = await pool.query(query, values);

    const formatted = result.rows.map(row => ({
      ...row,
      date: row.date ? row.date.toISOString().split("T")[0] : null
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error getting expenses', error: error.message });
  }
};

// Récupérer une dépense par ID
export const getExpenseById = async (req, res) => {
  const userId = req.userId;
  const query = 'SELECT * FROM depense WHERE expense_id = $1 AND user_id = $2';

  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting expense', error: error.message });
  }
};

// Créer une dépense
export const createExpense = async (req, res) => {
  const { amount, date, category_id, description, type, start_date, end_date } = req.body;
  const userId = req.userId;

  let receiptId = null;
  if (req.file) {
    const recuResult = await pool.query(
      'INSERT INTO recu (user_id, file_path, file_type) VALUES ($1, $2, $3) RETURNING receipt_id',
      [userId, req.file.filename, req.file.mimetype]
    );
    receiptId = recuResult.rows[0].receipt_id;
  }

  const query = `
    INSERT INTO depense
      (user_id, type, description, amount, start_date, end_date, date, receipt_id, category_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    userId,
    type,
    description,
    amount,
    type === 'recurring' ? start_date : null,
    type === 'recurring' ? end_date : null,
    type === 'one-time' ? date : null,
    receiptId,
    category_id
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
};

// Mettre à jour une dépense
export const updateExpense = async (req, res) => {
  const { amount, date, category_id, description, type, start_date, end_date } = req.body;
  const userId = req.userId;

  let receiptId = null;
  if (req.file) {
    const recuResult = await pool.query(
      'INSERT INTO recu (user_id, file_path, file_type) VALUES ($1, $2, $3) RETURNING receipt_id',
      [userId, req.file.filename, req.file.mimetype]
    );
    receiptId = recuResult.rows[0].receipt_id;
  }

  const query = `
    UPDATE depense SET
      type = $1,
      description = $2,
      amount = $3,
      start_date = $4,
      end_date = $5,
      date = $6,
      receipt_id = COALESCE($7, receipt_id),
      category_id = $8
    WHERE expense_id = $9 AND user_id = $10
    RETURNING *
  `;

  const values = [
    type,
    description,
    amount,
    type === 'recurring' ? start_date : null,
    type === 'recurring' ? end_date : null,
    type === 'one-time' ? date : null,
    receiptId,
    category_id,
    req.params.id,
    userId
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating expense', error: error.message });
  }
};

// Supprimer une dépense
export const deleteExpense = async (req, res) => {
  const userId = req.userId;
  const query = 'DELETE FROM depense WHERE expense_id = $1 AND user_id = $2 RETURNING *';

  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};