/**
 * Utility Functions
 * الدوال المساعدة
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 * دمج فئات Tailwind CSS مع clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date based on locale
 * تنسيق التاريخ حسب اللغة
 */
export function formatDate(date: Date | string, locale: string = 'ar'): string {
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
export function formatNumber(num: number, locale: string = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(num);
}

/**
 * Truncate text with ellipsis
 * اختصار النص مع علامة الحذف
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate random ID
 * توليد معرف عشوائي
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Debounce function
 * دالة التأخير
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Check if we're on the client side
 * التحقق إذا كنا في جانب العميل
 */
export const isClient = typeof window !== 'undefined';

/**
 * Get direction based on locale
 * الحصول على الاتجاه حسب اللغة
 */
export function getDirection(locale: string): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Allowed video embed origins for iframe src
 * المصادر المسموح بها لتضمين الفيديو
 */
const ALLOWED_VIDEO_ORIGINS = [
  'https://www.youtube.com',
  'https://youtube.com',
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
  'https://vimeo.com',
  'https://www.dailymotion.com',
  'https://www.loom.com',
  'https://player.twitch.tv',
  'https://www.facebook.com',
  'https://streamable.com',
];

/**
 * Validate video URL is from a trusted origin
 * التحقق من أن رابط الفيديو من مصدر موثوق
 */
export function isValidVideoUrl(url: string | undefined | null): boolean {
  if (!url) return false;

  try {
    // Validate URL format by attempting to parse it
    new URL(url);
    return ALLOWED_VIDEO_ORIGINS.some(origin => url.startsWith(origin));
  } catch {
    return false;
  }
}

/**
 * Get safe video URL or null if invalid
 * الحصول على رابط الفيديو الآمن أو null إذا كان غير صالح
 */
export function getSafeVideoUrl(url: string | undefined | null): string | null {
  if (!isValidVideoUrl(url)) return null;
  return url as string;
}
