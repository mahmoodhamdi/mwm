/**
 * Content Validation Schemas
 * مخططات التحقق من المحتوى
 */

import Joi from 'joi';

/**
 * Bilingual validation schema
 * مخطط التحقق ثنائي اللغة
 */
const bilingualSchema = Joi.object({
  ar: Joi.any(),
  en: Joi.any(),
});

/**
 * Create site content validation
 * التحقق من إنشاء محتوى الموقع
 */
export const createSiteContentSchema = Joi.object({
  key: Joi.string()
    .pattern(/^[a-z0-9_.]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Key must contain only lowercase letters, numbers, underscores, and dots | المفتاح يجب أن يحتوي فقط على أحرف صغيرة وأرقام وشرطات سفلية ونقاط',
      'any.required': 'Key is required | المفتاح مطلوب',
    }),
  type: Joi.string()
    .valid('text', 'html', 'image', 'video', 'array', 'object', 'number', 'boolean')
    .default('text'),
  content: bilingualSchema.required().messages({
    'any.required': 'Content is required | المحتوى مطلوب',
  }),
  section: Joi.string().required().messages({
    'any.required': 'Section is required | القسم مطلوب',
  }),
  description: Joi.string().max(500).allow(''),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
  metadata: Joi.object({
    imageAlt: bilingualSchema,
    link: Joi.string().uri().allow(''),
    target: Joi.string().valid('_self', '_blank'),
    cssClass: Joi.string().allow(''),
  }),
});

/**
 * Update site content validation
 * التحقق من تحديث محتوى الموقع
 */
export const updateSiteContentSchema = Joi.object({
  type: Joi.string().valid(
    'text',
    'html',
    'image',
    'video',
    'array',
    'object',
    'number',
    'boolean'
  ),
  content: bilingualSchema,
  section: Joi.string(),
  description: Joi.string().max(500).allow(''),
  order: Joi.number(),
  isActive: Joi.boolean(),
  metadata: Joi.object({
    imageAlt: bilingualSchema,
    link: Joi.string().uri().allow(''),
    target: Joi.string().valid('_self', '_blank'),
    cssClass: Joi.string().allow(''),
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Bulk upsert site content validation
 * التحقق من الإدراج/التحديث المتعدد للمحتوى
 */
export const bulkUpsertContentSchema = Joi.object({
  contents: Joi.array()
    .items(
      Joi.object({
        key: Joi.string()
          .pattern(/^[a-z0-9_.]+$/)
          .required(),
        data: Joi.object({
          type: Joi.string().valid(
            'text',
            'html',
            'image',
            'video',
            'array',
            'object',
            'number',
            'boolean'
          ),
          content: bilingualSchema,
          section: Joi.string(),
          description: Joi.string().max(500).allow(''),
          order: Joi.number(),
          isActive: Joi.boolean(),
        }).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one content item is required | يجب تحديد عنصر محتوى واحد على الأقل',
      'any.required': 'Contents array is required | مصفوفة المحتويات مطلوبة',
    }),
});

/**
 * Query site content validation
 * التحقق من استعلام المحتوى
 */
export const querySiteContentSchema = Joi.object({
  section: Joi.string(),
  type: Joi.string().valid(
    'text',
    'html',
    'image',
    'video',
    'array',
    'object',
    'number',
    'boolean'
  ),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
});

export const contentValidation = {
  create: createSiteContentSchema,
  update: updateSiteContentSchema,
  bulkUpsert: bulkUpsertContentSchema,
  query: querySiteContentSchema,
};

export default contentValidation;
