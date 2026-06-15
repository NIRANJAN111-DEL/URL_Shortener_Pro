import { Router } from 'express';
import { login, logout, me, register } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginRules, registerRules } from '../validators/authValidators.js';

export const authRoutes = Router();

authRoutes.post('/register', registerRules, validate, register);
authRoutes.post('/login', loginRules, validate, login);
authRoutes.get('/me', protect, me);
authRoutes.post('/logout', protect, logout);
