import express from 'express'

const router = express.Router();

router.use()
router.get('/', getExpenses);
router.get('/:id', authenticate, getExpensesById);
router.post('/');
router.put('/:id');
router.delete('/:id');