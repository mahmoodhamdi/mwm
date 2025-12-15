/**
 * Security Utilities
 * أدوات الأمان
 */

import crypto from 'crypto';
import { Request } from 'express';

/**
 * Generate a secure random token
 * إنشاء رمز عشوائي آمن
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a CSRF token
 * إنشاء رمز CSRF
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(24).toString('base64');
}

/**
 * Hash a string using SHA256
 * تشفير نص باستخدام SHA256
 */
export function hashSHA256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Compare two strings in constant time to prevent timing attacks
 * مقارنة نصين في وقت ثابت لمنع هجمات التوقيت
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Sanitize a string for safe output
 * تنظيف نص للإخراج الآمن
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 * التحقق من تنسيق البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 * التحقق من تنسيق URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if IP is in allowed list (CIDR support)
 * التحقق من أن IP في قائمة المسموح بها
 */
export function isIpAllowed(ip: string, allowedIps: string[]): boolean {
  return allowedIps.some(allowed => {
    if (allowed.includes('/')) {
      // CIDR notation
      return isIpInCidr(ip, allowed);
    }
    return ip === allowed;
  });
}

/**
 * Check if IP is in CIDR range
 * التحقق من أن IP في نطاق CIDR
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);

  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);

  return (ipInt & mask) === (rangeInt & mask);
}

/**
 * Convert IP to integer
 * تحويل IP إلى رقم صحيح
 */
function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

/**
 * Get client IP from request
 * الحصول على IP العميل من الطلب
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Rate limit key generator
 * مولد مفتاح تحديد المعدل
 */
export function getRateLimitKey(req: Request): string {
  const ip = getClientIp(req);
  const userId = (req as unknown as { user?: { id: string } }).user?.id;
  return userId ? `user:${userId}` : `ip:${ip}`;
}

/**
 * Validate password strength
 * التحقق من قوة كلمة المرور
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate secure session ID
 * إنشاء معرف جلسة آمن
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Check for common security headers
 * التحقق من رؤوس الأمان الشائعة
 */
export function checkSecurityHeaders(headers: Record<string, string | undefined>): {
  missing: string[];
  present: string[];
} {
  const requiredHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'strict-transport-security',
    'content-security-policy',
    'referrer-policy',
    'permissions-policy',
  ];

  const missing: string[] = [];
  const present: string[] = [];

  requiredHeaders.forEach(header => {
    if (headers[header]) {
      present.push(header);
    } else {
      missing.push(header);
    }
  });

  return { missing, present };
}

/**
 * Detect potential XSS payloads
 * كشف حمولات XSS المحتملة
 */
export function detectXssPayload(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /data:/gi,
    /vbscript:/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Detect potential SQL injection payloads
 * كشف حمولات حقن SQL المحتملة
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|alter|create|truncate)\b)/gi,
    /('|")\s*(or|and)\s*('|"|\d)/gi,
    /--/g,
    /;/g,
    /\/\*/g,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Escape special regex characters in a string
 * تهريب الأحرف الخاصة بالتعبيرات المنتظمة في نص
 *
 * Prevents NoSQL injection via regex patterns (ReDoS attacks)
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  generateSecureToken,
  generateCsrfToken,
  hashSHA256,
  secureCompare,
  sanitizeString,
  isValidEmail,
  isValidUrl,
  isIpAllowed,
  getClientIp,
  getRateLimitKey,
  validatePasswordStrength,
  generateSessionId,
  checkSecurityHeaders,
  detectXssPayload,
  detectSqlInjection,
  escapeRegex,
};
