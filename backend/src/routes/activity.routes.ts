/**
 * Activity Log Routes
 * مسارات سجل النشاط
 */

import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/me', activityController.getMyActivity);

// Admin routes
router.get('/', authorize('admin', 'super_admin'), activityController.getLogs);
router.get('/recent', authorize('admin', 'super_admin'), activityController.getRecent);
router.get('/stats', authorize('admin', 'super_admin'), activityController.getStatistics);
router.get('/user/:userId', authorize('admin', 'super_admin'), activityController.getLogsByUser);
router.get(
  '/resource/:resource',
  authorize('admin', 'super_admin'),
  activityController.getLogsByResource
);

// Super admin only
router.delete('/old', authorize('super_admin'), activityController.deleteOldLogs);

export default router;
