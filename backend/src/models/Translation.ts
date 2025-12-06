/**
 * Translation Model
 * نموذج الترجمة
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Translation interface
 * واجهة الترجمة
 */
export interface ITranslation extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  namespace: string;
  translations: {
    ar: string;
    en: string;
    [locale: string]: string;
  };
  description?: string;
  isSystem: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Translation schema
 * مخطط الترجمة
 */
const translationSchema = new Schema<ITranslation>(
  {
    key: {
      type: String,
      required: [true, 'Translation key is required | مفتاح الترجمة مطلوب'],
      trim: true,
      match: [
        /^[a-zA-Z0-9_.]+$/,
        'Key must contain only letters, numbers, underscores, and dots | المفتاح يجب أن يحتوي فقط على أحرف وأرقام وشرطات سفلية ونقاط',
      ],
    },

    namespace: {
      type: String,
      required: [true, 'Namespace is required | مساحة الاسم مطلوبة'],
      trim: true,
      lowercase: true,
      index: true,
      enum: {
        values: [
          'common',
          'home',
          'about',
          'services',
          'portfolio',
          'team',
          'blog',
          'contact',
          'careers',
          'admin',
          'auth',
          'errors',
          'validation',
        ],
        message: 'Invalid namespace | مساحة الاسم غير صالحة',
      },
    },

    translations: {
      ar: {
        type: String,
        required: [true, 'Arabic translation is required | الترجمة العربية مطلوبة'],
      },
      en: {
        type: String,
        required: [true, 'English translation is required | الترجمة الإنجليزية مطلوبة'],
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        500,
        'Description cannot exceed 500 characters | الوصف لا يمكن أن يتجاوز 500 حرف',
      ],
    },

    isSystem: {
      type: Boolean,
      default: false,
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
    collection: 'translations',
  }
);

// Compound unique index for key + namespace
translationSchema.index({ key: 1, namespace: 1 }, { unique: true });

/**
 * Get translations by namespace and locale
 * جلب الترجمات حسب مساحة الاسم واللغة
 */
translationSchema.statics.getByNamespace = async function (
  namespace: string,
  locale: 'ar' | 'en' = 'ar'
): Promise<Record<string, string>> {
  const translations = await this.find({ namespace });
  const result: Record<string, string> = {};

  translations.forEach((t: ITranslation) => {
    result[t.key] = t.translations[locale] || t.translations.ar;
  });

  return result;
};

/**
 * Get all translations for a locale
 * جلب كل الترجمات للغة معينة
 */
translationSchema.statics.getAllByLocale = async function (
  locale: 'ar' | 'en' = 'ar'
): Promise<Record<string, Record<string, string>>> {
  const translations = await this.find({});
  const result: Record<string, Record<string, string>> = {};

  translations.forEach((t: ITranslation) => {
    if (!result[t.namespace]) {
      result[t.namespace] = {};
    }
    result[t.namespace][t.key] = t.translations[locale] || t.translations.ar;
  });

  return result;
};

/**
 * Upsert translation
 * إدراج أو تحديث الترجمة
 */
translationSchema.statics.upsertTranslation = async function (
  key: string,
  namespace: string,
  translations: { ar: string; en: string },
  options?: { description?: string; isSystem?: boolean; updatedBy?: mongoose.Types.ObjectId }
): Promise<ITranslation> {
  const translation = await this.findOneAndUpdate(
    { key, namespace },
    {
      $set: {
        key,
        namespace,
        translations,
        ...options,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
  return translation;
};

/**
 * Bulk upsert translations
 * إدراج أو تحديث متعدد للترجمات
 */
translationSchema.statics.bulkUpsert = async function (
  items: Array<{
    key: string;
    namespace: string;
    translations: { ar: string; en: string };
    description?: string;
    isSystem?: boolean;
  }>
): Promise<ITranslation[]> {
  const operations = items.map(item => ({
    updateOne: {
      filter: { key: item.key, namespace: item.namespace },
      update: { $set: item },
      upsert: true,
    },
  }));

  await this.bulkWrite(operations);

  return this.find({
    $or: items.map(item => ({ key: item.key, namespace: item.namespace })),
  });
};

/**
 * Search translations
 * البحث في الترجمات
 */
translationSchema.statics.search = async function (
  query: string,
  options?: { namespace?: string; locale?: 'ar' | 'en'; limit?: number }
): Promise<ITranslation[]> {
  const { namespace, locale = 'ar', limit = 50 } = options || {};

  const filter: Record<string, unknown> = {
    $or: [
      { key: { $regex: query, $options: 'i' } },
      { [`translations.${locale}`]: { $regex: query, $options: 'i' } },
    ],
  };

  if (namespace) {
    filter.namespace = namespace;
  }

  return this.find(filter).limit(limit);
};

export interface ITranslationModel extends mongoose.Model<ITranslation> {
  getByNamespace(namespace: string, locale?: 'ar' | 'en'): Promise<Record<string, string>>;
  getAllByLocale(locale?: 'ar' | 'en'): Promise<Record<string, Record<string, string>>>;
  upsertTranslation(
    key: string,
    namespace: string,
    translations: { ar: string; en: string },
    options?: { description?: string; isSystem?: boolean; updatedBy?: mongoose.Types.ObjectId }
  ): Promise<ITranslation>;
  bulkUpsert(
    items: Array<{
      key: string;
      namespace: string;
      translations: { ar: string; en: string };
      description?: string;
      isSystem?: boolean;
    }>
  ): Promise<ITranslation[]>;
  search(
    query: string,
    options?: { namespace?: string; locale?: 'ar' | 'en'; limit?: number }
  ): Promise<ITranslation[]>;
}

export const Translation = mongoose.model<ITranslation, ITranslationModel>(
  'Translation',
  translationSchema
);
export default Translation;
