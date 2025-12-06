/**
 * API Error Class
 * فئة أخطاء الـ API
 */

import { HTTP_STATUS, ERROR_CODES } from '@mwm/shared';

/**
 * Custom API Error class
 * فئة خطأ API مخصصة
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create pre-defined errors
   * إنشاء أخطاء محددة مسبقاً
   */

  // Auth errors | أخطاء المصادقة
  static unauthorized(message?: string): ApiError {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      message || 'Unauthorized'
    );
  }

  static invalidCredentials(): ApiError {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS,
      'Invalid credentials'
    );
  }

  static tokenExpired(): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED, 'Token expired');
  }

  static invalidToken(): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_TOKEN, 'Invalid token');
  }

  static insufficientPermissions(): ApiError {
    return new ApiError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS,
      'Insufficient permissions'
    );
  }

  // Validation errors | أخطاء التحقق
  static validationError(details: unknown): ApiError {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      'Validation error',
      true,
      details
    );
  }

  static invalidInput(message?: string): ApiError {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_INPUT,
      message || 'Invalid input'
    );
  }

  // Resource errors | أخطاء الموارد
  static notFound(resource: string): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, `${resource} not found`);
  }

  static alreadyExists(resource: string): ApiError {
    return new ApiError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.ALREADY_EXISTS,
      `${resource} already exists`
    );
  }

  static emailExists(): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, ERROR_CODES.EMAIL_EXISTS, 'Email already exists');
  }

  static slugExists(): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, ERROR_CODES.SLUG_EXISTS, 'Slug already exists');
  }

  // Rate limiting | التحكم في معدل الطلبات
  static tooManyRequests(): ApiError {
    return new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.TOO_MANY_REQUESTS,
      'Too many requests'
    );
  }

  // Server errors | أخطاء الخادم
  static internalError(message?: string): ApiError {
    return new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR,
      message || 'Internal server error',
      false
    );
  }

  static serviceUnavailable(): ApiError {
    return new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      'Service unavailable'
    );
  }

  static emailNotVerified(): ApiError {
    return new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'EMAIL_NOT_VERIFIED',
      'Email not verified | البريد الإلكتروني غير مؤكد'
    );
  }
}

/**
 * Errors factory object for convenient error creation
 * كائن مصنع الأخطاء لإنشاء الأخطاء بسهولة
 */
export const Errors = {
  UNAUTHORIZED: (msg?: string) => ApiError.unauthorized(msg),
  INVALID_CREDENTIALS: () => ApiError.invalidCredentials(),
  TOKEN_EXPIRED: () => ApiError.tokenExpired(),
  INVALID_TOKEN: () => ApiError.invalidToken(),
  INSUFFICIENT_PERMISSIONS: () => ApiError.insufficientPermissions(),
  VALIDATION_ERROR: (details: unknown) => ApiError.validationError(details),
  INVALID_INPUT: (msg?: string) => ApiError.invalidInput(msg),
  NOT_FOUND: (resource: string) => ApiError.notFound(resource),
  ALREADY_EXISTS: (resource: string) => ApiError.alreadyExists(resource),
  EMAIL_EXISTS: () => ApiError.emailExists(),
  SLUG_EXISTS: () => ApiError.slugExists(),
  TOO_MANY_REQUESTS: () => ApiError.tooManyRequests(),
  INTERNAL_ERROR: (msg?: string) => ApiError.internalError(msg),
  SERVICE_UNAVAILABLE: () => ApiError.serviceUnavailable(),
  EMAIL_NOT_VERIFIED: () => ApiError.emailNotVerified(),
};
