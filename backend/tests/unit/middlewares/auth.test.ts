/**
 * Auth Middleware Tests
 * اختبارات برمجيات المصادقة
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, optionalAuth, requireEmailVerified, rolePermissions } from '../../../src/middlewares/auth';
import { authService } from '../../../src/services';
import { User, UserRoles } from '../../../src/models';
import { ApiError } from '../../../src/utils/ApiError';
import { COOKIE_NAMES } from '../../../src/utils/cookies';

// Mock dependencies
jest.mock('../../../src/services/auth.service');
jest.mock('../../../src/models', () => ({
  User: {
    findById: jest.fn(),
  },
  UserRoles: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    VIEWER: 'viewer',
  },
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      headers: {},
      user: undefined,
    };
    mockResponse = {};
    mockNext = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRoles.ADMIN,
      isActive: true,
      isEmailVerified: true,
      changedPasswordAfter: jest.fn(() => false),
    };

    const mockDecoded = {
      userId: '507f1f77bcf86cd799439011',
      iat: Math.floor(Date.now() / 1000),
    };

    it('should authenticate with valid token from cookies', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.isTokenBlacklisted).toHaveBeenCalledWith(token);
      expect(authService.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(User.findById).toHaveBeenCalledWith(mockDecoded.userId);
      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should authenticate with valid token from Authorization header', async () => {
      const token = 'valid-token';
      mockRequest.headers = { authorization: `Bearer ${token}` };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when no token is provided', async () => {
      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should fail when token is blacklisted', async () => {
      const token = 'blacklisted-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(true);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('INVALID_TOKEN');
    });

    it('should fail when token verification fails', async () => {
      const token = 'invalid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should fail when user is not found', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(null);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(401);
      expect(error.message).toContain('User not found');
    });

    it('should fail when user is not active', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(401);
      expect(error.message).toContain('Account is disabled');
    });

    it('should fail when password was changed after token was issued', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      const userWithChangedPassword = {
        ...mockUser,
        changedPasswordAfter: jest.fn(() => true),
      };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(userWithChangedPassword);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('TOKEN_EXPIRED');
    });

    it('should handle missing iat in token payload', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      const decodedWithoutIat = { userId: '507f1f77bcf86cd799439011' };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(decodedWithoutIat);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUser.changedPasswordAfter).toHaveBeenCalledWith(expect.any(Number));
      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('authorize', () => {
    it('should authorize super_admin with any permission', async () => {
      mockRequest.user = {
        role: UserRoles.SUPER_ADMIN,
      } as any;

      const middleware = authorize('projects:delete', 'users:delete');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should authorize admin with matching permission', async () => {
      mockRequest.user = {
        role: UserRoles.ADMIN,
      } as any;

      const middleware = authorize('users:read');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should authorize with wildcard resource permission', async () => {
      mockRequest.user = {
        role: UserRoles.ADMIN,
      } as any;

      const middleware = authorize('projects:read', 'projects:update');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should authorize editor with blog permissions', async () => {
      mockRequest.user = {
        role: UserRoles.EDITOR,
      } as any;

      const middleware = authorize('blog:create', 'blog:update');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when user is not authenticated', async () => {
      const middleware = authorize('users:read');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should fail when user lacks required permissions', async () => {
      mockRequest.user = {
        role: UserRoles.VIEWER,
      } as any;

      const middleware = authorize('users:delete');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('should authorize with custom permissions', async () => {
      mockRequest.user = {
        role: UserRoles.VIEWER,
        customPermissions: ['special:action'],
      } as any;

      const middleware = authorize('special:action');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when custom permissions do not match', async () => {
      mockRequest.user = {
        role: UserRoles.VIEWER,
        customPermissions: ['other:action'],
      } as any;

      const middleware = authorize('special:action');
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });
  });

  describe('optionalAuth', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRoles.ADMIN,
      isActive: true,
      isEmailVerified: true,
    };

    const mockDecoded = {
      userId: '507f1f77bcf86cd799439011',
      iat: Math.floor(Date.now() / 1000),
    };

    it('should attach user when valid token is provided', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when no token is provided', async () => {
      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when token is blacklisted', async () => {
      const token = 'blacklisted-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(true);

      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when token is invalid', async () => {
      const token = 'invalid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when user is not active', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when user is not found', async () => {
      const token = 'valid-token';
      mockRequest.cookies = { [COOKIE_NAMES.ACCESS_TOKEN]: token };

      (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
      (authService.verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);
      (User.findById as jest.Mock).mockResolvedValue(null);

      await optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requireEmailVerified', () => {
    it('should pass when user email is verified', async () => {
      mockRequest.user = {
        isEmailVerified: true,
      } as any;

      await requireEmailVerified(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail when user is not authenticated', async () => {
      await requireEmailVerified(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should fail when user email is not verified', async () => {
      mockRequest.user = {
        isEmailVerified: false,
      } as any;

      await requireEmailVerified(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.code).toBe('EMAIL_NOT_VERIFIED');
    });
  });

  describe('rolePermissions', () => {
    it('should have correct permissions for super_admin', () => {
      expect(rolePermissions[UserRoles.SUPER_ADMIN]).toEqual(['*']);
    });

    it('should have correct permissions for admin', () => {
      expect(rolePermissions[UserRoles.ADMIN]).toContain('users:read');
      expect(rolePermissions[UserRoles.ADMIN]).toContain('projects:*');
      expect(rolePermissions[UserRoles.ADMIN]).toContain('services:*');
    });

    it('should have correct permissions for editor', () => {
      expect(rolePermissions[UserRoles.EDITOR]).toContain('projects:read');
      expect(rolePermissions[UserRoles.EDITOR]).toContain('blog:*');
      expect(rolePermissions[UserRoles.EDITOR]).not.toContain('users:delete');
    });

    it('should have correct permissions for viewer', () => {
      expect(rolePermissions[UserRoles.VIEWER]).toContain('projects:read');
      expect(rolePermissions[UserRoles.VIEWER]).not.toContain('projects:create');
    });
  });
});
