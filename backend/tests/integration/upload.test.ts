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
// Provide fake Cloudinary credentials so the config guard in upload.ts passes
process.env['CLOUDINARY_CLOUD_NAME'] = 'test-cloud';
process.env['CLOUDINARY_API_KEY'] = 'test-api-key';
process.env['CLOUDINARY_API_SECRET'] = 'test-api-secret';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import { User } from '../../src/models';
import { Express } from 'express';
import { getCookieValue } from '../helpers/auth.helper';

// The upload controller does:
//   import { ..., uploadImageToCloudinary, deleteFromCloudinary } from '../utils';
// That resolves to src/utils/index.ts which re-exports from ./upload.
// We mock src/utils/upload (where the functions are defined).
// Because src/utils/index.ts re-exports those functions, Jest's module mock
// will intercept the re-exported references too.
jest.mock('../../src/utils/upload', () => {
  const original = jest.requireActual('../../src/utils/upload');
  return {
    ...original,
    uploadImageToCloudinary: jest.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg',
      public_id: 'mwm/images/test-public-id',
      width: 800,
      height: 600,
      format: 'jpg',
      bytes: 12345,
    }),
    deleteFromCloudinary: jest.fn().mockResolvedValue(undefined),
  };
});

import * as uploadUtils from '../../src/utils/upload';

const mockUploadResult = {
  secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg',
  public_id: 'mwm/images/test-public-id',
  width: 800,
  height: 600,
  format: 'jpg',
  bytes: 12345,
};

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
    return getCookieValue(res, 'accessToken');
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
      await User.deleteMany({});
    }
    // resetMocks:true in jest.config clears mock implementations between tests.
    // Re-apply implementations before every test.
    (uploadUtils.uploadImageToCloudinary as jest.Mock).mockResolvedValue(mockUploadResult);
    (uploadUtils.deleteFromCloudinary as jest.Mock).mockResolvedValue(undefined);
  });

  describe('POST /api/v1/upload/image', () => {
    it('should upload a single image', async () => {
      if (!isConnected || !app) return;

      const token = await getAdminToken();

      // Create a test buffer (fake image)
      const imageBuffer = Buffer.from('fake-image-data');

      // Controller uses sendCreated which returns 201
      const response = await request(app)
        .post('/api/v1/upload/image')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imageBuffer, { filename: 'test-image.jpg', contentType: 'image/jpeg' })
        .expect(201);

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
        .attach('image', imageBuffer, { filename: 'test-image.jpg', contentType: 'image/jpeg' })
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
        .attach('image', imageBuffer, { filename: 'test-image.jpg', contentType: 'image/jpeg' })
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

      // Controller uses sendCreated which returns 201
      const response = await request(app)
        .post('/api/v1/upload/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', imageBuffer1, { filename: 'test-image-1.jpg', contentType: 'image/jpeg' })
        .attach('images', imageBuffer2, { filename: 'test-image-2.jpg', contentType: 'image/jpeg' })
        .expect(201);

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
        .attach('images', imageBuffer, { filename: 'test-image.jpg', contentType: 'image/jpeg' })
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
