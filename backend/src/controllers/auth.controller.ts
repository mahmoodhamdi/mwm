/**
 * Auth Controller
 * متحكم المصادقة
 */

import { Request, Response } from 'express';
import { User } from '../models';
import { authService, emailService } from '../services';
import { ApiError, Errors } from '../utils/ApiError';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../middlewares';
import { logger } from '../config';
import { verifyIdToken } from '../config/firebase';
import axios from 'axios';

/**
 * Register a new user
 * تسجيل مستخدم جديد
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw Errors.EMAIL_EXISTS();
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email (non-blocking, log failure)
  const emailSent = await emailService.sendVerificationEmail(
    user.email,
    user.name,
    verificationToken
  );
  if (!emailSent) {
    logger.warn(`Failed to send verification email to ${user.email} during registration`);
  }

  // Generate tokens
  const tokens = await authService.generateTokenPair(user, req.headers['user-agent'], req.ip);

  sendCreated(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    },
    'Registration successful. Please verify your email | تم التسجيل بنجاح. يرجى تأكيد بريدك الإلكتروني'
  );
});

/**
 * Login user
 * تسجيل دخول المستخدم
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw Errors.INVALID_CREDENTIALS();
  }

  // Check if account is locked
  if (user.isLocked()) {
    throw new ApiError(
      423,
      'ACCOUNT_LOCKED',
      'Account is temporarily locked. Please try again later | الحساب مقفل مؤقتاً. يرجى المحاولة لاحقاً'
    );
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(
      403,
      'ACCOUNT_DISABLED',
      'Account is disabled. Please contact support | الحساب معطل. يرجى التواصل مع الدعم'
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    await user.incrementLoginAttempts();
    throw Errors.INVALID_CREDENTIALS();
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Generate tokens
  const tokens = await authService.generateTokenPair(user, req.headers['user-agent'], req.ip);

  sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    },
    { message: 'Login successful | تم تسجيل الدخول بنجاح' }
  );
});

/**
 * Logout user
 * تسجيل خروج المستخدم
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const accessToken = req.headers.authorization?.split(' ')[1];

  // Revoke refresh token if provided
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }

  // Blacklist access token
  if (accessToken) {
    await authService.blacklistAccessToken(accessToken);
  }

  sendSuccess(res, null, { message: 'Logged out successfully | تم تسجيل الخروج بنجاح' });
});

/**
 * Refresh tokens
 * تحديث التوكنات
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  // Validate refresh token is provided
  if (!token || typeof token !== 'string') {
    throw new ApiError(400, 'MISSING_TOKEN', 'Refresh token is required | توكن التحديث مطلوب');
  }

  const tokens = await authService.refreshTokens(token, req.headers['user-agent'], req.ip);

  sendSuccess(res, tokens, { message: 'Tokens refreshed successfully | تم تحديث التوكنات بنجاح' });
});

/**
 * Forgot password
 * نسيت كلمة المرور
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await authService.requestPasswordReset(email);

  // Always return success to prevent email enumeration
  if (result) {
    const emailSent = await emailService.sendPasswordResetEmail(
      result.user.email,
      result.user.name,
      result.token
    );
    if (!emailSent) {
      logger.warn(`Failed to send password reset email to ${result.user.email}`);
    }
  }

  sendSuccess(res, null, {
    message:
      'If an account exists with this email, a password reset link has been sent | إذا كان هناك حساب بهذا البريد، تم إرسال رابط إعادة تعيين كلمة المرور',
  });
});

/**
 * Reset password
 * إعادة تعيين كلمة المرور
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  await authService.resetPassword(token, password);

  sendSuccess(res, null, {
    message:
      'Password reset successful. Please login with your new password | تم إعادة تعيين كلمة المرور بنجاح. يرجى تسجيل الدخول بكلمة المرور الجديدة',
  });
});

/**
 * Verify email
 * تأكيد البريد الإلكتروني
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const user = await authService.verifyEmail(token);

  // Send welcome email (non-blocking, log failure)
  const emailSent = await emailService.sendWelcomeEmail(user.email, user.name);
  if (!emailSent) {
    logger.warn(`Failed to send welcome email to ${user.email} after email verification`);
  }

  sendSuccess(res, null, {
    message: 'Email verified successfully | تم تأكيد البريد الإلكتروني بنجاح',
  });
});

/**
 * Resend verification email
 * إعادة إرسال بريد التحقق
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);
  if (!user) {
    throw Errors.NOT_FOUND('User');
  }

  if (user.isEmailVerified) {
    throw new ApiError(
      400,
      'ALREADY_VERIFIED',
      'Email is already verified | البريد الإلكتروني مؤكد مسبقاً'
    );
  }

  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  const emailSent = await emailService.sendVerificationEmail(
    user.email,
    user.name,
    verificationToken
  );
  if (!emailSent) {
    logger.warn(`Failed to resend verification email to ${user.email}`);
  }

  sendSuccess(res, null, { message: 'Verification email sent | تم إرسال بريد التحقق' });
});

/**
 * Get current user
 * الحصول على المستخدم الحالي
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw Errors.NOT_FOUND('User');
  }

  sendSuccess(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
});

/**
 * Update profile
 * تحديث الملف الشخصي
 * PUT /api/v1/auth/me
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, avatar } = req.body;
  const userId = req.user?._id;

  const user = await User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw Errors.NOT_FOUND('User');
  }

  sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    },
    { message: 'Profile updated successfully | تم تحديث الملف الشخصي بنجاح' }
  );
});

/**
 * Change password
 * تغيير كلمة المرور
 * PUT /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?._id;

  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw Errors.NOT_FOUND('User');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(
      400,
      'INVALID_PASSWORD',
      'Current password is incorrect | كلمة المرور الحالية غير صحيحة'
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens
  await authService.revokeAllRefreshTokens(userId!.toString());

  // Generate new tokens
  const tokens = await authService.generateTokenPair(user, req.headers['user-agent'], req.ip);

  sendSuccess(res, tokens, {
    message: 'Password changed successfully | تم تغيير كلمة المرور بنجاح',
  });
});

/**
 * Google Sign-in with Firebase
 * تسجيل الدخول بجوجل عبر Firebase
 * POST /api/v1/auth/google
 */
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken || typeof idToken !== 'string') {
    throw new ApiError(400, 'MISSING_TOKEN', 'Firebase ID token is required | توكن Firebase مطلوب');
  }

  // Verify Firebase ID token
  const decodedToken = await verifyIdToken(idToken);

  if (!decodedToken) {
    throw new ApiError(
      401,
      'INVALID_TOKEN',
      'Invalid or expired Firebase ID token | توكن Firebase غير صالح أو منتهي الصلاحية'
    );
  }

  const { email, name, picture, uid: firebaseUid } = decodedToken;

  if (!email) {
    throw new ApiError(
      400,
      'EMAIL_REQUIRED',
      'Google account must have an email | حساب جوجل يجب أن يحتوي على بريد إلكتروني'
    );
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // User exists - check if account is active
    if (!user.isActive) {
      throw new ApiError(
        403,
        'ACCOUNT_DISABLED',
        'Account is disabled. Please contact support | الحساب معطل. يرجى التواصل مع الدعم'
      );
    }

    // Update avatar if not set
    if (!user.avatar && picture) {
      user.avatar = picture;
      await user.save();
    }

    // Auto-verify email for Google users
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: firebaseUid + '_' + Date.now(), // Random password for Firebase users
      avatar: picture,
      isEmailVerified: true, // Google emails are verified
    });

    // Send welcome email (non-blocking)
    const emailSent = await emailService.sendWelcomeEmail(user.email, user.name);
    if (!emailSent) {
      logger.warn(`Failed to send welcome email to ${user.email} after Google sign-in`);
    }
  }

  // Reset login attempts
  await user.resetLoginAttempts();

  // Generate tokens
  const tokens = await authService.generateTokenPair(user, req.headers['user-agent'], req.ip);

  sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    },
    { message: 'Google sign-in successful | تم تسجيل الدخول بجوجل بنجاح' }
  );
});

/**
 * GitHub Sign-in
 * تسجيل الدخول بجيت هب
 * POST /api/v1/auth/github
 */
export const githubAuth = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    throw new ApiError(
      400,
      'MISSING_CODE',
      'GitHub authorization code is required | كود التفويض من GitHub مطلوب'
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new ApiError(
      500,
      'GITHUB_NOT_CONFIGURED',
      'GitHub OAuth is not configured | تسجيل الدخول بـ GitHub غير مُعَد'
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (error || !access_token) {
      logger.error('GitHub OAuth error:', error_description || error);
      throw new ApiError(
        401,
        'GITHUB_AUTH_FAILED',
        error_description || 'GitHub authentication failed | فشل التحقق من GitHub'
      );
    }

    // Get user profile from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const githubUser = userResponse.data;

    // Get user email (may be private)
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const primaryEmail = emailsResponse.data.find(
        (e: { primary: boolean; verified: boolean; email: string }) => e.primary && e.verified
      );
      email = primaryEmail?.email;
    }

    if (!email) {
      throw new ApiError(
        400,
        'EMAIL_REQUIRED',
        'GitHub account must have a verified email | حساب GitHub يجب أن يحتوي على بريد إلكتروني مُوثق'
      );
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - check if account is active
      if (!user.isActive) {
        throw new ApiError(
          403,
          'ACCOUNT_DISABLED',
          'Account is disabled. Please contact support | الحساب معطل. يرجى التواصل مع الدعم'
        );
      }

      // Update avatar if not set
      if (!user.avatar && githubUser.avatar_url) {
        user.avatar = githubUser.avatar_url;
        await user.save();
      }

      // Auto-verify email for GitHub users
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email,
        password: `github_${githubUser.id}_${Date.now()}`, // Random password for GitHub users
        avatar: githubUser.avatar_url,
        isEmailVerified: true, // GitHub emails are verified
      });

      // Send welcome email (non-blocking)
      const emailSent = await emailService.sendWelcomeEmail(user.email, user.name);
      if (!emailSent) {
        logger.warn(`Failed to send welcome email to ${user.email} after GitHub sign-in`);
      }
    }

    // Reset login attempts
    await user.resetLoginAttempts();

    // Generate tokens
    const tokens = await authService.generateTokenPair(user, req.headers['user-agent'], req.ip);

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
        },
        ...tokens,
      },
      { message: 'GitHub sign-in successful | تم تسجيل الدخول بـ GitHub بنجاح' }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('GitHub OAuth error:', error);
    throw new ApiError(
      500,
      'GITHUB_AUTH_ERROR',
      'Failed to authenticate with GitHub | فشل التحقق من GitHub'
    );
  }
});

export const authController = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getMe,
  updateProfile,
  changePassword,
  googleAuth,
  githubAuth,
};

export default authController;
