/**
 * Response Utilities Tests
 * اختبارات أدوات الاستجابة
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import { Response } from 'express';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendError,
} from '../../../src/utils/response';

describe('Response Utilities', () => {
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test' };
      sendSuccess(mockResponse as Response, data);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it('should include message when provided', () => {
      const data = { id: 1 };
      sendSuccess(mockResponse as Response, data, { message: 'Success!' });

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        message: 'Success!',
      });
    });

    it('should use custom status code', () => {
      sendSuccess(mockResponse as Response, {}, { statusCode: 201 });
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should include pagination when provided', () => {
      const data = [{ id: 1 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: false,
      };

      sendSuccess(mockResponse as Response, data, { pagination });

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        pagination,
      });
    });

    it('should include meta when provided', () => {
      const data = { id: 1 };
      const meta = { extra: 'info' };

      sendSuccess(mockResponse as Response, data, { meta });

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        meta,
      });
    });
  });

  describe('sendCreated', () => {
    it('should send 201 response', () => {
      const data = { id: 1 };
      sendCreated(mockResponse as Response, data);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        message: 'Resource created successfully',
      });
    });

    it('should use custom message', () => {
      sendCreated(mockResponse as Response, {}, 'User created');

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {},
        message: 'User created',
      });
    });
  });

  describe('sendNoContent', () => {
    it('should send 204 response', () => {
      sendNoContent(mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe('sendPaginated', () => {
    it('should send paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      sendPaginated(mockResponse as Response, data, pagination);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        pagination,
      });
    });

    it('should include meta when provided', () => {
      const data = [{ id: 1 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
      const meta = { category: 'all' };

      sendPaginated(mockResponse as Response, data, pagination, meta);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data,
        pagination,
        meta,
      });
    });
  });

  describe('sendError', () => {
    it('should send error response', () => {
      sendError(mockResponse as Response, 400, 'BAD_REQUEST', 'Invalid input');

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid input',
        },
      });
    });

    it('should include details when provided', () => {
      const details = { field: 'email', error: 'Invalid format' };
      sendError(mockResponse as Response, 400, 'VALIDATION_ERROR', 'Validation failed', details);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details,
        },
      });
    });
  });
});
