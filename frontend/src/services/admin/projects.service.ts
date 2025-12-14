/**
 * Projects Admin Service
 * خدمة إدارة المشاريع
 */

import { api, extractData } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export interface ProjectTechnology {
  name: string;
  icon?: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

export interface ProjectClient {
  name: string;
  logo?: string;
  website?: string;
}

export interface ProjectTestimonial {
  text: BilingualText;
  author: string;
  position: BilingualText;
  photo?: string;
}

export interface ProjectCategory {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  challenge?: BilingualText;
  solution?: BilingualText;
  results?: BilingualText;
  thumbnail?: string;
  images: string[];
  video?: string;
  category: ProjectCategory | string;
  client?: ProjectClient;
  testimonial?: ProjectTestimonial;
  technologies: ProjectTechnology[];
  liveUrl?: string;
  githubUrl?: string;
  duration?: string;
  completedAt?: string;
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
    ogImage?: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsFilters {
  page?: number;
  limit?: number;
  category?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CategoriesResponse {
  categories: ProjectCategory[];
  total: number;
}

export interface CreateProjectData {
  title: BilingualText;
  shortDescription: BilingualText;
  description: BilingualText;
  challenge?: BilingualText;
  solution?: BilingualText;
  results?: BilingualText;
  thumbnail?: string;
  images?: string[];
  video?: string;
  category: string;
  client?: ProjectClient;
  testimonial?: ProjectTestimonial;
  technologies?: ProjectTechnology[];
  liveUrl?: string;
  githubUrl?: string;
  duration?: string;
  completedAt?: string;
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
    ogImage?: string;
  };
  isFeatured?: boolean;
  isPublished?: boolean;
  order?: number;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface CreateCategoryData {
  name: BilingualText;
  description?: BilingualText;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

// Admin Service Functions

/**
 * Get all projects (admin)
 */
export async function getAllProjects(filters: ProjectsFilters = {}): Promise<ProjectsResponse> {
  const response = await api.get('/projects/admin', { params: filters });
  return extractData<ProjectsResponse>(response);
}

/**
 * Get project by ID (admin)
 */
export async function getProjectById(id: string): Promise<Project> {
  const response = await api.get(`/projects/admin/${id}`);
  return extractData<{ project: Project }>(response).project;
}

/**
 * Create project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  const response = await api.post('/projects/admin', data);
  return extractData<{ project: Project }>(response).project;
}

/**
 * Update project
 */
export async function updateProject(id: string, data: UpdateProjectData): Promise<Project> {
  const response = await api.put(`/projects/admin/${id}`, data);
  return extractData<{ project: Project }>(response).project;
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/admin/${id}`);
}

/**
 * Toggle publish status
 */
export async function togglePublishStatus(id: string): Promise<Project> {
  const response = await api.put(`/projects/admin/${id}/publish`);
  return extractData<{ project: Project }>(response).project;
}

/**
 * Toggle featured status
 */
export async function toggleFeaturedStatus(id: string): Promise<Project> {
  const response = await api.put(`/projects/admin/${id}/featured`);
  return extractData<{ project: Project }>(response).project;
}

/**
 * Reorder projects
 */
export async function reorderProjects(
  orderedIds: Array<{ id: string; order: number }>
): Promise<void> {
  await api.put('/projects/admin/reorder', { projects: orderedIds });
}

/**
 * Get all categories (admin)
 */
export async function getAllCategories(): Promise<CategoriesResponse> {
  const response = await api.get('/projects/admin/categories');
  return extractData<CategoriesResponse>(response);
}

/**
 * Create category
 */
export async function createCategory(data: CreateCategoryData): Promise<ProjectCategory> {
  const response = await api.post('/projects/admin/categories', data);
  return extractData<{ category: ProjectCategory }>(response).category;
}

/**
 * Update category
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryData
): Promise<ProjectCategory> {
  const response = await api.put(`/projects/admin/categories/${id}`, data);
  return extractData<{ category: ProjectCategory }>(response).category;
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/projects/admin/categories/${id}`);
}

// Service object
export const projectsAdminService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePublishStatus,
  toggleFeaturedStatus,
  reorderProjects,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default projectsAdminService;
