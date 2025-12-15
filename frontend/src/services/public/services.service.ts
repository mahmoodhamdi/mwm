/**
 * Services API Service
 * خدمة واجهة برمجة الخدمات
 */

import { apiClient, ApiResponse } from '@/lib/api';
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
  featured?: boolean;
  search?: string;
  sort?: string;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
}

// API endpoints
const SERVICES_ENDPOINT = '/services';
const CATEGORIES_ENDPOINT = '/services/categories';

/**
 * Get all active services
 */
export async function getServices(
  filters: ServicesFilters = {}
): Promise<ApiResponse<ServicesResponse>> {
  const response = await apiClient.get<ServicesResponse>(SERVICES_ENDPOINT, {
    ...filters,
    isActive: true,
  });
  return response;
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await apiClient.get<{ service: Service }>(`${SERVICES_ENDPOINT}/${slug}`);
    return response.data?.service || null;
  } catch {
    return null;
  }
}

/**
 * Get featured services
 */
export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  const response = await apiClient.get<{ services: Service[] }>(`${SERVICES_ENDPOINT}/featured`, {
    limit,
  });
  return response.data?.services || [];
}

/**
 * Get service categories
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const response = await apiClient.get<{ categories: ServiceCategory[] }>(CATEGORIES_ENDPOINT);
  return response.data?.categories || [];
}

/**
 * Get services by category
 */
export async function getServicesByCategory(categorySlug: string): Promise<Service[]> {
  const response = await apiClient.get<{ services: Service[] }>(
    `${CATEGORIES_ENDPOINT}/${categorySlug}/services`
  );
  return response.data?.services || [];
}

/**
 * Search services
 */
export async function searchServices(query: string): Promise<Service[]> {
  const response = await apiClient.get<{ services: Service[] }>(`${SERVICES_ENDPOINT}/search`, {
    q: query,
  });
  return response.data?.services || [];
}

export const servicesService = {
  getServices,
  getServiceBySlug,
  getFeaturedServices,
  getServiceCategories,
  getServicesByCategory,
  searchServices,
};

export default servicesService;
