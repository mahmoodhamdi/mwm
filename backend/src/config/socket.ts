/**
 * Socket.io Configuration
 * تكوين Socket.io
 */

import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env, logger } from './index';
import { authService, TokenPayload } from '../services/auth.service';
import { User } from '../models';

// Extended socket interface with user data
export interface AuthenticatedSocket extends Socket {
  user?: TokenPayload;
  userId?: string;
}

// Socket.io server instance
let io: Server;

/**
 * Initialize Socket.io server
 * تهيئة خادم Socket.io
 */
export function initializeSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.cors.origin === '*' ? true : env.cors.origin?.split(','),
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Check if token is blacklisted
      const isBlacklisted = await authService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return next(new Error('Token has been revoked'));
      }

      // Verify token
      const decoded = authService.verifyAccessToken(token);

      // Verify user still exists and is active
      const user = await User.findById(decoded.userId).select('_id email role isActive').lean();
      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      // Attach user info to socket
      socket.user = decoded;
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    logger.info(`Socket connected: ${socket.id} (User: ${userId})`);

    // Join user's private room
    socket.join(`user:${userId}`);

    // Join admin room if user is admin
    if (socket.user?.role && ['admin', 'super_admin'].includes(socket.user.role)) {
      socket.join('admins');
    }

    // Handle notification events
    socket.on('notification:read', async (data: { id: string }) => {
      try {
        // Emit acknowledgment
        socket.emit('notification:read:ack', { id: data.id, success: true });
      } catch (error) {
        socket.emit('notification:read:ack', { id: data.id, success: false });
      }
    });

    socket.on('notification:read-all', async () => {
      try {
        socket.emit('notification:read-all:ack', { success: true });
      } catch (error) {
        socket.emit('notification:read-all:ack', { success: false });
      }
    });

    // Disconnect handler
    socket.on('disconnect', reason => {
      logger.info(`Socket disconnected: ${socket.id} (User: ${userId}) - Reason: ${reason}`);
    });

    // Error handler
    socket.on('error', error => {
      logger.error(`Socket error: ${socket.id} (User: ${userId})`, error);
    });
  });

  logger.info('Socket.io server initialized');
  return io;
}

/**
 * Get Socket.io server instance
 * الحصول على نسخة خادم Socket.io
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
}

/**
 * Emit to specific user
 * إرسال إلى مستخدم محدد
 */
export function emitToUser(userId: string, event: string, data: unknown): void {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

/**
 * Emit to all admins
 * إرسال إلى جميع المشرفين
 */
export function emitToAdmins(event: string, data: unknown): void {
  if (!io) return;
  io.to('admins').emit(event, data);
}

/**
 * Emit to all connected clients
 * إرسال إلى جميع العملاء المتصلين
 */
export function broadcast(event: string, data: unknown): void {
  if (!io) return;
  io.emit(event, data);
}

/**
 * Get connected sockets count
 * الحصول على عدد المقابس المتصلة
 */
export async function getConnectedCount(): Promise<number> {
  if (!io) return 0;
  const sockets = await io.fetchSockets();
  return sockets.length;
}

/**
 * Check if user is online
 * التحقق مما إذا كان المستخدم متصل
 */
export async function isUserOnline(userId: string): Promise<boolean> {
  if (!io) return false;
  const sockets = await io.in(`user:${userId}`).fetchSockets();
  return sockets.length > 0;
}
