/**
 * Pagination Utility Unit Tests
 * اختبارات وحدة أداة الترقيم
 */

import {
  parsePagination,
  createPaginationMeta,
  parseSort,
  getPaginationData,
} from '../../../src/utils/pagination';

describe('Pagination Utilities', () => {
  describe('parsePagination', () => {
    it('should parse valid page and limit', () => {
      const result = parsePagination({ page: '2', limit: '20' });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(20); // (2-1) * 20
    });

    it('should default to page 1 when page is not provided', () => {
      const result = parsePagination({ limit: '10' });

      expect(result.page).toBe(1);
      expect(result.skip).toBe(0);
    });

    it('should default to limit 10 when limit is not provided', () => {
      const result = parsePagination({ page: '1' });

      expect(result.limit).toBe(10);
    });

    it('should use custom default limit', () => {
      const result = parsePagination({ page: '1', defaultLimit: 25 });

      expect(result.limit).toBe(25);
    });

    it('should enforce minimum page of 1', () => {
      const result1 = parsePagination({ page: '0' });
      const result2 = parsePagination({ page: '-5' });

      expect(result1.page).toBe(1);
      expect(result2.page).toBe(1);
    });

    it('should enforce minimum limit of 1', () => {
      const result1 = parsePagination({ limit: '0' });
      const result2 = parsePagination({ limit: '-10' });

      // Both get clamped by Math.max(1, limitNum)
      expect(result1.limit).toBe(1);
      expect(result2.limit).toBe(1);
    });

    it('should enforce maximum limit (default 100)', () => {
      const result = parsePagination({ limit: '200' });

      expect(result.limit).toBe(100);
    });

    it('should enforce custom max limit', () => {
      const result = parsePagination({ limit: '100', maxLimit: 50 });

      expect(result.limit).toBe(50);
    });

    it('should handle invalid page values', () => {
      const result1 = parsePagination({ page: 'invalid' });
      const result2 = parsePagination({ page: 'abc' });
      const result3 = parsePagination({ page: null });

      expect(result1.page).toBe(1);
      expect(result2.page).toBe(1);
      expect(result3.page).toBe(1);
    });

    it('should handle invalid limit values', () => {
      const result1 = parsePagination({ limit: 'invalid' });
      const result2 = parsePagination({ limit: null });

      expect(result1.limit).toBe(10); // default
      expect(result2.limit).toBe(10);
    });

    it('should calculate skip correctly for various pages', () => {
      const result1 = parsePagination({ page: '1', limit: '10' });
      const result2 = parsePagination({ page: '3', limit: '25' });
      const result3 = parsePagination({ page: '10', limit: '5' });

      expect(result1.skip).toBe(0);
      expect(result2.skip).toBe(50); // (3-1) * 25
      expect(result3.skip).toBe(45); // (10-1) * 5
    });

    it('should handle numeric page and limit values', () => {
      const result = parsePagination({ page: 5, limit: 15 });

      expect(result.page).toBe(5);
      expect(result.limit).toBe(15);
      expect(result.skip).toBe(60);
    });

    it('should handle empty options object', () => {
      const result = parsePagination({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });
  });

  describe('createPaginationMeta', () => {
    it('should create correct metadata for first page', () => {
      const meta = createPaginationMeta(100, 1, 10);

      expect(meta.page).toBe(1);
      expect(meta.limit).toBe(10);
      expect(meta.total).toBe(100);
      expect(meta.pages).toBe(10);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(false);
    });

    it('should create correct metadata for middle page', () => {
      const meta = createPaginationMeta(100, 5, 10);

      expect(meta.page).toBe(5);
      expect(meta.pages).toBe(10);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(true);
    });

    it('should create correct metadata for last page', () => {
      const meta = createPaginationMeta(100, 10, 10);

      expect(meta.page).toBe(10);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(true);
    });

    it('should handle single page results', () => {
      const meta = createPaginationMeta(5, 1, 10);

      expect(meta.pages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(false);
    });

    it('should handle empty results', () => {
      const meta = createPaginationMeta(0, 1, 10);

      expect(meta.total).toBe(0);
      expect(meta.pages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(false);
    });

    it('should calculate pages correctly for non-divisible totals', () => {
      const meta1 = createPaginationMeta(23, 1, 10);
      const meta2 = createPaginationMeta(99, 1, 25);

      expect(meta1.pages).toBe(3); // Math.ceil(23/10)
      expect(meta2.pages).toBe(4); // Math.ceil(99/25)
    });

    it('should handle large datasets', () => {
      const meta = createPaginationMeta(10000, 50, 100);

      expect(meta.pages).toBe(100);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(true);
    });
  });

  describe('parseSort', () => {
    it('should parse ascending sort', () => {
      const result = parseSort('name', ['name', 'createdAt']);

      expect(result).toEqual({ name: 1 });
    });

    it('should parse descending sort with minus prefix', () => {
      const result = parseSort('-createdAt', ['createdAt', 'name']);

      expect(result).toEqual({ createdAt: -1 });
    });

    it('should parse multiple sort fields', () => {
      const result = parseSort('name,-createdAt,updatedAt', ['name', 'createdAt', 'updatedAt']);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
        updatedAt: 1,
      });
    });

    it('should filter out non-allowed fields', () => {
      const result = parseSort('name,invalidField,-createdAt', ['name', 'createdAt']);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
      });
      expect(result.invalidField).toBeUndefined();
    });

    it('should return default sort when no valid fields', () => {
      const defaultSort = { createdAt: -1 };
      const result = parseSort('invalidField', ['name'], defaultSort);

      expect(result).toEqual(defaultSort);
    });

    it('should return default sort when sort is undefined', () => {
      const defaultSort = { createdAt: -1 };
      const result = parseSort(undefined, ['name'], defaultSort);

      expect(result).toEqual(defaultSort);
    });

    it('should allow all fields when allowedFields is empty', () => {
      const result = parseSort('anyField,-anotherField', []);

      expect(result).toEqual({
        anyField: 1,
        anotherField: -1,
      });
    });

    it('should handle fields with whitespace', () => {
      const result = parseSort(' name , -createdAt , updatedAt ', ['name', 'createdAt', 'updatedAt']);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
        updatedAt: 1,
      });
    });

    it('should use default sort when no sort parameter provided', () => {
      const result = parseSort();

      expect(result).toEqual({ createdAt: -1 });
    });

    it('should handle empty sort string', () => {
      const defaultSort = { createdAt: -1 };
      const result = parseSort('', ['name'], defaultSort);

      expect(result).toEqual(defaultSort);
    });

    it('should handle custom default sort', () => {
      const customDefault = { name: 1, priority: -1 };
      const result = parseSort(undefined, [], customDefault);

      expect(result).toEqual(customDefault);
    });
  });

  describe('getPaginationData', () => {
    it('should combine pagination and sort parsing', () => {
      const query = {
        page: '2',
        limit: '20',
        sort: '-createdAt,name',
      };

      const result = getPaginationData(query, {
        allowedSortFields: ['createdAt', 'name'],
      });

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.skip).toBe(20);
      expect(result.sort).toEqual({
        createdAt: -1,
        name: 1,
      });
    });

    it('should use default values when query is empty', () => {
      const result = getPaginationData({});

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.skip).toBe(0);
      expect(result.sort).toEqual({ createdAt: -1 });
    });

    it('should respect custom max and default limits', () => {
      const query = { limit: '200' };
      const result = getPaginationData(query, {
        maxLimit: 50,
        defaultLimit: 25,
      });

      expect(result.pagination.limit).toBe(50);
    });

    it('should use custom default sort', () => {
      const query = {};
      const result = getPaginationData(query, {
        defaultSort: { priority: -1, name: 1 },
      });

      expect(result.sort).toEqual({ priority: -1, name: 1 });
    });

    it('should filter sort fields based on allowedSortFields', () => {
      const query = { sort: 'name,-createdAt,invalidField' };
      const result = getPaginationData(query, {
        allowedSortFields: ['name', 'createdAt'],
      });

      expect(result.sort).toEqual({
        name: 1,
        createdAt: -1,
      });
    });

    it('should handle all options together', () => {
      const query = {
        page: '3',
        limit: '15',
        sort: '-priority,name',
      };

      const result = getPaginationData(query, {
        maxLimit: 20,
        defaultLimit: 10,
        allowedSortFields: ['priority', 'name', 'createdAt'],
        defaultSort: { createdAt: -1 },
      });

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.limit).toBe(15);
      expect(result.pagination.skip).toBe(30);
      expect(result.sort).toEqual({
        priority: -1,
        name: 1,
      });
    });
  });
});
