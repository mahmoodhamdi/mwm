/**
 * Admin Auth Guard Component
 * مكون حماية صفحات لوحة التحكم
 *
 * Prevents admin content from flashing before redirect completes.
 * يمنع ظهور محتوى لوحة التحكم قبل اكتمال إعادة التوجيه.
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Loading spinner component for auth states
 * مكون مؤشر التحميل لحالات المصادقة
 */
function AuthLoadingSpinner({ message }: { message: string }) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto size-12 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground mt-4">{message}</p>
      </div>
    </div>
  );
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Check if on login page - always allow login page to render
  const isLoginPage = pathname?.includes('/admin/login');
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return <AuthLoadingSpinner message="Loading..." />;
  }

  // Return null immediately when not authenticated to prevent any content flash
  // AuthProvider handles the actual redirect to login page
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default AdminAuthGuard;
