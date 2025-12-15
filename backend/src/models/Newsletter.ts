/**
 * Newsletter Model
 * نموذج حملات النشرة البريدية
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString, CampaignStatus, RecipientType, CampaignMetrics } from '@mwm/shared';

// Type alias for backward compatibility
type IBilingual = LocalizedString;

// Re-export types for backward compatibility
export type { CampaignStatus, RecipientType };

// Alias for backward compatibility (ICampaignMetrics -> CampaignMetrics)
export type ICampaignMetrics = CampaignMetrics;

// Interface
export interface INewsletter extends Document {
  subject: IBilingual;
  preheader?: IBilingual;
  content: IBilingual;
  status: CampaignStatus;
  recipientType: RecipientType;
  recipientTags?: string[];
  recipientIds?: mongoose.Types.ObjectId[];
  scheduledAt?: Date;
  sentAt?: Date;
  cancelledAt?: Date;
  metrics: ICampaignMetrics;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface INewsletterModel extends Model<INewsletter> {
  getCampaigns(options?: {
    status?: CampaignStatus;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{
    campaigns: INewsletter[];
    total: number;
    pagination: { page: number; limit: number; pages: number };
  }>;

  getById(id: string): Promise<INewsletter | null>;

  updateMetrics(id: string, metrics: Partial<ICampaignMetrics>): Promise<INewsletter | null>;

  getStats(): Promise<{
    total: number;
    draft: number;
    scheduled: number;
    sent: number;
    totalRecipients: number;
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
    recentCampaigns: INewsletter[];
  }>;
}

// Schema
const newsletterSchema = new Schema<INewsletter>(
  {
    subject: {
      ar: {
        type: String,
        required: [true, 'Arabic subject is required | عنوان الحملة بالعربية مطلوب'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
      },
      en: {
        type: String,
        required: [true, 'English subject is required | عنوان الحملة بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
      },
    },
    preheader: {
      ar: {
        type: String,
        trim: true,
        maxlength: [150, 'Preheader cannot exceed 150 characters'],
      },
      en: {
        type: String,
        trim: true,
        maxlength: [150, 'Preheader cannot exceed 150 characters'],
      },
    },
    content: {
      ar: {
        type: String,
        required: [true, 'Arabic content is required | محتوى الحملة بالعربية مطلوب'],
      },
      en: {
        type: String,
        required: [true, 'English content is required | محتوى الحملة بالإنجليزية مطلوب'],
      },
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
      default: 'draft',
    },
    recipientType: {
      type: String,
      enum: ['all', 'tags', 'specific'],
      default: 'all',
    },
    recipientTags: [
      {
        type: String,
        trim: true,
      },
    ],
    recipientIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subscriber',
      },
    ],
    scheduledAt: Date,
    sentAt: Date,
    cancelledAt: Date,
    metrics: {
      recipientCount: { type: Number, default: 0 },
      sentCount: { type: Number, default: 0 },
      openCount: { type: Number, default: 0 },
      clickCount: { type: Number, default: 0 },
      bounceCount: { type: Number, default: 0 },
      unsubscribeCount: { type: Number, default: 0 },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ scheduledAt: 1 });
newsletterSchema.index({ sentAt: -1 });
newsletterSchema.index({ createdAt: -1 });
newsletterSchema.index({ 'subject.ar': 'text', 'subject.en': 'text' });

// Static: Get campaigns with filtering and pagination
newsletterSchema.statics.getCampaigns = async function (
  options: {
    status?: CampaignStatus;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}
): Promise<{
  campaigns: INewsletter[];
  total: number;
  pagination: { page: number; limit: number; pages: number };
}> {
  const { status, search, page = 1, limit = 20, sort = '-createdAt' } = options;

  // Build query
  const query: Record<string, unknown> = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { 'subject.ar': { $regex: search, $options: 'i' } },
      { 'subject.en': { $regex: search, $options: 'i' } },
    ];
  }

  // Get total and campaigns
  const [campaigns, total] = await Promise.all([
    this.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    campaigns,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Static: Get by ID
newsletterSchema.statics.getById = async function (id: string): Promise<INewsletter | null> {
  return this.findById(id).populate('createdBy', 'name email').populate('updatedBy', 'name email');
};

// Static: Update metrics
newsletterSchema.statics.updateMetrics = async function (
  id: string,
  metrics: Partial<ICampaignMetrics>
): Promise<INewsletter | null> {
  const updateOps: Record<string, number> = {};

  if (metrics.sentCount !== undefined) updateOps['metrics.sentCount'] = metrics.sentCount;
  if (metrics.openCount !== undefined) updateOps['metrics.openCount'] = metrics.openCount;
  if (metrics.clickCount !== undefined) updateOps['metrics.clickCount'] = metrics.clickCount;
  if (metrics.bounceCount !== undefined) updateOps['metrics.bounceCount'] = metrics.bounceCount;
  if (metrics.unsubscribeCount !== undefined)
    updateOps['metrics.unsubscribeCount'] = metrics.unsubscribeCount;
  if (metrics.recipientCount !== undefined)
    updateOps['metrics.recipientCount'] = metrics.recipientCount;

  return this.findByIdAndUpdate(id, { $inc: updateOps }, { new: true });
};

// Static: Get statistics
newsletterSchema.statics.getStats = async function (): Promise<{
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
  totalRecipients: number;
  totalOpens: number;
  totalClicks: number;
  averageOpenRate: number;
  averageClickRate: number;
  recentCampaigns: INewsletter[];
}> {
  const [total, draft, scheduled, sent, metricsAgg, recentCampaigns] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ status: 'draft' }),
    this.countDocuments({ status: 'scheduled' }),
    this.countDocuments({ status: 'sent' }),
    this.aggregate([
      { $match: { status: 'sent' } },
      {
        $group: {
          _id: null,
          totalRecipients: { $sum: '$metrics.recipientCount' },
          totalSent: { $sum: '$metrics.sentCount' },
          totalOpens: { $sum: '$metrics.openCount' },
          totalClicks: { $sum: '$metrics.clickCount' },
        },
      },
    ]),
    this.find()
      .sort('-createdAt')
      .limit(5)
      .select('subject status metrics createdAt sentAt')
      .lean(),
  ]);

  const metrics = metricsAgg[0] || {
    totalRecipients: 0,
    totalSent: 0,
    totalOpens: 0,
    totalClicks: 0,
  };

  // Calculate average rates
  const averageOpenRate =
    metrics.totalSent > 0 ? Math.round((metrics.totalOpens / metrics.totalSent) * 100) : 0;
  const averageClickRate =
    metrics.totalOpens > 0 ? Math.round((metrics.totalClicks / metrics.totalOpens) * 100) : 0;

  return {
    total,
    draft,
    scheduled,
    sent,
    totalRecipients: metrics.totalRecipients,
    totalOpens: metrics.totalOpens,
    totalClicks: metrics.totalClicks,
    averageOpenRate,
    averageClickRate,
    recentCampaigns,
  };
};

export const Newsletter = mongoose.model<INewsletter, INewsletterModel>(
  'Newsletter',
  newsletterSchema
);
export default Newsletter;
