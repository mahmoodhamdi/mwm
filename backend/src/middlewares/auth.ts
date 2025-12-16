/**
 * Auth Middleware
 * وسيط المصادقة
 */

import { Request, Response, NextFunction } from 'express';
import { User, IUser, UserRole, UserRoles } from '../models';
import { authService } from '../services';
import { Errors } from '../utils/ApiError';
import { asyncHandler } from './asyncHandler';
import { COOKIE_NAMES } from '../utils/cookies';

// Extend Express Request type to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Role permissions mapping
 * تعيين صلاحيات الأدوار
 */
export const rolePermissions: Record<UserRole, string[]> = {
  [UserRoles.SUPER_ADMIN]: ['*'],
  [UserRoles.ADMIN]: [
    'users:read',
    'users:create',
    'users:update',
    'projects:*',
    'services:*',
    'team:*',
    'blog:*',
    'messages:*',
    'settings:read',
    'settings:update',
    'analytics:read',
  ],
  [UserRoles.EDITOR]: [
    'projects:read',
    'projects:create',
    'projects:update',
    'services:read',
    'services:create',
    'services:update',
    'team:read',
    'team:create',
    'team:update',
    'blog:*',
    'messages:read',
    'messages:update',
  ],
  [UserRoles.AUTHOR]: ['blog:read', 'blog:create', 'blog:update'],
  [UserRoles.VIEWER]: ['projects:read', 'services:read', 'team:read', 'blog:read'],
};

/**
 * Check if user has permission
 * التحقق مما إذا كان المستخدم لديه الصلاحية
 */
function hasPermission(userRole: UserRole, requiredPermissions: string[]): boolean {
  const permissions = rolePermissions[userRole] || [];

  // Super admin has all permissions
  if (permissions.includes('*')) {
    return true;
  }

  // Check each required permission
  return requiredPermissions.every(required => {
    // Direct match
    if (permissions.includes(required)) {
      return true;
    }

    // Wildcard match (e.g., 'projects:*' matches 'projects:read')
    const [resource] = required.split(':');
    if (permissions.includes(`${resource}:*`)) {
      return true;
    }

    return false;
  });
}

/**
 * Authenticate middleware
 * وسيط التحقق من الهوية
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Get token from cookies first, then fall back to Authorization header
    let token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];

    // Fall back to Authorization header for backward compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw Errors.UNAUTHORIZED('No token provided | لم يتم توفير توكن');
    }

    // Check if token is blacklisted
    const isBlacklisted = await authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw Errors.INVALID_TOKEN();
    }

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw Errors.UNAUTHORIZED('User not found | المستخدم غير موجود');
    }

    if (!user.isActive) {
      throw Errors.UNAUTHORIZED('Account is disabled | الحساب معطل');
    }

    // Check if password was changed after token was issued
    // Use actual iat from token, fallback to current time if missing
    const tokenIssuedAt = decoded.iat ?? Math.floor(Date.now() / 1000);
    if (user.changedPasswordAfter(tokenIssuedAt)) {
      throw Errors.TOKEN_EXPIRED();
    }

    // Attach user to request
    req.user = user;
    next();
  }
);

/**
 * Authorize middleware - check permissions
 * وسيط التفويض - التحقق من الصلاحيات
 */
export const authorize = (...permissions: string[]) => {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw Errors.UNAUTHORIZED();
    }

    const userRole = req.user.role as UserRole;

    // Check role permissions
    if (!hasPermission(userRole, permissions)) {
      // Check custom permissions
      const customPermissions = req.user.customPermissions || [];
      const hasCustomPermission = permissions.every(p => customPermissions.includes(p));

      if (!hasCustomPermission) {
        throw Errors.INSUFFICIENT_PERMISSIONS();
      }
    }

    next();
  });
};

/**
 * Optional authenticate - doesn't fail if no token
 * تحقق اختياري - لا يفشل إذا لم يكن هناك توكن
 */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Get token from cookies first, then fall back to Authorization header
    let token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];

    // Fall back to Authorization header for backward compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return next();
    }

    try {
      // Check if token is blacklisted
      const isBlacklisted = await authService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return next();
      }

      // Verify token
      const decoded = authService.verifyAccessToken(token);

      // Get user
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // Token is invalid, continue without user
    }

    next();
  }
);

/**
 * Require email verification
 * يتطلب التحقق من البريد الإلكتروني
 */
export const requireEmailVerified = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw Errors.UNAUTHORIZED();
    }

    if (!req.user.isEmailVerified) {
      throw Errors.EMAIL_NOT_VERIFIED();
    }

    next();
  }
);

export const authMiddleware = {
  authenticate,
  authorize,
  optionalAuth,
  requireEmailVerified,
  rolePermissions,
};

export default authMiddleware;
