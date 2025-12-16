/**
 * API Client
 * عميل الـ API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// CSRF token cookie name (must match backend)
const CSRF_COOKIE_NAME = 'csrfToken';

/**
 * Get CSRF token from cookie
 */
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

// Track if refresh is in progress to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const onRefreshComplete = (success: boolean) => {
  refreshSubscribers.forEach(callback => callback(success));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (success: boolean) => void) => {
  refreshSubscribers.push(callback);
};

// Create axios instance
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: enables cookies to be sent with requests
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        // Add language header
        const locale = localStorage.getItem('locale') || 'ar';
        config.headers['Accept-Language'] = locale;

        // Add CSRF token for state-changing requests
        const method = config.method?.toUpperCase();
        if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
          // Get CSRF token from cookie
          const csrfToken = getCsrfTokenFromCookie();
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }
      }

      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 - Unauthorized (token expired)
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // If already refreshing, wait for it to complete
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            addRefreshSubscriber((success: boolean) => {
              if (success) {
                resolve(client(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh token - cookies are sent automatically with withCredentials: true
          await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });

          isRefreshing = false;
          onRefreshComplete(true);

          // Retry original request - new cookies will be sent automatically
          return client(originalRequest);
        } catch {
          // Refresh failed - AuthProvider will handle redirect to login
          isRefreshing = false;
          onRefreshComplete(false);
        }
      }

      // Transform error to consistent format
      const apiError: ApiError = {
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.error?.message || error.message || 'An error occurred',
        details: error.response?.data?.error?.details,
        statusCode: error.response?.status || 500,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Export configured client
export const api = createApiClient(API_BASE_URL);

/**
 * Helper to extract nested data from API response
 * This handles the common pattern where API returns { success: boolean, data: T }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractData = <T>(response: any): T => response.data.data as T;

// Request options interface
export interface RequestOptions {
  signal?: AbortSignal;
}

// Helper methods with proper typing
export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>, options?: RequestOptions) =>
    api.get<ApiResponse<T>>(url, { params, signal: options?.signal }).then(res => res.data),

  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    api.post<ApiResponse<T>>(url, data, { signal: options?.signal }).then(res => res.data),

  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    api.put<ApiResponse<T>>(url, data, { signal: options?.signal }).then(res => res.data),

  patch: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    api.patch<ApiResponse<T>>(url, data, { signal: options?.signal }).then(res => res.data),

  delete: <T>(url: string, options?: RequestOptions) =>
    api.delete<ApiResponse<T>>(url, { signal: options?.signal }).then(res => res.data),
};

export default apiClient;
