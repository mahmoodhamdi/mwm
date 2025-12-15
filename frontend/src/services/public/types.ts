/**
 * Shared Types for Public Services
 * الأنواع المشتركة للخدمات العامة
 *
 * Re-exports common types from @mwm/shared package
 */

import { LocalizedString, PaginationMeta as SharedPaginationMeta } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

// Re-export from shared package
export type { LocalizedString, SharedPaginationMeta as PaginationMeta };
