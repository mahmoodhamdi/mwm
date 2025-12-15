/**
 * Validation Middleware
 * برمجيات التحقق الوسيطة
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

/**
 * Validation source types
 * أنواع مصادر التحقق
 */
export type ValidationSource = 'body' | 'query' | 'params';

/**
 * Validation schema type
 * نوع مخطط التحقق
 */
export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

/**
 * Validation options
 * خيارات التحقق
 */
const defaultValidationOptions: Joi.ValidationOptions = {
  abortEarly: false, // Return all errors, not just the first
  stripUnknown: true, // Remove unknown keys from the validated data
  errors: {
    wrap: {
      label: false, // Don't wrap labels in quotes
    },
  },
};

/**
 * Format Joi validation errors
 * تنسيق أخطاء التحقق من Joi
 */
function formatValidationErrors(error: Joi.ValidationError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.details.forEach(detail => {
    const key = detail.path.join('.');
    errors[key] = detail.message;
  });

  return errors;
}

/**
 * Validate request middleware factory
 * مصنع برمجيات التحقق من الطلبات
 */
export function validate(schema: ValidationSchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const allErrors: Record<string, string> = {};

    // Validate each source
    const sources: ValidationSource[] = ['body', 'query', 'params'];

    for (const source of sources) {
      const sourceSchema = schema[source];
      if (!sourceSchema) {
        continue;
      }

      const { error, value } = sourceSchema.validate(req[source], defaultValidationOptions);

      if (error) {
        const formattedErrors = formatValidationErrors(error);
        Object.entries(formattedErrors).forEach(([key, message]) => {
          allErrors[`${source}.${key}`] = message;
        });
      } else {
        // Replace request data with validated (and sanitized) data
        req[source] = value;
      }
    }

    if (Object.keys(allErrors).length > 0) {
      next(ApiError.validationError(allErrors));
      return;
    }

    next();
  };
}

/**
 * Common validation schemas
 * مخططات التحقق الشائعة
 */
export const commonSchemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ID format'),

  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  // Sorting
  sort: Joi.string().pattern(/^[a-zA-Z_]+:(asc|desc)$/),

  // Search
  search: Joi.string().trim().max(100),

  // Locale
  locale: Joi.string().valid('ar', 'en').default('ar'),

  // Email
  email: Joi.string().email().lowercase().trim(),

  // Password (min 8 chars, at least 1 letter and 1 number)
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .message('Password must contain at least one letter and one number'),

  // Slug
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .message('Slug must be lowercase with hyphens only'),

  // URL
  url: Joi.string().uri(),

  // Phone (international format)
  phone: Joi.string().pattern(/^\+?[1-9]\d{6,14}$/),

  // Localized string
  localizedString: Joi.object({
    ar: Joi.string().required(),
    en: Joi.string().required(),
  }),

  // Optional localized string
  optionalLocalizedString: Joi.object({
    ar: Joi.string().allow(''),
    en: Joi.string().allow(''),
  }),
};

/**
 * Pagination query schema
 * مخطط استعلام التصفح
 */
export const paginationSchema = Joi.object({
  page: commonSchemas.page,
  limit: commonSchemas.limit,
  sort: commonSchemas.sort,
  search: commonSchemas.search,
});

/**
 * ID params schema
 * مخطط معرف المعاملات
 */
export const idParamsSchema = Joi.object({
  id: commonSchemas.objectId.required(),
});

/**
 * Job ID params schema
 * مخطط معرف الوظيفة
 */
export const jobIdParamsSchema = Joi.object({
  jobId: commonSchemas.objectId.required(),
});

/**
 * ID with Item ID params schema
 * مخطط معرف مع معرف العنصر
 */
export const idWithItemIdParamsSchema = Joi.object({
  id: commonSchemas.objectId.required(),
  itemId: commonSchemas.objectId.required(),
});

export default validate;
