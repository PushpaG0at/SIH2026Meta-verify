import { Router } from 'express';
import { register, login, getCurrentUser, getDemoAccounts, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);
router.get('/demo-accounts', getDemoAccounts);

export default router;
