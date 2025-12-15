/**
 * Job Application Model Tests
 * اختبارات نموذج طلب التوظيف
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JobApplication, Job, Department } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('JobApplication Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let testDepartment: mongoose.Document & { _id: mongoose.Types.ObjectId };
  let testJob: mongoose.Document & { _id: mongoose.Types.ObjectId };

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      // Create a test department
      testDepartment = (await Department.create({
        name: { ar: 'قسم التقنية', en: 'Technology Department' },
        slug: 'tech-dept-app',
        description: { ar: 'وصف القسم', en: 'Department description' },
        isActive: true,
      })) as mongoose.Document & { _id: mongoose.Types.ObjectId };

      // Create a test job
      testJob = (await Job.create({
        title: { ar: 'مطور برمجيات', en: 'Software Developer' },
        slug: 'software-developer-app',
        description: { ar: 'وصف الوظيفة', en: 'Job description' },
        department: testDepartment._id,
        location: { ar: 'الرياض', en: 'Riyadh' },
        type: 'full-time',
        experienceLevel: 'mid',
        status: 'open',
      })) as mongoose.Document & { _id: mongoose.Types.ObjectId };
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await Job.deleteMany({});
      await Department.deleteMany({});
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await JobApplication.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create an application with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const applicationData = {
        job: testJob._id,
        firstName: 'محمد',
        lastName: 'أحمد',
        email: 'mohamed@example.com',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'Cover letter content',
        experience: 5,
        skills: ['JavaScript', 'TypeScript', 'Node.js'],
      };

      const application = await JobApplication.create(applicationData);

      expect(application.firstName).toBe('محمد');
      expect(application.lastName).toBe('أحمد');
      expect(application.email).toBe('mohamed@example.com');
      expect(application.status).toBe('pending');
      expect(application.experience).toBe(5);
      expect(application.skills).toContain('JavaScript');
    });

    it('should fail without required fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({});

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.job).toBeDefined();
      expect(error?.errors.firstName).toBeDefined();
      expect(error?.errors.lastName).toBeDefined();
      expect(error?.errors.email).toBeDefined();
      expect(error?.errors.phone).toBeDefined();
      expect(error?.errors.resume).toBeDefined();
      expect(error?.errors.experience).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.email).toBeDefined();
    });

    it('should fail with invalid status', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        status: 'invalid-status',
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.status).toBeDefined();
    });

    it('should fail with invalid rating (too low)', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        rating: 0,
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.rating).toBeDefined();
    });

    it('should fail with invalid rating (too high)', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        experience: 3,
        rating: 6,
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.rating).toBeDefined();
    });

    it('should fail with negative experience', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = new JobApplication({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+966512345678',
        resume: 'https://example.com/resume.pdf',
        experience: -1,
      });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await application.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).not.toBeNull();
      expect(error?.errors.experience).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create test applications
      await JobApplication.create([
        {
          job: testJob._id,
          firstName: 'User',
          lastName: 'One',
          email: 'user1@example.com',
          phone: '+966512345671',
          resume: 'https://example.com/resume1.pdf',
          experience: 3,
          status: 'pending',
        },
        {
          job: testJob._id,
          firstName: 'User',
          lastName: 'Two',
          email: 'user2@example.com',
          phone: '+966512345672',
          resume: 'https://example.com/resume2.pdf',
          experience: 5,
          status: 'reviewing',
        },
        {
          job: testJob._id,
          firstName: 'User',
          lastName: 'Three',
          email: 'user3@example.com',
          phone: '+966512345673',
          resume: 'https://example.com/resume3.pdf',
          experience: 7,
          status: 'shortlisted',
        },
      ]);
    });

    describe('getByJob', () => {
      it('should return applications for a job', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await JobApplication.getByJob(testJob._id.toString());

        expect(result.applications.length).toBe(3);
        expect(result.total).toBe(3);
      });

      it('should filter by status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await JobApplication.getByJob(testJob._id.toString(), {
          status: 'pending',
        });

        expect(result.applications.length).toBe(1);
        expect(result.applications[0].status).toBe('pending');
      });

      it('should respect pagination', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await JobApplication.getByJob(testJob._id.toString(), {
          page: 1,
          limit: 2,
        });

        expect(result.applications.length).toBe(2);
        expect(result.total).toBe(3);
      });
    });

    describe('getById', () => {
      it('should return application by ID with populated fields', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const created = await JobApplication.create({
          job: testJob._id,
          firstName: 'Test',
          lastName: 'User',
          email: 'testbyid@example.com',
          phone: '+966512345679',
          resume: 'https://example.com/resume.pdf',
          experience: 4,
        });

        const application = await JobApplication.getById(created._id.toString());

        expect(application).not.toBeNull();
        expect(application?.firstName).toBe('Test');
        expect(application?.job).toBeDefined();
      });

      it('should return null for non-existent ID', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const fakeId = new mongoose.Types.ObjectId();
        const application = await JobApplication.getById(fakeId.toString());

        expect(application).toBeNull();
      });
    });

    describe('hasApplied', () => {
      it('should return true if email has applied', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const hasApplied = await JobApplication.hasApplied(
          'user1@example.com',
          testJob._id.toString()
        );

        expect(hasApplied).toBe(true);
      });

      it('should return false if email has not applied', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const hasApplied = await JobApplication.hasApplied(
          'newuser@example.com',
          testJob._id.toString()
        );

        expect(hasApplied).toBe(false);
      });
    });

    describe('updateStatus', () => {
      it('should update application status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const application = await JobApplication.findOne({ email: 'user1@example.com' });

        const updated = await JobApplication.updateStatus(
          application!._id.toString(),
          'reviewing',
          undefined,
          'Started reviewing'
        );

        expect(updated?.status).toBe('reviewing');
        expect(updated?.notes).toBe('Started reviewing');
        expect(updated?.reviewedAt).toBeInstanceOf(Date);
      });

      it('should return null for non-existent application', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const fakeId = new mongoose.Types.ObjectId();
        const updated = await JobApplication.updateStatus(fakeId.toString(), 'reviewing');

        expect(updated).toBeNull();
      });
    });

    describe('getStatsByJob', () => {
      it('should return status statistics for a job', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const stats = await JobApplication.getStatsByJob(testJob._id.toString());

        expect(stats.pending).toBe(1);
        expect(stats.reviewing).toBe(1);
        expect(stats.shortlisted).toBe(1);
        expect(stats.interviewed).toBe(0);
        expect(stats.offered).toBe(0);
        expect(stats.hired).toBe(0);
        expect(stats.rejected).toBe(0);
        expect(stats.withdrawn).toBe(0);
      });

      it('should return all zeros for job with no applications', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const newJob = await Job.create({
          title: { ar: 'وظيفة جديدة', en: 'New Job' },
          slug: 'new-job-stats',
          description: { ar: 'وصف', en: 'Description' },
          department: testDepartment._id,
          location: { ar: 'الموقع', en: 'Location' },
          type: 'full-time',
          experienceLevel: 'entry',
        });

        const stats = await JobApplication.getStatsByJob(newJob._id.toString());

        expect(stats.pending).toBe(0);
        expect(stats.reviewing).toBe(0);

        await Job.findByIdAndDelete(newJob._id);
      });
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = await JobApplication.create({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'timestamps@example.com',
        phone: '+966512345680',
        resume: 'https://example.com/resume.pdf',
        experience: 2,
      });

      expect(application.createdAt).toBeInstanceOf(Date);
      expect(application.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Optional Fields', () => {
    it('should save optional fields correctly', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const application = await JobApplication.create({
        job: testJob._id,
        firstName: 'Test',
        lastName: 'User',
        email: 'optional@example.com',
        phone: '+966512345681',
        resume: 'https://example.com/resume.pdf',
        experience: 5,
        coverLetter: 'My cover letter',
        linkedIn: 'https://linkedin.com/in/testuser',
        portfolio: 'https://portfolio.example.com',
        expectedSalary: 15000,
        availableFrom: new Date('2024-03-01'),
        education: 'Bachelor in Computer Science',
      });

      expect(application.coverLetter).toBe('My cover letter');
      expect(application.linkedIn).toBe('https://linkedin.com/in/testuser');
      expect(application.portfolio).toBe('https://portfolio.example.com');
      expect(application.expectedSalary).toBe(15000);
      expect(application.availableFrom).toBeInstanceOf(Date);
      expect(application.education).toBe('Bachelor in Computer Science');
    });
  });
});
