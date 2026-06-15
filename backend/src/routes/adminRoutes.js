import { Router } from 'express';
import { body, param } from 'express-validator';
import { listUsers, overview, updateUserRole } from '../controllers/adminController.js';
import { authorize, protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

export const adminRoutes = Router();

adminRoutes.use(protect, authorize('admin'));
adminRoutes.get('/overview', overview);
adminRoutes.get('/users', listUsers);
adminRoutes.patch('/users/:id/role', [param('id').isMongoId(), body('role').isIn(['admin', 'manager', 'user'])], validate, updateUserRole);
