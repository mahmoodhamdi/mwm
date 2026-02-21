/**
 * User Validation Schemas
 * مخططات التحقق من صحة المستخدمين
 */

import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح',
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min':
      'Password must be at least 8 characters | يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    'any.required': 'Password is required | كلمة المرور مطلوبة',
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters | يجب أن يكون الاسم حرفين على الأقل',
    'any.required': 'Name is required | الاسم مطلوب',
  }),
  role: Joi.string().valid('admin', 'editor', 'author', 'viewer').required().messages({
    'any.only': 'Invalid role | دور غير صالح',
    'any.required': 'Role is required | الدور مطلوب',
  }),
  isActive: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  role: Joi.string().valid('admin', 'editor', 'author', 'viewer').optional(),
  isActive: Joi.boolean().optional(),
  email: Joi.string().email().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided | يجب توفير حقل واحد على الأقل',
  });

export const bulkUpdateUsersSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one user ID is required | يجب توفير معرف مستخدم واحد على الأقل',
    'any.required': 'User IDs are required | معرفات المستخدمين مطلوبة',
  }),
  action: Joi.string().valid('activate', 'deactivate', 'delete').required().messages({
    'any.only': 'Invalid action | إجراء غير صالح',
    'any.required': 'Action is required | الإجراء مطلوب',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min':
      'Password must be at least 8 characters | يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    'any.required': 'Password is required | كلمة المرور مطلوبة',
  }),
});

export const usersValidation = {
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  bulkUpdateUsers: bulkUpdateUsersSchema,
  resetPassword: resetPasswordSchema,
};

export default usersValidation;
