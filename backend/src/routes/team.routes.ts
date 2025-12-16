/**
 * Team Routes
 * مسارات الفريق
 */

import { Router } from 'express';
import { teamController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';
import { teamValidation } from '../validations';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Team
 *     description: Public team members and departments endpoints
 *   - name: Team Admin
 *     description: Team and department management (Admin only)
 */

// ============================================
// Admin Routes - Departments (MUST come before /:slug)
// مسارات المسؤول - الأقسام
// ============================================

/**
 * @swagger
 * /team/admin/departments:
 *   get:
 *     summary: Get all departments (Admin)
 *     description: Retrieve all departments with their details for admin management
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all departments
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/departments',
  authenticate,
  authorize('team:read'),
  teamController.getAllDepartments
);

/**
 * @swagger
 * /team/admin/departments:
 *   post:
 *     summary: Create new department
 *     description: Create a new department with bilingual name and description
 *     tags: [Team Admin]
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
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                     example: قسم التطوير
 *                   en:
 *                     type: string
 *                     example: Development Department
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *                 example: development
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin/departments',
  authenticate,
  authorize('team:create'),
  validate({ body: teamValidation.createDepartment }),
  teamController.createDepartment
);

/**
 * @swagger
 * /team/admin/departments/{id}:
 *   put:
 *     summary: Update department
 *     description: Update existing department information
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
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
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/departments/:id',
  authenticate,
  authorize('team:update'),
  validate({ params: idParamsSchema, body: teamValidation.updateDepartment }),
  teamController.updateDepartment
);

/**
 * @swagger
 * /team/admin/departments/{id}:
 *   delete:
 *     summary: Delete department
 *     description: Delete a department by ID
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/admin/departments/:id',
  authenticate,
  authorize('team:delete'),
  validate({ params: idParamsSchema }),
  teamController.deleteDepartment
);

// ============================================
// Admin Routes - Team Members (MUST come before /:slug)
// مسارات المسؤول - أعضاء الفريق
// ============================================

/**
 * @swagger
 * /team/admin:
 *   get:
 *     summary: Get all team members (Admin)
 *     description: Retrieve all team members with filtering and pagination options
 *     tags: [Team Admin]
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
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or title
 *     responses:
 *       200:
 *         description: List of team members
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', authenticate, authorize('team:read'), teamController.getAllMembers);

/**
 * @swagger
 * /team/admin/reorder:
 *   put:
 *     summary: Reorder team members
 *     description: Update the display order of team members
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - members
 *             properties:
 *               members:
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
 *         description: Team members reordered successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/admin/reorder', authenticate, authorize('team:update'), teamController.reorderMembers);

/**
 * @swagger
 * /team/admin/{id}:
 *   get:
 *     summary: Get team member by ID (Admin)
 *     description: Retrieve detailed information about a specific team member
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member details
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/:id',
  authenticate,
  authorize('team:read'),
  validate({ params: idParamsSchema }),
  teamController.getMemberById
);

/**
 * @swagger
 * /team/admin:
 *   post:
 *     summary: Create team member
 *     description: Add a new team member with bilingual information
 *     tags: [Team Admin]
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
 *               - title
 *               - department
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                     example: أحمد محمد
 *                   en:
 *                     type: string
 *                     example: Ahmed Mohammed
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                     example: مطور برمجيات
 *                   en:
 *                     type: string
 *                     example: Software Developer
 *               department:
 *                 type: string
 *                 description: Department ID
 *               bio:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               photo:
 *                 type: string
 *                 description: Photo URL
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                   twitter:
 *                     type: string
 *                   github:
 *                     type: string
 *               isLeader:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Team member created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin',
  authenticate,
  authorize('team:create'),
  validate({ body: teamValidation.create }),
  teamController.createMember
);

/**
 * @swagger
 * /team/admin/{id}/active:
 *   put:
 *     summary: Toggle active status
 *     description: Toggle the active status of a team member
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Active status toggled successfully
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id/active',
  authenticate,
  authorize('team:update'),
  validate({ params: idParamsSchema }),
  teamController.toggleActiveStatus
);

/**
 * @swagger
 * /team/admin/{id}/featured:
 *   put:
 *     summary: Toggle featured status
 *     description: Toggle the featured status of a team member
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Featured status toggled successfully
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id/featured',
  authenticate,
  authorize('team:update'),
  validate({ params: idParamsSchema }),
  teamController.toggleFeaturedStatus
);

/**
 * @swagger
 * /team/admin/{id}/leader:
 *   put:
 *     summary: Toggle leader status
 *     description: Toggle the leader status of a team member
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Leader status toggled successfully
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id/leader',
  authenticate,
  authorize('team:update'),
  validate({ params: idParamsSchema }),
  teamController.toggleLeaderStatus
);

/**
 * @swagger
 * /team/admin/{id}:
 *   put:
 *     summary: Update team member
 *     description: Update existing team member information
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
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
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               department:
 *                 type: string
 *               bio:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               photo:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *               isLeader:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/:id',
  authenticate,
  authorize('team:update'),
  validate({ params: idParamsSchema, body: teamValidation.update }),
  teamController.updateMember
);

/**
 * @swagger
 * /team/admin/{id}:
 *   delete:
 *     summary: Delete team member
 *     description: Delete a team member by ID
 *     tags: [Team Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       404:
 *         description: Team member not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/admin/:id',
  authenticate,
  authorize('team:delete'),
  validate({ params: idParamsSchema }),
  teamController.deleteMember
);

// ============================================
// Public Routes - Departments
// المسارات العامة - الأقسام
// ============================================

/**
 * @swagger
 * /team/departments:
 *   get:
 *     summary: Get all active departments
 *     description: Retrieve all active departments for public display
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: List of active departments
 */
router.get('/departments', teamController.getDepartments);

/**
 * @swagger
 * /team/departments/{slug}:
 *   get:
 *     summary: Get department by slug
 *     description: Retrieve a specific department by its slug
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Department slug
 *         example: development
 *     responses:
 *       200:
 *         description: Department details
 *       404:
 *         description: Department not found
 */
router.get('/departments/:slug', teamController.getDepartmentBySlug);

// ============================================
// Public Routes - Team Members
// المسارات العامة - أعضاء الفريق
// ============================================

/**
 * @swagger
 * /team/featured:
 *   get:
 *     summary: Get featured team members
 *     description: Retrieve all featured team members for public display
 *     tags: [Team]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of featured members to return
 *     responses:
 *       200:
 *         description: List of featured team members
 */
router.get('/featured', teamController.getFeaturedMembers);

/**
 * @swagger
 * /team/leaders:
 *   get:
 *     summary: Get team leaders
 *     description: Retrieve all team members with leader status
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: List of team leaders
 */
router.get('/leaders', teamController.getLeaders);

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Get all active team members
 *     description: Retrieve all active team members with optional filtering
 *     tags: [Team]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of active team members
 */
router.get('/', teamController.getTeamMembers);

/**
 * @swagger
 * /team/{slug}:
 *   get:
 *     summary: Get team member by slug
 *     description: Retrieve a specific team member by their slug
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member slug
 *         example: ahmed-mohammed
 *     responses:
 *       200:
 *         description: Team member details
 *       404:
 *         description: Team member not found
 */
router.get('/:slug', teamController.getMemberBySlug);

export default router;
