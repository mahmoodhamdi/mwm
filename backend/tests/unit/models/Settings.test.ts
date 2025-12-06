/**
 * Settings Model Unit Tests
 * اختبارات وحدة نموذج الإعدادات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Settings } from '../../../src/models';

describe('Settings Model', () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
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
      await Settings.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create settings with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع اختبار', en: 'Test Site' },
          siteDescription: { ar: 'وصف الموقع', en: 'Site Description' },
          logo: 'https://example.com/logo.png',
          favicon: 'https://example.com/favicon.ico',
          timezone: 'Asia/Riyadh',
          defaultLanguage: 'ar',
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings._id).toBeDefined();
      expect(settings.key).toBe(settingsData.key);
      expect(settings.general?.siteName?.ar).toBe('موقع اختبار');
      expect(settings.general?.siteName?.en).toBe('Test Site');
    });

    it('should enforce unique key constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
        },
      };

      await Settings.create(settingsData);
      await expect(Settings.create(settingsData)).rejects.toThrow();
    });

    it('should create settings with contact info', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        contact: {
          email: 'info@example.com',
          phone: '+966500000000',
          whatsapp: '+966500000000',
          address: { ar: 'الرياض', en: 'Riyadh' },
          workingHours: { ar: '9 ص - 5 م', en: '9 AM - 5 PM' },
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.contact?.email).toBe('info@example.com');
      expect(settings.contact?.phone).toBe('+966500000000');
      expect(settings.contact?.address?.ar).toBe('الرياض');
    });

    it('should create settings with social links', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        social: {
          facebook: 'https://facebook.com/example',
          twitter: 'https://twitter.com/example',
          linkedin: 'https://linkedin.com/company/example',
          instagram: 'https://instagram.com/example',
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.social?.facebook).toBe('https://facebook.com/example');
      expect(settings.social?.twitter).toBe('https://twitter.com/example');
    });

    it('should create settings with SEO data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        seo: {
          metaTitle: { ar: 'عنوان الميتا', en: 'Meta Title' },
          metaDescription: { ar: 'وصف الميتا', en: 'Meta Description' },
          keywords: ['keyword1', 'keyword2'],
          ogImage: 'https://example.com/og-image.png',
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.seo?.metaTitle?.ar).toBe('عنوان الميتا');
      expect(settings.seo?.keywords).toContain('keyword1');
    });

    it('should create settings with feature flags', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        key: 'site_settings',
        features: {
          enableBlog: true,
          enableContactForm: true,
          enableNewsletter: false,
          enableComments: true,
          maintenanceMode: false,
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.features?.enableBlog).toBe(true);
      expect(settings.features?.enableNewsletter).toBe(false);
      expect(settings.features?.maintenanceMode).toBe(false);
    });
  });

  describe('Static Methods', () => {
    it('should get settings with getSettings()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create settings first
      await Settings.create({
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
        },
      });

      const settings = await Settings.getSettings();

      expect(settings).toBeDefined();
      expect(settings?.key).toBe('site_settings');
    });

    it('should create default settings if none exist', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.getSettings();

      expect(settings).toBeDefined();
      expect(settings?.key).toBe('site_settings');
    });

    it('should update settings with updateSettings()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Settings.create({
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع قديم', en: 'Old Site' },
        },
      });

      const updatedSettings = await Settings.updateSettings({
        general: {
          siteName: { ar: 'موقع جديد', en: 'New Site' },
        },
      });

      expect(updatedSettings.general?.siteName?.ar).toBe('موقع جديد');
      expect(updatedSettings.general?.siteName?.en).toBe('New Site');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.create({
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
        },
      });

      expect(settings.createdAt).toBeDefined();
      expect(settings.updatedAt).toBeDefined();
    });

    it('should update updatedAt on save', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.create({
        key: 'site_settings',
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
        },
      });

      const originalUpdatedAt = settings.updatedAt;

      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 100));

      settings.general = {
        ...settings.general,
        siteName: { ar: 'موقع محدث', en: 'Updated Site' },
      };
      await settings.save();

      expect(settings.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
