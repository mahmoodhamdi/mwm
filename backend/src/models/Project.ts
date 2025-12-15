/**
 * Project Model
 * نموذج المشروع
 */

import mongoose, { Document, Model, Schema } from 'mongoose';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type IBilingual = LocalizedString;

/**
 * SEO fields interface
 * واجهة حقول SEO
 */
interface ISEOFields {
  title?: IBilingual;
  description?: IBilingual;
  keywords?: {
    ar: string[];
    en: string[];
  };
  ogImage?: string;
}

// Client info interface
export interface IProjectClient {
  /** Client name */
  name: IBilingual;
  /** Client logo URL */
  logo?: string;
  /** Client website */
  website?: string;
}

// Testimonial interface
export interface IProjectTestimonial {
  /** Testimonial text */
  text: IBilingual;
  /** Author name */
  author: IBilingual;
  /** Author position */
  position: IBilingual;
  /** Author photo */
  photo?: string;
}

// Technology interface
export interface IProjectTechnology {
  /** Technology name */
  name: string;
  /** Technology icon */
  icon?: string;
  /** Technology category (frontend, backend, database, etc.) */
  category?: string;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  /** Project title */
  title: IBilingual;
  /** URL-friendly slug (unique) */
  slug: string;
  /** Short description for cards */
  shortDescription: IBilingual;
  /** Full description */
  description: IBilingual;
  /** Challenge/problem statement */
  challenge?: IBilingual;
  /** Solution provided */
  solution?: IBilingual;
  /** Results and outcomes */
  results?: IBilingual;
  /** Thumbnail image URL */
  thumbnail: string;
  /** Gallery images */
  images: string[];
  /** Video URL */
  video?: string;
  /** Project category */
  category: mongoose.Types.ObjectId;
  /** Technologies used */
  technologies: IProjectTechnology[];
  /** Client information */
  client?: IProjectClient;
  /** Client testimonial */
  testimonial?: IProjectTestimonial;
  /** Live project URL */
  liveUrl?: string;
  /** GitHub repository URL */
  githubUrl?: string;
  /** Project duration */
  duration?: string;
  /** Completion date */
  completedAt?: Date;
  /** SEO fields */
  seo: ISEOFields;
  /** Is featured project */
  isFeatured: boolean;
  /** Is published */
  isPublished: boolean;
  /** Display order */
  order: number;
  /** View count */
  views: number;
  /** Created by user */
  createdBy?: mongoose.Types.ObjectId;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectModel extends Model<IProject> {
  /** Get all published projects */
  getPublishedProjects(
    page?: number,
    limit?: number,
    category?: string,
    technology?: string
  ): Promise<{ projects: IProject[]; total: number; totalPages: number }>;
  /** Get project by slug */
  getBySlug(slug: string): Promise<IProject | null>;
  /** Get featured projects */
  getFeaturedProjects(limit?: number): Promise<IProject[]>;
  /** Increment view count */
  incrementViews(id: mongoose.Types.ObjectId): Promise<void>;
}

const projectSchema = new Schema<IProject, IProjectModel>(
  {
    title: {
      ar: {
        type: String,
        required: [true, 'Arabic title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
      },
      en: {
        type: String,
        required: [true, 'English title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
      },
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      ar: {
        type: String,
        required: [true, 'Arabic short description is required'],
        trim: true,
        maxlength: [300, 'Short description cannot exceed 300 characters'],
      },
      en: {
        type: String,
        required: [true, 'English short description is required'],
        trim: true,
        maxlength: [300, 'Short description cannot exceed 300 characters'],
      },
    },
    description: {
      ar: {
        type: String,
        required: [true, 'Arabic description is required'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English description is required'],
        trim: true,
      },
    },
    challenge: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    solution: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    results: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    video: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ProjectCategory',
      required: [true, 'Category is required'],
      index: true,
    },
    technologies: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        icon: {
          type: String,
          trim: true,
        },
        category: {
          type: String,
          trim: true,
          enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'],
        },
      },
    ],
    client: {
      name: {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
      logo: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    testimonial: {
      text: {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
      author: {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
      position: {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
      photo: { type: String, trim: true },
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
    seo: {
      title: {
        ar: { type: String, trim: true, maxlength: 60 },
        en: { type: String, trim: true, maxlength: 60 },
      },
      description: {
        ar: { type: String, trim: true, maxlength: 160 },
        en: { type: String, trim: true, maxlength: 160 },
      },
      keywords: {
        ar: [{ type: String, trim: true }],
        en: [{ type: String, trim: true }],
      },
      ogImage: { type: String, trim: true },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ isPublished: 1, isFeatured: 1, order: 1 });
projectSchema.index({ isPublished: 1, createdAt: -1 });
projectSchema.index({ '$**': 'text' }); // Full-text search
projectSchema.index({ 'technologies.name': 1 });

// Static methods
projectSchema.statics.getPublishedProjects = async function (
  page = 1,
  limit = 12,
  category?: string,
  technology?: string
): Promise<{ projects: IProject[]; total: number; totalPages: number }> {
  const query: Record<string, unknown> = { isPublished: true };

  if (category) {
    const ProjectCategory = mongoose.model('ProjectCategory');
    const cat = await ProjectCategory.findOne({ slug: category });
    if (cat) {
      query.category = cat._id;
    }
  }

  if (technology) {
    query['technologies.name'] = { $regex: technology, $options: 'i' };
  }

  const total = await this.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const projects = await this.find(query)
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { projects, total, totalPages };
};

projectSchema.statics.getBySlug = async function (slug: string): Promise<IProject | null> {
  return this.findOne({ slug, isPublished: true }).populate('category', 'name slug');
};

projectSchema.statics.getFeaturedProjects = async function (limit = 6): Promise<IProject[]> {
  return this.find({ isPublished: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort({ order: 1 })
    .limit(limit);
};

projectSchema.statics.incrementViews = async function (id: mongoose.Types.ObjectId): Promise<void> {
  await this.findByIdAndUpdate(id, { $inc: { views: 1 } });
};

export const Project = mongoose.model<IProject, IProjectModel>('Project', projectSchema);
export default Project;
