/**
 * Not Found Handler Middleware
 * وسيط معالجة الصفحات غير الموجودة
 */

import { Request, Response } from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../utils/ApiError';

/**
 * Not found handler
 * معالج الصفحات غير الموجودة
 */
export function notFoundHandler(req: Request, res: Response): void {
  const locale = req.headers['accept-language']?.startsWith('ar') ? 'ar' : 'en';

  const message =
    locale === 'ar' ? `المسار ${req.originalUrl} غير موجود` : `Route ${req.originalUrl} not found`;

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message,
    },
  });
}
