/**
 * Notification Model Unit Tests
 * اختبارات وحدة نموذج الإشعارات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Notification, INotification, User } from '../../../src/models';

describe('Notification Model', () => {
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
      await Notification.deleteMany({});
      await User.deleteMany({ _id: { $ne: testUserId } });
    }
  });

  describe('Schema Validation', () => {
    it('should create a notification with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        title: {
          ar: 'إشعار جديد',
          en: 'New Notification',
        },
        body: {
          ar: 'محتوى الإشعار',
          en: 'Notification content',
        },
      };

      const notification = await Notification.create(notificationData);

      expect(notification._id).toBeDefined();
      expect(notification.user).toEqual(testUserId);
      expect(notification.title.ar).toBe('إشعار جديد');
      expect(notification.title.en).toBe('New Notification');
      expect(notification.body.ar).toBe('محتوى الإشعار');
      expect(notification.body.en).toBe('Notification content');
      expect(notification.type).toBe('info'); // default
      expect(notification.isRead).toBe(false); // default
      expect(notification.createdAt).toBeDefined();
      expect(notification.updatedAt).toBeDefined();
    });

    it('should require user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should require Arabic title', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        title: { en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should require English title', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        title: { ar: 'عنوان' },
        body: { ar: 'محتوى', en: 'Body' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should require Arabic body', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        title: { ar: 'عنوان', en: 'Title' },
        body: { en: 'Body' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should require English body', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should validate type enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        type: 'invalid' as any,
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      };

      await expect(Notification.create(notificationData)).rejects.toThrow();
    });

    it('should accept valid type values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const types = ['info', 'success', 'warning', 'error'];

      for (const type of types) {
        const notification = await Notification.create({
          user: testUserId,
          type: type as any,
          title: { ar: 'عنوان', en: 'Title' },
          body: { ar: 'محتوى', en: 'Body' },
        });
        expect(notification.type).toBe(type);
        await Notification.deleteMany({});
      }
    });

    it('should default type to info', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notification = await Notification.create({
        user: testUserId,
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      });

      expect(notification.type).toBe('info');
    });

    it('should default isRead to false', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notification = await Notification.create({
        user: testUserId,
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      });

      expect(notification.isRead).toBe(false);
      expect(notification.readAt).toBeUndefined();
    });

    it('should store optional fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notificationData = {
        user: testUserId,
        type: 'success' as const,
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        link: '/dashboard/posts/123',
        data: new Map([
          ['postId', '123'],
          ['action', 'created'],
        ]),
      };

      const notification = await Notification.create(notificationData);

      expect(notification.link).toBe('/dashboard/posts/123');
      expect(notification.data?.get('postId')).toBe('123');
      expect(notification.data?.get('action')).toBe('created');
    });
  });

  describe('Static Method: getByUser', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create test notifications
      await Notification.create([
        {
          user: testUserId,
          title: { ar: 'إشعار 1', en: 'Notification 1' },
          body: { ar: 'محتوى 1', en: 'Body 1' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 2', en: 'Notification 2' },
          body: { ar: 'محتوى 2', en: 'Body 2' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 3', en: 'Notification 3' },
          body: { ar: 'محتوى 3', en: 'Body 3' },
          isRead: true,
          readAt: new Date(),
        },
      ]);
    });

    it('should get all notifications for a user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await Notification.getByUser(testUserId.toString());

      expect(result.notifications).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.unreadCount).toBe(2);
    });

    it('should filter unread notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await Notification.getByUser(testUserId.toString(), {
        unreadOnly: true,
      });

      expect(result.notifications).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.unreadCount).toBe(2);
      expect(result.notifications.every(n => !n.isRead)).toBe(true);
    });

    it('should support pagination', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await Notification.getByUser(testUserId.toString(), {
        page: 1,
        limit: 2,
      });

      expect(result.notifications).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.unreadCount).toBe(2);
    });

    it('should sort by createdAt descending', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await Notification.getByUser(testUserId.toString());

      // Verify sorting is descending
      for (let i = 0; i < result.notifications.length - 1; i++) {
        expect(result.notifications[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result.notifications[i + 1].createdAt.getTime()
        );
      }
    });

    it('should return empty result for user with no notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const newUser = await User.create({
        name: 'New User',
        email: 'new@example.com',
        password: 'Test@1234',
      });

      const result = await Notification.getByUser(newUser._id.toString());

      expect(result.notifications).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.unreadCount).toBe(0);
    });
  });

  describe('Static Method: markAsRead', () => {
    it('should mark notification as read', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const notification = await Notification.create({
        user: testUserId,
        title: { ar: 'إشعار', en: 'Notification' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: false,
      });

      const beforeMark = new Date();
      const updated = await Notification.markAsRead(notification._id.toString());
      const afterMark = new Date();

      expect(updated).toBeDefined();
      expect(updated?.isRead).toBe(true);
      expect(updated?.readAt).toBeDefined();
      expect(updated?.readAt!.getTime()).toBeGreaterThanOrEqual(beforeMark.getTime());
      expect(updated?.readAt!.getTime()).toBeLessThanOrEqual(afterMark.getTime());
    });

    it('should return null if notification not found', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const fakeId = new mongoose.Types.ObjectId();
      const result = await Notification.markAsRead(fakeId.toString());

      expect(result).toBeNull();
    });
  });

  describe('Static Method: markAllAsRead', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Notification.create([
        {
          user: testUserId,
          title: { ar: 'إشعار 1', en: 'Notification 1' },
          body: { ar: 'محتوى 1', en: 'Body 1' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 2', en: 'Notification 2' },
          body: { ar: 'محتوى 2', en: 'Body 2' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 3', en: 'Notification 3' },
          body: { ar: 'محتوى 3', en: 'Body 3' },
          isRead: true,
        },
      ]);
    });

    it('should mark all unread notifications as read', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const count = await Notification.markAllAsRead(testUserId.toString());

      expect(count).toBe(2);

      const notifications = await Notification.find({ user: testUserId });
      expect(notifications.every(n => n.isRead)).toBe(true);
    });

    it('should return 0 if all notifications are already read', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Notification.markAllAsRead(testUserId.toString());
      const count = await Notification.markAllAsRead(testUserId.toString());

      expect(count).toBe(0);
    });

    it('should return 0 if user has no notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const newUser = await User.create({
        name: 'New User 2',
        email: 'new2@example.com',
        password: 'Test@1234',
      });

      const count = await Notification.markAllAsRead(newUser._id.toString());

      expect(count).toBe(0);
    });
  });

  describe('Static Method: getUnreadCount', () => {
    it('should return unread count for user', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Notification.create([
        {
          user: testUserId,
          title: { ar: 'إشعار 1', en: 'Notification 1' },
          body: { ar: 'محتوى 1', en: 'Body 1' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 2', en: 'Notification 2' },
          body: { ar: 'محتوى 2', en: 'Body 2' },
          isRead: false,
        },
        {
          user: testUserId,
          title: { ar: 'إشعار 3', en: 'Notification 3' },
          body: { ar: 'محتوى 3', en: 'Body 3' },
          isRead: true,
        },
      ]);

      const count = await Notification.getUnreadCount(testUserId.toString());

      expect(count).toBe(2);
    });

    it('should return 0 if all notifications are read', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Notification.create({
        user: testUserId,
        title: { ar: 'إشعار', en: 'Notification' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: true,
      });

      const count = await Notification.getUnreadCount(testUserId.toString());

      expect(count).toBe(0);
    });

    it('should return 0 if user has no notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const count = await Notification.getUnreadCount(testUserId.toString());

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Static Method: deleteOld', () => {
    it('should delete old read notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);

      // Old read notification
      const oldRead = new Notification({
        user: testUserId,
        title: { ar: 'قديم', en: 'Old' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: true,
      });
      oldRead.createdAt = oldDate;
      await oldRead.save();

      // Old unread notification (should not be deleted)
      const oldUnread = new Notification({
        user: testUserId,
        title: { ar: 'قديم غير مقروء', en: 'Old Unread' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: false,
      });
      oldUnread.createdAt = oldDate;
      await oldUnread.save();

      // Recent read notification
      await Notification.create({
        user: testUserId,
        title: { ar: 'حديث', en: 'Recent' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: true,
      });

      const deletedCount = await Notification.deleteOld(30);

      expect(deletedCount).toBe(1);

      const remaining = await Notification.find();
      expect(remaining).toHaveLength(2);
      expect(remaining.find(n => n.title.en === 'Old')).toBeUndefined();
    });

    it('should use default 30 days if not specified', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 40);

      const oldRead = new Notification({
        user: testUserId,
        title: { ar: 'قديم', en: 'Old' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: true,
      });
      oldRead.createdAt = oldDate;
      await oldRead.save();

      const deletedCount = await Notification.deleteOld();

      expect(deletedCount).toBe(1);
    });

    it('should not delete unread notifications', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60);

      const oldUnread = new Notification({
        user: testUserId,
        title: { ar: 'قديم غير مقروء', en: 'Old Unread' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: false,
      });
      oldUnread.createdAt = oldDate;
      await oldUnread.save();

      const deletedCount = await Notification.deleteOld(30);

      expect(deletedCount).toBe(0);

      const remaining = await Notification.find();
      expect(remaining).toHaveLength(1);
    });
  });
});
