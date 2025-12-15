/**
 * Translation Controller
 * متحكم الترجمة
 */

import { Request, Response } from 'express';
import { Translation } from '../models';
import { translationValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const TRANSLATION_CACHE_PREFIX = 'translations';
const TRANSLATION_CACHE_TTL = 3600; // 1 hour

/**
 * Get translations by namespace and locale
 * جلب الترجمات حسب مساحة الاسم واللغة
 */
export const getByNamespace = asyncHandler(async (req: Request, res: Response) => {
  const { namespace } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || 'ar';

  const cacheKey = `${TRANSLATION_CACHE_PREFIX}:${namespace}:${locale}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      translations: JSON.parse(cached),
    });
  }

  const translations = await Translation.getByNamespace(namespace, locale);

  // Cache the translations
  await redis.setex(cacheKey, TRANSLATION_CACHE_TTL, JSON.stringify(translations));

  return successResponse(res, { translations });
});

/**
 * Get all translations for a locale
 * جلب كل الترجمات للغة معينة
 */
export const getAllByLocale = asyncHandler(async (req: Request, res: Response) => {
  const locale = (req.query.locale as 'ar' | 'en') || 'ar';

  const cacheKey = `${TRANSLATION_CACHE_PREFIX}:all:${locale}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      translations: JSON.parse(cached),
    });
  }

  const translations = await Translation.getAllByLocale(locale);

  // Cache the translations
  await redis.setex(cacheKey, TRANSLATION_CACHE_TTL, JSON.stringify(translations));

  return successResponse(res, { translations });
});

/**
 * Get all translations (Admin)
 * جلب كل الترجمات (للمسؤول)
 */
export const getAllTranslations = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 50, namespace, search } = req.query;

  const filter: Record<string, unknown> = {};

  if (namespace) {
    filter.namespace = namespace;
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { key: { $regex: escapedSearch, $options: 'i' } },
      { 'translations.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'translations.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Translation.countDocuments(filter);
  const translations = await Translation.find(filter)
    .sort({ namespace: 1, key: 1 })
    .skip(skip)
    .limit(Number(limit));

  return paginatedResponse(res, {
    data: translations,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Get single translation
 * جلب ترجمة واحدة
 */
export const getTranslation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const translation = await Translation.findById(id);

  if (!translation) {
    throw Errors.NOT_FOUND('Translation | الترجمة');
  }

  return successResponse(res, { translation });
});

/**
 * Create translation
 * إنشاء ترجمة
 */
export const createTranslation = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = translationValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if key+namespace already exists
  const existing = await Translation.findOne({
    key: value.key,
    namespace: value.namespace,
  });

  if (existing) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'key',
        message:
          'Translation key already exists in this namespace | مفتاح الترجمة موجود مسبقاً في مساحة الاسم هذه',
      },
    ]);
  }

  const translation = await Translation.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateTranslationCache(value.namespace);

  return successResponse(
    res,
    {
      message: 'Translation created successfully | تم إنشاء الترجمة بنجاح',
      translation,
    },
    201
  );
});

/**
 * Update translation
 * تحديث الترجمة
 */
export const updateTranslation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = translationValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const translation = await Translation.findByIdAndUpdate(
    id,
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  );

  if (!translation) {
    throw Errors.NOT_FOUND('Translation | الترجمة');
  }

  // Invalidate cache
  await invalidateTranslationCache(translation.namespace);

  return successResponse(res, {
    message: 'Translation updated successfully | تم تحديث الترجمة بنجاح',
    translation,
  });
});

/**
 * Upsert translation
 * إدراج أو تحديث الترجمة
 */
export const upsertTranslation = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = translationValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const translation = await Translation.upsertTranslation(
    value.key,
    value.namespace,
    value.translations,
    {
      description: value.description,
      isSystem: value.isSystem,
      updatedBy: req.user?._id,
    }
  );

  // Invalidate cache
  await invalidateTranslationCache(value.namespace);

  return successResponse(res, {
    message: 'Translation saved successfully | تم حفظ الترجمة بنجاح',
    translation,
  });
});

/**
 * Bulk upsert translations
 * إدراج أو تحديث متعدد للترجمات
 */
export const bulkUpsertTranslations = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = translationValidation.bulkUpsert.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const translations = await Translation.bulkUpsert(value.translations);

  // Invalidate all translation cache
  const keys = await redis.keys(`${TRANSLATION_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return successResponse(res, {
    message: `${translations.length} translations saved successfully | تم حفظ ${translations.length} ترجمة بنجاح`,
    translations,
  });
});

/**
 * Delete translation
 * حذف الترجمة
 */
export const deleteTranslation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const translation = await Translation.findById(id);

  if (!translation) {
    throw Errors.NOT_FOUND('Translation | الترجمة');
  }

  if (translation.isSystem) {
    throw Errors.FORBIDDEN('Cannot delete system translation | لا يمكن حذف ترجمة النظام');
  }

  await Translation.deleteOne({ _id: id });

  // Invalidate cache
  await invalidateTranslationCache(translation.namespace);

  return successResponse(res, {
    message: 'Translation deleted successfully | تم حذف الترجمة بنجاح',
  });
});

/**
 * Get namespaces list
 * جلب قائمة مساحات الأسماء
 */
export const getNamespaces = asyncHandler(async (_req: Request, res: Response) => {
  const namespaces = await Translation.distinct('namespace');

  return successResponse(res, { namespaces });
});

/**
 * Search translations
 * البحث في الترجمات
 */
export const searchTranslations = asyncHandler(async (req: Request, res: Response) => {
  const { query, namespace, locale = 'ar', limit = 50 } = req.query;

  if (!query || (query as string).length < 2) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'query',
        message:
          'Search query must be at least 2 characters | يجب أن يكون استعلام البحث على الأقل حرفين',
      },
    ]);
  }

  const translations = await Translation.search(query as string, {
    namespace: namespace as string | undefined,
    locale: locale as 'ar' | 'en',
    limit: Number(limit),
  });

  return successResponse(res, { translations });
});

/**
 * Helper: Invalidate translation cache
 * مساعد: إبطال ذاكرة التخزين المؤقت للترجمات
 */
async function invalidateTranslationCache(namespace: string) {
  const keysToDelete = [
    `${TRANSLATION_CACHE_PREFIX}:${namespace}:ar`,
    `${TRANSLATION_CACHE_PREFIX}:${namespace}:en`,
    `${TRANSLATION_CACHE_PREFIX}:all:ar`,
    `${TRANSLATION_CACHE_PREFIX}:all:en`,
  ];

  for (const k of keysToDelete) {
    await redis.del(k);
  }
}

export const translationController = {
  getByNamespace,
  getAllByLocale,
  getAllTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  upsertTranslation,
  bulkUpsertTranslations,
  deleteTranslation,
  getNamespaces,
  searchTranslations,
};

export default translationController;
