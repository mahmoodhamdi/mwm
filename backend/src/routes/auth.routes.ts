/**
 * Auth Routes
 * مسارات المصادقة
 */

import { Router } from 'express';
import { authController } from '../controllers';
import { validate } from '../middlewares';
import { authenticate } from '../middlewares/auth';
import { authValidation } from '../validations';

const router = Router();

/**
 * Public routes
 * المسارات العامة
 */

// Register
router.post('/register', validate(authValidation.register), authController.register);

// Login
router.post('/login', validate(authValidation.login), authController.login);

// Refresh token
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);

// Forgot password
router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

// Verify email
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

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
  validate(authValidation.updateProfile),
  authController.updateProfile
);

// Change password
router.put(
  '/change-password',
  authenticate,
  validate(authValidation.changePassword),
  authController.changePassword
);

// Resend verification email
router.post('/resend-verification', authenticate, authController.resendVerification);

export default router;
