import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

// Import middleware
import { authenticate, optionalAuth } from './middleware/auth';
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Import routes
import authRouter from './routes/auth';
import readmesRouter from './routes/readmes';
import communityRouter from './routes/community';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS
app.use(morgan('combined')); // Request logging
app.use(express.json({ limit: '10mb' })); // JSON parsing
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL-encoded parsing
app.use(generalLimiter); // General rate limiting

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: 'GitHub README Generator API is running 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes

// Optional authentication middleware (available to all routes)
app.use('/api/', optionalAuth);

// Auth routes (public)
app.use('/api/auth', authRouter);

// README routes
app.use('/api/readmes', readmesRouter);

// Community routes
app.use('/api/community', communityRouter);

// User routes
app.use('/api/users', usersRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    statusCode: 404,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GitHub README Generator API`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n⚙️  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]', error);
  process.exit(1);
});

export default app;
