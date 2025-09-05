import express from 'express';
import { signup, login} from '../controllers/authController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';
import { getProfile } from '../controllers/profileController.js';
const router = express.Router();

router.use(logRequest);
router.post('/signup', signup);//veifié
router.post('/login', login);//verifié
router.get('/me', authenticate, getProfile);//verifié

export default router;