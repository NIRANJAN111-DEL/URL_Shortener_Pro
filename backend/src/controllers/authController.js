import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, registerUser, sanitizeUser } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.json({ success: true, data: result });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: sanitizeUser(req.user) } });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Logged out' });
});
