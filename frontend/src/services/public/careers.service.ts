/**
 * Careers API Service
 * خدمة واجهة برمجة الوظائف
 */

import { apiClient, ApiResponse } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  isPublic: boolean;
}

export interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  isActive: boolean;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobStatus = 'draft' | 'open' | 'closed' | 'filled';

export interface Job {
  _id: string;
  title: BilingualText;
  slug: string;
  description: BilingualText;
  requirements?: BilingualText[];
  responsibilities?: BilingualText[];
  benefits?: BilingualText[];
  department: Department | string;
  location: BilingualText;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: SalaryRange;
  skills: string[];
  status: JobStatus;
  applicationDeadline?: string;
  isFeatured: boolean;
  applicationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobsFilters {
  page?: number;
  limit?: number;
  department?: string;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  status?: JobStatus;
  featured?: boolean;
  locale?: 'ar' | 'en';
  search?: string;
}

export interface JobsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: JobsPagination;
}

export interface JobApplication {
  job: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  linkedIn?: string;
  portfolio?: string;
  expectedSalary?: number;
  availableFrom?: string;
  experience: number;
  education?: string;
  skills?: string[];
}

// API endpoints
const CAREERS_ENDPOINT = '/careers';

/**
 * Upload resume file
 * رفع ملف السيرة الذاتية
 */
export async function uploadResume(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${CAREERS_ENDPOINT}/upload-resume`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        // Get CSRF token from cookie
        'x-csrf-token':
          document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_token='))
            ?.split('=')[1] || '',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Failed to upload resume');
  }

  const data = await response.json();
  return data.data || { url: '', filename: '' };
}

/**
 * Get jobs with filters
 * جلب الوظائف مع الفلاتر
 */
export async function getJobs(filters: JobsFilters = {}): Promise<ApiResponse<JobsResponse>> {
  const response = await apiClient.get<JobsResponse>(`${CAREERS_ENDPOINT}/jobs`, { ...filters });
  return response;
}

/**
 * Get job by slug
 * جلب الوظيفة بالرابط المختصر
 */
export async function getJobBySlug(slug: string, locale?: 'ar' | 'en'): Promise<Job | null> {
  try {
    const params = locale ? { locale } : {};
    const response = await apiClient.get<{ job: Job }>(`${CAREERS_ENDPOINT}/jobs/${slug}`, params);
    return response.data?.job || null;
  } catch (error) {
    // Log error for debugging - 404s are expected for invalid slugs
    console.error(`[CareersService] Failed to fetch job with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get featured jobs
 * جلب الوظائف المميزة
 */
export async function getFeaturedJobs(limit = 5, locale?: 'ar' | 'en'): Promise<Job[]> {
  const params: Record<string, unknown> = { limit };
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ jobs: Job[] }>(
    `${CAREERS_ENDPOINT}/jobs/featured`,
    params
  );
  return response.data?.jobs || [];
}

/**
 * Get departments
 * جلب الأقسام
 */
export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<{ departments: Department[] }>('/team/departments');
  return response.data?.departments || [];
}

/**
 * Submit job application
 * تقديم طلب توظيف
 */
export async function submitApplication(
  application: JobApplication
): Promise<ApiResponse<{ message: string; application: { _id: string } }>> {
  const response = await apiClient.post<{ message: string; application: { _id: string } }>(
    `${CAREERS_ENDPOINT}/apply`,
    application
  );
  return response;
}

export const careersService = {
  getJobs,
  getJobBySlug,
  getFeaturedJobs,
  getDepartments,
  submitApplication,
  uploadResume,
};

export default careersService;
