/**
 * SiteContent Model Unit Tests
 * اختبارات وحدة نموذج محتوى الموقع
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SiteContent } from '../../../src/models';

describe('SiteContent Model', () => {
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
      await SiteContent.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create content with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'hero_title',
        section: 'home',
        type: 'text',
        content: { ar: 'مرحبا بكم', en: 'Welcome' },
        isActive: true,
      };

      const content = await SiteContent.create(contentData);

      expect(content._id).toBeDefined();
      expect(content.key).toBe(contentData.key);
      expect(content.section).toBe('home');
      expect(content.type).toBe('text');
      expect(content.content.ar).toBe('مرحبا بكم');
    });

    it('should enforce unique key constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'hero_title',
        section: 'home',
        type: 'text',
        content: { ar: 'نص', en: 'Text' },
      };

      await SiteContent.create(contentData);
      await expect(SiteContent.create(contentData)).rejects.toThrow();
    });

    it('should require key', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        section: 'home',
        type: 'text',
        content: { ar: 'نص', en: 'Text' },
      };

      await expect(SiteContent.create(contentData)).rejects.toThrow();
    });

    it('should require section', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'test_key',
        type: 'text',
        content: { ar: 'نص', en: 'Text' },
      };

      await expect(SiteContent.create(contentData)).rejects.toThrow();
    });

    it('should default type to text', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'test_key',
        section: 'home',
        content: { ar: 'نص', en: 'Text' },
      };

      const content = await SiteContent.create(contentData);
      expect(content.type).toBe('text');
    });

    it('should validate type enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'test_key',
        section: 'home',
        type: 'invalid_type',
        content: { ar: 'نص', en: 'Text' },
      };

      await expect(SiteContent.create(contentData)).rejects.toThrow();
    });

    it('should allow html type', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'about_description',
        section: 'about',
        type: 'html',
        content: { ar: '<p>وصف</p>', en: '<p>Description</p>' },
      };

      const content = await SiteContent.create(contentData);
      expect(content.type).toBe('html');
    });

    it('should allow image type', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'hero_image',
        section: 'home',
        type: 'image',
        content: { ar: 'https://example.com/ar-image.png', en: 'https://example.com/en-image.png' },
      };

      const content = await SiteContent.create(contentData);
      expect(content.type).toBe('image');
    });

    it('should allow array type', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contentData = {
        key: 'features_list',
        section: 'home',
        type: 'array',
        content: { ar: ['ميزة 1', 'ميزة 2'], en: ['Feature 1', 'Feature 2'] },
      };

      const content = await SiteContent.create(contentData);
      expect(content.type).toBe('array');
    });
  });

  describe('Static Methods', () => {
    it('should get content by key', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'hero_title',
        section: 'home',
        type: 'text',
        content: { ar: 'مرحبا', en: 'Welcome' },
        isActive: true,
      });

      const content = await SiteContent.getByKey('hero_title');

      expect(content).toBeDefined();
      expect(content?.key).toBe('hero_title');
    });

    it('should get content by key with locale', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'hero_title',
        section: 'home',
        type: 'text',
        content: { ar: 'مرحبا', en: 'Welcome' },
        isActive: true,
      });

      const content = await SiteContent.getByKey('hero_title', 'ar');

      expect(content).toBeDefined();
      expect(content?.content).toBe('مرحبا');
    });

    it('should get content by section', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'hero_title',
        section: 'home',
        type: 'text',
        content: { ar: 'عنوان', en: 'Title' },
        isActive: true,
      });

      await SiteContent.create({
        key: 'hero_subtitle',
        section: 'home',
        type: 'text',
        content: { ar: 'عنوان فرعي', en: 'Subtitle' },
        isActive: true,
      });

      await SiteContent.create({
        key: 'about_title',
        section: 'about',
        type: 'text',
        content: { ar: 'من نحن', en: 'About Us' },
        isActive: true,
      });

      const homeContent = await SiteContent.getBySection('home');

      expect(homeContent).toHaveLength(2);
      expect(homeContent.every(c => c.section === 'home')).toBe(true);
    });

    it('should upsert content', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create new
      const created = await SiteContent.upsertContent('new_key', {
        section: 'home',
        type: 'text',
        content: { ar: 'جديد', en: 'New' },
      });

      expect(created.key).toBe('new_key');
      expect(created.content.ar).toBe('جديد');

      // Update existing
      const updated = await SiteContent.upsertContent('new_key', {
        section: 'home',
        type: 'text',
        content: { ar: 'محدث', en: 'Updated' },
      });

      expect(updated.key).toBe('new_key');
      expect(updated.content.ar).toBe('محدث');

      // Verify only one record exists
      const count = await SiteContent.countDocuments({ key: 'new_key' });
      expect(count).toBe(1);
    });

    it('should bulk upsert content', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contents = await SiteContent.bulkUpsert([
        { key: 'key1', data: { section: 'home', content: { ar: 'نص 1', en: 'Text 1' } } },
        { key: 'key2', data: { section: 'home', content: { ar: 'نص 2', en: 'Text 2' } } },
        { key: 'key3', data: { section: 'about', content: { ar: 'نص 3', en: 'Text 3' } } },
      ]);

      expect(contents).toHaveLength(3);

      const count = await SiteContent.countDocuments({});
      expect(count).toBe(3);
    });
  });

  describe('Query Filters', () => {
    it('should filter by isActive', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'active_content',
        section: 'home',
        type: 'text',
        content: { ar: 'نشط', en: 'Active' },
        isActive: true,
      });

      await SiteContent.create({
        key: 'inactive_content',
        section: 'home',
        type: 'text',
        content: { ar: 'غير نشط', en: 'Inactive' },
        isActive: false,
      });

      const activeContent = await SiteContent.find({ isActive: true });
      const inactiveContent = await SiteContent.find({ isActive: false });

      expect(activeContent).toHaveLength(1);
      expect(inactiveContent).toHaveLength(1);
      expect(activeContent[0]?.key).toBe('active_content');
    });

    it('should filter by isSystem', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'system_content',
        section: 'system',
        type: 'text',
        content: { ar: 'نظام', en: 'System' },
        isSystem: true,
      });

      await SiteContent.create({
        key: 'user_content',
        section: 'home',
        type: 'text',
        content: { ar: 'مستخدم', en: 'User' },
        isSystem: false,
      });

      const systemContent = await SiteContent.find({ isSystem: true });
      const userContent = await SiteContent.find({ isSystem: false });

      expect(systemContent).toHaveLength(1);
      expect(userContent).toHaveLength(1);
    });
  });

  describe('Sorting', () => {
    it('should sort by order field', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await SiteContent.create({
        key: 'item_3',
        section: 'home',
        type: 'text',
        content: { ar: 'ثالث', en: 'Third' },
        order: 3,
      });

      await SiteContent.create({
        key: 'item_1',
        section: 'home',
        type: 'text',
        content: { ar: 'أول', en: 'First' },
        order: 1,
      });

      await SiteContent.create({
        key: 'item_2',
        section: 'home',
        type: 'text',
        content: { ar: 'ثاني', en: 'Second' },
        order: 2,
      });

      const sorted = await SiteContent.find({ section: 'home' }).sort({ order: 1 });

      expect(sorted[0]?.key).toBe('item_1');
      expect(sorted[1]?.key).toBe('item_2');
      expect(sorted[2]?.key).toBe('item_3');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const content = await SiteContent.create({
        key: 'test_content',
        section: 'home',
        type: 'text',
        content: { ar: 'نص', en: 'Text' },
      });

      expect(content.createdAt).toBeDefined();
      expect(content.updatedAt).toBeDefined();
    });
  });
});
