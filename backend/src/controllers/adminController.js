import { User } from '../models/User.js';
import { Url } from '../models/Url.js';
import { Visit } from '../models/Visit.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const overview = asyncHandler(async (_req, res) => {
  const [users, urls, visits, bots] = await Promise.all([
    User.countDocuments(),
    Url.countDocuments(),
    Visit.countDocuments(),
    Visit.countDocuments({ isBot: true })
  ]);
  res.json({ success: true, data: { users, urls, visits, bots } });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ success: true, data: user });
});
