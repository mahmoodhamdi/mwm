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
import crypto from 'crypto';

import swaggerUi from 'swagger-ui-express';
import { env, morganStream } from './config';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { csrfTokenGenerator, CSRF_COOKIE_NAME } from './middlewares/csrf';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import settingsRouter from './routes/settings.routes';
import contentRouter from './routes/content.routes';
import translationRouter from './routes/translation.routes';
import menuRouter from './routes/menu.routes';
import serviceRouter from './routes/service.routes';
import projectRouter from './routes/project.routes';
import teamRouter from './routes/team.routes';
import contactRouter from './routes/contact.routes';
import blogRouter from './routes/blog.routes';
import careersRouter from './routes/careers.routes';
import newsletterRouter from './routes/newsletter.routes';
import notificationRouter from './routes/notification.routes';
import dashboardRouter from './routes/dashboard.routes';
import activityRouter from './routes/activity.routes';
import usersRouter from './routes/users.routes';
import uploadRouter from './routes/upload.routes';

/**
 * Create Express application
 * إنشاء تطبيق Express
 */
export function createApp(): Express {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Request ID middleware for request tracking
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  });

  // Security middleware with HSTS configuration
  app.use(
    helmet({
      // Enable HSTS in production
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      // Content Security Policy
      contentSecurityPolicy: env.nodeEnv === 'production',
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: env.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'X-CSRF-Token'],
      exposedHeaders: ['X-CSRF-Token'],
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

  // CSRF token generator (generates token for all requests)
  app.use(csrfTokenGenerator);

  // CSRF token endpoint - returns the current CSRF token
  app.get('/api/v1/csrf-token', (req, res) => {
    res.json({
      success: true,
      data: {
        csrfToken: req.cookies?.[CSRF_COOKIE_NAME] || req.csrfToken,
      },
    });
  });

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
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/settings', settingsRouter);
  app.use('/api/v1/content', contentRouter);
  app.use('/api/v1/translations', translationRouter);
  app.use('/api/v1/menus', menuRouter);
  app.use('/api/v1/services', serviceRouter);
  app.use('/api/v1/projects', projectRouter);
  app.use('/api/v1/team', teamRouter);
  app.use('/api/v1/contact', contactRouter);
  app.use('/api/v1/blog', blogRouter);
  app.use('/api/v1/careers', careersRouter);
  app.use('/api/v1/newsletter', newsletterRouter);
  app.use('/api/v1/notifications', notificationRouter);
  app.use('/api/v1/dashboard', dashboardRouter);
  app.use('/api/v1/activity', activityRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/upload', uploadRouter);

  // Swagger documentation
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'MWM API Documentation',
    })
  );

  // Swagger JSON
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
