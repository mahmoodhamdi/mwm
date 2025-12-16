/**
 * Blog Controller
 * متحكم المدونة
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BlogPost, BlogCategory, User } from '../models';
import { blogValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const POST_CACHE_PREFIX = 'blog-post';
const CATEGORY_CACHE_PREFIX = 'blog-category';
const CACHE_TTL = 1800; // 30 minutes

// ============================================
// Blog Category Controllers
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

  const categories = await BlogCategory.getActiveCategories(locale);

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

  const category = await BlogCategory.getBySlug(slug, locale);

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
  const { isActive, search, parent } = req.query;

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

  if (parent !== undefined) {
    filter.parent = parent === 'null' ? null : parent;
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'name.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'name.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const total = await BlogCategory.countDocuments(filter);
  const categories = await BlogCategory.find(filter)
    .sort({ order: 1 })
    .skip(skip)
    .limit(limit)
    .populate('postCount')
    .populate('parent', 'name slug')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

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
  const { error, value } = blogValidation.createCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists
  const existingCategory = await BlogCategory.findOne({ slug: value.slug });
  if (existingCategory) {
    throw Errors.SLUG_EXISTS();
  }

  // Check if parent exists (if provided)
  if (value.parent) {
    const parentCategory = await BlogCategory.findById(value.parent);
    if (!parentCategory) {
      throw Errors.NOT_FOUND('Parent category | الفئة الأب');
    }
  }

  const category = await BlogCategory.create({
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

  const { error, value } = blogValidation.updateCategory.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingCategory = await BlogCategory.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw Errors.SLUG_EXISTS();
    }
  }

  // Check if parent exists (if updating parent)
  if (value.parent) {
    const parentCategory = await BlogCategory.findById(value.parent);
    if (!parentCategory) {
      throw Errors.NOT_FOUND('Parent category | الفئة الأب');
    }
    // Prevent setting parent to itself
    if (value.parent === id) {
      throw Errors.VALIDATION_ERROR([
        {
          field: 'parent',
          message: 'Category cannot be its own parent | لا يمكن أن تكون الفئة أب لنفسها',
        },
      ]);
    }
  }

  const category = await BlogCategory.findByIdAndUpdate(
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

  // Check if category has posts
  const postsCount = await BlogPost.countDocuments({ category: id });
  if (postsCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'category',
        message: `Cannot delete category with ${postsCount} posts | لا يمكن حذف فئة تحتوي على ${postsCount} مقالات`,
      },
    ]);
  }

  // Check if category has children
  const childrenCount = await BlogCategory.countDocuments({ parent: id });
  if (childrenCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'category',
        message: `Cannot delete category with ${childrenCount} subcategories | لا يمكن حذف فئة تحتوي على ${childrenCount} فئات فرعية`,
      },
    ]);
  }

  const category = await BlogCategory.findByIdAndDelete(id);

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
// Blog Post Controllers
// ============================================

/**
 * Get posts (Public)
 * جلب المقالات (عام)
 */
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, featured, locale, search } = req.query;

  // Use validated pagination utility
  const { page, limit } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 10,
    maxLimit: 100,
  });

  const cacheKey = `${POST_CACHE_PREFIX}:list:${page}:${limit}:${category || 'all'}:${tag || 'all'}:${featured || 'all'}:${locale || 'all'}:${search || 'none'}`;

  // Try cache first (skip if search is provided)
  if (!search) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return successResponse(res, JSON.parse(cached));
    }
  }

  const { posts, total } = await BlogPost.getPublishedPosts({
    category: category as string,
    tag: tag as string,
    locale: locale as 'ar' | 'en',
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    limit,
    page,
    search: search as string,
  });

  const result = {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  // Cache the result (skip if search is provided)
  if (!search) {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  }

  return successResponse(res, result);
});

/**
 * Get post by slug (Public)
 * جلب المقال بالرابط المختصر (عام)
 */
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  // Don't cache (due to view count increment)
  const post = await BlogPost.getBySlug(slug, locale);

  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  return successResponse(res, { post });
});

/**
 * Get featured posts (Public)
 * جلب المقالات المميزة (عام)
 */
export const getFeaturedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5, locale } = req.query;

  const cacheKey = `${POST_CACHE_PREFIX}:featured:${limit}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { posts: JSON.parse(cached) });
  }

  const posts = await BlogPost.getFeaturedPosts(Number(limit), locale as 'ar' | 'en' | undefined);

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(posts));

  return successResponse(res, { posts });
});

/**
 * Get related posts (Public)
 * جلب المقالات ذات الصلة (عام)
 */
export const getRelatedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { limit = 4, locale } = req.query;

  // First get the post to find its category
  const post = await BlogPost.findOne({ slug, status: 'published' });
  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  const posts = await BlogPost.getRelatedPosts(
    post._id.toString(),
    post.category.toString(),
    Number(limit),
    locale as 'ar' | 'en' | undefined
  );

  return successResponse(res, { posts });
});

/**
 * Get all tags (Public)
 * جلب جميع الوسوم (عام)
 */
export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${POST_CACHE_PREFIX}:tags:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { tags: JSON.parse(cached) });
  }

  const tags = await BlogPost.getAllTags(locale);

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(tags));

  return successResponse(res, { tags });
});

/**
 * Get all posts (Admin)
 * جلب جميع المقالات (للمسؤول)
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    status,
    featured,
    author,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 10,
    maxLimit: 100,
  });

  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (author) {
    filter.author = author;
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'title.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'title.en': { $regex: escapedSearch, $options: 'i' } },
      { 'excerpt.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'excerpt.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const total = await BlogPost.countDocuments(filter);

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
  };

  const posts = await BlogPost.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  return paginatedResponse(res, {
    data: posts,
    page,
    limit,
    total,
  });
});

/**
 * Get post by ID (Admin)
 * جلب المقال بالمعرف (للمسؤول)
 */
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await BlogPost.findById(id)
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  return successResponse(res, { post });
});

/**
 * Create post (Admin)
 * إنشاء مقال (للمسؤول)
 */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = blogValidation.createPost.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists
  const category = await BlogCategory.findById(value.category);
  if (!category) {
    throw Errors.NOT_FOUND('Category | الفئة');
  }

  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug: value.slug });
  if (existingPost) {
    throw Errors.SLUG_EXISTS();
  }

  const post = await BlogPost.create({
    ...value,
    author: req.user?._id,
  });

  // Invalidate cache
  await invalidatePostCache();

  return successResponse(
    res,
    {
      message: 'Post created successfully | تم إنشاء المقال بنجاح',
      post,
    },
    201
  );
});

/**
 * Update post (Admin)
 * تحديث مقال (للمسؤول)
 */
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = blogValidation.updatePost.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if category exists (if updating category)
  if (value.category) {
    const category = await BlogCategory.findById(value.category);
    if (!category) {
      throw Errors.NOT_FOUND('Category | الفئة');
    }
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingPost = await BlogPost.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingPost) {
      throw Errors.SLUG_EXISTS();
    }
  }

  // Handle publishedAt for status changes
  const updateData: Record<string, unknown> = { ...value };
  if (value.status === 'published') {
    const existingPost = await BlogPost.findById(id);
    if (existingPost && existingPost.status !== 'published') {
      updateData.publishedAt = new Date();
    }
  }

  const post = await BlogPost.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  // Invalidate cache
  await invalidatePostCache();

  return successResponse(res, {
    message: 'Post updated successfully | تم تحديث المقال بنجاح',
    post,
  });
});

/**
 * Delete post (Admin)
 * حذف مقال (للمسؤول)
 */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await BlogPost.findByIdAndDelete(id);

  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  // Invalidate cache
  await invalidatePostCache();

  return successResponse(res, {
    message: 'Post deleted successfully | تم حذف المقال بنجاح',
  });
});

/**
 * Bulk update posts status (Admin)
 * تحديث حالة المقالات بالجملة (للمسؤول)
 */
export const bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw Errors.VALIDATION_ERROR([
      { field: 'ids', message: 'IDs array is required | مصفوفة المعرفات مطلوبة' },
    ]);
  }

  if (!['draft', 'published', 'archived'].includes(status)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'status', message: 'Invalid status | الحالة غير صالحة' },
    ]);
  }

  const updateData: Record<string, unknown> = { status };
  if (status === 'published') {
    updateData.publishedAt = new Date();
  }

  const result = await BlogPost.updateMany(
    { _id: { $in: ids.map((id: string) => new mongoose.Types.ObjectId(id)) } },
    { $set: updateData }
  );

  // Invalidate cache
  await invalidatePostCache();

  return successResponse(res, {
    message: `${result.modifiedCount} posts updated successfully | تم تحديث ${result.modifiedCount} مقالات بنجاح`,
    modifiedCount: result.modifiedCount,
  });
});

// ============================================
// User Saved Posts Controllers
// متحكمات المقالات المحفوظة للمستخدم
// ============================================

/**
 * Save a post
 * حفظ مقال
 * POST /api/v1/blog/posts/:slug/save
 */
export const savePost = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user?._id;

  // Find the post by slug
  const post = await BlogPost.findOne({ slug, status: 'published' });
  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  // Add post to user's savedPosts if not already saved
  const user = await User.findById(userId);

  if (!user) {
    throw Errors.NOT_FOUND('User | المستخدم');
  }

  const postId = post._id.toString();
  const savedPostIds = (user.savedPosts || []).map((id: mongoose.Types.ObjectId) => id.toString());

  if (savedPostIds.includes(postId)) {
    return successResponse(res, {
      message: 'Post already saved | المقال محفوظ مسبقاً',
      saved: true,
    });
  }

  await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: post._id } });

  return successResponse(
    res,
    {
      message: 'Post saved successfully | تم حفظ المقال بنجاح',
      saved: true,
    },
    201
  );
});

/**
 * Unsave a post
 * إلغاء حفظ مقال
 * DELETE /api/v1/blog/posts/:slug/save
 */
export const unsavePost = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user?._id;

  // Find the post by slug
  const post = await BlogPost.findOne({ slug });
  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  // Remove post from user's savedPosts
  await User.findByIdAndUpdate(userId, { $pull: { savedPosts: post._id } });

  return successResponse(res, {
    message: 'Post unsaved successfully | تم إلغاء حفظ المقال بنجاح',
    saved: false,
  });
});

/**
 * Get user's saved posts
 * جلب المقالات المحفوظة للمستخدم
 * GET /api/v1/blog/saved
 */
export const getSavedPosts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10, locale } = req.query;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Get user with saved posts
  const user = await User.findById(userId).select('savedPosts');

  if (!user || !user.savedPosts || user.savedPosts.length === 0) {
    return paginatedResponse(res, {
      data: [],
      page: pageNum,
      limit: limitNum,
      total: 0,
    });
  }

  // Get posts with pagination
  const filter: Record<string, unknown> = {
    _id: { $in: user.savedPosts },
    status: 'published',
  };

  const total = await BlogPost.countDocuments(filter);

  let postsQuery = BlogPost.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('category', 'name slug')
    .populate('author', 'name avatar');

  // Apply locale selection if provided
  if (locale === 'ar' || locale === 'en') {
    postsQuery = postsQuery.select({
      [`title.${locale}`]: 1,
      [`excerpt.${locale}`]: 1,
      [`content.${locale}`]: 1,
      slug: 1,
      featuredImage: 1,
      tags: 1,
      readTime: 1,
      status: 1,
      viewCount: 1,
      publishedAt: 1,
      createdAt: 1,
      category: 1,
      author: 1,
    });
  }

  const posts = await postsQuery;

  return paginatedResponse(res, {
    data: posts,
    page: pageNum,
    limit: limitNum,
    total,
  });
});

/**
 * Check if post is saved
 * التحقق مما إذا كان المقال محفوظاً
 * GET /api/v1/blog/posts/:slug/saved
 */
export const isPostSaved = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user?._id;

  // Find the post by slug
  const post = await BlogPost.findOne({ slug });
  if (!post) {
    throw Errors.NOT_FOUND('Post | المقال');
  }

  // Check if post is in user's savedPosts
  const user = await User.findById(userId).select('savedPosts');

  if (!user) {
    throw Errors.NOT_FOUND('User | المستخدم');
  }

  const postId = post._id.toString();
  const savedPostIds = (user.savedPosts || []).map((id: mongoose.Types.ObjectId) => id.toString());
  const isSaved = savedPostIds.includes(postId);

  return successResponse(res, { saved: isSaved });
});

// ============================================
// Helper Functions
// ============================================

/**
 * Invalidate post cache
 * إبطال ذاكرة التخزين المؤقت للمقالات
 */
async function invalidatePostCache() {
  const keys = await redis.keys(`${POST_CACHE_PREFIX}:*`);
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

export const blogController = {
  // Categories
  getCategories,
  getCategoryBySlug,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Posts
  getPosts,
  getPostBySlug,
  getFeaturedPosts,
  getRelatedPosts,
  getTags,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  bulkUpdateStatus,
  // Saved Posts
  savePost,
  unsavePost,
  getSavedPosts,
  isPostSaved,
};

export default blogController;
