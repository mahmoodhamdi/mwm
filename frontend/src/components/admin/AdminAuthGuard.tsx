/**
 * Admin Auth Guard Component
 * مكون حماية صفحات لوحة التحكم
 */

'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto size-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  // (AuthProvider will handle redirect)
  if (!isAuthenticated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto size-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminAuthGuard;
