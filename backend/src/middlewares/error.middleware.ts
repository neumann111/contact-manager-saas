import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // 1. Gather context about the request that caused the crash
  const reqContext = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    // Safely log the body, ensuring we NEVER log user passwords to a file
    body: req.body?.password ? { ...req.body, password: '[REDACTED]' } : req.body,
    userId: req.user ? req.user._id : 'Unauthenticated',
  };

  // 2. Log strategically based on severity
  if (statusCode >= 500) {
    // Satisfy TS with err.message, but pass the stack in the metadata!
    logger.error(err.message, { ...reqContext, stack: err.stack });
  } else {
    // 4xx errors are operational, log them as warnings to keep an eye on bad traffic
    logger.warn(`[${statusCode}] ${message}`, reqContext);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};