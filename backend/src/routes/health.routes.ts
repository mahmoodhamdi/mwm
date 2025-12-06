/**
 * Health Check Routes
 * مسارات التحقق من الصحة
 */

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config';

const router = Router();

/**
 * Health check response interface
 * واجهة استجابة التحقق من الصحة
 */
interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      name: string;
    };
    cache: {
      status: 'connected' | 'disconnected';
      name: string;
    };
  };
}

/**
 * @route GET /api/v1/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', async (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redisStatus = redis.status === 'ready' ? 'connected' : 'disconnected';

  const health: HealthStatus = {
    status: dbStatus === 'connected' && redisStatus === 'connected' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: {
        status: dbStatus,
        name: 'MongoDB',
      },
      cache: {
        status: redisStatus,
        name: 'Redis',
      },
    },
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    success: health.status === 'healthy',
    data: health,
  });
});

/**
 * @route GET /api/v1/health/live
 * @desc Liveness probe (is the app running?)
 * @access Public
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'alive',
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * @route GET /api/v1/health/ready
 * @desc Readiness probe (is the app ready to receive traffic?)
 * @access Public
 */
router.get('/ready', async (_req: Request, res: Response) => {
  const dbReady = mongoose.connection.readyState === 1;
  const redisReady = redis.status === 'ready';
  const isReady = dbReady && redisReady;

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    data: {
      status: isReady ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbReady,
        cache: redisReady,
      },
    },
  });
});

export default router;
