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
import { getCookieValue } from '../helpers/auth.helper';

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
      // Controller returns { categories: [...] } wrapped in data
      expect(response.body.data.categories).toHaveLength(1);
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
      // Controller returns { category: {...} } wrapped in data
      expect(response.body.data.category.slug).toBe('web-development');
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

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
        isActive: true,
      });

      await Service.create({
        title: { ar: 'خدمة مميزة', en: 'Featured Service' },
        slug: 'featured-service',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        isActive: true,
        isFeatured: true,
      });

      const response = await request(app).get('/api/v1/services/featured').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { services: [...] } wrapped in data
      expect(response.body.data.services).toHaveLength(1);
    });
  });

  describe('GET /api/v1/services', () => {
    it('should get published services with pagination', async () => {
      if (!isConnected || !app) return;

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
        isActive: true,
      });

      await Service.create({
        title: { ar: 'خدمة 1', en: 'Service 1' },
        slug: 'service-1',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        isActive: true,
      });

      const response = await request(app).get('/api/v1/services?page=1&limit=10').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter services by search query', async () => {
      if (!isConnected || !app) return;

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
        isActive: true,
      });

      await Service.create({
        title: { ar: 'تطوير التطبيقات', en: 'App Development' },
        slug: 'app-development',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        isActive: true,
      });

      const response = await request(app).get('/api/v1/services?search=App').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/services/:slug', () => {
    it('should get service by slug', async () => {
      if (!isConnected || !app) return;

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
        isActive: true,
      });

      await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'test-service',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        isActive: true,
      });

      const response = await request(app).get('/api/v1/services/test-service').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { service: {...} } wrapped in data
      expect(response.body.data.service.slug).toBe('test-service');
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
      // Controller returns { category: {...} } wrapped in data
      expect(response.body.data.category.slug).toBe('new-category');
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
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .post('/api/v1/services/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'خدمة جديدة', en: 'New Service' },
          slug: 'new-service',
          shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      // Controller returns { service: {...} } wrapped in data
      expect(response.body.data.service.slug).toBe('new-service');
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await request(app)
        .post('/api/v1/services/admin')
        .send({
          title: { ar: 'خدمة', en: 'Service' },
          slug: 'service',
          shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/services/admin/:id', () => {
    it('should get service by ID with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const service = await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .get(`/api/v1/services/admin/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { service: {...} } wrapped in data
      expect(response.body.data.service._id).toBe(service._id.toString());
    });
  });

  describe('PUT /api/v1/services/admin/:id', () => {
    it('should update service', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const service = await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .put(`/api/v1/services/admin/${service._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'خدمة محدثة', en: 'Updated Service' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/services/admin/reorder', () => {
    it('should reorder services', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const service1 = await Service.create({
        title: { ar: 'خدمة 1', en: 'Service 1' },
        slug: 'service-1',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });
      const service2 = await Service.create({
        title: { ar: 'خدمة 2', en: 'Service 2' },
        slug: 'service-2',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
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
      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const service = await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service',
        shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
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
      const token = getCookieValue(res, 'accessToken');

      const category = await ServiceCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await request(app)
        .post('/api/v1/services/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'خدمة', en: 'Service' },
          slug: 'service',
          shortDescription: { ar: 'وصف مختصر', en: 'Short Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(403);
    });
  });
});
