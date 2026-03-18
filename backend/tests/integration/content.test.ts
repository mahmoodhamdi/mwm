/**
 * Content Integration Tests
 * اختبارات تكامل المحتوى
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
import { User, SiteContent } from '../../src/models';
import { Express } from 'express';
import { getCookieValue } from '../helpers/auth.helper';

describe('Content API', () => {
  let app: Express | null = null;
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

  // Helper function to create admin user and get token
  async function getAdminToken(): Promise<string> {
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Test@1234',
      role: 'super_admin',
      isActive: true,
      isEmailVerified: true,
    });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@test.com',
      password: 'Test@1234',
    });
    return getCookieValue(res, 'accessToken');
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
      await SiteContent.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes
  // ============================================

  describe('GET /api/v1/content/sections', () => {
    it('should get all content sections', async () => {
      if (!isConnected || !app) return;

      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان الصفحة', en: 'Page Title' },
      });

      const response = await request(app).get('/api/v1/content/sections').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/v1/content/section/:section', () => {
    it('should get content by section', async () => {
      if (!isConnected || !app) return;

      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان الصفحة', en: 'Page Title' },
      });

      const response = await request(app).get('/api/v1/content/section/home').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/v1/content/:key', () => {
    it('should get content by key', async () => {
      if (!isConnected || !app) return;

      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان الصفحة', en: 'Page Title' },
      });

      const response = await request(app).get('/api/v1/content/home.title').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content.key).toBe('home.title');
    });

    it('should return 404 for nonexistent content', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/content/nonexistent.key').expect(404);
    });
  });

  // ============================================
  // Admin Routes
  // ============================================

  describe('GET /api/v1/content', () => {
    it('should get all content with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان', en: 'Title' },
      });

      const response = await request(app)
        .get('/api/v1/content')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/content').expect(401);
    });
  });

  describe('POST /api/v1/content', () => {
    it('should create content with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/content')
        .set('Authorization', `Bearer ${token}`)
        .send({
          key: 'about.title',
          section: 'about',
          content: { ar: 'من نحن', en: 'About Us' },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content.key).toBe('about.title');
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app)
        .post('/api/v1/content')
        .send({
          key: 'about.title',
          section: 'about',
          content: { ar: 'من نحن', en: 'About Us' },
        })
        .expect(401);
    });
  });

  describe('PUT /api/v1/content/:key', () => {
    it('should update content', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان', en: 'Title' },
      });

      const response = await request(app)
        .put('/api/v1/content/home.title')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: { ar: 'عنوان محدث', en: 'Updated Title' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for nonexistent content', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      await request(app)
        .put('/api/v1/content/nonexistent.key')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: { ar: 'قيمة', en: 'Value' },
        })
        .expect(404);
    });
  });

  describe('PUT /api/v1/content/:key/upsert', () => {
    it('should upsert content (create if not exists)', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .put('/api/v1/content/new.key/upsert')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: { ar: 'قيمة جديدة', en: 'New Value' },
          section: 'home',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content.key).toBe('new.key');
    });

    it('should upsert content (update if exists)', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await SiteContent.create({
        key: 'existing.key',
        section: 'home',
        content: { ar: 'قيمة قديمة', en: 'Old Value' },
      });

      const response = await request(app)
        .put('/api/v1/content/existing.key/upsert')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: { ar: 'قيمة محدثة', en: 'Updated Value' },
          section: 'home',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/content/bulk', () => {
    it('should bulk upsert content', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/content/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({
          contents: [
            {
              key: 'home.title',
              data: { section: 'home', content: { ar: 'عنوان 1', en: 'Title 1' } },
            },
            {
              key: 'home.subtitle',
              data: { section: 'home', content: { ar: 'عنوان 2', en: 'Title 2' } },
            },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/content/:key', () => {
    it('should delete content', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await SiteContent.create({
        key: 'home.title',
        section: 'home',
        content: { ar: 'عنوان', en: 'Title' },
      });

      const response = await request(app)
        .delete('/api/v1/content/home.title')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for nonexistent content', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      await request(app)
        .delete('/api/v1/content/nonexistent.key')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to create content', async () => {
      if (!isConnected || !app) return;

      const user = await User.create({
        name: 'Viewer User',
        email: 'viewer@test.com',
        password: 'Test@1234',
        role: 'viewer',
        isActive: true,
        isEmailVerified: true,
      });
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'viewer@test.com',
        password: 'Test@1234',
      });
      const token = getCookieValue(res, 'accessToken');

      await request(app)
        .post('/api/v1/content')
        .set('Authorization', `Bearer ${token}`)
        .send({
          key: 'about.title',
          section: 'about',
          content: { ar: 'من نحن', en: 'About Us' },
        })
        .expect(403);
    });
  });
});
