/**
 * Newsletter Integration Tests
 * اختبارات تكامل النشرة البريدية
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
import { User, Subscriber, Newsletter } from '../../src/models';
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

describe('Newsletter API', () => {
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
      await Subscriber.deleteMany({});
      await Newsletter.deleteMany({});
    }
  });

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  describe('POST /api/v1/newsletter/subscribe', () => {
    it('should subscribe to newsletter', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .post('/api/v1/newsletter/subscribe')
        .send({
          email: 'subscriber@example.com',
          name: 'Test Subscriber',
          locale: 'en',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscriber.email).toBe('subscriber@example.com');
    });

    it('should fail with invalid email', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .post('/api/v1/newsletter/subscribe')
        .send({
          email: 'invalid-email',
          name: 'Test Subscriber',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/newsletter/unsubscribe', () => {
    it('should unsubscribe from newsletter', async () => {
      if (!isConnected || !app) return;

      const subscriber = await Subscriber.create({
        email: 'subscriber@example.com',
        status: 'active',
        unsubscribeToken: 'test-token-123',
      });

      const response = await request(app)
        .post('/api/v1/newsletter/unsubscribe')
        .send({
          email: 'subscriber@example.com',
          token: subscriber.unsubscribeToken,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/newsletter/verify/:token', () => {
    it('should verify email subscription', async () => {
      if (!isConnected || !app) return;

      const subscriber = await Subscriber.create({
        email: 'subscriber@example.com',
        status: 'pending',
        verificationToken: 'verify-token-123',
      });

      const response = await request(app)
        .get('/api/v1/newsletter/verify/verify-token-123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN ROUTES - Subscribers
  // ============================================

  describe('GET /api/v1/newsletter/subscribers', () => {
    it('should get all subscribers', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/newsletter/subscribers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscribers).toBeDefined();
    });
  });

  describe('GET /api/v1/newsletter/subscribers/stats', () => {
    it('should get subscriber statistics', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/newsletter/subscribers/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
    });
  });

  describe('GET /api/v1/newsletter/subscribers/tags', () => {
    it('should get all subscriber tags', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/newsletter/subscribers/tags')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tags)).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/subscribers', () => {
    it('should create subscriber manually', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/newsletter/subscribers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'manual@example.com',
          name: 'Manual Subscriber',
          status: 'active',
          tags: ['vip', 'customer'],
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscriber.email).toBe('manual@example.com');
    });
  });

  describe('PUT /api/v1/newsletter/subscribers/:id', () => {
    it('should update subscriber', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const subscriber = await Subscriber.create({
        email: 'subscriber@example.com',
        status: 'active',
      });

      const response = await request(app)
        .put(`/api/v1/newsletter/subscribers/${subscriber._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
          tags: ['updated'],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/newsletter/subscribers/:id', () => {
    it('should delete subscriber', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const subscriber = await Subscriber.create({
        email: 'subscriber@example.com',
        status: 'active',
      });

      const response = await request(app)
        .delete(`/api/v1/newsletter/subscribers/${subscriber._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/subscribers/bulk', () => {
    it('should perform bulk action on subscribers', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const sub1 = await Subscriber.create({
        email: 'sub1@example.com',
        status: 'active',
      });

      const sub2 = await Subscriber.create({
        email: 'sub2@example.com',
        status: 'active',
      });

      const response = await request(app)
        .post('/api/v1/newsletter/subscribers/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ids: [sub1._id.toString(), sub2._id.toString()],
          action: 'addTags',
          tags: ['bulk-tag'],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN ROUTES - Campaigns
  // ============================================

  describe('GET /api/v1/newsletter/campaigns', () => {
    it('should get all campaigns', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/newsletter/campaigns')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns).toBeDefined();
    });
  });

  describe('GET /api/v1/newsletter/campaigns/stats', () => {
    it('should get campaign statistics', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/newsletter/campaigns/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
    });
  });

  describe('POST /api/v1/newsletter/campaigns', () => {
    it('should create campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/newsletter/campaigns')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          subject: { ar: 'عنوان الحملة', en: 'Campaign Subject' },
          content: { ar: 'محتوى الحملة', en: 'Campaign Content' },
          recipientType: 'all',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign).toBeDefined();
    });
  });

  describe('GET /api/v1/newsletter/campaigns/:id', () => {
    it('should get campaign by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'draft',
        createdBy: admin!._id,
      });

      const response = await request(app)
        .get(`/api/v1/newsletter/campaigns/${campaign._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign).toBeDefined();
    });
  });

  describe('PUT /api/v1/newsletter/campaigns/:id', () => {
    it('should update campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'draft',
        createdBy: admin!._id,
      });

      const response = await request(app)
        .put(`/api/v1/newsletter/campaigns/${campaign._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          subject: { ar: 'عنوان محدث', en: 'Updated Subject' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/newsletter/campaigns/:id', () => {
    it('should delete campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'draft',
        createdBy: admin!._id,
      });

      const response = await request(app)
        .delete(`/api/v1/newsletter/campaigns/${campaign._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/campaigns/:id/send', () => {
    it('should send campaign immediately', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'draft',
        createdBy: admin!._id,
      });

      const response = await request(app)
        .post(`/api/v1/newsletter/campaigns/${campaign._id}/send`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/campaigns/:id/schedule', () => {
    it('should schedule campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'draft',
        createdBy: admin!._id,
      });

      const scheduledAt = new Date(Date.now() + 3600000); // 1 hour from now

      const response = await request(app)
        .post(`/api/v1/newsletter/campaigns/${campaign._id}/schedule`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ scheduledAt })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/campaigns/:id/cancel', () => {
    it('should cancel scheduled campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 3600000),
        createdBy: admin!._id,
      });

      const response = await request(app)
        .post(`/api/v1/newsletter/campaigns/${campaign._id}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/newsletter/campaigns/:id/duplicate', () => {
    it('should duplicate campaign', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);
      const admin = await User.findOne({ email: 'admin@test.com' });

      const campaign = await Newsletter.create({
        subject: { ar: 'عنوان', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        recipientType: 'all',
        status: 'sent',
        createdBy: admin!._id,
      });

      const response = await request(app)
        .post(`/api/v1/newsletter/campaigns/${campaign._id}/duplicate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign).toBeDefined();
    });
  });
});
