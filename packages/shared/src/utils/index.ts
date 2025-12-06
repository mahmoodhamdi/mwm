/**
 * Shared utility functions
 * الدوال المساعدة المشتركة
 */

import type { Locale, LocalizedString, PaginationMeta } from '../types';
import { DEFAULT_LOCALE, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../constants';

/**
 * Get localized value from LocalizedString
 * الحصول على القيمة المترجمة
 */
export function getLocalizedValue<T extends LocalizedString | { ar: unknown; en: unknown }>(
  obj: T | undefined | null,
  locale: Locale = DEFAULT_LOCALE
): T extends LocalizedString ? string : unknown {
  if (!obj) return '' as T extends LocalizedString ? string : unknown;
  return (obj[locale] ?? obj[DEFAULT_LOCALE]) as T extends LocalizedString ? string : unknown;
}

/**
 * Create a localized string object
 * إنشاء كائن نص مترجم
 */
export function createLocalizedString(ar: string, en: string): LocalizedString {
  return { ar, en };
}

/**
 * Generate slug from text
 * إنشاء slug من النص
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word chars except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

/**
 * Calculate pagination meta
 * حساب بيانات التصفح
 */
export function calculatePagination(
  total: number,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): PaginationMeta {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const totalPages = Math.ceil(total / safeLimit);

  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
}

/**
 * Calculate skip for pagination
 * حساب التخطي للتصفح
 */
export function calculateSkip(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT): number {
  return (Math.max(1, page) - 1) * Math.min(Math.max(1, limit), MAX_LIMIT);
}

/**
 * Parse sort string to object
 * تحويل نص الترتيب لكائن
 * @example parseSortString('createdAt:desc') => { createdAt: -1 }
 */
export function parseSortString(sortString?: string): Record<string, 1 | -1> {
  if (!sortString) return { createdAt: -1 };

  const [field, order] = sortString.split(':');
  if (!field) return { createdAt: -1 };

  return { [field]: order === 'asc' ? 1 : -1 };
}

/**
 * Sanitize object - remove undefined/null values
 * تنظيف الكائن من القيم الفارغة
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ) as Partial<T>;
}

/**
 * Delay execution (for testing/debugging)
 * تأخير التنفيذ
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date based on locale
 * تنسيق التاريخ حسب اللغة
 */
export function formatDate(date: Date | string, locale: Locale = DEFAULT_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format number based on locale
 * تنسيق الرقم حسب اللغة
 */
export function formatNumber(num: number, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(num);
}

/**
 * Format currency based on locale
 * تنسيق العملة حسب اللغة
 */
export function formatCurrency(
  amount: number,
  locale: Locale = DEFAULT_LOCALE,
  currency?: string
): string {
  const cur = currency ?? (locale === 'ar' ? 'EGP' : 'USD');
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: cur,
  }).format(amount);
}

/**
 * Calculate reading time for text
 * حساب وقت القراءة للنص
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Truncate text with ellipsis
 * اختصار النص مع علامة الحذف
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * التحقق من أن القيمة فارغة
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone object
 * نسخ عميق للكائن
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Pick specific keys from object
 * اختيار مفاتيح محددة من الكائن
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Pick<T, K>
  );
}

/**
 * Omit specific keys from object
 * حذف مفاتيح محددة من الكائن
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}
