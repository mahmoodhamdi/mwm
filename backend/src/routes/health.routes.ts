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
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, unhealthy]
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 *                     version:
 *                       type: string
 *                     services:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             name:
 *                               type: string
 *                         cache:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                             name:
 *                               type: string
 *       503:
 *         description: System is unhealthy
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
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Kubernetes liveness probe - is the app running?
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: alive
 *                     timestamp:
 *                       type: string
 *                       format: date-time
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
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Kubernetes readiness probe - is the app ready to receive traffic?
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ready
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     checks:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: boolean
 *                         cache:
 *                           type: boolean
 *       503:
 *         description: Application is not ready
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
