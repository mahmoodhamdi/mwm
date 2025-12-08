/**
 * Careers Validation Schemas
 * مخططات التحقق من الوظائف
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
 * Salary range schema
 * مخطط نطاق الراتب
 */
const salaryRangeSchema = Joi.object({
  min: Joi.number().min(0),
  max: Joi.number().min(0),
  currency: Joi.string().default('SAR'),
  period: Joi.string().valid('hourly', 'monthly', 'yearly').default('monthly'),
  isPublic: Joi.boolean().default(false),
});

// ============================================
// Job Validations
// ============================================

/**
 * Create job validation
 * التحقق من إنشاء الوظيفة
 */
export const createJobSchema = Joi.object({
  title: bilingualSchema(true).required().messages({
    'any.required': 'Title is required | العنوان مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  description: bilingualSchema(true).required().messages({
    'any.required': 'Description is required | الوصف مطلوب',
  }),
  requirements: Joi.array().items(bilingualSchema(false)),
  responsibilities: Joi.array().items(bilingualSchema(false)),
  benefits: Joi.array().items(bilingualSchema(false)),
  department: objectIdSchema.required().messages({
    'any.required': 'Department is required | القسم مطلوب',
  }),
  location: bilingualSchema(true).required().messages({
    'any.required': 'Location is required | الموقع مطلوب',
  }),
  type: Joi.string()
    .valid('full-time', 'part-time', 'contract', 'internship', 'remote')
    .required()
    .messages({
      'any.required': 'Job type is required | نوع الوظيفة مطلوب',
    }),
  experienceLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .required()
    .messages({
      'any.required': 'Experience level is required | مستوى الخبرة مطلوب',
    }),
  salaryRange: salaryRangeSchema,
  skills: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid('draft', 'open', 'closed', 'filled').default('draft'),
  applicationDeadline: Joi.date().allow(null),
  isFeatured: Joi.boolean().default(false),
});

/**
 * Update job validation
 * التحقق من تحديث الوظيفة
 */
export const updateJobSchema = Joi.object({
  title: bilingualSchema(false),
  slug: slugSchema,
  description: bilingualSchema(false),
  requirements: Joi.array().items(bilingualSchema(false)),
  responsibilities: Joi.array().items(bilingualSchema(false)),
  benefits: Joi.array().items(bilingualSchema(false)),
  department: objectIdSchema,
  location: bilingualSchema(false),
  type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'remote'),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive'),
  salaryRange: salaryRangeSchema,
  skills: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid('draft', 'open', 'closed', 'filled'),
  applicationDeadline: Joi.date().allow(null),
  isFeatured: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query jobs validation
 * التحقق من استعلام الوظائف
 */
export const queryJobsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  department: objectIdSchema,
  type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'remote'),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive'),
  status: Joi.string().valid('draft', 'open', 'closed', 'filled'),
  featured: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
});

// ============================================
// Job Application Validations
// ============================================

/**
 * Create job application validation
 * التحقق من إنشاء طلب التوظيف
 */
export const createApplicationSchema = Joi.object({
  job: objectIdSchema.required().messages({
    'any.required': 'Job is required | الوظيفة مطلوبة',
  }),
  firstName: Joi.string().trim().max(50).required().messages({
    'any.required': 'First name is required | الاسم الأول مطلوب',
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    'any.required': 'Last name is required | اسم العائلة مطلوب',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
    'string.email': 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح',
  }),
  phone: Joi.string().trim().required().messages({
    'any.required': 'Phone is required | رقم الهاتف مطلوب',
  }),
  resume: Joi.string().uri().required().messages({
    'any.required': 'Resume is required | السيرة الذاتية مطلوبة',
    'string.uri': 'Resume must be a valid URL | السيرة الذاتية يجب أن تكون رابطاً صالحاً',
  }),
  coverLetter: Joi.string().allow(''),
  linkedIn: Joi.string().uri().allow(''),
  portfolio: Joi.string().uri().allow(''),
  expectedSalary: Joi.number().min(0),
  availableFrom: Joi.date(),
  experience: Joi.number().min(0).required().messages({
    'any.required': 'Experience is required | الخبرة مطلوبة',
  }),
  education: Joi.string().allow(''),
  skills: Joi.array().items(Joi.string().trim()),
  answers: Joi.object().pattern(Joi.string(), Joi.string()),
});

/**
 * Update job application validation (admin)
 * التحقق من تحديث طلب التوظيف (المسؤول)
 */
export const updateApplicationSchema = Joi.object({
  status: Joi.string().valid(
    'pending',
    'reviewing',
    'shortlisted',
    'interviewed',
    'offered',
    'hired',
    'rejected',
    'withdrawn'
  ),
  notes: Joi.string().allow(''),
  rating: Joi.number().min(1).max(5),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query applications validation
 * التحقق من استعلام الطلبات
 */
export const queryApplicationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  job: objectIdSchema,
  status: Joi.string().valid(
    'pending',
    'reviewing',
    'shortlisted',
    'interviewed',
    'offered',
    'hired',
    'rejected',
    'withdrawn'
  ),
  email: Joi.string().email(),
});

/**
 * Bulk update application status validation
 * التحقق من تحديث حالة الطلبات بالجملة
 */
export const bulkUpdateApplicationStatusSchema = Joi.object({
  ids: Joi.array().items(objectIdSchema).min(1).required().messages({
    'any.required': 'Application IDs are required | معرفات الطلبات مطلوبة',
    'array.min': 'At least one ID is required | يجب تحديد معرف واحد على الأقل',
  }),
  status: Joi.string()
    .valid(
      'pending',
      'reviewing',
      'shortlisted',
      'interviewed',
      'offered',
      'hired',
      'rejected',
      'withdrawn'
    )
    .required()
    .messages({
      'any.required': 'Status is required | الحالة مطلوبة',
    }),
});

export const careersValidation = {
  createJob: createJobSchema,
  updateJob: updateJobSchema,
  queryJobs: queryJobsSchema,
  createApplication: createApplicationSchema,
  updateApplication: updateApplicationSchema,
  queryApplications: queryApplicationsSchema,
  bulkUpdateApplicationStatus: bulkUpdateApplicationStatusSchema,
};

export default careersValidation;
