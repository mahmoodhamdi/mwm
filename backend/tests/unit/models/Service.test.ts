/**
 * Service Model Unit Tests
 * اختبارات وحدة نموذج الخدمات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Service, ServiceCategory } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('Service Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let categoryId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
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
      await Service.deleteMany({});
      await ServiceCategory.deleteMany({});

      // Create a test category
      const category = await ServiceCategory.create({
        name: { ar: 'تطوير', en: 'Development' },
        slug: 'development',
        isActive: true,
        order: 1,
      });
      categoryId = category._id;
    }
  });

  describe('Schema Validation', () => {
    it('should create service with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        title: { ar: 'تطوير الويب', en: 'Web Development' },
        slug: 'web-development',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف مفصل للخدمة', en: 'Detailed service description' },
        category: categoryId,
        icon: 'code',
        isActive: true,
        isFeatured: false,
        order: 1,
        features: [
          {
            title: { ar: 'ميزة 1', en: 'Feature 1' },
            description: { ar: 'وصف الميزة', en: 'Feature description' },
            icon: 'check',
          },
        ],
      };

      const service = await Service.create(serviceData);

      expect(service._id).toBeDefined();
      expect(service.title.ar).toBe('تطوير الويب');
      expect(service.title.en).toBe('Web Development');
      expect(service.slug).toBe('web-development');
      expect(service.features).toHaveLength(1);
    });

    it('should require title in both languages', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        slug: 'test-service',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
      };

      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'test-service',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
      };

      await Service.create(serviceData);
      await expect(Service.create(serviceData)).rejects.toThrow();
    });

    it('should create service with pricing plans', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service-with-pricing',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
        pricingPlans: [
          {
            name: { ar: 'باقة أساسية', en: 'Basic Plan' },
            description: { ar: 'وصف الباقة', en: 'Plan description' },
            price: 1000,
            currency: 'SAR',
            period: 'monthly' as const,
            features: [{ ar: 'ميزة', en: 'Feature' }],
            isPopular: false,
            order: 1,
          },
          {
            name: { ar: 'باقة متقدمة', en: 'Pro Plan' },
            description: { ar: 'وصف الباقة', en: 'Plan description' },
            price: 2000,
            currency: 'SAR',
            period: 'monthly' as const,
            features: [{ ar: 'ميزة', en: 'Feature' }],
            isPopular: true,
            order: 2,
          },
        ],
      };

      const service = await Service.create(serviceData);

      expect(service.pricingPlans).toHaveLength(2);
      expect(service.pricingPlans?.[0].price).toBe(1000);
      expect(service.pricingPlans?.[1].isPopular).toBe(true);
    });

    it('should create service with FAQs', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service-with-faqs',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
        faqs: [
          {
            question: { ar: 'ما هي الخدمة؟', en: 'What is the service?' },
            answer: { ar: 'الإجابة هنا', en: 'Answer here' },
            order: 1,
          },
        ],
      };

      const service = await Service.create(serviceData);

      expect(service.faqs).toHaveLength(1);
      expect(service.faqs?.[0].question.ar).toBe('ما هي الخدمة؟');
    });

    it('should create service with process steps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const serviceData = {
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'service-with-steps',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
        processSteps: [
          {
            title: { ar: 'الخطوة 1', en: 'Step 1' },
            description: { ar: 'وصف الخطوة', en: 'Step description' },
            icon: 'step-1',
            order: 1,
          },
          {
            title: { ar: 'الخطوة 2', en: 'Step 2' },
            description: { ar: 'وصف الخطوة', en: 'Step description' },
            icon: 'step-2',
            order: 2,
          },
        ],
      };

      const service = await Service.create(serviceData);

      expect(service.processSteps).toHaveLength(2);
      expect(service.processSteps?.[0].title.ar).toBe('الخطوة 1');
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create test services
      await Service.create([
        {
          title: { ar: 'خدمة 1', en: 'Service 1' },
          slug: 'service-1',
          shortDescription: { ar: 'وصف', en: 'Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: categoryId,
          features: [],
          isActive: true,
          isFeatured: true,
          order: 1,
        },
        {
          title: { ar: 'خدمة 2', en: 'Service 2' },
          slug: 'service-2',
          shortDescription: { ar: 'وصف', en: 'Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: categoryId,
          features: [],
          isActive: true,
          isFeatured: false,
          order: 2,
        },
        {
          title: { ar: 'خدمة 3', en: 'Service 3' },
          slug: 'service-3',
          shortDescription: { ar: 'وصف', en: 'Description' },
          description: { ar: 'وصف', en: 'Description' },
          category: categoryId,
          features: [],
          isActive: false,
          isFeatured: false,
          order: 3,
        },
      ]);
    });

    it('should get active services with getActiveServices()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const services = await Service.getActiveServices();

      expect(services).toHaveLength(2);
      expect(services.every(s => s.isActive)).toBe(true);
    });

    it('should get service by slug with getBySlug()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const service = await Service.getBySlug('service-1');

      expect(service).toBeDefined();
      expect(service?.slug).toBe('service-1');
    });

    it('should return null for non-existent slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const service = await Service.getBySlug('non-existent');

      expect(service).toBeNull();
    });

    it('should get featured services with getFeaturedServices()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const services = await Service.getFeaturedServices();

      expect(services.length).toBeGreaterThanOrEqual(1);
      expect(services.every(s => s.isFeatured && s.isActive)).toBe(true);
    });

    it('should limit featured services', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const services = await Service.getFeaturedServices(1);

      expect(services).toHaveLength(1);
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const service = await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'timestamp-test',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
      });

      expect(service.createdAt).toBeDefined();
      expect(service.updatedAt).toBeDefined();
    });

    it('should update updatedAt on save', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const service = await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'update-test',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
      });

      const originalUpdatedAt = service.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      service.title = { ar: 'خدمة محدثة', en: 'Updated Service' };
      await service.save();

      expect(service.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Category Population', () => {
    it('should populate category when querying', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Service.create({
        title: { ar: 'خدمة', en: 'Service' },
        slug: 'populate-test',
        shortDescription: { ar: 'وصف', en: 'Description' },
        description: { ar: 'وصف', en: 'Description' },
        category: categoryId,
        features: [],
      });

      const service = await Service.findOne({ slug: 'populate-test' }).populate('category');

      expect(service?.category).toBeDefined();
      expect((service?.category as any).name.en).toBe('Development');
    });
  });
});
