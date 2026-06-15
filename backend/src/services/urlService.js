import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { Url } from '../models/Url.js';
import { AppError } from '../utils/AppError.js';
import { isValidHttpUrl } from '../utils/http.js';

async function uniqueCode(customAlias) {
  if (customAlias) {
    const exists = await Url.exists({ shortCode: customAlias });
    if (exists) throw new AppError('Custom alias is already in use', 409);
    return customAlias;
  }

  for (let i = 0; i < 8; i += 1) {
    const code = nanoid(8);
    if (!(await Url.exists({ shortCode: code }))) return code;
  }
  throw new AppError('Could not generate a unique short code', 500);
}

export function canManageUrl(user, url) {
  if (user.role === 'admin') return true;
  if (user.role === 'manager' && String(url.teamId || '') === String(user.teamId || user._id)) return true;
  return String(url.owner) === String(user._id);
}

export async function createShortUrl(user, payload) {
  if (!isValidHttpUrl(payload.originalUrl)) throw new AppError('Invalid destination URL', 400);

  const shortCode = await uniqueCode(payload.customAlias);
  const passwordHash = payload.password ? await bcrypt.hash(payload.password, env.bcryptSaltRounds) : undefined;

  const url = await Url.create({
    owner: user._id,
    teamId: user.teamId || user._id,
    originalUrl: payload.originalUrl,
    shortCode,
    customAlias: payload.customAlias || undefined,
    title: payload.title,
    description: payload.description,
    expiresAt: payload.expiresAt || undefined,
    passwordHash,
    isPasswordProtected: Boolean(passwordHash),
    isPublicStatsEnabled: payload.isPublicStatsEnabled ?? true
  });

  return url;
}

export async function listUrls(user, query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const filter = {};

  if (user.role === 'admin') {
    // admin sees all
  } else if (user.role === 'manager') {
    filter.teamId = user.teamId || user._id;
  } else {
    filter.owner = user._id;
  }

  if (query.search) {
    filter.$or = [
      { originalUrl: { $regex: query.search, $options: 'i' } },
      { shortCode: { $regex: query.search, $options: 'i' } },
      { title: { $regex: query.search, $options: 'i' } }
    ];
  }

  if (query.starred !== undefined) filter.isStarred = query.starred === 'true';
  if (query.status === 'inactive') filter.isActive = false;
  if (query.status === 'expired') filter.expiresAt = { $lte: new Date() };
  if (query.status === 'active') {
    filter.isActive = true;
    filter.$or = [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }];
  }

  const [items, total] = await Promise.all([
    Url.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Url.countDocuments(filter)
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

export async function getManagedUrl(user, id, includePassword = false) {
  const query = Url.findById(id);
  if (includePassword) query.select('+passwordHash');
  const url = await query;
  if (!url) throw new AppError('URL not found', 404);
  if (!canManageUrl(user, url)) throw new AppError('Forbidden', 403);
  return url;
}

export async function updateUrl(user, id, payload) {
  const url = await getManagedUrl(user, id, true);
  const allowed = ['originalUrl', 'title', 'description', 'expiresAt', 'isActive', 'isStarred', 'isPublicStatsEnabled'];
  for (const key of allowed) {
    if (payload[key] !== undefined) url[key] = payload[key] || undefined;
  }
  if (payload.originalUrl && !isValidHttpUrl(payload.originalUrl)) throw new AppError('Invalid destination URL', 400);
  if (payload.password !== undefined) {
    url.passwordHash = payload.password ? await bcrypt.hash(payload.password, env.bcryptSaltRounds) : undefined;
    url.isPasswordProtected = Boolean(payload.password);
  }
  await url.save();
  return url;
}

export async function deleteUrl(user, id) {
  const url = await getManagedUrl(user, id);
  await url.deleteOne();
}

export function publicUrlPayload(url) {
  return {
    ...url.toJSON(),
    shortUrl: `${env.shortUrlBase}/${url.shortCode}`,
    qrValue: `${env.shortUrlBase}/${url.shortCode}`
  };
}
