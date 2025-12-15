/**
 * ServiceCategory Model
 * نموذج فئات الخدمات
 */

import mongoose, { Document, Schema } from 'mongoose';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type IBilingual = LocalizedString;

/**
 * ServiceCategory interface
 * واجهة فئة الخدمة
 */
export interface IServiceCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: IBilingual;
  slug: string;
  description?: IBilingual;
  icon?: string;
  image?: string;
  order: number;
  isActive: boolean;
  servicesCount?: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ServiceCategory schema
 * مخطط فئة الخدمة
 */
const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      ar: {
        type: String,
        required: [true, 'Arabic name is required | الاسم بالعربية مطلوب'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
      },
      en: {
        type: String,
        required: [true, 'English name is required | الاسم بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
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
        trim: true,
        maxlength: [
          500,
          'Description cannot exceed 500 characters | الوصف لا يمكن أن يتجاوز 500 حرف',
        ],
      },
      en: {
        type: String,
        trim: true,
        maxlength: [
          500,
          'Description cannot exceed 500 characters | الوصف لا يمكن أن يتجاوز 500 حرف',
        ],
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
    collection: 'service_categories',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (slug index is created by unique: true on the field)
serviceCategorySchema.index({ isActive: 1, order: 1 });
serviceCategorySchema.index({ 'name.ar': 'text', 'name.en': 'text' });

// Virtual for services count
serviceCategorySchema.virtual('servicesCount', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

/**
 * Get active categories
 * جلب الفئات النشطة
 */
serviceCategorySchema.statics.getActiveCategories = async function (
  locale?: 'ar' | 'en'
): Promise<IServiceCategory[]> {
  const categories = await this.find({ isActive: true })
    .sort({ order: 1 })
    .populate('servicesCount');

  if (locale) {
    return categories.map((cat: IServiceCategory) => ({
      ...cat.toObject(),
      name: cat.name[locale],
      description: cat.description?.[locale],
    }));
  }

  return categories;
};

/**
 * Get category by slug
 * جلب الفئة بالرابط المختصر
 */
serviceCategorySchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IServiceCategory | null> {
  const category = await this.findOne({ slug, isActive: true }).populate('servicesCount');

  if (!category) return null;

  if (locale) {
    return {
      ...category.toObject(),
      name: category.name[locale],
      description: category.description?.[locale],
    };
  }

  return category;
};

export interface IServiceCategoryModel extends mongoose.Model<IServiceCategory> {
  getActiveCategories(locale?: 'ar' | 'en'): Promise<IServiceCategory[]>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IServiceCategory | null>;
}

export const ServiceCategory = mongoose.model<IServiceCategory, IServiceCategoryModel>(
  'ServiceCategory',
  serviceCategorySchema
);

export default ServiceCategory;
