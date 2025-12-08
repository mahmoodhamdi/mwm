/**
 * Newsletter Validation Schemas
 * مخططات التحقق من النشرة البريدية
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
 * ObjectId validation
 * التحقق من معرف الكائن
 */
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format | تنسيق المعرف غير صالح',
  });

// ============================================
// Subscriber Validations
// ============================================

/**
 * Public subscription validation
 * التحقق من الاشتراك العام
 */
export const subscribeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
    'string.email': 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح',
  }),
  name: Joi.string().max(100).allow(''),
  locale: Joi.string().valid('ar', 'en').default('ar'),
});

/**
 * Unsubscribe validation
 * التحقق من إلغاء الاشتراك
 */
export const unsubscribeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
    'string.email': 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح',
  }),
  token: Joi.string().required().messages({
    'any.required': 'Unsubscribe token is required | رمز إلغاء الاشتراك مطلوب',
  }),
});

/**
 * Create subscriber validation (admin)
 * التحقق من إنشاء مشترك (المسؤول)
 */
export const createSubscriberSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
    'string.email': 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح',
  }),
  name: Joi.string().max(100).allow(''),
  status: Joi.string().valid('active', 'unsubscribed', 'bounced', 'pending').default('active'),
  source: Joi.string().valid('website', 'import', 'manual', 'api').default('manual'),
  tags: Joi.array().items(Joi.string().trim()),
  locale: Joi.string().valid('ar', 'en').default('ar'),
});

/**
 * Update subscriber validation
 * التحقق من تحديث المشترك
 */
export const updateSubscriberSchema = Joi.object({
  name: Joi.string().max(100).allow(''),
  status: Joi.string().valid('active', 'unsubscribed', 'bounced', 'pending'),
  tags: Joi.array().items(Joi.string().trim()),
  locale: Joi.string().valid('ar', 'en'),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Bulk subscriber action validation
 * التحقق من إجراءات المشتركين بالجملة
 */
export const bulkSubscriberActionSchema = Joi.object({
  ids: Joi.array().items(objectIdSchema).min(1).required().messages({
    'any.required': 'Subscriber IDs are required | معرفات المشتركين مطلوبة',
    'array.min': 'At least one ID is required | يجب تحديد معرف واحد على الأقل',
  }),
  action: Joi.string()
    .valid('delete', 'unsubscribe', 'activate', 'addTags', 'removeTags')
    .required()
    .messages({
      'any.required': 'Action is required | الإجراء مطلوب',
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .when('action', {
      is: Joi.valid('addTags', 'removeTags'),
      then: Joi.required().messages({
        'any.required': 'Tags are required for this action | الوسوم مطلوبة لهذا الإجراء',
      }),
    }),
});

/**
 * Query subscribers validation
 * التحقق من استعلام المشتركين
 */
export const querySubscribersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('active', 'unsubscribed', 'bounced', 'pending'),
  source: Joi.string().valid('website', 'import', 'manual', 'api'),
  tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  search: Joi.string().max(200),
  sort: Joi.string().valid('subscribedAt', '-subscribedAt', 'email', '-email', 'name', '-name'),
});

// ============================================
// Campaign Validations
// ============================================

/**
 * Create campaign validation
 * التحقق من إنشاء الحملة
 */
export const createCampaignSchema = Joi.object({
  subject: bilingualSchema(true).required().messages({
    'any.required': 'Subject is required | عنوان الحملة مطلوب',
  }),
  preheader: bilingualSchema(false),
  content: bilingualSchema(true).required().messages({
    'any.required': 'Content is required | محتوى الحملة مطلوب',
  }),
  recipientType: Joi.string().valid('all', 'tags', 'specific').default('all'),
  recipientTags: Joi.array()
    .items(Joi.string().trim())
    .when('recipientType', {
      is: 'tags',
      then: Joi.array().items(Joi.string().trim()).min(1).required().messages({
        'any.required': 'At least one tag is required | يجب تحديد وسم واحد على الأقل',
        'array.min': 'At least one tag is required | يجب تحديد وسم واحد على الأقل',
      }),
    }),
  recipientIds: Joi.array()
    .items(objectIdSchema)
    .when('recipientType', {
      is: 'specific',
      then: Joi.array().items(objectIdSchema).min(1).required().messages({
        'any.required': 'At least one recipient is required | يجب تحديد مستلم واحد على الأقل',
        'array.min': 'At least one recipient is required | يجب تحديد مستلم واحد على الأقل',
      }),
    }),
});

/**
 * Update campaign validation
 * التحقق من تحديث الحملة
 */
export const updateCampaignSchema = Joi.object({
  subject: bilingualSchema(false),
  preheader: bilingualSchema(false),
  content: bilingualSchema(false),
  recipientType: Joi.string().valid('all', 'tags', 'specific'),
  recipientTags: Joi.array().items(Joi.string().trim()),
  recipientIds: Joi.array().items(objectIdSchema),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Schedule campaign validation
 * التحقق من جدولة الحملة
 */
export const scheduleCampaignSchema = Joi.object({
  scheduledAt: Joi.date().greater('now').required().messages({
    'any.required': 'Scheduled date is required | تاريخ الجدولة مطلوب',
    'date.greater': 'Scheduled date must be in the future | تاريخ الجدولة يجب أن يكون في المستقبل',
  }),
});

/**
 * Query campaigns validation
 * التحقق من استعلام الحملات
 */
export const queryCampaignsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('draft', 'scheduled', 'sending', 'sent', 'cancelled'),
  search: Joi.string().max(200),
  sort: Joi.string().valid(
    'createdAt',
    '-createdAt',
    'sentAt',
    '-sentAt',
    'scheduledAt',
    '-scheduledAt'
  ),
});

// ============================================
// Export
// ============================================

export const newsletterValidation = {
  // Subscriber
  subscribe: subscribeSchema,
  unsubscribe: unsubscribeSchema,
  createSubscriber: createSubscriberSchema,
  updateSubscriber: updateSubscriberSchema,
  bulkSubscriberAction: bulkSubscriberActionSchema,
  querySubscribers: querySubscribersSchema,
  // Campaign
  createCampaign: createCampaignSchema,
  updateCampaign: updateCampaignSchema,
  scheduleCampaign: scheduleCampaignSchema,
  queryCampaigns: queryCampaignsSchema,
};

export default newsletterValidation;
