/**
 * Project Validation Schemas
 * مخططات التحقق من المشاريع
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
 * MongoDB ObjectId validation
 * التحقق من معرف MongoDB
 */
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format | صيغة المعرف غير صالحة',
  });

/**
 * Technology schema
 * مخطط التقنية
 */
const technologySchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'any.required': 'Technology name is required | اسم التقنية مطلوب',
  }),
  icon: Joi.string().allow('').trim(),
  category: Joi.string()
    .valid('frontend', 'backend', 'database', 'devops', 'mobile', 'other')
    .messages({
      'any.only': 'Invalid technology category | فئة التقنية غير صالحة',
    }),
});

/**
 * Client schema
 * مخطط العميل
 */
const clientSchema = Joi.object({
  name: bilingualSchema(true),
  logo: Joi.string().uri().allow('').messages({
    'string.uri': 'Logo must be a valid URL | شعار العميل يجب أن يكون رابطاً صالحاً',
  }),
  website: Joi.string().uri().allow('').messages({
    'string.uri': 'Website must be a valid URL | موقع العميل يجب أن يكون رابطاً صالحاً',
  }),
});

/**
 * Testimonial schema
 * مخطط الشهادة
 */
const testimonialSchema = Joi.object({
  text: bilingualSchema(true),
  author: bilingualSchema(true),
  position: bilingualSchema(false),
  photo: Joi.string().uri().allow('').messages({
    'string.uri': 'Photo must be a valid URL | الصورة يجب أن تكون رابطاً صالحاً',
  }),
});

/**
 * SEO schema
 * مخطط السيو
 */
const seoSchema = Joi.object({
  title: bilingualSchema(false),
  description: bilingualSchema(false),
  keywords: Joi.object({
    ar: Joi.array().items(Joi.string().trim()),
    en: Joi.array().items(Joi.string().trim()),
  }),
  ogImage: Joi.string().uri().allow('').messages({
    'string.uri': 'OG Image must be a valid URL | صورة OG يجب أن تكون رابطاً صالحاً',
  }),
});

// ============================================
// Project Category Validations
// ============================================

/**
 * Create project category validation
 * التحقق من إنشاء فئة المشروع
 */
export const createProjectCategorySchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow('').messages({
    'string.uri': 'Image must be a valid URL | الصورة يجب أن تكون رابطاً صالحاً',
  }),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

/**
 * Update project category validation
 * التحقق من تحديث فئة المشروع
 */
export const updateProjectCategorySchema = Joi.object({
  name: bilingualSchema(false),
  slug: slugSchema,
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  image: Joi.string().uri().allow('').messages({
    'string.uri': 'Image must be a valid URL | الصورة يجب أن تكون رابطاً صالحاً',
  }),
  order: Joi.number(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

// ============================================
// Project Validations
// ============================================

/**
 * Create project validation
 * التحقق من إنشاء مشروع
 */
export const createProjectSchema = Joi.object({
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
  challenge: bilingualSchema(false),
  solution: bilingualSchema(false),
  results: bilingualSchema(false),
  thumbnail: Joi.string().required().messages({
    'any.required': 'Thumbnail is required | الصورة المصغرة مطلوبة',
  }),
  images: Joi.array().items(Joi.string().trim()),
  video: Joi.string().uri().allow('').messages({
    'string.uri': 'Video must be a valid URL | الفيديو يجب أن يكون رابطاً صالحاً',
  }),
  category: objectIdSchema.required().messages({
    'any.required': 'Category is required | الفئة مطلوبة',
  }),
  technologies: Joi.array().items(technologySchema),
  client: clientSchema,
  testimonial: testimonialSchema,
  liveUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'Live URL must be valid | رابط المعاينة يجب أن يكون صالحاً',
  }),
  githubUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'GitHub URL must be valid | رابط GitHub يجب أن يكون صالحاً',
  }),
  duration: Joi.string().allow(''),
  completedAt: Joi.date().messages({
    'date.base': 'Completed date must be a valid date | تاريخ الإنجاز يجب أن يكون تاريخاً صالحاً',
  }),
  seo: seoSchema,
  isFeatured: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),
  order: Joi.number().default(0),
});

/**
 * Update project validation
 * التحقق من تحديث مشروع
 */
export const updateProjectSchema = Joi.object({
  title: bilingualSchema(false),
  slug: slugSchema,
  shortDescription: bilingualSchema(false),
  description: bilingualSchema(false),
  challenge: bilingualSchema(false),
  solution: bilingualSchema(false),
  results: bilingualSchema(false),
  thumbnail: Joi.string().trim(),
  images: Joi.array().items(Joi.string().trim()),
  video: Joi.string().uri().allow('').messages({
    'string.uri': 'Video must be a valid URL | الفيديو يجب أن يكون رابطاً صالحاً',
  }),
  category: objectIdSchema,
  technologies: Joi.array().items(technologySchema),
  client: clientSchema,
  testimonial: testimonialSchema,
  liveUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'Live URL must be valid | رابط المعاينة يجب أن يكون صالحاً',
  }),
  githubUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'GitHub URL must be valid | رابط GitHub يجب أن يكون صالحاً',
  }),
  duration: Joi.string().allow(''),
  completedAt: Joi.date().allow(null).messages({
    'date.base': 'Completed date must be a valid date | تاريخ الإنجاز يجب أن يكون تاريخاً صالحاً',
  }),
  seo: seoSchema,
  isFeatured: Joi.boolean(),
  isPublished: Joi.boolean(),
  order: Joi.number(),
  views: Joi.number().min(0),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query projects validation
 * التحقق من استعلام المشاريع
 */
export const queryProjectsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  category: Joi.string(), // Can be slug or ObjectId
  technology: Joi.string(),
  featured: Joi.boolean(),
  isPublished: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
  sortBy: Joi.string().valid('order', 'createdAt', 'completedAt', 'views'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Query project categories validation
 * التحقق من استعلام فئات المشاريع
 */
export const queryProjectCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
});

export const projectValidation = {
  createCategory: createProjectCategorySchema,
  updateCategory: updateProjectCategorySchema,
  queryCategories: queryProjectCategoriesSchema,
  create: createProjectSchema,
  update: updateProjectSchema,
  query: queryProjectsSchema,
};

export default projectValidation;
