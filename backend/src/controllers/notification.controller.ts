/**
 * Notification Controller
 * تحكم الإشعارات
 */

import { Request, Response } from 'express';
import { Notification, DeviceToken } from '../models';
import { asyncHandler } from '../middlewares';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import * as notificationService from '../services/notification.service';

/**
 * Get user notifications
 * @route GET /api/v1/notifications
 * @access Private
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const { page, limit, unreadOnly } = req.query;

  const result = await Notification.getByUser(userId, {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    unreadOnly: unreadOnly === 'true',
  });

  sendSuccess(res, result);
});

/**
 * Get unread count
 * @route GET /api/v1/notifications/unread-count
 * @access Private
 */
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const count = await notificationService.getUnreadCount(userId);
  sendSuccess(res, { count });
});

/**
 * Mark notification as read
 * @route PUT /api/v1/notifications/:id/read
 * @access Private
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as Request & { user: { _id: string } }).user._id;

  const notification = await Notification.findOne({ _id: id, user: userId });

  if (!notification) {
    throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
  }

  const updated = await notificationService.markAsRead(id);
  sendSuccess(res, { notification: updated });
});

/**
 * Mark all notifications as read
 * @route PUT /api/v1/notifications/read-all
 * @access Private
 */
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const count = await notificationService.markAllAsRead(userId);
  sendSuccess(res, { message: `${count} notifications marked as read`, count });
});

/**
 * Delete notification
 * @route DELETE /api/v1/notifications/:id
 * @access Private
 */
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as Request & { user: { _id: string } }).user._id;

  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });

  if (!notification) {
    throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
  }

  sendSuccess(res, { message: 'Notification deleted' });
});

/**
 * Delete all read notifications
 * @route DELETE /api/v1/notifications/read
 * @access Private
 */
export const deleteReadNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;

  const result = await Notification.deleteMany({ user: userId, isRead: true });
  sendSuccess(res, {
    message: `${result.deletedCount} notifications deleted`,
    count: result.deletedCount,
  });
});

/**
 * Register device token for push notifications
 * @route POST /api/v1/notifications/device-token
 * @access Private
 */
export const registerDeviceToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const { token, deviceType, deviceId, deviceName, browser, os } = req.body;

  if (!token) {
    throw new ApiError(400, 'TOKEN_REQUIRED', 'Device token is required');
  }

  const deviceToken = await DeviceToken.registerToken(userId, token, {
    deviceType: deviceType || 'web',
    deviceId,
    deviceName,
    browser,
    os,
  });

  sendSuccess(res, { deviceToken, message: 'Device registered for push notifications' });
});

/**
 * Remove device token
 * @route DELETE /api/v1/notifications/device-token
 * @access Private
 */
export const removeDeviceToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, 'TOKEN_REQUIRED', 'Device token is required');
  }

  const removed = await DeviceToken.removeToken(token);

  if (!removed) {
    throw new ApiError(404, 'TOKEN_NOT_FOUND', 'Device token not found');
  }

  sendSuccess(res, { message: 'Device token removed' });
});

/**
 * Get user device tokens
 * @route GET /api/v1/notifications/device-tokens
 * @access Private
 */
export const getDeviceTokens = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const tokens = await DeviceToken.getUserTokens(userId);
  sendSuccess(res, { tokens });
});

/**
 * Subscribe to topic
 * @route POST /api/v1/notifications/topics/:topic/subscribe
 * @access Private
 */
export const subscribeToTopic = asyncHandler(async (req: Request, res: Response) => {
  const { topic } = req.params;
  const { token } = req.body;

  // This would use Firebase Admin SDK to subscribe to topic
  // For now, just acknowledge the request
  sendSuccess(res, { message: `Subscribed to topic: ${topic}`, topic, token });
});

/**
 * Unsubscribe from topic
 * @route POST /api/v1/notifications/topics/:topic/unsubscribe
 * @access Private
 */
export const unsubscribeFromTopic = asyncHandler(async (req: Request, res: Response) => {
  const { topic } = req.params;
  const { token } = req.body;

  // This would use Firebase Admin SDK to unsubscribe from topic
  sendSuccess(res, { message: `Unsubscribed from topic: ${topic}`, topic, token });
});

// ============ ADMIN ============

/**
 * Send notification to user (Admin)
 * @route POST /api/v1/notifications/admin/send
 * @access Private (Admin)
 */
export const sendNotificationToUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, userIds, userRole, title, body, type, link, data } = req.body;

  if (!userId && !userIds && !userRole) {
    throw new ApiError(400, 'RECIPIENT_REQUIRED', 'User ID, user IDs, or user role is required');
  }

  const result = await notificationService.sendNotification({
    userId,
    userIds,
    userRole,
    payload: {
      title,
      body,
      type: type || 'info',
      link,
      data,
    },
  });

  sendSuccess(res, {
    message: 'Notification sent',
    ...result,
  });
});

/**
 * Send notification to all users (Admin)
 * @route POST /api/v1/notifications/admin/broadcast
 * @access Private (Admin)
 */
export const broadcastNotification = asyncHandler(async (req: Request, res: Response) => {
  const { title, body, type, link, data, topic } = req.body;

  const result = await notificationService.sendNotification({
    topic: topic || 'all-users',
    payload: {
      title,
      body,
      type: type || 'info',
      link,
      data,
    },
    saveToDatabase: false, // Don't save broadcast to individual user notifications
  });

  sendSuccess(res, {
    message: 'Broadcast notification sent',
    ...result,
  });
});

export const notificationController = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  registerDeviceToken,
  removeDeviceToken,
  getDeviceTokens,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendNotificationToUser,
  broadcastNotification,
};

export default notificationController;
