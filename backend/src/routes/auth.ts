import express from 'express';
import { login, logout, getCurrentUser } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', authLimiter, login);

// @route   POST /api/auth/logout
router.post('/logout', authLimiter, auth, logout);

// @route   GET /api/auth/me
router.get('/me', auth, getCurrentUser);

export default router; 