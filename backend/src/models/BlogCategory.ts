/**
 * Blog Category Model
 * نموذج فئة المدونة
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
 * Blog Category interface
 * واجهة فئة المدونة
 */
export interface IBlogCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: IBilingual;
  slug: string;
  description?: IBilingual;
  image?: string;
  parent?: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  postCount?: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Category schema
 * مخطط فئة المدونة
 */
const blogCategorySchema = new Schema<IBlogCategory>(
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

    image: {
      type: String,
      trim: true,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory',
      default: null,
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
    collection: 'blogcategories',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
blogCategorySchema.index({ isActive: 1, order: 1 });
blogCategorySchema.index({ parent: 1 });
blogCategorySchema.index({ 'name.ar': 'text', 'name.en': 'text' });

// Virtual for post count
blogCategorySchema.virtual('postCount', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

/**
 * Get active categories
 * جلب الفئات النشطة
 */
blogCategorySchema.statics.getActiveCategories = async function (
  locale?: 'ar' | 'en'
): Promise<IBlogCategory[]> {
  const categories = await this.find({ isActive: true }).sort({ order: 1 }).populate('postCount');

  if (locale) {
    return categories.map((category: IBlogCategory) => ({
      ...category.toObject(),
      name: category.name[locale],
      description: category.description?.[locale],
    }));
  }

  return categories;
};

/**
 * Get category by slug
 * جلب الفئة بالرابط المختصر
 */
blogCategorySchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IBlogCategory | null> {
  const category = await this.findOne({ slug, isActive: true }).populate('postCount');

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

export interface IBlogCategoryModel extends mongoose.Model<IBlogCategory> {
  getActiveCategories(locale?: 'ar' | 'en'): Promise<IBlogCategory[]>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IBlogCategory | null>;
}

export const BlogCategory = mongoose.model<IBlogCategory, IBlogCategoryModel>(
  'BlogCategory',
  blogCategorySchema
);

export default BlogCategory;
