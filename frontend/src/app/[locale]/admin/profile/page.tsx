'use client';

/**
 * Admin Profile Page
 * صفحة الملف الشخصي للمدير
 */

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProfileFormData {
  name: string;
  email: string;
  avatar: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

const texts = {
  ar: {
    title: 'الملف الشخصي',
    subtitle: 'إدارة معلوماتك الشخصية وكلمة المرور',
    profileInfo: 'المعلومات الشخصية',
    profileDesc: 'تحديث اسمك وصورتك الشخصية',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    avatarUrl: 'رابط الصورة الشخصية',
    avatarPlaceholder: 'https://example.com/avatar.jpg',
    saveProfile: 'حفظ التغييرات',
    saving: 'جاري الحفظ...',
    changePassword: 'تغيير كلمة المرور',
    changePasswordDesc: 'تأكد من اختيار كلمة مرور قوية وآمنة',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    updating: 'جاري التحديث...',
    accountInfo: 'معلومات الحساب',
    role: 'الدور',
    memberSince: 'عضو منذ',
    emailVerified: 'البريد موثق',
    emailNotVerified: 'البريد غير موثق',
    roles: {
      super_admin: 'مدير عام',
      admin: 'مدير',
      editor: 'محرر',
      author: 'كاتب',
      viewer: 'مشاهد',
    },
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    passwordUpdated: 'تم تغيير كلمة المرور بنجاح',
    errors: {
      nameRequired: 'الاسم مطلوب (حرفان على الأقل)',
      avatarInvalid: 'يجب أن يكون رابط الصورة عنواناً صحيحاً',
      currentPasswordRequired: 'كلمة المرور الحالية مطلوبة',
      newPasswordMin: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل',
      passwordsNoMatch: 'كلمتا المرور غير متطابقتين',
      profileFailed: 'فشل في تحديث الملف الشخصي',
      passwordFailed: 'فشل في تغيير كلمة المرور',
    },
  },
  en: {
    title: 'Profile',
    subtitle: 'Manage your personal information and password',
    profileInfo: 'Personal Information',
    profileDesc: 'Update your name and avatar',
    name: 'Name',
    email: 'Email Address',
    avatarUrl: 'Avatar URL',
    avatarPlaceholder: 'https://example.com/avatar.jpg',
    saveProfile: 'Save Changes',
    saving: 'Saving...',
    changePassword: 'Change Password',
    changePasswordDesc: 'Choose a strong and secure password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    updating: 'Updating...',
    accountInfo: 'Account Info',
    role: 'Role',
    memberSince: 'Member since',
    emailVerified: 'Email verified',
    emailNotVerified: 'Email not verified',
    roles: {
      super_admin: 'Super Admin',
      admin: 'Admin',
      editor: 'Editor',
      author: 'Author',
      viewer: 'Viewer',
    },
    profileUpdated: 'Profile updated successfully',
    passwordUpdated: 'Password changed successfully',
    errors: {
      nameRequired: 'Name must be at least 2 characters',
      avatarInvalid: 'Avatar must be a valid URL',
      currentPasswordRequired: 'Current password is required',
      newPasswordMin: 'New password must be at least 8 characters',
      passwordsNoMatch: 'Passwords do not match',
      profileFailed: 'Failed to update profile',
      passwordFailed: 'Failed to change password',
    },
  },
};

// ---------------------------------------------------------------------------
// Role badge colours
// ---------------------------------------------------------------------------

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  editor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  author: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { user, checkAuth } = useAuth();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = texts[locale as keyof typeof texts] ?? texts.en;

  // ------------------------------------------------------------------
  // Profile form
  // ------------------------------------------------------------------

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
    setError: setProfileError,
  } = useForm<ProfileFormData>({
    defaultValues: { name: '', email: '', avatar: '' },
  });

  // ------------------------------------------------------------------
  // Password form
  // ------------------------------------------------------------------

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
    setError: setPasswordError,
  } = useForm<PasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // Populate profile form when user data is available
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? '',
      });
    }
  }, [user, resetProfile]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  const onProfileSubmit = async (data: ProfileFormData) => {
    // Manual validation
    if (!data.name || data.name.trim().length < 2) {
      setProfileError('name', { message: t.errors.nameRequired });
      return;
    }
    if (data.avatar && data.avatar.trim()) {
      try {
        new URL(data.avatar.trim());
      } catch {
        setProfileError('avatar', { message: t.errors.avatarInvalid });
        return;
      }
    }

    setIsSavingProfile(true);
    try {
      const payload: Record<string, string> = { name: data.name.trim() };
      if (data.avatar && data.avatar.trim()) {
        payload.avatar = data.avatar.trim();
      }
      await api.put('/auth/me', payload);
      await checkAuth();
      toast.success(t.profileUpdated);
    } catch {
      toast.error(t.errors.profileFailed);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    // Manual validation
    if (!data.currentPassword) {
      setPasswordError('currentPassword', { message: t.errors.currentPasswordRequired });
      return;
    }
    if (!data.newPassword || data.newPassword.length < 8) {
      setPasswordError('newPassword', { message: t.errors.newPasswordMin });
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('confirmPassword', { message: t.errors.passwordsNoMatch });
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      toast.success(t.passwordUpdated);
    } catch {
      toast.error(t.errors.passwordFailed);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // ------------------------------------------------------------------
  // Derived display values
  // ------------------------------------------------------------------

  const avatarFallback = user?.name?.charAt(0)?.toUpperCase() ?? 'U';
  const roleLabel = user?.role ? (t.roles[user.role as keyof typeof t.roles] ?? user.role) : '';
  const roleBadgeClass = user?.role ? (roleColors[user.role] ?? roleColors['viewer']) : '';

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // ------------------------------------------------------------------
  // Shared class helpers
  // ------------------------------------------------------------------

  const inputClass =
    'bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-colors';

  const errorClass = 'mt-1 text-xs text-red-500 dark:text-red-400';

  const labelClass = 'mb-1 block text-sm font-medium text-muted-foreground';

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <User className="size-7" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ----------------------------------------------------------------
            Left column – account summary card
        ---------------------------------------------------------------- */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">{t.accountInfo}</h2>

            {/* Avatar */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="relative">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="ring-primary/20 size-20 rounded-full object-cover ring-2"
                  />
                ) : (
                  <div className="bg-primary text-primary-foreground flex size-20 items-center justify-center rounded-full text-2xl font-bold">
                    {avatarFallback}
                  </div>
                )}
                <div className="bg-card absolute bottom-0 end-0 rounded-full border p-1">
                  <Camera className="text-muted-foreground size-3" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Account metadata */}
            <div className="space-y-3 text-sm">
              {/* Role */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2">
                  <Shield className="size-4" />
                  {t.role}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClass}`}>
                  {roleLabel}
                </span>
              </div>

              {/* Email verification */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2">
                  <Mail className="size-4" />
                  {t.email}
                </div>
                {user?.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="size-3" />
                    {t.emailVerified}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                    <Clock className="size-3" />
                    {t.emailNotVerified}
                  </span>
                )}
              </div>

              {/* Member since */}
              {formattedDate && (
                <div className="flex items-start justify-between gap-2">
                  <div className="text-muted-foreground flex shrink-0 items-center gap-2">
                    <Clock className="size-4" />
                    {t.memberSince}
                  </div>
                  <span className="text-muted-foreground text-end text-xs">{formattedDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------
            Right column – profile & password forms
        ---------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile form */}
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">{t.profileInfo}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t.profileDesc}</p>
            </div>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label className={labelClass}>{t.name} *</label>
                <input
                  type="text"
                  {...registerProfile('name')}
                  className={inputClass}
                  autoComplete="name"
                />
                {profileErrors.name && <p className={errorClass}>{profileErrors.name.message}</p>}
              </div>

              {/* Email – read-only; changing email is a separate security flow */}
              <div>
                <label className={labelClass}>{t.email}</label>
                <input
                  type="email"
                  {...registerProfile('email')}
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                  readOnly
                  autoComplete="email"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className={labelClass}>{t.avatarUrl}</label>
                <input
                  type="url"
                  {...registerProfile('avatar')}
                  placeholder={t.avatarPlaceholder}
                  className={inputClass}
                />
                {profileErrors.avatar && (
                  <p className={errorClass}>{profileErrors.avatar.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  <Save className="size-4" />
                  {isSavingProfile ? t.saving : t.saveProfile}
                </button>
              </div>
            </form>
          </div>

          {/* Password form */}
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">{t.changePassword}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t.changePasswordDesc}</p>
            </div>

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Current password */}
              <div>
                <label className={labelClass}>{t.currentPassword} *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...registerPassword('currentPassword')}
                    className={`${inputClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(v => !v)}
                    className={`text-muted-foreground absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className={errorClass}>{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New password */}
              <div>
                <label className={labelClass}>{t.newPassword} *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...registerPassword('newPassword')}
                    className={`${inputClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(v => !v)}
                    className={`text-muted-foreground absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className={errorClass}>{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className={labelClass}>{t.confirmPassword} *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerPassword('confirmPassword')}
                    className={`${inputClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className={`text-muted-foreground absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className={errorClass}>{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  <Lock className="size-4" />
                  {isSavingPassword ? t.updating : t.updatePassword}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
