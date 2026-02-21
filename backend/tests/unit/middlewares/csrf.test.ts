/**
 * CSRF Middleware Tests
 * اختبارات برمجيات حماية CSRF
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Request, Response, NextFunction } from 'express';
import {
  csrfTokenGenerator,
  csrfValidation,
  csrfProtection,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from '../../../src/middlewares/csrf';
import { ApiError } from '../../../src/utils/ApiError';

describe('CSRF Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let cookieSpy: jest.Mock;

  beforeEach(() => {
    cookieSpy = jest.fn();

    mockRequest = {
      cookies: {},
      headers: {},
      body: {},
      method: 'POST',
    };

    mockResponse = {
      cookie: cookieSpy,
    };

    mockNext = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('csrfTokenGenerator', () => {
    it('should generate new token when none exists', () => {
      csrfTokenGenerator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(cookieSpy).toHaveBeenCalledWith(
        CSRF_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: false,
          path: '/',
        })
      );
      expect((mockRequest as any).csrfToken).toBeDefined();
      expect(typeof (mockRequest as any).csrfToken).toBe('string');
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should use existing token from cookie', () => {
      const existingToken = 'existing-csrf-token';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: existingToken };

      csrfTokenGenerator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(cookieSpy).not.toHaveBeenCalled();
      expect((mockRequest as any).csrfToken).toBe(existingToken);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should attach token to request object', () => {
      csrfTokenGenerator(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).csrfToken).toBeDefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('csrfValidation', () => {
    beforeEach(() => {
      // Set to production to enable CSRF validation
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      // Reset to test
      process.env.NODE_ENV = 'test';
    });

    it('should skip validation for GET requests', () => {
      mockRequest.method = 'GET';

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should skip validation for HEAD requests', () => {
      mockRequest.method = 'HEAD';

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should skip validation for OPTIONS requests', () => {
      mockRequest.method = 'OPTIONS';

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should skip validation in test environment', () => {
      process.env.NODE_ENV = 'test';
      mockRequest.method = 'POST';

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw error when cookie token is missing', () => {
      mockRequest.method = 'POST';
      mockRequest.cookies = {};

      expect(() => {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(ApiError);

      try {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(403);
        expect((error as ApiError).code).toBe('CSRF_TOKEN_MISSING');
      }
    });

    it('should throw error when submitted token is missing', () => {
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: 'token-in-cookie' };
      mockRequest.headers = {};
      mockRequest.body = {};

      expect(() => {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(ApiError);

      try {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).code).toBe('CSRF_TOKEN_NOT_SUBMITTED');
      }
    });

    it('should validate matching tokens from header', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.headers = { [CSRF_HEADER_NAME]: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate matching tokens from body', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.body = { _csrf: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should throw error when tokens do not match', () => {
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: 'cookie-token' };
      mockRequest.headers = { [CSRF_HEADER_NAME]: 'different-token' };

      expect(() => {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(ApiError);

      try {
        csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).code).toBe('CSRF_TOKEN_INVALID');
      }
    });

    it('should handle lowercase header names', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      // Express automatically lowercases all header names
      mockRequest.headers = { [CSRF_HEADER_NAME.toLowerCase()]: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should prefer header token over body token', () => {
      const validToken = 'valid-csrf-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: validToken };
      mockRequest.headers = { [CSRF_HEADER_NAME]: validToken };
      mockRequest.body = { _csrf: 'wrong-token' };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate POST requests', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.headers = { [CSRF_HEADER_NAME]: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate PUT requests', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'PUT';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.headers = { [CSRF_HEADER_NAME]: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate DELETE requests', () => {
      const token = 'valid-csrf-token';
      mockRequest.method = 'DELETE';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.headers = { [CSRF_HEADER_NAME]: token };

      csrfValidation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('csrfProtection', () => {
    it('should combine token generation and validation', () => {
      // In test environment, validation is skipped
      process.env.NODE_ENV = 'test';
      mockRequest.method = 'POST';

      csrfProtection(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).csrfToken).toBeDefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should generate token and validate in production', () => {
      process.env.NODE_ENV = 'production';
      const token = 'existing-token';
      mockRequest.method = 'POST';
      mockRequest.cookies = { [CSRF_COOKIE_NAME]: token };
      mockRequest.headers = { [CSRF_HEADER_NAME]: token };

      csrfProtection(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).csrfToken).toBe(token);
      expect(mockNext).toHaveBeenCalledWith();

      // Reset environment
      process.env.NODE_ENV = 'test';
    });
  });
});
