/**
 * Activity Log Routes
 * مسارات سجل النشاط
 */

import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Activity
 *     description: Activity log management
 */

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /activity/me:
 *   get:
 *     summary: Get my activity
 *     description: Returns activity logs for the current user
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/me', activityController.getMyActivity);

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Get all activity logs
 *     tags: [Activity]
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
 *         name: action
 *         schema:
 *           type: string
 *           enum: [create, update, delete, login, logout]
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorize('admin', 'super_admin'), activityController.getLogs);

/**
 * @swagger
 * /activity/recent:
 *   get:
 *     summary: Get recent activity
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/recent', authorize('admin', 'super_admin'), activityController.getRecent);

/**
 * @swagger
 * /activity/stats:
 *   get:
 *     summary: Get activity statistics
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authorize('admin', 'super_admin'), activityController.getStatistics);

/**
 * @swagger
 * /activity/user/{userId}:
 *   get:
 *     summary: Get activity by user
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/user/:userId', authorize('admin', 'super_admin'), activityController.getLogsByUser);

/**
 * @swagger
 * /activity/resource/{resource}:
 *   get:
 *     summary: Get activity by resource
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resource activity logs
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/resource/:resource',
  authorize('admin', 'super_admin'),
  activityController.getLogsByResource
);

/**
 * @swagger
 * /activity/old:
 *   delete:
 *     summary: Delete old activity logs
 *     description: Super Admin only - deletes old activity logs
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Old logs deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin only
 */
router.delete('/old', authorize('super_admin'), activityController.deleteOldLogs);

export default router;
