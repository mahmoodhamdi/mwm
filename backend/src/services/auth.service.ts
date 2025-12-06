/**
 * Auth Service
 * خدمة المصادقة
 */

import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config';
import { User, IUser, IRefreshToken } from '../models';
import { ApiError, Errors } from '../utils/ApiError';
import { redis } from '../config';

/**
 * Token payload interface
 * واجهة حمولة التوكن
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Token pair interface
 * واجهة زوج التوكنات
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Parse duration string to milliseconds
 * تحويل نص المدة إلى ملي ثانية
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000; // default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

/**
 * Auth Service Class
 * فئة خدمة المصادقة
 */
class AuthService {
  private accessTokenExpiry: number;
  private refreshTokenExpiry: number;

  constructor() {
    this.accessTokenExpiry = parseDuration(env.jwt.expiresIn);
    this.refreshTokenExpiry = parseDuration(env.jwt.refreshExpiresIn);
  }

  /**
   * Generate access token
   * إنشاء توكن الوصول
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });
  }

  /**
   * Generate refresh token
   * إنشاء توكن التحديث
   */
  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Generate token pair
   * إنشاء زوج التوكنات
   */
  async generateTokenPair(user: IUser, device?: string, ip?: string): Promise<TokenPair> {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    // Store refresh token
    const refreshTokenData: IRefreshToken = {
      token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + this.refreshTokenExpiry),
      device,
      ip,
      createdAt: new Date(),
    };

    // Remove old refresh tokens (keep max 5)
    await User.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: {
          $each: [refreshTokenData],
          $slice: -5, // Keep only last 5 tokens
        },
      },
      $set: { lastLogin: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
    };
  }

  /**
   * Verify access token
   * التحقق من توكن الوصول
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload & TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw Errors.TOKEN_EXPIRED();
      }
      throw Errors.INVALID_TOKEN();
    }
  }

  /**
   * Refresh tokens
   * تحديث التوكنات
   */
  async refreshTokens(refreshToken: string, device?: string, ip?: string): Promise<TokenPair> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find user with this refresh token
    const user = await User.findOne({
      'refreshTokens.token': hashedToken,
      'refreshTokens.expiresAt': { $gt: new Date() },
      isActive: true,
    }).select('+refreshTokens');

    if (!user) {
      throw Errors.INVALID_TOKEN();
    }

    // Remove old refresh token
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: { token: hashedToken } },
    });

    // Generate new token pair
    return this.generateTokenPair(user, device, ip);
  }

  /**
   * Revoke refresh token
   * إلغاء توكن التحديث
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await User.updateOne(
      { 'refreshTokens.token': hashedToken },
      { $pull: { refreshTokens: { token: hashedToken } } }
    );
  }

  /**
   * Revoke all refresh tokens for user
   * إلغاء جميع توكنات التحديث للمستخدم
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }

  /**
   * Blacklist access token
   * إضافة توكن الوصول للقائمة السوداء
   */
  async blacklistAccessToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redis.set(`blacklist:${token}`, '1', 'EX', ttl);
        }
      }
    } catch {
      // Token is invalid, no need to blacklist
    }
  }

  /**
   * Check if token is blacklisted
   * التحقق مما إذا كان التوكن في القائمة السوداء
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await redis.get(`blacklist:${token}`);
    return result === '1';
  }

  /**
   * Verify email
   * التحقق من البريد الإلكتروني
   */
  async verifyEmail(token: string): Promise<IUser> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(
        400,
        'INVALID_TOKEN',
        'Invalid or expired verification token | توكن التحقق غير صالح أو منتهي'
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }

  /**
   * Request password reset
   * طلب إعادة تعيين كلمة المرور
   */
  async requestPasswordReset(email: string): Promise<{ user: IUser; token: string } | null> {
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      // Return null but don't reveal if user exists
      return null;
    }

    const token = user.generatePasswordResetToken();
    await user.save();

    return { user, token };
  }

  /**
   * Reset password
   * إعادة تعيين كلمة المرور
   */
  async resetPassword(token: string, newPassword: string): Promise<IUser> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      throw new ApiError(
        400,
        'INVALID_TOKEN',
        'Invalid or expired reset token | توكن إعادة التعيين غير صالح أو منتهي'
      );
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Revoke all refresh tokens for security
    await this.revokeAllRefreshTokens(user._id.toString());

    return user;
  }
}

export const authService = new AuthService();
export default authService;
