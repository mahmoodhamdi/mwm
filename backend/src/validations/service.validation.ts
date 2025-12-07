/**
 * Service Validation Schemas
 * مخططات التحقق من الخدمات
 */

import Joi from 'joi';

/**
 * Bilingual validation schema
 * مخطط التحقق ثنائي اللغة
 */
const bilingualSchema = (required = false) =>
  Joi.object({
    ar: required
      ? Joi.string().required().messages({
          'any.required': 'Arabic content is required | المحتوى بالعربية مطلوب',
        })
      : Joi.string().allow(''),
    en: required
      ? Joi.string().required().messages({
          'any.required': 'English content is required | المحتوى بالإنجليزية مطلوب',
        })
      : Joi.string().allow(''),
  });

/**
 * Slug validation
 * التحقق من الرابط المختصر
 */
const slugSchema = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .messages({
    'string.pattern.base':
      'Slug must be URL-friendly (lowercase letters, numbers, and hyphens) | الرابط المختصر يجب أن يكون صالحاً للعناوين',
  });

/**
 * Feature schema
 * مخطط الميزة
 */
const featureSchema = Joi.object({
  title: bilingualSchema(true),
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
});

/**
 * Pricing plan schema
 * مخطط خطة الأسعار
 */
const pricingPlanSchema = Joi.object({
  name: bilingualSchema(true),
  description: bilingualSchema(false),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative | السعر لا يمكن أن يكون سالباً',
    'any.required': 'Price is required | السعر مطلوب',
  }),
  currency: Joi.string().default('SAR'),
  period: Joi.string().valid('monthly', 'yearly', 'one-time', 'custom').default('one-time'),
  periodLabel: bilingualSchema(false),
  features: Joi.array().items(bilingualSchema(false)),
  isPopular: Joi.boolean().default(false),
  ctaText: bilingualSchema(false),
  ctaLink: Joi.string().uri().allow(''),
  order: Joi.number().default(0),
});

/**
 * FAQ schema
 * مخطط الأسئلة الشائعة
 */
const faqSchema = Joi.object({
  question: bilingualSchema(true),
  answer: bilingualSchema(true),
  order: Joi.number().default(0),
});

/**
 * Process step schema
 * مخطط خطوة العملية
 */
const processStepSchema = Joi.object({
  title: bilingualSchema(true),
  description: bilingualSchema(true),
  icon: Joi.string().allow(''),
  order: Joi.number().default(0),
});

/**
 * SEO schema
 * مخطط السيو
 */
const seoSchema = Joi.object({
  metaTitle: bilingualSchema(false),
  metaDescription: bilingualSchema(false),
  keywords: Joi.array().items(Joi.string()),
});

// ============================================
// Service Category Validations
// ============================================

/**
 * Create service category validation
 * التحقق من إنشاء فئة الخدمة
 */
export const createServiceCategorySchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow(''),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

/**
 * Update service category validation
 * التحقق من تحديث فئة الخدمة
 */
export const updateServiceCategorySchema = Joi.object({
  name: bilingualSchema(false),
  slug: slugSchema,
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow(''),
  order: Joi.number(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

// ============================================
// Service Validations
// ============================================

/**
 * Create service validation
 * التحقق من إنشاء خدمة
 */
export const createServiceSchema = Joi.object({
  title: bilingualSchema(true).required().messages({
    'any.required': 'Title is required | العنوان مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  shortDescription: bilingualSchema(true).required().messages({
    'any.required': 'Short description is required | الوصف المختصر مطلوب',
  }),
  description: bilingualSchema(true).required().messages({
    'any.required': 'Description is required | الوصف مطلوب',
  }),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid category ID | معرف الفئة غير صالح',
      'any.required': 'Category is required | الفئة مطلوبة',
    }),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow(''),
  gallery: Joi.array().items(Joi.string().uri()),
  features: Joi.array().items(featureSchema),
  pricingPlans: Joi.array().items(pricingPlanSchema),
  faqs: Joi.array().items(faqSchema),
  processSteps: Joi.array().items(processStepSchema),
  technologies: Joi.array().items(Joi.string()),
  relatedServices: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid related service ID | معرف الخدمة المرتبطة غير صالح',
      })
  ),
  seo: seoSchema,
  order: Joi.number().default(0),
  isFeatured: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
});

/**
 * Update service validation
 * التحقق من تحديث خدمة
 */
export const updateServiceSchema = Joi.object({
  title: bilingualSchema(false),
  slug: slugSchema,
  shortDescription: bilingualSchema(false),
  description: bilingualSchema(false),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid category ID | معرف الفئة غير صالح',
    }),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow(''),
  gallery: Joi.array().items(Joi.string().uri()),
  features: Joi.array().items(featureSchema),
  pricingPlans: Joi.array().items(pricingPlanSchema),
  faqs: Joi.array().items(faqSchema),
  processSteps: Joi.array().items(processStepSchema),
  technologies: Joi.array().items(Joi.string()),
  relatedServices: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid related service ID | معرف الخدمة المرتبطة غير صالح',
      })
  ),
  seo: seoSchema,
  order: Joi.number(),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query services validation
 * التحقق من استعلام الخدمات
 */
export const queryServicesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  featured: Joi.boolean(),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
  sortBy: Joi.string().valid('order', 'createdAt', 'title', 'viewCount'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

/**
 * Query categories validation
 * التحقق من استعلام الفئات
 */
export const queryCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
});

export const serviceValidation = {
  createCategory: createServiceCategorySchema,
  updateCategory: updateServiceCategorySchema,
  queryCategories: queryCategoriesSchema,
  create: createServiceSchema,
  update: updateServiceSchema,
  query: queryServicesSchema,
};

export default serviceValidation;
