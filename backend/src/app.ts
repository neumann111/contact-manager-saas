import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';

// Routes
import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true })); 
app.use(mongoSanitize()); 
app.use(hpp()); 

app.use(compression()); 
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev')); 

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running optimally' });
});

// API Routes Mounted
app.use('/api/v1/auth', authRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;