/**
 * Server Entry Point
 * نقطة دخول الخادم
 */

import { createServer } from 'http';
import { createApp } from './app';
import {
  env,
  logger,
  connectDatabase,
  connectRedis,
  initializeFirebase,
  initializeSocket,
} from './config';

/**
 * Start the server
 * بدء الخادم
 */
async function startServer(): Promise<void> {
  try {
    // Connect to databases
    logger.info('🔌 Connecting to databases...');
    await connectDatabase();
    await connectRedis();

    // Initialize Firebase for push notifications
    logger.info('🔔 Initializing Firebase...');
    initializeFirebase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    logger.info('🔌 Initializing Socket.io...');
    initializeSocket(httpServer);

    // Start HTTP server
    const server = httpServer.listen(env.port, () => {
      logger.info(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 MWM API Server Started Successfully!          ║
║                                                    ║
║   Environment: ${env.nodeEnv.padEnd(33)}║
║   Port: ${String(env.port).padEnd(40)}║
║   Health: http://localhost:${env.port}/api/v1/health   ║
║                                                    ║
╚════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection:', reason);
      // In production, you might want to exit and let the process manager restart
      if (env.isProd) {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
