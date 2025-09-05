import express from 'express';
import { getReceipt , uploadReceipt} from '../controllers/receiptsController.js';
import { logRequest, upload } from '../middlewares/example.js'; 
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/:idExpense', authenticate, getReceipt);
router.post('/upload', authenticate, upload.single('receipt'), uploadReceipt);

export default router;
