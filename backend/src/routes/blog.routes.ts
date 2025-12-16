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

/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: Public blog endpoints (categories, posts, comments)
 *   - name: Blog User
 *     description: User saved posts management
 *   - name: Blog Admin
 *     description: Blog management (Admin only)
 */

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

/**
 * @swagger
 * /blog/categories:
 *   get:
 *     summary: Get all active categories
 *     description: Retrieves all published blog categories
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of active categories
 *       500:
 *         description: Server error
 */
router.get('/categories', blogController.getCategories);

/**
 * @swagger
 * /blog/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Retrieves a specific blog category by its slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/categories/:slug', blogController.getCategoryBySlug);

// ============================================
// Public Routes - Posts
// المسارات العامة - المقالات
// ============================================

/**
 * @swagger
 * /blog/tags:
 *   get:
 *     summary: Get all tags
 *     description: Retrieves all unique tags from published posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of tags
 *       500:
 *         description: Server error
 */
router.get('/tags', blogController.getTags);

/**
 * @swagger
 * /blog/featured:
 *   get:
 *     summary: Get featured posts
 *     description: Retrieves all featured blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of featured posts to return
 *     responses:
 *       200:
 *         description: List of featured posts
 *       500:
 *         description: Server error
 */
router.get('/featured', blogController.getFeaturedPosts);

/**
 * @swagger
 * /blog/posts/{slug}/related:
 *   get:
 *     summary: Get related posts
 *     description: Retrieves posts related to a specific post based on category and tags
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of related posts to return
 *     responses:
 *       200:
 *         description: List of related posts
 *       404:
 *         description: Post not found
 */
router.get('/posts/:slug/related', blogController.getRelatedPosts);

/**
 * @swagger
 * /blog/posts/{slug}:
 *   get:
 *     summary: Get post by slug
 *     description: Retrieves a specific published blog post by its slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
router.get('/posts/:slug', blogController.getPostBySlug);

/**
 * @swagger
 * /blog/posts:
 *   get:
 *     summary: Get all published posts
 *     description: Retrieves paginated list of published blog posts with filtering options
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [publishedAt, views, title]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of posts
 *       500:
 *         description: Server error
 */
router.get('/posts', blogController.getPosts);

// ============================================
// User Saved Posts Routes
// مسارات المقالات المحفوظة للمستخدم
// ============================================

/**
 * @swagger
 * /blog/saved:
 *   get:
 *     summary: Get user's saved posts
 *     description: Retrieves all posts saved by the authenticated user
 *     tags: [Blog User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of saved posts
 *       401:
 *         description: Unauthorized
 */
router.get('/saved', authenticate, blogController.getSavedPosts);

/**
 * @swagger
 * /blog/posts/{slug}/saved:
 *   get:
 *     summary: Check if post is saved
 *     description: Checks if a specific post is saved by the authenticated user
 *     tags: [Blog User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *     responses:
 *       200:
 *         description: Save status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.get('/posts/:slug/saved', authenticate, blogController.isPostSaved);

/**
 * @swagger
 * /blog/posts/{slug}/save:
 *   post:
 *     summary: Save a post
 *     description: Saves a blog post for the authenticated user
 *     tags: [Blog User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *     responses:
 *       200:
 *         description: Post saved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post('/posts/:slug/save', authenticate, csrfValidation, blogController.savePost);

/**
 * @swagger
 * /blog/posts/{slug}/save:
 *   delete:
 *     summary: Unsave a post
 *     description: Removes a blog post from the authenticated user's saved posts
 *     tags: [Blog User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.delete('/posts/:slug/save', authenticate, csrfValidation, blogController.unsavePost);

// ============================================
// Public Routes - Comments
// المسارات العامة - التعليقات
// ============================================

/**
 * @swagger
 * /blog/posts/{slug}/comments:
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieves all approved comments for a specific blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, likes]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of comments
 *       404:
 *         description: Post not found
 */
router.get('/posts/:slug/comments', blogController.getPostComments);

/**
 * @swagger
 * /blog/posts/comments:
 *   post:
 *     summary: Create comment (authenticated)
 *     description: Creates a new comment on a blog post by an authenticated user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the blog post
 *               content:
 *                 type: string
 *                 description: Comment content
 *               parentId:
 *                 type: string
 *                 description: ID of parent comment (for replies)
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post('/posts/comments', authenticate, csrfValidation, blogController.createComment);

/**
 * @swagger
 * /blog/posts/comments/guest:
 *   post:
 *     summary: Create guest comment
 *     description: Creates a new comment on a blog post by a guest user
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *               - guestName
 *               - guestEmail
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the blog post
 *               content:
 *                 type: string
 *                 description: Comment content
 *               guestName:
 *                 type: string
 *                 description: Guest's name
 *               guestEmail:
 *                 type: string
 *                 format: email
 *                 description: Guest's email
 *               parentId:
 *                 type: string
 *                 description: ID of parent comment (for replies)
 *     responses:
 *       201:
 *         description: Comment created successfully (pending approval)
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */
router.post('/posts/comments/guest', blogController.createGuestComment);

/**
 * @swagger
 * /blog/comments/{id}:
 *   put:
 *     summary: Update own comment
 *     description: Updates a comment created by the authenticated user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot update comment created by another user
 *       404:
 *         description: Comment not found
 */
router.put(
  '/comments/:id',
  authenticate,
  csrfValidation,
  validate({ params: idParamsSchema }),
  blogController.updateComment
);

/**
 * @swagger
 * /blog/comments/{id}:
 *   delete:
 *     summary: Delete own comment
 *     description: Deletes a comment created by the authenticated user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot delete comment created by another user
 *       404:
 *         description: Comment not found
 */
router.delete(
  '/comments/:id',
  authenticate,
  csrfValidation,
  validate({ params: idParamsSchema }),
  blogController.deleteComment
);

/**
 * @swagger
 * /blog/comments/{id}/like:
 *   post:
 *     summary: Like/unlike a comment
 *     description: Toggles like status on a comment for the authenticated user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.post(
  '/comments/:id/like',
  authenticate,
  csrfValidation,
  validate({ params: idParamsSchema }),
  blogController.toggleCommentLike
);

// ============================================
// Admin Routes - Categories
// مسارات المسؤول - الفئات
// ============================================

/**
 * @swagger
 * /blog/admin/categories:
 *   get:
 *     summary: Get all categories (Admin)
 *     description: Retrieves all blog categories including inactive ones (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in category name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Paginated list of categories
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get(
  '/admin/categories',
  authenticate,
  authorize('blog:read'),
  blogController.getAllCategories
);

/**
 * @swagger
 * /blog/admin/categories:
 *   post:
 *     summary: Create category
 *     description: Creates a new blog category (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *                 description: Localized category name
 *               slug:
 *                 type: string
 *                 description: URL-friendly slug
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *                 description: Localized description
 *               isActive:
 *                 type: boolean
 *                 description: Category status
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post(
  '/admin/categories',
  authenticate,
  authorize('blog:create'),
  validate({ body: blogValidation.createCategory }),
  blogController.createCategory
);

/**
 * @swagger
 * /blog/admin/categories/{id}:
 *   put:
 *     summary: Update category
 *     description: Updates an existing blog category (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Category not found
 */
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('blog:update'),
  validate({ params: idParamsSchema, body: blogValidation.updateCategory }),
  blogController.updateCategory
);

/**
 * @swagger
 * /blog/admin/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Deletes a blog category (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Category not found
 */
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

/**
 * @swagger
 * /blog/admin/posts:
 *   get:
 *     summary: Get all posts (Admin)
 *     description: Retrieves all blog posts including drafts and archived (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of posts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get('/admin/posts', authenticate, authorize('blog:read'), blogController.getAllPosts);

/**
 * @swagger
 * /blog/admin/posts/{id}:
 *   get:
 *     summary: Get post by ID (Admin)
 *     description: Retrieves a specific blog post by ID including drafts (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Post not found
 */
router.get(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:read'),
  validate({ params: idParamsSchema }),
  blogController.getPostById
);

/**
 * @swagger
 * /blog/admin/posts:
 *   post:
 *     summary: Create post
 *     description: Creates a new blog post (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *                 description: Localized post title
 *               slug:
 *                 type: string
 *                 description: URL-friendly slug
 *               content:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *                 description: Localized post content (HTML)
 *               excerpt:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *                 description: Localized excerpt
 *               category:
 *                 type: string
 *                 description: Category ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags
 *               featuredImage:
 *                 type: string
 *                 description: Featured image URL
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 description: Post status
 *               isFeatured:
 *                 type: boolean
 *                 description: Featured post flag
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date
 *               seo:
 *                 type: object
 *                 properties:
 *                   metaTitle:
 *                     type: object
 *                     properties:
 *                       ar:
 *                         type: string
 *                       en:
 *                         type: string
 *                   metaDescription:
 *                     type: object
 *                     properties:
 *                       ar:
 *                         type: string
 *                       en:
 *                         type: string
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post(
  '/admin/posts',
  authenticate,
  authorize('blog:create'),
  validate({ body: blogValidation.createPost }),
  blogController.createPost
);

/**
 * @swagger
 * /blog/admin/posts/bulk-status:
 *   put:
 *     summary: Bulk update posts status
 *     description: Updates status for multiple blog posts (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of post IDs
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 description: New status
 *     responses:
 *       200:
 *         description: Posts updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.put(
  '/admin/posts/bulk-status',
  authenticate,
  authorize('blog:update'),
  blogController.bulkUpdateStatus
);

/**
 * @swagger
 * /blog/admin/posts/{id}:
 *   put:
 *     summary: Update post
 *     description: Updates an existing blog post (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               excerpt:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featuredImage:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               isFeatured:
 *                 type: boolean
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               seo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Post not found
 */
router.put(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:update'),
  validate({ params: idParamsSchema, body: blogValidation.updatePost }),
  blogController.updatePost
);

/**
 * @swagger
 * /blog/admin/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     description: Deletes a blog post (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Post not found
 */
router.delete(
  '/admin/posts/:id',
  authenticate,
  authorize('blog:delete'),
  validate({ params: idParamsSchema }),
  blogController.deletePost
);

// ============================================
// Admin Routes - Comments
// مسارات المسؤول - التعليقات
// ============================================

/**
 * @swagger
 * /blog/admin/comments:
 *   get:
 *     summary: Get all comments (Admin)
 *     description: Retrieves all blog comments including pending and spam (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, spam]
 *         description: Filter by status
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter by post ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in comment content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of comments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get('/admin/comments', authenticate, authorize('blog:read'), blogController.getAllComments);

/**
 * @swagger
 * /blog/admin/comments/bulk-status:
 *   put:
 *     summary: Bulk update comments status
 *     description: Updates status for multiple blog comments (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of comment IDs
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, spam]
 *                 description: New status
 *     responses:
 *       200:
 *         description: Comments updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.put(
  '/admin/comments/bulk-status',
  authenticate,
  authorize('blog:update'),
  blogController.bulkUpdateCommentStatus
);

/**
 * @swagger
 * /blog/admin/comments/{id}:
 *   put:
 *     summary: Update comment status (Admin)
 *     description: Updates the status of a specific blog comment (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, spam]
 *                 description: New comment status
 *     responses:
 *       200:
 *         description: Comment status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Comment not found
 */
router.put(
  '/admin/comments/:id',
  authenticate,
  authorize('blog:update'),
  validate({ params: idParamsSchema }),
  blogController.updateCommentStatus
);

/**
 * @swagger
 * /blog/admin/comments/{id}:
 *   delete:
 *     summary: Delete comment (Admin)
 *     description: Deletes a blog comment (Admin only)
 *     tags: [Blog Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Comment not found
 */
router.delete(
  '/admin/comments/:id',
  authenticate,
  authorize('blog:delete'),
  validate({ params: idParamsSchema }),
  blogController.adminDeleteComment
);

export default router;
