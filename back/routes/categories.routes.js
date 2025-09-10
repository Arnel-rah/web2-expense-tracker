import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoriesController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getCategories);//verifié
router.post('/', authenticate, createCategory);//verifié
router.put('/:id', authenticate, updateCategory);//verifié
router.delete('/:id', authenticate, deleteCategory);//verifié

export default router;