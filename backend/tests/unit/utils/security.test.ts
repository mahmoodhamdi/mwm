/**
 * Security Utilities Unit Tests
 * اختبارات وحدة أدوات الأمان
 */

import crypto from 'crypto';
import { Request } from 'express';
import {
  generateSecureToken,
  generateCsrfToken,
  hashSHA256,
  secureCompare,
  sanitizeString,
  isValidEmail,
  isValidUrl,
  isIpAllowed,
  getClientIp,
  validatePasswordStrength,
  detectXssPayload,
  detectSqlInjection,
  escapeRegex,
} from '../../../src/utils/security';

describe('Security Utilities', () => {
  describe('generateSecureToken', () => {
    it('should generate token of default length (32 bytes = 64 hex chars)', () => {
      const token = generateSecureToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/i.test(token)).toBe(true);
    });

    it('should generate token of custom length', () => {
      const token = generateSecureToken(16);

      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateCsrfToken', () => {
    it('should generate base64 CSRF token', () => {
      const token = generateCsrfToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      // Base64 encoded 24 bytes
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique CSRF tokens', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('hashSHA256', () => {
    it('should hash string using SHA256', () => {
      const hash = hashSHA256('test-string');

      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA256 produces 64 hex chars
      expect(/^[a-f0-9]+$/i.test(hash)).toBe(true);
    });

    it('should produce consistent hashes for same input', () => {
      const hash1 = hashSHA256('same-input');
      const hash2 = hashSHA256('same-input');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashSHA256('input1');
      const hash2 = hashSHA256('input2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('secureCompare', () => {
    it('should return true for identical strings', () => {
      const result = secureCompare('secret123', 'secret123');

      expect(result).toBe(true);
    });

    it('should return false for different strings', () => {
      const result = secureCompare('secret123', 'secret456');

      expect(result).toBe(false);
    });

    it('should return false for strings of different lengths', () => {
      const result = secureCompare('short', 'much-longer-string');

      expect(result).toBe(false);
    });

    it('should handle empty strings', () => {
      const result = secureCompare('', '');

      expect(result).toBe(true);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeString(input);

      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should escape ampersands', () => {
      const result = sanitizeString('Tom & Jerry');

      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      const result = sanitizeString(`He said "Hello" and 'Hi'`);

      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    it('should escape forward slashes', () => {
      const result = sanitizeString('path/to/file');

      expect(result).toBe('path&#x2F;to&#x2F;file');
    });

    it('should handle strings without special characters', () => {
      const result = sanitizeString('normal text 123');

      expect(result).toBe('normal text 123');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user domain@example.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('htp://invalid')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isIpAllowed', () => {
    it('should allow exact IP match', () => {
      const result = isIpAllowed('192.168.1.100', ['192.168.1.100', '10.0.0.1']);

      expect(result).toBe(true);
    });

    it('should reject non-matching IP', () => {
      const result = isIpAllowed('192.168.1.50', ['192.168.1.100', '10.0.0.1']);

      expect(result).toBe(false);
    });

    it('should handle CIDR notation', () => {
      const result1 = isIpAllowed('192.168.1.50', ['192.168.1.0/24']);
      const result2 = isIpAllowed('192.168.2.50', ['192.168.1.0/24']);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    it('should handle mixed exact IPs and CIDR', () => {
      const allowedIps = ['10.0.0.1', '192.168.1.0/24'];

      expect(isIpAllowed('10.0.0.1', allowedIps)).toBe(true);
      expect(isIpAllowed('192.168.1.100', allowedIps)).toBe(true);
      expect(isIpAllowed('172.16.0.1', allowedIps)).toBe(false);
    });
  });

  describe('getClientIp', () => {
    it('should extract IP from req.ip (set by Express trust proxy)', () => {
      const req = {
        ip: '192.168.1.100',
        headers: {},
        socket: {
          remoteAddress: '127.0.0.1',
        },
      } as unknown as Request;

      const ip = getClientIp(req);

      expect(ip).toBe('192.168.1.100');
    });

    it('should fall back to socket remoteAddress', () => {
      const req = {
        headers: {},
        socket: {
          remoteAddress: '192.168.1.50',
        },
      } as unknown as Request;

      const ip = getClientIp(req);

      expect(ip).toBe('192.168.1.50');
    });

    it('should return "unknown" when no IP is available', () => {
      const req = {
        headers: {},
        socket: {},
      } as unknown as Request;

      const ip = getClientIp(req);

      expect(ip).toBe('unknown');
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = validatePasswordStrength('Strong@Pass123');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePasswordStrength('Sh0rt!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePasswordStrength('lowercase123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePasswordStrength('UPPERCASE123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('NoNumbers!@#');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePasswordStrength('NoSpecial123');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return all errors for very weak password', () => {
      const result = validatePasswordStrength('weak');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3);
    });
  });

  describe('detectXssPayload', () => {
    it('should detect script tags', () => {
      const payload1 = '<script>alert("xss")</script>';
      const payload2 = '<SCRIPT>alert("xss")</SCRIPT>';

      expect(detectXssPayload(payload1)).toBe(true);
      expect(detectXssPayload(payload2)).toBe(true);
    });

    it('should detect javascript: protocol', () => {
      const payload = 'javascript:alert("xss")';

      expect(detectXssPayload(payload)).toBe(true);
    });

    it('should detect event handlers', () => {
      const payload1 = '<img onerror="alert(1)">';
      const payload2 = '<div onclick="malicious()">';

      expect(detectXssPayload(payload1)).toBe(true);
      expect(detectXssPayload(payload2)).toBe(true);
    });

    it('should detect iframe tags', () => {
      const payload = '<iframe src="evil.com"></iframe>';

      expect(detectXssPayload(payload)).toBe(true);
    });

    it('should detect object and embed tags', () => {
      expect(detectXssPayload('<object data="evil"></object>')).toBe(true);
      expect(detectXssPayload('<embed src="evil">')).toBe(true);
    });

    it('should detect data: protocol', () => {
      const payload = 'data:text/html,<script>alert(1)</script>';

      expect(detectXssPayload(payload)).toBe(true);
    });

    it('should return false for safe content', () => {
      expect(detectXssPayload('Normal text content')).toBe(false);
      expect(detectXssPayload('<p>Safe HTML</p>')).toBe(false);
    });
  });

  describe('detectSqlInjection', () => {
    it('should detect SQL keywords', () => {
      expect(detectSqlInjection("SELECT * FROM users")).toBe(true);
      expect(detectSqlInjection("DROP TABLE users")).toBe(true);
      expect(detectSqlInjection("INSERT INTO users")).toBe(true);
      expect(detectSqlInjection("UPDATE users SET")).toBe(true);
      expect(detectSqlInjection("DELETE FROM users")).toBe(true);
    });

    it('should detect OR/AND injection patterns', () => {
      expect(detectSqlInjection("' OR '1'='1")).toBe(true);
      expect(detectSqlInjection('" AND "a"="a')).toBe(true);
      expect(detectSqlInjection("' or 1=1--")).toBe(true);
    });

    it('should detect SQL comments', () => {
      expect(detectSqlInjection("admin'--")).toBe(true);
      expect(detectSqlInjection("'; DROP TABLE users; --")).toBe(true);
    });

    it('should detect semicolons (statement separators)', () => {
      expect(detectSqlInjection("test; DROP TABLE")).toBe(true);
    });

    it('should detect multi-line comments', () => {
      expect(detectSqlInjection("admin'/**/OR/**/1=1")).toBe(true);
    });

    it('should return false for safe input', () => {
      expect(detectSqlInjection("normal user input")).toBe(false);
      expect(detectSqlInjection("test@example.com")).toBe(false);
    });
  });

  describe('escapeRegex', () => {
    it('should escape regex special characters', () => {
      const input = '.*+?^${}()|[]\\';
      const result = escapeRegex(input);

      expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should make regex special chars literal', () => {
      const input = 'price: $100';
      const escaped = escapeRegex(input);
      const regex = new RegExp(escaped);

      expect(regex.test('price: $100')).toBe(true);
      expect(regex.test('price: 100')).toBe(false);
    });

    it('should handle strings without special characters', () => {
      const result = escapeRegex('normal text');

      expect(result).toBe('normal text');
    });

    it('should prevent ReDoS attacks', () => {
      const maliciousPattern = '(a+)+$';
      const escaped = escapeRegex(maliciousPattern);

      // Escaped pattern should not cause ReDoS
      expect(escaped).toBe('\\(a\\+\\)\\+\\$');
    });
  });
});
