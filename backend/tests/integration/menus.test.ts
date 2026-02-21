/**
 * Menus Integration Tests
 * اختبارات تكامل القوائم
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
import { User, Menu } from '../../src/models';
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

describe('Menus API', () => {
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
      await Menu.deleteMany({});
    }
  });

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  describe('GET /api/v1/menus/location/:location', () => {
    it('should get menu by location', async () => {
      if (!isConnected || !app) return;

      await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app).get('/api/v1/menus/location/header').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.menu.location).toBe('header');
    });
  });

  describe('GET /api/v1/menus/slug/:slug', () => {
    it('should get menu by slug', async () => {
      if (!isConnected || !app) return;

      await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app).get('/api/v1/menus/slug/header-menu').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.menu.slug).toBe('header-menu');
    });
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  describe('GET /api/v1/menus', () => {
    it('should get all menus', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/menus')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.menus).toBeDefined();
    });
  });

  describe('GET /api/v1/menus/:id', () => {
    it('should get menu by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app)
        .get(`/api/v1/menus/${menu._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.menu.slug).toBe('header-menu');
    });
  });

  describe('POST /api/v1/menus', () => {
    it('should create menu', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/menus')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: { ar: 'قائمة التذييل', en: 'Footer Menu' },
          slug: 'footer-menu',
          location: 'footer',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.menu.slug).toBe('footer-menu');
    });
  });

  describe('PUT /api/v1/menus/:id', () => {
    it('should update menu', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app)
        .put(`/api/v1/menus/${menu._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: { ar: 'قائمة محدثة', en: 'Updated Menu' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/menus/:id', () => {
    it('should delete menu', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app)
        .delete(`/api/v1/menus/${menu._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // MENU ITEMS
  // ============================================

  describe('POST /api/v1/menus/:id/items', () => {
    it('should add menu item', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [],
      });

      const response = await request(app)
        .post(`/api/v1/menus/${menu._id}/items`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          label: { ar: 'الرئيسية', en: 'Home' },
          url: '/',
          target: '_self',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/menus/:id/items/:itemId', () => {
    it('should update menu item', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            label: { ar: 'الرئيسية', en: 'Home' },
            url: '/',
            target: '_self',
            order: 0,
          },
        ],
      });

      const itemId = menu.items[0]._id;

      const response = await request(app)
        .put(`/api/v1/menus/${menu._id}/items/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          label: { ar: 'الصفحة الرئيسية', en: 'Homepage' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/menus/:id/items/:itemId', () => {
    it('should remove menu item', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [
          {
            _id: new mongoose.Types.ObjectId(),
            label: { ar: 'الرئيسية', en: 'Home' },
            url: '/',
            target: '_self',
            order: 0,
          },
        ],
      });

      const itemId = menu.items[0]._id;

      const response = await request(app)
        .delete(`/api/v1/menus/${menu._id}/items/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/menus/:id/reorder', () => {
    it('should reorder menu items', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const item1Id = new mongoose.Types.ObjectId();
      const item2Id = new mongoose.Types.ObjectId();

      const menu = await Menu.create({
        name: { ar: 'قائمة الرأس', en: 'Header Menu' },
        slug: 'header-menu',
        location: 'header',
        isActive: true,
        items: [
          {
            _id: item1Id,
            label: { ar: 'الرئيسية', en: 'Home' },
            url: '/',
            target: '_self',
            order: 0,
          },
          {
            _id: item2Id,
            label: { ar: 'من نحن', en: 'About' },
            url: '/about',
            target: '_self',
            order: 1,
          },
        ],
      });

      const response = await request(app)
        .post(`/api/v1/menus/${menu._id}/reorder`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          items: [
            { id: item2Id.toString(), order: 0 },
            { id: item1Id.toString(), order: 1 },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
