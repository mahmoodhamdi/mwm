/**
 * Contact Model
 * نموذج رسائل التواصل
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { ContactStatus, ContactPriority } from '@mwm/shared';

// Re-export for backward compatibility with existing imports
export type { ContactStatus, ContactPriority } from '@mwm/shared';

// Interface
export interface IContact extends Document {
  // Contact Info
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;

  // Message
  subject: string;
  message: string;
  service?: mongoose.Types.ObjectId;
  budget?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';

  // Attachments
  attachments?: Array<{
    filename: string;
    url: string;
    mimetype: string;
    size: number;
  }>;

  // Status & Management
  status: ContactStatus;
  priority: ContactPriority;
  isStarred: boolean;
  labels?: string[];
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;

  // Reply tracking
  replies?: Array<{
    message: string;
    sentAt: Date;
    sentBy: mongoose.Types.ObjectId;
  }>;
  repliedAt?: Date;

  // Metadata
  ip?: string;
  userAgent?: string;
  locale: string;
  source?: string; // 'website' | 'api' | 'import'
  referrer?: string;

  // reCAPTCHA
  recaptchaScore?: number;
  recaptchaToken?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

// Static methods
export interface IContactModel extends Model<IContact> {
  getMessages(options?: {
    status?: ContactStatus;
    priority?: ContactPriority;
    starred?: boolean;
    search?: string;
    service?: string;
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{ messages: IContact[]; total: number; unreadCount: number }>;

  getById(id: string): Promise<IContact | null>;

  getUnreadCount(): Promise<number>;

  markAsRead(id: string): Promise<IContact | null>;

  markAsSpam(id: string): Promise<IContact | null>;

  archive(id: string): Promise<IContact | null>;

  getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byService: Array<{ service: string; count: number }>;
    recentMessages: IContact[];
  }>;
}

// Schema
const contactSchema = new Schema<IContact>(
  {
    // Contact Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    website: {
      type: String,
      trim: true,
    },

    // Message
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [10000, 'Message cannot exceed 10000 characters'],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    budget: {
      type: String,
      enum: ['under_5k', '5k_10k', '10k_25k', '25k_50k', '50k_100k', 'over_100k', 'not_sure'],
    },
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },

    // Attachments
    attachments: [
      {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],

    // Status & Management
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived', 'spam'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    labels: [{ type: String }],
    notes: {
      type: String,
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // Replies
    replies: [
      {
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    repliedAt: Date,

    // Metadata
    ip: String,
    userAgent: String,
    locale: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
    source: {
      type: String,
      default: 'website',
    },
    referrer: String,

    // reCAPTCHA
    recaptchaScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    recaptchaToken: String,

    // Archive
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ isStarred: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ service: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ '$**': 'text' }); // Full-text search

// Static: Get messages with filtering
contactSchema.statics.getMessages = async function (
  options: {
    status?: ContactStatus;
    priority?: ContactPriority;
    starred?: boolean;
    search?: string;
    service?: string;
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}
): Promise<{ messages: IContact[]; total: number; unreadCount: number }> {
  const {
    status,
    priority,
    starred,
    search,
    service,
    assignedTo,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = options;

  // Build query
  const query: Record<string, unknown> = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (starred !== undefined) query.isStarred = starred;
  if (service) query.service = new mongoose.Types.ObjectId(service);
  if (assignedTo) query.assignedTo = new mongoose.Types.ObjectId(assignedTo);

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) (query.createdAt as Record<string, Date>).$gte = dateFrom;
    if (dateTo) (query.createdAt as Record<string, Date>).$lte = dateTo;
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Get total and messages
  const [messages, total, unreadCount] = await Promise.all([
    this.find(query)
      .populate('service', 'title slug')
      .populate('assignedTo', 'name email avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
    this.countDocuments({ status: 'new' }),
  ]);

  return { messages, total, unreadCount };
};

// Static: Get by ID
contactSchema.statics.getById = async function (id: string): Promise<IContact | null> {
  return this.findById(id)
    .populate('service', 'title slug')
    .populate('assignedTo', 'name email avatar')
    .populate('replies.sentBy', 'name email avatar');
};

// Static: Get unread count
contactSchema.statics.getUnreadCount = async function (): Promise<number> {
  return this.countDocuments({ status: 'new' });
};

// Static: Mark as read
contactSchema.statics.markAsRead = async function (id: string): Promise<IContact | null> {
  return this.findByIdAndUpdate(id, { status: 'read' }, { new: true });
};

// Static: Mark as spam
contactSchema.statics.markAsSpam = async function (id: string): Promise<IContact | null> {
  return this.findByIdAndUpdate(id, { status: 'spam' }, { new: true });
};

// Static: Archive
contactSchema.statics.archive = async function (id: string): Promise<IContact | null> {
  return this.findByIdAndUpdate(id, { status: 'archived', archivedAt: new Date() }, { new: true });
};

// Static: Get statistics
contactSchema.statics.getStatistics = async function (): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byService: Array<{ service: string; count: number }>;
  recentMessages: IContact[];
}> {
  const [total, byStatusAgg, byPriorityAgg, byServiceAgg, recentMessages] = await Promise.all([
    this.countDocuments(),
    this.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    this.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    this.aggregate([
      { $match: { service: { $exists: true } } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'serviceInfo' } },
      { $unwind: { path: '$serviceInfo', preserveNullAndEmptyArrays: true } },
      { $project: { service: '$serviceInfo.title.en', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    this.find().sort('-createdAt').limit(5).select('name email subject status createdAt').lean(),
  ]);

  // Convert aggregations to objects
  const byStatus: Record<string, number> = {};
  byStatusAgg.forEach((item: { _id: string; count: number }) => {
    byStatus[item._id] = item.count;
  });

  const byPriority: Record<string, number> = {};
  byPriorityAgg.forEach((item: { _id: string; count: number }) => {
    byPriority[item._id] = item.count;
  });

  return {
    total,
    byStatus,
    byPriority,
    byService: byServiceAgg,
    recentMessages,
  };
};

export const Contact = mongoose.model<IContact, IContactModel>('Contact', contactSchema);
export default Contact;
