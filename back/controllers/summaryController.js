import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const getMonthlySummary = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const { month } = req.query;

  // Calcul des bornes du mois
  const [year, monthNum] = (month || new Date().toISOString().slice(0, 7)).split('-');
  const start = `${year}-${monthNum}-01`;
  const end = new Date(year, monthNum, 0).toISOString().slice(0, 10);

  const query = `
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) 
       FROM depense 
       WHERE user_id = $1 
         AND ("date" BETWEEN $2 AND $3 OR (type = 'recurring' AND start_date <= $3 AND (end_date >= $2 OR end_date IS NULL)))
      ) AS total_expenses,
      (SELECT COALESCE(SUM(amount), 0) 
       FROM revenu 
       WHERE user_id = $1 
         AND "date" BETWEEN $2 AND $3
      ) AS total_income
  `;

  try {
    const result = await pool.query(query, [userId, start, end]);
    const { total_expenses, total_income } = result.rows[0];
    const balance = total_income - total_expenses;
    res.json({ total_income, total_expenses, balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du résumé' });
  }
};

export const getSummary = async (req, res) => {
  const { start, end } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;

  const query = `
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) 
       FROM depense 
       WHERE user_id = $1 
         AND ("date" BETWEEN $2 AND $3 OR (type = 'recurring' AND start_date <= $3 AND (end_date >= $2 OR end_date IS NULL)))
      ) AS total_expenses,
      (SELECT COALESCE(SUM(amount), 0) 
       FROM revenu 
       WHERE user_id = $1 
         AND "date" BETWEEN $2 AND $3
      ) AS total_income
  `;

  try {
    const result = await pool.query(query, [userId, start, end]);
    const { total_expenses, total_income } = result.rows[0];
    const balance = total_income - total_expenses;
    res.json({ total_income, total_expenses, balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du résumé' });
  }
};

export const getAlerts = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const currentMonth = new Date().toISOString().slice(0, 7); 

  const query = `
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) 
       FROM depense 
       WHERE user_id = $1 
         AND ("date" LIKE $2 || '-%' OR (type = 'recurring' AND start_date <= $3 AND (end_date >= $3 OR end_date IS NULL)))
      ) AS total_expenses,
      (SELECT COALESCE(SUM(amount), 0) 
       FROM revenu 
       WHERE user_id = $1 
         AND "date" LIKE $2 || '-%'
      ) AS total_income
  `;

  try {
    const result = await pool.query(query, [userId, currentMonth, new Date()]);
    const { total_expenses, total_income } = result.rows[0];
    if (total_expenses > total_income) {
      res.json({ 
        alert: true, 
        message: `Vous avez dépassé votre budget de ${(total_expenses - total_income).toFixed(2)} € ce mois-ci` 
      });
    } else {
      res.json({ alert: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des alertes' });
  }
};