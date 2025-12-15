/**
 * Content Controller (CMS)
 * متحكم المحتوى
 */

import { Request, Response } from 'express';
import { SiteContent, ISiteContent } from '../models';
import { contentValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const CONTENT_CACHE_PREFIX = 'content';
const CONTENT_CACHE_TTL = 1800; // 30 minutes

/**
 * Get content by key
 * جلب المحتوى بالمفتاح
 */
export const getContentByKey = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const locale = (req.query['locale'] as 'ar' | 'en') || undefined;

  const cacheKey = `${CONTENT_CACHE_PREFIX}:${key}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      content: JSON.parse(cached),
    });
  }

  const content = await SiteContent.getByKey(key, locale);

  if (!content) {
    throw Errors.NOT_FOUND('Content | المحتوى');
  }

  // Cache the content
  await redis.setex(cacheKey, CONTENT_CACHE_TTL, JSON.stringify(content));

  return successResponse(res, { content }, 200);
});

/**
 * Get content by section
 * جلب المحتوى حسب القسم
 */
export const getContentBySection = asyncHandler(async (req: Request, res: Response) => {
  const { section } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${CONTENT_CACHE_PREFIX}:section:${section}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      contents: JSON.parse(cached),
    });
  }

  const contents = await SiteContent.getBySection(section, locale);

  // Cache the content
  await redis.setex(cacheKey, CONTENT_CACHE_TTL, JSON.stringify(contents));

  return successResponse(res, { contents });
});

/**
 * Get all content (Admin)
 * جلب كل المحتوى (للمسؤول)
 */
export const getAllContent = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, section, type, isActive, search } = req.query;

  const filter: Record<string, unknown> = {};

  if (section) {
    filter.section = section;
  }

  if (type) {
    filter.type = type;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { key: { $regex: escapedSearch, $options: 'i' } },
      { 'content.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'content.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await SiteContent.countDocuments(filter);
  const contents = await SiteContent.find(filter)
    .sort({ section: 1, order: 1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return paginatedResponse(res, {
    data: contents,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Create content
 * إنشاء محتوى
 */
export const createContent = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = contentValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if key already exists
  const existingContent = await SiteContent.findOne({ key: value.key });
  if (existingContent) {
    throw Errors.VALIDATION_ERROR([
      { field: 'key', message: 'Content key already exists | مفتاح المحتوى موجود مسبقاً' },
    ]);
  }

  const content = await SiteContent.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate related caches
  await invalidateContentCache(value.key, value.section);

  return successResponse(
    res,
    {
      message: 'Content created successfully | تم إنشاء المحتوى بنجاح',
      content,
    },
    201
  );
});

/**
 * Update content
 * تحديث المحتوى
 */
export const updateContent = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const { error, value } = contentValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const content = await SiteContent.findOneAndUpdate(
    { key },
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  );

  if (!content) {
    throw Errors.NOT_FOUND('Content | المحتوى');
  }

  // Invalidate related caches
  await invalidateContentCache(key, content.section);

  return successResponse(res, {
    message: 'Content updated successfully | تم تحديث المحتوى بنجاح',
    content,
  });
});

/**
 * Upsert content
 * إدراج أو تحديث المحتوى
 */
export const upsertContent = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const { error, value } = contentValidation.create.validate(
    { ...req.body, key },
    { abortEarly: false }
  );

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const content = await SiteContent.upsertContent(key, {
    ...value,
    updatedBy: req.user?._id,
  });

  // Invalidate related caches
  await invalidateContentCache(key, content.section);

  return successResponse(res, {
    message: 'Content saved successfully | تم حفظ المحتوى بنجاح',
    content,
  });
});

/**
 * Bulk upsert content
 * إدراج أو تحديث متعدد للمحتوى
 */
export const bulkUpsertContent = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = contentValidation.bulkUpsert.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const contentsToUpsert = value.contents.map(
    (item: { key: string; data: Partial<ISiteContent> }) => ({
      key: item.key,
      data: {
        ...item.data,
        updatedBy: req.user?._id,
      },
    })
  );

  const contents = await SiteContent.bulkUpsert(contentsToUpsert);

  // Invalidate all content cache
  const keys = await redis.keys(`${CONTENT_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }

  return successResponse(res, {
    message: `${contents.length} contents saved successfully | تم حفظ ${contents.length} محتوى بنجاح`,
    contents,
  });
});

/**
 * Delete content
 * حذف المحتوى
 */
export const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;

  const content = await SiteContent.findOne({ key });

  if (!content) {
    throw Errors.NOT_FOUND('Content | المحتوى');
  }

  if (content.isSystem) {
    throw Errors.FORBIDDEN('Cannot delete system content | لا يمكن حذف محتوى النظام');
  }

  await SiteContent.deleteOne({ key });

  // Invalidate related caches
  await invalidateContentCache(key, content.section);

  return successResponse(res, {
    message: 'Content deleted successfully | تم حذف المحتوى بنجاح',
  });
});

/**
 * Get sections list
 * جلب قائمة الأقسام
 */
export const getSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await SiteContent.distinct('section');

  return successResponse(res, { sections });
});

/**
 * Helper: Invalidate content cache
 * مساعد: إبطال ذاكرة التخزين المؤقت للمحتوى
 */
async function invalidateContentCache(key: string, section: string) {
  const keysToDelete = [
    `${CONTENT_CACHE_PREFIX}:${key}:ar`,
    `${CONTENT_CACHE_PREFIX}:${key}:en`,
    `${CONTENT_CACHE_PREFIX}:${key}:all`,
    `${CONTENT_CACHE_PREFIX}:section:${section}:ar`,
    `${CONTENT_CACHE_PREFIX}:section:${section}:en`,
    `${CONTENT_CACHE_PREFIX}:section:${section}:all`,
  ];

  for (const k of keysToDelete) {
    await redis.del(k);
  }
}

export const contentController = {
  getContentByKey,
  getContentBySection,
  getAllContent,
  createContent,
  updateContent,
  upsertContent,
  bulkUpsertContent,
  deleteContent,
  getSections,
};

export default contentController;
