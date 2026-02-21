/**
 * Auth Service Unit Tests
 * اختبارات وحدة خدمة المصادقة
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough-for-testing';
process.env['JWT_EXPIRES_IN'] = '15m';
process.env['JWT_REFRESH_EXPIRES_IN'] = '7d';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authService, TokenPayload } from '../../../src/services/auth.service';
import { User } from '../../../src/models';
import { ApiError } from '../../../src/utils/ApiError';
import { redis } from '../../../src/config';

// Mock Redis
jest.mock('../../../src/config', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
  env: {
    jwt: {
      secret: 'test-jwt-secret-key-that-is-long-enough-for-testing',
      expiresIn: '15m',
      refreshExpiresIn: '7d',
    },
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock User model
jest.mock('../../../src/models', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token with correct payload', () => {
      const payload: TokenPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = authService.generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token can be decoded
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('should generate different tokens for different payloads', () => {
      const payload1: TokenPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'user1@example.com',
        role: 'admin',
      };

      const payload2: TokenPayload = {
        userId: '507f1f77bcf86cd799439012',
        email: 'user2@example.com',
        role: 'editor',
      };

      const token1 = authService.generateAccessToken(payload1);
      const token2 = authService.generateAccessToken(payload2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid hex string refresh token', () => {
      const token = authService.generateRefreshToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(128); // 64 bytes in hex = 128 chars
      expect(/^[a-f0-9]+$/i.test(token)).toBe(true);
    });

    it('should generate unique tokens on each call', () => {
      const token1 = authService.generateRefreshToken();
      const token2 = authService.generateRefreshToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token and return payload', () => {
      const payload: TokenPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = authService.generateAccessToken(payload);
      const verified = authService.verifyAccessToken(token);

      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe(payload.role);
      expect(verified.iat).toBeDefined();
    });

    it('should throw INVALID_TOKEN error for invalid token', () => {
      expect(() => {
        authService.verifyAccessToken('invalid-token');
      }).toThrow(ApiError);
    });

    it('should throw INVALID_TOKEN error for malformed token', () => {
      expect(() => {
        authService.verifyAccessToken('not.a.jwt');
      }).toThrow(ApiError);
    });

    it('should throw TOKEN_EXPIRED error for expired token', () => {
      const payload: TokenPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      // Create an expired token (expires in 1ms)
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1ms' });

      // Wait for token to expire
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        expect(() => {
          authService.verifyAccessToken(expiredToken);
        }).toThrow(ApiError);
      });
    });
  });

  describe('generateTokenPair', () => {
    it('should generate access and refresh tokens with metadata', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.generateTokenPair(mockUser as any, 'Chrome', '192.168.1.1');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(typeof result.expiresIn).toBe('number');
    });

    it('should store hashed refresh token in database', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      await authService.generateTokenPair(mockUser as any, 'Chrome', '192.168.1.1');

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          $push: expect.objectContaining({
            refreshTokens: expect.objectContaining({
              $each: expect.arrayContaining([
                expect.objectContaining({
                  token: expect.any(String),
                  expiresAt: expect.any(Date),
                  device: 'Chrome',
                  ip: '192.168.1.1',
                }),
              ]),
              $slice: -5,
            }),
          }),
          $set: expect.objectContaining({
            lastLogin: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('blacklistAccessToken', () => {
    it('should add valid token to blacklist with TTL', async () => {
      const payload: TokenPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = authService.generateAccessToken(payload);

      (redis.set as jest.Mock).mockResolvedValue('OK');

      await authService.blacklistAccessToken(token);

      expect(redis.set).toHaveBeenCalledWith(
        `blacklist:${token}`,
        '1',
        'EX',
        expect.any(Number)
      );
    });

    it('should not blacklist already expired token', async () => {
      const expiredToken = jwt.sign({ userId: '123' }, process.env.JWT_SECRET!, { expiresIn: '-1h' });

      await authService.blacklistAccessToken(expiredToken);

      expect(redis.set).not.toHaveBeenCalled();
    });

    it('should handle invalid token gracefully', async () => {
      await authService.blacklistAccessToken('invalid-token');

      expect(redis.set).not.toHaveBeenCalled();
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true for blacklisted token', async () => {
      (redis.get as jest.Mock).mockResolvedValue('1');

      const isBlacklisted = await authService.isTokenBlacklisted('some-token');

      expect(isBlacklisted).toBe(true);
      expect(redis.get).toHaveBeenCalledWith('blacklist:some-token');
    });

    it('should return false for non-blacklisted token', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);

      const isBlacklisted = await authService.isTokenBlacklisted('some-token');

      expect(isBlacklisted).toBe(false);
    });
  });

  describe('refreshTokens', () => {
    it('should generate new token pair for valid refresh token', async () => {
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'admin',
        isActive: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.refreshTokens(refreshToken, 'Chrome', '192.168.1.1');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(User.findOne).toHaveBeenCalledWith({
        'refreshTokens.token': hashedToken,
        'refreshTokens.expiresAt': { $gt: expect.any(Date) },
        isActive: true,
      });
    });

    it('should throw error for invalid refresh token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.refreshTokens('invalid-token')).rejects.toThrow();
    });
  });

  describe('revokeRefreshToken', () => {
    it('should remove refresh token from database', async () => {
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

      (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

      await authService.revokeRefreshToken(refreshToken);

      expect(User.updateOne).toHaveBeenCalledWith(
        { 'refreshTokens.token': hashedToken },
        { $pull: { refreshTokens: { token: hashedToken } } }
      );
    });
  });

  describe('revokeAllRefreshTokens', () => {
    it('should clear all refresh tokens for user', async () => {
      const userId = '507f1f77bcf86cd799439011';

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await authService.revokeAllRefreshTokens(userId);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        $set: { refreshTokens: [] },
      });
    });
  });
});
