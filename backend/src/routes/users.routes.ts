/**
 * User Management Routes
 * مسارات إدارة المستخدمين
 */

import { Router } from 'express';
import { userController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';

const router = Router();

// All user management routes require authentication and admin permissions
router.use(authenticate);
router.use(authorize('users:read'));

/**
 * GET /api/v1/users - Get all users
 * الحصول على جميع المستخدمين
 */
router.get('/', userController.getAllUsers);

/**
 * GET /api/v1/users/stats - Get user statistics
 * الحصول على إحصائيات المستخدمين
 */
router.get('/stats', userController.getUserStats);

/**
 * GET /api/v1/users/:id - Get user by ID
 * الحصول على مستخدم بواسطة المعرف
 */
router.get('/:id', validate({ params: idParamsSchema }), userController.getUserById);

/**
 * POST /api/v1/users - Create new user
 * إنشاء مستخدم جديد
 */
router.post('/', authorize('users:create'), userController.createUser);

/**
 * POST /api/v1/users/bulk - Bulk update users
 * تحديث مجموعة من المستخدمين
 */
router.post('/bulk', authorize('users:update'), userController.bulkUpdateUsers);

/**
 * PUT /api/v1/users/:id - Update user
 * تحديث المستخدم
 */
router.put(
  '/:id',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.updateUser
);

/**
 * PUT /api/v1/users/:id/status - Toggle user active status
 * تبديل حالة نشاط المستخدم
 */
router.put(
  '/:id/status',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.toggleUserStatus
);

/**
 * PUT /api/v1/users/:id/unlock - Unlock user account
 * فتح قفل حساب المستخدم
 */
router.put(
  '/:id/unlock',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.unlockUser
);

/**
 * PUT /api/v1/users/:id/password - Reset user password
 * إعادة تعيين كلمة مرور المستخدم
 */
router.put(
  '/:id/password',
  authorize('users:update'),
  validate({ params: idParamsSchema }),
  userController.resetUserPassword
);

/**
 * DELETE /api/v1/users/:id - Delete user
 * حذف المستخدم
 */
router.delete(
  '/:id',
  authorize('users:delete'),
  validate({ params: idParamsSchema }),
  userController.deleteUser
);

export default router;
