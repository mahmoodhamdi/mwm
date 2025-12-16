/**
 * Notification Service
 * خدمة الإشعارات - FCM Push Notifications
 */

import * as admin from 'firebase-admin';
import { getMessaging } from '../config/firebase';
import { logger, emitToUser, emitToAdmins } from '../config';
import { Notification, INotification } from '../models/Notification';
import { User } from '../models';
import { DeviceToken } from '../models/DeviceToken';

/**
 * Notification payload interface
 * واجهة بيانات الإشعار
 */
interface NotificationPayload {
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

/**
 * Send notification options
 * خيارات إرسال الإشعار
 */
interface SendNotificationOptions {
  userId?: string;
  userIds?: string[];
  userRole?: string;
  topic?: string;
  payload: NotificationPayload;
  saveToDatabase?: boolean;
}

/**
 * FCM Message result
 * نتيجة رسالة FCM
 */
interface FCMResult {
  success: boolean;
  successCount: number;
  failureCount: number;
  errors?: string[];
}

/**
 * Send push notification via FCM
 * إرسال إشعار عبر FCM
 */
export async function sendPushNotification(
  tokens: string[],
  payload: NotificationPayload,
  locale: 'ar' | 'en' = 'ar'
): Promise<FCMResult> {
  const messaging = getMessaging();

  if (!messaging) {
    logger.warn('FCM not initialized - skipping push notification');
    return {
      success: false,
      successCount: 0,
      failureCount: tokens.length,
      errors: ['FCM not initialized'],
    };
  }

  if (tokens.length === 0) {
    return { success: true, successCount: 0, failureCount: 0 };
  }

  try {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: payload.title[locale],
        body: payload.body[locale],
        imageUrl: payload.imageUrl,
      },
      data: {
        type: payload.type,
        link: payload.link || '',
        ...payload.data,
      },
      webpush: {
        notification: {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: payload.type,
          requireInteraction: payload.type === 'error' || payload.type === 'warning',
        },
        fcmOptions: {
          link: payload.link,
        },
      },
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#2563eb',
          priority: 'high',
          defaultSound: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await messaging.sendEachForMulticast(message);

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          logger.warn(`FCM send failed for token: ${resp.error?.message}`);
        }
      });

      // Remove invalid tokens from database
      if (failedTokens.length > 0) {
        await DeviceToken.deleteMany({ token: { $in: failedTokens } });
      }
    }

    logger.info(`FCM sent: ${response.successCount} success, ${response.failureCount} failed`);

    return {
      success: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    logger.error('FCM send error:', error);
    return {
      success: false,
      successCount: 0,
      failureCount: tokens.length,
      errors: [(error as Error).message],
    };
  }
}

/**
 * Send notification to specific users
 * إرسال إشعار لمستخدمين محددين
 */
export async function sendNotification(options: SendNotificationOptions): Promise<{
  notification?: INotification | INotification[];
  fcmResult?: FCMResult;
}> {
  const { userId, userIds, userRole, topic, payload, saveToDatabase = true } = options;

  let targetUserIds: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedNotifications: any[] = [];

  // Determine target users
  if (userId) {
    targetUserIds = [userId];
  } else if (userIds && userIds.length > 0) {
    targetUserIds = userIds;
  } else if (userRole) {
    const users = await User.find({ role: userRole, isActive: true }).select('_id');
    targetUserIds = users.map(u => u._id.toString());
  }

  // Save notifications to database
  if (saveToDatabase && targetUserIds.length > 0) {
    const notificationsToCreate = targetUserIds.map(uid => ({
      user: uid,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      link: payload.link,
      data: payload.data,
      isRead: false,
    }));

    savedNotifications = await Notification.insertMany(notificationsToCreate);

    // Emit socket events for real-time updates
    for (const notification of savedNotifications) {
      const userId = notification.user.toString();
      emitToUser(userId, 'notification:new', { notification });

      // Get updated unread count
      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
      emitToUser(userId, 'notification:count', { count: unreadCount });
    }
  }

  // Get device tokens for target users
  let tokens: string[] = [];
  if (targetUserIds.length > 0) {
    const deviceTokens = await DeviceToken.find({
      user: { $in: targetUserIds },
      isActive: true,
    });
    tokens = deviceTokens.map(dt => dt.token);
  }

  // Send to topic if specified
  if (topic) {
    const messaging = getMessaging();
    if (messaging) {
      try {
        await messaging.send({
          topic,
          notification: {
            title: payload.title.ar,
            body: payload.body.ar,
          },
          data: {
            type: payload.type,
            link: payload.link || '',
            ...payload.data,
          },
        });
        logger.info(`Notification sent to topic: ${topic}`);
      } catch (error) {
        logger.error(`Failed to send to topic ${topic}:`, error);
      }
    }
  }

  // Send FCM push notifications
  let fcmResult: FCMResult | undefined;
  if (tokens.length > 0) {
    fcmResult = await sendPushNotification(tokens, payload);
  }

  return {
    notification: savedNotifications.length === 1 ? savedNotifications[0] : savedNotifications,
    fcmResult,
  };
}

/**
 * Send notification to all admins
 * إرسال إشعار لجميع المسؤولين
 */
export async function notifyAdmins(payload: NotificationPayload): Promise<void> {
  await sendNotification({
    userRole: 'admin',
    payload,
  });

  await sendNotification({
    userRole: 'super_admin',
    payload,
  });
}

/**
 * Notify admins about new contact message
 * إخطار المسؤولين برسالة تواصل جديدة
 */
export async function notifyNewContact(
  contactId: string,
  contactName: string,
  subject: string
): Promise<void> {
  await notifyAdmins({
    type: 'info',
    title: {
      ar: 'رسالة جديدة',
      en: 'New Message',
    },
    body: {
      ar: `رسالة جديدة من ${contactName}: ${subject}`,
      en: `New message from ${contactName}: ${subject}`,
    },
    link: `/admin/messages/${contactId}`,
    data: {
      contactId,
      contactName,
    },
  });
}

/**
 * Notify admins about new job application
 * إخطار المسؤولين بطلب توظيف جديد
 */
export async function notifyNewJobApplication(
  applicationId: string,
  applicantName: string,
  jobTitle: string
): Promise<void> {
  await notifyAdmins({
    type: 'info',
    title: {
      ar: 'طلب توظيف جديد',
      en: 'New Job Application',
    },
    body: {
      ar: `تقدم ${applicantName} لوظيفة ${jobTitle}`,
      en: `${applicantName} applied for ${jobTitle}`,
    },
    link: `/admin/careers/applications/${applicationId}`,
    data: {
      applicationId,
      applicantName,
    },
  });
}

/**
 * Notify admins about new newsletter subscriber
 * إخطار المسؤولين بمشترك جديد
 */
export async function notifyNewSubscriber(email: string): Promise<void> {
  await notifyAdmins({
    type: 'success',
    title: {
      ar: 'مشترك جديد',
      en: 'New Subscriber',
    },
    body: {
      ar: `اشتراك جديد في النشرة البريدية: ${email}`,
      en: `New newsletter subscription: ${email}`,
    },
    link: '/admin/newsletter/subscribers',
  });
}

/**
 * Send notification to a specific user
 * إرسال إشعار لمستخدم محدد
 */
export async function notifyUser(userId: string, payload: NotificationPayload): Promise<void> {
  await sendNotification({
    userId,
    payload,
  });
}

/**
 * Mark notification as read
 * تحديد الإشعار كمقروء
 */
export async function markAsRead(notificationId: string): Promise<INotification | null> {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (notification) {
    const userId = notification.user.toString();
    emitToUser(userId, 'notification:updated', { id: notificationId, isRead: true });

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
    emitToUser(userId, 'notification:count', { count: unreadCount });
  }

  return notification;
}

/**
 * Mark all notifications as read for a user
 * تحديد جميع الإشعارات كمقروءة للمستخدم
 */
export async function markAllAsRead(userId: string): Promise<number> {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  if (result.modifiedCount > 0) {
    emitToUser(userId, 'notification:read-all', { count: result.modifiedCount });
    emitToUser(userId, 'notification:count', { count: 0 });
  }

  return result.modifiedCount;
}

/**
 * Get unread count for a user
 * الحصول على عدد الإشعارات غير المقروءة
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return Notification.countDocuments({ user: userId, isRead: false });
}

/**
 * Delete old notifications
 * حذف الإشعارات القديمة
 */
export async function deleteOldNotifications(daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await Notification.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true,
  });

  logger.info(`Deleted ${result.deletedCount} old notifications`);
  return result.deletedCount;
}

export default {
  sendPushNotification,
  sendNotification,
  notifyAdmins,
  notifyNewContact,
  notifyNewJobApplication,
  notifyNewSubscriber,
  notifyUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteOldNotifications,
};
