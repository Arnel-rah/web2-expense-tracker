import express from 'express';
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from '../controllers/expensesController.js';
import { logRequest, upload } from '../middlewares/example.js';
import { validateExpense } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getExpenses);//vérifié
router.get('/:id', authenticate, getExpenseById);//verifié
router.post('/', authenticate, upload.single('receipt'), validateExpense, createExpense);//verifié
router.put('/:id', authenticate, upload.single('receipt'), validateExpense, updateExpense);//verifié
router.delete('/:id', authenticate, deleteExpense);//verifié

export default router;