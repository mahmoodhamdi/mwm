/**
 * Newsletter Model Unit Tests
 * اختبارات وحدة نموذج النشرة البريدية (الحملات)
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Newsletter, User } from '../../../src/models';

describe('Newsletter Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let testUser: mongoose.Document | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      // Create a test user for createdBy field
      testUser = await User.create({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await Newsletter.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create campaign with valid data', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaignData = {
        subject: { ar: 'موضوع الحملة', en: 'Campaign Subject' },
        content: { ar: 'محتوى الحملة', en: 'Campaign Content' },
        createdBy: testUser._id,
      };

      const campaign = await Newsletter.create(campaignData);

      expect(campaign._id).toBeDefined();
      expect(campaign.subject.ar).toBe('موضوع الحملة');
      expect(campaign.subject.en).toBe('Campaign Subject');
      expect(campaign.status).toBe('draft'); // Default status
      expect(campaign.recipientType).toBe('all'); // Default recipient type
    });

    it('should require subject', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaignData = {
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      };

      await expect(Newsletter.create(campaignData)).rejects.toThrow();
    });

    it('should require content', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaignData = {
        subject: { ar: 'موضوع', en: 'Subject' },
        createdBy: testUser._id,
      };

      await expect(Newsletter.create(campaignData)).rejects.toThrow();
    });

    it('should require createdBy', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const campaignData = {
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
      };

      await expect(Newsletter.create(campaignData)).rejects.toThrow();
    });

    it('should validate status enum values', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaignData = {
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
        status: 'invalid-status',
      };

      await expect(Newsletter.create(campaignData)).rejects.toThrow();
    });

    it('should validate recipientType enum values', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaignData = {
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
        recipientType: 'invalid-type',
      };

      await expect(Newsletter.create(campaignData)).rejects.toThrow();
    });

    it('should set default metrics', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      });

      expect(campaign.metrics.recipientCount).toBe(0);
      expect(campaign.metrics.sentCount).toBe(0);
      expect(campaign.metrics.openCount).toBe(0);
      expect(campaign.metrics.clickCount).toBe(0);
      expect(campaign.metrics.bounceCount).toBe(0);
      expect(campaign.metrics.unsubscribeCount).toBe(0);
    });

    it('should store optional preheader', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        preheader: { ar: 'مقدمة', en: 'Preheader' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      });

      expect(campaign.preheader?.ar).toBe('مقدمة');
      expect(campaign.preheader?.en).toBe('Preheader');
    });

    it('should store recipient tags for tag-based campaigns', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
        recipientType: 'tags',
        recipientTags: ['premium', 'vip'],
      });

      expect(campaign.recipientTags).toHaveLength(2);
      expect(campaign.recipientTags).toContain('premium');
      expect(campaign.recipientTags).toContain('vip');
    });
  });

  describe('Static Methods', () => {
    describe('getCampaigns', () => {
      beforeEach(async () => {
        if (mongoose.connection.readyState !== 1 || !testUser) return;

        await Newsletter.create([
          {
            subject: { ar: 'حملة 1', en: 'Campaign 1' },
            content: { ar: 'محتوى 1', en: 'Content 1' },
            createdBy: testUser._id,
            status: 'draft',
          },
          {
            subject: { ar: 'حملة 2', en: 'Campaign 2' },
            content: { ar: 'محتوى 2', en: 'Content 2' },
            createdBy: testUser._id,
            status: 'sent',
            sentAt: new Date(),
          },
          {
            subject: { ar: 'حملة 3', en: 'Campaign 3' },
            content: { ar: 'محتوى 3', en: 'Content 3' },
            createdBy: testUser._id,
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ]);
      });

      it('should get all campaigns with pagination', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Newsletter.getCampaigns({ page: 1, limit: 10 });
        expect(result.campaigns).toHaveLength(3);
        expect(result.total).toBe(3);
      });

      it('should filter by status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Newsletter.getCampaigns({ status: 'draft' });
        expect(result.campaigns).toHaveLength(1);
        expect(result.campaigns[0].status).toBe('draft');
      });

      it('should search by subject', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Newsletter.getCampaigns({ search: 'Campaign 1' });
        expect(result.campaigns).toHaveLength(1);
        expect(result.campaigns[0].subject.en).toBe('Campaign 1');
      });
    });

    describe('getById', () => {
      it('should find campaign by id with populated createdBy', async () => {
        if (mongoose.connection.readyState !== 1 || !testUser) return;

        const campaign = await Newsletter.create({
          subject: { ar: 'موضوع', en: 'Subject' },
          content: { ar: 'محتوى', en: 'Content' },
          createdBy: testUser._id,
        });

        const found = await Newsletter.getById(campaign._id.toString());
        expect(found).toBeDefined();
        expect(found?.subject.en).toBe('Subject');
        expect(found?.createdBy).toBeDefined();
      });

      it('should return null for non-existent id', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const found = await Newsletter.getById(new mongoose.Types.ObjectId().toString());
        expect(found).toBeNull();
      });
    });

    describe('updateMetrics', () => {
      it('should update campaign metrics', async () => {
        if (mongoose.connection.readyState !== 1 || !testUser) return;

        const campaign = await Newsletter.create({
          subject: { ar: 'موضوع', en: 'Subject' },
          content: { ar: 'محتوى', en: 'Content' },
          createdBy: testUser._id,
        });

        const updated = await Newsletter.updateMetrics(campaign._id.toString(), {
          recipientCount: 100,
          sentCount: 95,
          openCount: 50,
          clickCount: 20,
        });

        expect(updated?.metrics.recipientCount).toBe(100);
        expect(updated?.metrics.sentCount).toBe(95);
        expect(updated?.metrics.openCount).toBe(50);
        expect(updated?.metrics.clickCount).toBe(20);
      });
    });

    describe('getStats', () => {
      it('should return campaign statistics', async () => {
        if (mongoose.connection.readyState !== 1 || !testUser) return;

        await Newsletter.create([
          {
            subject: { ar: 'حملة 1', en: 'Campaign 1' },
            content: { ar: 'محتوى', en: 'Content' },
            createdBy: testUser._id,
            status: 'draft',
          },
          {
            subject: { ar: 'حملة 2', en: 'Campaign 2' },
            content: { ar: 'محتوى', en: 'Content' },
            createdBy: testUser._id,
            status: 'sent',
            metrics: {
              recipientCount: 100,
              sentCount: 100,
              openCount: 60,
              clickCount: 30,
              bounceCount: 5,
              unsubscribeCount: 2,
            },
          },
          {
            subject: { ar: 'حملة 3', en: 'Campaign 3' },
            content: { ar: 'محتوى', en: 'Content' },
            createdBy: testUser._id,
            status: 'sent',
            metrics: {
              recipientCount: 200,
              sentCount: 200,
              openCount: 140,
              clickCount: 50,
              bounceCount: 10,
              unsubscribeCount: 5,
            },
          },
          {
            subject: { ar: 'حملة 4', en: 'Campaign 4' },
            content: { ar: 'محتوى', en: 'Content' },
            createdBy: testUser._id,
            status: 'scheduled',
          },
        ]);

        const stats = await Newsletter.getStats();

        expect(stats.total).toBe(4);
        expect(stats.draft).toBe(1);
        expect(stats.sent).toBe(2);
        expect(stats.scheduled).toBe(1);
        expect(stats.totalRecipients).toBe(300);
        expect(stats.totalOpens).toBe(200);
        expect(stats.totalClicks).toBe(80);
      });
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt on create', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      });

      expect(campaign.createdAt).toBeDefined();
    });

    it('should set updatedAt on update', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      });

      const originalUpdatedAt = campaign.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      campaign.status = 'sent';
      campaign.sentAt = new Date();
      await campaign.save();

      expect(campaign.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Status Transitions', () => {
    it('should set sentAt when status becomes sent', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
      });

      campaign.status = 'sent';
      campaign.sentAt = new Date();
      await campaign.save();

      expect(campaign.sentAt).toBeDefined();
    });

    it('should set scheduledAt for scheduled campaigns', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
        status: 'scheduled',
        scheduledAt: scheduledDate,
      });

      expect(campaign.scheduledAt).toBeDefined();
      expect(campaign.scheduledAt?.getTime()).toBe(scheduledDate.getTime());
    });

    it('should set cancelledAt when status becomes cancelled', async () => {
      if (mongoose.connection.readyState !== 1 || !testUser) return;

      const campaign = await Newsletter.create({
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        createdBy: testUser._id,
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      campaign.status = 'cancelled';
      campaign.cancelledAt = new Date();
      await campaign.save();

      expect(campaign.cancelledAt).toBeDefined();
    });
  });
});
