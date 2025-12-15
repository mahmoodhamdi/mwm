/**
 * Docker Health Check Integration Tests
 * اختبارات تكامل فحص صحة Docker
 *
 * These tests verify the health check endpoints work correctly
 * for Kubernetes/Docker container orchestration
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import request from 'supertest';
import express from 'express';
import healthRouter from '../../src/routes/health.routes';

const app = express();
app.use('/api/v1/health', healthRouter);

describe('Docker Health Check Endpoints', () => {
  describe('Liveness Probe - GET /api/v1/health/live', () => {
    it('should return 200 OK for liveness check', async () => {
      const response = await request(app).get('/api/v1/health/live').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('alive');
    });

    it('should include timestamp in response', async () => {
      const response = await request(app).get('/api/v1/health/live').expect(200);

      expect(response.body.data.timestamp).toBeDefined();
      expect(new Date(response.body.data.timestamp)).toBeInstanceOf(Date);
    });

    it('should respond quickly (under 100ms)', async () => {
      const start = Date.now();
      await request(app).get('/api/v1/health/live');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Readiness Probe - GET /api/v1/health/ready', () => {
    it('should return readiness status with checks', async () => {
      const response = await request(app).get('/api/v1/health/ready');

      expect(response.body).toHaveProperty('success');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('checks');
    });

    it('should include database check in readiness', async () => {
      const response = await request(app).get('/api/v1/health/ready');

      expect(response.body.data.checks).toHaveProperty('database');
      expect(typeof response.body.data.checks.database).toBe('boolean');
    });

    it('should include cache check in readiness', async () => {
      const response = await request(app).get('/api/v1/health/ready');

      expect(response.body.data.checks).toHaveProperty('cache');
      expect(typeof response.body.data.checks.cache).toBe('boolean');
    });

    it('should include timestamp in response', async () => {
      const response = await request(app).get('/api/v1/health/ready');

      expect(response.body.data.timestamp).toBeDefined();
    });
  });

  describe('Full Health Check - GET /api/v1/health', () => {
    it('should return comprehensive health status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
    });

    it('should include all required health properties', async () => {
      const response = await request(app).get('/api/v1/health');

      const { data } = response.body;
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
      expect(data).toHaveProperty('environment');
      expect(data).toHaveProperty('services');
    });

    it('should include service health details', async () => {
      const response = await request(app).get('/api/v1/health');

      const { services } = response.body.data;
      expect(services).toHaveProperty('database');
      expect(services).toHaveProperty('cache');
      expect(services.database).toHaveProperty('status');
      expect(services.database).toHaveProperty('name');
      expect(services.cache).toHaveProperty('status');
      expect(services.cache).toHaveProperty('name');
    });

    it('should report uptime as number', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(typeof response.body.data.uptime).toBe('number');
      expect(response.body.data.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should include valid environment', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(['development', 'production', 'test']).toContain(response.body.data.environment);
    });
  });

  describe('Health Check Response Format', () => {
    it('should return JSON content type', async () => {
      await request(app)
        .get('/api/v1/health')
        .expect('Content-Type', /application\/json/);

      await request(app)
        .get('/api/v1/health/live')
        .expect('Content-Type', /application\/json/);

      await request(app)
        .get('/api/v1/health/ready')
        .expect('Content-Type', /application\/json/);
    });

    it('should follow consistent API response structure', async () => {
      const endpoints = ['/api/v1/health', '/api/v1/health/live', '/api/v1/health/ready'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.success).toBe('boolean');
        expect(typeof response.body.data).toBe('object');
      }
    });
  });

  describe('Docker Container Lifecycle', () => {
    it('liveness should always return 200 for basic process check', async () => {
      // Liveness probes check if the container is running
      // Should always return 200 if the process is alive
      const response = await request(app).get('/api/v1/health/live').expect(200);

      expect(response.body.success).toBe(true);
    });

    it('readiness should indicate if container can accept traffic', async () => {
      // Readiness probes check if the container is ready to accept requests
      const response = await request(app).get('/api/v1/health/ready');

      // Response should indicate ready or not ready status
      expect(response.body.data).toHaveProperty('status');
      expect(['ready', 'not_ready']).toContain(response.body.data.status);
    });
  });

  describe('Health Check Under Load', () => {
    it('should handle multiple concurrent health checks', async () => {
      const concurrentRequests = 10;
      const promises = Array(concurrentRequests)
        .fill(null)
        .map(() => request(app).get('/api/v1/health/live'));

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    it('should maintain response time under concurrent load', async () => {
      const concurrentRequests = 5;
      const start = Date.now();

      const promises = Array(concurrentRequests)
        .fill(null)
        .map(() => request(app).get('/api/v1/health/live'));

      await Promise.all(promises);
      const duration = Date.now() - start;

      // All requests should complete within 500ms
      expect(duration).toBeLessThan(500);
    });
  });
});
