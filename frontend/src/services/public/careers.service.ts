/**
 * Careers API Service
 * خدمة واجهة برمجة الوظائف
 */

import { apiClient, ApiResponse } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

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
  } catch {
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
};

export default careersService;
