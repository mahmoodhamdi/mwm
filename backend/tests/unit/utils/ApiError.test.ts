/**
 * ApiError Unit Tests
 * اختبارات وحدة ApiError
 */

import { ApiError } from '../../../src/utils/ApiError';
import { HTTP_STATUS, ERROR_CODES } from '@mwm/shared';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an ApiError with all properties', () => {
      const error = new ApiError(400, 'TEST_ERROR', 'Test message', true, { field: 'value' });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.isOperational).toBe(true);
      expect(error.details).toEqual({ field: 'value' });
    });

    it('should default isOperational to true', () => {
      const error = new ApiError(400, 'TEST_ERROR', 'Test message');
      expect(error.isOperational).toBe(true);
    });
  });

  describe('static factory methods', () => {
    describe('unauthorized', () => {
      it('should create unauthorized error with default message', () => {
        const error = ApiError.unauthorized();

        expect(error.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(error.message).toBe('Unauthorized');
      });

      it('should create unauthorized error with custom message', () => {
        const error = ApiError.unauthorized('Custom unauthorized message');

        expect(error.message).toBe('Custom unauthorized message');
      });
    });

    describe('invalidCredentials', () => {
      it('should create invalid credentials error', () => {
        const error = ApiError.invalidCredentials();

        expect(error.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS);
        expect(error.message).toBe('Invalid credentials');
      });
    });

    describe('tokenExpired', () => {
      it('should create token expired error', () => {
        const error = ApiError.tokenExpired();

        expect(error.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(error.code).toBe(ERROR_CODES.TOKEN_EXPIRED);
        expect(error.message).toBe('Token expired');
      });
    });

    describe('validationError', () => {
      it('should create validation error with details', () => {
        const details = [{ field: 'email', message: 'Invalid email' }];
        const error = ApiError.validationError(details);

        expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
        expect(error.details).toEqual(details);
      });
    });

    describe('notFound', () => {
      it('should create not found error with resource name', () => {
        const error = ApiError.notFound('User');

        expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
        expect(error.message).toBe('User not found');
      });
    });

    describe('emailExists', () => {
      it('should create email exists error', () => {
        const error = ApiError.emailExists();

        expect(error.statusCode).toBe(HTTP_STATUS.CONFLICT);
        expect(error.code).toBe(ERROR_CODES.EMAIL_EXISTS);
        expect(error.message).toBe('Email already exists');
      });
    });

    describe('tooManyRequests', () => {
      it('should create too many requests error', () => {
        const error = ApiError.tooManyRequests();

        expect(error.statusCode).toBe(HTTP_STATUS.TOO_MANY_REQUESTS);
        expect(error.code).toBe(ERROR_CODES.TOO_MANY_REQUESTS);
      });
    });

    describe('internalError', () => {
      it('should create internal error with isOperational false', () => {
        const error = ApiError.internalError();

        expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        expect(error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
        expect(error.isOperational).toBe(false);
      });
    });

    describe('insufficientPermissions', () => {
      it('should create insufficient permissions error', () => {
        const error = ApiError.insufficientPermissions();

        expect(error.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
        expect(error.code).toBe(ERROR_CODES.INSUFFICIENT_PERMISSIONS);
      });
    });
  });
});
