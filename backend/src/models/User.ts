/**
 * User Model
 * نموذج المستخدم
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * User Roles
 * أدوار المستخدم
 */
export const UserRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

/**
 * Refresh Token Interface
 * واجهة توكن التحديث
 */
export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  device?: string;
  ip?: string;
  createdAt: Date;
}

/**
 * User Interface
 * واجهة المستخدم
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  customPermissions?: string[];

  // Email verification
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  // Account status
  isActive: boolean;

  // Two-factor auth
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;

  // Refresh tokens
  refreshTokens: IRefreshToken[];

  // Login tracking
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;

  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  changedPasswordAfter(timestamp: number): boolean;
}

/**
 * User Methods Interface
 * واجهة دوال المستخدم
 */
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  changedPasswordAfter(timestamp: number): boolean;
}

/**
 * User Model Interface
 * واجهة نموذج المستخدم
 */
type UserModel = Model<IUser, object, IUserMethods>;

/**
 * Refresh Token Schema
 * مخطط توكن التحديث
 */
const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    device: String,
    ip: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * User Schema
 * مخطط المستخدم
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required | الاسم مطلوب'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters | الاسم يجب أن يكون على الأقل حرفين'],
      maxlength: [50, 'Name cannot exceed 50 characters | الاسم لا يمكن أن يتجاوز 50 حرف'],
    },
    email: {
      type: String,
      required: [true, 'Email is required | البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email | يرجى إدخال بريد إلكتروني صحيح',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required | كلمة المرور مطلوبة'],
      minlength: [
        8,
        'Password must be at least 8 characters | كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      ],
      select: false, // Don't include in queries by default
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.VIEWER,
    },
    customPermissions: [
      {
        type: String,
      },
    ],

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Two-factor auth
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },

    // Refresh tokens
    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
      select: false,
    },

    // Login tracking
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Password reset
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret['password'];
        delete ret['refreshTokens'];
        delete ret['twoFactorSecret'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Indexes (email index is created by unique: true on the field)
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });

// Constants
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Pre-save middleware - hash password
 * وسيط ما قبل الحفظ - تشفير كلمة المرور
 */
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

  // Update passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000); // 1 second before to ensure token is valid
  }

  next();
});

/**
 * Compare password method
 * دالة مقارنة كلمة المرور
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if account is locked
 * التحقق مما إذا كان الحساب مقفلاً
 */
userSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

/**
 * Increment login attempts
 * زيادة محاولات تسجيل الدخول
 */
userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  // If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
    return;
  }

  // Increment attempts
  const updates: Record<string, unknown> = { $inc: { loginAttempts: 1 } };

  // Lock account if max attempts reached
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }

  await this.updateOne(updates);
};

/**
 * Reset login attempts
 * إعادة تعيين محاولات تسجيل الدخول
 */
userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

/**
 * Generate email verification token
 * إنشاء توكن التحقق من البريد
 */
userSchema.methods.generateEmailVerificationToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return token;
};

/**
 * Generate password reset token
 * إنشاء توكن إعادة تعيين كلمة المرور
 */
userSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return token;
};

/**
 * Check if password was changed after token was issued
 * التحقق مما إذا تم تغيير كلمة المرور بعد إصدار التوكن
 */
userSchema.methods.changedPasswordAfter = function (timestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return timestamp < changedTimestamp;
  }
  return false;
};

/**
 * User Model
 * نموذج المستخدم
 */
export const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
