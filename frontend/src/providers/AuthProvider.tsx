/**
 * Auth Provider
 * موفر المصادقة
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { authService, tokenUtils, User } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const checkAuth = useCallback(async () => {
    try {
      // Try to get current user - cookies are sent automatically
      const userData = await authService.getMe();
      setUser(userData);
      // Update auth state to reflect successful authentication
      tokenUtils.setAuthState(true);
    } catch {
      // Token invalid, expired, or not present
      tokenUtils.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push(`/${locale}/admin/login`);
  };

  // Redirect to login if on admin page and not authenticated
  // Use replace instead of push to prevent back navigation to protected pages
  useEffect(() => {
    if (isLoading) return;

    const isAdminRoute = pathname?.includes('/admin');
    const isLoginPage = pathname?.includes('/admin/login');

    if (isAdminRoute && !isLoginPage && !user) {
      router.replace(`/${locale}/admin/login`);
    }
  }, [isLoading, user, pathname, router, locale]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
