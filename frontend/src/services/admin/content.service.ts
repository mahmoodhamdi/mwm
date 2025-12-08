/**
 * Content Service (CMS)
 * خدمة المحتوى
 */

import { apiClient, ApiResponse } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export type ContentType = 'text' | 'html' | 'image' | 'array' | 'object';

export interface ContentItem {
  _id: string;
  key: string;
  type: ContentType;
  section: string;
  content: BilingualText;
  metadata?: Record<string, unknown>;
  order: number;
  isActive: boolean;
  isSystem: boolean;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ContentFilters {
  page?: number;
  limit?: number;
  section?: string;
  type?: ContentType;
  isActive?: boolean;
  search?: string;
}

export interface CreateContentData {
  key: string;
  type: ContentType;
  section: string;
  content: BilingualText;
  metadata?: Record<string, unknown>;
  order?: number;
  isActive?: boolean;
}

export interface UpdateContentData {
  type?: ContentType;
  section?: string;
  content?: BilingualText;
  metadata?: Record<string, unknown>;
  order?: number;
  isActive?: boolean;
}

// API endpoints
const CONTENT_ENDPOINT = '/content';

/**
 * Get content by key
 */
export async function getContentByKey(key: string, locale?: 'ar' | 'en'): Promise<ContentItem> {
  const params: Record<string, unknown> = {};
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ content: ContentItem }>(
    `${CONTENT_ENDPOINT}/${key}`,
    params
  );
  return response.data?.content as ContentItem;
}

/**
 * Get content by section
 */
export async function getContentBySection(
  section: string,
  locale?: 'ar' | 'en'
): Promise<ContentItem[]> {
  const params: Record<string, unknown> = {};
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ contents: ContentItem[] }>(
    `${CONTENT_ENDPOINT}/section/${section}`,
    params
  );
  return response.data?.contents || [];
}

/**
 * Get all content (Admin) with pagination
 */
export async function getAllContent(
  filters: ContentFilters = {}
): Promise<ApiResponse<ContentItem[]>> {
  const response = await apiClient.get<ContentItem[]>(
    CONTENT_ENDPOINT,
    filters as Record<string, unknown>
  );
  return response;
}

/**
 * Get sections list
 */
export async function getSections(): Promise<string[]> {
  const response = await apiClient.get<{ sections: string[] }>(`${CONTENT_ENDPOINT}/sections`);
  return response.data?.sections || [];
}

/**
 * Create content
 */
export async function createContent(data: CreateContentData): Promise<ContentItem> {
  const response = await apiClient.post<{ content: ContentItem }>(CONTENT_ENDPOINT, data);
  return response.data?.content as ContentItem;
}

/**
 * Update content by key
 */
export async function updateContent(key: string, data: UpdateContentData): Promise<ContentItem> {
  const response = await apiClient.put<{ content: ContentItem }>(
    `${CONTENT_ENDPOINT}/${key}`,
    data
  );
  return response.data?.content as ContentItem;
}

/**
 * Upsert content (create or update)
 */
export async function upsertContent(key: string, data: CreateContentData): Promise<ContentItem> {
  const response = await apiClient.put<{ content: ContentItem }>(
    `${CONTENT_ENDPOINT}/upsert/${key}`,
    data
  );
  return response.data?.content as ContentItem;
}

/**
 * Bulk upsert content
 */
export async function bulkUpsertContent(
  contents: Array<{ key: string; data: CreateContentData }>
): Promise<ContentItem[]> {
  const response = await apiClient.post<{ contents: ContentItem[] }>(`${CONTENT_ENDPOINT}/bulk`, {
    contents,
  });
  return response.data?.contents || [];
}

/**
 * Delete content by key
 */
export async function deleteContent(key: string): Promise<void> {
  await apiClient.delete(`${CONTENT_ENDPOINT}/${key}`);
}

export const contentService = {
  getContentByKey,
  getContentBySection,
  getAllContent,
  getSections,
  createContent,
  updateContent,
  upsertContent,
  bulkUpsertContent,
  deleteContent,
};

export default contentService;
