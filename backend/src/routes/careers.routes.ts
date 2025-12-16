/**
 * Careers Routes
 * مسارات الوظائف
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { careersController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema, jobIdParamsSchema } from '../middlewares/validate';
import { csrfValidation } from '../middlewares/csrf';
import { careersValidation } from '../validations';
import { resumeUpload } from '../utils/upload';

const router = Router();

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Rate limit for job applications (3 per hour per IP)
const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    message:
      'Too many job applications submitted. Please try again later | تم إرسال طلبات كثيرة. يرجى المحاولة لاحقاً',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for resume uploads (10 per hour per IP)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    message:
      'Too many file uploads. Please try again later | تم رفع ملفات كثيرة. يرجى المحاولة لاحقاً',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// Public Routes - Jobs
// المسارات العامة - الوظائف
// ============================================

// GET /api/v1/careers/jobs/featured - Get featured jobs
router.get('/jobs/featured', careersController.getFeaturedJobs);

// GET /api/v1/careers/jobs/:slug - Get job by slug
router.get('/jobs/:slug', careersController.getJobBySlug);

// GET /api/v1/careers/jobs - Get open jobs
router.get('/jobs', careersController.getJobs);

// ============================================
// Public Routes - Applications
// المسارات العامة - الطلبات
// ============================================

// POST /api/v1/careers/upload-resume - Upload resume file
router.post(
  '/upload-resume',
  uploadLimiter,
  csrfValidation,
  resumeUpload.single('resume'),
  careersController.uploadResume
);

// POST /api/v1/careers/apply - Submit job application
router.post(
  '/apply',
  applicationLimiter,
  csrfValidation,
  validate({ body: careersValidation.createApplication }),
  careersController.submitApplication
);

// ============================================
// Admin Routes - Jobs
// مسارات المسؤول - الوظائف
// ============================================

// GET /api/v1/careers/admin/jobs - Get all jobs (Admin)
router.get('/admin/jobs', authenticate, authorize('careers:read'), careersController.getAllJobs);

// GET /api/v1/careers/admin/jobs/:id - Get job by ID (Admin)
router.get(
  '/admin/jobs/:id',
  authenticate,
  authorize('careers:read'),
  validate({ params: idParamsSchema }),
  careersController.getJobById
);

// POST /api/v1/careers/admin/jobs - Create job (Admin)
router.post(
  '/admin/jobs',
  authenticate,
  authorize('careers:create'),
  validate({ body: careersValidation.createJob }),
  careersController.createJob
);

// PUT /api/v1/careers/admin/jobs/bulk-status - Bulk update jobs status (Admin)
router.put(
  '/admin/jobs/bulk-status',
  authenticate,
  authorize('careers:update'),
  careersController.bulkUpdateJobStatus
);

// PUT /api/v1/careers/admin/jobs/:id - Update job (Admin)
router.put(
  '/admin/jobs/:id',
  authenticate,
  authorize('careers:update'),
  validate({ params: idParamsSchema, body: careersValidation.updateJob }),
  careersController.updateJob
);

// DELETE /api/v1/careers/admin/jobs/:id - Delete job (Admin)
router.delete(
  '/admin/jobs/:id',
  authenticate,
  authorize('careers:delete'),
  validate({ params: idParamsSchema }),
  careersController.deleteJob
);

// ============================================
// Admin Routes - Applications
// مسارات المسؤول - الطلبات
// ============================================

// GET /api/v1/careers/admin/applications - Get all applications (Admin)
router.get(
  '/admin/applications',
  authenticate,
  authorize('careers:read'),
  careersController.getAllApplications
);

// GET /api/v1/careers/admin/applications/:id - Get application by ID (Admin)
router.get(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:read'),
  validate({ params: idParamsSchema }),
  careersController.getApplicationById
);

// PUT /api/v1/careers/admin/applications/bulk-status - Bulk update applications status (Admin)
router.put(
  '/admin/applications/bulk-status',
  authenticate,
  authorize('careers:update'),
  careersController.bulkUpdateApplicationStatus
);

// PUT /api/v1/careers/admin/applications/:id - Update application status (Admin)
router.put(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:update'),
  validate({ params: idParamsSchema, body: careersValidation.updateApplication }),
  careersController.updateApplicationStatus
);

// DELETE /api/v1/careers/admin/applications/:id - Delete application (Admin)
router.delete(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:delete'),
  validate({ params: idParamsSchema }),
  careersController.deleteApplication
);

// GET /api/v1/careers/admin/jobs/:jobId/applications - Get applications for a job (Admin)
router.get(
  '/admin/jobs/:jobId/applications',
  authenticate,
  authorize('careers:read'),
  validate({ params: jobIdParamsSchema }),
  careersController.getApplicationsByJob
);

// GET /api/v1/careers/admin/jobs/:jobId/stats - Get application stats for a job (Admin)
router.get(
  '/admin/jobs/:jobId/stats',
  authenticate,
  authorize('careers:read'),
  validate({ params: jobIdParamsSchema }),
  careersController.getApplicationStats
);

export default router;
