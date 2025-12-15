/**
 * Shared TypeScript types and interfaces
 * الأنواع والواجهات المشتركة
 */

// Locale types | أنواع اللغة
export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface LocalizedArray {
  ar: string[];
  en: string[];
}

// API Response types | أنواع استجابة الـ API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Query params | معاملات الاستعلام
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sort?: string; // field:asc or field:desc
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  [key: string]: string | undefined;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;

// User types | أنواع المستخدم
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// SEO types | أنواع السيو
export interface SeoMeta {
  title: LocalizedString;
  description: LocalizedString;
  keywords: LocalizedArray;
  ogImage?: string;
}

// Status types | أنواع الحالة
export type PublishStatus = 'draft' | 'published' | 'scheduled';
export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';
export type ContactPriority = 'low' | 'normal' | 'high' | 'urgent';

// Common entity interface | واجهة الكيان المشترك
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishableEntity extends BaseEntity {
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
}
