/**
 * Service Routes
 * مسارات الخدمات
 */

import { Router } from 'express';
import { serviceController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';
import { serviceValidation } from '../validations';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Services
 *     description: Public services and categories
 *   - name: Services Admin
 *     description: Services and categories management (Admin only)
 */

// ============================================
// Admin Routes - Categories (MUST come before /:slug)
// مسارات المسؤول - الفئات
// ============================================

/**
 * @swagger
 * /services/admin/categories:
 *   get:
 *     summary: Get all service categories
 *     description: Retrieve all service categories including inactive ones (Admin only)
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all service categories
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/categories',
  authenticate,
  authorize('services:read'),
  serviceController.getAllCategories
);

/**
 * @swagger
 * /services/admin/categories:
 *   post:
 *     summary: Create service category
 *     description: Create a new service category
 *     tags: [Services Admin]
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
 *                     example: تطوير الويب
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
 *                 example: fa-code
 *               color:
 *                 type: string
 *                 example: "#3B82F6"
 *               image:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               order:
 *                 type: integer
 *                 default: 0
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
  authorize('services:create'),
  validate({ body: serviceValidation.createCategory }),
  serviceController.createCategory
);

/**
 * @swagger
 * /services/admin/categories/{id}:
 *   put:
 *     summary: Update service category
 *     description: Update an existing service category
 *     tags: [Services Admin]
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
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               image:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.put(
  '/admin/categories/:id',
  authenticate,
  authorize('services:update'),
  validate({ params: idParamsSchema, body: serviceValidation.updateCategory }),
  serviceController.updateCategory
);

/**
 * @swagger
 * /services/admin/categories/{id}:
 *   delete:
 *     summary: Delete service category
 *     description: Delete a service category
 *     tags: [Services Admin]
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
 *       404:
 *         description: Category not found
 */
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorize('services:delete'),
  validate({ params: idParamsSchema }),
  serviceController.deleteCategory
);

// ============================================
// Admin Routes - Services (MUST come before /:slug)
// مسارات المسؤول - الخدمات
// ============================================

/**
 * @swagger
 * /services/admin:
 *   get:
 *     summary: Get all services
 *     description: Retrieve all services including inactive ones (Admin only)
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
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
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in service name and description
 *     responses:
 *       200:
 *         description: List of all services
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', authenticate, authorize('services:read'), serviceController.getAllServices);

/**
 * @swagger
 * /services/admin/reorder:
 *   put:
 *     summary: Reorder services
 *     description: Update the display order of services
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - services
 *             properties:
 *               services:
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
 *         description: Services reordered successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/reorder',
  authenticate,
  authorize('services:update'),
  serviceController.reorderServices
);

/**
 * @swagger
 * /services/admin/{id}:
 *   get:
 *     summary: Get service by ID
 *     description: Retrieve a specific service by ID (Admin only)
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
router.get(
  '/admin/:id',
  authenticate,
  authorize('services:read'),
  validate({ params: idParamsSchema }),
  serviceController.getServiceById
);

/**
 * @swagger
 * /services/admin:
 *   post:
 *     summary: Create service
 *     description: Create a new service
 *     tags: [Services Admin]
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
 *                     example: تطوير تطبيقات الويب
 *                   en:
 *                     type: string
 *                     example: Web Application Development
 *               slug:
 *                 type: string
 *                 example: web-application-development
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               shortDescription:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *               icon:
 *                 type: string
 *               image:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: array
 *                     items:
 *                       type: string
 *                   en:
 *                     type: array
 *                     items:
 *                       type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 default: draft
 *               order:
 *                 type: integer
 *                 default: 0
 *               seo:
 *                 type: object
 *                 properties:
 *                   metaTitle:
 *                     type: object
 *                   metaDescription:
 *                     type: object
 *                   keywords:
 *                     type: object
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin',
  authenticate,
  authorize('services:create'),
  validate({ body: serviceValidation.create }),
  serviceController.createService
);

/**
 * @swagger
 * /services/admin/{id}:
 *   put:
 *     summary: Update service
 *     description: Update an existing service
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
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
 *               shortDescription:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *               image:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: array
 *                     items:
 *                       type: string
 *                   en:
 *                     type: array
 *                     items:
 *                       type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isFeatured:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               order:
 *                 type: integer
 *               seo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
router.put(
  '/admin/:id',
  authenticate,
  authorize('services:update'),
  validate({ params: idParamsSchema, body: serviceValidation.update }),
  serviceController.updateService
);

/**
 * @swagger
 * /services/admin/{id}:
 *   delete:
 *     summary: Delete service
 *     description: Delete a service
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
router.delete(
  '/admin/:id',
  authenticate,
  authorize('services:delete'),
  validate({ params: idParamsSchema }),
  serviceController.deleteService
);

// ============================================
// Public Routes - Categories
// المسارات العامة - الفئات
// ============================================

/**
 * @swagger
 * /services/categories:
 *   get:
 *     summary: Get active service categories
 *     description: Retrieve all active service categories for public display
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of active service categories
 */
router.get('/categories', serviceController.getCategories);

/**
 * @swagger
 * /services/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Retrieve a specific service category by its slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *         example: web-development
 *     responses:
 *       200:
 *         description: Category details with services
 *       404:
 *         description: Category not found
 */
router.get('/categories/:slug', serviceController.getCategoryBySlug);

// ============================================
// Public Routes - Services
// المسارات العامة - الخدمات
// ============================================

/**
 * @swagger
 * /services/featured:
 *   get:
 *     summary: Get featured services
 *     description: Retrieve all featured services for homepage display
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Maximum number of featured services to return
 *     responses:
 *       200:
 *         description: List of featured services
 */
router.get('/featured', serviceController.getFeaturedServices);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all active services
 *     description: Retrieve all published services with pagination and filtering
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of services per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in service name and description
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured services
 *     responses:
 *       200:
 *         description: List of active services with pagination
 */
router.get('/', serviceController.getServices);

/**
 * @swagger
 * /services/{slug}:
 *   get:
 *     summary: Get service by slug
 *     description: Retrieve a specific service by its slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Service slug
 *         example: web-application-development
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get('/:slug', serviceController.getServiceBySlug);

export default router;
