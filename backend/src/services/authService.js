import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    teamId: user.teamId,
    createdAt: user.createdAt
  };
}

export async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new AppError('Email is already registered', 409);
  const user = await User.create(payload);
  return { token: signToken(user), user: sanitizeUser(user) };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  user.lastLoginAt = new Date();
  await user.save();
  return { token: signToken(user), user: sanitizeUser(user) };
}

export { sanitizeUser };
