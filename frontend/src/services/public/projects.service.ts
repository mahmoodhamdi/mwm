/**
 * Projects API Service
 * خدمة واجهة برمجة المشاريع
 */

import { apiClient, ApiResponse } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export interface ProjectCategory {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  isActive: boolean;
  order: number;
}

export interface ProjectTechnology {
  name: string;
  icon?: string;
}

export interface ProjectTestimonial {
  clientName: BilingualText;
  clientTitle?: BilingualText;
  clientCompany?: string;
  clientImage?: string;
  content: BilingualText;
  rating?: number;
}

export interface Project {
  _id: string;
  title: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  category: ProjectCategory | string;
  client?: BilingualText;
  clientLogo?: string;
  thumbnail: string;
  images: string[];
  technologies: ProjectTechnology[];
  features?: BilingualText[];
  challenges?: BilingualText;
  solution?: BilingualText;
  results?: BilingualText;
  testimonial?: ProjectTestimonial;
  liveUrl?: string;
  githubUrl?: string;
  duration?: string;
  completedAt?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

// API endpoints
const PROJECTS_ENDPOINT = '/projects';
const CATEGORIES_ENDPOINT = '/projects/categories';

/**
 * Get all active projects
 */
export async function getProjects(
  filters: ProjectsFilters = {}
): Promise<ApiResponse<ProjectsResponse>> {
  const response = await apiClient.get<ProjectsResponse>(PROJECTS_ENDPOINT, {
    ...filters,
    isActive: true,
  });
  return response;
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await apiClient.get<{ project: Project }>(`${PROJECTS_ENDPOINT}/${slug}`);
    return response.data?.project || null;
  } catch {
    return null;
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const response = await apiClient.get<{ projects: Project[] }>(`${PROJECTS_ENDPOINT}/featured`, {
    limit,
  });
  return response.data?.projects || [];
}

/**
 * Get project categories
 */
export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const response = await apiClient.get<{ categories: ProjectCategory[] }>(CATEGORIES_ENDPOINT);
  return response.data?.categories || [];
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(categorySlug: string): Promise<Project[]> {
  const response = await apiClient.get<{ projects: Project[] }>(
    `${CATEGORIES_ENDPOINT}/${categorySlug}/projects`
  );
  return response.data?.projects || [];
}

/**
 * Search projects
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const response = await apiClient.get<{ projects: Project[] }>(`${PROJECTS_ENDPOINT}/search`, {
    q: query,
  });
  return response.data?.projects || [];
}

export const projectsService = {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectCategories,
  getProjectsByCategory,
  searchProjects,
};

export default projectsService;
