import { UAParser } from 'ua-parser-js';
import { Visit } from '../models/Visit.js';
import { Url } from '../models/Url.js';
import { AppError } from '../utils/AppError.js';
import { getClientIp } from '../utils/http.js';

const botPattern = /bot|crawler|spider|crawling|preview|facebookexternalhit|slackbot|discordbot|whatsapp|telegram/i;

function inferLocation(req) {
  return {
    country: req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || 'Unknown',
    city: req.headers['x-vercel-ip-city'] || 'Unknown'
  };
}

export function detectBot(req) {
  const ua = req.headers['user-agent'] || '';
  const isBot = botPattern.test(ua);
  const fraudScore = isBot ? 75 : 5;
  return { isBot, fraudScore, reason: isBot ? 'Known bot user agent' : 'Human-like request' };
}

export async function recordVisit(req, url) {
  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();
  const location = inferLocation(req);
  const bot = detectBot(req);

  const visit = await Visit.create({
    url: url._id,
    owner: url.owner,
    shortCode: url.shortCode,
    browser: ua.browser.name || 'Unknown',
    device: ua.device.type || 'Desktop',
    os: ua.os.name || 'Unknown',
    country: location.country,
    city: location.city,
    referrer: req.get('referer') || 'Direct',
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
    isBot: bot.isBot,
    fraudScore: bot.fraudScore,
    reason: bot.reason
  });

  await Url.updateOne(
    { _id: url._id },
    {
      $inc: { totalClicks: 1, [bot.isBot ? 'botClicks' : 'humanClicks']: 1 },
      $set: { lastVisitedAt: visit.visitedAt }
    }
  );

  return visit;
}

function groupCount(visits, field) {
  return Object.entries(
    visits.reduce((acc, visit) => {
      const key = visit[field] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

export async function analyticsForShortCode(shortCode, publicOnly = false) {
  const url = await Url.findOne({ shortCode });
  if (!url) throw new AppError('URL not found', 404);
  if (publicOnly && !url.isPublicStatsEnabled) throw new AppError('Public stats are disabled', 403);

  const visits = await Visit.find({ url: url._id }).sort({ visitedAt: -1 }).limit(1000);
  const daily = await Visit.aggregate([
    { $match: { url: url._id } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } }, clicks: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', clicks: 1, _id: 0 } }
  ]);

  return {
    url,
    totals: {
      totalClicks: url.totalClicks,
      humanClicks: url.humanClicks,
      botClicks: url.botClicks,
      lastVisitedAt: url.lastVisitedAt
    },
    topCountries: groupCount(visits, 'country').sort((a, b) => b.value - a.value).slice(0, 10),
    devices: groupCount(visits, 'device'),
    browsers: groupCount(visits, 'browser'),
    daily,
    recentVisits: visits.slice(0, 25)
  };
}

export async function analyticsForUrl(user, id) {
  const url = await Url.findById(id);
  if (!url) throw new AppError('URL not found', 404);
  const managesTeam = user.role === 'manager' && String(url.teamId || '') === String(user.teamId || user._id);
  if (user.role !== 'admin' && !managesTeam && String(url.owner) !== String(user._id)) {
    throw new AppError('Forbidden', 403);
  }
  return analyticsForShortCode(url.shortCode);
}
