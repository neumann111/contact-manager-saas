import winston from 'winston';
import { env } from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// 1. Console Format: Pretty, colorized, and human-readable for local dev
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    // If it's an error with a stack trace, print the stack. Otherwise, print the message.
    const logMessage = stack || message;
    const metaString = Object.keys(meta).length ? `\nMeta: ${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${logMessage}${metaString}`;
  })
);

// 2. File Format: Machine-readable JSON for production log aggregators
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }), // Critical: Ensures errors aren't stripped of their stack traces
  json()
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  // Inject default metadata into every single log
  defaultMeta: { service: 'contact-manager-api', env: env.NODE_ENV },
  format: combine(
    errors({ stack: true }), 
    timestamp()
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: fileFormat 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: fileFormat
    }),
  ],
  // Automatically catch and log unhandled Node.js exceptions and promise rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log', format: fileFormat })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log', format: fileFormat })
  ]
});