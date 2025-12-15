/**
 * Service Controller
 * متحكم الخدمات
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service, ServiceCategory } from '../models';
import { serviceValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const SERVICE_CACHE_PREFIX = 'service';
const CATEGORY_CACHE_PREFIX = 'service-category';
const CACHE_TTL = 1800; // 30 minutes

// ============================================
// Service Category Controllers
// ============================================

/**
 * Get all categories (Public)
 * جلب جميع الفئات (عام)
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${CATEGORY_CACHE_PREFIX}:all:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { categories: JSON.parse(cached) });
  }

  const categories = await ServiceCategory.getActiveCategories(locale);

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(categories));

  return successResponse(res, { categories });
});

/**
 * Get category by slug (Public)
 * جلب الفئة بالرابط المختصر (عام)
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${CATEGORY_CACHE_PREFIX}:${slug}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { category: JSON.parse(cached) });
  }

  const category = await ServiceCategory.getBySlug(slug, locale);

  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(category));

  return successResponse(res, { category });
});

/**
 * Get all categories (Admin)
 * جلب جميع الفئات (للمسؤول)
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, isActive, search } = req.query;

  const filter: Record<string, unknown> = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'name.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'name.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await ServiceCategory.countDocuments(filter);
  const categories = await ServiceCategory.find(filter)
    .sort({ order: 1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('servicesCount')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return paginatedResponse(res, {
    data: categories,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Create category (Admin)
 * إنشاء فئة (للمسؤول)
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = serviceValidation.createCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists
  const existingCategory = await ServiceCategory.findOne({ slug: value.slug });
  if (existingCategory) {
    throw Errors.SLUG_EXISTS();
  }

  const category = await ServiceCategory.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateCategoryCache();

  return successResponse(
    res,
    {
      message: 'Category created successfully | تم إنشاء الفئة بنجاح',
      category,
    },
    201
  );
});

/**
 * Update category (Admin)
 * تحديث فئة (للمسؤول)
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = serviceValidation.updateCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingCategory = await ServiceCategory.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const category = await ServiceCategory.findByIdAndUpdate(
    id,
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Invalidate cache
  await invalidateCategoryCache();

  return successResponse(res, {
    message: 'Category updated successfully | تم تحديث الفئة بنجاح',
    category,
  });
});

/**
 * Delete category (Admin)
 * حذف فئة (للمسؤول)
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if category has services
  const servicesCount = await Service.countDocuments({ category: id });
  if (servicesCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'category',
        message: `Cannot delete category with ${servicesCount} services | لا يمكن حذف فئة تحتوي على ${servicesCount} خدمات`,
      },
    ]);
  }

  const category = await ServiceCategory.findByIdAndDelete(id);

  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Invalidate cache
  await invalidateCategoryCache();

  return successResponse(res, {
    message: 'Category deleted successfully | تم حذف الفئة بنجاح',
  });
});

// ============================================
// Service Controllers
// ============================================

/**
 * Get services (Public)
 * جلب الخدمات (عام)
 */
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, category, featured, locale } = req.query;

  const cacheKey = `${SERVICE_CACHE_PREFIX}:list:${page}:${limit}:${category || 'all'}:${featured || 'all'}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, JSON.parse(cached));
  }

  const { services, total } = await Service.getActiveServices({
    category: category as string,
    locale: locale as 'ar' | 'en',
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    limit: Number(limit),
    page: Number(page),
  });

  const result = {
    services,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  return successResponse(res, result);
});

/**
 * Get service by slug (Public)
 * جلب الخدمة بالرابط المختصر (عام)
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  // Don't cache (due to view count increment)
  const service = await Service.getBySlug(slug, locale);

  if (!service) {
    throw Errors.NOT_FOUND('Service | الخدمة');
  }

  return successResponse(res, { service });
});

/**
 * Get featured services (Public)
 * جلب الخدمات المميزة (عام)
 */
export const getFeaturedServices = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6, locale } = req.query;

  const cacheKey = `${SERVICE_CACHE_PREFIX}:featured:${limit}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { services: JSON.parse(cached) });
  }

  const services = await Service.getFeaturedServices(
    Number(limit),
    locale as 'ar' | 'en' | undefined
  );

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(services));

  return successResponse(res, { services });
});

/**
 * Get all services (Admin)
 * جلب جميع الخدمات (للمسؤول)
 */
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    category,
    featured,
    isActive,
    search,
    sortBy = 'order',
    sortOrder = 'asc',
  } = req.query;

  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = category;
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'title.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'title.en': { $regex: escapedSearch, $options: 'i' } },
      { 'shortDescription.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'shortDescription.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Service.countDocuments(filter);

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy as string]: sortOrder === 'desc' ? -1 : 1,
  };

  const services = await Service.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate('category', 'name slug')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return paginatedResponse(res, {
    data: services,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Get service by ID (Admin)
 * جلب الخدمة بالمعرف (للمسؤول)
 */
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findById(id)
    .populate('category', 'name slug')
    .populate('relatedServices', 'title slug image')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!service) {
    throw Errors.NOT_FOUND('Service | الخدمة');
  }

  return successResponse(res, { service });
});

/**
 * Create service (Admin)
 * إنشاء خدمة (للمسؤول)
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = serviceValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists
  const category = await ServiceCategory.findById(value.category);
  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Check if slug already exists
  const existingService = await Service.findOne({ slug: value.slug });
  if (existingService) {
    throw Errors.SLUG_EXISTS();
  }

  const service = await Service.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateServiceCache();

  return successResponse(
    res,
    {
      message: 'Service created successfully | تم إنشاء الخدمة بنجاح',
      service,
    },
    201
  );
});

/**
 * Update service (Admin)
 * تحديث خدمة (للمسؤول)
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = serviceValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists (if updating category)
  if (value.category) {
    const category = await ServiceCategory.findById(value.category);
    if (!category) {
      throw Errors.NOT_FOUND('Category | الفئة');
    }
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingService = await Service.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingService) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const service = await Service.findByIdAndUpdate(
    id,
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  ).populate('category', 'name slug');

  if (!service) {
    throw Errors.NOT_FOUND('Service | الخدمة');
  }

  // Invalidate cache
  await invalidateServiceCache();

  return successResponse(res, {
    message: 'Service updated successfully | تم تحديث الخدمة بنجاح',
    service,
  });
});

/**
 * Delete service (Admin)
 * حذف خدمة (للمسؤول)
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    throw Errors.NOT_FOUND('Service | الخدمة');
  }

  // Invalidate cache
  await invalidateServiceCache();

  return successResponse(res, {
    message: 'Service deleted successfully | تم حذف الخدمة بنجاح',
  });
});

/**
 * Reorder services (Admin)
 * إعادة ترتيب الخدمات (للمسؤول)
 */
export const reorderServices = asyncHandler(async (req: Request, res: Response) => {
  const { services } = req.body;

  if (!Array.isArray(services)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'services', message: 'Services must be an array | الخدمات يجب أن تكون مصفوفة' },
    ]);
  }

  const operations = services.map((item: { id: string; order: number }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id) },
      update: { $set: { order: item.order } },
    },
  }));

  await Service.bulkWrite(operations);

  // Invalidate cache
  await invalidateServiceCache();

  return successResponse(res, {
    message: 'Services reordered successfully | تم إعادة ترتيب الخدمات بنجاح',
  });
});

// ============================================
// Helper Functions
// ============================================

/**
 * Invalidate service cache
 * إبطال ذاكرة التخزين المؤقت للخدمات
 */
async function invalidateServiceCache() {
  const keys = await redis.keys(`${SERVICE_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Invalidate category cache
 * إبطال ذاكرة التخزين المؤقت للفئات
 */
async function invalidateCategoryCache() {
  const keys = await redis.keys(`${CATEGORY_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export const serviceController = {
  // Categories
  getCategories,
  getCategoryBySlug,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Services
  getServices,
  getServiceBySlug,
  getFeaturedServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
};

export default serviceController;
