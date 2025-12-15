/**
 * Auth Service
 * خدمة المصادقة
 */

import { api, ApiResponse } from '@/lib/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Token management
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenUtils = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!tokenUtils.getAccessToken();
  },
};

// Auth API calls
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const data = response.data.data as LoginResponse;

    // Store tokens
    tokenUtils.setTokens(data.tokens);

    return data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
    const responseData = response.data.data as LoginResponse;

    // Store tokens
    tokenUtils.setTokens(responseData.tokens);

    return responseData;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      tokenUtils.clearTokens();
    }
  },

  /**
   * Get current user
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data as User;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<string | null> => {
    const refreshToken = tokenUtils.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
        refreshToken,
      });

      const newAccessToken = response.data.data?.accessToken;
      if (newAccessToken) {
        localStorage.setItem(TOKEN_KEY, newAccessToken);
        return newAccessToken;
      }
      return null;
    } catch {
      tokenUtils.clearTokens();
      return null;
    }
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};

export default authService;
