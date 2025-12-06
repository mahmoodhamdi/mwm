/**
 * Error Handler Middleware
 * وسيط معالجة الأخطاء
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';
import { ApiError } from '../utils/ApiError';
import { ERROR_CODES, HTTP_STATUS } from '@mwm/shared';

// Error messages in Arabic and English
const errorMessages: Record<string, { ar: string; en: string }> = {
  UNAUTHORIZED: {
    ar: 'غير مصرح بالوصول',
    en: 'Unauthorized access',
  },
  INVALID_CREDENTIALS: {
    ar: 'بيانات الدخول غير صحيحة',
    en: 'Invalid credentials',
  },
  TOKEN_EXPIRED: {
    ar: 'انتهت صلاحية الجلسة',
    en: 'Session expired',
  },
  VALIDATION_ERROR: {
    ar: 'خطأ في البيانات المدخلة',
    en: 'Validation error',
  },
  NOT_FOUND: {
    ar: 'غير موجود',
    en: 'Not found',
  },
  EMAIL_EXISTS: {
    ar: 'البريد الإلكتروني مستخدم بالفعل',
    en: 'Email already exists',
  },
  TOO_MANY_REQUESTS: {
    ar: 'طلبات كثيرة، حاول لاحقاً',
    en: 'Too many requests, please try again later',
  },
  INTERNAL_ERROR: {
    ar: 'حدث خطأ غير متوقع',
    en: 'An unexpected error occurred',
  },
};

/**
 * Get localized error message
 * الحصول على رسالة الخطأ المترجمة
 */
function getLocalizedMessage(code: string, locale: string): string {
  const messages = errorMessages[code];
  if (!messages) {
    return locale === 'ar' ? 'حدث خطأ' : 'An error occurred';
  }
  return locale === 'ar' ? messages.ar : messages.en;
}

/**
 * Error handler middleware
 * وسيط معالجة الأخطاء
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Get locale from Accept-Language header
  const locale = req.headers['accept-language']?.startsWith('ar') ? 'ar' : 'en';

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: getLocalizedMessage(err.code, locale) || err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: getLocalizedMessage(ERROR_CODES.VALIDATION_ERROR, locale),
        details: err.message,
      },
    });
    return;
  }

  // Handle Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: {
        code: ERROR_CODES.ALREADY_EXISTS,
        message: getLocalizedMessage(ERROR_CODES.ALREADY_EXISTS, locale),
      },
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_TOKEN,
        message: getLocalizedMessage(ERROR_CODES.UNAUTHORIZED, locale),
      },
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.TOKEN_EXPIRED,
        message: getLocalizedMessage(ERROR_CODES.TOKEN_EXPIRED, locale),
      },
    });
    return;
  }

  // Default server error
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: getLocalizedMessage(ERROR_CODES.INTERNAL_ERROR, locale),
    },
  });
}
