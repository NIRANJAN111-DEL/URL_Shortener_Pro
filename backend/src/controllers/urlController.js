import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';
import { Url } from '../models/Url.js';
import { Visit } from '../models/Visit.js';
import { analyticsForShortCode, recordVisit } from '../services/analyticsService.js';
import { checkUrlHealth } from '../services/healthService.js';
import { createShortUrl, deleteUrl, getManagedUrl, listUrls, publicUrlPayload, updateUrl } from '../services/urlService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toCsv } from '../utils/csv.js';

export const createUrl = asyncHandler(async (req, res) => {
  const url = await createShortUrl(req.user, req.body);
  res.status(201).json({ success: true, data: publicUrlPayload(url) });
});

export const getUrls = asyncHandler(async (req, res) => {
  const result = await listUrls(req.user, req.query);
  res.json({ success: true, data: { ...result, items: result.items.map(publicUrlPayload) } });
});

export const getUrl = asyncHandler(async (req, res) => {
  const url = await getManagedUrl(req.user, req.params.id);
  res.json({ success: true, data: publicUrlPayload(url) });
});

export const patchUrl = asyncHandler(async (req, res) => {
  const url = await updateUrl(req.user, req.params.id, req.body);
  res.json({ success: true, data: publicUrlPayload(url) });
});

export const removeUrl = asyncHandler(async (req, res) => {
  await deleteUrl(req.user, req.params.id);
  res.status(204).send();
});

export const redirect = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode }).select('+passwordHash');
  if (!url || !url.isActive) throw new AppError('Link not found', 404);
  if (url.expiresAt && url.expiresAt < new Date()) return res.status(410).send('This link has expired');
  
  if (url.isPasswordProtected && !(await bcrypt.compare(req.query.password || '', url.passwordHash))) {
    const errorMsg = req.query.password ? 'Incorrect password. Please try again.' : '';
    res.setHeader('Content-Type', 'text/html');
    return res.status(401).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Required - LinkFlow Pro</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            width: 100%;
            max-width: 380px;
            padding: 2rem;
            text-align: center;
          }
          .icon-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 3.5rem;
            height: 3.5rem;
            background-color: #f0fdfa;
            color: #14b8a6;
            border-radius: 1rem;
            margin-bottom: 1.25rem;
          }
          h1 {
            font-size: 1.25rem;
            font-weight: 800;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 0.85rem;
            color: #64748b;
            margin: 0 0 1.5rem 0;
            line-height: 1.5;
          }
          .input-group {
            margin-bottom: 1.25rem;
            text-align: left;
          }
          label {
            display: block;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 0.5rem;
          }
          input {
            width: 100%;
            box-sizing: border-box;
            height: 2.75rem;
            border-radius: 0.5rem;
            border: 1px solid #cbd5e1;
            background-color: #ffffff;
            padding: 0 1rem;
            font-family: inherit;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
          }
          input:focus {
            border-color: #14b8a6;
            box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 2.75rem;
            background-color: #0f172a;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background-color: #1e293b;
          }
          .error-msg {
            color: #ef4444;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 0.5rem;
          }
          .footer-logo {
            margin-top: 2rem;
            font-size: 0.7rem;
            font-weight: 800;
            color: #cbd5e1;
            letter-spacing: 0.1em;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1>Protected Link</h1>
          <p>This link is password protected. Enter the password below to access the destination URL.</p>
          <form method="GET" action="/${url.shortCode}">
            <div class="input-group">
              <label for="password">Enter Password</label>
              <input type="password" id="password" name="password" placeholder="••••••••" required autofocus>
              ${errorMsg ? `<div class="error-msg">${errorMsg}</div>` : ''}
            </div>
            <button type="submit" class="btn">Access Link</button>
          </form>
          <div class="footer-logo">LINKFLOW PRO</div>
        </div>
      </body>
      </html>
    `);
  }

  await recordVisit(req, url);
  res.redirect(url.originalUrl);
});

export const bulkCreate = asyncHandler(async (req, res) => {
  const records = parse(req.body.csv || req.body || '', { columns: true, skip_empty_lines: true, trim: true });
  const created = [];
  for (const record of records) {
    created.push(await createShortUrl(req.user, {
      originalUrl: record.originalUrl || record.url,
      customAlias: record.customAlias || record.alias || undefined,
      expiresAt: record.expiresAt || undefined
    }));
  }
  res.status(201).json({ success: true, data: created.map(publicUrlPayload) });
});

export const checkHealth = asyncHandler(async (req, res) => {
  const url = await getManagedUrl(req.user, req.params.id);
  url.health = await checkUrlHealth(url);
  await url.save();
  res.json({ success: true, data: publicUrlPayload(url) });
});

export const publicStats = asyncHandler(async (req, res) => {
  const data = await analyticsForShortCode(req.params.shortCode, true);
  res.json({ success: true, data });
});

export const exportAnalytics = asyncHandler(async (req, res) => {
  const url = await getManagedUrl(req.user, req.params.id);
  const visits = await Visit.find({ url: url._id }).sort({ visitedAt: -1 });
  const rows = visits.map((v) => ({
    visitedAt: v.visitedAt,
    browser: v.browser,
    device: v.device,
    os: v.os,
    country: v.country,
    city: v.city,
    referrer: v.referrer,
    isBot: v.isBot,
    fraudScore: v.fraudScore
  }));
  res.header('Content-Type', 'text/csv');
  res.attachment(`${url.shortCode}-analytics.csv`);
  res.send(toCsv(rows));
});
