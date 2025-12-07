/**
 * Service Model
 * نموذج الخدمة
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
 * Service feature interface
 * واجهة ميزة الخدمة
 */
export interface IServiceFeature {
  title: IBilingual;
  description?: IBilingual;
  icon?: string;
}

/**
 * Pricing plan interface
 * واجهة خطة الأسعار
 */
export interface IPricingPlan {
  name: IBilingual;
  description?: IBilingual;
  price: number;
  currency: string;
  period?: 'monthly' | 'yearly' | 'one-time' | 'custom';
  periodLabel?: IBilingual;
  features: IBilingual[];
  isPopular?: boolean;
  ctaText?: IBilingual;
  ctaLink?: string;
  order: number;
}

/**
 * FAQ item interface
 * واجهة عنصر الأسئلة الشائعة
 */
export interface IFAQItem {
  question: IBilingual;
  answer: IBilingual;
  order: number;
}

/**
 * Process step interface
 * واجهة خطوة العملية
 */
export interface IProcessStep {
  title: IBilingual;
  description: IBilingual;
  icon?: string;
  order: number;
}

/**
 * Service interface
 * واجهة الخدمة
 */
export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  title: IBilingual;
  slug: string;
  shortDescription: IBilingual;
  description: IBilingual;
  category: mongoose.Types.ObjectId;
  icon?: string;
  image?: string;
  gallery?: string[];
  features: IServiceFeature[];
  pricingPlans?: IPricingPlan[];
  faqs?: IFAQItem[];
  processSteps?: IProcessStep[];
  technologies?: string[];
  relatedServices?: mongoose.Types.ObjectId[];
  seo?: {
    metaTitle?: IBilingual;
    metaDescription?: IBilingual;
    keywords?: string[];
  };
  order: number;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service schema
 * مخطط الخدمة
 */
const serviceSchema = new Schema<IService>(
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

    shortDescription: {
      ar: {
        type: String,
        required: [true, 'Arabic short description is required | الوصف المختصر بالعربية مطلوب'],
        trim: true,
        maxlength: [
          300,
          'Short description cannot exceed 300 characters | الوصف المختصر لا يمكن أن يتجاوز 300 حرف',
        ],
      },
      en: {
        type: String,
        required: [true, 'English short description is required | الوصف المختصر بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [
          300,
          'Short description cannot exceed 300 characters | الوصف المختصر لا يمكن أن يتجاوز 300 حرف',
        ],
      },
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

    category: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: [true, 'Category is required | الفئة مطلوبة'],
      index: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    features: [
      {
        title: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        description: {
          ar: { type: String, trim: true },
          en: { type: String, trim: true },
        },
        icon: { type: String, trim: true },
      },
    ],

    pricingPlans: [
      {
        name: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        description: {
          ar: { type: String, trim: true },
          en: { type: String, trim: true },
        },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'SAR' },
        period: {
          type: String,
          enum: ['monthly', 'yearly', 'one-time', 'custom'],
          default: 'one-time',
        },
        periodLabel: {
          ar: { type: String, trim: true },
          en: { type: String, trim: true },
        },
        features: [
          {
            ar: { type: String, trim: true },
            en: { type: String, trim: true },
          },
        ],
        isPopular: { type: Boolean, default: false },
        ctaText: {
          ar: { type: String, trim: true },
          en: { type: String, trim: true },
        },
        ctaLink: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],

    faqs: [
      {
        question: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        answer: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        order: { type: Number, default: 0 },
      },
    ],

    processSteps: [
      {
        title: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        description: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        icon: { type: String, trim: true },
        order: { type: Number, default: 0 },
      },
    ],

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    relatedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],

    seo: {
      metaTitle: {
        ar: { type: String, trim: true, maxlength: 60 },
        en: { type: String, trim: true, maxlength: 60 },
      },
      metaDescription: {
        ar: { type: String, trim: true, maxlength: 160 },
        en: { type: String, trim: true, maxlength: 160 },
      },
      keywords: [{ type: String, trim: true }],
    },

    order: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    viewCount: {
      type: Number,
      default: 0,
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
    collection: 'services',
  }
);

// Indexes
serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ category: 1, isActive: 1, order: 1 });
serviceSchema.index({ isActive: 1, isFeatured: 1 });
serviceSchema.index({
  'title.ar': 'text',
  'title.en': 'text',
  'shortDescription.ar': 'text',
  'shortDescription.en': 'text',
});

/**
 * Get active services
 * جلب الخدمات النشطة
 */
serviceSchema.statics.getActiveServices = async function (
  options: {
    category?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
  } = {}
): Promise<{ services: IService[]; total: number }> {
  const { category, locale, featured, limit = 10, page = 1 } = options;

  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;
  if (featured !== undefined) filter.isFeatured = featured;

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  const services = await this.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug');

  if (locale) {
    const localizedServices = services.map((service: IService) => ({
      ...service.toObject(),
      title: service.title[locale],
      shortDescription: service.shortDescription[locale],
      description: service.description[locale],
      features: service.features?.map(f => ({
        ...f,
        title: f.title[locale],
        description: f.description?.[locale],
      })),
    }));
    return { services: localizedServices, total };
  }

  return { services, total };
};

/**
 * Get service by slug
 * جلب الخدمة بالرابط المختصر
 */
serviceSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IService | null> {
  const service = await this.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .populate('relatedServices', 'title slug image shortDescription');

  if (!service) return null;

  // Increment view count
  await this.updateOne({ _id: service._id }, { $inc: { viewCount: 1 } });

  if (locale) {
    return {
      ...service.toObject(),
      title: service.title[locale],
      shortDescription: service.shortDescription[locale],
      description: service.description[locale],
      features: service.features?.map((f: IServiceFeature) => ({
        ...f,
        title: f.title[locale],
        description: f.description?.[locale],
      })),
      pricingPlans: service.pricingPlans?.map((p: IPricingPlan) => ({
        ...p,
        name: p.name[locale],
        description: p.description?.[locale],
        periodLabel: p.periodLabel?.[locale],
        features: p.features?.map((f: IBilingual) => f[locale]),
        ctaText: p.ctaText?.[locale],
      })),
      faqs: service.faqs?.map((f: IFAQItem) => ({
        ...f,
        question: f.question[locale],
        answer: f.answer[locale],
      })),
      processSteps: service.processSteps?.map((s: IProcessStep) => ({
        ...s,
        title: s.title[locale],
        description: s.description[locale],
      })),
      seo: service.seo
        ? {
            ...service.seo,
            metaTitle: service.seo.metaTitle?.[locale],
            metaDescription: service.seo.metaDescription?.[locale],
          }
        : undefined,
    };
  }

  return service;
};

/**
 * Get featured services
 * جلب الخدمات المميزة
 */
serviceSchema.statics.getFeaturedServices = async function (
  limit = 6,
  locale?: 'ar' | 'en'
): Promise<IService[]> {
  const services = await this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(limit)
    .populate('category', 'name slug');

  if (locale) {
    return services.map((service: IService) => ({
      ...service.toObject(),
      title: service.title[locale],
      shortDescription: service.shortDescription[locale],
    }));
  }

  return services;
};

export interface IServiceModel extends mongoose.Model<IService> {
  getActiveServices(options?: {
    category?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<{ services: IService[]; total: number }>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IService | null>;
  getFeaturedServices(limit?: number, locale?: 'ar' | 'en'): Promise<IService[]>;
}

export const Service = mongoose.model<IService, IServiceModel>('Service', serviceSchema);

export default Service;
