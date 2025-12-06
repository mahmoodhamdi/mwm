/**
 * Helper Utilities Tests
 * اختبارات الأدوات المساعدة
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import {
  generateRandomString,
  generateRandomNumber,
  generateOTP,
  hashSHA256,
  maskEmail,
  maskPhone,
  formatBytes,
  parseBoolean,
  isValidObjectId,
  getFileExtension,
  normalizeSearchText,
  calculatePercentage,
  groupBy,
  unique,
  chunk,
} from '../../../src/utils/helpers';

describe('Helper Utilities', () => {
  describe('generateRandomString', () => {
    it('should generate a random string of default length', () => {
      const result = generateRandomString();
      expect(result).toHaveLength(32);
    });

    it('should generate a random string of specified length', () => {
      const result = generateRandomString(16);
      expect(result).toHaveLength(16);
    });

    it('should generate different strings each time', () => {
      const result1 = generateRandomString();
      const result2 = generateRandomString();
      expect(result1).not.toBe(result2);
    });
  });

  describe('generateRandomNumber', () => {
    it('should generate a number within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = generateRandomNumber(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('generateOTP', () => {
    it('should generate OTP of default length', () => {
      const result = generateOTP();
      expect(result).toHaveLength(6);
      expect(result).toMatch(/^\d+$/);
    });

    it('should generate OTP of specified length', () => {
      const result = generateOTP(4);
      expect(result).toHaveLength(4);
    });
  });

  describe('hashSHA256', () => {
    it('should hash a value', () => {
      const result = hashSHA256('test');
      expect(result).toHaveLength(64);
    });

    it('should produce same hash for same input', () => {
      const hash1 = hashSHA256('test');
      const hash2 = hashSHA256('test');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different input', () => {
      const hash1 = hashSHA256('test1');
      const hash2 = hashSHA256('test2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('maskEmail', () => {
    it('should mask email address', () => {
      expect(maskEmail('john@example.com')).toBe('j**n@example.com');
    });

    it('should handle short names', () => {
      expect(maskEmail('jo@example.com')).toBe('j*@example.com');
    });

    it('should handle single character names', () => {
      expect(maskEmail('j@example.com')).toBe('j@example.com');
    });
  });

  describe('maskPhone', () => {
    it('should mask phone number', () => {
      expect(maskPhone('+201234567890')).toBe('+20*******890');
    });

    it('should handle short numbers', () => {
      expect(maskPhone('123')).toBe('123');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('should respect decimal places', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });
  });

  describe('parseBoolean', () => {
    it('should parse boolean values', () => {
      expect(parseBoolean(true)).toBe(true);
      expect(parseBoolean(false)).toBe(false);
    });

    it('should parse string values', () => {
      expect(parseBoolean('true')).toBe(true);
      expect(parseBoolean('yes')).toBe(true);
      expect(parseBoolean('1')).toBe(true);
      expect(parseBoolean('on')).toBe(true);
      expect(parseBoolean('false')).toBe(false);
      expect(parseBoolean('no')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(parseBoolean('TRUE')).toBe(true);
      expect(parseBoolean('Yes')).toBe(true);
    });
  });

  describe('isValidObjectId', () => {
    it('should validate correct ObjectIds', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('5f50c31e1c4ae1b6f0111111')).toBe(true);
    });

    it('should reject invalid ObjectIds', () => {
      expect(isValidObjectId('invalid')).toBe(false);
      expect(isValidObjectId('123')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('image.png')).toBe('png');
      expect(getFileExtension('document.PDF')).toBe('pdf');
      expect(getFileExtension('file.tar.gz')).toBe('gz');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('noextension')).toBe('');
    });
  });

  describe('normalizeSearchText', () => {
    it('should normalize search text', () => {
      expect(normalizeSearchText('  Hello   World  ')).toBe('hello world');
    });

    it('should preserve Arabic characters', () => {
      expect(normalizeSearchText('مرحبا بالعالم')).toBe('مرحبا بالعالم');
    });

    it('should remove special characters', () => {
      expect(normalizeSearchText('hello@world!')).toBe('helloworld');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33.33);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });

    it('should respect decimal places', () => {
      expect(calculatePercentage(1, 3, 0)).toBe(33);
      expect(calculatePercentage(1, 3, 4)).toBe(33.3333);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const result = groupBy(items, 'type');
      expect(result['a']).toHaveLength(2);
      expect(result['b']).toHaveLength(1);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('chunk', () => {
    it('should chunk array correctly', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });
});
