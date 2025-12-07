/**
 * Contact Validation Schemas
 * مخططات التحقق من صحة رسائل التواصل
 */

import Joi from 'joi';

// Budget options
const budgetOptions = [
  'under_5k',
  '5k_10k',
  '10k_25k',
  '25k_50k',
  '50k_100k',
  'over_100k',
  'not_sure',
];

// Contact statuses
const contactStatuses = ['new', 'read', 'replied', 'archived', 'spam'];

// Contact priorities
const contactPriorities = ['low', 'normal', 'high', 'urgent'];

// Preferred contact methods
const contactMethods = ['email', 'phone', 'whatsapp'];

/**
 * Submit contact form (public)
 */
export const submitContactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'الاسم مطلوب',
    'string.min': 'الاسم يجب أن يكون على الأقل {#limit} أحرف',
    'string.max': 'الاسم لا يمكن أن يتجاوز {#limit} حرف',
    'any.required': 'الاسم مطلوب',
  }),

  email: Joi.string().email().required().messages({
    'string.empty': 'البريد الإلكتروني مطلوب',
    'string.email': 'البريد الإلكتروني غير صحيح',
    'any.required': 'البريد الإلكتروني مطلوب',
  }),

  phone: Joi.string().allow('').optional().messages({
    'string.base': 'رقم الهاتف غير صحيح',
  }),

  company: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'اسم الشركة لا يمكن أن يتجاوز {#limit} حرف',
  }),

  website: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'رابط الموقع غير صحيح',
  }),

  subject: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'الموضوع مطلوب',
    'string.min': 'الموضوع يجب أن يكون على الأقل {#limit} أحرف',
    'string.max': 'الموضوع لا يمكن أن يتجاوز {#limit} حرف',
    'any.required': 'الموضوع مطلوب',
  }),

  message: Joi.string().min(10).max(10000).required().messages({
    'string.empty': 'الرسالة مطلوبة',
    'string.min': 'الرسالة يجب أن تكون على الأقل {#limit} أحرف',
    'string.max': 'الرسالة لا يمكن أن تتجاوز {#limit} حرف',
    'any.required': 'الرسالة مطلوبة',
  }),

  service: Joi.string().optional().messages({
    'string.base': 'الخدمة غير صحيحة',
  }),

  budget: Joi.string()
    .valid(...budgetOptions)
    .optional()
    .messages({
      'any.only': 'الميزانية غير صحيحة',
    }),

  preferredContact: Joi.string()
    .valid(...contactMethods)
    .optional()
    .messages({
      'any.only': 'طريقة التواصل المفضلة غير صحيحة',
    }),

  recaptchaToken: Joi.string().optional().messages({
    'string.base': 'رمز التحقق غير صحيح',
  }),
});

/**
 * Query messages (admin)
 */
export const queryMessagesSchema = Joi.object({
  status: Joi.string()
    .valid(...contactStatuses)
    .optional(),
  priority: Joi.string()
    .valid(...contactPriorities)
    .optional(),
  starred: Joi.boolean().optional(),
  search: Joi.string().max(200).optional(),
  service: Joi.string().optional(),
  assignedTo: Joi.string().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().optional(),
});

/**
 * Update message (admin)
 */
export const updateMessageSchema = Joi.object({
  status: Joi.string()
    .valid(...contactStatuses)
    .optional(),
  priority: Joi.string()
    .valid(...contactPriorities)
    .optional(),
  isStarred: Joi.boolean().optional(),
  labels: Joi.array().items(Joi.string().max(50)).optional(),
  notes: Joi.string().max(5000).allow('').optional(),
  assignedTo: Joi.string().allow(null).optional(),
});

/**
 * Reply to message (admin)
 */
export const replyMessageSchema = Joi.object({
  message: Joi.string().min(10).max(10000).required().messages({
    'string.empty': 'الرد مطلوب',
    'string.min': 'الرد يجب أن يكون على الأقل {#limit} أحرف',
    'string.max': 'الرد لا يمكن أن يتجاوز {#limit} حرف',
    'any.required': 'الرد مطلوب',
  }),
  sendEmail: Joi.boolean().default(true),
});

/**
 * Bulk action (admin)
 */
export const bulkActionSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'يجب تحديد رسالة واحدة على الأقل',
    'any.required': 'يجب تحديد الرسائل',
  }),
  action: Joi.string()
    .valid('read', 'archive', 'spam', 'delete', 'assign', 'setPriority')
    .required()
    .messages({
      'any.only': 'الإجراء غير صحيح',
      'any.required': 'الإجراء مطلوب',
    }),
  value: Joi.alternatives()
    .conditional('action', [
      { is: 'assign', then: Joi.string().required() },
      {
        is: 'setPriority',
        then: Joi.string()
          .valid(...contactPriorities)
          .required(),
      },
    ])
    .optional(),
});

export const contactValidation = {
  submitContactSchema,
  queryMessagesSchema,
  updateMessageSchema,
  replyMessageSchema,
  bulkActionSchema,
};

export default contactValidation;
