/**
 * Dashboard Routes
 * مسارات لوحة التحكم
 */

import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Admin dashboard statistics and data
 */

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin', 'super_admin', 'editor'));

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns overview statistics for the admin dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Get recent activity
 *     description: Returns recent activity logs for the dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity list
 *       401:
 *         description: Unauthorized
 */
router.get('/activity', dashboardController.getRecentActivity);

/**
 * @swagger
 * /dashboard/charts:
 *   get:
 *     summary: Get charts data
 *     description: Returns data for dashboard charts and graphs
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Charts data
 *       401:
 *         description: Unauthorized
 */
router.get('/charts', dashboardController.getChartsData);

/**
 * @swagger
 * /dashboard/quick-stats:
 *   get:
 *     summary: Get quick stats for header
 *     description: Returns quick statistics for the header display
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quick stats
 *       401:
 *         description: Unauthorized
 */
router.get('/quick-stats', dashboardController.getQuickStats);

export default router;
