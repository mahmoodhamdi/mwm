/**
 * Auth Validation Schemas
 * مخططات التحقق من المصادقة
 */

import Joi from 'joi';

/**
 * Password regex - at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 * نمط كلمة المرور - 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، رمز خاص
 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=[\]{};':"\\|,.<>/-])[A-Za-z\d@$!%*?&#^()_+=[\]{};':"\\|,.<>/-]{8,}$/;

/**
 * Password validation message
 * رسالة التحقق من كلمة المرور
 */
const passwordMessage = {
  ar: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص',
  en: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character',
};

/**
 * Register validation schema
 * مخطط التحقق من التسجيل
 */
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters | الاسم يجب أن يكون حرفين على الأقل',
    'string.max': 'Name cannot exceed 50 characters | الاسم لا يمكن أن يتجاوز 50 حرف',
    'any.required': 'Name is required | الاسم مطلوب',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email | يرجى إدخال بريد إلكتروني صحيح',
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
  }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': `${passwordMessage.en} | ${passwordMessage.ar}`,
      'any.required': 'Password is required | كلمة المرور مطلوبة',
    }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match | كلمات المرور غير متطابقة',
    'any.required': 'Please confirm your password | يرجى تأكيد كلمة المرور',
  }),
});

/**
 * Login validation schema
 * مخطط التحقق من تسجيل الدخول
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email | يرجى إدخال بريد إلكتروني صحيح',
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
  }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required | كلمة المرور مطلوبة',
  }),
});

/**
 * Refresh token validation schema
 * مخطط التحقق من توكن التحديث
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required | توكن التحديث مطلوب',
  }),
});

/**
 * Forgot password validation schema
 * مخطط التحقق من نسيان كلمة المرور
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email | يرجى إدخال بريد إلكتروني صحيح',
    'any.required': 'Email is required | البريد الإلكتروني مطلوب',
  }),
});

/**
 * Reset password validation schema
 * مخطط التحقق من إعادة تعيين كلمة المرور
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required | توكن إعادة التعيين مطلوب',
  }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': `${passwordMessage.en} | ${passwordMessage.ar}`,
      'any.required': 'Password is required | كلمة المرور مطلوبة',
    }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match | كلمات المرور غير متطابقة',
    'any.required': 'Please confirm your password | يرجى تأكيد كلمة المرور',
  }),
});

/**
 * Verify email validation schema
 * مخطط التحقق من تأكيد البريد الإلكتروني
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Verification token is required | توكن التحقق مطلوب',
  }),
});

/**
 * Change password validation schema
 * مخطط التحقق من تغيير كلمة المرور
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required | كلمة المرور الحالية مطلوبة',
  }),

  newPassword: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': `${passwordMessage.en} | ${passwordMessage.ar}`,
      'any.required': 'New password is required | كلمة المرور الجديدة مطلوبة',
    }),

  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match | كلمات المرور غير متطابقة',
    'any.required': 'Please confirm your new password | يرجى تأكيد كلمة المرور الجديدة',
  }),
});

/**
 * Update profile validation schema
 * مخطط التحقق من تحديث الملف الشخصي
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters | الاسم يجب أن يكون حرفين على الأقل',
    'string.max': 'Name cannot exceed 50 characters | الاسم لا يمكن أن يتجاوز 50 حرف',
  }),

  avatar: Joi.string().uri().messages({
    'string.uri': 'Avatar must be a valid URL | الصورة يجب أن تكون رابط صحيح',
  }),
});

/**
 * Google Auth validation schema
 * مخطط التحقق من تسجيل الدخول بجوجل
 */
export const googleAuthSchema = Joi.object({
  idToken: Joi.string().required().messages({
    'any.required': 'Firebase ID token is required | توكن Firebase مطلوب',
  }),
});

/**
 * GitHub Auth validation schema
 * مخطط التحقق من تسجيل الدخول بجيت هب
 */
export const githubAuthSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'GitHub authorization code is required | كود التفويض من GitHub مطلوب',
  }),
});

export const authValidation = {
  register: registerSchema,
  login: loginSchema,
  refreshToken: refreshTokenSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  verifyEmail: verifyEmailSchema,
  changePassword: changePasswordSchema,
  updateProfile: updateProfileSchema,
  googleAuth: googleAuthSchema,
  githubAuth: githubAuthSchema,
};

export default authValidation;
