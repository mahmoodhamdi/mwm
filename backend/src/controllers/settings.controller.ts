/**
 * Settings Controller
 * متحكم الإعدادات
 */

import { Request, Response } from 'express';
import { Settings, ISettings } from '../models';
import { settingsValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse } from '../utils/response';
import { redis } from '../config';

const SETTINGS_CACHE_KEY = 'settings';
const SETTINGS_CACHE_TTL = 3600; // 1 hour

/**
 * Get all settings (Admin)
 * جلب كل الإعدادات (للمسؤول)
 */
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  // Try cache first
  const cached = await redis.get(SETTINGS_CACHE_KEY);
  if (cached) {
    return successResponse(res, {
      settings: JSON.parse(cached),
    });
  }

  const settings = await Settings.getSettings();

  // Cache the settings
  await redis.setex(SETTINGS_CACHE_KEY, SETTINGS_CACHE_TTL, JSON.stringify(settings));

  return successResponse(res, { settings });
});

/**
 * Get public settings
 * جلب الإعدادات العامة
 */
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = `${SETTINGS_CACHE_KEY}:public`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      settings: JSON.parse(cached),
    });
  }

  const settings = await Settings.getSettings();

  // Return only public settings
  const publicSettings = {
    general: {
      siteName: settings.general.siteName,
      siteTagline: settings.general.siteTagline,
      logo: settings.general.logo,
      favicon: settings.general.favicon,
      defaultLanguage: settings.general.defaultLanguage,
      maintenanceMode: settings.general.maintenanceMode,
      maintenanceMessage: settings.general.maintenanceMessage,
    },
    contact: settings.contact,
    social: settings.social,
    seo: {
      defaultTitle: settings.seo.defaultTitle,
      defaultDescription: settings.seo.defaultDescription,
      ogImage: settings.seo.ogImage,
    },
    features: settings.features,
    homepage: settings.homepage,
    theme: settings.theme,
  };

  // Cache the public settings
  await redis.setex(cacheKey, SETTINGS_CACHE_TTL, JSON.stringify(publicSettings));

  return successResponse(res, { settings: publicSettings });
});

/**
 * Update settings
 * تحديث الإعدادات
 */
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = settingsValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const settings = await Settings.updateSettings(value);

  // Invalidate cache
  await redis.del(SETTINGS_CACHE_KEY);
  await redis.del(`${SETTINGS_CACHE_KEY}:public`);

  return successResponse(res, {
    message: 'Settings updated successfully | تم تحديث الإعدادات بنجاح',
    settings,
  });
});

/**
 * Update a specific settings section
 * تحديث قسم معين من الإعدادات
 */
export const updateSettingsSection = asyncHandler(async (req: Request, res: Response) => {
  const { section } = req.params;
  const { data } = req.body;

  // Validate section
  const validSections = [
    'general',
    'contact',
    'social',
    'seo',
    'features',
    'homepage',
    'theme',
    'email',
  ];
  if (!validSections.includes(section)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'section', message: 'Invalid section | القسم غير صالح' },
    ]);
  }

  // Validate section data
  const sectionSchema = settingsValidation[section as keyof typeof settingsValidation];
  if (sectionSchema && 'validate' in sectionSchema) {
    const { error, value } = sectionSchema.validate(data, { abortEarly: false });
    if (error) {
      throw Errors.VALIDATION_ERROR(
        error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
      );
    }

    // Update only the specific section
    const updateData: Partial<ISettings> = {
      [section]: value,
    } as Partial<ISettings>;

    const settings = await Settings.updateSettings(updateData);

    // Invalidate cache
    await redis.del(SETTINGS_CACHE_KEY);
    await redis.del(`${SETTINGS_CACHE_KEY}:public`);

    return successResponse(res, {
      message: `${section} settings updated successfully | تم تحديث إعدادات ${section} بنجاح`,
      settings,
    });
  }

  throw Errors.VALIDATION_ERROR([
    { field: 'section', message: 'Invalid section | القسم غير صالح' },
  ]);
});

/**
 * Reset settings to defaults
 * إعادة تعيين الإعدادات للقيم الافتراضية
 */
export const resetSettings = asyncHandler(async (_req: Request, res: Response) => {
  // Delete current settings
  await Settings.deleteMany({});

  // Create new default settings
  const settings = await Settings.getSettings();

  // Invalidate cache
  await redis.del(SETTINGS_CACHE_KEY);
  await redis.del(`${SETTINGS_CACHE_KEY}:public`);

  return successResponse(res, {
    message:
      'Settings reset to defaults successfully | تم إعادة تعيين الإعدادات للقيم الافتراضية بنجاح',
    settings,
  });
});

export const settingsController = {
  getSettings,
  getPublicSettings,
  updateSettings,
  updateSettingsSection,
  resetSettings,
};

export default settingsController;
