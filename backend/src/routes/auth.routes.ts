/**
 * Auth Routes
 * مسارات المصادقة
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers';
import { validate, csrfValidation } from '../middlewares';
import { authenticate } from '../middlewares/auth';
import { authValidation } from '../validations';

const router = Router();

/**
 * Auth-specific rate limiters
 * محددات معدل خاصة بالمصادقة
 */

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Strict rate limit for login attempts (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: true, // Only count failed attempts
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message:
        'Too many login attempts. Please try again after 15 minutes | محاولات تسجيل دخول كثيرة. يرجى المحاولة مرة أخرى بعد 15 دقيقة',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for password reset (3 attempts per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_RESET_ATTEMPTS',
      message:
        'Too many password reset attempts. Please try again after an hour | محاولات كثيرة لإعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى بعد ساعة',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for registration (10 per hour per IP)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REGISTRATIONS',
      message:
        'Too many registrations from this IP. Please try again later | عمليات تسجيل كثيرة من هذا العنوان. يرجى المحاولة لاحقاً',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for email verification (5 per hour)
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_VERIFICATION_ATTEMPTS',
      message:
        'Too many verification attempts. Please try again later | محاولات كثيرة للتحقق. يرجى المحاولة لاحقاً',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Public routes
 * المسارات العامة
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register',
  registerLimiter,
  validate({ body: authValidation.register }),
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', loginLimiter, validate({ body: authValidation.login }), authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  '/refresh-token',
  validate({ body: authValidation.refreshToken }),
  authController.refreshToken
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent (if email exists)
 *       429:
 *         description: Too many reset attempts
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: authValidation.forgotPassword }),
  authController.forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post(
  '/reset-password',
  passwordResetLimiter,
  validate({ body: authValidation.resetPassword }),
  authController.resetPassword
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post(
  '/verify-email',
  verificationLimiter,
  validate({ body: authValidation.verifyEmail }),
  authController.verifyEmail
);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/google',
  loginLimiter,
  validate({ body: authValidation.googleAuth }),
  authController.googleAuth
);

/**
 * @swagger
 * /auth/github:
 *   post:
 *     summary: Sign in with GitHub
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/github',
  loginLimiter,
  validate({ body: authValidation.githubAuth }),
  authController.githubAuth
);

/**
 * Protected routes
 * المسارات المحمية
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, csrfValidation, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @swagger
 * /auth/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/me',
  authenticate,
  csrfValidation,
  validate({ body: authValidation.updateProfile }),
  authController.updateProfile
);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Invalid current password
 */
router.put(
  '/change-password',
  authenticate,
  csrfValidation,
  validate({ body: authValidation.changePassword }),
  authController.changePassword
);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 *       429:
 *         description: Too many attempts
 */
router.post(
  '/resend-verification',
  authenticate,
  csrfValidation,
  verificationLimiter,
  authController.resendVerification
);

export default router;
