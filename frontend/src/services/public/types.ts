/**
 * Shared Types for Public Services
 * الأنواع المشتركة للخدمات العامة
 */

export interface BilingualText {
  ar: string;
  en: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
