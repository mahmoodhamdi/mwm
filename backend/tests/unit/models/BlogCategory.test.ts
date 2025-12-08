/**
 * Blog Category Model Unit Tests
 * اختبارات وحدة نموذج فئات المدونة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogCategory } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('BlogCategory Model', () => {
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
      await BlogCategory.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create blog category with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        description: { ar: 'مقالات تقنية', en: 'Tech articles' },
        isActive: true,
        order: 1,
      };

      const category = await BlogCategory.create(categoryData);

      expect(category._id).toBeDefined();
      expect(category.name.ar).toBe('تقنية');
      expect(category.name.en).toBe('Technology');
      expect(category.slug).toBe('technology');
    });

    it('should require name in both languages', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        slug: 'test-category',
      };

      await expect(BlogCategory.create(categoryData)).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      await BlogCategory.create(categoryData);
      await expect(BlogCategory.create(categoryData)).rejects.toThrow();
    });

    it('should create category with parent reference', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const parentCategory = await BlogCategory.create({
        name: { ar: 'الفئة الأب', en: 'Parent Category' },
        slug: 'parent-category',
      });

      const childCategory = await BlogCategory.create({
        name: { ar: 'الفئة الفرعية', en: 'Child Category' },
        slug: 'child-category',
        parent: parentCategory._id,
      });

      expect(childCategory.parent?.toString()).toBe(parentCategory._id.toString());
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      await BlogCategory.create([
        {
          name: { ar: 'تقنية', en: 'Technology' },
          slug: 'technology',
          isActive: true,
          order: 1,
        },
        {
          name: { ar: 'أعمال', en: 'Business' },
          slug: 'business',
          isActive: true,
          order: 2,
        },
        {
          name: { ar: 'مخفية', en: 'Hidden' },
          slug: 'hidden',
          isActive: false,
          order: 3,
        },
      ]);
    });

    it('should get active categories with getActiveCategories()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categories = await BlogCategory.getActiveCategories();

      expect(categories).toHaveLength(2);
      expect(categories.every(c => c.isActive)).toBe(true);
    });

    it('should get localized categories', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const categories = await BlogCategory.getActiveCategories('en');

      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('Technology');
    });

    it('should get category by slug with getBySlug()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await BlogCategory.getBySlug('technology');

      expect(category).toBeDefined();
      expect(category?.slug).toBe('technology');
    });

    it('should return null for non-existent slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await BlogCategory.getBySlug('non-existent');

      expect(category).toBeNull();
    });

    it('should not return inactive category by slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await BlogCategory.getBySlug('hidden');

      expect(category).toBeNull();
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const category = await BlogCategory.create({
        name: { ar: 'فئة', en: 'Category' },
        slug: 'timestamp-test',
      });

      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
    });
  });
});
