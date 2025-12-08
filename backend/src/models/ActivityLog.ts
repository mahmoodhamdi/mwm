/**
 * Activity Log Model
 * نموذج سجل النشاط
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Activity Log interface
 * واجهة سجل النشاط
 */
export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'login'
    | 'logout'
    | 'view'
    | 'export'
    | 'import'
    | 'publish'
    | 'unpublish';
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  resourceTitle?: string;
  details?: Record<string, unknown>;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * Activity Log Model interface with static methods
 * واجهة نموذج سجل النشاط مع الدوال الثابتة
 */
interface IActivityLogModel extends Model<IActivityLog> {
  log(data: Partial<IActivityLog>): Promise<IActivityLog>;
  getByUser(
    userId: string,
    options?: { page?: number; limit?: number; action?: string; resource?: string }
  ): Promise<{ logs: IActivityLog[]; total: number }>;
  getByResource(
    resource: string,
    resourceId?: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ logs: IActivityLog[]; total: number }>;
  getRecent(limit?: number): Promise<IActivityLog[]>;
  deleteOld(daysOld?: number): Promise<number>;
  getStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    byAction: Record<string, number>;
    byResource: Record<string, number>;
    byUser: Record<string, number>;
  }>;
}

/**
 * Activity Log Schema
 * مخطط سجل النشاط
 */
const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    action: {
      type: String,
      enum: [
        'create',
        'update',
        'delete',
        'login',
        'logout',
        'view',
        'export',
        'import',
        'publish',
        'unpublish',
      ],
      required: [true, 'Action is required'],
      index: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    resourceTitle: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

/**
 * Log activity
 * تسجيل النشاط
 */
activityLogSchema.statics.log = async function (
  data: Partial<IActivityLog>
): Promise<IActivityLog> {
  return this.create(data);
};

/**
 * Get logs by user
 * الحصول على سجلات المستخدم
 */
activityLogSchema.statics.getByUser = async function (
  userId: string,
  options: { page?: number; limit?: number; action?: string; resource?: string } = {}
): Promise<{ logs: IActivityLog[]; total: number }> {
  const { page = 1, limit = 20, action, resource } = options;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { user: userId };
  if (action) query.action = action;
  if (resource) query.resource = resource;

  const [logs, total] = await Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    this.countDocuments(query),
  ]);

  return { logs, total };
};

/**
 * Get logs by resource
 * الحصول على سجلات المورد
 */
activityLogSchema.statics.getByResource = async function (
  resource: string,
  resourceId?: string,
  options: { page?: number; limit?: number } = {}
): Promise<{ logs: IActivityLog[]; total: number }> {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { resource };
  if (resourceId) query.resourceId = resourceId;

  const [logs, total] = await Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    this.countDocuments(query),
  ]);

  return { logs, total };
};

/**
 * Get recent logs
 * الحصول على السجلات الأخيرة
 */
activityLogSchema.statics.getRecent = async function (limit: number = 20): Promise<IActivityLog[]> {
  return this.find().sort({ createdAt: -1 }).limit(limit).populate('user', 'name email avatar');
};

/**
 * Delete old logs
 * حذف السجلات القديمة
 */
activityLogSchema.statics.deleteOld = async function (daysOld: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await this.deleteMany({ createdAt: { $lt: cutoffDate } });
  return result.deletedCount;
};

/**
 * Get statistics
 * الحصول على الإحصائيات
 */
activityLogSchema.statics.getStatistics = async function (
  startDate?: Date,
  endDate?: Date
): Promise<{
  byAction: Record<string, number>;
  byResource: Record<string, number>;
  byUser: Record<string, number>;
}> {
  const query: Record<string, unknown> = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) (query.createdAt as Record<string, Date>).$gte = startDate;
    if (endDate) (query.createdAt as Record<string, Date>).$lte = endDate;
  }

  const [byAction, byResource, byUser] = await Promise.all([
    this.aggregate([{ $match: query }, { $group: { _id: '$action', count: { $sum: 1 } } }]),
    this.aggregate([{ $match: query }, { $group: { _id: '$resource', count: { $sum: 1 } } }]),
    this.aggregate([
      { $match: query },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    byAction: Object.fromEntries(byAction.map(a => [a._id, a.count])),
    byResource: Object.fromEntries(byResource.map(r => [r._id, r.count])),
    byUser: Object.fromEntries(byUser.map(u => [u._id?.toString() || 'unknown', u.count])),
  };
};

export const ActivityLog = mongoose.model<IActivityLog, IActivityLogModel>(
  'ActivityLog',
  activityLogSchema
);

export default ActivityLog;
