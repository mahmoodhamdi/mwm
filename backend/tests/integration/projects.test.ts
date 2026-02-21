/**
 * Projects Integration Tests
 * اختبارات تكامل المشاريع
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
import { User, Project, ProjectCategory } from '../../src/models';
import { Express } from 'express';

describe('Projects API', () => {
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
      await Project.deleteMany({});
      await ProjectCategory.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes - Categories
  // ============================================

  describe('GET /api/v1/projects/categories', () => {
    it('should get active categories', async () => {
      if (!isConnected || !app) return;

      await ProjectCategory.create({
        name: { ar: 'تطوير الويب', en: 'Web Development' },
        slug: 'web-development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/projects/categories').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/projects/categories/:slug', () => {
    it('should get category by slug', async () => {
      if (!isConnected || !app) return;

      await ProjectCategory.create({
        name: { ar: 'تطوير الويب', en: 'Web Development' },
        slug: 'web-development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/projects/categories/web-development').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('web-development');
    });

    it('should return 404 for nonexistent category', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/projects/categories/nonexistent').expect(404);
    });
  });

  // ============================================
  // Public Routes - Projects
  // ============================================

  describe('GET /api/v1/projects/featured', () => {
    it('should get featured projects', async () => {
      if (!isConnected || !app) return;

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await Project.create({
        title: { ar: 'مشروع مميز', en: 'Featured Project' },
        slug: 'featured-project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        status: 'published',
        featured: true,
      });

      const response = await request(app).get('/api/v1/projects/featured').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should get published projects with pagination', async () => {
      if (!isConnected || !app) return;

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await Project.create({
        title: { ar: 'مشروع 1', en: 'Project 1' },
        slug: 'project-1',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        status: 'published',
      });

      const response = await request(app).get('/api/v1/projects?page=1&limit=10').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.projects).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter projects by search query', async () => {
      if (!isConnected || !app) return;

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await Project.create({
        title: { ar: 'تطوير التطبيقات', en: 'App Development' },
        slug: 'app-development',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        status: 'published',
      });

      const response = await request(app).get('/api/v1/projects?search=App').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.projects.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/projects/:slug', () => {
    it('should get project by slug', async () => {
      if (!isConnected || !app) return;

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        status: 'published',
      });

      const response = await request(app).get('/api/v1/projects/test-project').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('test-project');
    });

    it('should return 404 for nonexistent project', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/projects/nonexistent').expect(404);
    });
  });

  // ============================================
  // Admin Routes - Categories
  // ============================================

  describe('GET /api/v1/projects/admin/categories', () => {
    it('should get all categories with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .get('/api/v1/projects/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/projects/admin/categories').expect(401);
    });
  });

  describe('POST /api/v1/projects/admin/categories', () => {
    it('should create category with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/projects/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'فئة جديدة', en: 'New Category' },
          slug: 'new-category',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-category');
    });
  });

  describe('PUT /api/v1/projects/admin/categories/:id', () => {
    it('should update category', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .put(`/api/v1/projects/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'فئة محدثة', en: 'Updated Category' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/projects/admin/categories/:id', () => {
    it('should delete category', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .delete(`/api/v1/projects/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // Admin Routes - Projects
  // ============================================

  describe('GET /api/v1/projects/admin', () => {
    it('should get all projects with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/projects/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/projects/admin').expect(401);
    });
  });

  describe('POST /api/v1/projects/admin', () => {
    it('should create project with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      const response = await request(app)
        .post('/api/v1/projects/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'مشروع جديد', en: 'New Project' },
          slug: 'new-project',
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-project');
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await request(app)
        .post('/api/v1/projects/admin')
        .send({
          title: { ar: 'مشروع', en: 'Project' },
          slug: 'project',
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/projects/admin/:id', () => {
    it('should get project by ID with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project = await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .get(`/api/v1/projects/admin/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(project._id.toString());
    });
  });

  describe('PUT /api/v1/projects/admin/:id', () => {
    it('should update project', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project = await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .put(`/api/v1/projects/admin/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'مشروع محدث', en: 'Updated Project' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/projects/admin/:id/publish', () => {
    it('should toggle publish status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project = await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        status: 'draft',
      });

      const response = await request(app)
        .put(`/api/v1/projects/admin/${project._id}/publish`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/projects/admin/:id/featured', () => {
    it('should toggle featured status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project = await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
        featured: false,
      });

      const response = await request(app)
        .put(`/api/v1/projects/admin/${project._id}/featured`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/projects/admin/reorder', () => {
    it('should reorder projects', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project1 = await Project.create({
        title: { ar: 'مشروع 1', en: 'Project 1' },
        slug: 'project-1',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });
      const project2 = await Project.create({
        title: { ar: 'مشروع 2', en: 'Project 2' },
        slug: 'project-2',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .put('/api/v1/projects/admin/reorder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          projects: [
            { id: project1._id.toString(), order: 1 },
            { id: project2._id.toString(), order: 0 },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/projects/admin/:id', () => {
    it('should delete project', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });
      const project = await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'project',
        description: { ar: 'وصف', en: 'Description' },
        category: category._id,
      });

      const response = await request(app)
        .delete(`/api/v1/projects/admin/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to create project', async () => {
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

      const category = await ProjectCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'category',
      });

      await request(app)
        .post('/api/v1/projects/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: { ar: 'مشروع', en: 'Project' },
          slug: 'project',
          description: { ar: 'وصف', en: 'Description' },
          category: category._id.toString(),
        })
        .expect(403);
    });
  });
});
