/**
 * Device Token Model
 * نموذج رمز الجهاز للإشعارات
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Device Token interface
 * واجهة رمز الجهاز
 */
export interface IDeviceToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  deviceType: 'web' | 'android' | 'ios';
  deviceId?: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  isActive: boolean;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device Token Model interface with static methods
 * واجهة نموذج رمز الجهاز مع الدوال الثابتة
 */
interface IDeviceTokenModel extends Model<IDeviceToken> {
  registerToken(
    userId: string,
    token: string,
    deviceInfo: {
      deviceType: 'web' | 'android' | 'ios';
      deviceId?: string;
      deviceName?: string;
      browser?: string;
      os?: string;
    }
  ): Promise<IDeviceToken>;
  removeToken(token: string): Promise<boolean>;
  getUserTokens(userId: string): Promise<IDeviceToken[]>;
  deactivateUserTokens(userId: string): Promise<number>;
  cleanupInactiveTokens(daysInactive?: number): Promise<number>;
}

/**
 * Device Token Schema
 * مخطط رمز الجهاز
 */
const deviceTokenSchema = new Schema<IDeviceToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
    },
    deviceType: {
      type: String,
      enum: ['web', 'android', 'ios'],
      default: 'web',
    },
    deviceId: {
      type: String,
    },
    deviceName: {
      type: String,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
deviceTokenSchema.index({ user: 1, isActive: 1 });
deviceTokenSchema.index({ lastUsedAt: -1 });

/**
 * Register device token
 * تسجيل رمز الجهاز
 */
deviceTokenSchema.statics.registerToken = async function (
  userId: string,
  token: string,
  deviceInfo: {
    deviceType: 'web' | 'android' | 'ios';
    deviceId?: string;
    deviceName?: string;
    browser?: string;
    os?: string;
  }
): Promise<IDeviceToken> {
  // Upsert: update if exists, create if not
  const deviceToken = await this.findOneAndUpdate(
    { token },
    {
      user: userId,
      token,
      ...deviceInfo,
      isActive: true,
      lastUsedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return deviceToken;
};

/**
 * Remove device token
 * إزالة رمز الجهاز
 */
deviceTokenSchema.statics.removeToken = async function (token: string): Promise<boolean> {
  const result = await this.deleteOne({ token });
  return result.deletedCount > 0;
};

/**
 * Get user tokens
 * الحصول على رموز المستخدم
 */
deviceTokenSchema.statics.getUserTokens = async function (userId: string): Promise<IDeviceToken[]> {
  return this.find({ user: userId, isActive: true }).sort({ lastUsedAt: -1 });
};

/**
 * Deactivate all tokens for user
 * تعطيل جميع رموز المستخدم
 */
deviceTokenSchema.statics.deactivateUserTokens = async function (userId: string): Promise<number> {
  const result = await this.updateMany({ user: userId }, { isActive: false });
  return result.modifiedCount;
};

/**
 * Cleanup inactive tokens
 * تنظيف الرموز غير النشطة
 */
deviceTokenSchema.statics.cleanupInactiveTokens = async function (
  daysInactive: number = 30
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const result = await this.deleteMany({
    $or: [{ isActive: false }, { lastUsedAt: { $lt: cutoffDate } }],
  });

  return result.deletedCount;
};

export const DeviceToken = mongoose.model<IDeviceToken, IDeviceTokenModel>(
  'DeviceToken',
  deviceTokenSchema
);

export default DeviceToken;
