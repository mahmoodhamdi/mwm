/**
 * Admin Login Page
 * صفحة تسجيل دخول لوحة التحكم
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// GitHub Icon Component
const GitHubIcon = () => (
  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function AdminLoginPage() {
  const t = useTranslations('admin.login');
  const locale = useLocale();
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(`/${locale}/admin`);
    }
  }, [isAuthenticated, authLoading, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success(t('success'));
      router.push(`/${locale}/admin`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await authService.loginWithGoogle();
      toast.success(t('success'));
      // Manually set user in auth context by checking auth
      window.location.href = `/${locale}/admin`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('googleError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    setIsGitHubLoading(true);
    authService.initiateGitHubLogin();
  };

  const isSocialLoading = isGoogleLoading || isGitHubLoading;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-primary text-3xl font-bold">MWM</h1>
          <p className="text-muted-foreground mt-2">{t('title')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-foreground mb-1 block text-sm font-medium">
                {t('email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-foreground mb-1 block text-sm font-medium">
                {t('password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading || isSocialLoading}>
              {isLoading ? t('loading') : t('submit')}
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card text-muted-foreground px-2">{t('orContinueWith')}</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading || isSocialLoading}
                className="w-full"
              >
                {isGoogleLoading ? (
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span className="ltr:ml-2 rtl:mr-2">Google</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubLogin}
                disabled={isLoading || isSocialLoading}
                className="w-full"
              >
                {isGitHubLoading ? (
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <>
                    <GitHubIcon />
                    <span className="ltr:ml-2 rtl:mr-2">GitHub</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} MWM. {t('rights')}
        </p>
      </div>
    </div>
  );
}
