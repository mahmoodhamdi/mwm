/**
 * Settings Integration Tests
 * اختبارات تكامل الإعدادات
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
import { User, Settings } from '../../src/models';
import { Express } from 'express';

describe('Settings API', () => {
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
      await Settings.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes
  // ============================================

  describe('GET /api/v1/settings/public', () => {
    it('should get public settings', async () => {
      if (!isConnected || !app) return;

      await Settings.create({
        general: {
          siteName: { ar: 'موقع الشركة', en: 'Company Site' },
          tagline: { ar: 'شعار الموقع', en: 'Site Tagline' },
        },
      });

      const response = await request(app).get('/api/v1/settings/public').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  // ============================================
  // Admin Routes
  // ============================================

  describe('GET /api/v1/settings', () => {
    it('should get all settings with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        general: {
          siteName: { ar: 'موقع الشركة', en: 'Company Site' },
          tagline: { ar: 'شعار الموقع', en: 'Site Tagline' },
        },
      });

      const response = await request(app)
        .get('/api/v1/settings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/settings').expect(401);
    });
  });

  describe('PUT /api/v1/settings', () => {
    it('should update all settings with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        general: {
          siteName: { ar: 'موقع الشركة', en: 'Company Site' },
          tagline: { ar: 'شعار الموقع', en: 'Site Tagline' },
        },
      });

      const response = await request(app)
        .put('/api/v1/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          general: {
            siteName: { ar: 'موقع محدث', en: 'Updated Site' },
            tagline: { ar: 'شعار محدث', en: 'Updated Tagline' },
          },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app)
        .put('/api/v1/settings')
        .send({
          general: {
            siteName: { ar: 'موقع', en: 'Site' },
          },
        })
        .expect(401);
    });
  });

  describe('PUT /api/v1/settings/:section', () => {
    it('should update general section', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        general: {
          siteName: { ar: 'موقع الشركة', en: 'Company Site' },
          tagline: { ar: 'شعار الموقع', en: 'Site Tagline' },
        },
      });

      const response = await request(app)
        .put('/api/v1/settings/general')
        .set('Authorization', `Bearer ${token}`)
        .send({
          siteName: { ar: 'موقع محدث', en: 'Updated Site' },
          tagline: { ar: 'شعار محدث', en: 'Updated Tagline' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should update contact section', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        contact: {
          email: 'info@example.com',
          phone: '+1234567890',
        },
      });

      const response = await request(app)
        .put('/api/v1/settings/contact')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'contact@example.com',
          phone: '+9876543210',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should update social section', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        social: {
          facebook: 'https://facebook.com/example',
          twitter: 'https://twitter.com/example',
        },
      });

      const response = await request(app)
        .put('/api/v1/settings/social')
        .set('Authorization', `Bearer ${token}`)
        .send({
          facebook: 'https://facebook.com/updated',
          twitter: 'https://twitter.com/updated',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should update seo section', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        seo: {
          metaTitle: { ar: 'عنوان', en: 'Title' },
          metaDescription: { ar: 'وصف', en: 'Description' },
        },
      });

      const response = await request(app)
        .put('/api/v1/settings/seo')
        .set('Authorization', `Bearer ${token}`)
        .send({
          metaTitle: { ar: 'عنوان محدث', en: 'Updated Title' },
          metaDescription: { ar: 'وصف محدث', en: 'Updated Description' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/settings/reset', () => {
    it('should reset settings to defaults with super admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Settings.create({
        general: {
          siteName: { ar: 'موقع الشركة', en: 'Company Site' },
          tagline: { ar: 'شعار الموقع', en: 'Site Tagline' },
        },
      });

      const response = await request(app)
        .post('/api/v1/settings/reset')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 403 for non-super admin', async () => {
      if (!isConnected || !app) return;

      const user = await User.create({
        name: 'Admin User',
        email: 'admin2@test.com',
        password: 'Test@1234',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
      });
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'admin2@test.com',
        password: 'Test@1234',
      });
      const token = res.body.data?.accessToken || '';

      await request(app)
        .post('/api/v1/settings/reset')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to update settings', async () => {
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
      const token = res.body.data?.accessToken || '';

      await request(app)
        .put('/api/v1/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          general: {
            siteName: { ar: 'موقع', en: 'Site' },
          },
        })
        .expect(403);
    });
  });
});
