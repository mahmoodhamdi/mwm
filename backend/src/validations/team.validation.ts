/**
 * Team Validation Schemas
 * مخططات التحقق من الفريق
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
 * Hex color validation
 * التحقق من لون HEX
 */
const hexColorSchema = Joi.string()
  .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  .messages({
    'string.pattern.base': 'Color must be a valid hex color | اللون يجب أن يكون بصيغة HEX صالحة',
  });

/**
 * Skill schema
 * مخطط المهارة
 */
const skillSchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Skill name is required | اسم المهارة مطلوب',
  }),
  level: Joi.number().min(1).max(100).required().messages({
    'any.required': 'Skill level is required | مستوى المهارة مطلوب',
    'number.min': 'Skill level must be at least 1 | مستوى المهارة يجب أن يكون على الأقل 1',
    'number.max': 'Skill level cannot exceed 100 | مستوى المهارة لا يمكن أن يتجاوز 100',
  }),
  category: Joi.string().valid('technical', 'soft', 'language', 'tool', 'other').messages({
    'any.only': 'Invalid skill category | فئة المهارة غير صالحة',
  }),
});

/**
 * Social links schema
 * مخطط روابط التواصل الاجتماعي
 */
const socialLinksSchema = Joi.object({
  linkedin: Joi.string().uri().allow('').messages({
    'string.uri': 'LinkedIn must be a valid URL | رابط LinkedIn يجب أن يكون صالحاً',
  }),
  twitter: Joi.string().uri().allow('').messages({
    'string.uri': 'Twitter must be a valid URL | رابط Twitter يجب أن يكون صالحاً',
  }),
  github: Joi.string().uri().allow('').messages({
    'string.uri': 'GitHub must be a valid URL | رابط GitHub يجب أن يكون صالحاً',
  }),
  website: Joi.string().uri().allow('').messages({
    'string.uri': 'Website must be a valid URL | الموقع يجب أن يكون رابطاً صالحاً',
  }),
  email: Joi.string().email().allow('').messages({
    'string.email': 'Email must be valid | البريد الإلكتروني يجب أن يكون صالحاً',
  }),
});

/**
 * Education schema
 * مخطط التعليم
 */
const educationSchema = Joi.object({
  degree: bilingualSchema(true).required(),
  institution: bilingualSchema(true).required(),
  year: Joi.number()
    .integer()
    .min(1950)
    .max(new Date().getFullYear() + 5),
});

/**
 * Certification schema
 * مخطط الشهادة
 */
const certificationSchema = Joi.object({
  name: bilingualSchema(true).required(),
  issuer: bilingualSchema(false),
  year: Joi.number()
    .integer()
    .min(1950)
    .max(new Date().getFullYear() + 5),
  url: Joi.string().uri().allow('').messages({
    'string.uri': 'Certification URL must be valid | رابط الشهادة يجب أن يكون صالحاً',
  }),
});

/**
 * SEO schema
 * مخطط السيو
 */
const seoSchema = Joi.object({
  metaTitle: bilingualSchema(false),
  metaDescription: bilingualSchema(false),
  keywords: Joi.array().items(Joi.string().trim()),
});

// ============================================
// Department Validations
// ============================================

/**
 * Create department validation
 * التحقق من إنشاء قسم
 */
export const createDepartmentSchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  color: hexColorSchema.allow(''),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

/**
 * Update department validation
 * التحقق من تحديث قسم
 */
export const updateDepartmentSchema = Joi.object({
  name: bilingualSchema(false),
  slug: slugSchema,
  description: bilingualSchema(false),
  icon: Joi.string().allow(''),
  color: hexColorSchema.allow(''),
  order: Joi.number(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query departments validation
 * التحقق من استعلام الأقسام
 */
export const queryDepartmentsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
});

// ============================================
// Team Member Validations
// ============================================

/**
 * Create team member validation
 * التحقق من إنشاء عضو فريق
 */
export const createTeamMemberSchema = Joi.object({
  name: bilingualSchema(true).required().messages({
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  slug: slugSchema.required().messages({
    'any.required': 'Slug is required | الرابط المختصر مطلوب',
  }),
  position: bilingualSchema(true).required().messages({
    'any.required': 'Position is required | المنصب مطلوب',
  }),
  bio: bilingualSchema(true).required().messages({
    'any.required': 'Bio is required | السيرة الذاتية مطلوبة',
  }),
  shortBio: bilingualSchema(false),
  department: objectIdSchema.required().messages({
    'any.required': 'Department is required | القسم مطلوب',
  }),
  avatar: Joi.string().required().messages({
    'any.required': 'Avatar is required | الصورة الشخصية مطلوبة',
  }),
  coverImage: Joi.string().allow(''),
  skills: Joi.array().items(skillSchema),
  socialLinks: socialLinksSchema,
  experience: Joi.number().min(0).messages({
    'number.min': 'Experience cannot be negative | الخبرة لا يمكن أن تكون سالبة',
  }),
  education: Joi.array().items(educationSchema),
  certifications: Joi.array().items(certificationSchema),
  projects: Joi.array().items(objectIdSchema),
  seo: seoSchema,
  order: Joi.number().default(0),
  isLeader: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  joinedAt: Joi.date().messages({
    'date.base': 'Joined date must be a valid date | تاريخ الانضمام يجب أن يكون صالحاً',
  }),
});

/**
 * Update team member validation
 * التحقق من تحديث عضو فريق
 */
export const updateTeamMemberSchema = Joi.object({
  name: bilingualSchema(false),
  slug: slugSchema,
  position: bilingualSchema(false),
  bio: bilingualSchema(false),
  shortBio: bilingualSchema(false),
  department: objectIdSchema,
  avatar: Joi.string().trim(),
  coverImage: Joi.string().allow(''),
  skills: Joi.array().items(skillSchema),
  socialLinks: socialLinksSchema,
  experience: Joi.number().min(0),
  education: Joi.array().items(educationSchema),
  certifications: Joi.array().items(certificationSchema),
  projects: Joi.array().items(objectIdSchema),
  seo: seoSchema,
  order: Joi.number(),
  isLeader: Joi.boolean(),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
  joinedAt: Joi.date().allow(null),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Query team members validation
 * التحقق من استعلام أعضاء الفريق
 */
export const queryTeamMembersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  department: Joi.string(), // Can be slug or ObjectId
  featured: Joi.boolean(),
  leaders: Joi.boolean(),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
  search: Joi.string().max(200),
  sortBy: Joi.string().valid('order', 'createdAt', 'name', 'joinedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

export const teamValidation = {
  createDepartment: createDepartmentSchema,
  updateDepartment: updateDepartmentSchema,
  queryDepartments: queryDepartmentsSchema,
  create: createTeamMemberSchema,
  update: updateTeamMemberSchema,
  query: queryTeamMembersSchema,
};

export default teamValidation;
