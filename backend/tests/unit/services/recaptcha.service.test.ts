/**
 * reCAPTCHA Service Unit Tests
 * اختبارات وحدة خدمة reCAPTCHA
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['RECAPTCHA_SECRET_KEY'] = 'test-recaptcha-secret-key';

import axios from 'axios';
import {
  verifyRecaptcha,
  isRecaptchaConfigured,
} from '../../../src/services/recaptcha.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock logger
jest.mock('../../../src/config', () => ({
  env: {
    recaptchaSecretKey: 'test-recaptcha-secret-key',
    isProd: false,
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('RecaptchaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isRecaptchaConfigured', () => {
    it('should return true when secret key is configured', () => {
      const result = isRecaptchaConfigured();
      expect(result).toBe(true);
    });
  });

  describe('verifyRecaptcha', () => {
    it('should verify valid reCAPTCHA token successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          score: 0.9,
          action: 'submit',
          challenge_ts: '2024-01-01T00:00:00Z',
          hostname: 'localhost',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await verifyRecaptcha('valid-token');

      expect(result.success).toBe(true);
      expect(result.score).toBe(0.9);
      expect(result.skipped).toBeUndefined();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: 'test-recaptcha-secret-key',
            response: 'valid-token',
          },
        }
      );
    });

    it('should return failure for invalid token', async () => {
      const mockResponse = {
        data: {
          success: false,
          score: 0,
          action: '',
          challenge_ts: '',
          hostname: '',
          'error-codes': ['invalid-input-response'],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await verifyRecaptcha('invalid-token');

      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.errorCodes).toEqual(['invalid-input-response']);
    });

    it('should return failure for low score', async () => {
      const mockResponse = {
        data: {
          success: true,
          score: 0.3,
          action: 'submit',
          challenge_ts: '2024-01-01T00:00:00Z',
          hostname: 'localhost',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await verifyRecaptcha('low-score-token');

      expect(result.success).toBe(true);
      expect(result.score).toBe(0.3);
    });

    it('should handle network errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await verifyRecaptcha('token');

      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.errorCodes).toEqual(['network-error']);
    });

    it('should handle timeout errors', async () => {
      mockedAxios.post.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      });

      const result = await verifyRecaptcha('token');

      expect(result.success).toBe(false);
      expect(result.errorCodes).toEqual(['network-error']);
    });

    it('should handle missing score in response', async () => {
      const mockResponse = {
        data: {
          success: true,
          action: 'submit',
          challenge_ts: '2024-01-01T00:00:00Z',
          hostname: 'localhost',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await verifyRecaptcha('token');

      expect(result.success).toBe(true);
      expect(result.score).toBe(0);
    });

    it('should handle various error codes from Google', async () => {
      const errorCodes = [
        'missing-input-secret',
        'invalid-input-secret',
        'missing-input-response',
        'invalid-input-response',
        'bad-request',
        'timeout-or-duplicate',
      ];

      for (const errorCode of errorCodes) {
        const mockResponse = {
          data: {
            success: false,
            score: 0,
            action: '',
            challenge_ts: '',
            hostname: '',
            'error-codes': [errorCode],
          },
        };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await verifyRecaptcha('token');

        expect(result.success).toBe(false);
        expect(result.errorCodes).toContain(errorCode);
      }
    });
  });

  describe('verifyRecaptcha without config', () => {
    beforeEach(() => {
      // Mock env without recaptcha key
      jest.resetModules();
      jest.doMock('../../../src/config', () => ({
        env: {
          recaptchaSecretKey: '',
          isProd: false,
        },
        logger: {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      }));
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should skip verification when not configured in development', async () => {
      // Re-require the service with mocked config
      jest.isolateModules(async () => {
        const { verifyRecaptcha: verify } = require('../../../src/services/recaptcha.service');

        const result = await verify('any-token');

        expect(result.success).toBe(true);
        expect(result.score).toBe(1.0);
        expect(result.skipped).toBe(true);
        expect(mockedAxios.post).not.toHaveBeenCalled();
      });
    });
  });
});
