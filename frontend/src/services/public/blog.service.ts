/**
 * Blog API Service
 * خدمة واجهة برمجة المدونة
 */

import { apiClient, ApiResponse, RequestOptions } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export interface BlogSEO {
  metaTitle?: BilingualText;
  metaDescription?: BilingualText;
  metaKeywords?: string[];
  ogImage?: string;
}

export interface BlogCategory {
  _id: string;
  name: BilingualText;
  slug: string;
  description?: BilingualText;
  image?: string;
  parent?: BlogCategory | string;
  order: number;
  isActive: boolean;
  postCount?: number;
}

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
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  views: number;
  readingTime: number;
  seo?: BlogSEO;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostsFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  locale?: 'ar' | 'en';
  search?: string;
}

export interface BlogPostsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: BlogPostsPagination;
}

// API endpoints
const BLOG_ENDPOINT = '/blog';

/**
 * Get blog posts with filters
 * جلب مقالات المدونة مع الفلاتر
 */
export async function getBlogPosts(
  filters: BlogPostsFilters = {},
  options?: RequestOptions
): Promise<ApiResponse<BlogPostsResponse>> {
  const response = await apiClient.get<BlogPostsResponse>(
    `${BLOG_ENDPOINT}/posts`,
    { ...filters },
    options
  );
  return response;
}

/**
 * Get blog post by slug
 * جلب مقال المدونة بالرابط المختصر
 */
export async function getBlogPostBySlug(
  slug: string,
  locale?: 'ar' | 'en'
): Promise<BlogPost | null> {
  try {
    const params = locale ? { locale } : {};
    const response = await apiClient.get<{ post: BlogPost }>(
      `${BLOG_ENDPOINT}/posts/${slug}`,
      params
    );
    return response.data?.post || null;
  } catch {
    return null;
  }
}

/**
 * Get featured blog posts
 * جلب المقالات المميزة
 */
export async function getFeaturedBlogPosts(limit = 5, locale?: 'ar' | 'en'): Promise<BlogPost[]> {
  const params: Record<string, unknown> = { limit };
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ posts: BlogPost[] }>(`${BLOG_ENDPOINT}/featured`, params);
  return response.data?.posts || [];
}

/**
 * Get related blog posts
 * جلب المقالات ذات الصلة
 */
export async function getRelatedPosts(
  slug: string,
  limit = 4,
  locale?: 'ar' | 'en'
): Promise<BlogPost[]> {
  const params: Record<string, unknown> = { limit };
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ posts: BlogPost[] }>(
    `${BLOG_ENDPOINT}/posts/${slug}/related`,
    params
  );
  return response.data?.posts || [];
}

/**
 * Get all blog categories
 * جلب جميع فئات المدونة
 */
export async function getBlogCategories(locale?: 'ar' | 'en'): Promise<BlogCategory[]> {
  const params = locale ? { locale } : {};
  const response = await apiClient.get<{ categories: BlogCategory[] }>(
    `${BLOG_ENDPOINT}/categories`,
    params
  );
  return response.data?.categories || [];
}

/**
 * Get blog category by slug
 * جلب فئة المدونة بالرابط المختصر
 */
export async function getBlogCategoryBySlug(
  slug: string,
  locale?: 'ar' | 'en'
): Promise<BlogCategory | null> {
  try {
    const params = locale ? { locale } : {};
    const response = await apiClient.get<{ category: BlogCategory }>(
      `${BLOG_ENDPOINT}/categories/${slug}`,
      params
    );
    return response.data?.category || null;
  } catch {
    return null;
  }
}

/**
 * Get all blog tags
 * جلب جميع وسوم المدونة
 */
export async function getBlogTags(locale?: 'ar' | 'en'): Promise<string[]> {
  const params = locale ? { locale } : {};
  const response = await apiClient.get<{ tags: string[] }>(`${BLOG_ENDPOINT}/tags`, params);
  return response.data?.tags || [];
}

export const blogService = {
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedBlogPosts,
  getRelatedPosts,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogTags,
};

export default blogService;
