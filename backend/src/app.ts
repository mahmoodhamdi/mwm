/**
 * Express Application Setup
 * إعداد تطبيق Express
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { env, logger, morganStream } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import healthRouter from './routes/health.routes';
// Import other routes as they are created
// import authRouter from './routes/auth.routes';
// import projectsRouter from './routes/projects.routes';

/**
 * Create Express application
 * إنشاء تطبيق Express
 */
export function createApp(): Express {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // NoSQL injection sanitization
  app.use(mongoSanitize());

  // HTTP Parameter Pollution protection
  app.use(hpp());

  // Request logging
  if (!env.isTest) {
    app.use(
      morgan('short', {
        stream: morganStream,
        skip: req => req.url === '/api/v1/health',
      })
    );
  }

  // API Routes
  app.use('/api/v1/health', healthRouter);
  // app.use('/api/v1/auth', authRouter);
  // app.use('/api/v1/projects', projectsRouter);
  // Add more routes as they are created

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
