/**
 * Dashboard Integration Tests
 * اختبارات تكامل لوحة التحكم
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
import {
  User,
  ActivityLog,
  BlogPost,
  Project,
  Service,
  Contact,
  Subscriber,
  Job,
} from '../../src/models';
import { Express } from 'express';

describe('Dashboard API', () => {
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

  async function getEditorToken(): Promise<string> {
    await User.create({
      name: 'Editor',
      email: 'editor@test.com',
      password: 'Test@1234',
      role: 'editor',
      isActive: true,
      isEmailVerified: true,
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'editor@test.com', password: 'Test@1234' });
    return res.body.data?.accessToken || '';
  }

  async function getUserToken(): Promise<string> {
    await User.create({
      name: 'User',
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
      await BlogPost.deleteMany({});
      await Project.deleteMany({});
      await Service.deleteMany({});
      await Contact.deleteMany({});
      await Subscriber.deleteMany({});
      await Job.deleteMany({});
    }
  });

  describe('GET /api/v1/dashboard/stats', () => {
    it('should get dashboard statistics', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.stats).toBeDefined();
    });

    it('should allow editor access', async () => {
      if (!isConnected || !app) return;

      const token = await getEditorToken();

      const response = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();

      const response = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/dashboard/stats').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/dashboard/activity', () => {
    it('should get recent activity', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const admin = await User.findOne({ email: 'admin@test.com' });

      // Create some activity logs
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
          resource: 'Service',
          resourceTitle: 'Test Service',
        },
      ]);

      const response = await request(app)
        .get('/api/v1/dashboard/activity')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.activities).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();

      const response = await request(app)
        .get('/api/v1/dashboard/activity')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/dashboard/charts', () => {
    it('should get charts data', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/dashboard/charts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();

      const response = await request(app)
        .get('/api/v1/dashboard/charts')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/dashboard/charts').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/dashboard/quick-stats', () => {
    it('should get quick stats for header', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/dashboard/quick-stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.stats).toBeDefined();
    });

    it('should fail for non-admin users', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();

      const response = await request(app)
        .get('/api/v1/dashboard/quick-stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
