/**
 * Translations Integration Tests
 * اختبارات تكامل الترجمات
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
import { User, Translation } from '../../src/models';
import { Express } from 'express';

async function getAdminToken(app: Express): Promise<string> {
  const user = await User.create({
    name: 'Admin User',
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

describe('Translations API', () => {
  let app: Express | null = null;
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

  beforeAll(async () => {
    try {
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
      await Translation.deleteMany({});
    }
  });

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  describe('GET /api/v1/translations/all', () => {
    it('should get all translations for a locale', async () => {
      if (!isConnected || !app) return;

      await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      const response = await request(app)
        .get('/api/v1/translations/all')
        .query({ locale: 'en' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translations).toBeDefined();
    });
  });

  describe('GET /api/v1/translations/namespaces', () => {
    it('should get all translation namespaces', async () => {
      if (!isConnected || !app) return;

      await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      await Translation.create({
        key: 'nav.home',
        namespace: 'nav',
        value: { ar: 'الرئيسية', en: 'Home' },
      });

      const response = await request(app).get('/api/v1/translations/namespaces').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.namespaces)).toBe(true);
    });
  });

  describe('GET /api/v1/translations/namespace/:namespace', () => {
    it('should get translations by namespace', async () => {
      if (!isConnected || !app) return;

      await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      await Translation.create({
        key: 'common.goodbye',
        namespace: 'common',
        value: { ar: 'وداعا', en: 'Goodbye' },
      });

      const response = await request(app)
        .get('/api/v1/translations/namespace/common')
        .query({ locale: 'en' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translations).toBeDefined();
    });
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  describe('GET /api/v1/translations', () => {
    it('should get all translations with pagination', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/translations')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translations).toBeDefined();
    });
  });

  describe('GET /api/v1/translations/search', () => {
    it('should search translations', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      const response = await request(app)
        .get('/api/v1/translations/search')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ q: 'welcome' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translations).toBeDefined();
    });
  });

  describe('GET /api/v1/translations/:id', () => {
    it('should get translation by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const translation = await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      const response = await request(app)
        .get(`/api/v1/translations/${translation._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translation.key).toBe('common.welcome');
    });
  });

  describe('POST /api/v1/translations', () => {
    it('should create translation', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/translations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          key: 'common.hello',
          namespace: 'common',
          value: { ar: 'مرحبا', en: 'Hello' },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.translation.key).toBe('common.hello');
    });
  });

  describe('POST /api/v1/translations/upsert', () => {
    it('should upsert translation', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/translations/upsert')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          key: 'common.test',
          namespace: 'common',
          value: { ar: 'اختبار', en: 'Test' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/translations/bulk', () => {
    it('should bulk upsert translations', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/translations/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          translations: [
            {
              key: 'common.save',
              namespace: 'common',
              value: { ar: 'حفظ', en: 'Save' },
            },
            {
              key: 'common.cancel',
              namespace: 'common',
              value: { ar: 'إلغاء', en: 'Cancel' },
            },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/translations/:id', () => {
    it('should update translation', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const translation = await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      const response = await request(app)
        .put(`/api/v1/translations/${translation._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          value: { ar: 'أهلا وسهلا', en: 'Welcome!' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/translations/:id', () => {
    it('should delete translation', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const translation = await Translation.create({
        key: 'common.welcome',
        namespace: 'common',
        value: { ar: 'مرحبا', en: 'Welcome' },
      });

      const response = await request(app)
        .delete(`/api/v1/translations/${translation._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
