/**
 * Notification Routes
 * مسارات الإشعارات
 */

import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// ============ USER ROUTES ============

// Get notifications
router.get('/', authenticate, notificationController.getNotifications);

// Get unread count
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', authenticate, notificationController.markAsRead);

// Mark all as read
router.put('/read-all', authenticate, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Delete all read notifications
router.delete('/read', authenticate, notificationController.deleteReadNotifications);

// Device token management
router.post('/device-token', authenticate, notificationController.registerDeviceToken);
router.delete('/device-token', authenticate, notificationController.removeDeviceToken);
router.get('/device-tokens', authenticate, notificationController.getDeviceTokens);

// Topic subscriptions
router.post('/topics/:topic/subscribe', authenticate, notificationController.subscribeToTopic);
router.post(
  '/topics/:topic/unsubscribe',
  authenticate,
  notificationController.unsubscribeFromTopic
);

// ============ ADMIN ROUTES ============

// Send notification to specific user(s)
router.post(
  '/admin/send',
  authenticate,
  authorize('admin', 'super_admin'),
  notificationController.sendNotificationToUser
);

// Broadcast notification to all users
router.post(
  '/admin/broadcast',
  authenticate,
  authorize('admin', 'super_admin'),
  notificationController.broadcastNotification
);

export default router;
