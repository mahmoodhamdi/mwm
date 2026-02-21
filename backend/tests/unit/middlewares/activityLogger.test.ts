/**
 * Activity Logger Middleware Tests
 * اختبارات برمجيات تسجيل النشاط
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Request, Response, NextFunction } from 'express';
import { logActivity, logLogin, logLogout } from '../../../src/middlewares/activityLogger';
import { ActivityLog } from '../../../src/models';
import { logger } from '../../../src/config';

// Mock dependencies
jest.mock('../../../src/models/ActivityLog');
jest.mock('../../../src/config/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('Activity Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let originalJson: jest.Mock;

  beforeEach(() => {
    originalJson = jest.fn();
    mockRequest = {
      params: {},
      path: '/api/test',
      method: 'POST',
      ip: '192.168.1.1',
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
      socket: {
        remoteAddress: '192.168.1.1',
      } as any,
    };

    mockResponse = {
      statusCode: 200,
      json: originalJson,
    };

    mockNext = jest.fn();

    // Mock ActivityLog.log
    (ActivityLog.log as jest.Mock) = jest.fn().mockResolvedValue({});

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('logActivity', () => {
    it('should log activity on successful response', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;

      const middleware = logActivity({
        action: 'create',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith();

      // Call the overridden json method
      const responseData = {
        data: {
          _id: '507f1f77bcf86cd799439012',
          title: { en: 'Test Project', ar: 'مشروع تجريبي' },
        },
      };

      await (mockResponse.json as Function)(responseData);

      // Wait for async ActivityLog.log call
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith({
        user: mockUser._id,
        action: 'create',
        resource: 'project',
        resourceId: '507f1f77bcf86cd799439012',
        resourceTitle: 'Test Project',
        details: {
          method: 'POST',
          path: '/api/test',
        },
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
    });

    it('should extract resource ID from custom getter', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;
      mockRequest.params = { id: 'custom-id' };

      const middleware = logActivity({
        action: 'update',
        resource: 'service',
        getResourceId: (req) => req.params.id,
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: 'custom-id',
        })
      );
    });

    it('should extract resource title from custom getter', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;

      const middleware = logActivity({
        action: 'delete',
        resource: 'blog',
        getResourceTitle: () => 'Custom Blog Title',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceTitle: 'Custom Blog Title',
        })
      );
    });

    it('should include custom details from getter', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;

      const middleware = logActivity({
        action: 'publish',
        resource: 'post',
        getDetails: () => ({ status: 'published', category: 'tech' }),
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith(
        expect.objectContaining({
          details: {
            method: 'POST',
            path: '/api/test',
            status: 'published',
            category: 'tech',
          },
        })
      );
    });

    it('should not log when user is not authenticated', async () => {
      const middleware = logActivity({
        action: 'create',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).not.toHaveBeenCalled();
    });

    it('should not log on error responses (status >= 400)', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;
      mockResponse.statusCode = 404;

      const middleware = logActivity({
        action: 'view',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { error: 'Not found' };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).not.toHaveBeenCalled();
    });

    it('should extract title from name field if title is missing', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;

      const middleware = logActivity({
        action: 'create',
        resource: 'service',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = {
        data: {
          _id: '507f1f77bcf86cd799439012',
          name: { en: 'Test Service', ar: 'خدمة تجريبية' },
        },
      };

      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceTitle: 'Test Service',
        })
      );
    });

    it('should handle ActivityLog.log errors gracefully', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;

      const logError = new Error('Database connection failed');
      (ActivityLog.log as jest.Mock).mockRejectedValue(logError);

      const middleware = logActivity({
        action: 'create',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(logger.error).toHaveBeenCalledWith('Failed to log activity:', logError);
    });

    it('should use socket.remoteAddress when req.ip is unavailable', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;
      mockRequest.ip = undefined;

      const middleware = logActivity({
        action: 'create',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      await (mockResponse.json as Function)(responseData);
      await new Promise(resolve => setImmediate(resolve));

      expect(ActivityLog.log).toHaveBeenCalledWith(
        expect.objectContaining({
          ip: '192.168.1.1',
        })
      );
    });

    it('should call original json function and return result', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011' };
      mockRequest.user = mockUser as any;
      const expectedResult = { success: true };
      originalJson.mockReturnValue(expectedResult);

      const middleware = logActivity({
        action: 'create',
        resource: 'project',
      });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      const responseData = { data: {} };
      const result = await (mockResponse.json as Function)(responseData);

      expect(originalJson).toHaveBeenCalledWith(responseData);
      expect(result).toBe(expectedResult);
    });
  });

  describe('logLogin', () => {
    it('should log login activity successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const ip = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';

      await logLogin(userId, ip, userAgent);

      expect(ActivityLog.log).toHaveBeenCalledWith({
        user: userId,
        action: 'login',
        resource: 'auth',
        details: {
          timestamp: expect.any(String),
        },
        ip,
        userAgent,
      });
    });

    it('should handle errors when logging login fails', async () => {
      const logError = new Error('Log failed');
      (ActivityLog.log as jest.Mock).mockRejectedValue(logError);

      const userId = '507f1f77bcf86cd799439011';

      await logLogin(userId);

      expect(logger.error).toHaveBeenCalledWith('Failed to log login activity:', logError);
    });

    it('should log login without optional parameters', async () => {
      const userId = '507f1f77bcf86cd799439011';

      await logLogin(userId);

      expect(ActivityLog.log).toHaveBeenCalledWith({
        user: userId,
        action: 'login',
        resource: 'auth',
        details: {
          timestamp: expect.any(String),
        },
        ip: undefined,
        userAgent: undefined,
      });
    });
  });

  describe('logLogout', () => {
    it('should log logout activity successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const ip = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';

      await logLogout(userId, ip, userAgent);

      expect(ActivityLog.log).toHaveBeenCalledWith({
        user: userId,
        action: 'logout',
        resource: 'auth',
        details: {
          timestamp: expect.any(String),
        },
        ip,
        userAgent,
      });
    });

    it('should handle errors when logging logout fails', async () => {
      const logError = new Error('Log failed');
      (ActivityLog.log as jest.Mock).mockRejectedValue(logError);

      const userId = '507f1f77bcf86cd799439011';

      await logLogout(userId);

      expect(logger.error).toHaveBeenCalledWith('Failed to log logout activity:', logError);
    });

    it('should log logout without optional parameters', async () => {
      const userId = '507f1f77bcf86cd799439011';

      await logLogout(userId);

      expect(ActivityLog.log).toHaveBeenCalledWith({
        user: userId,
        action: 'logout',
        resource: 'auth',
        details: {
          timestamp: expect.any(String),
        },
        ip: undefined,
        userAgent: undefined,
      });
    });
  });
});
