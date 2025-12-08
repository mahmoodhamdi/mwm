/**
 * Careers Controller
 * متحكم الوظائف
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Job, JobApplication, Department } from '../models';
import { careersValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse, paginatedResponse } from '../utils/response';
import { redis } from '../config';

const JOB_CACHE_PREFIX = 'careers-job';
const CACHE_TTL = 1800; // 30 minutes

// ============================================
// Public Job Controllers
// ============================================

/**
 * Get open jobs (Public)
 * جلب الوظائف المفتوحة (عام)
 */
export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    department,
    type,
    experienceLevel,
    featured,
    locale,
    search,
  } = req.query;

  const cacheKey = `${JOB_CACHE_PREFIX}:list:${page}:${limit}:${department || 'all'}:${type || 'all'}:${experienceLevel || 'all'}:${featured || 'all'}:${locale || 'all'}:${search || 'none'}`;

  // Try cache first (skip if search is provided)
  if (!search) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return successResponse(res, JSON.parse(cached));
    }
  }

  const { jobs, total } = await Job.getOpenJobs({
    department: department as string,
    type: type as 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote',
    experienceLevel: experienceLevel as 'entry' | 'mid' | 'senior' | 'lead' | 'executive',
    locale: locale as 'ar' | 'en',
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    limit: Number(limit),
    page: Number(page),
    search: search as string,
  });

  const result = {
    jobs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };

  // Cache the result (skip if search is provided)
  if (!search) {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  }

  return successResponse(res, result);
});

/**
 * Get job by slug (Public)
 * جلب الوظيفة بالرابط المختصر (عام)
 */
export const getJobBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${JOB_CACHE_PREFIX}:${slug}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { job: JSON.parse(cached) });
  }

  const job = await Job.getBySlug(slug, locale);

  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(job));

  return successResponse(res, { job });
});

/**
 * Get featured jobs (Public)
 * جلب الوظائف المميزة (عام)
 */
export const getFeaturedJobs = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5, locale } = req.query;

  const cacheKey = `${JOB_CACHE_PREFIX}:featured:${limit}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, { jobs: JSON.parse(cached) });
  }

  const jobs = await Job.getFeaturedJobs(Number(limit), locale as 'ar' | 'en' | undefined);

  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(jobs));

  return successResponse(res, { jobs });
});

// ============================================
// Public Application Controllers
// ============================================

/**
 * Submit job application (Public)
 * تقديم طلب التوظيف (عام)
 */
export const submitApplication = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = careersValidation.createApplication.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if job exists and is open
  const job = await Job.findOne({
    _id: value.job,
    status: 'open',
    $or: [{ applicationDeadline: { $gte: new Date() } }, { applicationDeadline: null }],
  });

  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  // Check if already applied
  const hasApplied = await JobApplication.hasApplied(value.email, value.job);
  if (hasApplied) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'email',
        message: 'You have already applied for this job | لقد تقدمت بالفعل لهذه الوظيفة',
      },
    ]);
  }

  const application = await JobApplication.create(value);

  // Increment applications count
  await Job.incrementApplicationsCount(value.job);

  return successResponse(
    res,
    {
      message: 'Application submitted successfully | تم تقديم الطلب بنجاح',
      application: {
        _id: application._id,
        job: application.job,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        status: application.status,
        createdAt: application.createdAt,
      },
    },
    201
  );
});

// ============================================
// Admin Job Controllers
// ============================================

/**
 * Get all jobs (Admin)
 * جلب جميع الوظائف (للمسؤول)
 */
export const getAllJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    department,
    type,
    experienceLevel,
    status,
    featured,
    search,
  } = req.query;

  const filter: Record<string, unknown> = {};

  if (department) {
    filter.department = department;
  }

  if (type) {
    filter.type = type;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (status) {
    filter.status = status;
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (search) {
    filter.$or = [
      { 'title.ar': { $regex: search, $options: 'i' } },
      { 'title.en': { $regex: search, $options: 'i' } },
      { 'description.ar': { $regex: search, $options: 'i' } },
      { 'description.en': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('department', 'name slug')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return paginatedResponse(res, {
    data: jobs,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Get job by ID (Admin)
 * جلب الوظيفة بالمعرف (للمسؤول)
 */
export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id)
    .populate('department', 'name slug')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  return successResponse(res, { job });
});

/**
 * Create job (Admin)
 * إنشاء وظيفة (للمسؤول)
 */
export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = careersValidation.createJob.validate(req.body, {
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
  const existingJob = await Job.findOne({ slug: value.slug });
  if (existingJob) {
    throw Errors.SLUG_EXISTS();
  }

  const job = await Job.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateJobCache();

  return successResponse(
    res,
    {
      message: 'Job created successfully | تم إنشاء الوظيفة بنجاح',
      job,
    },
    201
  );
});

/**
 * Update job (Admin)
 * تحديث وظيفة (للمسؤول)
 */
export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = careersValidation.updateJob.validate(req.body, {
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
    const existingJob = await Job.findOne({
      slug: value.slug,
      _id: { $ne: id },
    });
    if (existingJob) {
      throw Errors.SLUG_EXISTS();
    }
  }

  const job = await Job.findByIdAndUpdate(
    id,
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  ).populate('department', 'name slug');

  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  // Invalidate cache
  await invalidateJobCache();

  return successResponse(res, {
    message: 'Job updated successfully | تم تحديث الوظيفة بنجاح',
    job,
  });
});

/**
 * Delete job (Admin)
 * حذف وظيفة (للمسؤول)
 */
export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if job has applications
  const applicationsCount = await JobApplication.countDocuments({ job: id });
  if (applicationsCount > 0) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'job',
        message: `Cannot delete job with ${applicationsCount} applications | لا يمكن حذف وظيفة تحتوي على ${applicationsCount} طلبات`,
      },
    ]);
  }

  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  // Invalidate cache
  await invalidateJobCache();

  return successResponse(res, {
    message: 'Job deleted successfully | تم حذف الوظيفة بنجاح',
  });
});

/**
 * Bulk update jobs status (Admin)
 * تحديث حالة الوظائف بالجملة (للمسؤول)
 */
export const bulkUpdateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw Errors.VALIDATION_ERROR([
      { field: 'ids', message: 'IDs array is required | مصفوفة المعرفات مطلوبة' },
    ]);
  }

  if (!['draft', 'open', 'closed', 'filled'].includes(status)) {
    throw Errors.VALIDATION_ERROR([
      { field: 'status', message: 'Invalid status | الحالة غير صالحة' },
    ]);
  }

  const result = await Job.updateMany(
    { _id: { $in: ids.map((id: string) => new mongoose.Types.ObjectId(id)) } },
    { $set: { status, updatedBy: req.user?._id } }
  );

  // Invalidate cache
  await invalidateJobCache();

  return successResponse(res, {
    message: `${result.modifiedCount} jobs updated successfully | تم تحديث ${result.modifiedCount} وظائف بنجاح`,
    modifiedCount: result.modifiedCount,
  });
});

// ============================================
// Admin Application Controllers
// ============================================

/**
 * Get applications for a job (Admin)
 * جلب الطلبات للوظيفة (للمسؤول)
 */
export const getApplicationsByJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  const { applications, total } = await JobApplication.getByJob(jobId, {
    status: status as
      | 'pending'
      | 'reviewing'
      | 'shortlisted'
      | 'interviewed'
      | 'offered'
      | 'hired'
      | 'rejected'
      | 'withdrawn'
      | undefined,
    limit: Number(limit),
    page: Number(page),
  });

  return paginatedResponse(res, {
    data: applications,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Get all applications (Admin)
 * جلب جميع الطلبات (للمسؤول)
 */
export const getAllApplications = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, job, status, email } = req.query;

  const filter: Record<string, unknown> = {};

  if (job) {
    filter.job = job;
  }

  if (status) {
    filter.status = status;
  }

  if (email) {
    filter.email = { $regex: email, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await JobApplication.countDocuments(filter);

  const applications = await JobApplication.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('job', 'title slug')
    .populate('reviewedBy', 'name email');

  return paginatedResponse(res, {
    data: applications,
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

/**
 * Get application by ID (Admin)
 * جلب الطلب بالمعرف (للمسؤول)
 */
export const getApplicationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await JobApplication.getById(id);

  if (!application) {
    throw Errors.NOT_FOUND('Application | الطلب');
  }

  return successResponse(res, { application });
});

/**
 * Update application status (Admin)
 * تحديث حالة الطلب (للمسؤول)
 */
export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = careersValidation.updateApplication.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const application = await JobApplication.updateStatus(
    id,
    value.status,
    req.user?._id?.toString(),
    value.notes
  );

  if (!application) {
    throw Errors.NOT_FOUND('Application | الطلب');
  }

  // Update rating if provided
  if (value.rating !== undefined) {
    application.rating = value.rating;
    await application.save();
  }

  return successResponse(res, {
    message: 'Application updated successfully | تم تحديث الطلب بنجاح',
    application,
  });
});

/**
 * Delete application (Admin)
 * حذف طلب (للمسؤول)
 */
export const deleteApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await JobApplication.findByIdAndDelete(id);

  if (!application) {
    throw Errors.NOT_FOUND('Application | الطلب');
  }

  return successResponse(res, {
    message: 'Application deleted successfully | تم حذف الطلب بنجاح',
  });
});

/**
 * Bulk update application status (Admin)
 * تحديث حالة الطلبات بالجملة (للمسؤول)
 */
export const bulkUpdateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = careersValidation.bulkUpdateApplicationStatus.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const result = await JobApplication.updateMany(
    { _id: { $in: value.ids.map((id: string) => new mongoose.Types.ObjectId(id)) } },
    {
      $set: {
        status: value.status,
        reviewedBy: req.user?._id,
        reviewedAt: new Date(),
      },
    }
  );

  return successResponse(res, {
    message: `${result.modifiedCount} applications updated successfully | تم تحديث ${result.modifiedCount} طلبات بنجاح`,
    modifiedCount: result.modifiedCount,
  });
});

/**
 * Get application statistics for a job (Admin)
 * جلب إحصائيات الطلبات للوظيفة (للمسؤول)
 */
export const getApplicationStats = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw Errors.NOT_FOUND('Job | الوظيفة');
  }

  const stats = await JobApplication.getStatsByJob(jobId);

  return successResponse(res, {
    job: {
      _id: job._id,
      title: job.title,
      applicationsCount: job.applicationsCount,
    },
    stats,
  });
});

// ============================================
// Helper Functions
// ============================================

/**
 * Invalidate job cache
 * إبطال ذاكرة التخزين المؤقت للوظائف
 */
async function invalidateJobCache() {
  const keys = await redis.keys(`${JOB_CACHE_PREFIX}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export const careersController = {
  // Public Jobs
  getJobs,
  getJobBySlug,
  getFeaturedJobs,
  // Public Applications
  submitApplication,
  // Admin Jobs
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  bulkUpdateJobStatus,
  // Admin Applications
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  bulkUpdateApplicationStatus,
  getApplicationStats,
};

export default careersController;
