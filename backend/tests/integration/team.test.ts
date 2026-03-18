/**
 * Team Integration Tests
 * اختبارات تكامل الفريق
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
import { User, TeamMember, Department } from '../../src/models';
import { Express } from 'express';
import { getCookieValue } from '../helpers/auth.helper';

describe('Team API', () => {
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
      await TeamMember.deleteMany({});
      await Department.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes - Departments
  // ============================================

  describe('GET /api/v1/team/departments', () => {
    it('should get active departments', async () => {
      if (!isConnected || !app) return;

      await Department.create({
        name: { ar: 'قسم التطوير', en: 'Development Department' },
        slug: 'development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/team/departments').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { departments: [...] } inside data
      expect(response.body.data.departments).toHaveLength(1);
    });
  });

  describe('GET /api/v1/team/departments/:slug', () => {
    it('should get department by slug', async () => {
      if (!isConnected || !app) return;

      await Department.create({
        name: { ar: 'قسم التطوير', en: 'Development Department' },
        slug: 'development',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/team/departments/development').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { department: {...} } inside data
      expect(response.body.data.department.slug).toBe('development');
    });

    it('should return 404 for nonexistent department', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/team/departments/nonexistent').expect(404);
    });
  });

  // ============================================
  // Public Routes - Team Members
  // ============================================

  describe('GET /api/v1/team/featured', () => {
    it('should get featured team members', async () => {
      if (!isConnected || !app) return;

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohammed' },
        slug: 'ahmed-mohammed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isActive: true,
        isFeatured: true,
      });

      const response = await request(app).get('/api/v1/team/featured').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { members: [...] } inside data
      expect(response.body.data.members).toHaveLength(1);
    });
  });

  describe('GET /api/v1/team/leaders', () => {
    it('should get team leaders', async () => {
      if (!isConnected || !app) return;

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await TeamMember.create({
        name: { ar: 'قائد الفريق', en: 'Team Leader' },
        slug: 'team-leader',
        position: { ar: 'قائد', en: 'Leader' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isActive: true,
        isLeader: true,
      });

      const response = await request(app).get('/api/v1/team/leaders').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { leaders: [...] } inside data
      expect(response.body.data.leaders).toHaveLength(1);
    });
  });

  describe('GET /api/v1/team', () => {
    it('should get all active team members', async () => {
      if (!isConnected || !app) return;

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isActive: true,
      });

      const response = await request(app).get('/api/v1/team').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { members: [...], pagination: {...} } inside data
      expect(response.body.data.members).toBeDefined();
    });
  });

  describe('GET /api/v1/team/:slug', () => {
    it('should get team member by slug', async () => {
      if (!isConnected || !app) return;

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohammed' },
        slug: 'ahmed-mohammed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isActive: true,
      });

      const response = await request(app).get('/api/v1/team/ahmed-mohammed').expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { member: {...} } inside data
      expect(response.body.data.member.slug).toBe('ahmed-mohammed');
    });

    it('should return 404 for nonexistent member', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/team/nonexistent').expect(404);
    });
  });

  // ============================================
  // Admin Routes - Departments
  // ============================================

  describe('GET /api/v1/team/admin/departments', () => {
    it('should get all departments with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      const response = await request(app)
        .get('/api/v1/team/admin/departments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/team/admin/departments').expect(401);
    });
  });

  describe('POST /api/v1/team/admin/departments', () => {
    it('should create department with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/team/admin/departments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'قسم جديد', en: 'New Department' },
          slug: 'new-department',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      // Controller returns { message: ..., department: {...} } inside data
      expect(response.body.data.department.slug).toBe('new-department');
    });
  });

  describe('PUT /api/v1/team/admin/departments/:id', () => {
    it('should update department', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      const response = await request(app)
        .put(`/api/v1/team/admin/departments/${department._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'قسم محدث', en: 'Updated Department' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/team/admin/departments/:id', () => {
    it('should delete department', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      const response = await request(app)
        .delete(`/api/v1/team/admin/departments/${department._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // Admin Routes - Team Members
  // ============================================

  describe('GET /api/v1/team/admin', () => {
    it('should get all team members with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .get('/api/v1/team/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/team/admin').expect(401);
    });
  });

  describe('POST /api/v1/team/admin', () => {
    it('should create team member with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      const response = await request(app)
        .post('/api/v1/team/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'عضو جديد', en: 'New Member' },
          slug: 'new-member',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة ذاتية قصيرة', en: 'Short bio text' },
          avatar: 'https://example.com/avatar.jpg',
          department: department._id.toString(),
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await request(app)
        .post('/api/v1/team/admin')
        .send({
          name: { ar: 'عضو', en: 'Member' },
          slug: 'new-member',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
          avatar: 'https://example.com/avatar.jpg',
          department: department._id.toString(),
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/team/admin/:id', () => {
    it('should get team member by ID with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
      });

      const response = await request(app)
        .get(`/api/v1/team/admin/${member._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Controller returns { member: {...} } inside data
      expect(response.body.data.member._id).toBe(member._id.toString());
    });
  });

  describe('PUT /api/v1/team/admin/:id', () => {
    it('should update team member', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
      });

      const response = await request(app)
        .put(`/api/v1/team/admin/${member._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'عضو محدث', en: 'Updated Member' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/team/admin/:id/active', () => {
    it('should toggle active status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isActive: false,
      });

      const response = await request(app)
        .put(`/api/v1/team/admin/${member._id}/active`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/team/admin/:id/featured', () => {
    it('should toggle featured status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isFeatured: false,
      });

      const response = await request(app)
        .put(`/api/v1/team/admin/${member._id}/featured`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/team/admin/:id/leader', () => {
    it('should toggle leader status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
        isLeader: false,
      });

      const response = await request(app)
        .put(`/api/v1/team/admin/${member._id}/leader`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/team/admin/reorder', () => {
    it('should reorder team members', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member1 = await TeamMember.create({
        name: { ar: 'عضو 1', en: 'Member 1' },
        slug: 'member-1',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
      });
      const member2 = await TeamMember.create({
        name: { ar: 'عضو 2', en: 'Member 2' },
        slug: 'member-2',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
      });

      const response = await request(app)
        .put('/api/v1/team/admin/reorder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          members: [
            { id: member1._id.toString(), order: 1 },
            { id: member2._id.toString(), order: 0 },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/team/admin/:id', () => {
    it('should delete team member', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });
      const member = await TeamMember.create({
        name: { ar: 'عضو', en: 'Member' },
        slug: 'member',
        position: { ar: 'عنوان', en: 'Title' },
        bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
        avatar: 'https://example.com/avatar.jpg',
        department: department._id,
      });

      const response = await request(app)
        .delete(`/api/v1/team/admin/${member._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to create team member', async () => {
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

      const department = await Department.create({
        name: { ar: 'قسم', en: 'Department' },
        slug: 'dept',
      });

      await request(app)
        .post('/api/v1/team/admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: { ar: 'عضو', en: 'Member' },
          slug: 'new-member',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة ذاتية', en: 'Bio text' },
          avatar: 'https://example.com/avatar.jpg',
          department: department._id.toString(),
        })
        .expect(403);
    });
  });
});
