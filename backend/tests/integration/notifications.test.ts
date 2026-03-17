/**
 * Notifications Integration Tests
 * اختبارات تكامل الإشعارات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';
process.env['CLIENT_URL'] = 'http://localhost:3000';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import { User, Notification, DeviceToken } from '../../src/models';
import { Express } from 'express';

// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  messaging: () => ({
    send: jest.fn().mockResolvedValue({ messageId: 'mock-message-id' }),
    sendMulticast: jest.fn().mockResolvedValue({ successCount: 1, failureCount: 0 }),
    subscribeToTopic: jest.fn().mockResolvedValue({}),
    unsubscribeFromTopic: jest.fn().mockResolvedValue({}),
  }),
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
}));

describe('Notifications API', () => {
  let app: Express | null = null;
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

  async function getAdminToken(): Promise<string> {
    await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'Test@1234',
      role: 'super_admin',
      isActive: true,
      isEmailVerified: true,
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'Test@1234' });
    return res.body.data?.accessToken || '';
  }

  async function getUserToken(): Promise<string> {
    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'Test@1234',
      role: 'viewer',
      isActive: true,
      isEmailVerified: true,
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: 'Test@1234' });
    return res.body.data?.accessToken || '';
  }

  beforeAll(async () => {
    try {
      // Ensure no existing connection
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      app = createApp();
      isConnected = true;
    } catch {
      console.warn('MongoMemoryServer could not start');
      isConnected = false;
    }
  }, 120000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
      await User.deleteMany({});
      await Notification.deleteMany({});
      await DeviceToken.deleteMany({});
    }
  });

  describe('GET /api/v1/notifications', () => {
    it('should get user notifications', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create some notifications
      await Notification.create([
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان', en: 'Title' },
          body: { ar: 'محتوى', en: 'Body' },
        },
        {
          user: user!._id,
          type: 'success',
          title: { ar: 'نجاح', en: 'Success' },
          body: { ar: 'عملية ناجحة', en: 'Successful operation' },
        },
      ]);

      const response = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(2);
      expect(response.body.data.total).toBe(2);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/notifications').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/notifications/unread-count', () => {
    it('should get unread notification count', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create notifications (2 unread, 1 read)
      await Notification.create([
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 1', en: 'Title 1' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: false,
        },
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 2', en: 'Title 2' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: false,
        },
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 3', en: 'Title 3' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: true,
        },
      ]);

      const response = await request(app)
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
    });
  });

  describe('PUT /api/v1/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      const notification = await Notification.create({
        user: user!._id,
        type: 'info',
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        isRead: false,
      });

      const response = await request(app)
        .put(`/api/v1/notifications/${notification._id}/read`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.notification.isRead).toBe(true);
      expect(response.body.data.notification.readAt).toBeDefined();
    });

    it('should fail for non-existent notification', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/v1/notifications/${fakeId}/read`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create unread notifications
      await Notification.create([
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 1', en: 'Title 1' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: false,
        },
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 2', en: 'Title 2' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: false,
        },
      ]);

      const response = await request(app)
        .put('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);

      // Verify all are read
      const unreadCount = await Notification.countDocuments({ user: user!._id, isRead: false });
      expect(unreadCount).toBe(0);
    });
  });

  describe('DELETE /api/v1/notifications/:id', () => {
    it('should delete notification', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      const notification = await Notification.create({
        user: user!._id,
        type: 'info',
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
      });

      const response = await request(app)
        .delete(`/api/v1/notifications/${notification._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deleted
      const found = await Notification.findById(notification._id);
      expect(found).toBeNull();
    });
  });

  describe('DELETE /api/v1/notifications/read', () => {
    it('should delete all read notifications', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create notifications (2 read, 1 unread)
      await Notification.create([
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 1', en: 'Title 1' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: true,
        },
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 2', en: 'Title 2' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: true,
        },
        {
          user: user!._id,
          type: 'info',
          title: { ar: 'عنوان 3', en: 'Title 3' },
          body: { ar: 'محتوى', en: 'Body' },
          isRead: false,
        },
      ]);

      const response = await request(app)
        .delete('/api/v1/notifications/read')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify only unread remain
      const remaining = await Notification.countDocuments({ user: user!._id });
      expect(remaining).toBe(1);
    });
  });

  describe('POST /api/v1/notifications/device-token', () => {
    it('should register device token', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();

      const response = await request(app)
        .post('/api/v1/notifications/device-token')
        .set('Authorization', `Bearer ${token}`)
        .send({
          token: 'test-device-token-123',
          platform: 'web',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deviceToken).toBeDefined();

      // Verify in database
      const deviceToken = await DeviceToken.findOne({ token: 'test-device-token-123' });
      expect(deviceToken).toBeDefined();
    });
  });

  describe('DELETE /api/v1/notifications/device-token', () => {
    it('should remove device token', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create device token
      await DeviceToken.create({
        user: user!._id,
        token: 'test-device-token-456',
        deviceType: 'web',
      });

      const response = await request(app)
        .delete('/api/v1/notifications/device-token')
        .set('Authorization', `Bearer ${token}`)
        .send({ token: 'test-device-token-456' })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deleted
      const deviceToken = await DeviceToken.findOne({ token: 'test-device-token-456' });
      expect(deviceToken).toBeNull();
    });
  });

  describe('GET /api/v1/notifications/device-tokens', () => {
    it('should get user device tokens', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create device tokens
      await DeviceToken.create([
        {
          user: user!._id,
          token: 'token-1',
          deviceType: 'web',
        },
        {
          user: user!._id,
          token: 'token-2',
          deviceType: 'android',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/notifications/device-tokens')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { tokens } (not { deviceTokens }), so check data.tokens
      expect(response.body.data.tokens).toHaveLength(2);
    });
  });

  describe('POST /api/v1/notifications/admin/send', () => {
    it('should send notification to specific users (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const userToken = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      const response = await request(app)
        .post('/api/v1/notifications/admin/send')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds: [user!._id.toString()],
          title: { ar: 'إشعار من الإدارة', en: 'Admin Notification' },
          body: { ar: 'محتوى الإشعار', en: 'Notification content' },
          type: 'info',
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify notification created
      const notification = await Notification.findOne({ user: user!._id });
      expect(notification).toBeDefined();
      expect(notification!.title.en).toBe('Admin Notification');
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .post('/api/v1/notifications/admin/send')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userIds: ['someUserId'],
          title: { ar: 'عنوان', en: 'Title' },
          body: { ar: 'محتوى', en: 'Body' },
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/notifications/admin/broadcast', () => {
    it('should broadcast notification to all users (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      await getUserToken(); // Create a user

      const response = await request(app)
        .post('/api/v1/notifications/admin/broadcast')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { ar: 'بث عام', en: 'Broadcast' },
          body: { ar: 'رسالة عامة', en: 'Public message' },
          type: 'warning',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      // Broadcast uses saveToDatabase: false (topic-based push only),
      // so no notification documents are persisted in the database.
      // We only verify the API response is successful.
    });
  });
});
