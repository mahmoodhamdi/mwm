/**
 * SiteContent Model (CMS)
 * نموذج محتوى الموقع
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Content types
 * أنواع المحتوى
 */
export type ContentType =
  | 'text'
  | 'html'
  | 'image'
  | 'video'
  | 'array'
  | 'object'
  | 'number'
  | 'boolean';

/**
 * SiteContent interface
 * واجهة محتوى الموقع
 */
export interface ISiteContent extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  type: ContentType;
  content: {
    ar: unknown;
    en: unknown;
  };
  section: string;
  description?: string;
  order: number;
  isActive: boolean;
  isSystem: boolean;
  metadata?: {
    imageAlt?: { ar: string; en: string };
    link?: string;
    target?: '_self' | '_blank';
    cssClass?: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SiteContent schema
 * مخطط محتوى الموقع
 */
const siteContentSchema = new Schema<ISiteContent>(
  {
    key: {
      type: String,
      required: [true, 'Content key is required | مفتاح المحتوى مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9_.]+$/,
        'Key must contain only lowercase letters, numbers, underscores, and dots | المفتاح يجب أن يحتوي فقط على أحرف صغيرة وأرقام وشرطات سفلية ونقاط',
      ],
    },

    type: {
      type: String,
      required: [true, 'Content type is required | نوع المحتوى مطلوب'],
      enum: {
        values: ['text', 'html', 'image', 'video', 'array', 'object', 'number', 'boolean'],
        message: 'Invalid content type | نوع المحتوى غير صالح',
      },
      default: 'text',
    },

    content: {
      ar: { type: Schema.Types.Mixed, default: '' },
      en: { type: Schema.Types.Mixed, default: '' },
    },

    section: {
      type: String,
      required: [true, 'Section is required | القسم مطلوب'],
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        500,
        'Description cannot exceed 500 characters | الوصف لا يمكن أن يتجاوز 500 حرف',
      ],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },

    metadata: {
      imageAlt: {
        ar: { type: String, default: '' },
        en: { type: String, default: '' },
      },
      link: { type: String },
      target: {
        type: String,
        enum: ['_self', '_blank'],
        default: '_self',
      },
      cssClass: { type: String },
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
    collection: 'site_content',
  }
);

// Indexes (key index is created by unique: true on the field)
siteContentSchema.index({ section: 1, order: 1 });
siteContentSchema.index({ isActive: 1 });

/**
 * Get content by key
 * جلب المحتوى بالمفتاح
 */
siteContentSchema.statics.getByKey = async function (
  key: string,
  locale?: 'ar' | 'en'
): Promise<ISiteContent | null> {
  const content = await this.findOne({ key, isActive: true });
  if (!content) return null;

  if (locale) {
    return {
      ...content.toObject(),
      content: content.content[locale],
    };
  }

  return content;
};

/**
 * Get all content for a section
 * جلب كل المحتوى لقسم معين
 */
siteContentSchema.statics.getBySection = async function (
  section: string,
  locale?: 'ar' | 'en'
): Promise<ISiteContent[]> {
  const contents = await this.find({ section, isActive: true }).sort({ order: 1 });

  if (locale) {
    return contents.map((content: ISiteContent) => ({
      ...content.toObject(),
      content: content.content[locale],
    }));
  }

  return contents;
};

/**
 * Upsert content
 * إدراج أو تحديث المحتوى
 */
siteContentSchema.statics.upsertContent = async function (
  key: string,
  data: Partial<ISiteContent>
): Promise<ISiteContent> {
  const content = await this.findOneAndUpdate(
    { key },
    { $set: { ...data, key } },
    { new: true, upsert: true, runValidators: true }
  );
  return content;
};

/**
 * Bulk upsert contents
 * إدراج أو تحديث متعدد للمحتوى
 */
siteContentSchema.statics.bulkUpsert = async function (
  contents: Array<{ key: string; data: Partial<ISiteContent> }>
): Promise<ISiteContent[]> {
  const operations = contents.map(({ key, data }) => ({
    updateOne: {
      filter: { key },
      update: { $set: { ...data, key } },
      upsert: true,
    },
  }));

  await this.bulkWrite(operations);

  const keys = contents.map(c => c.key);
  return this.find({ key: { $in: keys } });
};

export interface ISiteContentModel extends mongoose.Model<ISiteContent> {
  getByKey(key: string, locale?: 'ar' | 'en'): Promise<ISiteContent | null>;
  getBySection(section: string, locale?: 'ar' | 'en'): Promise<ISiteContent[]>;
  upsertContent(key: string, data: Partial<ISiteContent>): Promise<ISiteContent>;
  bulkUpsert(
    contents: Array<{ key: string; data: Partial<ISiteContent> }>
  ): Promise<ISiteContent[]>;
}

export const SiteContent = mongoose.model<ISiteContent, ISiteContentModel>(
  'SiteContent',
  siteContentSchema
);
export default SiteContent;
