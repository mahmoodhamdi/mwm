/**
 * ProjectCategory Model
 * نموذج تصنيف المشاريع
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Bilingual content interface
 * واجهة المحتوى ثنائي اللغة
 */
interface IBilingual {
  ar: string;
  en: string;
}

export interface IProjectCategory extends Document {
  _id: mongoose.Types.ObjectId;
  /** Category name in Arabic and English */
  name: IBilingual;
  /** URL-friendly slug (unique) */
  slug: string;
  /** Category description */
  description?: IBilingual;
  /** Category icon name */
  icon?: string;
  /** Category image URL */
  image?: string;
  /** Display order */
  order: number;
  /** Whether category is active */
  isActive: boolean;
  /** Number of projects in this category (virtual) */
  projectsCount?: number;
  /** Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectCategoryModel extends Model<IProjectCategory> {
  /** Get all active categories ordered by order field */
  getActiveCategories(): Promise<IProjectCategory[]>;
  /** Get category by slug */
  getBySlug(slug: string): Promise<IProjectCategory | null>;
}

const projectCategorySchema = new Schema<IProjectCategory, IProjectCategoryModel>(
  {
    name: {
      ar: {
        type: String,
        required: [true, 'Arabic name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      ar: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
      },
      en: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
      },
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectCategorySchema.index({ isActive: 1, order: 1 });

// Virtual for projects count
projectCategorySchema.virtual('projectsCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Static methods
projectCategorySchema.statics.getActiveCategories = async function (): Promise<IProjectCategory[]> {
  return this.find({ isActive: true }).sort({ order: 1 });
};

projectCategorySchema.statics.getBySlug = async function (
  slug: string
): Promise<IProjectCategory | null> {
  return this.findOne({ slug, isActive: true });
};

export const ProjectCategory = mongoose.model<IProjectCategory, IProjectCategoryModel>(
  'ProjectCategory',
  projectCategorySchema
);
export default ProjectCategory;
