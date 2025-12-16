/**
 * User Management Routes
 * مسارات إدارة المستخدمين
 */

import { Router } from 'express';
import { userController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management (Admin only)
 */

// All user management routes require authentication and admin permissions
router.use(authenticate);
router.use(authorize('users:read'));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, admin, editor, author, viewer]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, locked]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', userController.getUserStats);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', validate({ params: idParamsSchema }), userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, editor, author, viewer]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/', authorize('users:create'), userController.createUser);

/**
 * @swagger
 * /users/bulk:
 *   post:
 *     summary: Bulk update users
 *     tags: [Users]
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
 *               - action
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               action:
 *                 type: string
 *                 enum: [activate, deactivate, delete]
 *     responses:
 *       200:
 *         description: Bulk action completed
 *       401:
 *         description: Unauthorized
 */
router.post('/bulk', authorize('users:update'), userController.bulkUpdateUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.updateUser
);

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     summary: Toggle user active status
 *     tags: [Users]
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
 *         description: Status toggled
 *       404:
 *         description: User not found
 */
router.put(
  '/:id/status',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.toggleUserStatus
);

/**
 * @swagger
 * /users/{id}/unlock:
 *   put:
 *     summary: Unlock user account
 *     tags: [Users]
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
 *         description: User unlocked
 *       404:
 *         description: User not found
 */
router.put(
  '/:id/unlock',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.unlockUser
);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Reset user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 *       404:
 *         description: User not found
 */
router.put(
  '/:id/password',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.resetUserPassword
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authorize('users:delete'),
  validate({ params: idParamsSchema }),
  userController.deleteUser
);

export default router;
