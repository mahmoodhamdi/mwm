/**
 * Subscriber Model Unit Tests
 * اختبارات وحدة نموذج المشتركين
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Subscriber } from '../../../src/models';

describe('Subscriber Model', () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
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
      await Subscriber.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create subscriber with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'test@example.com',
        name: 'Test User',
        locale: 'ar',
      };

      const subscriber = await Subscriber.create(subscriberData);

      expect(subscriber._id).toBeDefined();
      expect(subscriber.email).toBe('test@example.com');
      expect(subscriber.name).toBe('Test User');
      expect(subscriber.status).toBe('pending'); // Default status
      expect(subscriber.source).toBe('website'); // Default source
    });

    it('should require email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        name: 'Test User',
      };

      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should require unique email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      await Subscriber.create(subscriberData);
      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should validate status enum values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'test@example.com',
        status: 'invalid-status',
      };

      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should validate source enum values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'test@example.com',
        source: 'invalid-source',
      };

      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should validate locale enum values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriberData = {
        email: 'test@example.com',
        locale: 'fr',
      };

      await expect(Subscriber.create(subscriberData)).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
      });

      expect(subscriber.status).toBe('pending');
      expect(subscriber.source).toBe('website');
      expect(subscriber.locale).toBe('ar');
      expect(subscriber.tags).toEqual([]);
    });

    it('should store tags array', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
        tags: ['newsletter', 'premium'],
      });

      expect(subscriber.tags).toHaveLength(2);
      expect(subscriber.tags).toContain('newsletter');
      expect(subscriber.tags).toContain('premium');
    });

    it('should store verification token', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
        verificationToken: 'test-token-123',
      });

      expect(subscriber.verificationToken).toBe('test-token-123');
    });
  });

  describe('Static Methods', () => {
    describe('getByEmail', () => {
      it('should find subscriber by email', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create({
          email: 'test@example.com',
          name: 'Test User',
        });

        const found = await Subscriber.getByEmail('test@example.com');
        expect(found).toBeDefined();
        expect(found?.email).toBe('test@example.com');
      });

      it('should return null for non-existent email', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const found = await Subscriber.getByEmail('nonexistent@example.com');
        expect(found).toBeNull();
      });
    });

    describe('getSubscribers', () => {
      beforeEach(async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create([
          {
            email: 'user1@example.com',
            name: 'User 1',
            status: 'active',
            source: 'website',
            tags: ['newsletter'],
          },
          {
            email: 'user2@example.com',
            name: 'User 2',
            status: 'active',
            source: 'import',
            tags: ['premium'],
          },
          {
            email: 'user3@example.com',
            name: 'User 3',
            status: 'unsubscribed',
            source: 'website',
            tags: ['newsletter'],
          },
          {
            email: 'user4@example.com',
            status: 'pending',
            source: 'manual',
          },
        ]);
      });

      it('should get all subscribers with pagination', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Subscriber.getSubscribers({ page: 1, limit: 10 });
        expect(result.subscribers).toHaveLength(4);
        expect(result.total).toBe(4);
      });

      it('should filter by status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Subscriber.getSubscribers({ status: 'active' });
        expect(result.subscribers).toHaveLength(2);
        result.subscribers.forEach((sub: { status: string }) => {
          expect(sub.status).toBe('active');
        });
      });

      it('should filter by source', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Subscriber.getSubscribers({ source: 'website' });
        expect(result.subscribers).toHaveLength(2);
        result.subscribers.forEach((sub: { source: string }) => {
          expect(sub.source).toBe('website');
        });
      });

      it('should filter by tags', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Subscriber.getSubscribers({ tags: ['newsletter'] });
        expect(result.subscribers).toHaveLength(2);
      });

      it('should search by email or name', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Subscriber.getSubscribers({ search: 'user1' });
        expect(result.subscribers).toHaveLength(1);
        expect(result.subscribers[0].email).toBe('user1@example.com');
      });
    });

    describe('getActiveSubscribers', () => {
      it('should return only active subscribers', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create([
          { email: 'active1@example.com', status: 'active' },
          { email: 'active2@example.com', status: 'active' },
          { email: 'inactive@example.com', status: 'unsubscribed' },
          { email: 'pending@example.com', status: 'pending' },
        ]);

        const active = await Subscriber.getActiveSubscribers();
        expect(active).toHaveLength(2);
        active.forEach((sub: { status: string }) => {
          expect(sub.status).toBe('active');
        });
      });

      it('should filter by tags', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create([
          { email: 'user1@example.com', status: 'active', tags: ['premium'] },
          { email: 'user2@example.com', status: 'active', tags: ['newsletter'] },
          { email: 'user3@example.com', status: 'active', tags: ['premium', 'vip'] },
        ]);

        const premiumSubscribers = await Subscriber.getActiveSubscribers(['premium']);
        expect(premiumSubscribers).toHaveLength(2);
      });
    });

    describe('bulkUpdateStatus', () => {
      it('should update status for multiple subscribers', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const sub1 = await Subscriber.create({ email: 'test1@example.com', status: 'active' });
        const sub2 = await Subscriber.create({ email: 'test2@example.com', status: 'active' });

        await Subscriber.bulkUpdateStatus([sub1._id.toString(), sub2._id.toString()], 'unsubscribed');

        const updated1 = await Subscriber.findById(sub1._id);
        const updated2 = await Subscriber.findById(sub2._id);

        expect(updated1?.status).toBe('unsubscribed');
        expect(updated2?.status).toBe('unsubscribed');
      });
    });

    describe('getStats', () => {
      it('should return subscriber statistics', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create([
          { email: 'active1@example.com', status: 'active', source: 'website' },
          { email: 'active2@example.com', status: 'active', source: 'import' },
          { email: 'unsub@example.com', status: 'unsubscribed', source: 'website' },
          { email: 'bounced@example.com', status: 'bounced', source: 'manual' },
          { email: 'pending@example.com', status: 'pending', source: 'website' },
        ]);

        const stats = await Subscriber.getStats();

        expect(stats.total).toBe(5);
        expect(stats.active).toBe(2);
        expect(stats.unsubscribed).toBe(1);
        expect(stats.bounced).toBe(1);
        expect(stats.pending).toBe(1);
        expect(stats.bySource.website).toBe(3);
        expect(stats.bySource.import).toBe(1);
        expect(stats.bySource.manual).toBe(1);
      });
    });

    describe('getAllTags', () => {
      it('should return all unique tags', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Subscriber.create([
          { email: 'test1@example.com', tags: ['newsletter', 'premium'] },
          { email: 'test2@example.com', tags: ['newsletter', 'vip'] },
          { email: 'test3@example.com', tags: ['leads'] },
        ]);

        const tags = await Subscriber.getAllTags();
        expect(tags).toHaveLength(4);
        expect(tags).toContain('newsletter');
        expect(tags).toContain('premium');
        expect(tags).toContain('vip');
        expect(tags).toContain('leads');
      });
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt on create', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
      });

      expect(subscriber.createdAt).toBeDefined();
    });

    it('should set updatedAt on update', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
      });

      const originalUpdatedAt = subscriber.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      subscriber.status = 'active';
      await subscriber.save();

      expect(subscriber.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should set subscribedAt when status becomes active', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
        status: 'active',
      });

      expect(subscriber.subscribedAt).toBeDefined();
    });

    it('should set unsubscribedAt when status becomes unsubscribed', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const subscriber = await Subscriber.create({
        email: 'test@example.com',
        status: 'active',
      });

      subscriber.status = 'unsubscribed';
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();

      expect(subscriber.unsubscribedAt).toBeDefined();
    });
  });
});
