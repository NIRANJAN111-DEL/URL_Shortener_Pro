import { analyticsForUrl } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsForUrl(req.user, req.params.id);
  res.json({ success: true, data });
});
