/**
 * Admin Careers Service
 * خدمة إدارة الوظائف
 */

import { apiClient, ApiResponse } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

// Department Types
export interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
}

// Job Types
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobStatus = 'draft' | 'open' | 'closed' | 'filled';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  isPublic: boolean;
}

export interface Job {
  _id: string;
  title: BilingualText;
  slug: string;
  description: BilingualText;
  requirements: BilingualText[];
  responsibilities: BilingualText[];
  benefits: BilingualText[];
  department: Department | string;
  location: BilingualText;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: SalaryRange;
  skills: string[];
  status: JobStatus;
  applicationDeadline?: string;
  applicationsCount: number;
  isFeatured: boolean;
  createdBy?: { name: string; email: string };
  updatedBy?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  department?: string;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  status?: JobStatus;
  featured?: boolean;
  search?: string;
}

export interface JobsPagination {
  page: number;
  limit: number;
  pages: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  pagination: JobsPagination;
}

export interface CreateJobData {
  title: BilingualText;
  slug: string;
  description: BilingualText;
  requirements?: BilingualText[];
  responsibilities?: BilingualText[];
  benefits?: BilingualText[];
  department: string;
  location: BilingualText;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: SalaryRange;
  skills?: string[];
  status?: JobStatus;
  applicationDeadline?: string;
  isFeatured?: boolean;
}

export interface UpdateJobData {
  title?: BilingualText;
  slug?: string;
  description?: BilingualText;
  requirements?: BilingualText[];
  responsibilities?: BilingualText[];
  benefits?: BilingualText[];
  department?: string;
  location?: BilingualText;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryRange?: SalaryRange;
  skills?: string[];
  status?: JobStatus;
  applicationDeadline?: string;
  isFeatured?: boolean;
}

export interface BulkJobUpdateData {
  ids: string[];
  status: JobStatus;
}

// Application Types
export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'shortlisted'
  | 'interviewed'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  _id: string;
  job: { _id: string; title: BilingualText; slug: string } | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  availableFrom?: string;
  status: ApplicationStatus;
  notes?: string;
  rating?: number;
  reviewedBy?: { name: string; email: string } | string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  job?: string;
  status?: ApplicationStatus;
  email?: string;
}

export interface ApplicationsResponse {
  applications: JobApplication[];
  total: number;
  pagination: JobsPagination;
}

export interface UpdateApplicationData {
  status: ApplicationStatus;
  notes?: string;
  rating?: number;
}

export interface BulkApplicationUpdateData {
  ids: string[];
  status: ApplicationStatus;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  hired: number;
  rejected: number;
  withdrawn: number;
}

// API endpoints
const CAREERS_ENDPOINT = '/careers';

// ============================================
// Job API Functions
// ============================================

/**
 * Get all jobs (Admin)
 * جلب جميع الوظائف (للمسؤول)
 */
export async function getJobs(filters: JobFilters = {}): Promise<ApiResponse<JobsResponse>> {
  const response = await apiClient.get<JobsResponse>(`${CAREERS_ENDPOINT}/admin/jobs`, {
    ...filters,
  });
  return response;
}

/**
 * Get job by ID
 * جلب الوظيفة بالمعرف
 */
export async function getJobById(id: string): Promise<ApiResponse<{ job: Job }>> {
  const response = await apiClient.get<{ job: Job }>(`${CAREERS_ENDPOINT}/admin/jobs/${id}`);
  return response;
}

/**
 * Create job
 * إنشاء وظيفة
 */
export async function createJob(
  data: CreateJobData
): Promise<ApiResponse<{ message: string; job: Job }>> {
  const response = await apiClient.post<{ message: string; job: Job }>(
    `${CAREERS_ENDPOINT}/admin/jobs`,
    data
  );
  return response;
}

/**
 * Update job
 * تحديث وظيفة
 */
export async function updateJob(
  id: string,
  data: UpdateJobData
): Promise<ApiResponse<{ message: string; job: Job }>> {
  const response = await apiClient.put<{ message: string; job: Job }>(
    `${CAREERS_ENDPOINT}/admin/jobs/${id}`,
    data
  );
  return response;
}

/**
 * Delete job
 * حذف وظيفة
 */
export async function deleteJob(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.delete<{ message: string }>(
    `${CAREERS_ENDPOINT}/admin/jobs/${id}`
  );
  return response;
}

/**
 * Bulk update jobs status
 * تحديث حالة الوظائف بالجملة
 */
export async function bulkUpdateJobsStatus(
  data: BulkJobUpdateData
): Promise<ApiResponse<{ message: string; modifiedCount: number }>> {
  const response = await apiClient.put<{ message: string; modifiedCount: number }>(
    `${CAREERS_ENDPOINT}/admin/jobs/bulk-status`,
    data
  );
  return response;
}

// ============================================
// Application API Functions
// ============================================

/**
 * Get all applications (Admin)
 * جلب جميع الطلبات (للمسؤول)
 */
export async function getApplications(
  filters: ApplicationFilters = {}
): Promise<ApiResponse<ApplicationsResponse>> {
  const response = await apiClient.get<ApplicationsResponse>(
    `${CAREERS_ENDPOINT}/admin/applications`,
    { ...filters }
  );
  return response;
}

/**
 * Get application by ID
 * جلب الطلب بالمعرف
 */
export async function getApplicationById(
  id: string
): Promise<ApiResponse<{ application: JobApplication }>> {
  const response = await apiClient.get<{ application: JobApplication }>(
    `${CAREERS_ENDPOINT}/admin/applications/${id}`
  );
  return response;
}

/**
 * Get applications for a specific job
 * جلب طلبات وظيفة معينة
 */
export async function getApplicationsByJob(
  jobId: string,
  filters: { page?: number; limit?: number; status?: ApplicationStatus } = {}
): Promise<ApiResponse<ApplicationsResponse>> {
  const response = await apiClient.get<ApplicationsResponse>(
    `${CAREERS_ENDPOINT}/admin/jobs/${jobId}/applications`,
    { ...filters }
  );
  return response;
}

/**
 * Update application status
 * تحديث حالة الطلب
 */
export async function updateApplication(
  id: string,
  data: UpdateApplicationData
): Promise<ApiResponse<{ message: string; application: JobApplication }>> {
  const response = await apiClient.put<{ message: string; application: JobApplication }>(
    `${CAREERS_ENDPOINT}/admin/applications/${id}`,
    data
  );
  return response;
}

/**
 * Delete application
 * حذف طلب
 */
export async function deleteApplication(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.delete<{ message: string }>(
    `${CAREERS_ENDPOINT}/admin/applications/${id}`
  );
  return response;
}

/**
 * Bulk update applications status
 * تحديث حالة الطلبات بالجملة
 */
export async function bulkUpdateApplicationsStatus(
  data: BulkApplicationUpdateData
): Promise<ApiResponse<{ message: string; modifiedCount: number }>> {
  const response = await apiClient.put<{ message: string; modifiedCount: number }>(
    `${CAREERS_ENDPOINT}/admin/applications/bulk-status`,
    data
  );
  return response;
}

/**
 * Get application stats for a job
 * جلب إحصائيات الطلبات للوظيفة
 */
export async function getApplicationStats(jobId: string): Promise<
  ApiResponse<{
    job: { _id: string; title: BilingualText; applicationsCount: number };
    stats: ApplicationStats;
  }>
> {
  const response = await apiClient.get<{
    job: { _id: string; title: BilingualText; applicationsCount: number };
    stats: ApplicationStats;
  }>(`${CAREERS_ENDPOINT}/admin/jobs/${jobId}/stats`);
  return response;
}

// Export service object
export const careersAdminService = {
  // Jobs
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  bulkUpdateJobsStatus,
  // Applications
  getApplications,
  getApplicationById,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
  bulkUpdateApplicationsStatus,
  getApplicationStats,
};

export default careersAdminService;
