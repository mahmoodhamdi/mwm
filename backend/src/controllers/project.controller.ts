/**
 * Project Controller
 * متحكم المشاريع
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project, ProjectCategory } from '../models';
import { projectValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const PROJECT_CACHE_PREFIX = 'project';
const CATEGORY_CACHE_PREFIX = 'project-category';
const CACHE_TTL = 1800; // 30 minutes

// ============================================
// Project Category Controllers
// ============================================

/**
 * Get all categories (Public)
 * جلب جميع الفئات (عام)
 */
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = `${CATEGORY_CACHE_PREFIX}:all`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { categories: JSON.parse(cached) });
  }

  const categories = await ProjectCategory.getActiveCategories();

  // Populate projectsCount virtual
  await ProjectCategory.populate(categories, { path: 'projectsCount' });

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

  const cacheKey = `${CATEGORY_CACHE_PREFIX}:${slug}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { category: JSON.parse(cached) });
  }

  const category = await ProjectCategory.getBySlug(slug);

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
  const { isActive, search } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 20,
    maxLimit: 100,
  });

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

  const total = await ProjectCategory.countDocuments(filter);
  const categories = await ProjectCategory.find(filter)
    .sort({ order: 1 })
    .skip(skip)
    .limit(limit)
    .populate('projectsCount');

  return paginatedResponse(res, {
    data: categories,
    page,
    limit,
    total,
  });
});

/**
 * Create category (Admin)
 * إنشاء فئة (للمسؤول)
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = projectValidation.createCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists
  const existingCategory = await ProjectCategory.findOne({ slug: value.slug });
  if (existingCategory) {
    throw Errors.SLUG_EXISTS();
  }

  const category = await ProjectCategory.create(value);

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

  const { error, value } = projectValidation.updateCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingCategory = await ProjectCategory.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const category = await ProjectCategory.findByIdAndUpdate(id, value, {
    new: true,
    runValidators: true,
  });

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

  // Check if category has projects
  const projectsCount = await Project.countDocuments({ category: id });
  if (projectsCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'category',
        message: `Cannot delete category with ${projectsCount} projects | لا يمكن حذف فئة تحتوي على ${projectsCount} مشاريع`,
      },
    ]);
  }

  const category = await ProjectCategory.findByIdAndDelete(id);

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
// Project Controllers
// ============================================

/**
 * Get projects (Public)
 * جلب المشاريع (عام)
 */
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { category, technology } = req.query;

  // Use validated pagination utility
  const { page, limit } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 12,
    maxLimit: 100,
  });

  const cacheKey = `${PROJECT_CACHE_PREFIX}:list:${page}:${limit}:${category || 'all'}:${technology || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, JSON.parse(cached));
  }

  const { projects, total, totalPages } = await Project.getPublishedProjects(
    page,
    limit,
    category as string,
    technology as string
  );

  const result = {
    projects,
    pagination: {
      page,
      limit,
      total,
      pages: totalPages,
    },
  };

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  return successResponse(res, result);
});

/**
 * Get project by slug (Public)
 * جلب المشروع بالرابط المختصر (عام)
 */
export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const project = await Project.getBySlug(slug);

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  // Increment view count (don't await to not slow down response)
  Project.incrementViews(project._id).catch(console.error);

  return successResponse(res, { project });
});

/**
 * Get featured projects (Public)
 * جلب المشاريع المميزة (عام)
 */
export const getFeaturedProjects = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6 } = req.query;

  const cacheKey = `${PROJECT_CACHE_PREFIX}:featured:${limit}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { projects: JSON.parse(cached) });
  }

  const projects = await Project.getFeaturedProjects(Number(limit));

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(projects));

  return successResponse(res, { projects });
});

/**
 * Get all projects (Admin)
 * جلب جميع المشاريع (للمسؤول)
 */
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    featured,
    isPublished,
    search,
    sortBy = 'order',
    sortOrder = 'asc',
  } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 12,
    maxLimit: 100,
  });

  const filter: Record<string, unknown> = {};

  if (category) {
    // Check if it's an ObjectId or slug
    if (mongoose.isValidObjectId(category)) {
      filter.category = category;
    } else {
      // Find category by slug
      const cat = await ProjectCategory.findOne({ slug: category });
      if (cat) {
        filter.category = cat._id;
      }
    }
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'title.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'title.en': { $regex: escapedSearch, $options: 'i' } },
      { 'shortDescription.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'shortDescription.en': { $regex: escapedSearch, $options: 'i' } },
      { 'technologies.name': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const total = await Project.countDocuments(filter);

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy as string]: sortOrder === 'desc' ? -1 : 1,
  };

  const projects = await Project.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug')
    .populate('createdBy', 'name email');

  return paginatedResponse(res, {
    data: projects,
    page,
    limit,
    total,
  });
});

/**
 * Get project by ID (Admin)
 * جلب المشروع بالمعرف (للمسؤول)
 */
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    .populate('category', 'name slug')
    .populate('createdBy', 'name email');

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  return successResponse(res, { project });
});

/**
 * Create project (Admin)
 * إنشاء مشروع (للمسؤول)
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = projectValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists
  const category = await ProjectCategory.findById(value.category);
  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Check if slug already exists
  const existingProject = await Project.findOne({ slug: value.slug });
  if (existingProject) {
    throw Errors.SLUG_EXISTS();
  }

  const project = await Project.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(
    res,
    {
      message: 'Project created successfully | تم إنشاء المشروع بنجاح',
      project,
    },
    201
  );
});

/**
 * Update project (Admin)
 * تحديث مشروع (للمسؤول)
 */
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = projectValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists (if updating category)
  if (value.category) {
    const category = await ProjectCategory.findById(value.category);
    if (!category) {
      throw Errors.NOT_FOUND('Category | الفئة');
    }
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingProject = await Project.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingProject) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const project = await Project.findByIdAndUpdate(id, value, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(res, {
    message: 'Project updated successfully | تم تحديث المشروع بنجاح',
    project,
  });
});

/**
 * Delete project (Admin)
 * حذف مشروع (للمسؤول)
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(res, {
    message: 'Project deleted successfully | تم حذف المشروع بنجاح',
  });
});

/**
 * Reorder projects (Admin)
 * إعادة ترتيب المشاريع (للمسؤول)
 */
export const reorderProjects = asyncHandler(async (req: Request, res: Response) => {
  const { projects } = req.body;

  if (!Array.isArray(projects)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'projects', message: 'Projects must be an array | المشاريع يجب أن تكون مصفوفة' },
    ]);
  }

  const operations = projects.map((item: { id: string; order: number }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id) },
      update: { $set: { order: item.order } },
    },
  }));

  await Project.bulkWrite(operations);

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(res, {
    message: 'Projects reordered successfully | تم إعادة ترتيب المشاريع بنجاح',
  });
});

/**
 * Toggle project publish status (Admin)
 * تبديل حالة نشر المشروع (للمسؤول)
 */
export const togglePublishStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  project.isPublished = !project.isPublished;
  await project.save();

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(res, {
    message: project.isPublished
      ? 'Project published successfully | تم نشر المشروع بنجاح'
      : 'Project unpublished successfully | تم إلغاء نشر المشروع بنجاح',
    project,
  });
});

/**
 * Toggle project featured status (Admin)
 * تبديل حالة تمييز المشروع (للمسؤول)
 */
export const toggleFeaturedStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw Errors.NOT_FOUND('Project | المشروع');
  }

  project.isFeatured = !project.isFeatured;
  await project.save();

  // Invalidate cache
  await invalidateProjectCache();

  return successResponse(res, {
    message: project.isFeatured
      ? 'Project marked as featured | تم تمييز المشروع'
      : 'Project unmarked as featured | تم إلغاء تمييز المشروع',
    project,
  });
});

// ============================================
// Helper Functions
// ============================================

/**
 * Invalidate project cache
 * إبطال ذاكرة التخزين المؤقت للمشاريع
 */
async function invalidateProjectCache() {
  const keys = await redis.keys(`${PROJECT_CACHE_PREFIX}:*`);
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

export const projectController = {
  // Categories
  getCategories,
  getCategoryBySlug,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Projects
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  togglePublishStatus,
  toggleFeaturedStatus,
};

export default projectController;
