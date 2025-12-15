/**
 * API Client
 * عميل الـ API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

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

// Create axios instance
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add language header
        const locale = localStorage.getItem('locale') || 'ar';
        config.headers['Accept-Language'] = locale;
      }

      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config;

      // Handle 401 - Unauthorized (token expired)
      if (error.response?.status === 401 && originalRequest) {
        // Try to refresh token
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post<ApiResponse<{ accessToken: string }>>(
              `${baseURL}/auth/refresh`,
              { refreshToken }
            );

            if (response.data.success && response.data.data) {
              localStorage.setItem('accessToken', response.data.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
              return client(originalRequest);
            }
          }
        } catch {
          // Refresh failed, clear tokens
          // AuthProvider will handle redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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

// Helper methods with proper typing
export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    api.get<ApiResponse<T>>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: unknown) =>
    api.post<ApiResponse<T>>(url, data).then(res => res.data),

  put: <T>(url: string, data?: unknown) => api.put<ApiResponse<T>>(url, data).then(res => res.data),

  patch: <T>(url: string, data?: unknown) =>
    api.patch<ApiResponse<T>>(url, data).then(res => res.data),

  delete: <T>(url: string) => api.delete<ApiResponse<T>>(url).then(res => res.data),
};

export default apiClient;
