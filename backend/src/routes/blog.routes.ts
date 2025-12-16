/**
 * Blog Routes
 * مسارات المدونة
 */

import { Router } from 'express';
import { blogController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema, csrfValidation } from '../middlewares';
import { blogValidation } from '../validations';

const router = Router();

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

// GET /api/v1/blog/categories - Get all active categories
router.get('/categories', blogController.getCategories);

// GET /api/v1/blog/categories/:slug - Get category by slug
router.get('/categories/:slug', blogController.getCategoryBySlug);

// ============================================
// Public Routes - Posts
// المسارات العامة - المقالات
// ============================================

// GET /api/v1/blog/tags - Get all tags
router.get('/tags', blogController.getTags);

// GET /api/v1/blog/featured - Get featured posts
router.get('/featured', blogController.getFeaturedPosts);

// GET /api/v1/blog/posts/:slug/related - Get related posts
router.get('/posts/:slug/related', blogController.getRelatedPosts);

// GET /api/v1/blog/posts/:slug - Get post by slug
router.get('/posts/:slug', blogController.getPostBySlug);

// GET /api/v1/blog/posts - Get all published posts
router.get('/posts', blogController.getPosts);

// ============================================
// User Saved Posts Routes
// مسارات المقالات المحفوظة للمستخدم
// ============================================

// GET /api/v1/blog/saved - Get user's saved posts
router.get('/saved', authenticate, blogController.getSavedPosts);

// GET /api/v1/blog/posts/:slug/saved - Check if post is saved
router.get('/posts/:slug/saved', authenticate, blogController.isPostSaved);

// POST /api/v1/blog/posts/:slug/save - Save a post
router.post('/posts/:slug/save', authenticate, csrfValidation, blogController.savePost);

// DELETE /api/v1/blog/posts/:slug/save - Unsave a post
router.delete('/posts/:slug/save', authenticate, csrfValidation, blogController.unsavePost);

// ============================================
// Admin Routes - Categories
// مسارات المسؤول - الفئات
// ============================================

// GET /api/v1/blog/admin/categories - Get all categories (Admin)
router.get(
  '/admin/categories',
  authenticate,
  authorize('blog:read'),
  blogController.getAllCategories
);

// POST /api/v1/blog/admin/categories - Create category
router.post(
  '/admin/categories',
  authenticate,
  authorize('blog:create'),
  validate({ body: blogValidation.createCategory }),
  blogController.createCategory
);

// PUT /api/v1/blog/admin/categories/:id - Update category
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('blog:update'),
  validate({ params: idParamsSchema, body: blogValidation.updateCategory }),
  blogController.updateCategory
);

// DELETE /api/v1/blog/admin/categories/:id - Delete category
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorize('blog:delete'),
  validate({ params: idParamsSchema }),
  blogController.deleteCategory
);

// ============================================
// Admin Routes - Posts
// مسارات المسؤول - المقالات
// ============================================

// GET /api/v1/blog/admin/posts - Get all posts (Admin)
router.get('/admin/posts', authenticate, authorize('blog:read'), blogController.getAllPosts);

// GET /api/v1/blog/admin/posts/:id - Get post by ID (Admin)
router.get(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:read'),
  validate({ params: idParamsSchema }),
  blogController.getPostById
);

// POST /api/v1/blog/admin/posts - Create post
router.post(
  '/admin/posts',
  authenticate,
  authorize('blog:create'),
  validate({ body: blogValidation.createPost }),
  blogController.createPost
);

// PUT /api/v1/blog/admin/posts/bulk-status - Bulk update posts status
router.put(
  '/admin/posts/bulk-status',
  authenticate,
  authorize('blog:update'),
  blogController.bulkUpdateStatus
);

// PUT /api/v1/blog/admin/posts/:id - Update post
router.put(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:update'),
  validate({ params: idParamsSchema, body: blogValidation.updatePost }),
  blogController.updatePost
);

// DELETE /api/v1/blog/admin/posts/:id - Delete post
router.delete(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:delete'),
  validate({ params: idParamsSchema }),
  blogController.deletePost
);

export default router;
