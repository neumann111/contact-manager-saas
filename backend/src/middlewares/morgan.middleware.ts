import morgan from 'morgan';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// Override the stream method by telling Morgan to use our custom logger.
// The trim() removes the extra newline that Morgan adds by default.
const stream = {
  write: (message: string) => logger.info(message.trim()),
};

// Use the 'dev' format for local development (colorized, compact).
// Use the 'combined' format for production (Apache standard, detailed).
const format = env.NODE_ENV === 'development' ? 'dev' : 'combined';

// Build and export the middleware
export const morganMiddleware = morgan(format, { stream });