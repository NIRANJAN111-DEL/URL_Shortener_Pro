import { body, param, query } from 'express-validator';

const aliasPattern = /^[a-zA-Z0-9_-]{3,40}$/;

export const createUrlRules = [
  body('originalUrl').isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('A valid http(s) URL is required'),
  body('customAlias').optional({ checkFalsy: true }).matches(aliasPattern).withMessage('Alias must be 3-40 letters, numbers, hyphens, or underscores'),
  body('expiresAt').optional({ checkFalsy: true }).isISO8601().withMessage('Expiry date must be valid'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 4 }).withMessage('Link password must be at least 4 characters'),
  body('isPublicStatsEnabled').optional().isBoolean()
];

export const updateUrlRules = [
  param('id').isMongoId().withMessage('Invalid URL id'),
  body('originalUrl').optional().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('A valid http(s) URL is required'),
  body('expiresAt').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Expiry date must be valid'),
  body('isActive').optional().isBoolean(),
  body('isStarred').optional().isBoolean(),
  body('password').optional({ checkFalsy: true }).isLength({ min: 4 }).withMessage('Link password must be at least 4 characters')
];

export const idParamRule = [param('id').isMongoId().withMessage('Invalid id')];
export const shortCodeRule = [param('shortCode').trim().notEmpty().withMessage('Short code is required')];
export const listRules = [
  query('search').optional().trim(),
  query('status').optional().isIn(['all', 'active', 'expired', 'inactive']),
  query('starred').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];
