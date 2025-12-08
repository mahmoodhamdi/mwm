/**
 * Activity Logger Middleware
 * ميدل وير تسجيل النشاط
 */

import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models';
import { logger } from '../config';

type ActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'view'
  | 'export'
  | 'import'
  | 'publish'
  | 'unpublish';

interface LogActivityOptions {
  action: ActionType;
  resource: string;
  getResourceId?: (req: Request, res: Response) => string | undefined;
  getResourceTitle?: (req: Request, res: Response) => string | undefined;
  getDetails?: (req: Request, res: Response) => Record<string, unknown> | undefined;
}

/**
 * Create activity logger middleware
 * إنشاء ميدل وير تسجيل النشاط
 */
export function logActivity(options: LogActivityOptions) {
  const { action, resource, getResourceId, getResourceTitle, getDetails } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json function
    const originalJson = res.json.bind(res);

    // Override json to intercept response
    res.json = function (body: unknown) {
      // Only log on successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = (req as Request & { user?: { _id: string } }).user;

        if (user) {
          // Extract resource ID from response or params
          let resourceId: string | undefined;
          if (getResourceId) {
            resourceId = getResourceId(req, res);
          } else if (body && typeof body === 'object') {
            const data = (body as { data?: { _id?: string } }).data;
            resourceId = data?._id || (req.params.id as string);
          }

          // Extract resource title
          let resourceTitle: string | undefined;
          if (getResourceTitle) {
            resourceTitle = getResourceTitle(req, res);
          } else if (body && typeof body === 'object') {
            const data = (body as { data?: { title?: { en?: string }; name?: { en?: string } } })
              .data;
            resourceTitle = data?.title?.en || data?.name?.en;
          }

          // Get additional details
          const details = getDetails ? getDetails(req, res) : undefined;

          // Log activity asynchronously (don't wait)
          ActivityLog.log({
            user: user._id as unknown as import('mongoose').Types.ObjectId,
            action,
            resource,
            resourceId: resourceId as unknown as import('mongoose').Types.ObjectId,
            resourceTitle,
            details: {
              method: req.method,
              path: req.path,
              ...details,
            },
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
          }).catch(err => {
            logger.error('Failed to log activity:', err);
          });
        }
      }

      return originalJson(body);
    };

    next();
  };
}

/**
 * Log login activity
 * تسجيل نشاط تسجيل الدخول
 */
export async function logLogin(userId: string, ip?: string, userAgent?: string): Promise<void> {
  try {
    await ActivityLog.log({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      action: 'login',
      resource: 'auth',
      details: {
        timestamp: new Date().toISOString(),
      },
      ip,
      userAgent,
    });
  } catch (err) {
    logger.error('Failed to log login activity:', err);
  }
}

/**
 * Log logout activity
 * تسجيل نشاط تسجيل الخروج
 */
export async function logLogout(userId: string, ip?: string, userAgent?: string): Promise<void> {
  try {
    await ActivityLog.log({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      action: 'logout',
      resource: 'auth',
      details: {
        timestamp: new Date().toISOString(),
      },
      ip,
      userAgent,
    });
  } catch (err) {
    logger.error('Failed to log logout activity:', err);
  }
}

export default {
  logActivity,
  logLogin,
  logLogout,
};
