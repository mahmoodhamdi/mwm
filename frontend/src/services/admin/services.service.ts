/**
 * Services Admin Service
 * خدمة إدارة الخدمات
 */

import { api, extractData } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

export interface ServiceFeature {
  title: BilingualText;
  description: BilingualText;
  icon?: string;
}

export interface ServicePricingPlan {
  name: BilingualText;
  description: BilingualText;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'one-time';
  features: BilingualText[];
  isPopular: boolean;
  order: number;
}

export interface ServiceFAQ {
  question: BilingualText;
  answer: BilingualText;
  order: number;
}

export interface ServiceProcessStep {
  title: BilingualText;
  description: BilingualText;
  icon?: string;
  order: number;
}

export interface ServiceCategory {
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

export interface Service {
  _id: string;
  title: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  category: ServiceCategory | string;
  icon?: string;
  image?: string;
  gallery?: string[];
  features: ServiceFeature[];
  pricingPlans?: ServicePricingPlan[];
  faqs?: ServiceFAQ[];
  processSteps?: ServiceProcessStep[];
  technologies?: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  viewCount: number;
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServicesFilters {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: string;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CategoriesResponse {
  categories: ServiceCategory[];
  total: number;
}

export interface CreateServiceData {
  title: BilingualText;
  shortDescription: BilingualText;
  description: BilingualText;
  category: string;
  icon?: string;
  image?: string;
  gallery?: string[];
  features?: ServiceFeature[];
  pricingPlans?: ServicePricingPlan[];
  faqs?: ServiceFAQ[];
  processSteps?: ServiceProcessStep[];
  technologies?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  seo?: {
    metaTitle?: BilingualText;
    metaDescription?: BilingualText;
    keywords?: string[];
  };
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

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
 * Get all services (admin)
 */
export async function getAllServices(filters: ServicesFilters = {}): Promise<ServicesResponse> {
  const response = await api.get('/services/admin', { params: filters });
  return extractData<ServicesResponse>(response);
}

/**
 * Get service by ID (admin)
 */
export async function getServiceById(id: string): Promise<Service> {
  const response = await api.get(`/services/admin/${id}`);
  return extractData<{ service: Service }>(response).service;
}

/**
 * Create service
 */
export async function createService(data: CreateServiceData): Promise<Service> {
  const response = await api.post('/services/admin', data);
  return extractData<{ service: Service }>(response).service;
}

/**
 * Update service
 */
export async function updateService(id: string, data: UpdateServiceData): Promise<Service> {
  const response = await api.put(`/services/admin/${id}`, data);
  return extractData<{ service: Service }>(response).service;
}

/**
 * Delete service
 */
export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/admin/${id}`);
}

/**
 * Reorder services
 */
export async function reorderServices(
  orderedIds: Array<{ id: string; order: number }>
): Promise<void> {
  await api.put('/services/admin/reorder', { services: orderedIds });
}

/**
 * Get all categories (admin)
 */
export async function getAllCategories(): Promise<CategoriesResponse> {
  const response = await api.get('/services/admin/categories');
  return extractData<CategoriesResponse>(response);
}

/**
 * Create category
 */
export async function createCategory(data: CreateCategoryData): Promise<ServiceCategory> {
  const response = await api.post('/services/admin/categories', data);
  return extractData<{ category: ServiceCategory }>(response).category;
}

/**
 * Update category
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryData
): Promise<ServiceCategory> {
  const response = await api.put(`/services/admin/categories/${id}`, data);
  return extractData<{ category: ServiceCategory }>(response).category;
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/services/admin/categories/${id}`);
}

// Service object
export const servicesAdminService = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default servicesAdminService;
