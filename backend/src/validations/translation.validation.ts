/**
 * Translation Validation Schemas
 * مخططات التحقق من الترجمة
 */

import Joi from 'joi';

/**
 * Valid namespaces
 * مساحات الأسماء الصالحة
 */
const validNamespaces = [
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
];

/**
 * Create translation validation
 * التحقق من إنشاء الترجمة
 */
export const createTranslationSchema = Joi.object({
  key: Joi.string()
    .pattern(/^[a-zA-Z0-9_.]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Key must contain only letters, numbers, underscores, and dots | المفتاح يجب أن يحتوي فقط على أحرف وأرقام وشرطات سفلية ونقاط',
      'any.required': 'Key is required | المفتاح مطلوب',
    }),
  namespace: Joi.string()
    .valid(...validNamespaces)
    .required()
    .messages({
      'any.only': 'Invalid namespace | مساحة الاسم غير صالحة',
      'any.required': 'Namespace is required | مساحة الاسم مطلوبة',
    }),
  translations: Joi.object({
    ar: Joi.string().required().messages({
      'any.required': 'Arabic translation is required | الترجمة العربية مطلوبة',
    }),
    en: Joi.string().required().messages({
      'any.required': 'English translation is required | الترجمة الإنجليزية مطلوبة',
    }),
  }).required(),
  description: Joi.string().max(500).allow(''),
  isSystem: Joi.boolean().default(false),
});

/**
 * Update translation validation
 * التحقق من تحديث الترجمة
 */
export const updateTranslationSchema = Joi.object({
  translations: Joi.object({
    ar: Joi.string(),
    en: Joi.string(),
  }).min(1),
  description: Joi.string().max(500).allow(''),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Bulk upsert translations validation
 * التحقق من الإدراج/التحديث المتعدد للترجمات
 */
export const bulkUpsertTranslationsSchema = Joi.object({
  translations: Joi.array()
    .items(
      Joi.object({
        key: Joi.string()
          .pattern(/^[a-zA-Z0-9_.]+$/)
          .required(),
        namespace: Joi.string()
          .valid(...validNamespaces)
          .required(),
        translations: Joi.object({
          ar: Joi.string().required(),
          en: Joi.string().required(),
        }).required(),
        description: Joi.string().max(500).allow(''),
        isSystem: Joi.boolean(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one translation is required | يجب تحديد ترجمة واحدة على الأقل',
      'any.required': 'Translations array is required | مصفوفة الترجمات مطلوبة',
    }),
});

/**
 * Query translations validation
 * التحقق من استعلام الترجمات
 */
export const queryTranslationsSchema = Joi.object({
  namespace: Joi.string().valid(...validNamespaces),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().min(2),
  limit: Joi.number().integer().min(1).max(500).default(100),
});

/**
 * Get translations by namespace validation
 * التحقق من جلب الترجمات حسب مساحة الاسم
 */
export const getByNamespaceSchema = Joi.object({
  namespace: Joi.string()
    .valid(...validNamespaces)
    .required()
    .messages({
      'any.only': 'Invalid namespace | مساحة الاسم غير صالحة',
      'any.required': 'Namespace is required | مساحة الاسم مطلوبة',
    }),
  locale: Joi.string().valid('ar', 'en').default('ar'),
});

export const translationValidation = {
  create: createTranslationSchema,
  update: updateTranslationSchema,
  bulkUpsert: bulkUpsertTranslationsSchema,
  query: queryTranslationsSchema,
  getByNamespace: getByNamespaceSchema,
};

export default translationValidation;
