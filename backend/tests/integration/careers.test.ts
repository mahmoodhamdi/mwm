/**
 * Careers Integration Tests
 * اختبارات تكامل الوظائف
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
import { User, Department, Job, JobApplication } from '../../src/models';
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

describe('Careers API', () => {
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
      await Department.deleteMany({});
      await Job.deleteMany({});
      await JobApplication.deleteMany({});
    }
  });

  // ============================================
  // PUBLIC ROUTES - Jobs
  // ============================================

  describe('GET /api/v1/careers/jobs', () => {
    it('should get open jobs with filters', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .get('/api/v1/careers/jobs')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter jobs by department', async () => {
      if (!isConnected || !app) return;

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const response = await request(app)
        .get('/api/v1/careers/jobs')
        .query({ department: dept._id.toString() })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter jobs by type', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .get('/api/v1/careers/jobs')
        .query({ type: 'full-time' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should filter jobs by experience level', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .get('/api/v1/careers/jobs')
        .query({ experienceLevel: 'mid' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/careers/jobs/featured', () => {
    it('should get featured jobs', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/careers/jobs/featured').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.jobs)).toBe(true);
    });
  });

  describe('GET /api/v1/careers/jobs/:slug', () => {
    it('should get job by slug', async () => {
      if (!isConnected || !app) return;

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const response = await request(app).get('/api/v1/careers/jobs/web-developer').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.slug).toBe('web-developer');
    });
  });

  // ============================================
  // PUBLIC ROUTES - Applications
  // ============================================

  describe('POST /api/v1/careers/apply', () => {
    it('should submit job application', async () => {
      if (!isConnected || !app) return;

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const response = await request(app)
        .post('/api/v1/careers/apply')
        .send({
          job: job._id.toString(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+966501234567',
          resume: 'https://example.com/resume.pdf',
          experience: 3,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.email).toBe('john.doe@example.com');
    });

    it('should fail with invalid email', async () => {
      if (!isConnected || !app) return;

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const response = await request(app)
        .post('/api/v1/careers/apply')
        .send({
          job: job._id.toString(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '+966501234567',
          resume: 'https://example.com/resume.pdf',
          experience: 3,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // ============================================
  // ADMIN ROUTES - Jobs
  // ============================================

  describe('GET /api/v1/careers/admin/jobs', () => {
    it('should get all jobs for admin', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/careers/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toBeDefined();
    });
  });

  describe('GET /api/v1/careers/admin/jobs/:id', () => {
    it('should get job by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'draft',
      });

      const response = await request(app)
        .get(`/api/v1/careers/admin/jobs/${job._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.slug).toBe('web-developer');
    });
  });

  describe('POST /api/v1/careers/admin/jobs', () => {
    it('should create job', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const response = await request(app)
        .post('/api/v1/careers/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { ar: 'مصمم جرافيك', en: 'Graphic Designer' },
          slug: 'graphic-designer',
          description: { ar: 'وصف الوظيفة', en: 'Job description' },
          department: dept._id.toString(),
          location: { ar: 'جدة', en: 'Jeddah' },
          type: 'full-time',
          experienceLevel: 'senior',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.slug).toBe('graphic-designer');
    });
  });

  describe('PUT /api/v1/careers/admin/jobs/:id', () => {
    it('should update job', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'draft',
      });

      const response = await request(app)
        .put(`/api/v1/careers/admin/jobs/${job._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { ar: 'مطور ويب محدث', en: 'Updated Web Developer' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/careers/admin/jobs/:id', () => {
    it('should delete job', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'draft',
      });

      const response = await request(app)
        .delete(`/api/v1/careers/admin/jobs/${job._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/careers/admin/jobs/bulk-status', () => {
    it('should bulk update job status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job1 = await Job.create({
        title: { ar: 'وظيفة 1', en: 'Job 1' },
        slug: 'job-1',
        description: { ar: 'وصف', en: 'Description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'draft',
      });

      const job2 = await Job.create({
        title: { ar: 'وظيفة 2', en: 'Job 2' },
        slug: 'job-2',
        description: { ar: 'وصف', en: 'Description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'draft',
      });

      const response = await request(app)
        .put('/api/v1/careers/admin/jobs/bulk-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ids: [job1._id.toString(), job2._id.toString()],
          status: 'open',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN ROUTES - Applications
  // ============================================

  describe('GET /api/v1/careers/admin/applications', () => {
    it('should get all applications for admin', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/careers/admin/applications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toBeDefined();
    });
  });

  describe('GET /api/v1/careers/admin/applications/:id', () => {
    it('should get application by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const application = await JobApplication.create({
        job: job._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+966501234567',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        status: 'pending',
      });

      const response = await request(app)
        .get(`/api/v1/careers/admin/applications/${application._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.email).toBe('john.doe@example.com');
    });
  });

  describe('PUT /api/v1/careers/admin/applications/:id', () => {
    it('should update application status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const application = await JobApplication.create({
        job: job._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+966501234567',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        status: 'pending',
      });

      const response = await request(app)
        .put(`/api/v1/careers/admin/applications/${application._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'reviewing', notes: 'Good candidate' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/careers/admin/applications/:id', () => {
    it('should delete application', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const application = await JobApplication.create({
        job: job._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+966501234567',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        status: 'pending',
      });

      const response = await request(app)
        .delete(`/api/v1/careers/admin/applications/${application._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/careers/admin/applications/bulk-status', () => {
    it('should bulk update application status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const app1 = await JobApplication.create({
        job: job._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+966501234567',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        status: 'pending',
      });

      const app2 = await JobApplication.create({
        job: job._id,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+966507654321',
        resume: 'https://example.com/resume2.pdf',
        experience: 5,
        status: 'pending',
      });

      const response = await request(app)
        .put('/api/v1/careers/admin/applications/bulk-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ids: [app1._id.toString(), app2._id.toString()],
          status: 'reviewing',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/careers/admin/jobs/:jobId/applications', () => {
    it('should get applications for a specific job', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const response = await request(app)
        .get(`/api/v1/careers/admin/jobs/${job._id}/applications`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toBeDefined();
    });
  });

  describe('GET /api/v1/careers/admin/jobs/:jobId/stats', () => {
    it('should get application statistics for a job', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const dept = await Department.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
      });

      const job = await Job.create({
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        slug: 'web-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: dept._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      });

      const response = await request(app)
        .get(`/api/v1/careers/admin/jobs/${job._id}/stats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
    });
  });
});
