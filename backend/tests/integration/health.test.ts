/**
 * Health Endpoint Integration Tests
 * اختبارات تكامل نقطة الصحة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import request from 'supertest';
import express from 'express';
import healthRouter from '../../src/routes/health.routes';

// Create a test app
const app = express();
app.use('/api/v1/health', healthRouter);

describe('Health Endpoints', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/v1/health').expect('Content-Type', /json/);

      // Status might be unhealthy in test environment (no real DB connection)
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data.services).toHaveProperty('database');
      expect(response.body.data.services).toHaveProperty('cache');
    });

    it('should return database and cache status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body.data.services.database).toHaveProperty('status');
      expect(response.body.data.services.database).toHaveProperty('name');
      expect(response.body.data.services.cache).toHaveProperty('status');
      expect(response.body.data.services.cache).toHaveProperty('name');
    });
  });

  describe('GET /api/v1/health/live', () => {
    it('should return alive status', async () => {
      const response = await request(app)
        .get('/api/v1/health/live')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('alive');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/api/v1/health/ready')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('checks');
      expect(response.body.data.checks).toHaveProperty('database');
      expect(response.body.data.checks).toHaveProperty('cache');
    });
  });
});
