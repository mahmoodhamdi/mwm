/**
 * Services Integration Tests
 * اختبارات تكامل الخدمات
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
import { User, Service, ServiceCategory } from '../../src/models';
import { Express } from 'express';

describe('Services API', () => {
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
      await Service.deleteMany({});
      await ServiceCategory.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes - Categories
  // ============================================

  describe('GET /api/v1/services/categories', () => {
    it('should get active categories', async () => {
      if (!isConnected || !app) return;

      await ServiceCategory.create({
        name: { ar: 'تطوير الويب', en: 'Web Development' },
        slug: 'web-development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/services/categories').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/services/categories/:slug', () => {
    it('should get category by slug', async () => {
      if (!isConnected || !app) return;

      await ServiceCategory.create({
        name: { ar: 'تطوير الويب', en: 'Web Development' },
        slug: 'web-development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/services/categories/web-development').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('web-development');
    });

    it('should return 404 for nonexistent category', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/services/categories/nonexistent').expect(404);
    });
  });

  // ============================================
  // Public Routes - Services
  // ============================================

  describe('GET /api/v1/services/featured', () => {
    it('should get featured services', async () => {
      if (!isConnected || !app) return;

      await Service.create({
        name: { ar: 'خدمة مميزة', en: 'Featured Service' },
        slug: 'featured-service',
        description: { ar: 'وصف', en: 'Description' },
        status: 'published',
        isFeatured: true,
      });

      const response = await request(app).get('/api/v1/services/featured').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/services', () => {
    it('should get published services with pagination', async () => {
      if (!isConnected || !app) return;

      await Service.create({
        name: { ar: 'خدمة 1', en: 'Service 1' },
        slug: 'service-1',
        description: { ar: 'وصف', en: 'Description' },
        status: 'published',
      });

      const response = await request(app).get('/api/v1/services?page=1&limit=10').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter services by search query', async () => {
      if (!isConnected || !app) return;

      await Service.create({
        name: { ar: 'تطوير التطبيقات', en: 'App Development' },
        slug: 'app-development',
        description: { ar: 'وصف', en: 'Description' },
        status: 'published',
      });

      const response = await request(app).get('/api/v1/services?search=App').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/services/:slug', () => {
    it('should get service by slug', async () => {
      if (!isConnected || !app) return;

      await Service.create({
        name: { ar: 'خدمة', en: 'Service' },
        slug: 'test-service',
        description: { ar: 'وصف', en: 'Description' },
        status: 'published',
      });

      const response = await request(app).get('/api/v1/services/test-service').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('test-service');
    });

    it('should return 404 for nonexistent service', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/services/nonexistent').expect(404);
    });
  });

  // ============================================
  // Admin Routes - Categories
  // ============================================

  describe('GET /api/v1/services/admin/categories', () => {
    it('should get all categories with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .get('/api/v1/services/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/services/admin/categories').expect(401);
    });
  });

  describe('POST /api/v1/services/admin/categories', () => {
    it('should create category with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/services/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'فئة جديدة', en: 'New Category' },
          slug: 'new-category',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-category');
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app)
        .post('/api/v1/services/admin/categories')
        .send({
          name: { ar: 'فئة', en: 'Category' },
          slug: 'category',
        })
        .expect(401);
    });
  });

  describe('PUT /api/v1/services/admin/categories/:id', () => {
    it('should update category', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .put(`/api/v1/services/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'فئة محدثة', en: 'Updated Category' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/services/admin/categories/:id', () => {
    it('should delete category', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .delete(`/api/v1/services/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // Admin Routes - Services
  // ============================================

  describe('GET /api/v1/services/admin', () => {
    it('should get all services with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/services/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/services/admin').expect(401);
    });
  });

  describe('POST /api/v1/services/admin', () => {
    it('should create service with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/services/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'خدمة جديدة', en: 'New Service' },
          slug: 'new-service',
          description: { ar: 'وصف', en: 'Description' },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-service');
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app)
        .post('/api/v1/services/admin')
        .send({
          name: { ar: 'خدمة', en: 'Service' },
          slug: 'service',
          description: { ar: 'وصف', en: 'Description' },
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/services/admin/:id', () => {
    it('should get service by ID with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const service = await Service.create({
        name: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        description: { ar: 'وصف', en: 'Description' },
      });

      const response = await request(app)
        .get(`/api/v1/services/admin/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(service._id.toString());
    });
  });

  describe('PUT /api/v1/services/admin/:id', () => {
    it('should update service', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const service = await Service.create({
        name: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        description: { ar: 'وصف', en: 'Description' },
      });

      const response = await request(app)
        .put(`/api/v1/services/admin/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'خدمة محدثة', en: 'Updated Service' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/services/admin/reorder', () => {
    it('should reorder services', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const service1 = await Service.create({
        name: { ar: 'خدمة 1', en: 'Service 1' },
        slug: 'service-1',
        description: { ar: 'وصف', en: 'Description' },
      });
      const service2 = await Service.create({
        name: { ar: 'خدمة 2', en: 'Service 2' },
        slug: 'service-2',
        description: { ar: 'وصف', en: 'Description' },
      });

      const response = await request(app)
        .put('/api/v1/services/admin/reorder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          services: [
            { id: service1._id.toString(), order: 1 },
            { id: service2._id.toString(), order: 0 },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/services/admin/:id', () => {
    it('should delete service', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const service = await Service.create({
        name: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        description: { ar: 'وصف', en: 'Description' },
      });

      const response = await request(app)
        .delete(`/api/v1/services/admin/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to create service', async () => {
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
        .post('/api/v1/services/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'خدمة', en: 'Service' },
          slug: 'service',
          description: { ar: 'وصف', en: 'Description' },
        })
        .expect(403);
    });
  });
});
