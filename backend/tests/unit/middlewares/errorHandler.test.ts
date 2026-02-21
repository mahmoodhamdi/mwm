/**
 * Error Handler Middleware Tests
 * اختبارات برمجيات معالجة الأخطاء
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middlewares/errorHandler';
import { ApiError, ERROR_CODES, HTTP_STATUS } from '../../../src/utils/ApiError';
import { logger } from '../../../src/config';

// Mock logger
jest.mock('../../../src/config/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jsonSpy = jest.fn();
    statusSpy = jest.fn(() => ({ json: jsonSpy }));

    mockRequest = {
      path: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      headers: {},
    };

    mockResponse = {
      status: statusSpy,
    };

    mockNext = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('ApiError handling', () => {
    it('should handle ApiError with English locale', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Resource not found',
        true,
        { resource: 'User' }
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Not found',
          details: { resource: 'User' },
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle ApiError with Arabic locale', () => {
      mockRequest.headers = { 'accept-language': 'ar' };
      const error = new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'Unauthorized access'
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'غير مصرح بالوصول',
          details: undefined,
        },
      });
    });

    it('should handle validation error', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
        'Validation failed',
        true,
        ['Email is required', 'Password is too short']
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation error',
          details: ['Email is required', 'Password is too short'],
        },
      });
    });

    it('should handle token expired error', () => {
      mockRequest.headers = { 'accept-language': 'ar' };
      const error = new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_EXPIRED,
        'Token has expired'
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.TOKEN_EXPIRED,
          message: 'انتهت صلاحية الجلسة',
          details: undefined,
        },
      });
    });
  });

  describe('Mongoose ValidationError handling', () => {
    it('should handle Mongoose ValidationError with English locale', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new Error('User validation failed: email: Path `email` is required.') as any;
      error.name = 'ValidationError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation error',
          details: 'User validation failed: email: Path `email` is required.',
        },
      });
    });

    it('should handle Mongoose ValidationError with Arabic locale', () => {
      mockRequest.headers = { 'accept-language': 'ar-SA' };
      const error = new Error('Validation failed') as any;
      error.name = 'ValidationError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'خطأ في البيانات المدخلة',
          details: 'Validation failed',
        },
      });
    });
  });

  describe('MongoServerError handling', () => {
    it('should handle duplicate key error (code 11000) with English', () => {
      mockRequest.headers = { 'accept-language': 'en-US' };
      const error = new Error('E11000 duplicate key error') as any;
      error.name = 'MongoServerError';
      error.code = 11000;

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.ALREADY_EXISTS,
          message: 'An error occurred', // ALREADY_EXISTS is not in errorMessages
        },
      });
    });

    it('should handle duplicate key error with Arabic locale', () => {
      mockRequest.headers = { 'accept-language': 'ar' };
      const error = new Error('E11000 duplicate key error collection') as any;
      error.name = 'MongoServerError';
      error.code = 11000;

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
      expect(jsonSpy.mock.calls[0][0].error.message).toBe('حدث خطأ'); // ALREADY_EXISTS is not in errorMessages
    });
  });

  describe('JWT error handling', () => {
    it('should handle JsonWebTokenError', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new Error('jwt malformed') as any;
      error.name = 'JsonWebTokenError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_TOKEN,
          message: 'Unauthorized access',
        },
      });
    });

    it('should handle TokenExpiredError', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new Error('jwt expired') as any;
      error.name = 'TokenExpiredError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.TOKEN_EXPIRED,
          message: 'Session expired',
        },
      });
    });

    it('should handle TokenExpiredError with Arabic locale', () => {
      mockRequest.headers = { 'accept-language': 'ar' };
      const error = new Error('jwt expired') as any;
      error.name = 'TokenExpiredError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(jsonSpy.mock.calls[0][0].error.message).toBe('انتهت صلاحية الجلسة');
    });
  });

  describe('Default error handling', () => {
    it('should handle generic errors with English locale', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new Error('Something went wrong');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'An unexpected error occurred',
        },
      });
      expect(logger.error).toHaveBeenCalledWith({
        message: 'Something went wrong',
        stack: expect.any(String),
        path: '/api/test',
        method: 'GET',
        ip: '127.0.0.1',
      });
    });

    it('should handle generic errors with Arabic locale', () => {
      mockRequest.headers = { 'accept-language': 'ar-EG' };
      const error = new Error('Unknown error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonSpy.mock.calls[0][0].error.message).toBe('حدث خطأ غير متوقع');
    });
  });

  describe('Locale detection', () => {
    it('should default to English when Accept-Language header is missing', () => {
      const error = new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
        'Validation failed'
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(jsonSpy.mock.calls[0][0].error.message).toBe('Validation error');
    });

    it('should handle unknown error codes gracefully in Arabic', () => {
      mockRequest.headers = { 'accept-language': 'ar' };
      const error = new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'UNKNOWN_CODE' as any,
        'Unknown error'
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNKNOWN_CODE',
          // getLocalizedMessage returns fallback for unknown codes
          message: 'حدث خطأ',
          details: undefined,
        },
      });
    });

    it('should handle unknown error codes gracefully in English', () => {
      mockRequest.headers = { 'accept-language': 'en' };
      const error = new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'CUSTOM_ERROR' as any,
        'Custom error message'
      );

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      // For unknown error codes, getLocalizedMessage returns fallback, not the original message
      expect(jsonSpy.mock.calls[0][0].error.message).toBe('An error occurred');
    });
  });
});
