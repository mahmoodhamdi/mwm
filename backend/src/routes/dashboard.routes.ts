/**
 * Dashboard Routes
 * مسارات لوحة التحكم
 */

import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin', 'super_admin', 'editor'));

// Get dashboard statistics
router.get('/stats', dashboardController.getStats);

// Get recent activity
router.get('/activity', dashboardController.getRecentActivity);

// Get charts data
router.get('/charts', dashboardController.getChartsData);

// Get quick stats for header
router.get('/quick-stats', dashboardController.getQuickStats);

export default router;
