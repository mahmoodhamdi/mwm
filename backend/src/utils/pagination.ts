/**
 * Pagination Utility
 * أداة الترقيم
 *
 * Provides standardized pagination parsing and metadata generation
 * to reduce code duplication across controllers
 */

/**
 * Pagination parameters interface
 * واجهة معلمات الترقيم
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Pagination metadata interface
 * واجهة بيانات الترقيم الوصفية
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Pagination query options interface
 * واجهة خيارات استعلام الترقيم
 */
export interface PaginationQueryOptions {
  page?: string | number | unknown;
  limit?: string | number | unknown;
  maxLimit?: number;
  defaultLimit?: number;
}

/**
 * Parse pagination parameters from query string
 * تحليل معلمات الترقيم من سلسلة الاستعلام
 *
 * @param options - Pagination query options
 * @returns Parsed pagination parameters
 *
 * @example
 * const { page, limit, skip } = parsePagination({ page: '1', limit: '10' });
 * // { page: 1, limit: 10, skip: 0 }
 */
export function parsePagination(options: PaginationQueryOptions = {}): PaginationParams {
  const { page, limit, maxLimit = 100, defaultLimit = 10 } = options;

  // Parse page number (minimum 1)
  const pageNum = Math.max(1, parseInt(String(page || 1), 10) || 1);

  // Parse limit (between 1 and maxLimit)
  let limitNum = parseInt(String(limit || defaultLimit), 10) || defaultLimit;
  limitNum = Math.min(Math.max(1, limitNum), maxLimit);

  // Calculate skip
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
}

/**
 * Generate pagination metadata from results
 * إنشاء بيانات الترقيم الوصفية من النتائج
 *
 * @param total - Total number of documents
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata
 *
 * @example
 * const meta = createPaginationMeta(100, 1, 10);
 * // { page: 1, limit: 10, total: 100, pages: 10, hasNextPage: true, hasPrevPage: false }
 */
export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const pages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  };
}

/**
 * Parse sort parameter into MongoDB sort object
 * تحليل معلم الترتيب إلى كائن ترتيب MongoDB
 *
 * @param sort - Sort string (e.g., '-createdAt' or 'name,-date')
 * @param allowedFields - List of allowed sort fields
 * @param defaultSort - Default sort if none provided
 * @returns MongoDB sort object
 *
 * @example
 * const sortObj = parseSort('-createdAt', ['createdAt', 'name']);
 * // { createdAt: -1 }
 */
export function parseSort(
  sort?: string,
  allowedFields: string[] = [],
  defaultSort: Record<string, 1 | -1> = { createdAt: -1 }
): Record<string, 1 | -1> {
  if (!sort) {
    return defaultSort;
  }

  const sortObj: Record<string, 1 | -1> = {};
  const fields = sort.split(',');

  for (const field of fields) {
    const trimmed = field.trim();
    const isDescending = trimmed.startsWith('-');
    const fieldName = isDescending ? trimmed.slice(1) : trimmed;

    // Skip if field is not in allowed list (when list is provided)
    if (allowedFields.length > 0 && !allowedFields.includes(fieldName)) {
      continue;
    }

    sortObj[fieldName] = isDescending ? -1 : 1;
  }

  // Return default if no valid fields
  return Object.keys(sortObj).length > 0 ? sortObj : defaultSort;
}

/**
 * Combined pagination helper for common use case
 * مساعد ترقيم مشترك للحالة الشائعة
 *
 * @param query - Request query object
 * @param options - Additional options
 * @returns Combined pagination data
 */
export function getPaginationData(
  query: {
    page?: string | number | unknown;
    limit?: string | number | unknown;
    sort?: string;
  },
  options: {
    maxLimit?: number;
    defaultLimit?: number;
    allowedSortFields?: string[];
    defaultSort?: Record<string, 1 | -1>;
  } = {}
): {
  pagination: PaginationParams;
  sort: Record<string, 1 | -1>;
} {
  const pagination = parsePagination({
    page: query.page,
    limit: query.limit,
    maxLimit: options.maxLimit,
    defaultLimit: options.defaultLimit,
  });

  const sort = parseSort(
    query.sort as string | undefined,
    options.allowedSortFields,
    options.defaultSort
  );

  return { pagination, sort };
}

export default {
  parsePagination,
  createPaginationMeta,
  parseSort,
  getPaginationData,
};
