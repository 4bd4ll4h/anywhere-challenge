import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, errorLogger } from './middleware/logging';
import { apiLimiter } from './middleware/rateLimiter';
import Logger from './utils/logger';
import authRoutes from './routes/auth';
import announcementRoutes from './routes/announcements';
import quizRoutes from './routes/quizzes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());

// Rate limiting
app.use('/api/', apiLimiter);

// Custom request logging (replaces morgan)
app.use(requestLogger);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  Logger.debug('Health check endpoint accessed');
  res.status(200).json({ 
    status: 'OK', 
    message: 'Anyware Software Challenge API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/quizzes', quizRoutes);

// 404 handler
app.use('*', (req, res) => {
  Logger.warn(`404 - Route not found: ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    Logger.info(`🚀 Server running on port ${PORT}`);
    Logger.info(`📊 Health check: http://localhost:${PORT}/health`);
    Logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
    Logger.info(`🔧 Log Level: ${process.env.LOG_LEVEL || 'info'}`);
    Logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app; 