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

/**
 * @swagger
 * tags:
 *   - name: Careers
 *     description: Public job listings and applications
 *   - name: Careers Admin
 *     description: Job and application management (Admin only)
 */

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

/**
 * @swagger
 * /careers/jobs/featured:
 *   get:
 *     summary: Get featured jobs
 *     description: Retrieve all featured job listings
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: List of featured jobs
 */
router.get('/jobs/featured', careersController.getFeaturedJobs);

/**
 * @swagger
 * /careers/jobs/{slug}:
 *   get:
 *     summary: Get job by slug
 *     description: Retrieve a single job listing by its slug
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Job slug (URL-friendly identifier)
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/jobs/:slug', careersController.getJobBySlug);

/**
 * @swagger
 * /careers/jobs:
 *   get:
 *     summary: Get open jobs
 *     description: Retrieve all open job listings with optional filters
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, remote]
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [entry, mid, senior, lead, executive]
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in job title and description
 *     responses:
 *       200:
 *         description: List of jobs with pagination
 */
router.get('/jobs', careersController.getJobs);

// ============================================
// Public Routes - Applications
// المسارات العامة - الطلبات
// ============================================

/**
 * @swagger
 * /careers/upload-resume:
 *   post:
 *     summary: Upload resume file
 *     description: Upload a resume file for job application
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOC, DOCX)
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Invalid file or validation error
 *       429:
 *         description: Too many requests (10 per hour limit)
 */
router.post(
  '/upload-resume',
  uploadLimiter,
  csrfValidation,
  resumeUpload.single('resume'),
  careersController.uploadResume
);

/**
 * @swagger
 * /careers/apply:
 *   post:
 *     summary: Submit job application
 *     description: Submit a job application for an open position
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - resume
 *               - experience
 *             properties:
 *               job:
 *                 type: string
 *                 description: Job ID
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: uri
 *                 description: URL of uploaded resume
 *               coverLetter:
 *                 type: string
 *               linkedIn:
 *                 type: string
 *                 format: uri
 *               portfolio:
 *                 type: string
 *                 format: uri
 *               expectedSalary:
 *                 type: number
 *                 minimum: 0
 *               availableFrom:
 *                 type: string
 *                 format: date
 *               experience:
 *                 type: number
 *                 minimum: 0
 *                 description: Years of experience
 *               education:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               answers:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests (3 per hour limit)
 */
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

/**
 * @swagger
 * /careers/admin/jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieve all jobs with optional filters (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship, remote]
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [entry, mid, senior, lead, executive]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, open, closed, filled]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all jobs
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/jobs', authenticate, authorize('careers:read'), careersController.getAllJobs);

/**
 * @swagger
 * /careers/admin/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     description: Retrieve a single job by its ID (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/jobs/:id',
  authenticate,
  authorize('careers:read'),
  validate({ params: idParamsSchema }),
  careersController.getJobById
);

/**
 * @swagger
 * /careers/admin/jobs:
 *   post:
 *     summary: Create job
 *     description: Create a new job listing (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - description
 *               - department
 *               - location
 *               - type
 *               - experienceLevel
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *                 pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
 *               description:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ar:
 *                       type: string
 *                     en:
 *                       type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ar:
 *                       type: string
 *                     en:
 *                       type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ar:
 *                       type: string
 *                     en:
 *                       type: string
 *               department:
 *                 type: string
 *                 description: Department ID
 *               location:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, remote]
 *               experienceLevel:
 *                 type: string
 *                 enum: [entry, mid, senior, lead, executive]
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                     default: SAR
 *                   period:
 *                     type: string
 *                     enum: [hourly, monthly, yearly]
 *                     default: monthly
 *                   isPublic:
 *                     type: boolean
 *                     default: false
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, open, closed, filled]
 *                 default: draft
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/admin/jobs',
  authenticate,
  authorize('careers:create'),
  validate({ body: careersValidation.createJob }),
  careersController.createJob
);

/**
 * @swagger
 * /careers/admin/jobs/bulk-status:
 *   put:
 *     summary: Bulk update jobs status
 *     description: Update status for multiple jobs at once (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, open, closed, filled]
 *     responses:
 *       200:
 *         description: Jobs status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/jobs/bulk-status',
  authenticate,
  authorize('careers:update'),
  careersController.bulkUpdateJobStatus
);

/**
 * @swagger
 * /careers/admin/jobs/{id}:
 *   put:
 *     summary: Update job
 *     description: Update an existing job listing (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: object
 *               slug:
 *                 type: string
 *               description:
 *                 type: object
 *               requirements:
 *                 type: array
 *               responsibilities:
 *                 type: array
 *               benefits:
 *                 type: array
 *               department:
 *                 type: string
 *               location:
 *                 type: object
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship, remote]
 *               experienceLevel:
 *                 type: string
 *                 enum: [entry, mid, senior, lead, executive]
 *               salaryRange:
 *                 type: object
 *               skills:
 *                 type: array
 *               status:
 *                 type: string
 *                 enum: [draft, open, closed, filled]
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/jobs/:id',
  authenticate,
  authorize('careers:update'),
  validate({ params: idParamsSchema, body: careersValidation.updateJob }),
  careersController.updateJob
);

/**
 * @swagger
 * /careers/admin/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     description: Delete a job listing (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /careers/admin/applications:
 *   get:
 *     summary: Get all applications
 *     description: Retrieve all job applications with optional filters (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: job
 *         schema:
 *           type: string
 *         description: Filter by job ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, interviewed, offered, hired, rejected, withdrawn]
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Filter by applicant email
 *     responses:
 *       200:
 *         description: List of all applications
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/applications',
  authenticate,
  authorize('careers:read'),
  careersController.getAllApplications
);

/**
 * @swagger
 * /careers/admin/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     description: Retrieve a single job application by its ID (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:read'),
  validate({ params: idParamsSchema }),
  careersController.getApplicationById
);

/**
 * @swagger
 * /careers/admin/applications/bulk-status:
 *   put:
 *     summary: Bulk update applications status
 *     description: Update status for multiple applications at once (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of application IDs
 *               status:
 *                 type: string
 *                 enum: [pending, reviewing, shortlisted, interviewed, offered, hired, rejected, withdrawn]
 *     responses:
 *       200:
 *         description: Applications status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/applications/bulk-status',
  authenticate,
  authorize('careers:update'),
  careersController.bulkUpdateApplicationStatus
);

/**
 * @swagger
 * /careers/admin/applications/{id}:
 *   put:
 *     summary: Update application
 *     description: Update job application status, notes, or rating (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewing, shortlisted, interviewed, offered, hired, rejected, withdrawn]
 *               notes:
 *                 type: string
 *                 description: Admin notes about the application
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Application rating (1-5)
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:update'),
  validate({ params: idParamsSchema, body: careersValidation.updateApplication }),
  careersController.updateApplicationStatus
);

/**
 * @swagger
 * /careers/admin/applications/{id}:
 *   delete:
 *     summary: Delete application
 *     description: Delete a job application (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/admin/applications/:id',
  authenticate,
  authorize('careers:delete'),
  validate({ params: idParamsSchema }),
  careersController.deleteApplication
);

/**
 * @swagger
 * /careers/admin/jobs/{jobId}/applications:
 *   get:
 *     summary: Get applications for a job
 *     description: Retrieve all applications for a specific job (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, interviewed, offered, hired, rejected, withdrawn]
 *     responses:
 *       200:
 *         description: List of applications for the job
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/jobs/:jobId/applications',
  authenticate,
  authorize('careers:read'),
  validate({ params: jobIdParamsSchema }),
  careersController.getApplicationsByJob
);

/**
 * @swagger
 * /careers/admin/jobs/{jobId}/stats:
 *   get:
 *     summary: Get application statistics for a job
 *     description: Retrieve application statistics and metrics for a specific job (Admin only)
 *     tags: [Careers Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Application statistics (total, by status, etc.)
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/admin/jobs/:jobId/stats',
  authenticate,
  authorize('careers:read'),
  validate({ params: jobIdParamsSchema }),
  careersController.getApplicationStats
);

export default router;
