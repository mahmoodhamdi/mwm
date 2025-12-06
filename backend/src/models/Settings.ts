/**
 * Settings Model
 * نموذج الإعدادات
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Bilingual content interface
 * واجهة المحتوى ثنائي اللغة
 */
export interface IBilingual {
  ar: string;
  en: string;
}

/**
 * General settings interface
 * واجهة الإعدادات العامة
 */
export interface IGeneralSettings {
  siteName: IBilingual;
  siteTagline: IBilingual;
  logo: {
    light: string;
    dark: string;
  };
  favicon: string;
  defaultLanguage: 'ar' | 'en';
  maintenanceMode: boolean;
  maintenanceMessage?: IBilingual;
}

/**
 * Contact settings interface
 * واجهة إعدادات التواصل
 */
export interface IContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: IBilingual;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: IBilingual;
}

/**
 * Social settings interface
 * واجهة إعدادات السوشيال ميديا
 */
export interface ISocialSettings {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
  behance?: string;
  dribbble?: string;
}

/**
 * SEO settings interface
 * واجهة إعدادات السيو
 */
export interface ISeoSettings {
  defaultTitle: IBilingual;
  defaultDescription: IBilingual;
  defaultKeywords: {
    ar: string[];
    en: string[];
  };
  ogImage: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
}

/**
 * Feature toggles interface
 * واجهة تفعيل الميزات
 */
export interface IFeatureSettings {
  blog: boolean;
  careers: boolean;
  newsletter: boolean;
  testimonials: boolean;
  darkMode: boolean;
  multiLanguage: boolean;
  contactForm: boolean;
  chatWidget: boolean;
  analytics: boolean;
}

/**
 * Homepage settings interface
 * واجهة إعدادات الصفحة الرئيسية
 */
export interface IHomepageSettings {
  heroEnabled: boolean;
  servicesEnabled: boolean;
  portfolioEnabled: boolean;
  statsEnabled: boolean;
  testimonialsEnabled: boolean;
  teamEnabled: boolean;
  blogEnabled: boolean;
  clientsEnabled: boolean;
  ctaEnabled: boolean;
  sectionsOrder: string[];
}

/**
 * Theme settings interface
 * واجهة إعدادات الثيم
 */
export interface IThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: {
    heading: string;
    body: string;
    arabic: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  buttonStyle: 'solid' | 'outline' | 'ghost';
}

/**
 * Email settings interface
 * واجهة إعدادات البريد الإلكتروني
 */
export interface IEmailSettings {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpSecure?: boolean;
  fromName: IBilingual;
  fromEmail: string;
  replyToEmail?: string;
  emailTemplates?: {
    welcome?: IBilingual;
    contactConfirmation?: IBilingual;
    newsletter?: IBilingual;
  };
}

/**
 * Main settings interface
 * واجهة الإعدادات الرئيسية
 */
export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  general: IGeneralSettings;
  contact: IContactSettings;
  social: ISocialSettings;
  seo: ISeoSettings;
  features: IFeatureSettings;
  homepage: IHomepageSettings;
  theme: IThemeSettings;
  email: IEmailSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bilingual schema
 * مخطط ثنائي اللغة
 */
const bilingualSchema = new Schema(
  {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Settings schema
 * مخطط الإعدادات
 */
const settingsSchema = new Schema<ISettings>(
  {
    general: {
      siteName: { type: bilingualSchema, default: { ar: 'MWM', en: 'MWM' } },
      siteTagline: {
        type: bilingualSchema,
        default: {
          ar: 'نحول أفكارك إلى واقع رقمي',
          en: 'We Turn Your Ideas Into Digital Reality',
        },
      },
      logo: {
        light: { type: String, default: '/images/logo-light.svg' },
        dark: { type: String, default: '/images/logo-dark.svg' },
      },
      favicon: { type: String, default: '/favicon.ico' },
      defaultLanguage: { type: String, enum: ['ar', 'en'], default: 'ar' },
      maintenanceMode: { type: Boolean, default: false },
      maintenanceMessage: { type: bilingualSchema },
    },

    contact: {
      email: { type: String, default: 'info@mwm.com' },
      phone: { type: String, default: '+966500000000' },
      whatsapp: { type: String, default: '+966500000000' },
      address: {
        type: bilingualSchema,
        default: {
          ar: 'الرياض، المملكة العربية السعودية',
          en: 'Riyadh, Saudi Arabia',
        },
      },
      location: {
        lat: { type: Number, default: 24.7136 },
        lng: { type: Number, default: 46.6753 },
      },
      workingHours: {
        type: bilingualSchema,
        default: {
          ar: 'الأحد - الخميس: 9 صباحاً - 6 مساءً',
          en: 'Sunday - Thursday: 9 AM - 6 PM',
        },
      },
    },

    social: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      behance: { type: String, default: '' },
      dribbble: { type: String, default: '' },
    },

    seo: {
      defaultTitle: {
        type: bilingualSchema,
        default: {
          ar: 'MWM - حلول برمجية متكاملة',
          en: 'MWM - Integrated Software Solutions',
        },
      },
      defaultDescription: {
        type: bilingualSchema,
        default: {
          ar: 'شركة تطوير برمجيات متخصصة في بناء تطبيقات الويب والموبايل',
          en: 'Software development company specializing in web and mobile applications',
        },
      },
      defaultKeywords: {
        ar: { type: [String], default: ['تطوير مواقع', 'تطبيقات', 'برمجة'] },
        en: { type: [String], default: ['web development', 'apps', 'software'] },
      },
      ogImage: { type: String, default: '/images/og-image.jpg' },
      twitterHandle: { type: String, default: '' },
      googleAnalyticsId: { type: String, default: '' },
      googleTagManagerId: { type: String, default: '' },
      facebookPixelId: { type: String, default: '' },
    },

    features: {
      blog: { type: Boolean, default: true },
      careers: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      multiLanguage: { type: Boolean, default: true },
      contactForm: { type: Boolean, default: true },
      chatWidget: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true },
    },

    homepage: {
      heroEnabled: { type: Boolean, default: true },
      servicesEnabled: { type: Boolean, default: true },
      portfolioEnabled: { type: Boolean, default: true },
      statsEnabled: { type: Boolean, default: true },
      testimonialsEnabled: { type: Boolean, default: true },
      teamEnabled: { type: Boolean, default: true },
      blogEnabled: { type: Boolean, default: true },
      clientsEnabled: { type: Boolean, default: true },
      ctaEnabled: { type: Boolean, default: true },
      sectionsOrder: {
        type: [String],
        default: [
          'hero',
          'services',
          'portfolio',
          'stats',
          'testimonials',
          'team',
          'blog',
          'clients',
          'cta',
        ],
      },
    },

    theme: {
      primaryColor: { type: String, default: '#3B82F6' },
      secondaryColor: { type: String, default: '#10B981' },
      accentColor: { type: String, default: '#F59E0B' },
      fonts: {
        heading: { type: String, default: 'Inter' },
        body: { type: String, default: 'Inter' },
        arabic: { type: String, default: 'Tajawal' },
      },
      borderRadius: {
        type: String,
        enum: ['none', 'sm', 'md', 'lg', 'full'],
        default: 'md',
      },
      buttonStyle: {
        type: String,
        enum: ['solid', 'outline', 'ghost'],
        default: 'solid',
      },
    },

    email: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
      smtpSecure: { type: Boolean, default: false },
      fromName: { type: bilingualSchema, default: { ar: 'MWM', en: 'MWM' } },
      fromEmail: { type: String, default: 'noreply@mwm.com' },
      replyToEmail: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  }
);

/**
 * Ensure only one settings document exists
 * التأكد من وجود مستند إعدادات واحد فقط
 */
settingsSchema.statics.getSettings = async function (): Promise<ISettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

/**
 * Update settings
 * تحديث الإعدادات
 */
settingsSchema.statics.updateSettings = async function (
  data: Partial<ISettings>
): Promise<ISettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return settings;
};

export interface ISettingsModel extends mongoose.Model<ISettings> {
  getSettings(): Promise<ISettings>;
  updateSettings(data: Partial<ISettings>): Promise<ISettings>;
}

export const Settings = mongoose.model<ISettings, ISettingsModel>('Settings', settingsSchema);
export default Settings;
