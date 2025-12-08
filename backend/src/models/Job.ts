/**
 * Job Model
 * نموذج الوظيفة
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Bilingual content interface
 * واجهة المحتوى ثنائي اللغة
 */
interface IBilingual {
  ar: string;
  en: string;
}

/**
 * Salary range interface
 * واجهة نطاق الراتب
 */
interface ISalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  isPublic: boolean;
}

/**
 * Job type
 * نوع الوظيفة
 */
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';

/**
 * Experience level
 * مستوى الخبرة
 */
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

/**
 * Job status
 * حالة الوظيفة
 */
export type JobStatus = 'draft' | 'open' | 'closed' | 'filled';

/**
 * Job interface
 * واجهة الوظيفة
 */
export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: IBilingual;
  slug: string;
  description: IBilingual;
  requirements: IBilingual[];
  responsibilities: IBilingual[];
  benefits: IBilingual[];
  department: mongoose.Types.ObjectId;
  location: IBilingual;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: ISalaryRange;
  skills: string[];
  status: JobStatus;
  applicationDeadline?: Date;
  applicationsCount: number;
  isFeatured: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Job schema
 * مخطط الوظيفة
 */
const jobSchema = new Schema<IJob>(
  {
    title: {
      ar: {
        type: String,
        required: [true, 'Arabic title is required | العنوان بالعربية مطلوب'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters | العنوان لا يمكن أن يتجاوز 200 حرف'],
      },
      en: {
        type: String,
        required: [true, 'English title is required | العنوان بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters | العنوان لا يمكن أن يتجاوز 200 حرف'],
      },
    },

    slug: {
      type: String,
      required: [true, 'Slug is required | الرابط المختصر مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be URL-friendly | الرابط المختصر يجب أن يكون صالحاً للعناوين',
      ],
    },

    description: {
      ar: {
        type: String,
        required: [true, 'Arabic description is required | الوصف بالعربية مطلوب'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English description is required | الوصف بالإنجليزية مطلوب'],
        trim: true,
      },
    },

    requirements: [
      {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
    ],

    responsibilities: [
      {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
    ],

    benefits: [
      {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
    ],

    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required | القسم مطلوب'],
      index: true,
    },

    location: {
      ar: {
        type: String,
        required: [true, 'Arabic location is required | الموقع بالعربية مطلوب'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English location is required | الموقع بالإنجليزية مطلوب'],
        trim: true,
      },
    },

    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      required: [true, 'Job type is required | نوع الوظيفة مطلوب'],
      index: true,
    },

    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      required: [true, 'Experience level is required | مستوى الخبرة مطلوب'],
      index: true,
    },

    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'SAR' },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'monthly',
      },
      isPublic: { type: Boolean, default: false },
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'filled'],
      default: 'draft',
      index: true,
    },

    applicationDeadline: {
      type: Date,
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'jobs',
  }
);

// Indexes
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ department: 1, status: 1 });
jobSchema.index({ type: 1, status: 1 });
jobSchema.index({ isFeatured: 1, status: 1 });
jobSchema.index({
  'title.ar': 'text',
  'title.en': 'text',
  'description.ar': 'text',
  'description.en': 'text',
});

/**
 * Get open jobs
 * جلب الوظائف المفتوحة
 */
jobSchema.statics.getOpenJobs = async function (
  options: {
    department?: string;
    type?: JobType;
    experienceLevel?: ExperienceLevel;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  } = {}
): Promise<{ jobs: IJob[]; total: number }> {
  const {
    department,
    type,
    experienceLevel,
    locale,
    featured,
    limit = 10,
    page = 1,
    search,
  } = options;

  const filter: Record<string, unknown> = {
    status: 'open',
    $or: [{ applicationDeadline: { $gte: new Date() } }, { applicationDeadline: null }],
  };

  if (department) filter.department = department;
  if (type) filter.type = type;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (featured !== undefined) filter.isFeatured = featured;
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  const jobs = await this.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('department', 'name slug');

  if (locale) {
    const localizedJobs = jobs.map((job: IJob) => ({
      ...job.toObject(),
      title: job.title[locale],
      description: job.description[locale],
      location: job.location[locale],
      requirements: job.requirements?.map(r => r[locale]),
      responsibilities: job.responsibilities?.map(r => r[locale]),
      benefits: job.benefits?.map(b => b[locale]),
    }));
    return { jobs: localizedJobs, total };
  }

  return { jobs, total };
};

/**
 * Get job by slug
 * جلب الوظيفة بالرابط المختصر
 */
jobSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IJob | null> {
  const job = await this.findOne({
    slug,
    status: 'open',
    $or: [{ applicationDeadline: { $gte: new Date() } }, { applicationDeadline: null }],
  }).populate('department', 'name slug');

  if (!job) return null;

  if (locale) {
    return {
      ...job.toObject(),
      title: job.title[locale],
      description: job.description[locale],
      location: job.location[locale],
      requirements: job.requirements?.map((r: IBilingual) => r[locale]),
      responsibilities: job.responsibilities?.map((r: IBilingual) => r[locale]),
      benefits: job.benefits?.map((b: IBilingual) => b[locale]),
    };
  }

  return job;
};

/**
 * Get featured jobs
 * جلب الوظائف المميزة
 */
jobSchema.statics.getFeaturedJobs = async function (
  limit = 5,
  locale?: 'ar' | 'en'
): Promise<IJob[]> {
  const jobs = await this.find({
    status: 'open',
    isFeatured: true,
    $or: [{ applicationDeadline: { $gte: new Date() } }, { applicationDeadline: null }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('department', 'name slug');

  if (locale) {
    return jobs.map((job: IJob) => ({
      ...job.toObject(),
      title: job.title[locale],
      description: job.description[locale],
      location: job.location[locale],
    }));
  }

  return jobs;
};

/**
 * Increment applications count
 * زيادة عدد الطلبات
 */
jobSchema.statics.incrementApplicationsCount = async function (jobId: string): Promise<void> {
  await this.updateOne({ _id: jobId }, { $inc: { applicationsCount: 1 } });
};

export interface IJobModel extends mongoose.Model<IJob> {
  getOpenJobs(options?: {
    department?: string;
    type?: JobType;
    experienceLevel?: ExperienceLevel;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{ jobs: IJob[]; total: number }>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IJob | null>;
  getFeaturedJobs(limit?: number, locale?: 'ar' | 'en'): Promise<IJob[]>;
  incrementApplicationsCount(jobId: string): Promise<void>;
}

export const Job = mongoose.model<IJob, IJobModel>('Job', jobSchema);

export default Job;
