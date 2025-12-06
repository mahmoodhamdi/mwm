/**
 * Settings Validation Schemas
 * مخططات التحقق من الإعدادات
 */

import Joi from 'joi';

/**
 * Bilingual validation schema
 * مخطط التحقق ثنائي اللغة
 */
const bilingualSchema = Joi.object({
  ar: Joi.string().allow(''),
  en: Joi.string().allow(''),
});

/**
 * General settings validation
 * التحقق من الإعدادات العامة
 */
export const generalSettingsSchema = Joi.object({
  siteName: bilingualSchema,
  siteTagline: bilingualSchema,
  logo: Joi.object({
    light: Joi.string().uri().allow(''),
    dark: Joi.string().uri().allow(''),
  }),
  favicon: Joi.string().uri().allow(''),
  defaultLanguage: Joi.string().valid('ar', 'en'),
  maintenanceMode: Joi.boolean(),
  maintenanceMessage: bilingualSchema,
});

/**
 * Contact settings validation
 * التحقق من إعدادات التواصل
 */
export const contactSettingsSchema = Joi.object({
  email: Joi.string().email().allow(''),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s()-]+$/)
    .allow(''),
  whatsapp: Joi.string()
    .pattern(/^[+]?[\d\s()-]+$/)
    .allow(''),
  address: bilingualSchema,
  location: Joi.object({
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
  }),
  workingHours: bilingualSchema,
});

/**
 * Social settings validation
 * التحقق من إعدادات السوشيال ميديا
 */
export const socialSettingsSchema = Joi.object({
  facebook: Joi.string().uri().allow(''),
  twitter: Joi.string().uri().allow(''),
  instagram: Joi.string().uri().allow(''),
  linkedin: Joi.string().uri().allow(''),
  github: Joi.string().uri().allow(''),
  youtube: Joi.string().uri().allow(''),
  tiktok: Joi.string().uri().allow(''),
  behance: Joi.string().uri().allow(''),
  dribbble: Joi.string().uri().allow(''),
});

/**
 * SEO settings validation
 * التحقق من إعدادات السيو
 */
export const seoSettingsSchema = Joi.object({
  defaultTitle: bilingualSchema,
  defaultDescription: bilingualSchema,
  defaultKeywords: Joi.object({
    ar: Joi.array().items(Joi.string()),
    en: Joi.array().items(Joi.string()),
  }),
  ogImage: Joi.string().uri().allow(''),
  twitterHandle: Joi.string()
    .pattern(/^@?[a-zA-Z0-9_]+$/)
    .allow(''),
  googleAnalyticsId: Joi.string().allow(''),
  googleTagManagerId: Joi.string().allow(''),
  facebookPixelId: Joi.string().allow(''),
});

/**
 * Feature settings validation
 * التحقق من إعدادات الميزات
 */
export const featureSettingsSchema = Joi.object({
  blog: Joi.boolean(),
  careers: Joi.boolean(),
  newsletter: Joi.boolean(),
  testimonials: Joi.boolean(),
  darkMode: Joi.boolean(),
  multiLanguage: Joi.boolean(),
  contactForm: Joi.boolean(),
  chatWidget: Joi.boolean(),
  analytics: Joi.boolean(),
});

/**
 * Homepage settings validation
 * التحقق من إعدادات الصفحة الرئيسية
 */
export const homepageSettingsSchema = Joi.object({
  heroEnabled: Joi.boolean(),
  servicesEnabled: Joi.boolean(),
  portfolioEnabled: Joi.boolean(),
  statsEnabled: Joi.boolean(),
  testimonialsEnabled: Joi.boolean(),
  teamEnabled: Joi.boolean(),
  blogEnabled: Joi.boolean(),
  clientsEnabled: Joi.boolean(),
  ctaEnabled: Joi.boolean(),
  sectionsOrder: Joi.array().items(Joi.string()),
});

/**
 * Theme settings validation
 * التحقق من إعدادات الثيم
 */
export const themeSettingsSchema = Joi.object({
  primaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
  accentColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
  fonts: Joi.object({
    heading: Joi.string(),
    body: Joi.string(),
    arabic: Joi.string(),
  }),
  borderRadius: Joi.string().valid('none', 'sm', 'md', 'lg', 'full'),
  buttonStyle: Joi.string().valid('solid', 'outline', 'ghost'),
});

/**
 * Email settings validation
 * التحقق من إعدادات البريد الإلكتروني
 */
export const emailSettingsSchema = Joi.object({
  smtpHost: Joi.string().allow(''),
  smtpPort: Joi.number().port(),
  smtpUser: Joi.string().allow(''),
  smtpSecure: Joi.boolean(),
  fromName: bilingualSchema,
  fromEmail: Joi.string().email().allow(''),
  replyToEmail: Joi.string().email().allow(''),
});

/**
 * Full settings update validation
 * التحقق من تحديث كافة الإعدادات
 */
export const updateSettingsSchema = Joi.object({
  general: generalSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  seo: seoSettingsSchema,
  features: featureSettingsSchema,
  homepage: homepageSettingsSchema,
  theme: themeSettingsSchema,
  email: emailSettingsSchema,
})
  .min(1)
  .messages({
    'object.min':
      'At least one settings section is required | يجب تحديد قسم إعدادات واحد على الأقل',
  });

/**
 * Settings section update validation
 * التحقق من تحديث قسم من الإعدادات
 */
export const updateSettingsSectionSchema = Joi.object({
  section: Joi.string()
    .valid('general', 'contact', 'social', 'seo', 'features', 'homepage', 'theme', 'email')
    .required()
    .messages({
      'any.required': 'Section is required | القسم مطلوب',
      'any.only': 'Invalid section | القسم غير صالح',
    }),
  data: Joi.object().required().messages({
    'any.required': 'Section data is required | بيانات القسم مطلوبة',
  }),
});

export const settingsValidation = {
  update: updateSettingsSchema,
  updateSection: updateSettingsSectionSchema,
  general: generalSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  seo: seoSettingsSchema,
  features: featureSettingsSchema,
  homepage: homepageSettingsSchema,
  theme: themeSettingsSchema,
  email: emailSettingsSchema,
};

export default settingsValidation;
