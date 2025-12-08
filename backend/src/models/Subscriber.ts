/**
 * Subscriber Model
 * نموذج المشتركين في النشرة البريدية
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

// Subscriber Status
export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced' | 'pending';

// Subscriber Source
export type SubscriberSource = 'website' | 'import' | 'manual' | 'api';

// Interface
export interface ISubscriber extends Document {
  email: string;
  name?: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  tags: string[];
  locale: 'ar' | 'en';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  verificationToken?: string;
  unsubscribeToken: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface ISubscriberModel extends Model<ISubscriber> {
  getSubscribers(options?: {
    status?: SubscriberStatus;
    source?: SubscriberSource;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    subscribers: ISubscriber[];
    total: number;
    pagination: { page: number; limit: number; pages: number };
  }>;

  getByEmail(email: string): Promise<ISubscriber | null>;

  getActiveSubscribers(tags?: string[]): Promise<ISubscriber[]>;

  getActiveCount(): Promise<number>;

  getAllTags(): Promise<string[]>;

  bulkUpdateStatus(ids: string[], status: SubscriberStatus): Promise<number>;

  getStats(): Promise<{
    total: number;
    active: number;
    unsubscribed: number;
    bounced: number;
    pending: number;
    bySource: Record<string, number>;
    recentSubscribers: ISubscriber[];
  }>;
}

// Schema
const subscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required | البريد الإلكتروني مطلوب'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email | يرجى إدخال بريد إلكتروني صالح'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed', 'bounced', 'pending'],
      default: 'pending',
    },
    source: {
      type: String,
      enum: ['website', 'import', 'manual', 'api'],
      default: 'website',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    locale: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
    verificationToken: String,
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(32).toString('hex'),
    },
    metadata: {
      ip: String,
      userAgent: String,
      referrer: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ source: 1 });
subscriberSchema.index({ tags: 1 });
subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ '$**': 'text' }); // Full-text search

// Static: Get subscribers with filtering and pagination
subscriberSchema.statics.getSubscribers = async function (
  options: {
    status?: SubscriberStatus;
    source?: SubscriberSource;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}
): Promise<{
  subscribers: ISubscriber[];
  total: number;
  pagination: { page: number; limit: number; pages: number };
}> {
  const { status, source, tags, search, page = 1, limit = 20, sort = '-subscribedAt' } = options;

  // Build query
  const query: Record<string, unknown> = {};

  if (status) query.status = status;
  if (source) query.source = source;
  if (tags && tags.length > 0) query.tags = { $in: tags };

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ];
  }

  // Get total and subscribers
  const [subscribers, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    subscribers,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Static: Get by email
subscriberSchema.statics.getByEmail = async function (email: string): Promise<ISubscriber | null> {
  return this.findOne({ email: email.toLowerCase() });
};

// Static: Get active subscribers (optionally filtered by tags)
subscriberSchema.statics.getActiveSubscribers = async function (
  tags?: string[]
): Promise<ISubscriber[]> {
  const query: Record<string, unknown> = { status: 'active' };
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }
  return this.find(query).lean();
};

// Static: Get active count
subscriberSchema.statics.getActiveCount = async function (): Promise<number> {
  return this.countDocuments({ status: 'active' });
};

// Static: Get all unique tags
subscriberSchema.statics.getAllTags = async function (): Promise<string[]> {
  const result = await this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags' } },
    { $sort: { _id: 1 } },
  ]);
  return result.map((item: { _id: string }) => item._id);
};

// Static: Bulk update status
subscriberSchema.statics.bulkUpdateStatus = async function (
  ids: string[],
  status: SubscriberStatus
): Promise<number> {
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
  const updateData: Record<string, unknown> = { status };

  if (status === 'unsubscribed') {
    updateData.unsubscribedAt = new Date();
  }

  const result = await this.updateMany({ _id: { $in: objectIds } }, { $set: updateData });
  return result.modifiedCount;
};

// Static: Get statistics
subscriberSchema.statics.getStats = async function (): Promise<{
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  pending: number;
  bySource: Record<string, number>;
  recentSubscribers: ISubscriber[];
}> {
  const [total, active, unsubscribed, bounced, pending, bySourceAgg, recentSubscribers] =
    await Promise.all([
      this.countDocuments(),
      this.countDocuments({ status: 'active' }),
      this.countDocuments({ status: 'unsubscribed' }),
      this.countDocuments({ status: 'bounced' }),
      this.countDocuments({ status: 'pending' }),
      this.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      this.find().sort('-subscribedAt').limit(5).select('email name status subscribedAt').lean(),
    ]);

  // Convert source aggregation to object
  const bySource: Record<string, number> = {};
  bySourceAgg.forEach((item: { _id: string; count: number }) => {
    bySource[item._id] = item.count;
  });

  return {
    total,
    active,
    unsubscribed,
    bounced,
    pending,
    bySource,
    recentSubscribers,
  };
};

export const Subscriber = mongoose.model<ISubscriber, ISubscriberModel>(
  'Subscriber',
  subscriberSchema
);
export default Subscriber;
