/**
 * Validation Middleware Tests
 * اختبارات برمجيات التحقق
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate, commonSchemas } from '../../../src/middlewares/validate';
import { ApiError } from '../../../src/utils/ApiError';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  describe('validate', () => {
    it('should pass validation with valid body', async () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }),
      };

      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail validation with invalid body', async () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }),
      };

      mockRequest.body = {
        name: '',
        email: 'invalid-email',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = (mockNext as jest.Mock).mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate query parameters', async () => {
      const schema = {
        query: Joi.object({
          page: Joi.number().integer().min(1),
          limit: Joi.number().integer().min(1).max(100),
        }),
      };

      mockRequest.query = {
        page: '1',
        limit: '10',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.query?.page).toBe(1);
      expect(mockRequest.query?.limit).toBe(10);
    });

    it('should validate params', async () => {
      const schema = {
        params: Joi.object({
          id: commonSchemas.objectId.required(),
        }),
      };

      mockRequest.params = {
        id: '507f1f77bcf86cd799439011',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail with invalid ObjectId', async () => {
      const schema = {
        params: Joi.object({
          id: commonSchemas.objectId.required(),
        }),
      };

      mockRequest.params = {
        id: 'invalid-id',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });

    it('should strip unknown fields', async () => {
      const schema = {
        body: Joi.object({
          name: Joi.string().required(),
        }),
      };

      mockRequest.body = {
        name: 'John',
        unknownField: 'should be removed',
      };

      const middleware = validate(schema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body).toEqual({ name: 'John' });
    });
  });

  describe('commonSchemas', () => {
    describe('objectId', () => {
      it('should validate correct ObjectId', () => {
        const result = commonSchemas.objectId.validate('507f1f77bcf86cd799439011');
        expect(result.error).toBeUndefined();
      });

      it('should reject invalid ObjectId', () => {
        const result = commonSchemas.objectId.validate('invalid');
        expect(result.error).toBeDefined();
      });
    });

    describe('email', () => {
      it('should validate correct email', () => {
        const result = commonSchemas.email.validate('test@example.com');
        expect(result.error).toBeUndefined();
        expect(result.value).toBe('test@example.com');
      });

      it('should lowercase email', () => {
        const result = commonSchemas.email.validate('TEST@EXAMPLE.COM');
        expect(result.value).toBe('test@example.com');
      });
    });

    describe('password', () => {
      it('should validate correct password', () => {
        const result = commonSchemas.password.validate('Test1234');
        expect(result.error).toBeUndefined();
      });

      it('should reject weak password', () => {
        const result = commonSchemas.password.validate('test');
        expect(result.error).toBeDefined();
      });

      it('should reject password without number', () => {
        const result = commonSchemas.password.validate('TestTest');
        expect(result.error).toBeDefined();
      });
    });

    describe('locale', () => {
      it('should accept valid locales', () => {
        expect(commonSchemas.locale.validate('ar').error).toBeUndefined();
        expect(commonSchemas.locale.validate('en').error).toBeUndefined();
      });

      it('should reject invalid locales', () => {
        expect(commonSchemas.locale.validate('fr').error).toBeDefined();
      });

      it('should default to ar', () => {
        const result = commonSchemas.locale.validate(undefined);
        expect(result.value).toBe('ar');
      });
    });

    describe('slug', () => {
      it('should validate correct slug', () => {
        const result = commonSchemas.slug.validate('my-blog-post');
        expect(result.error).toBeUndefined();
      });

      it('should reject slug with uppercase', () => {
        const result = commonSchemas.slug.validate('My-Blog');
        expect(result.error).toBeDefined();
      });
    });

    describe('localizedString', () => {
      it('should validate correct localized string', () => {
        const result = commonSchemas.localizedString.validate({
          ar: 'مرحبا',
          en: 'Hello',
        });
        expect(result.error).toBeUndefined();
      });

      it('should require both languages', () => {
        const result = commonSchemas.localizedString.validate({
          ar: 'مرحبا',
        });
        expect(result.error).toBeDefined();
      });
    });
  });
});
