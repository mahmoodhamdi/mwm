/**
 * Notification Model
 * نموذج الإشعارات
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString } from '@mwm/shared';

/**
 * Notification interface
 * واجهة الإشعار
 */
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'info' | 'success' | 'warning' | 'error';
  title: LocalizedString;
  body: LocalizedString;
  link?: string;
  data?: Record<string, string>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Model interface with static methods
 * واجهة نموذج الإشعار مع الدوال الثابتة
 */
interface INotificationModel extends Model<INotification> {
  getByUser(
    userId: string,
    options?: { page?: number; limit?: number; unreadOnly?: boolean }
  ): Promise<{ notifications: INotification[]; total: number; unreadCount: number }>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<number>;
  getUnreadCount(userId: string): Promise<number>;
  deleteOld(daysOld?: number): Promise<number>;
}

/**
 * Notification Schema
 * مخطط الإشعار
 */
const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    title: {
      ar: { type: String, required: [true, 'Arabic title is required'] },
      en: { type: String, required: [true, 'English title is required'] },
    },
    body: {
      ar: { type: String, required: [true, 'Arabic body is required'] },
      en: { type: String, required: [true, 'English body is required'] },
    },
    link: {
      type: String,
    },
    data: {
      type: Map,
      of: String,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

/**
 * Get notifications by user
 * الحصول على إشعارات المستخدم
 */
notificationSchema.statics.getByUser = async function (
  userId: string,
  options: { page?: number; limit?: number; unreadOnly?: boolean } = {}
): Promise<{ notifications: INotification[]; total: number; unreadCount: number }> {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { user: userId };
  if (unreadOnly) {
    query.isRead = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    this.countDocuments(query),
    this.countDocuments({ user: userId, isRead: false }),
  ]);

  return { notifications, total, unreadCount };
};

/**
 * Mark notification as read
 * تحديد الإشعار كمقروء
 */
notificationSchema.statics.markAsRead = async function (
  notificationId: string
): Promise<INotification | null> {
  return this.findByIdAndUpdate(
    notificationId,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

/**
 * Mark all notifications as read for user
 * تحديد جميع إشعارات المستخدم كمقروءة
 */
notificationSchema.statics.markAllAsRead = async function (userId: string): Promise<number> {
  const result = await this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return result.modifiedCount;
};

/**
 * Get unread count for user
 * الحصول على عدد الإشعارات غير المقروءة
 */
notificationSchema.statics.getUnreadCount = async function (userId: string): Promise<number> {
  return this.countDocuments({ user: userId, isRead: false });
};

/**
 * Delete old notifications
 * حذف الإشعارات القديمة
 */
notificationSchema.statics.deleteOld = async function (daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true,
  });

  return result.deletedCount;
};

export const Notification = mongoose.model<INotification, INotificationModel>(
  'Notification',
  notificationSchema
);

export default Notification;
