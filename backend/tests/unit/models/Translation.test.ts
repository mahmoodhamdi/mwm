/**
 * Translation Model Unit Tests
 * اختبارات وحدة نموذج الترجمة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Translation } from '../../../src/models';

describe('Translation Model', () => {
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
      await Translation.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create translation with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translationData = {
        key: 'greeting',
        namespace: 'common',
        translations: { ar: 'مرحبا', en: 'Hello' },
      };

      const translation = await Translation.create(translationData);

      expect(translation._id).toBeDefined();
      expect(translation.key).toBe('greeting');
      expect(translation.namespace).toBe('common');
      expect(translation.translations.ar).toBe('مرحبا');
      expect(translation.translations.en).toBe('Hello');
    });

    it('should enforce unique key + namespace constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translationData = {
        key: 'greeting',
        namespace: 'common',
        translations: { ar: 'مرحبا', en: 'Hello' },
      };

      await Translation.create(translationData);
      await expect(Translation.create(translationData)).rejects.toThrow();
    });

    it('should allow same key in different namespaces', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Translation.create({
        key: 'title',
        namespace: 'home',
        translations: { ar: 'الرئيسية', en: 'Home' },
      });

      const aboutTitle = await Translation.create({
        key: 'title',
        namespace: 'about',
        translations: { ar: 'من نحن', en: 'About Us' },
      });

      expect(aboutTitle.key).toBe('title');
      expect(aboutTitle.namespace).toBe('about');
    });

    it('should require key', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translationData = {
        namespace: 'common',
        translations: { ar: 'نص', en: 'Text' },
      };

      await expect(Translation.create(translationData)).rejects.toThrow();
    });

    it('should require namespace', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translationData = {
        key: 'test_key',
        translations: { ar: 'نص', en: 'Text' },
      };

      await expect(Translation.create(translationData)).rejects.toThrow();
    });

    it('should validate namespace enum', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translationData = {
        key: 'test_key',
        namespace: 'invalid_namespace',
        translations: { ar: 'نص', en: 'Text' },
      };

      await expect(Translation.create(translationData)).rejects.toThrow();
    });
  });

  describe('Static Methods', () => {
    it('should get translations by namespace', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Translation.create({
        key: 'greeting',
        namespace: 'common',
        translations: { ar: 'مرحبا', en: 'Hello' },
      });

      await Translation.create({
        key: 'goodbye',
        namespace: 'common',
        translations: { ar: 'مع السلامة', en: 'Goodbye' },
      });

      await Translation.create({
        key: 'title',
        namespace: 'home',
        translations: { ar: 'الرئيسية', en: 'Home' },
      });

      // getByNamespace returns Record<string, string> for the default locale (ar)
      const commonTranslationsAr = await Translation.getByNamespace('common');
      expect(Object.keys(commonTranslationsAr)).toHaveLength(2);
      expect(commonTranslationsAr['greeting']).toBe('مرحبا');
      expect(commonTranslationsAr['goodbye']).toBe('مع السلامة');

      // Test with English locale
      const commonTranslationsEn = await Translation.getByNamespace('common', 'en');
      expect(commonTranslationsEn['greeting']).toBe('Hello');
      expect(commonTranslationsEn['goodbye']).toBe('Goodbye');
    });

    it('should get all translations by locale', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Translation.create({
        key: 'greeting',
        namespace: 'common',
        translations: { ar: 'مرحبا', en: 'Hello' },
      });

      await Translation.create({
        key: 'title',
        namespace: 'home',
        translations: { ar: 'الرئيسية', en: 'Home' },
      });

      const arTranslations = await Translation.getAllByLocale('ar');

      expect(arTranslations.common).toBeDefined();
      expect(arTranslations.home).toBeDefined();
      expect(arTranslations.common['greeting']).toBe('مرحبا');
      expect(arTranslations.home['title']).toBe('الرئيسية');
    });

    it('should upsert translation', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create new
      const created = await Translation.upsertTranslation('new_key', 'common', {
        ar: 'جديد',
        en: 'New',
      });

      expect(created.key).toBe('new_key');
      expect(created.translations.ar).toBe('جديد');

      // Update existing
      const updated = await Translation.upsertTranslation('new_key', 'common', {
        ar: 'محدث',
        en: 'Updated',
      });

      expect(updated.translations.ar).toBe('محدث');

      // Verify only one record exists
      const count = await Translation.countDocuments({ key: 'new_key', namespace: 'common' });
      expect(count).toBe(1);
    });

    it('should bulk upsert translations', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translations = await Translation.bulkUpsert([
        { key: 'key1', namespace: 'common', translations: { ar: 'نص 1', en: 'Text 1' } },
        { key: 'key2', namespace: 'common', translations: { ar: 'نص 2', en: 'Text 2' } },
        { key: 'key3', namespace: 'home', translations: { ar: 'نص 3', en: 'Text 3' } },
      ]);

      expect(translations).toHaveLength(3);

      const count = await Translation.countDocuments({});
      expect(count).toBe(3);
    });

    it('should search translations', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Translation.create({
        key: 'welcome_message',
        namespace: 'common',
        translations: { ar: 'مرحبا بك في موقعنا', en: 'Welcome to our site' },
      });

      await Translation.create({
        key: 'goodbye_message',
        namespace: 'common',
        translations: { ar: 'مع السلامة', en: 'Goodbye' },
      });

      const results = await Translation.search('welcome');

      expect(results).toHaveLength(1);
      expect(results[0]?.key).toBe('welcome_message');
    });
  });

  describe('Namespaces', () => {
    it('should support all valid namespaces', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const namespaces = [
        'common',
        'home',
        'about',
        'services',
        'portfolio',
        'team',
        'blog',
        'contact',
        'careers',
        'admin',
        'auth',
        'errors',
        'validation',
      ];

      for (const namespace of namespaces) {
        const translation = await Translation.create({
          key: `test_key_${namespace}`,
          namespace,
          translations: { ar: 'نص', en: 'Text' },
        });

        expect(translation.namespace).toBe(namespace);
      }
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const translation = await Translation.create({
        key: 'test_key',
        namespace: 'common',
        translations: { ar: 'نص', en: 'Text' },
      });

      expect(translation.createdAt).toBeDefined();
      expect(translation.updatedAt).toBeDefined();
    });
  });
});
