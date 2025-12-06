/**
 * Shared Utils Unit Tests
 * اختبارات وحدة الدوال المشتركة
 */

import {
  getLocalizedValue,
  createLocalizedString,
  generateSlug,
  calculatePagination,
  calculateSkip,
  parseSortString,
  sanitizeObject,
  formatNumber,
  calculateReadingTime,
  truncateText,
  isEmpty,
  pick,
  omit,
} from '../src/utils';

describe('Shared Utils', () => {
  describe('getLocalizedValue', () => {
    it('should return Arabic value when locale is ar', () => {
      const obj = { ar: 'مرحبا', en: 'Hello' };
      expect(getLocalizedValue(obj, 'ar')).toBe('مرحبا');
    });

    it('should return English value when locale is en', () => {
      const obj = { ar: 'مرحبا', en: 'Hello' };
      expect(getLocalizedValue(obj, 'en')).toBe('Hello');
    });

    it('should return default locale (ar) when no locale specified', () => {
      const obj = { ar: 'مرحبا', en: 'Hello' };
      expect(getLocalizedValue(obj)).toBe('مرحبا');
    });

    it('should return empty string for null/undefined', () => {
      expect(getLocalizedValue(null, 'ar')).toBe('');
      expect(getLocalizedValue(undefined, 'en')).toBe('');
    });
  });

  describe('createLocalizedString', () => {
    it('should create a localized string object', () => {
      const result = createLocalizedString('مرحبا', 'Hello');
      expect(result).toEqual({ ar: 'مرحبا', en: 'Hello' });
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello   World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello! World?')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(generateSlug('hello_world')).toBe('hello-world');
    });

    it('should trim leading and trailing hyphens', () => {
      expect(generateSlug('--hello--')).toBe('hello');
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly', () => {
      const result = calculatePagination(100, 2, 10);
      expect(result).toEqual({
        page: 2,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it('should use default values when not provided', () => {
      const result = calculatePagination(50);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle first page correctly', () => {
      const result = calculatePagination(100, 1, 10);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
    });

    it('should handle last page correctly', () => {
      const result = calculatePagination(100, 10, 10);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
    });

    it('should enforce max limit', () => {
      const result = calculatePagination(100, 1, 200);
      expect(result.limit).toBe(100); // MAX_LIMIT
    });
  });

  describe('calculateSkip', () => {
    it('should calculate skip correctly', () => {
      expect(calculateSkip(1, 10)).toBe(0);
      expect(calculateSkip(2, 10)).toBe(10);
      expect(calculateSkip(3, 10)).toBe(20);
    });

    it('should use default values', () => {
      expect(calculateSkip()).toBe(0);
    });
  });

  describe('parseSortString', () => {
    it('should parse ascending sort', () => {
      expect(parseSortString('name:asc')).toEqual({ name: 1 });
    });

    it('should parse descending sort', () => {
      expect(parseSortString('createdAt:desc')).toEqual({ createdAt: -1 });
    });

    it('should default to descending when no order specified', () => {
      expect(parseSortString('name')).toEqual({ name: -1 });
    });

    it('should return default sort when undefined', () => {
      expect(parseSortString()).toEqual({ createdAt: -1 });
    });
  });

  describe('sanitizeObject', () => {
    it('should remove undefined values', () => {
      const obj = { a: 1, b: undefined, c: 'test' };
      expect(sanitizeObject(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should remove null values', () => {
      const obj = { a: 1, b: null, c: 'test' };
      expect(sanitizeObject(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should remove empty string values', () => {
      const obj = { a: 1, b: '', c: 'test' };
      expect(sanitizeObject(obj)).toEqual({ a: 1, c: 'test' });
    });
  });

  describe('formatNumber', () => {
    it('should format number in Arabic', () => {
      const result = formatNumber(1000, 'ar');
      // Arabic numerals use different characters (١٬٠٠٠)
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format number in English', () => {
      const result = formatNumber(1000, 'en');
      expect(result).toBe('1,000');
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const text = 'word '.repeat(200);
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('should round up reading time', () => {
      const text = 'word '.repeat(250);
      expect(calculateReadingTime(text)).toBe(2);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncateText(text, 20)).toBe('Short');
    });
  });

  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('  ')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });
  });
});
