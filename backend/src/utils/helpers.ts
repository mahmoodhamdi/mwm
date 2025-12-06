/**
 * Helper Utilities
 * أدوات مساعدة
 */

import crypto from 'crypto';

/**
 * Generate random string
 * توليد نص عشوائي
 */
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Generate random number
 * توليد رقم عشوائي
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate OTP code
 * توليد رمز التحقق
 */
export function generateOTP(length: number = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

/**
 * Hash a value using SHA256
 * تجزئة قيمة باستخدام SHA256
 */
export function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Mask email address
 * إخفاء عنوان البريد الإلكتروني
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;

  const maskedName =
    name.length <= 2
      ? name[0] + '*'.repeat(name.length - 1)
      : name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];

  return `${maskedName}@${domain}`;
}

/**
 * Mask phone number
 * إخفاء رقم الهاتف
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return phone.slice(0, 3) + '*'.repeat(phone.length - 6) + phone.slice(-3);
}

/**
 * Convert bytes to human readable format
 * تحويل البايت لصيغة قابلة للقراءة
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Sleep for specified milliseconds
 * انتظار لفترة محددة
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * إعادة محاولة دالة مع تأخير متزايد
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoffMultiplier = 2 } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Parse boolean from string
 * تحليل قيمة منطقية من نص
 */
export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return ['true', 'yes', '1', 'on'].includes(lower);
  }
  return Boolean(value);
}

/**
 * Check if value is valid ObjectId
 * التحقق من صحة معرف الكائن
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Extract file extension from filename
 * استخراج امتداد الملف من اسم الملف
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Normalize search text for MongoDB text search
 * تطبيع نص البحث لبحث MongoDB النصي
 */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\sء-ي]/gi, '') // Keep Arabic and alphanumeric
    .replace(/\s+/g, ' ');
}

/**
 * Calculate percentage
 * حساب النسبة المئوية
 */
export function calculatePercentage(value: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Group array by key
 * تجميع المصفوفة حسب المفتاح
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Remove duplicates from array
 * إزالة المكررات من المصفوفة
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Chunk array into smaller arrays
 * تقسيم المصفوفة إلى مصفوفات أصغر
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
