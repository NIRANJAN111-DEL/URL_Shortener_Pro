import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { publicStats, redirect } from './controllers/urlController.js';
import { apiLimiter, redirectLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { analyticsRoutes } from './routes/analyticsRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { urlRoutes } from './routes/urlRoutes.js';

export const app = express();

app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'form-action': null,
      },
    },
  })
);
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.text({ type: 'text/csv', limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ success: true, service: 'LinkFlow Pro API' }));
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/public/stats/:shortCode', publicStats);
app.get('/:shortCode', redirectLimiter, redirect);

app.use(notFound);
app.use(errorHandler);
