/**
 * Notification Service Unit Tests
 * اختبارات وحدة خدمة الإشعارات
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';

import * as admin from 'firebase-admin';
import {
  sendPushNotification,
  sendNotification,
  notifyAdmins,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '../../../src/services/notification.service';
import { Notification } from '../../../src/models/Notification';
import { User } from '../../../src/models';
import { DeviceToken } from '../../../src/models/DeviceToken';

// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  messaging: jest.fn(),
}));

// Mock firebase config
const mockMessaging = {
  sendEachForMulticast: jest.fn(),
  send: jest.fn(),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
};

jest.mock('../../../src/config/firebase', () => ({
  getMessaging: jest.fn(() => mockMessaging),
}));

// Mock models
jest.mock('../../../src/models/Notification');
jest.mock('../../../src/models/DeviceToken');
jest.mock('../../../src/models');

// Mock logger and socket
jest.mock('../../../src/config', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  emitToUser: jest.fn(),
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendPushNotification', () => {
    it('should send push notification to multiple tokens', async () => {
      const tokens = ['token1', 'token2', 'token3'];
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'info' as const,
      };

      mockMessaging.sendEachForMulticast.mockResolvedValue({
        successCount: 3,
        failureCount: 0,
        responses: [
          { success: true },
          { success: true },
          { success: true },
        ],
      });

      const result = await sendPushNotification(tokens, payload, 'ar');

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(mockMessaging.sendEachForMulticast).toHaveBeenCalledWith(
        expect.objectContaining({
          tokens,
          notification: {
            title: 'عنوان',
            body: 'محتوى',
            imageUrl: undefined,
          },
        })
      );
    });

    it('should use English locale when specified', async () => {
      const tokens = ['token1'];
      const payload = {
        title: { ar: 'عنوان', en: 'English Title' },
        body: { ar: 'محتوى', en: 'English Body' },
        type: 'success' as const,
      };

      mockMessaging.sendEachForMulticast.mockResolvedValue({
        successCount: 1,
        failureCount: 0,
        responses: [{ success: true }],
      });

      await sendPushNotification(tokens, payload, 'en');

      expect(mockMessaging.sendEachForMulticast).toHaveBeenCalledWith(
        expect.objectContaining({
          notification: {
            title: 'English Title',
            body: 'English Body',
            imageUrl: undefined,
          },
        })
      );
    });

    it('should remove failed tokens from database', async () => {
      const tokens = ['token1', 'token2', 'token3'];
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'error' as const,
      };

      mockMessaging.sendEachForMulticast.mockResolvedValue({
        successCount: 2,
        failureCount: 1,
        responses: [
          { success: true },
          { success: false, error: { message: 'Invalid token' } },
          { success: true },
        ],
      });

      (DeviceToken.deleteMany as jest.Mock).mockResolvedValue({});

      const result = await sendPushNotification(tokens, payload);

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(DeviceToken.deleteMany).toHaveBeenCalledWith({
        token: { $in: ['token2'] },
      });
    });

    it('should return early for empty tokens array', async () => {
      const result = await sendPushNotification([], {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'info' as const,
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
      expect(mockMessaging.sendEachForMulticast).not.toHaveBeenCalled();
    });

    it('should handle FCM errors gracefully', async () => {
      const tokens = ['token1'];
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'warning' as const,
      };

      mockMessaging.sendEachForMulticast.mockRejectedValue(new Error('FCM Error'));

      const result = await sendPushNotification(tokens, payload);

      expect(result.success).toBe(false);
      expect(result.failureCount).toBe(1);
      expect(result.errors).toContain('FCM Error');
    });
  });

  describe('sendNotification', () => {
    it('should send notification to specific user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'info' as const,
      };

      (Notification.insertMany as jest.Mock).mockResolvedValue([
        {
          user: userId,
          type: 'info',
          title: payload.title,
          body: payload.body,
          isRead: false,
        },
      ]);

      (Notification.countDocuments as jest.Mock).mockResolvedValue(5);

      (DeviceToken.find as jest.Mock).mockResolvedValue([
        { token: 'device-token-1' },
        { token: 'device-token-2' },
      ]);

      mockMessaging.sendEachForMulticast.mockResolvedValue({
        successCount: 2,
        failureCount: 0,
        responses: [{ success: true }, { success: true }],
      });

      const result = await sendNotification({ userId, payload });

      expect(result.notification).toBeDefined();
      expect(Notification.insertMany).toHaveBeenCalled();
      expect(DeviceToken.find).toHaveBeenCalledWith({
        user: { $in: [userId] },
        isActive: true,
      });
    });

    it('should send notification to multiple users', async () => {
      const userIds = ['user1', 'user2', 'user3'];
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'success' as const,
      };

      (Notification.insertMany as jest.Mock).mockResolvedValue([{}, {}, {}]);
      (Notification.countDocuments as jest.Mock).mockResolvedValue(3);
      (DeviceToken.find as jest.Mock).mockResolvedValue([]);

      const result = await sendNotification({ userIds, payload });

      expect(Notification.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ user: 'user1' }),
          expect.objectContaining({ user: 'user2' }),
          expect.objectContaining({ user: 'user3' }),
        ])
      );
    });

    it('should send notification to users by role', async () => {
      const mockUsers = [
        { _id: 'admin1' },
        { _id: 'admin2' },
      ];

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers),
      });

      (Notification.insertMany as jest.Mock).mockResolvedValue([{}, {}]);
      (Notification.countDocuments as jest.Mock).mockResolvedValue(2);
      (DeviceToken.find as jest.Mock).mockResolvedValue([]);

      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'warning' as const,
      };

      await sendNotification({ userRole: 'admin', payload });

      expect(User.find).toHaveBeenCalledWith({ role: 'admin', isActive: true });
    });

    it('should skip database save when saveToDatabase is false', async () => {
      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'info' as const,
      };

      const result = await sendNotification({
        userId: '123',
        payload,
        saveToDatabase: false,
      });

      expect(Notification.insertMany).not.toHaveBeenCalled();
    });
  });

  describe('notifyAdmins', () => {
    it('should send notification to both admin and super_admin roles', async () => {
      const mockAdmins = [{ _id: 'admin1' }];
      const mockSuperAdmins = [{ _id: 'superadmin1' }];

      (User.find as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue(mockAdmins),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue(mockSuperAdmins),
        });

      (Notification.insertMany as jest.Mock).mockResolvedValue([{}]);
      (Notification.countDocuments as jest.Mock).mockResolvedValue(1);
      (DeviceToken.find as jest.Mock).mockResolvedValue([]);

      const payload = {
        title: { ar: 'عنوان', en: 'Title' },
        body: { ar: 'محتوى', en: 'Body' },
        type: 'info' as const,
      };

      await notifyAdmins(payload);

      expect(User.find).toHaveBeenCalledWith({ role: 'admin', isActive: true });
      expect(User.find).toHaveBeenCalledWith({ role: 'super_admin', isActive: true });
    });
  });

  describe('subscribeToTopic', () => {
    it('should subscribe token to FCM topic successfully', async () => {
      mockMessaging.subscribeToTopic.mockResolvedValue({
        successCount: 1,
        failureCount: 0,
      });

      const result = await subscribeToTopic('device-token', 'news');

      expect(result.success).toBe(true);
      expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith(['device-token'], 'news');
    });

    it('should return error when subscription fails', async () => {
      mockMessaging.subscribeToTopic.mockResolvedValue({
        successCount: 0,
        failureCount: 1,
        errors: [{ error: { message: 'Invalid token' } }],
      });

      const result = await subscribeToTopic('invalid-token', 'news');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    it('should handle exceptions gracefully', async () => {
      mockMessaging.subscribeToTopic.mockRejectedValue(new Error('Network error'));

      const result = await subscribeToTopic('device-token', 'news');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('unsubscribeFromTopic', () => {
    it('should unsubscribe token from FCM topic successfully', async () => {
      mockMessaging.unsubscribeFromTopic.mockResolvedValue({
        successCount: 1,
        failureCount: 0,
      });

      const result = await unsubscribeFromTopic('device-token', 'news');

      expect(result.success).toBe(true);
      expect(mockMessaging.unsubscribeFromTopic).toHaveBeenCalledWith(['device-token'], 'news');
    });

    it('should return error when unsubscription fails', async () => {
      mockMessaging.unsubscribeFromTopic.mockResolvedValue({
        successCount: 0,
        failureCount: 1,
        errors: [{ error: { message: 'Token not found' } }],
      });

      const result = await unsubscribeFromTopic('invalid-token', 'news');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token not found');
    });
  });
});
