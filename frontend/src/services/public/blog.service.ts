/**
 * Blog API Service
 * خدمة واجهة برمجة المدونة
 */

import { apiClient, ApiResponse, RequestOptions } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

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

// ============================================
// Comment Types and API
// ============================================

export interface BlogComment {
  _id: string;
  post: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  guestName?: string;
  guestEmail?: string;
  content: string;
  parent?: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likesCount: number;
  likedBy: string[];
  isEdited: boolean;
  editedAt?: string;
  repliesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  data: BlogComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateCommentData {
  post: string;
  content: string;
  parent?: string;
}

export interface CreateGuestCommentData {
  post: string;
  content: string;
  guestName: string;
  guestEmail: string;
  parent?: string;
}

/**
 * Get comments for a blog post
 * جلب تعليقات المقال
 */
export async function getPostComments(
  slug: string,
  options: {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'popular';
    parent?: string;
  } = {}
): Promise<CommentsResponse> {
  const params: Record<string, unknown> = {
    page: options.page || 1,
    limit: options.limit || 20,
    sort: options.sort || 'newest',
  };
  if (options.parent !== undefined) {
    params.parent = options.parent;
  }

  const response = await apiClient.get<CommentsResponse>(
    `${BLOG_ENDPOINT}/posts/${slug}/comments`,
    params
  );
  return response.data || { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
}

/**
 * Create a comment (authenticated user)
 * إنشاء تعليق (للمستخدم المسجل)
 */
export async function createComment(
  data: CreateCommentData
): Promise<{ message: string; comment: BlogComment }> {
  const response = await apiClient.post<{ message: string; comment: BlogComment }>(
    `${BLOG_ENDPOINT}/posts/comments`,
    data
  );
  return response.data || { message: '', comment: {} as BlogComment };
}

/**
 * Create a guest comment (unauthenticated user)
 * إنشاء تعليق للضيف
 */
export async function createGuestComment(
  data: CreateGuestCommentData
): Promise<{ message: string; comment: Partial<BlogComment> }> {
  const response = await apiClient.post<{ message: string; comment: Partial<BlogComment> }>(
    `${BLOG_ENDPOINT}/posts/comments/guest`,
    data
  );
  return response.data || { message: '', comment: {} };
}

/**
 * Update own comment
 * تحديث التعليق الخاص
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<{ message: string; comment: BlogComment }> {
  const response = await apiClient.put<{ message: string; comment: BlogComment }>(
    `${BLOG_ENDPOINT}/comments/${commentId}`,
    { content }
  );
  return response.data || { message: '', comment: {} as BlogComment };
}

/**
 * Delete own comment
 * حذف التعليق الخاص
 */
export async function deleteComment(commentId: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `${BLOG_ENDPOINT}/comments/${commentId}`
  );
  return response.data || { message: '' };
}

/**
 * Like/unlike a comment
 * إعجاب/إلغاء إعجاب بتعليق
 */
export async function toggleCommentLike(
  commentId: string
): Promise<{ message: string; liked: boolean; likesCount: number }> {
  const response = await apiClient.post<{ message: string; liked: boolean; likesCount: number }>(
    `${BLOG_ENDPOINT}/comments/${commentId}/like`
  );
  return response.data || { message: '', liked: false, likesCount: 0 };
}

// ============================================
// Bookmark/Save Post API
// ============================================

export interface SavedPostsResponse {
  posts: BlogPost[];
  pagination: BlogPostsPagination;
}

/**
 * Get user's saved posts
 * جلب المقالات المحفوظة للمستخدم
 */
export async function getSavedPosts(
  options: {
    page?: number;
    limit?: number;
    locale?: 'ar' | 'en';
  } = {}
): Promise<SavedPostsResponse> {
  const params: Record<string, unknown> = {
    page: options.page || 1,
    limit: options.limit || 10,
  };
  if (options.locale) params.locale = options.locale;

  const response = await apiClient.get<SavedPostsResponse>(`${BLOG_ENDPOINT}/saved`, params);
  return response.data || { posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
}

/**
 * Check if a post is saved
 * التحقق مما إذا كان المقال محفوظاً
 */
export async function isPostSaved(slug: string): Promise<boolean> {
  try {
    const response = await apiClient.get<{ saved: boolean }>(
      `${BLOG_ENDPOINT}/posts/${slug}/saved`
    );
    return response.data?.saved || false;
  } catch {
    return false;
  }
}

/**
 * Save a post to user's collection
 * حفظ مقال في مجموعة المستخدم
 */
export async function savePost(slug: string): Promise<{ message: string; saved: boolean }> {
  const response = await apiClient.post<{ message: string; saved: boolean }>(
    `${BLOG_ENDPOINT}/posts/${slug}/save`
  );
  return response.data || { message: '', saved: true };
}

/**
 * Remove a post from user's saved collection
 * إزالة مقال من المحفوظات
 */
export async function unsavePost(slug: string): Promise<{ message: string; saved: boolean }> {
  const response = await apiClient.delete<{ message: string; saved: boolean }>(
    `${BLOG_ENDPOINT}/posts/${slug}/save`
  );
  return response.data || { message: '', saved: false };
}

/**
 * Toggle post save status
 * تبديل حالة حفظ المقال
 */
export async function togglePostSave(
  slug: string,
  currentSaved: boolean
): Promise<{ message: string; saved: boolean }> {
  if (currentSaved) {
    return unsavePost(slug);
  }
  return savePost(slug);
}

export const blogService = {
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedBlogPosts,
  getRelatedPosts,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogTags,
  // Comments
  getPostComments,
  createComment,
  createGuestComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  // Bookmarks
  getSavedPosts,
  isPostSaved,
  savePost,
  unsavePost,
  togglePostSave,
};

export default blogService;
