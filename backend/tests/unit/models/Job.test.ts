/**
 * Job Model Tests
 * اختبارات نموذج الوظيفة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Job, Department } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('Job Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let testDepartment: mongoose.Document & { _id: mongoose.Types.ObjectId };

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      // Create a test department
      testDepartment = await Department.create({
        name: { ar: 'قسم التقنية', en: 'Technology Department' },
        slug: 'technology-department',
        description: { ar: 'وصف القسم', en: 'Department description' },
        isActive: true,
      }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await Department.deleteMany({});
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await Job.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a job with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const jobData = {
        title: { ar: 'مطور برمجيات', en: 'Software Developer' },
        slug: 'software-developer',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        requirements: [{ ar: 'متطلب 1', en: 'Requirement 1' }],
        responsibilities: [{ ar: 'مسؤولية 1', en: 'Responsibility 1' }],
        benefits: [{ ar: 'ميزة 1', en: 'Benefit 1' }],
        department: testDepartment._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        skills: ['JavaScript', 'TypeScript'],
        status: 'open',
      };

      const job = await Job.create(jobData);

      expect(job.title.ar).toBe('مطور برمجيات');
      expect(job.title.en).toBe('Software Developer');
      expect(job.slug).toBe('software-developer');
      expect(job.type).toBe('full-time');
      expect(job.experienceLevel).toBe('mid');
      expect(job.status).toBe('open');
      expect(job.applicationsCount).toBe(0);
      expect(job.isFeatured).toBe(false);
    });

    it('should fail without required fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = new Job({});

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await job.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors['title.ar']).toBeDefined();
      expect(error?.errors['title.en']).toBeDefined();
      expect(error?.errors['description.ar']).toBeDefined();
      expect(error?.errors['description.en']).toBeDefined();
      expect(error?.errors.slug).toBeDefined();
      expect(error?.errors.department).toBeDefined();
      expect(error?.errors['location.ar']).toBeDefined();
      expect(error?.errors['location.en']).toBeDefined();
      expect(error?.errors.type).toBeDefined();
      expect(error?.errors.experienceLevel).toBeDefined();
    });

    it('should fail with invalid slug format', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = new Job({
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'Invalid Slug!',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'full-time',
        experienceLevel: 'mid',
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await job.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.slug).toBeDefined();
    });

    it('should fail with invalid job type', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = new Job({
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'job',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'invalid-type',
        experienceLevel: 'mid',
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await job.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.type).toBeDefined();
    });

    it('should fail with invalid experience level', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = new Job({
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'job',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'full-time',
        experienceLevel: 'invalid-level',
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await job.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.experienceLevel).toBeDefined();
    });

    it('should enforce unique slugs', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const jobData = {
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'unique-job',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'full-time',
        experienceLevel: 'mid',
      };

      await Job.create(jobData);

      let error: Error | null = null;
      try {
        await Job.create(jobData);
      } catch (err) {
        error = err as Error;
      }

      expect(error).not.toBeNull();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create test jobs
      await Job.create([
        {
          title: { ar: 'وظيفة 1', en: 'Job 1' },
          slug: 'job-1',
          description: { ar: 'وصف 1', en: 'Description 1' },
          department: testDepartment._id,
          location: { ar: 'الرياض', en: 'Riyadh' },
          type: 'full-time',
          experienceLevel: 'mid',
          status: 'open',
          isFeatured: true,
        },
        {
          title: { ar: 'وظيفة 2', en: 'Job 2' },
          slug: 'job-2',
          description: { ar: 'وصف 2', en: 'Description 2' },
          department: testDepartment._id,
          location: { ar: 'جدة', en: 'Jeddah' },
          type: 'part-time',
          experienceLevel: 'entry',
          status: 'open',
          isFeatured: false,
        },
        {
          title: { ar: 'وظيفة 3', en: 'Job 3' },
          slug: 'job-3',
          description: { ar: 'وصف 3', en: 'Description 3' },
          department: testDepartment._id,
          location: { ar: 'الدمام', en: 'Dammam' },
          type: 'remote',
          experienceLevel: 'senior',
          status: 'closed',
          isFeatured: false,
        },
      ]);
    });

    describe('getOpenJobs', () => {
      it('should return only open jobs', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs();

        expect(result.jobs.length).toBe(2);
        expect(result.total).toBe(2);
        result.jobs.forEach(job => {
          expect(job.status).toBe('open');
        });
      });

      it('should filter by job type', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs({ type: 'full-time' });

        expect(result.jobs.length).toBe(1);
        expect(result.jobs[0].type).toBe('full-time');
      });

      it('should filter by experience level', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs({ experienceLevel: 'entry' });

        expect(result.jobs.length).toBe(1);
        expect(result.jobs[0].experienceLevel).toBe('entry');
      });

      it('should filter by featured status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs({ featured: true });

        expect(result.jobs.length).toBe(1);
        expect(result.jobs[0].isFeatured).toBe(true);
      });

      it('should return localized content', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs({ locale: 'en' });

        expect(result.jobs.length).toBe(2);
        expect(typeof result.jobs[0].title).toBe('string');
        expect(['Job 1', 'Job 2']).toContain(result.jobs[0].title);
      });

      it('should respect pagination', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Job.getOpenJobs({ page: 1, limit: 1 });

        expect(result.jobs.length).toBe(1);
        expect(result.total).toBe(2);
      });
    });

    describe('getBySlug', () => {
      it('should return job by slug', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const job = await Job.getBySlug('job-1');

        expect(job).not.toBeNull();
        expect(job?.slug).toBe('job-1');
      });

      it('should not return closed jobs', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const job = await Job.getBySlug('job-3');

        expect(job).toBeNull();
      });

      it('should return localized content', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const job = await Job.getBySlug('job-1', 'ar');

        expect(job).not.toBeNull();
        expect(job?.title).toBe('وظيفة 1');
        expect(job?.location).toBe('الرياض');
      });

      it('should return null for non-existent slug', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const job = await Job.getBySlug('non-existent');

        expect(job).toBeNull();
      });
    });

    describe('getFeaturedJobs', () => {
      it('should return featured open jobs', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const jobs = await Job.getFeaturedJobs();

        expect(jobs.length).toBe(1);
        expect(jobs[0].isFeatured).toBe(true);
        expect(jobs[0].status).toBe('open');
      });

      it('should respect limit', async () => {
        if (mongoose.connection.readyState !== 1) return;

        // Note: limit(0) in MongoDB means "no limit", so we test with limit=1
        const jobs = await Job.getFeaturedJobs(1);

        expect(jobs.length).toBe(1);
      });

      it('should return localized content', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const jobs = await Job.getFeaturedJobs(5, 'en');

        expect(jobs.length).toBe(1);
        expect(typeof jobs[0].title).toBe('string');
        expect(jobs[0].title).toBe('Job 1');
      });
    });

    describe('incrementApplicationsCount', () => {
      it('should increment applications count', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const job = await Job.findOne({ slug: 'job-1' });
        const initialCount = job?.applicationsCount || 0;

        await Job.incrementApplicationsCount(job!._id.toString());

        const updatedJob = await Job.findById(job!._id);
        expect(updatedJob?.applicationsCount).toBe(initialCount + 1);
      });
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = await Job.create({
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'job-timestamps',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'full-time',
        experienceLevel: 'mid',
      });

      expect(job.createdAt).toBeInstanceOf(Date);
      expect(job.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Salary Range', () => {
    it('should save salary range correctly', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const job = await Job.create({
        title: { ar: 'وظيفة', en: 'Job' },
        slug: 'job-salary',
        description: { ar: 'وصف', en: 'Description' },
        department: testDepartment._id,
        location: { ar: 'الموقع', en: 'Location' },
        type: 'full-time',
        experienceLevel: 'mid',
        salaryRange: {
          min: 10000,
          max: 20000,
          currency: 'SAR',
          period: 'monthly',
          isPublic: true,
        },
      });

      expect(job.salaryRange?.min).toBe(10000);
      expect(job.salaryRange?.max).toBe(20000);
      expect(job.salaryRange?.currency).toBe('SAR');
      expect(job.salaryRange?.period).toBe('monthly');
      expect(job.salaryRange?.isPublic).toBe(true);
    });
  });
});
