/**
 * ProjectCategory Model Tests
 * اختبارات نموذج تصنيف المشاريع
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProjectCategory } from '../../../src/models';

// Increase timeout for MongoMemoryServer
jest.setTimeout(60000);

describe('ProjectCategory Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

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
      isConnected = true;
    } catch (error) {
      console.warn('MongoMemoryServer could not start. Tests will be skipped.');
      isConnected = false;
    }
  }, 120000);

  afterAll(async () => {
    if (isConnected) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    if (isConnected) {
      await ProjectCategory.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a category with valid data', async () => {
      const categoryData = {
        name: { ar: 'تطبيقات ويب', en: 'Web Applications' },
        slug: 'web-applications',
        description: { ar: 'تطبيقات الويب المتنوعة', en: 'Various web applications' },
        isActive: true,
      };

      const category = await ProjectCategory.create(categoryData);

      expect(category._id).toBeDefined();
      expect(category.name.ar).toBe('تطبيقات ويب');
      expect(category.name.en).toBe('Web Applications');
      expect(category.slug).toBe('web-applications');
      expect(category.isActive).toBe(true);
      expect(category.order).toBe(0);
    });

    it('should require name in both languages', async () => {
      const categoryData = {
        name: { ar: 'تطبيقات ويب' },
        slug: 'web-applications',
      };

      await expect(ProjectCategory.create(categoryData)).rejects.toThrow();
    });

    it('should require slug', async () => {
      const categoryData = {
        name: { ar: 'تطبيقات ويب', en: 'Web Applications' },
      };

      await expect(ProjectCategory.create(categoryData)).rejects.toThrow();
    });

    it('should require unique slug', async () => {
      const categoryData1 = {
        name: { ar: 'فئة 1', en: 'Category 1' },
        slug: 'test-category',
      };

      const categoryData2 = {
        name: { ar: 'فئة 2', en: 'Category 2' },
        slug: 'test-category',
      };

      await ProjectCategory.create(categoryData1);
      await expect(ProjectCategory.create(categoryData2)).rejects.toThrow();
    });

    it('should convert slug to lowercase', async () => {
      const categoryData = {
        name: { ar: 'تطبيقات', en: 'Applications' },
        slug: 'WEB-Applications',
      };

      const category = await ProjectCategory.create(categoryData);
      expect(category.slug).toBe('web-applications');
    });

    it('should default isActive to true', async () => {
      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      const category = await ProjectCategory.create(categoryData);
      expect(category.isActive).toBe(true);
    });

    it('should default order to 0', async () => {
      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      const category = await ProjectCategory.create(categoryData);
      expect(category.order).toBe(0);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test categories
      await ProjectCategory.create([
        {
          name: { ar: 'تطبيقات ويب', en: 'Web Applications' },
          slug: 'web-applications',
          isActive: true,
          order: 2,
        },
        {
          name: { ar: 'تطبيقات موبايل', en: 'Mobile Applications' },
          slug: 'mobile-applications',
          isActive: true,
          order: 1,
        },
        {
          name: { ar: 'فئة غير نشطة', en: 'Inactive Category' },
          slug: 'inactive-category',
          isActive: false,
          order: 3,
        },
      ]);
    });

    it('should get active categories ordered by order field', async () => {
      const categories = await ProjectCategory.getActiveCategories();

      expect(categories).toHaveLength(2);
      expect(categories[0].slug).toBe('mobile-applications'); // order: 1
      expect(categories[1].slug).toBe('web-applications'); // order: 2
    });

    it('should get category by slug', async () => {
      const category = await ProjectCategory.getBySlug('web-applications');

      expect(category).not.toBeNull();
      expect(category?.name.en).toBe('Web Applications');
    });

    it('should return null for inactive category slug', async () => {
      const category = await ProjectCategory.getBySlug('inactive-category');

      expect(category).toBeNull();
    });

    it('should return null for non-existent slug', async () => {
      const category = await ProjectCategory.getBySlug('non-existent');

      expect(category).toBeNull();
    });
  });

  describe('Timestamps', () => {
    it('should automatically set createdAt and updatedAt', async () => {
      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      const category = await ProjectCategory.create(categoryData);

      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
    });

    it('should update updatedAt on modification', async () => {
      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      const category = await ProjectCategory.create(categoryData);
      const initialUpdatedAt = category.updatedAt;

      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 100));

      category.name.en = 'Updated Category';
      await category.save();

      expect(category.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe('Virtual Fields', () => {
    it('should have projectsCount virtual field defined', async () => {
      const categoryData = {
        name: { ar: 'فئة', en: 'Category' },
        slug: 'test-category',
      };

      const category = await ProjectCategory.create(categoryData);

      // Virtual field should be defined in schema
      const schema = ProjectCategory.schema;
      expect(schema.virtuals.projectsCount).toBeDefined();
    });
  });

  describe('Indexing', () => {
    it('should have index on slug field', async () => {
      const indexes = ProjectCategory.schema.indexes();
      const slugIndex = indexes.find(index =>
        Object.keys(index[0]).includes('slug')
      );
      expect(slugIndex).toBeDefined();
    });

    it('should have compound index on isActive and order', async () => {
      const indexes = ProjectCategory.schema.indexes();
      const compoundIndex = indexes.find(index =>
        Object.keys(index[0]).includes('isActive') &&
        Object.keys(index[0]).includes('order')
      );
      expect(compoundIndex).toBeDefined();
    });
  });
});
