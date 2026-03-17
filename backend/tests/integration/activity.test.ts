/**
 * Activity Log Integration Tests
 * اختبارات تكامل سجل النشاط
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
import { User, ActivityLog } from '../../src/models';
import { Express } from 'express';

describe('Activity Log API', () => {
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
      await ActivityLog.deleteMany({});
    }
  });

  describe('GET /api/v1/activity/me', () => {
    it('should get current user activity', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create activity logs for user
      await ActivityLog.create([
        {
          user: user!._id,
          action: 'create',
          resource: 'BlogPost',
          resourceTitle: 'My Post',
        },
        {
          user: user!._id,
          action: 'update',
          resource: 'BlogPost',
          resourceTitle: 'My Post',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
      expect(response.body.data.logs.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/activity/me').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/activity', () => {
    it('should get all activity logs (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      await ActivityLog.create([
        {
          user: admin!._id,
          action: 'create',
          resource: 'Service',
          resourceTitle: 'New Service',
        },
        {
          user: admin!._id,
          action: 'delete',
          resource: 'Project',
          resourceTitle: 'Old Project',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
      expect(response.body.data.pagination.total).toBeDefined();
    });

    it('should support filtering by action', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      await ActivityLog.create([
        {
          user: admin!._id,
          action: 'create',
          resource: 'Service',
        },
        {
          user: admin!._id,
          action: 'update',
          resource: 'Service',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity?action=create')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .get('/api/v1/activity')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/activity/recent', () => {
    it('should get recent activity (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      // Create several activity logs
      await ActivityLog.create([
        {
          user: admin!._id,
          action: 'create',
          resource: 'BlogPost',
          resourceTitle: 'Post 1',
        },
        {
          user: admin!._id,
          action: 'create',
          resource: 'BlogPost',
          resourceTitle: 'Post 2',
        },
        {
          user: admin!._id,
          action: 'update',
          resource: 'Service',
          resourceTitle: 'Service 1',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity/recent')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
      expect(Array.isArray(response.body.data.logs)).toBe(true);
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .get('/api/v1/activity/recent')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/activity/stats', () => {
    it('should get activity statistics (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      // Create activity logs
      await ActivityLog.create([
        {
          user: admin!._id,
          action: 'create',
          resource: 'BlogPost',
        },
        {
          user: admin!._id,
          action: 'create',
          resource: 'Service',
        },
        {
          user: admin!._id,
          action: 'update',
          resource: 'BlogPost',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.byAction).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .get('/api/v1/activity/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/activity/user/:userId', () => {
    it('should get activity by user (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const userToken = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      // Create activity for the user
      await ActivityLog.create([
        {
          user: user!._id,
          action: 'view',
          resource: 'BlogPost',
        },
      ]);

      const response = await request(app)
        .get(`/api/v1/activity/user/${user!._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();
      const user = await User.findOne({ email: 'user@test.com' });

      const response = await request(app)
        .get(`/api/v1/activity/user/${user!._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/activity/resource/:resource', () => {
    it('should get activity by resource (admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      await ActivityLog.create([
        {
          user: admin!._id,
          action: 'create',
          resource: 'BlogPost',
          resourceTitle: 'Test Post',
        },
        {
          user: admin!._id,
          action: 'update',
          resource: 'BlogPost',
          resourceTitle: 'Test Post',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/activity/resource/BlogPost')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .get('/api/v1/activity/resource/BlogPost')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/activity/old', () => {
    it('should delete old activity logs (super admin only)', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      // Create old activity log
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      await ActivityLog.create({
        user: admin!._id,
        action: 'create',
        resource: 'BlogPost',
        createdAt: oldDate,
      });

      const response = await request(app)
        .delete('/api/v1/activity/old')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should fail for non-super-admin users', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken();

      const response = await request(app)
        .delete('/api/v1/activity/old')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
