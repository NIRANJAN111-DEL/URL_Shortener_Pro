import express from 'express';
import { bulkCreate, checkHealth, createUrl, exportAnalytics, getUrl, getUrls, patchUrl, removeUrl } from '../controllers/urlController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createUrlRules, idParamRule, listRules, updateUrlRules } from '../validators/urlValidators.js';

export const urlRoutes = express.Router();

urlRoutes.use(protect);
urlRoutes.get('/', listRules, validate, getUrls);
urlRoutes.post('/', createUrlRules, validate, createUrl);
urlRoutes.post('/bulk', bulkCreate);
urlRoutes.get('/:id', idParamRule, validate, getUrl);
urlRoutes.patch('/:id', updateUrlRules, validate, patchUrl);
urlRoutes.delete('/:id', idParamRule, validate, removeUrl);
urlRoutes.post('/:id/health', idParamRule, validate, checkHealth);
urlRoutes.get('/:id/export', idParamRule, validate, exportAnalytics);
