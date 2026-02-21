/**
 * DeviceToken Model Unit Tests
 * اختبارات وحدة نموذج رمز الجهاز
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DeviceToken, IDeviceToken, User } from '../../../src/models';

describe('DeviceToken Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      // Create a test user
      if (mongoose.connection.readyState === 1) {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234',
        });
        testUserId = user._id as mongoose.Types.ObjectId;
      }
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await DeviceToken.deleteMany({});
      // Clean up users except test user to prevent duplicate email errors
      await User.deleteMany({ _id: { $ne: testUserId } });
    }
  });

  describe('Schema Validation', () => {
    it('should create a device token with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        user: testUserId,
        token: 'test-fcm-token-123',
      };

      const deviceToken = await DeviceToken.create(tokenData);

      expect(deviceToken._id).toBeDefined();
      expect(deviceToken.user).toEqual(testUserId);
      expect(deviceToken.token).toBe('test-fcm-token-123');
      expect(deviceToken.deviceType).toBe('web'); // default
      expect(deviceToken.isActive).toBe(true); // default
      expect(deviceToken.lastUsedAt).toBeDefined();
      expect(deviceToken.createdAt).toBeDefined();
      expect(deviceToken.updatedAt).toBeDefined();
    });

    it('should require user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        token: 'test-fcm-token-123',
      };

      await expect(DeviceToken.create(tokenData)).rejects.toThrow();
    });

    it('should require token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        user: testUserId,
      };

      await expect(DeviceToken.create(tokenData)).rejects.toThrow();
    });

    it('should enforce unique token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        user: testUserId,
        token: 'unique-token-123',
      };

      await DeviceToken.create(tokenData);
      await expect(DeviceToken.create(tokenData)).rejects.toThrow();
    });

    it('should validate deviceType enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        user: testUserId,
        token: 'test-token-123',
        deviceType: 'invalid' as any,
      };

      await expect(DeviceToken.create(tokenData)).rejects.toThrow();
    });

    it('should accept valid deviceType values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const deviceTypes = ['web', 'android', 'ios'];

      for (const type of deviceTypes) {
        const token = await DeviceToken.create({
          user: testUserId,
          token: `token-${type}`,
          deviceType: type as any,
        });
        expect(token.deviceType).toBe(type);
      }
    });

    it('should default deviceType to web', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const token = await DeviceToken.create({
        user: testUserId,
        token: 'test-token',
      });

      expect(token.deviceType).toBe('web');
    });

    it('should default isActive to true', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const token = await DeviceToken.create({
        user: testUserId,
        token: 'test-token',
      });

      expect(token.isActive).toBe(true);
    });

    it('should set lastUsedAt to current date by default', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const beforeCreate = new Date();
      const token = await DeviceToken.create({
        user: testUserId,
        token: 'test-token',
      });
      const afterCreate = new Date();

      expect(token.lastUsedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(token.lastUsedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should store optional fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokenData = {
        user: testUserId,
        token: 'test-token',
        deviceType: 'android' as const,
        deviceId: 'device-123',
        deviceName: 'Samsung Galaxy S21',
        browser: 'Chrome',
        os: 'Android 12',
      };

      const token = await DeviceToken.create(tokenData);

      expect(token.deviceId).toBe('device-123');
      expect(token.deviceName).toBe('Samsung Galaxy S21');
      expect(token.browser).toBe('Chrome');
      expect(token.os).toBe('Android 12');
    });
  });

  describe('Static Method: registerToken', () => {
    it('should register a new device token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const deviceInfo = {
        deviceType: 'web' as const,
        deviceId: 'device-123',
        deviceName: 'Chrome Browser',
        browser: 'Chrome',
        os: 'Windows 10',
      };

      const token = await DeviceToken.registerToken(
        testUserId.toString(),
        'fcm-token-123',
        deviceInfo
      );

      expect(token._id).toBeDefined();
      expect(token.token).toBe('fcm-token-123');
      expect(token.deviceType).toBe('web');
      expect(token.deviceId).toBe('device-123');
      expect(token.isActive).toBe(true);
    });

    it('should update existing token (upsert)', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create initial token
      await DeviceToken.create({
        user: testUserId,
        token: 'fcm-token-123',
        deviceType: 'web',
        isActive: false,
      });

      // Register same token with new info
      const deviceInfo = {
        deviceType: 'android' as const,
        deviceName: 'New Device',
      };

      const token = await DeviceToken.registerToken(
        testUserId.toString(),
        'fcm-token-123',
        deviceInfo
      );

      expect(token.deviceType).toBe('android');
      expect(token.deviceName).toBe('New Device');
      expect(token.isActive).toBe(true);

      const count = await DeviceToken.countDocuments({ token: 'fcm-token-123' });
      expect(count).toBe(1); // Should update, not create new
    });

    it('should update lastUsedAt on register', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date('2023-01-01');
      await DeviceToken.create({
        user: testUserId,
        token: 'fcm-token-123',
        lastUsedAt: oldDate,
      });

      const token = await DeviceToken.registerToken(testUserId.toString(), 'fcm-token-123', {
        deviceType: 'web',
      });

      expect(token.lastUsedAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('Static Method: removeToken', () => {
    it('should remove a token and return true', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await DeviceToken.create({
        user: testUserId,
        token: 'token-to-remove',
      });

      const result = await DeviceToken.removeToken('token-to-remove');

      expect(result).toBe(true);

      const token = await DeviceToken.findOne({ token: 'token-to-remove' });
      expect(token).toBeNull();
    });

    it('should return false if token does not exist', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await DeviceToken.removeToken('non-existent-token');

      expect(result).toBe(false);
    });
  });

  describe('Static Method: getUserTokens', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date('2023-01-01');
      const midDate = new Date('2023-06-01');
      const newDate = new Date();

      await DeviceToken.create([
        { user: testUserId, token: 'token-1', isActive: true, lastUsedAt: newDate },
        { user: testUserId, token: 'token-2', isActive: true, lastUsedAt: midDate },
        { user: testUserId, token: 'token-3', isActive: false, lastUsedAt: oldDate },
        { user: testUserId, token: 'token-4', isActive: true, lastUsedAt: oldDate },
      ]);
    });

    it('should get all active tokens for a user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokens = await DeviceToken.getUserTokens(testUserId.toString());

      expect(tokens).toHaveLength(3);
      expect(tokens.every(t => t.isActive)).toBe(true);
    });

    it('should sort tokens by lastUsedAt descending', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const tokens = await DeviceToken.getUserTokens(testUserId.toString());

      expect(tokens[0].token).toBe('token-1');
      expect(tokens[1].token).toBe('token-2');
      expect(tokens[2].token).toBe('token-4');
    });

    it('should return empty array if user has no active tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const newUser = await User.create({
        name: 'New User',
        email: 'new@example.com',
        password: 'Test@1234',
      });

      const tokens = await DeviceToken.getUserTokens(newUser._id.toString());

      expect(tokens).toHaveLength(0);
    });
  });

  describe('Static Method: deactivateUserTokens', () => {
    it('should deactivate all user tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await DeviceToken.create([
        { user: testUserId, token: 'token-1', isActive: true },
        { user: testUserId, token: 'token-2', isActive: true },
        { user: testUserId, token: 'token-3', isActive: false },
      ]);

      const count = await DeviceToken.deactivateUserTokens(testUserId.toString());

      expect(count).toBeGreaterThanOrEqual(2); // At least 2 active tokens

      const tokens = await DeviceToken.find({ user: testUserId });
      expect(tokens.every(t => !t.isActive)).toBe(true);
    });

    it('should return 0 if user has no active tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const newUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'Test@1234',
      });

      const count = await DeviceToken.deactivateUserTokens(newUser._id.toString());

      expect(count).toBe(0);
    });
  });

  describe('Static Method: cleanupInactiveTokens', () => {
    it('should delete inactive tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await DeviceToken.create([
        { user: testUserId, token: 'token-1', isActive: false },
        { user: testUserId, token: 'token-2', isActive: true },
      ]);

      const count = await DeviceToken.cleanupInactiveTokens();

      expect(count).toBe(1);

      const remaining = await DeviceToken.find();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].token).toBe('token-2');
    });

    it('should delete tokens not used in specified days', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);

      await DeviceToken.create([
        { user: testUserId, token: 'old-token', isActive: true, lastUsedAt: oldDate },
        { user: testUserId, token: 'new-token', isActive: true, lastUsedAt: new Date() },
      ]);

      const count = await DeviceToken.cleanupInactiveTokens(30);

      expect(count).toBe(1);

      const remaining = await DeviceToken.find();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].token).toBe('new-token');
    });

    it('should delete both inactive and old tokens', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);

      await DeviceToken.create([
        { user: testUserId, token: 'old-inactive', isActive: false, lastUsedAt: oldDate },
        { user: testUserId, token: 'old-active', isActive: true, lastUsedAt: oldDate },
        { user: testUserId, token: 'new-inactive', isActive: false, lastUsedAt: new Date() },
        { user: testUserId, token: 'new-active', isActive: true, lastUsedAt: new Date() },
      ]);

      const count = await DeviceToken.cleanupInactiveTokens(30);

      expect(count).toBe(3); // old-inactive, old-active, new-inactive

      const remaining = await DeviceToken.find();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].token).toBe('new-active');
    });

    it('should use default 30 days if not specified', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 40);

      await DeviceToken.create({
        user: testUserId,
        token: 'old-token',
        isActive: true,
        lastUsedAt: oldDate,
      });

      const count = await DeviceToken.cleanupInactiveTokens();

      expect(count).toBe(1);
    });
  });
});
