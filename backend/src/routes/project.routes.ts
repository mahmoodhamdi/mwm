/**
 * Project Routes
 * مسارات المشاريع
 */

import { Router } from 'express';
import { projectController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';
import { projectValidation } from '../validations';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Public project portfolio endpoints
 *   - name: Projects Admin
 *     description: Project and category management (Admin only)
 */

// ============================================
// Admin Routes - Categories (MUST come before /:slug)
// مسارات المسؤول - الفئات
// ============================================

/**
 * @swagger
 * /projects/admin/categories:
 *   get:
 *     summary: Get all project categories (Admin)
 *     description: Retrieve all project categories with pagination and filtering options
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all project categories
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/categories',
  authenticate,
  authorize('projects:read'),
  projectController.getAllCategories
);

/**
 * @swagger
 * /projects/admin/categories:
 *   post:
 *     summary: Create project category
 *     description: Create a new project category
 *     tags: [Projects Admin]
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
 *                     example: تطوير المواقع
 *                   en:
 *                     type: string
 *                     example: Web Development
 *               slug:
 *                 type: string
 *                 example: web-development
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               icon:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin/categories',
  authenticate,
  authorize('projects:create'),
  validate({ body: projectValidation.createCategory }),
  projectController.createCategory
);

/**
 * @swagger
 * /projects/admin/categories/{id}:
 *   put:
 *     summary: Update project category
 *     description: Update an existing project category
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               icon:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('projects:update'),
  validate({ params: idParamsSchema, body: projectValidation.updateCategory }),
  projectController.updateCategory
);

/**
 * @swagger
 * /projects/admin/categories/{id}:
 *   delete:
 *     summary: Delete project category
 *     description: Delete a project category
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorize('projects:delete'),
  validate({ params: idParamsSchema }),
  projectController.deleteCategory
);

// ============================================
// Admin Routes - Projects (MUST come before /:slug)
// مسارات المسؤول - المشاريع
// ============================================

/**
 * @swagger
 * /projects/admin:
 *   get:
 *     summary: Get all projects (Admin)
 *     description: Retrieve all projects with pagination and filtering options for admin dashboard
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all projects
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', authenticate, authorize('projects:read'), projectController.getAllProjects);

/**
 * @swagger
 * /projects/admin/reorder:
 *   put:
 *     summary: Reorder projects
 *     description: Update the display order of projects
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projects
 *             properties:
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Projects reordered successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/reorder',
  authenticate,
  authorize('projects:update'),
  projectController.reorderProjects
);

/**
 * @swagger
 * /projects/admin/{id}:
 *   get:
 *     summary: Get project by ID (Admin)
 *     description: Retrieve a specific project by its ID with full details
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/:id',
  authenticate,
  authorize('projects:read'),
  validate({ params: idParamsSchema }),
  projectController.getProjectById
);

/**
 * @swagger
 * /projects/admin:
 *   post:
 *     summary: Create project
 *     description: Create a new project
 *     tags: [Projects Admin]
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
 *               - category
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                     example: موقع شركة تجارية
 *                   en:
 *                     type: string
 *                     example: Corporate Website
 *               slug:
 *                 type: string
 *                 example: corporate-website
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *               client:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnailImage:
 *                 type: string
 *               projectUrl:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               featured:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin',
  authenticate,
  authorize('projects:create'),
  validate({ body: projectValidation.create }),
  projectController.createProject
);

/**
 * @swagger
 * /projects/admin/{id}/publish:
 *   put:
 *     summary: Toggle publish status
 *     description: Toggle the publish status of a project between draft and published
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project publish status toggled
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id/publish',
  authenticate,
  authorize('projects:update'),
  validate({ params: idParamsSchema }),
  projectController.togglePublishStatus
);

/**
 * @swagger
 * /projects/admin/{id}/featured:
 *   put:
 *     summary: Toggle featured status
 *     description: Toggle the featured status of a project
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project featured status toggled
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id/featured',
  authenticate,
  authorize('projects:update'),
  validate({ params: idParamsSchema }),
  projectController.toggleFeaturedStatus
);

/**
 * @swagger
 * /projects/admin/{id}:
 *   put:
 *     summary: Update project
 *     description: Update an existing project
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               category:
 *                 type: string
 *               client:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnailImage:
 *                 type: string
 *               projectUrl:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               featured:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id',
  authenticate,
  authorize('projects:update'),
  validate({ params: idParamsSchema, body: projectValidation.update }),
  projectController.updateProject
);

/**
 * @swagger
 * /projects/admin/{id}:
 *   delete:
 *     summary: Delete project
 *     description: Delete a project
 *     tags: [Projects Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/admin/:id',
  authenticate,
  authorize('projects:delete'),
  validate({ params: idParamsSchema }),
  projectController.deleteProject
);

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

/**
 * @swagger
 * /projects/categories:
 *   get:
 *     summary: Get all active project categories
 *     description: Retrieve all active project categories for public display
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of active project categories
 */
router.get('/categories', projectController.getCategories);

/**
 * @swagger
 * /projects/categories/{slug}:
 *   get:
 *     summary: Get project category by slug
 *     description: Retrieve a specific project category by its slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: web-development
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/categories/:slug', projectController.getCategoryBySlug);

// ============================================
// Public Routes - Projects
// المسارات العامة - المشاريع
// ============================================

/**
 * @swagger
 * /projects/featured:
 *   get:
 *     summary: Get featured projects
 *     description: Retrieve all featured projects for showcase
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of featured projects to return
 *     responses:
 *       200:
 *         description: List of featured projects
 */
router.get('/featured', projectController.getFeaturedProjects);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all published projects
 *     description: Retrieve all published projects with pagination and filtering options
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title, order]
 *           default: order
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: List of published projects with pagination
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     description: Retrieve a specific published project by its slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: corporate-website
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:slug', projectController.getProjectBySlug);

export default router;
