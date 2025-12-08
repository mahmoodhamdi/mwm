/**
 * Department Model
 * نموذج القسم
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
 * Department interface
 * واجهة القسم
 */
export interface IDepartment extends Document {
  _id: mongoose.Types.ObjectId;
  name: IBilingual;
  slug: string;
  description?: IBilingual;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Department schema
 * مخطط القسم
 */
const departmentSchema = new Schema<IDepartment>(
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

    color: {
      type: String,
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color'],
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
    collection: 'departments',
  }
);

// Indexes (slug index is created by unique: true on the field)
departmentSchema.index({ isActive: 1, order: 1 });

/**
 * Get active departments
 * جلب الأقسام النشطة
 */
departmentSchema.statics.getActiveDepartments = async function (
  locale?: 'ar' | 'en'
): Promise<IDepartment[]> {
  const departments = await this.find({ isActive: true }).sort({ order: 1 });

  if (locale) {
    return departments.map((dept: IDepartment) => ({
      ...dept.toObject(),
      name: dept.name[locale],
      description: dept.description?.[locale],
    }));
  }

  return departments;
};

/**
 * Get department by slug
 * جلب القسم بالرابط المختصر
 */
departmentSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IDepartment | null> {
  const department = await this.findOne({ slug, isActive: true });

  if (!department) return null;

  if (locale) {
    return {
      ...department.toObject(),
      name: department.name[locale],
      description: department.description?.[locale],
    };
  }

  return department;
};

export interface IDepartmentModel extends mongoose.Model<IDepartment> {
  getActiveDepartments(locale?: 'ar' | 'en'): Promise<IDepartment[]>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IDepartment | null>;
}

export const Department = mongoose.model<IDepartment, IDepartmentModel>(
  'Department',
  departmentSchema
);

export default Department;
