import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { Role } from '../models/Role.js';
import { Url } from '../models/Url.js';
import { User } from '../models/User.js';
import { Visit } from '../models/Visit.js';
import { createShortUrl } from '../services/urlService.js';

async function seed() {
  await connectDb();
  await Promise.all([Role.deleteMany({}), Visit.deleteMany({}), Url.deleteMany({}), User.deleteMany({})]);

  await Role.insertMany([
    { name: 'admin', description: 'Platform owner', permissions: ['*'] },
    { name: 'manager', description: 'Team manager', permissions: ['team:links:manage'] },
    { name: 'user', description: 'Standard user', permissions: ['own:links:manage'] }
  ]);

  const admin = await User.create({ name: 'Admin User', email: 'admin@linkflow.dev', password: 'Password123!', role: 'admin' });
  const manager = await User.create({ name: 'Growth Manager', email: 'manager@linkflow.dev', password: 'Password123!', role: 'manager' });
  manager.teamId = manager._id;
  await manager.save();
  const user = await User.create({ name: 'Demo User', email: 'user@linkflow.dev', password: 'Password123!', role: 'user', teamId: manager._id });

  await createShortUrl(admin, { originalUrl: 'https://katomaran.com', customAlias: 'katomaran' });
  await createShortUrl(manager, { originalUrl: 'https://vercel.com', customAlias: 'vercel' });
  await createShortUrl(user, { originalUrl: 'https://render.com', customAlias: 'render' });

  console.log('Seed complete');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
