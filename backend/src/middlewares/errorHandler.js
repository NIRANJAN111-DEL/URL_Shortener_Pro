import { env } from '../config/env.js';

export function notFound(req, _res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.isOperational ? err.message : 'Something went wrong'
  };

  if (env.nodeEnv !== 'production') {
    payload.error = err.message;
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
