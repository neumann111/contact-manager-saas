import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';

const app: Application = express();

// 1. Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors({ origin: '*', credentials: true })); // Configure CORS
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 2. Standard Middlewares
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev')); // HTTP logging

// 3. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running optimally' });
});

// 4. API Routes (To be added in next phases)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/contacts', contactRoutes);

// 5. 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

export default app;