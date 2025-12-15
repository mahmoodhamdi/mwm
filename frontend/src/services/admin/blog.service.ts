/**
 * Admin Blog Service
 * خدمة إدارة المدونة
 */

import { apiClient, ApiResponse } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

export interface BlogSEO {
  metaTitle?: BilingualText;
  metaDescription?: BilingualText;
  metaKeywords?: string[];
  ogImage?: string;
}

// Category Types
export interface BlogCategory {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  image?: string;
  parent?: BlogCategory | string | null;
  order: number;
  isActive: boolean;
  postCount?: number;
  createdBy?: { name: string; email: string };
  updatedBy?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  parent?: string | null;
}

export interface CategoriesResponse {
  categories: BlogCategory[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateCategoryData {
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  image?: string;
  parent?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: BilingualText;
  slug?: string;
  description?: BilingualText;
  image?: string;
  parent?: string | null;
  order?: number;
  isActive?: boolean;
}

// Post Types
export interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BlogPost {
  _id: string;
  title: BilingualText;
  slug: string;
  excerpt: BilingualText;
  content: BilingualText;
  featuredImage?: string;
  images?: string[];
  category: BlogCategory | string;
  tags: BilingualText[];
  author: BlogAuthor | string;
  status: PostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  views: number;
  readingTime: number;
  seo?: BlogSEO;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: PostStatus;
  featured?: boolean;
  author?: string;
  search?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface PostsPagination {
  page: number;
  limit: number;
  pages: number;
}

export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  pagination: PostsPagination;
}

export interface CreatePostData {
  title: BilingualText;
  slug: string;
  excerpt: BilingualText;
  content: BilingualText;
  featuredImage?: string;
  images?: string[];
  category: string;
  tags?: BilingualText[];
  status?: PostStatus;
  scheduledAt?: string;
  isFeatured?: boolean;
  readingTime?: number;
  seo?: BlogSEO;
}

export interface UpdatePostData {
  title?: BilingualText;
  slug?: string;
  excerpt?: BilingualText;
  content?: BilingualText;
  featuredImage?: string;
  images?: string[];
  category?: string;
  tags?: BilingualText[];
  status?: PostStatus;
  scheduledAt?: string;
  isFeatured?: boolean;
  readingTime?: number;
  seo?: BlogSEO;
}

export interface BulkUpdateData {
  ids: string[];
  status: PostStatus;
}

// API endpoints
const BLOG_ENDPOINT = '/blog';

// ============================================
// Category API Functions
// ============================================

/**
 * Get all categories (Admin)
 * جلب جميع الفئات (للمسؤول)
 */
export async function getCategories(
  filters: CategoryFilters = {}
): Promise<ApiResponse<CategoriesResponse>> {
  const params: Record<string, unknown> = { ...filters };
  if (filters.parent === null) {
    params.parent = 'null';
  }
  const response = await apiClient.get<CategoriesResponse>(
    `${BLOG_ENDPOINT}/admin/categories`,
    params
  );
  return response;
}

/**
 * Get category by ID
 * جلب الفئة بالمعرف
 */
export async function getCategoryById(
  id: string
): Promise<ApiResponse<{ category: BlogCategory }>> {
  const response = await apiClient.get<{ category: BlogCategory }>(
    `${BLOG_ENDPOINT}/admin/categories/${id}`
  );
  return response;
}

/**
 * Create category
 * إنشاء فئة
 */
export async function createCategory(
  data: CreateCategoryData
): Promise<ApiResponse<{ message: string; category: BlogCategory }>> {
  const response = await apiClient.post<{ message: string; category: BlogCategory }>(
    `${BLOG_ENDPOINT}/admin/categories`,
    data
  );
  return response;
}

/**
 * Update category
 * تحديث فئة
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryData
): Promise<ApiResponse<{ message: string; category: BlogCategory }>> {
  const response = await apiClient.put<{ message: string; category: BlogCategory }>(
    `${BLOG_ENDPOINT}/admin/categories/${id}`,
    data
  );
  return response;
}

/**
 * Delete category
 * حذف فئة
 */
export async function deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.delete<{ message: string }>(
    `${BLOG_ENDPOINT}/admin/categories/${id}`
  );
  return response;
}

// ============================================
// Post API Functions
// ============================================

/**
 * Get all posts (Admin)
 * جلب جميع المقالات (للمسؤول)
 */
export async function getPosts(filters: PostFilters = {}): Promise<ApiResponse<PostsResponse>> {
  const response = await apiClient.get<PostsResponse>(`${BLOG_ENDPOINT}/admin/posts`, {
    ...filters,
  });
  return response;
}

/**
 * Get post by ID
 * جلب المقال بالمعرف
 */
export async function getPostById(id: string): Promise<ApiResponse<{ post: BlogPost }>> {
  const response = await apiClient.get<{ post: BlogPost }>(`${BLOG_ENDPOINT}/admin/posts/${id}`);
  return response;
}

/**
 * Create post
 * إنشاء مقال
 */
export async function createPost(
  data: CreatePostData
): Promise<ApiResponse<{ message: string; post: BlogPost }>> {
  const response = await apiClient.post<{ message: string; post: BlogPost }>(
    `${BLOG_ENDPOINT}/admin/posts`,
    data
  );
  return response;
}

/**
 * Update post
 * تحديث مقال
 */
export async function updatePost(
  id: string,
  data: UpdatePostData
): Promise<ApiResponse<{ message: string; post: BlogPost }>> {
  const response = await apiClient.put<{ message: string; post: BlogPost }>(
    `${BLOG_ENDPOINT}/admin/posts/${id}`,
    data
  );
  return response;
}

/**
 * Delete post
 * حذف مقال
 */
export async function deletePost(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.delete<{ message: string }>(
    `${BLOG_ENDPOINT}/admin/posts/${id}`
  );
  return response;
}

/**
 * Bulk update posts status
 * تحديث حالة المقالات بالجملة
 */
export async function bulkUpdatePostsStatus(
  data: BulkUpdateData
): Promise<ApiResponse<{ message: string; modifiedCount: number }>> {
  const response = await apiClient.put<{ message: string; modifiedCount: number }>(
    `${BLOG_ENDPOINT}/admin/posts/bulk-status`,
    data
  );
  return response;
}

/**
 * Get post stats
 * جلب إحصائيات المقالات
 */
export async function getPostStats(): Promise<
  ApiResponse<{
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    totalViews: number;
  }>
> {
  const response = await apiClient.get<{
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
    totalViews: number;
  }>(`${BLOG_ENDPOINT}/admin/stats`);
  return response;
}

// Export service object
export const blogAdminService = {
  // Categories
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Posts
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  bulkUpdatePostsStatus,
  getPostStats,
};

export default blogAdminService;
