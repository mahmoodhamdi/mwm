/**
 * Auth Service
 * خدمة المصادقة
 */

import { api, ApiResponse } from '@/lib/api';
import { signInWithGoogle, getIdToken, signOut as firebaseSignOut } from '@/lib/firebase';
import { initiateGitHubAuth } from '@/lib/github';

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

export interface LoginResponse {
  user: User;
}

// Auth state management key for checking authentication status
const AUTH_STATE_KEY = 'authState';

export const tokenUtils = {
  /**
   * Set auth state to indicate user is logged in
   * Note: Actual tokens are now stored in httpOnly cookies
   */
  setAuthState: (isAuthenticated: boolean): void => {
    if (typeof window === 'undefined') return;
    if (isAuthenticated) {
      localStorage.setItem(AUTH_STATE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STATE_KEY);
    }
  },

  /**
   * Clear auth state
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_STATE_KEY);
  },

  /**
   * Check if user appears to be authenticated
   * Note: This is a hint only - actual authentication is verified by the server
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_STATE_KEY) === 'true';
  },
};

// Auth API calls
export const authService = {
  /**
   * Login user
   * Tokens are now set via httpOnly cookies by the server
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const data = response.data.data as LoginResponse;

    // Set auth state to indicate user is logged in
    tokenUtils.setAuthState(true);

    return data;
  },

  /**
   * Register new user
   * Tokens are now set via httpOnly cookies by the server
   */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
    const responseData = response.data.data as LoginResponse;

    // Set auth state to indicate user is logged in
    tokenUtils.setAuthState(true);

    return responseData;
  },

  /**
   * Logout user
   * Cookies are cleared by the server
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
   * Tokens are refreshed via httpOnly cookies by the server
   */
  refreshToken: async (): Promise<boolean> => {
    try {
      await api.post('/auth/refresh-token', {});
      return true;
    } catch {
      tokenUtils.clearTokens();
      return false;
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

  /**
   * Login with Google
   * Tokens are set via httpOnly cookies by the server
   */
  loginWithGoogle: async (): Promise<LoginResponse> => {
    // Sign in with Firebase Google Auth
    const result = await signInWithGoogle();
    if (!result) {
      throw new Error('Google sign-in failed');
    }

    // Get ID token from Firebase
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error('Failed to get ID token');
    }

    // Send to backend for verification
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/google', { idToken });
    const data = response.data.data as LoginResponse;

    // Set auth state to indicate user is logged in
    tokenUtils.setAuthState(true);

    // Sign out from Firebase (we use our own JWT auth)
    await firebaseSignOut();

    return data;
  },

  /**
   * Initiate GitHub OAuth flow
   */
  initiateGitHubLogin: (): void => {
    initiateGitHubAuth();
  },

  /**
   * Complete GitHub OAuth (called from callback page)
   * Tokens are set via httpOnly cookies by the server
   */
  loginWithGitHub: async (code: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/github', { code });
    const data = response.data.data as LoginResponse;

    // Set auth state to indicate user is logged in
    tokenUtils.setAuthState(true);

    return data;
  },
};

export default authService;
