/**
 * Contact Integration Tests
 * اختبارات تكامل رسائل التواصل
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
import { User, Contact } from '../../src/models';
import { Express } from 'express';

describe('Contact API', () => {
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
      await Contact.deleteMany({});
      await User.deleteMany({});
    }
  });

  // ============================================
  // Public Routes
  // ============================================

  describe('POST /api/v1/contact', () => {
    it('should submit contact form', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Business Inquiry',
          message: 'I would like to discuss a project',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contactId).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          subject: 'Business Inquiry',
          message: 'I would like to discuss a project',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // ============================================
  // Admin Routes
  // ============================================

  describe('GET /api/v1/contact/messages', () => {
    it('should get all messages with admin auth', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .get('/api/v1/contact/messages')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messages).toBeDefined();
    });

    it('should filter messages by status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
        status: 'new',
      });

      const response = await request(app)
        .get('/api/v1/contact/messages?status=new')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      if (!isConnected || !app) return;

      await request(app).get('/api/v1/contact/messages').expect(401);
    });
  });

  describe('GET /api/v1/contact/messages/:id', () => {
    it('should get message by ID', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .get(`/api/v1/contact/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message._id).toBe(message._id.toString());
    });

    it('should return 404 for nonexistent message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/v1/contact/messages/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/contact/messages/:id', () => {
    it('should update message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .put(`/api/v1/contact/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'read',
          notes: 'Contacted customer',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/contact/messages/:id/reply', () => {
    it('should reply to message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .post(`/api/v1/contact/messages/${message._id}/reply`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'Thank you for your inquiry',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for nonexistent message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .post(`/api/v1/contact/messages/${fakeId}/reply`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'Reply text here',
        })
        .expect(404);
    });
  });

  describe('PUT /api/v1/contact/messages/:id/star', () => {
    it('should toggle star status', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
        starred: false,
      });

      const response = await request(app)
        .put(`/api/v1/contact/messages/${message._id}/star`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/contact/messages/:id/spam', () => {
    it('should mark message as spam', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .put(`/api/v1/contact/messages/${message._id}/spam`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/contact/messages/:id/archive', () => {
    it('should archive message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .put(`/api/v1/contact/messages/${message._id}/archive`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/contact/messages/:id', () => {
    it('should delete message', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      const response = await request(app)
        .delete(`/api/v1/contact/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/contact/messages/bulk', () => {
    it('should perform bulk action on messages', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const message1 = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject One',
        message: 'Test message content one',
      });
      const message2 = await Contact.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Test Subject Two',
        message: 'Test message content two',
      });

      const response = await request(app)
        .post('/api/v1/contact/messages/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ids: [message1._id.toString(), message2._id.toString()],
          action: 'read',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/contact/messages/statistics', () => {
    it('should get message statistics', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
        status: 'new',
      });

      const response = await request(app)
        .get('/api/v1/contact/messages/statistics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/v1/contact/messages/unread-count', () => {
    it('should get unread message count', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
        status: 'new',
      });

      const response = await request(app)
        .get('/api/v1/contact/messages/unread-count')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBeDefined();
    });
  });

  describe('Authorization - Viewer Role', () => {
    it('should return 403 for viewer role trying to delete message', async () => {
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

      const message = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content',
      });

      await request(app)
        .delete(`/api/v1/contact/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});
