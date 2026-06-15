import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParamRule } from '../validators/urlValidators.js';

export const analyticsRoutes = Router();

analyticsRoutes.get('/:id', protect, idParamRule, validate, getAnalytics);
