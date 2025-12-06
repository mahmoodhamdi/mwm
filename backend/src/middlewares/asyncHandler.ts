/**
 * Async Handler Middleware
 * برمجيات معالجة العمليات غير المتزامنة
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async handler type
 */
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wrap async route handlers to catch errors
 * تغليف معالجات المسارات غير المتزامنة لالتقاط الأخطاء
 *
 * @param fn - Async function to wrap
 * @returns Express middleware
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
