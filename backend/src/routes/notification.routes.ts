/**
 * Notification Routes
 * مسارات الإشعارات
 */

import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate, authorize } from '../middlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: User notification management
 *   - name: Notifications Admin
 *     description: Admin notification operations
 */

// ============ USER ROUTES ============

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [info, success, warning, error]
 *     responses:
 *       200:
 *         description: User notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', authenticate, notificationController.markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
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
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', authenticate, notificationController.deleteNotification);

/**
 * @swagger
 * /notifications/read:
 *   delete:
 *     summary: Delete all read notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Read notifications deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/read', authenticate, notificationController.deleteReadNotifications);

/**
 * @swagger
 * /notifications/device-token:
 *   post:
 *     summary: Register device token for push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [web, ios, android]
 *     responses:
 *       200:
 *         description: Token registered
 *       401:
 *         description: Unauthorized
 */
router.post('/device-token', authenticate, notificationController.registerDeviceToken);

/**
 * @swagger
 * /notifications/device-token:
 *   delete:
 *     summary: Remove device token
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token removed
 *       401:
 *         description: Unauthorized
 */
router.delete('/device-token', authenticate, notificationController.removeDeviceToken);

/**
 * @swagger
 * /notifications/device-tokens:
 *   get:
 *     summary: Get user's device tokens
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of device tokens
 *       401:
 *         description: Unauthorized
 */
router.get('/device-tokens', authenticate, notificationController.getDeviceTokens);

/**
 * @swagger
 * /notifications/topics/{topic}/subscribe:
 *   post:
 *     summary: Subscribe to notification topic
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribed to topic
 *       401:
 *         description: Unauthorized
 */
router.post('/topics/:topic/subscribe', authenticate, notificationController.subscribeToTopic);

/**
 * @swagger
 * /notifications/topics/{topic}/unsubscribe:
 *   post:
 *     summary: Unsubscribe from notification topic
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unsubscribed from topic
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/topics/:topic/unsubscribe',
  authenticate,
  notificationController.unsubscribeFromTopic
);

// ============ ADMIN ROUTES ============

/**
 * @swagger
 * /notifications/admin/send:
 *   post:
 *     summary: Send notification to specific user(s)
 *     tags: [Notifications Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *               - title
 *               - body
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               body:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error]
 *     responses:
 *       200:
 *         description: Notification sent
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin/send',
  authenticate,
  authorize('admin', 'super_admin'),
  notificationController.sendNotificationToUser
);

/**
 * @swagger
 * /notifications/admin/broadcast:
 *   post:
 *     summary: Broadcast notification to all users
 *     tags: [Notifications Admin]
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
 *               - body
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               body:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error]
 *     responses:
 *       200:
 *         description: Notification broadcast sent
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin/broadcast',
  authenticate,
  authorize('admin', 'super_admin'),
  notificationController.broadcastNotification
);

export default router;
