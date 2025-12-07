/**
 * Department Model Tests
 * اختبارات نموذج القسم
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Department } from '../../../src/models/Department';

let mongoServer: MongoMemoryServer | null = null;
let isConnected = false;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    isConnected = true;
  } catch (error) {
    console.warn('MongoMemoryServer could not start. Tests will be skipped.');
    isConnected = false;
  }
});

afterAll(async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (isConnected) {
    await Department.deleteMany({});
  }
});

const skipIfNoMongo = () => {
  if (!isConnected) {
    return true;
  }
  return false;
};

describe('Department Model', () => {
  describe('Schema Validation', () => {
    it('should create a department with valid data', async () => {
      const department = await Department.create({
        name: { ar: 'التطوير', en: 'Development' },
        slug: 'development',
        description: { ar: 'قسم التطوير', en: 'Development Department' },
        icon: 'code',
        color: '#3B82F6',
        order: 1,
      });

      expect(department.name.ar).toBe('التطوير');
      expect(department.name.en).toBe('Development');
      expect(department.slug).toBe('development');
      expect(department.isActive).toBe(true);
    });

    it('should require Arabic name', async () => {
      await expect(
        Department.create({
          name: { en: 'Development' },
          slug: 'development',
        })
      ).rejects.toThrow();
    });

    it('should require English name', async () => {
      await expect(
        Department.create({
          name: { ar: 'التطوير' },
          slug: 'development',
        })
      ).rejects.toThrow();
    });

    it('should require slug', async () => {
      await expect(
        Department.create({
          name: { ar: 'التطوير', en: 'Development' },
        })
      ).rejects.toThrow();
    });

    it('should validate slug format', async () => {
      await expect(
        Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'Invalid Slug',
        })
      ).rejects.toThrow();
    });

    it('should validate hex color format', async () => {
      await expect(
        Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
          color: 'invalid-color',
        })
      ).rejects.toThrow();
    });

    it('should enforce unique slug', async () => {
      await Department.create({
        name: { ar: 'التطوير', en: 'Development' },
        slug: 'development',
      });

      await expect(
        Department.create({
          name: { ar: 'التصميم', en: 'Design' },
          slug: 'development',
        })
      ).rejects.toThrow();
    });

    it('should set default values', async () => {
      const department = await Department.create({
        name: { ar: 'التطوير', en: 'Development' },
        slug: 'development',
      });

      expect(department.order).toBe(0);
      expect(department.isActive).toBe(true);
    });
  });

  describe('Static Methods', () => {
    describe('getActiveDepartments', () => {
      it('should return only active departments', async () => {
        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
          isActive: true,
        });

        await Department.create({
          name: { ar: 'التصميم', en: 'Design' },
          slug: 'design',
          isActive: false,
        });

        const departments = await Department.getActiveDepartments();

        expect(departments).toHaveLength(1);
        expect(departments[0].slug).toBe('development');
      });

      it('should sort departments by order', async () => {
        await Department.create({
          name: { ar: 'التصميم', en: 'Design' },
          slug: 'design',
          order: 2,
        });

        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
          order: 1,
        });

        const departments = await Department.getActiveDepartments();

        expect(departments[0].slug).toBe('development');
        expect(departments[1].slug).toBe('design');
      });

      it('should localize content when locale is provided', async () => {
        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
          description: { ar: 'قسم التطوير', en: 'Development Department' },
        });

        const departments = await Department.getActiveDepartments('en');

        expect(departments[0].name).toBe('Development');
        expect(departments[0].description).toBe('Development Department');
      });
    });

    describe('getBySlug', () => {
      it('should return department by slug', async () => {
        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
        });

        const department = await Department.getBySlug('development');

        expect(department).not.toBeNull();
        expect(department?.slug).toBe('development');
      });

      it('should return null for inactive department', async () => {
        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
          isActive: false,
        });

        const department = await Department.getBySlug('development');

        expect(department).toBeNull();
      });

      it('should return null for non-existent slug', async () => {
        const department = await Department.getBySlug('non-existent');

        expect(department).toBeNull();
      });

      it('should localize content when locale is provided', async () => {
        await Department.create({
          name: { ar: 'التطوير', en: 'Development' },
          slug: 'development',
        });

        const department = await Department.getBySlug('development', 'ar');

        expect(department?.name).toBe('التطوير');
      });
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt', async () => {
      const department = await Department.create({
        name: { ar: 'التطوير', en: 'Development' },
        slug: 'development',
      });

      expect(department.createdAt).toBeDefined();
      expect(department.updatedAt).toBeDefined();
    });

    it('should update updatedAt on save', async () => {
      const department = await Department.create({
        name: { ar: 'التطوير', en: 'Development' },
        slug: 'development',
      });

      const originalUpdatedAt = department.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      department.name.en = 'Updated Development';
      await department.save();

      expect(department.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
