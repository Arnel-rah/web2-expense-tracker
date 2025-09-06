import express from 'express';
import { getIncomes, getIncomeById, createIncome, updateIncome, deleteIncome } from '../controllers/incomesController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getIncomes);//verifié
router.get('/:id', authenticate, getIncomeById);//verifié
router.post('/', authenticate, createIncome);//verifié
router.put('/:id', authenticate, updateIncome);//verifié
router.delete('/:id', authenticate, deleteIncome);//verifié

export default router;