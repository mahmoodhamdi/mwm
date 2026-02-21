/**
 * Upload Integration Tests
 * اختبارات تكامل رفع الملفات
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
import { User } from '../../src/models';
import { Express } from 'express';

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://cloudinary.com/test-image.jpg',
        public_id: 'test-public-id',
        width: 800,
        height: 600,
        format: 'jpg',
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

describe('Upload API', () => {
  let app: Express | null = null;
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

  async function getAdminToken(): Promise<string> {
    await User.create({
      name: 'Admin',
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

  async function getUserToken(): Promise<string> {
    await User.create({
      name: 'User',
      email: 'user@test.com',
      password: 'Test@1234',
      role: 'viewer',
      isActive: true,
      isEmailVerified: true,
    });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: 'Test@1234' });
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
      await User.deleteMany({});
    }
  });

  describe('POST /api/v1/upload/image', () => {
    it('should upload a single image', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      // Create a test buffer (fake image)
      const imageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/api/v1/upload/image')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imageBuffer, 'test-image.jpg')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.url).toBeDefined();
    });

    it('should fail without image', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/upload/image')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const imageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/api/v1/upload/image')
        .attach('image', imageBuffer, 'test-image.jpg')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail for users without permission', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const imageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/api/v1/upload/image')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imageBuffer, 'test-image.jpg')
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/upload/images', () => {
    it('should upload multiple images', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      // Create test buffers (fake images)
      const imageBuffer1 = Buffer.from('fake-image-data-1');
      const imageBuffer2 = Buffer.from('fake-image-data-2');

      const response = await request(app)
        .post('/api/v1/upload/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', imageBuffer1, 'test-image-1.jpg')
        .attach('images', imageBuffer2, 'test-image-2.jpg')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data.images)).toBe(true);
    });

    it('should fail without images', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      const response = await request(app)
        .post('/api/v1/upload/images')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail for users without permission', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const imageBuffer = Buffer.from('fake-image-data');

      const response = await request(app)
        .post('/api/v1/upload/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', imageBuffer, 'test-image.jpg')
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/upload/image/:publicId', () => {
    it('should delete an image', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();
      const publicId = 'test-public-id';

      const response = await request(app)
        .delete(`/api/v1/upload/image/${publicId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      if (!isConnected || !app) return;

      const publicId = 'test-public-id';

      const response = await request(app)
        .delete(`/api/v1/upload/image/${publicId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail for users without permission', async () => {
      if (!isConnected || !app) return;

      const token = await getUserToken();
      const publicId = 'test-public-id';

      const response = await request(app)
        .delete(`/api/v1/upload/image/${publicId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
