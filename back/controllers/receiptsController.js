import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import path from 'path';
import fs from 'fs';

export const getReceipt = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;

  const query = 'SELECT r.file_path FROM depense d JOIN recu r ON d.receipt_id = r.receipt_id WHERE d.expense_id = $1 AND d.user_id = $2';

  try {
    const result = await pool.query(query, [req.params.idExpense, userId]);
    if (result.rows.length === 0) 
      return res.status(404).json({ message: 'Receipt not found' });

    const filePath = path.join('uploads', result.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting receipt' });
  }
};

export const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;

  const fileName = req.file.filename;
  const fileType = req.file.mimetype;
  const expenseId = req.body.expenseId; 

  const result = await pool.query(
    'INSERT INTO recu (user_id, file_path, file_type) VALUES ($1, $2, $3) RETURNING *',
    [userId, fileName, fileType]
  );

  await pool.query(
    'UPDATE depense SET receipt_id = $1 WHERE expense_id = $2 AND user_id = $3',
    [result.rows[0].receipt_id, expenseId, userId]
  );

  res.status(201).json({
    message: 'Reçu bien stocké ',
    file: result.rows[0],
  });
};