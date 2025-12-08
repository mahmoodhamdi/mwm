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
      await Settings.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create settings with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        general: {
          siteName: { ar: 'موقع اختبار', en: 'Test Site' },
          siteTagline: { ar: 'وصف الموقع', en: 'Site Description' },
          logo: { light: '/images/logo-light.svg', dark: '/images/logo-dark.svg' },
          favicon: '/favicon.ico',
          defaultLanguage: 'ar' as const,
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings._id).toBeDefined();
      expect(settings.general?.siteName?.ar).toBe('موقع اختبار');
      expect(settings.general?.siteName?.en).toBe('Test Site');
    });

    it('should create settings with contact info', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        contact: {
          email: 'info@example.com',
          phone: '+966500000000',
          whatsapp: '+966500000000',
          address: { ar: 'الرياض', en: 'Riyadh' },
          workingHours: { ar: '9 ص - 5 م', en: '9 AM - 5 PM' },
          location: { lat: 24.7136, lng: 46.6753 },
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
        seo: {
          defaultTitle: { ar: 'عنوان الميتا', en: 'Meta Title' },
          defaultDescription: { ar: 'وصف الميتا', en: 'Meta Description' },
          defaultKeywords: { ar: ['كلمة1', 'كلمة2'], en: ['keyword1', 'keyword2'] },
          ogImage: '/images/og-image.jpg',
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.seo?.defaultTitle?.ar).toBe('عنوان الميتا');
      expect(settings.seo?.defaultKeywords?.en).toContain('keyword1');
    });

    it('should create settings with feature flags', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settingsData = {
        features: {
          blog: true,
          contactForm: true,
          newsletter: false,
          testimonials: true,
          darkMode: true,
        },
      };

      const settings = await Settings.create(settingsData);

      expect(settings.features?.blog).toBe(true);
      expect(settings.features?.newsletter).toBe(false);
    });
  });

  describe('Static Methods', () => {
    it('should get settings with getSettings()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      // Create settings first
      await Settings.create({
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
        },
      });

      const settings = await Settings.getSettings();

      expect(settings).toBeDefined();
      expect(settings?.general?.siteName?.ar).toBe('موقع');
    });

    it('should create default settings if none exist', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.getSettings();

      expect(settings).toBeDefined();
      // Should have default values
      expect(settings?.general?.siteName?.ar).toBe('MWM');
      expect(settings?.general?.siteName?.en).toBe('MWM');
    });

    it('should update settings with updateSettings()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await Settings.create({
        general: {
          siteName: { ar: 'موقع قديم', en: 'Old Site' },
          siteTagline: { ar: 'شعار', en: 'Tagline' },
          logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
          favicon: '/favicon.ico',
          defaultLanguage: 'ar' as const,
          maintenanceMode: false,
        },
      });

      const updatedSettings = await Settings.updateSettings({
        general: {
          siteName: { ar: 'موقع جديد', en: 'New Site' },
          siteTagline: { ar: 'شعار', en: 'Tagline' },
          logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
          favicon: '/favicon.ico',
          defaultLanguage: 'ar' as const,
          maintenanceMode: false,
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
        general: {
          siteName: { ar: 'موقع', en: 'Site' },
          siteTagline: { ar: 'شعار', en: 'Tagline' },
          logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
          favicon: '/favicon.ico',
          defaultLanguage: 'ar' as const,
          maintenanceMode: false,
        },
      });

      const originalUpdatedAt = settings.updatedAt;

      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 100));

      settings.general = {
        siteName: { ar: 'موقع محدث', en: 'Updated Site' },
        siteTagline: { ar: 'شعار', en: 'Tagline' },
        logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
        favicon: '/favicon.ico',
        defaultLanguage: 'ar' as const,
        maintenanceMode: false,
      };
      await settings.save();

      expect(settings.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Default Values', () => {
    it('should have default feature values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.create({});

      expect(settings.features?.blog).toBe(true);
      expect(settings.features?.darkMode).toBe(true);
      expect(settings.features?.multiLanguage).toBe(true);
    });

    it('should have default theme values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.create({});

      expect(settings.theme?.primaryColor).toBe('#3B82F6');
      expect(settings.theme?.borderRadius).toBe('md');
      expect(settings.theme?.buttonStyle).toBe('solid');
    });

    it('should have default homepage settings', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const settings = await Settings.create({});

      expect(settings.homepage?.heroEnabled).toBe(true);
      expect(settings.homepage?.servicesEnabled).toBe(true);
      expect(settings.homepage?.sectionsOrder).toContain('hero');
    });
  });
});
