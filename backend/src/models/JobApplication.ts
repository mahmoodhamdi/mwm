/**
 * Job Application Model
 * نموذج طلب التوظيف
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Application status type
 * نوع حالة الطلب
 */
export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'shortlisted'
  | 'interviewed'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

/**
 * Job Application interface
 * واجهة طلب التوظيف
 */
export interface IJobApplication extends Document {
  _id: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  linkedIn?: string;
  portfolio?: string;
  expectedSalary?: number;
  availableFrom?: Date;
  experience: number;
  education?: string;
  skills: string[];
  answers?: Record<string, string>;
  status: ApplicationStatus;
  notes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Job Application schema
 * مخطط طلب التوظيف
 */
const jobApplicationSchema = new Schema<IJobApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required | الوظيفة مطلوبة'],
      index: true,
    },

    firstName: {
      type: String,
      required: [true, 'First name is required | الاسم الأول مطلوب'],
      trim: true,
      maxlength: [
        50,
        'First name cannot exceed 50 characters | الاسم الأول لا يمكن أن يتجاوز 50 حرف',
      ],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required | اسم العائلة مطلوب'],
      trim: true,
      maxlength: [
        50,
        'Last name cannot exceed 50 characters | اسم العائلة لا يمكن أن يتجاوز 50 حرف',
      ],
    },

    email: {
      type: String,
      required: [true, 'Email is required | البريد الإلكتروني مطلوب'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح'],
      index: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone is required | رقم الهاتف مطلوب'],
      trim: true,
    },

    resume: {
      type: String,
      required: [true, 'Resume is required | السيرة الذاتية مطلوبة'],
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    linkedIn: {
      type: String,
      trim: true,
    },

    portfolio: {
      type: String,
      trim: true,
    },

    expectedSalary: {
      type: Number,
      min: [0, 'Expected salary cannot be negative | الراتب المتوقع لا يمكن أن يكون سالباً'],
    },

    availableFrom: {
      type: Date,
    },

    experience: {
      type: Number,
      required: [true, 'Experience is required | الخبرة مطلوبة'],
      min: [0, 'Experience cannot be negative | الخبرة لا يمكن أن تكون سالبة'],
    },

    education: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    answers: {
      type: Map,
      of: String,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'reviewing',
        'shortlisted',
        'interviewed',
        'offered',
        'hired',
        'rejected',
        'withdrawn',
      ],
      default: 'pending',
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    reviewedAt: {
      type: Date,
    },

    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1 | التقييم يجب أن يكون 1 على الأقل'],
      max: [5, 'Rating cannot exceed 5 | التقييم لا يمكن أن يتجاوز 5'],
    },
  },
  {
    timestamps: true,
    collection: 'jobapplications',
  }
);

// Indexes
jobApplicationSchema.index({ job: 1, status: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, job: 1 });
jobApplicationSchema.index({ status: 1, createdAt: -1 });

/**
 * Get applications by job
 * جلب الطلبات حسب الوظيفة
 */
jobApplicationSchema.statics.getByJob = async function (
  jobId: string,
  options: {
    status?: ApplicationStatus;
    limit?: number;
    page?: number;
  } = {}
): Promise<{ applications: IJobApplication[]; total: number }> {
  const { status, limit = 10, page = 1 } = options;

  const filter: Record<string, unknown> = { job: jobId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  const applications = await this.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('job', 'title slug')
    .populate('reviewedBy', 'name email');

  return { applications, total };
};

/**
 * Get application by ID with job details
 * جلب الطلب مع تفاصيل الوظيفة
 */
jobApplicationSchema.statics.getById = async function (
  applicationId: string
): Promise<IJobApplication | null> {
  return this.findById(applicationId)
    .populate('job', 'title slug department location type')
    .populate('reviewedBy', 'name email');
};

/**
 * Check if email already applied for job
 * التحقق مما إذا كان البريد قد تقدم بالفعل للوظيفة
 */
jobApplicationSchema.statics.hasApplied = async function (
  email: string,
  jobId: string
): Promise<boolean> {
  const count = await this.countDocuments({ email, job: jobId });
  return count > 0;
};

/**
 * Update application status
 * تحديث حالة الطلب
 */
jobApplicationSchema.statics.updateStatus = async function (
  applicationId: string,
  status: ApplicationStatus,
  reviewerId?: string,
  notes?: string
): Promise<IJobApplication | null> {
  const updateData: Record<string, unknown> = {
    status,
    reviewedAt: new Date(),
  };

  if (reviewerId) updateData.reviewedBy = reviewerId;
  if (notes) updateData.notes = notes;

  return this.findByIdAndUpdate(applicationId, updateData, { new: true })
    .populate('job', 'title slug')
    .populate('reviewedBy', 'name email');
};

/**
 * Get application statistics for a job
 * جلب إحصائيات الطلبات للوظيفة
 */
jobApplicationSchema.statics.getStatsByJob = async function (
  jobId: string
): Promise<Record<ApplicationStatus, number>> {
  const stats = await this.aggregate([
    { $match: { job: new mongoose.Types.ObjectId(jobId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const result: Record<string, number> = {
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    interviewed: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  };

  stats.forEach((stat: { _id: string; count: number }) => {
    result[stat._id] = stat.count;
  });

  return result as Record<ApplicationStatus, number>;
};

export interface IJobApplicationModel extends mongoose.Model<IJobApplication> {
  getByJob(
    jobId: string,
    options?: {
      status?: ApplicationStatus;
      limit?: number;
      page?: number;
    }
  ): Promise<{ applications: IJobApplication[]; total: number }>;
  getById(applicationId: string): Promise<IJobApplication | null>;
  hasApplied(email: string, jobId: string): Promise<boolean>;
  updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    reviewerId?: string,
    notes?: string
  ): Promise<IJobApplication | null>;
  getStatsByJob(jobId: string): Promise<Record<ApplicationStatus, number>>;
}

export const JobApplication = mongoose.model<IJobApplication, IJobApplicationModel>(
  'JobApplication',
  jobApplicationSchema
);

export default JobApplication;
