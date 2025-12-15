/**
 * Auth Routes
 * مسارات المصادقة
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers';
import { validate } from '../middlewares';
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

// Register
router.post(
  '/register',
  registerLimiter,
  validate({ body: authValidation.register }),
  authController.register
);

// Login
router.post('/login', loginLimiter, validate({ body: authValidation.login }), authController.login);

// Refresh token
router.post(
  '/refresh-token',
  validate({ body: authValidation.refreshToken }),
  authController.refreshToken
);

// Forgot password
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: authValidation.forgotPassword }),
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  passwordResetLimiter,
  validate({ body: authValidation.resetPassword }),
  authController.resetPassword
);

// Verify email
router.post(
  '/verify-email',
  verificationLimiter,
  validate({ body: authValidation.verifyEmail }),
  authController.verifyEmail
);

// Google Sign-in
router.post(
  '/google',
  loginLimiter,
  validate({ body: authValidation.googleAuth }),
  authController.googleAuth
);

// GitHub Sign-in
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

// Logout
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/me', authenticate, authController.getMe);

// Update profile
router.put(
  '/me',
  authenticate,
  validate({ body: authValidation.updateProfile }),
  authController.updateProfile
);

// Change password
router.put(
  '/change-password',
  authenticate,
  validate({ body: authValidation.changePassword }),
  authController.changePassword
);

// Resend verification email
router.post(
  '/resend-verification',
  authenticate,
  verificationLimiter,
  authController.resendVerification
);

export default router;
