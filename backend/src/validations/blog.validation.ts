/**
 * Blog Validation Schemas
 * مخططات التحقق من المدونة
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
 * ObjectId validation
 * التحقق من معرف الكائن
 */
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format | تنسيق المعرف غير صالح',
  });

/**
 * Tag schema
 * مخطط الوسم
 */
const tagSchema = Joi.object({
  ar: Joi.string().trim().allow(''),
  en: Joi.string().trim().allow(''),
});

/**
 * SEO schema
 * مخطط السيو
 */
const seoSchema = Joi.object({
  metaTitle: bilingualSchema(false),
  metaDescription: bilingualSchema(false),
  metaKeywords: Joi.array().items(Joi.string()),
  ogImage: Joi.string().uri().allow(''),
});

// ============================================
// Blog Category Validations
// ============================================

/**
 * Create blog category validation
 * التحقق من إنشاء فئة المدونة
 */
export const createBlogCategorySchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  description: bilingualSchema(false),
  image: Joi.string().uri().allow(''),
  parent: objectIdSchema.allow(null),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

/**
 * Update blog category validation
 * التحقق من تحديث فئة المدونة
 */
export const updateBlogCategorySchema = Joi.object({
  name: bilingualSchema(false),
  slug: slugSchema,
  description: bilingualSchema(false),
  image: Joi.string().uri().allow(''),
  parent: objectIdSchema.allow(null),
  order: Joi.number(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

// ============================================
// Blog Post Validations
// ============================================

/**
 * Create blog post validation
 * التحقق من إنشاء مقال المدونة
 */
export const createBlogPostSchema = Joi.object({
  title: bilingualSchema(true).required().messages({
    'any.required': 'Title is required | العنوان مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  excerpt: bilingualSchema(true).required().messages({
    'any.required': 'Excerpt is required | الملخص مطلوب',
  }),
  content: bilingualSchema(true).required().messages({
    'any.required': 'Content is required | المحتوى مطلوب',
  }),
  featuredImage: Joi.string().uri().allow(''),
  images: Joi.array().items(Joi.string().uri()),
  category: objectIdSchema.required().messages({
    'any.required': 'Category is required | الفئة مطلوبة',
  }),
  tags: Joi.array().items(tagSchema),
  status: Joi.string().valid('draft', 'published', 'scheduled', 'archived').default('draft'),
  scheduledAt: Joi.date().when('status', {
    is: 'scheduled',
    then: Joi.required().messages({
      'any.required':
        'Scheduled date is required when status is scheduled | تاريخ الجدولة مطلوب عند اختيار الحالة مجدولة',
    }),
  }),
  isFeatured: Joi.boolean().default(false),
  seo: seoSchema,
});

/**
 * Update blog post validation
 * التحقق من تحديث مقال المدونة
 */
export const updateBlogPostSchema = Joi.object({
  title: bilingualSchema(false),
  slug: slugSchema,
  excerpt: bilingualSchema(false),
  content: bilingualSchema(false),
  featuredImage: Joi.string().uri().allow(''),
  images: Joi.array().items(Joi.string().uri()),
  category: objectIdSchema,
  tags: Joi.array().items(tagSchema),
  status: Joi.string().valid('draft', 'published', 'scheduled', 'archived'),
  scheduledAt: Joi.date().allow(null),
  isFeatured: Joi.boolean(),
  seo: seoSchema,
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query blog posts validation
 * التحقق من استعلام المقالات
 */
export const queryBlogPostsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: objectIdSchema,
  tag: Joi.string().max(100),
  status: Joi.string().valid('draft', 'published', 'scheduled', 'archived'),
  featured: Joi.boolean(),
  author: objectIdSchema,
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
  sortBy: Joi.string().valid('publishedAt', 'createdAt', 'title', 'views'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Query blog categories validation
 * التحقق من استعلام الفئات
 */
export const queryBlogCategoriesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  isActive: Joi.boolean(),
  parent: objectIdSchema.allow(null),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
});

export const blogValidation = {
  createCategory: createBlogCategorySchema,
  updateCategory: updateBlogCategorySchema,
  queryCategories: queryBlogCategoriesSchema,
  createPost: createBlogPostSchema,
  updatePost: updateBlogPostSchema,
  queryPosts: queryBlogPostsSchema,
};

export default blogValidation;
