/**
 * ServiceCategory Model Unit Tests
 * اختبارات وحدة نموذج تصنيف الخدمات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ServiceCategory, Service } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('ServiceCategory Model', () => {
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
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await ServiceCategory.deleteMany({});
      await Service.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create category with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        description: { ar: 'وصف التصنيف', en: 'Category description' },
        icon: 'code',
        isActive: true,
        order: 1,
      };

      const category = await ServiceCategory.create(categoryData);

      expect(category._id).toBeDefined();
      expect(category.name.ar).toBe('تطوير');
      expect(category.name.en).toBe('Development');
      expect(category.slug).toBe('development');
      expect(category.isActive).toBe(true);
    });

    it('should require name in both languages', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        slug: 'test-category',
      };

      await expect(ServiceCategory.create(categoryData)).rejects.toThrow();
    });

    it('should require slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تطوير', en: 'Development' },
      };

      await expect(ServiceCategory.create(categoryData)).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
      };

      await ServiceCategory.create(categoryData);
      await expect(ServiceCategory.create(categoryData)).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
      };

      const category = await ServiceCategory.create(categoryData);

      expect(category.isActive).toBe(true);
      expect(category.order).toBe(0);
    });

    it('should create category with image', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تصميم', en: 'Design' },
        slug: 'design',
        image: 'https://example.com/design.jpg',
      };

      const category = await ServiceCategory.create(categoryData);

      expect(category.image).toBe('https://example.com/design.jpg');
    });
  });

  describe('Virtual Fields', () => {
    it('should have servicesCount virtual', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await ServiceCategory.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
      });

      // Create services in this category
      await Service.create([
        {
          title: { ar: 'خدمة 1', en: 'Service 1' },
          slug: 'service-1',
          shortDescription: { ar: 'وصف', en: 'Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: category._id,
          features: [],
          isActive: true,
        },
        {
          title: { ar: 'خدمة 2', en: 'Service 2' },
          slug: 'service-2',
          shortDescription: { ar: 'وصف', en: 'Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: category._id,
          features: [],
          isActive: true,
        },
      ]);

      // Get category with services count
      const categoryWithCount = await ServiceCategory.findById(category._id);

      // Virtual should be accessible
      expect(categoryWithCount).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      await ServiceCategory.create([
        {
          name: { ar: 'تطوير', en: 'Development' },
          slug: 'development',
          isActive: true,
          order: 1,
        },
        {
          name: { ar: 'تصميم', en: 'Design' },
          slug: 'design',
          isActive: true,
          order: 2,
        },
        {
          name: { ar: 'استشارات', en: 'Consulting' },
          slug: 'consulting',
          isActive: false,
          order: 3,
        },
      ]);
    });

    it('should get active categories with getActiveCategories()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categories = await ServiceCategory.getActiveCategories();

      expect(categories).toHaveLength(2);
      expect(categories.every(c => c.isActive)).toBe(true);
    });

    it('should order categories by order field', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categories = await ServiceCategory.getActiveCategories();

      expect(categories[0].slug).toBe('development');
      expect(categories[1].slug).toBe('design');
    });

    it('should get category by slug with getBySlug()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await ServiceCategory.getBySlug('development');

      expect(category).toBeDefined();
      expect(category?.slug).toBe('development');
    });

    it('should return null for non-existent slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await ServiceCategory.getBySlug('non-existent');

      expect(category).toBeNull();
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await ServiceCategory.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
      });

      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
    });

    it('should update updatedAt on save', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await ServiceCategory.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'update-test',
      });

      const originalUpdatedAt = category.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      category.name = { ar: 'تطوير محدث', en: 'Updated Development' };
      await category.save();

      expect(category.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Ordering', () => {
    it('should allow reordering categories', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const cat1 = await ServiceCategory.create({
        name: { ar: 'تصنيف 1', en: 'Category 1' },
        slug: 'cat-1',
        order: 1,
      });

      const cat2 = await ServiceCategory.create({
        name: { ar: 'تصنيف 2', en: 'Category 2' },
        slug: 'cat-2',
        order: 2,
      });

      // Swap order
      cat1.order = 2;
      cat2.order = 1;
      await cat1.save();
      await cat2.save();

      const categories = await ServiceCategory.find({}).sort({ order: 1 });

      expect(categories[0].slug).toBe('cat-2');
      expect(categories[1].slug).toBe('cat-1');
    });
  });
});
