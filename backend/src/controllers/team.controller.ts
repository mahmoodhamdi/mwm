/**
 * Team Controller
 * متحكم الفريق
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { TeamMember, Department } from '../models';
import { teamValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { redis } from '../config';
import { escapeRegex } from '../utils/security';

const TEAM_CACHE_PREFIX = 'team';
const DEPARTMENT_CACHE_PREFIX = 'department';
const CACHE_TTL = 1800; // 30 minutes

// ============================================
// Department Controllers
// ============================================

/**
 * Get all departments (Public)
 * جلب جميع الأقسام (عام)
 */
export const getDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = `${DEPARTMENT_CACHE_PREFIX}:all`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { departments: JSON.parse(cached) });
  }

  const departments = await Department.getActiveDepartments();

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(departments));

  return successResponse(res, { departments });
});

/**
 * Get department by slug (Public)
 * جلب القسم بالرابط المختصر (عام)
 */
export const getDepartmentBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const cacheKey = `${DEPARTMENT_CACHE_PREFIX}:${slug}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { department: JSON.parse(cached) });
  }

  const department = await Department.getBySlug(slug);

  if (!department) {
    throw Errors.NOT_FOUND('Department | القسم');
  }

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(department));

  return successResponse(res, { department });
});

/**
 * Get all departments (Admin)
 * جلب جميع الأقسام (للمسؤول)
 */
export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  const { isActive, search } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 20,
    maxLimit: 100,
  });

  const filter: Record<string, unknown> = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'name.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'name.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const total = await Department.countDocuments(filter);
  const departments = await Department.find(filter).sort({ order: 1 }).skip(skip).limit(limit);

  return paginatedResponse(res, {
    data: departments,
    page,
    limit,
    total,
  });
});

/**
 * Create department (Admin)
 * إنشاء قسم (للمسؤول)
 */
export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = teamValidation.createDepartment.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists
  const existingDepartment = await Department.findOne({ slug: value.slug });
  if (existingDepartment) {
    throw Errors.SLUG_EXISTS();
  }

  const department = await Department.create(value);

  // Invalidate cache
  await invalidateDepartmentCache();

  return successResponse(
    res,
    {
      message: 'Department created successfully | تم إنشاء القسم بنجاح',
      department,
    },
    201
  );
});

/**
 * Update department (Admin)
 * تحديث قسم (للمسؤول)
 */
export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = teamValidation.updateDepartment.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingDepartment = await Department.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingDepartment) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const department = await Department.findByIdAndUpdate(id, value, {
    new: true,
    runValidators: true,
  });

  if (!department) {
    throw Errors.NOT_FOUND('Department | القسم');
  }

  // Invalidate cache
  await invalidateDepartmentCache();

  return successResponse(res, {
    message: 'Department updated successfully | تم تحديث القسم بنجاح',
    department,
  });
});

/**
 * Delete department (Admin)
 * حذف قسم (للمسؤول)
 */
export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if department has members
  const membersCount = await TeamMember.countDocuments({ department: id });
  if (membersCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'department',
        message: `Cannot delete department with ${membersCount} members | لا يمكن حذف قسم يحتوي على ${membersCount} أعضاء`,
      },
    ]);
  }

  const department = await Department.findByIdAndDelete(id);

  if (!department) {
    throw Errors.NOT_FOUND('Department | القسم');
  }

  // Invalidate cache
  await invalidateDepartmentCache();

  return successResponse(res, {
    message: 'Department deleted successfully | تم حذف القسم بنجاح',
  });
});

// ============================================
// Team Member Controllers
// ============================================

/**
 * Get team members (Public)
 * جلب أعضاء الفريق (عام)
 */
export const getTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const { department } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 12,
    maxLimit: 100,
  });

  const cacheKey = `${TEAM_CACHE_PREFIX}:list:${page}:${limit}:${department || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, JSON.parse(cached));
  }

  const filter: Record<string, unknown> = { isActive: true };

  if (department) {
    // Check if it's an ObjectId or slug
    if (mongoose.isValidObjectId(department)) {
      filter.department = department;
    } else {
      // Find department by slug
      const dept = await Department.findOne({ slug: department });
      if (dept) {
        filter.department = dept._id;
      }
    }
  }

  const total = await TeamMember.countDocuments(filter);
  const members = await TeamMember.find(filter)
    .sort({ order: 1 })
    .skip(skip)
    .limit(limit)
    .populate('department', 'name slug');

  const result = {
    members,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  return successResponse(res, result);
});

/**
 * Get team member by slug (Public)
 * جلب عضو الفريق بالرابط المختصر (عام)
 */
export const getMemberBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const member = await TeamMember.getBySlug(slug);

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  return successResponse(res, { member });
});

/**
 * Get featured team members (Public)
 * جلب أعضاء الفريق المميزين (عام)
 */
export const getFeaturedMembers = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 6 } = req.query;

  const cacheKey = `${TEAM_CACHE_PREFIX}:featured:${limit}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { members: JSON.parse(cached) });
  }

  const members = await TeamMember.getFeaturedMembers(Number(limit));

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(members));

  return successResponse(res, { members });
});

/**
 * Get team leaders (Public)
 * جلب قادة الفريق (عام)
 */
export const getLeaders = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = `${TEAM_CACHE_PREFIX}:leaders`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { leaders: JSON.parse(cached) });
  }

  const leaders = await TeamMember.getLeaders();

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(leaders));

  return successResponse(res, { leaders });
});

/**
 * Get all team members (Admin)
 * جلب جميع أعضاء الفريق (للمسؤول)
 */
export const getAllMembers = asyncHandler(async (req: Request, res: Response) => {
  const {
    department,
    featured,
    leaders,
    isActive,
    search,
    sortBy = 'order',
    sortOrder = 'asc',
  } = req.query;

  // Use validated pagination utility
  const { page, limit, skip } = parsePagination({
    page: req.query.page,
    limit: req.query.limit,
    defaultLimit: 12,
    maxLimit: 100,
  });

  const filter: Record<string, unknown> = {};

  if (department) {
    // Check if it's an ObjectId or slug
    if (mongoose.isValidObjectId(department)) {
      filter.department = department;
    } else {
      // Find department by slug
      const dept = await Department.findOne({ slug: department });
      if (dept) {
        filter.department = dept._id;
      }
    }
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (leaders !== undefined) {
    filter.isLeader = leaders === 'true';
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    const escapedSearch = escapeRegex(search as string);
    filter.$or = [
      { 'name.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'name.en': { $regex: escapedSearch, $options: 'i' } },
      { 'position.ar': { $regex: escapedSearch, $options: 'i' } },
      { 'position.en': { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const total = await TeamMember.countDocuments(filter);

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy as string]: sortOrder === 'desc' ? -1 : 1,
  };

  const members = await TeamMember.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('department', 'name slug')
    .populate('createdBy', 'name email');

  return paginatedResponse(res, {
    data: members,
    page,
    limit,
    total,
  });
});

/**
 * Get team member by ID (Admin)
 * جلب عضو الفريق بالمعرف (للمسؤول)
 */
export const getMemberById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await TeamMember.findById(id)
    .populate('department', 'name slug')
    .populate('projects', 'title slug thumbnail')
    .populate('createdBy', 'name email');

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  return successResponse(res, { member });
});

/**
 * Create team member (Admin)
 * إنشاء عضو فريق (للمسؤول)
 */
export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = teamValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if department exists
  const department = await Department.findById(value.department);
  if (!department) {
    throw Errors.NOT_FOUND('Department | القسم');
  }

  // Check if slug already exists
  const existingMember = await TeamMember.findOne({ slug: value.slug });
  if (existingMember) {
    throw Errors.SLUG_EXISTS();
  }

  const member = await TeamMember.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(
    res,
    {
      message: 'Team member created successfully | تم إنشاء عضو الفريق بنجاح',
      member,
    },
    201
  );
});

/**
 * Update team member (Admin)
 * تحديث عضو فريق (للمسؤول)
 */
export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = teamValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if department exists (if updating department)
  if (value.department) {
    const department = await Department.findById(value.department);
    if (!department) {
      throw Errors.NOT_FOUND('Department | القسم');
    }
  }

  // Check if slug already exists (if updating slug)
  if (value.slug) {
    const existingMember = await TeamMember.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingMember) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const member = await TeamMember.findByIdAndUpdate(
    id,
    { ...value, updatedBy: req.user?._id },
    {
      new: true,
      runValidators: true,
    }
  ).populate('department', 'name slug');

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: 'Team member updated successfully | تم تحديث عضو الفريق بنجاح',
    member,
  });
});

/**
 * Delete team member (Admin)
 * حذف عضو فريق (للمسؤول)
 */
export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await TeamMember.findByIdAndDelete(id);

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: 'Team member deleted successfully | تم حذف عضو الفريق بنجاح',
  });
});

/**
 * Reorder team members (Admin)
 * إعادة ترتيب أعضاء الفريق (للمسؤول)
 */
export const reorderMembers = asyncHandler(async (req: Request, res: Response) => {
  const { members } = req.body;

  if (!Array.isArray(members)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'members', message: 'Members must be an array | الأعضاء يجب أن يكونوا مصفوفة' },
    ]);
  }

  const operations = members.map((item: { id: string; order: number }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id) },
      update: { $set: { order: item.order } },
    },
  }));

  await TeamMember.bulkWrite(operations);

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: 'Team members reordered successfully | تم إعادة ترتيب أعضاء الفريق بنجاح',
  });
});

/**
 * Toggle member active status (Admin)
 * تبديل حالة نشاط العضو (للمسؤول)
 */
export const toggleActiveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await TeamMember.findById(id);

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  member.isActive = !member.isActive;
  await member.save();

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: member.isActive
      ? 'Team member activated successfully | تم تفعيل عضو الفريق بنجاح'
      : 'Team member deactivated successfully | تم إلغاء تفعيل عضو الفريق بنجاح',
    member,
  });
});

/**
 * Toggle member featured status (Admin)
 * تبديل حالة تمييز العضو (للمسؤول)
 */
export const toggleFeaturedStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await TeamMember.findById(id);

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  member.isFeatured = !member.isFeatured;
  await member.save();

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: member.isFeatured
      ? 'Team member marked as featured | تم تمييز عضو الفريق'
      : 'Team member unmarked as featured | تم إلغاء تمييز عضو الفريق',
    member,
  });
});

/**
 * Toggle member leader status (Admin)
 * تبديل حالة قيادة العضو (للمسؤول)
 */
export const toggleLeaderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await TeamMember.findById(id);

  if (!member) {
    throw Errors.NOT_FOUND('Team Member | عضو الفريق');
  }

  member.isLeader = !member.isLeader;
  await member.save();

  // Invalidate cache
  await invalidateTeamCache();

  return successResponse(res, {
    message: member.isLeader
      ? 'Team member marked as leader | تم تعيين العضو كقائد'
      : 'Team member unmarked as leader | تم إلغاء تعيين العضو كقائد',
    member,
  });
});

// ============================================
// Helper Functions
// ============================================

/**
 * Invalidate team cache
 * إبطال ذاكرة التخزين المؤقت للفريق
 */
async function invalidateTeamCache() {
  const keys = await redis.keys(`${TEAM_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Invalidate department cache
 * إبطال ذاكرة التخزين المؤقت للأقسام
 */
async function invalidateDepartmentCache() {
  const keys = await redis.keys(`${DEPARTMENT_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export const teamController = {
  // Departments
  getDepartments,
  getDepartmentBySlug,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  // Team Members
  getTeamMembers,
  getMemberBySlug,
  getFeaturedMembers,
  getLeaders,
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  reorderMembers,
  toggleActiveStatus,
  toggleFeaturedStatus,
  toggleLeaderStatus,
};

export default teamController;
