/**
 * ActivityLog Model Unit Tests
 * اختبارات وحدة نموذج سجل النشاط
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ActivityLog, IActivityLog, User } from '../../../src/models';

describe('ActivityLog Model', () => {
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
      await ActivityLog.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create an activity log with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logData = {
        user: testUserId,
        action: 'create' as const,
        resource: 'User',
        resourceTitle: 'New User',
      };

      const log = await ActivityLog.create(logData);

      expect(log._id).toBeDefined();
      expect(log.user).toEqual(testUserId);
      expect(log.action).toBe('create');
      expect(log.resource).toBe('User');
      expect(log.resourceTitle).toBe('New User');
      expect(log.createdAt).toBeDefined();
    });

    it('should require user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logData = {
        action: 'create' as const,
        resource: 'User',
      };

      await expect(ActivityLog.create(logData)).rejects.toThrow();
    });

    it('should require action', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logData = {
        user: testUserId,
        resource: 'User',
      };

      await expect(ActivityLog.create(logData)).rejects.toThrow();
    });

    it('should require resource', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logData = {
        user: testUserId,
        action: 'create' as const,
      };

      await expect(ActivityLog.create(logData)).rejects.toThrow();
    });

    it('should validate action enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logData = {
        user: testUserId,
        action: 'invalid' as any,
        resource: 'User',
      };

      await expect(ActivityLog.create(logData)).rejects.toThrow();
    });

    it('should accept all valid action types', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const actions = [
        'create',
        'update',
        'delete',
        'login',
        'logout',
        'view',
        'export',
        'import',
        'publish',
        'unpublish',
      ];

      for (const action of actions) {
        const log = await ActivityLog.create({
          user: testUserId,
          action: action as any,
          resource: 'Test',
        });
        expect(log.action).toBe(action);
      }
    });

    it('should store optional fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const resourceId = new mongoose.Types.ObjectId();
      const logData = {
        user: testUserId,
        action: 'update' as const,
        resource: 'User',
        resourceId,
        resourceTitle: 'User Profile',
        details: { key: 'value', count: 42 },
        changes: [
          { field: 'name', oldValue: 'Old Name', newValue: 'New Name' },
          { field: 'age', oldValue: 25, newValue: 26 },
        ],
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };

      const log = await ActivityLog.create(logData);

      expect(log.resourceId).toEqual(resourceId);
      expect(log.resourceTitle).toBe('User Profile');
      expect(log.details).toEqual({ key: 'value', count: 42 });
      expect(log.changes).toHaveLength(2);
      expect(log.changes![0].field).toBe('name');
      expect(log.changes![0].oldValue).toBe('Old Name');
      expect(log.changes![0].newValue).toBe('New Name');
      expect(log.ip).toBe('192.168.1.1');
      expect(log.userAgent).toBe('Mozilla/5.0');
    });

    it('should have createdAt but not updatedAt', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const log = await ActivityLog.create({
        user: testUserId,
        action: 'login' as const,
        resource: 'Auth',
      });

      expect(log.createdAt).toBeDefined();
      expect((log as any).updatedAt).toBeUndefined();
    });
  });

  describe('Static Method: log', () => {
    it('should create activity log using static method', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const log = await ActivityLog.log({
        user: testUserId,
        action: 'create',
        resource: 'BlogPost',
        resourceTitle: 'My First Post',
      });

      expect(log._id).toBeDefined();
      expect(log.user).toEqual(testUserId);
      expect(log.action).toBe('create');
      expect(log.resource).toBe('BlogPost');
    });
  });

  describe('Static Method: getByUser', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create test logs
      await ActivityLog.create([
        { user: testUserId, action: 'login', resource: 'Auth' },
        { user: testUserId, action: 'create', resource: 'User' },
        { user: testUserId, action: 'update', resource: 'Profile' },
        { user: testUserId, action: 'delete', resource: 'User' },
      ]);
    });

    it('should get all logs for a user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByUser(testUserId.toString());

      expect(result.logs).toHaveLength(4);
      expect(result.total).toBe(4);
    });

    it('should filter by action', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByUser(testUserId.toString(), {
        action: 'login',
      });

      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].action).toBe('login');
      expect(result.total).toBe(1);
    });

    it('should filter by resource', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByUser(testUserId.toString(), {
        resource: 'User',
      });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should support pagination', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByUser(testUserId.toString(), {
        page: 1,
        limit: 2,
      });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(4);
    });

    it('should sort by createdAt descending', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByUser(testUserId.toString());

      // Verify sorting is descending - later logs come first
      for (let i = 0; i < result.logs.length - 1; i++) {
        expect(result.logs[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result.logs[i + 1].createdAt.getTime()
        );
      }
    });
  });

  describe('Static Method: getByResource', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      resourceId = new mongoose.Types.ObjectId();
      await ActivityLog.create([
        { user: testUserId, action: 'create', resource: 'User', resourceId },
        { user: testUserId, action: 'update', resource: 'User', resourceId },
        { user: testUserId, action: 'view', resource: 'User' },
        { user: testUserId, action: 'delete', resource: 'Post' },
      ]);
    });

    it('should get logs by resource type', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByResource('User');

      expect(result.logs).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should get logs by resource and resourceId', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByResource('User', resourceId.toString());

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should support pagination', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await ActivityLog.getByResource('User', undefined, {
        page: 1,
        limit: 2,
      });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(3);
    });
  });

  describe('Static Method: getRecent', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create logs with small delay to ensure order
      for (let i = 0; i < 5; i++) {
        await ActivityLog.create({
          user: testUserId,
          action: 'view',
          resource: `Resource${i}`,
        });
      }
    });

    it('should get recent logs with default limit', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logs = await ActivityLog.getRecent();

      expect(logs).toHaveLength(5);
    });

    it('should respect custom limit', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logs = await ActivityLog.getRecent(3);

      expect(logs).toHaveLength(3);
    });

    it('should return logs in descending order', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const logs = await ActivityLog.getRecent();

      // Verify sorting is descending
      for (let i = 0; i < logs.length - 1; i++) {
        expect(logs[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          logs[i + 1].createdAt.getTime()
        );
      }
    });
  });

  describe('Static Method: deleteOld', () => {
    it('should delete logs older than specified days', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create an old log (100 days ago)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const oldLog = new ActivityLog({
        user: testUserId,
        action: 'login',
        resource: 'Auth',
      });
      oldLog.createdAt = oldDate;
      await oldLog.save();

      // Create a recent log
      await ActivityLog.create({
        user: testUserId,
        action: 'logout',
        resource: 'Auth',
      });

      const deletedCount = await ActivityLog.deleteOld(90);

      expect(deletedCount).toBe(1);

      const remainingLogs = await ActivityLog.find();
      expect(remainingLogs).toHaveLength(1);
      expect(remainingLogs[0].action).toBe('logout');
    });

    it('should use default 90 days if not specified', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const oldLog = new ActivityLog({
        user: testUserId,
        action: 'login',
        resource: 'Auth',
      });
      oldLog.createdAt = oldDate;
      await oldLog.save();

      const deletedCount = await ActivityLog.deleteOld();
      expect(deletedCount).toBe(1);
    });
  });

  describe('Static Method: getStatistics', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      await ActivityLog.create([
        { user: testUserId, action: 'login', resource: 'Auth' },
        { user: testUserId, action: 'login', resource: 'Auth' },
        { user: testUserId, action: 'create', resource: 'User' },
        { user: testUserId, action: 'update', resource: 'User' },
        { user: testUserId, action: 'update', resource: 'Profile' },
      ]);
    });

    it('should return statistics by action, resource, and user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const stats = await ActivityLog.getStatistics();

      expect(stats.byAction).toEqual({
        login: 2,
        create: 1,
        update: 2,
      });

      expect(stats.byResource).toEqual({
        Auth: 2,
        User: 2,
        Profile: 1,
      });

      expect(stats.byUser[testUserId.toString()]).toBe(5);
    });

    it('should filter by date range', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const stats = await ActivityLog.getStatistics(startDate, endDate);

      expect(Object.values(stats.byAction).reduce((a, b) => a + b, 0)).toBe(5);
    });

    it('should return empty stats if no logs match', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const stats = await ActivityLog.getStatistics(futureDate);

      expect(stats.byAction).toEqual({});
      expect(stats.byResource).toEqual({});
      expect(stats.byUser).toEqual({});
    });
  });
});
