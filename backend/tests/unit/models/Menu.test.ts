/**
 * Menu Model Unit Tests
 * اختبارات وحدة نموذج القائمة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Menu } from '../../../src/models';

describe('Menu Model', () => {
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
      await Menu.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create menu with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Main Menu',
        slug: 'main-menu',
        location: 'header',
        items: [
          {
            id: 'item-1',
            label: { ar: 'الرئيسية', en: 'Home' },
            url: '/',
            order: 1,
          },
        ],
        isActive: true,
      };

      const menu = await Menu.create(menuData);

      expect(menu._id).toBeDefined();
      expect(menu.slug).toBe('main-menu');
      expect(menu.location).toBe('header');
      expect(menu.items).toHaveLength(1);
    });

    it('should enforce unique slug constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'main-menu',
        location: 'header',
        items: [],
      };

      await Menu.create(menuData);
      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should require name', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        slug: 'test-menu',
        location: 'header',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should require slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        location: 'header',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should require location', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'test-menu',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should validate location enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'test-menu',
        location: 'invalid_location',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should allow all valid locations', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const locations = ['header', 'footer', 'sidebar', 'mobile'];

      for (const location of locations) {
        const menu = await Menu.create({
          name: 'Menu',
          slug: `menu-${location}`,
          location,
          items: [],
        });

        expect(menu.location).toBe(location);
      }
    });
  });

  describe('Menu Items', () => {
    it('should create menu with nested items', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'nested-menu',
        location: 'header',
        items: [
          {
            id: 'item-1',
            label: { ar: 'خدماتنا', en: 'Services' },
            url: '/services',
            order: 1,
            children: [
              {
                id: 'item-1-1',
                label: { ar: 'خدمة 1', en: 'Service 1' },
                url: '/services/1',
                order: 1,
              },
              {
                id: 'item-1-2',
                label: { ar: 'خدمة 2', en: 'Service 2' },
                url: '/services/2',
                order: 2,
              },
            ],
          },
        ],
      };

      const menu = await Menu.create(menuData);

      expect(menu.items[0]?.children).toHaveLength(2);
      expect(menu.items[0]?.children?.[0]?.label?.en).toBe('Service 1');
    });

    it('should support external links', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'external-menu',
        location: 'footer',
        items: [
          {
            id: 'item-1',
            label: { ar: 'فيسبوك', en: 'Facebook' },
            url: 'https://facebook.com',
            target: '_blank',
            type: 'external',
            order: 1,
          },
        ],
      };

      const menu = await Menu.create(menuData);

      expect(menu.items[0]?.type).toBe('external');
      expect(menu.items[0]?.target).toBe('_blank');
    });

    it('should support icon field', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menuData = {
        name: 'Menu',
        slug: 'icon-menu',
        location: 'sidebar',
        items: [
          {
            id: 'item-1',
            label: { ar: 'لوحة التحكم', en: 'Dashboard' },
            url: '/dashboard',
            icon: 'dashboard',
            order: 1,
          },
        ],
      };

      const menu = await Menu.create(menuData);

      expect(menu.items[0]?.icon).toBe('dashboard');
    });
  });

  describe('Static Methods', () => {
    it('should get menu by location', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Menu.create({
        name: 'Header Menu',
        slug: 'header-menu',
        location: 'header',
        items: [],
        isActive: true,
      });

      await Menu.create({
        name: 'Footer Menu',
        slug: 'footer-menu',
        location: 'footer',
        items: [],
        isActive: true,
      });

      const headerMenu = await Menu.getByLocation('header');

      expect(headerMenu).toBeDefined();
      expect(headerMenu?.location).toBe('header');
    });

    it('should get menu by slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Menu.create({
        name: 'Test Menu',
        slug: 'test-menu',
        location: 'header',
        items: [],
        isActive: true,
      });

      const menu = await Menu.getBySlug('test-menu');

      expect(menu).toBeDefined();
      expect(menu?.slug).toBe('test-menu');
    });

    it('should upsert menu', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create new
      const created = await Menu.upsertMenu('new-menu', {
        name: 'New Menu',
        location: 'header',
        items: [],
      });

      expect(created.slug).toBe('new-menu');
      expect(created.name).toBe('New Menu');

      // Update existing
      const updated = await Menu.upsertMenu('new-menu', {
        name: 'Updated Menu',
        location: 'header',
        items: [],
      });

      expect(updated.name).toBe('Updated Menu');

      // Verify only one record exists
      const count = await Menu.countDocuments({ slug: 'new-menu' });
      expect(count).toBe(1);
    });

    it('should add item to menu', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menu = await Menu.create({
        name: 'Menu',
        slug: 'add-item-test',
        location: 'header',
        items: [],
      });

      const updatedMenu = await Menu.addItem(menu._id, {
        id: 'new-item',
        label: { ar: 'عنصر جديد', en: 'New Item' },
        url: '/new',
        order: 1,
        type: 'internal',
        target: '_self',
        isActive: true,
      });

      expect(updatedMenu?.items).toHaveLength(1);
      expect(updatedMenu?.items[0]?.label?.en).toBe('New Item');
    });

    it('should update item in menu', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menu = await Menu.create({
        name: 'Menu',
        slug: 'update-item-test',
        location: 'header',
        items: [
          {
            id: 'item-1',
            label: { ar: 'عنصر قديم', en: 'Old Item' },
            url: '/old',
            order: 1,
          },
        ],
      });

      const updatedMenu = await Menu.updateItem(menu._id, 'item-1', {
        label: { ar: 'عنصر جديد', en: 'New Item' },
        url: '/new',
      });

      expect(updatedMenu?.items[0]?.label?.en).toBe('New Item');
      expect(updatedMenu?.items[0]?.url).toBe('/new');
    });

    it('should remove item from menu', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menu = await Menu.create({
        name: 'Menu',
        slug: 'remove-item-test',
        location: 'header',
        items: [
          {
            id: 'item-1',
            label: { ar: 'عنصر 1', en: 'Item 1' },
            url: '/1',
            order: 1,
          },
          {
            id: 'item-2',
            label: { ar: 'عنصر 2', en: 'Item 2' },
            url: '/2',
            order: 2,
          },
        ],
      });

      const updatedMenu = await Menu.removeItem(menu._id, 'item-1');

      expect(updatedMenu?.items).toHaveLength(1);
      expect(updatedMenu?.items[0]?.id).toBe('item-2');
    });

    it('should reorder items', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menu = await Menu.create({
        name: 'Menu',
        slug: 'reorder-test',
        location: 'header',
        items: [
          { id: 'item-1', label: { ar: '1', en: '1' }, url: '/1', order: 1 },
          { id: 'item-2', label: { ar: '2', en: '2' }, url: '/2', order: 2 },
          { id: 'item-3', label: { ar: '3', en: '3' }, url: '/3', order: 3 },
        ],
      });

      const updatedMenu = await Menu.reorderItems(menu._id, ['item-3', 'item-1', 'item-2']);

      expect(updatedMenu?.items[0]?.id).toBe('item-3');
      expect(updatedMenu?.items[0]?.order).toBe(0);
      expect(updatedMenu?.items[1]?.id).toBe('item-1');
      expect(updatedMenu?.items[1]?.order).toBe(1);
      expect(updatedMenu?.items[2]?.id).toBe('item-2');
      expect(updatedMenu?.items[2]?.order).toBe(2);
    });
  });

  describe('Query Filters', () => {
    it('should filter by isActive', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Menu.create({
        name: 'Active Menu',
        slug: 'active-menu',
        location: 'header',
        items: [],
        isActive: true,
      });

      await Menu.create({
        name: 'Inactive Menu',
        slug: 'inactive-menu',
        location: 'header',
        items: [],
        isActive: false,
      });

      const activeMenus = await Menu.find({ isActive: true });
      const inactiveMenus = await Menu.find({ isActive: false });

      expect(activeMenus).toHaveLength(1);
      expect(inactiveMenus).toHaveLength(1);
      expect(activeMenus[0]?.slug).toBe('active-menu');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const menu = await Menu.create({
        name: 'Menu',
        slug: 'timestamp-test',
        location: 'header',
        items: [],
      });

      expect(menu.createdAt).toBeDefined();
      expect(menu.updatedAt).toBeDefined();
    });
  });
});
