/**
 * User Management Controller
 * متحكم إدارة المستخدمين
 */

import { Request, Response } from 'express';
import { User, UserRoles, IUser } from '../models/User';
import { asyncHandler } from '../middlewares';
import { ApiError } from '../utils';
import { validatePasswordStrength } from '../utils/security';

/**
 * Get all users with pagination and filtering
 * الحصول على جميع المستخدمين مع الترقيم والتصفية
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, role, status, search, sort = '-createdAt' } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  if (role && role !== 'all') {
    filter.role = role;
  }

  if (status && status !== 'all') {
    switch (status) {
      case 'active':
        filter.isActive = true;
        filter.lockUntil = { $exists: false };
        break;
      case 'inactive':
        filter.isActive = false;
        break;
      case 'locked':
        filter.lockUntil = { $gt: new Date() };
        break;
      case 'pending':
        filter.isEmailVerified = false;
        break;
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Get total count
  const total = await User.countDocuments(filter);

  // Get users
  const users = await User.find(filter)
    .select('-password -refreshTokens -twoFactorSecret')
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum);

  // Calculate derived status for each user
  const usersWithStatus = users.map(user => {
    let userStatus = 'active';
    if (!user.isActive) userStatus = 'inactive';
    else if (user.lockUntil && user.lockUntil > new Date()) userStatus = 'locked';
    else if (!user.isEmailVerified) userStatus = 'pending';

    return {
      ...user.toJSON(),
      status: userStatus,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      users: usersWithStatus,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * Get user by ID
 * الحصول على مستخدم بواسطة المعرف
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password -refreshTokens -twoFactorSecret');

  if (!user) {
    throw ApiError.notFound('User');
  }

  // Calculate status
  let status = 'active';
  if (!user.isActive) status = 'inactive';
  else if (user.lockUntil && user.lockUntil > new Date()) status = 'locked';
  else if (!user.isEmailVerified) status = 'pending';

  res.status(200).json({
    success: true,
    data: {
      user: {
        ...user.toJSON(),
        status,
      },
    },
  });
});

/**
 * Create new user
 * إنشاء مستخدم جديد
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role = UserRoles.VIEWER, sendInvite } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.emailExists();
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    isEmailVerified: !sendInvite, // If not sending invite, mark as verified
    isActive: true,
  });

  // TODO: Send invite email if sendInvite is true

  res.status(201).json({
    success: true,
    message: 'User created successfully | تم إنشاء المستخدم بنجاح',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    },
  });
});

/**
 * Update user
 * تحديث المستخدم
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;
  const currentUser = req.user as IUser;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  // Prevent modifying super_admin by non-super_admin
  if (user.role === UserRoles.SUPER_ADMIN && currentUser.role !== UserRoles.SUPER_ADMIN) {
    throw ApiError.insufficientPermissions();
  }

  // Prevent demoting yourself if you're the last super_admin
  if (
    currentUser._id.toString() === id &&
    user.role === UserRoles.SUPER_ADMIN &&
    role !== UserRoles.SUPER_ADMIN
  ) {
    const superAdminCount = await User.countDocuments({ role: UserRoles.SUPER_ADMIN });
    if (superAdminCount <= 1) {
      throw ApiError.invalidInput('Cannot demote the last super admin');
    }
  }

  // Check email uniqueness if changed
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.emailExists();
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully | تم تحديث المستخدم بنجاح',
    data: {
      user: user.toJSON(),
    },
  });
});

/**
 * Delete user
 * حذف المستخدم
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user as IUser;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  // Prevent deleting yourself
  if (currentUser._id.toString() === id) {
    throw ApiError.invalidInput('Cannot delete yourself');
  }

  // Prevent deleting super_admin by non-super_admin
  if (user.role === UserRoles.SUPER_ADMIN && currentUser.role !== UserRoles.SUPER_ADMIN) {
    throw ApiError.insufficientPermissions();
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully | تم حذف المستخدم بنجاح',
  });
});

/**
 * Reset user password (admin)
 * إعادة تعيين كلمة مرور المستخدم (إداري)
 */
export const resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;
  const currentUser = req.user as IUser;

  // Validate password is provided
  if (!password || typeof password !== 'string') {
    throw ApiError.validationError({ password: 'Password is required' });
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw ApiError.validationError({
      password: passwordValidation.errors.join(', '),
    });
  }

  const user = await User.findById(id).select('+password');

  if (!user) {
    throw ApiError.notFound('User');
  }

  // Prevent resetting super_admin password by non-super_admin
  if (user.role === UserRoles.SUPER_ADMIN && currentUser.role !== UserRoles.SUPER_ADMIN) {
    throw ApiError.insufficientPermissions();
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully | تم إعادة تعيين كلمة المرور بنجاح',
  });
});

/**
 * Unlock user account
 * فتح قفل حساب المستخدم
 */
export const unlockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User account unlocked | تم فتح قفل حساب المستخدم',
  });
});

/**
 * Toggle user active status
 * تبديل حالة نشاط المستخدم
 */
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user as IUser;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  // Prevent toggling own status
  if (currentUser._id.toString() === id) {
    throw ApiError.invalidInput('Cannot toggle your own status');
  }

  // Prevent toggling super_admin by non-super_admin
  if (user.role === UserRoles.SUPER_ADMIN && currentUser.role !== UserRoles.SUPER_ADMIN) {
    throw ApiError.insufficientPermissions();
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: user.isActive
      ? 'User activated | تم تفعيل المستخدم'
      : 'User deactivated | تم تعطيل المستخدم',
    data: {
      user: user.toJSON(),
    },
  });
});

/**
 * Get user stats
 * الحصول على إحصائيات المستخدمين
 */
export const getUserStats = asyncHandler(async (_req: Request, res: Response) => {
  const total = await User.countDocuments();
  const active = await User.countDocuments({ isActive: true, lockUntil: { $exists: false } });
  const inactive = await User.countDocuments({ isActive: false });
  const locked = await User.countDocuments({ lockUntil: { $gt: new Date() } });
  const pending = await User.countDocuments({ isEmailVerified: false });

  const byRole = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

  const roleStats = Object.values(UserRoles).reduce(
    (acc, role) => {
      const found = byRole.find(r => r._id === role);
      acc[role] = found ? found.count : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  res.status(200).json({
    success: true,
    data: {
      total,
      active,
      inactive,
      locked,
      pending,
      byRole: roleStats,
    },
  });
});

/**
 * Bulk update users
 * تحديث مجموعة من المستخدمين
 */
export const bulkUpdateUsers = asyncHandler(async (req: Request, res: Response) => {
  const { ids, action } = req.body;
  const currentUser = req.user as IUser;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw ApiError.invalidInput('No users selected');
  }

  // Filter out current user from bulk actions
  const filteredIds = ids.filter(id => id !== currentUser._id.toString());

  // Filter out super_admins if current user is not super_admin
  let targetUsers = await User.find({ _id: { $in: filteredIds } });
  if (currentUser.role !== UserRoles.SUPER_ADMIN) {
    targetUsers = targetUsers.filter(u => u.role !== UserRoles.SUPER_ADMIN);
  }

  const targetIds = targetUsers.map(u => u._id);

  let affected = 0;

  switch (action) {
    case 'activate': {
      const activateResult = await User.updateMany({ _id: { $in: targetIds } }, { isActive: true });
      affected = activateResult.modifiedCount;
      break;
    }

    case 'deactivate': {
      const deactivateResult = await User.updateMany(
        { _id: { $in: targetIds } },
        { isActive: false }
      );
      affected = deactivateResult.modifiedCount;
      break;
    }

    case 'unlock': {
      const unlockResult = await User.updateMany(
        { _id: { $in: targetIds } },
        { loginAttempts: 0, $unset: { lockUntil: 1 } }
      );
      affected = unlockResult.modifiedCount;
      break;
    }

    case 'delete': {
      const deleteResult = await User.deleteMany({ _id: { $in: targetIds } });
      affected = deleteResult.deletedCount;
      break;
    }

    default:
      throw ApiError.invalidInput('Invalid action');
  }

  res.status(200).json({
    success: true,
    message: `${affected} users ${action}d successfully`,
    data: { affected },
  });
});

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  unlockUser,
  toggleUserStatus,
  getUserStats,
  bulkUpdateUsers,
};
