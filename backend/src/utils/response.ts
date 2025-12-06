/**
 * API Response Utilities
 * أدوات استجابة API
 */

import { Response } from 'express';

/**
 * Pagination metadata
 * بيانات الترقيم
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Standard API response structure
 * هيكل استجابة API القياسي
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: PaginationMeta;
  meta?: Record<string, unknown>;
}

/**
 * Send success response
 * إرسال استجابة نجاح
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: {
    message?: string;
    statusCode?: number;
    pagination?: PaginationMeta;
    meta?: Record<string, unknown>;
  }
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (options?.message) {
    response.message = options.message;
  }

  if (options?.pagination) {
    response.pagination = options.pagination;
  }

  if (options?.meta) {
    response.meta = options.meta;
  }

  return res.status(options?.statusCode ?? 200).json(response);
}

/**
 * Send created response (201)
 * إرسال استجابة الإنشاء
 */
export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, {
    message: message ?? 'Resource created successfully',
    statusCode: 201,
  });
}

/**
 * Send no content response (204)
 * إرسال استجابة بدون محتوى
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send paginated response
 * إرسال استجابة مرقمة
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  meta?: Record<string, unknown>
): Response {
  return sendSuccess(res, data, { pagination, ...(meta && { meta }) });
}

/**
 * Helper: Success response (alias for sendSuccess)
 * مساعد: استجابة النجاح
 */
export function successResponse<T>(res: Response, data: T, statusCode: number = 200): Response {
  return sendSuccess(res, data, { statusCode });
}

/**
 * Helper: Paginated response
 * مساعد: استجابة مرقمة
 */
export function paginatedResponse<T>(
  res: Response,
  options: {
    data: T[];
    page: number;
    limit: number;
    total: number;
  }
): Response {
  const { data, page, limit, total } = options;
  const totalPages = Math.ceil(total / limit);

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return sendPaginated(res, data, pagination);
}

/**
 * Send error response
 * إرسال استجابة خطأ
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    response.error!.details = details;
  }

  return res.status(statusCode).json(response);
}

export default {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendError,
  successResponse,
  paginatedResponse,
};
