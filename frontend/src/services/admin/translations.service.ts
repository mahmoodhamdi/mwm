/**
 * Translations Service
 * خدمة الترجمات
 */

import { apiClient, ApiResponse } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export interface TranslationItem {
  _id: string;
  key: string;
  namespace: string;
  translations: BilingualText;
  description?: string;
  isSystem: boolean;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface TranslationFilters {
  page?: number;
  limit?: number;
  namespace?: string;
  search?: string;
}

export interface CreateTranslationData {
  key: string;
  namespace: string;
  translations: BilingualText;
  description?: string;
  isSystem?: boolean;
}

export interface UpdateTranslationData {
  translations?: BilingualText;
  description?: string;
}

// API endpoints
const TRANSLATIONS_ENDPOINT = '/translations';

/**
 * Get translations by namespace and locale
 */
export async function getByNamespace(
  namespace: string,
  locale: 'ar' | 'en' = 'ar'
): Promise<Record<string, string>> {
  const response = await apiClient.get<{ translations: Record<string, string> }>(
    `${TRANSLATIONS_ENDPOINT}/namespace/${namespace}`,
    { locale }
  );
  return response.data?.translations || {};
}

/**
 * Get all translations for a locale
 */
export async function getAllByLocale(locale: 'ar' | 'en' = 'ar'): Promise<Record<string, string>> {
  const response = await apiClient.get<{ translations: Record<string, string> }>(
    `${TRANSLATIONS_ENDPOINT}/locale`,
    { locale }
  );
  return response.data?.translations || {};
}

/**
 * Get all translations (Admin) with pagination
 */
export async function getAllTranslations(
  filters: TranslationFilters = {}
): Promise<ApiResponse<TranslationItem[]>> {
  const response = await apiClient.get<TranslationItem[]>(
    TRANSLATIONS_ENDPOINT,
    filters as Record<string, unknown>
  );
  return response;
}

/**
 * Get single translation by ID
 */
export async function getTranslation(id: string): Promise<TranslationItem> {
  const response = await apiClient.get<{ translation: TranslationItem }>(
    `${TRANSLATIONS_ENDPOINT}/${id}`
  );
  return response.data?.translation as TranslationItem;
}

/**
 * Get namespaces list
 */
export async function getNamespaces(): Promise<string[]> {
  const response = await apiClient.get<{ namespaces: string[] }>(
    `${TRANSLATIONS_ENDPOINT}/namespaces`
  );
  return response.data?.namespaces || [];
}

/**
 * Search translations
 */
export async function searchTranslations(
  query: string,
  options: { namespace?: string; locale?: 'ar' | 'en'; limit?: number } = {}
): Promise<TranslationItem[]> {
  const response = await apiClient.get<{ translations: TranslationItem[] }>(
    `${TRANSLATIONS_ENDPOINT}/search`,
    { query, ...options } as Record<string, unknown>
  );
  return response.data?.translations || [];
}

/**
 * Create translation
 */
export async function createTranslation(data: CreateTranslationData): Promise<TranslationItem> {
  const response = await apiClient.post<{ translation: TranslationItem }>(
    TRANSLATIONS_ENDPOINT,
    data
  );
  return response.data?.translation as TranslationItem;
}

/**
 * Update translation by ID
 */
export async function updateTranslation(
  id: string,
  data: UpdateTranslationData
): Promise<TranslationItem> {
  const response = await apiClient.put<{ translation: TranslationItem }>(
    `${TRANSLATIONS_ENDPOINT}/${id}`,
    data
  );
  return response.data?.translation as TranslationItem;
}

/**
 * Upsert translation (create or update)
 */
export async function upsertTranslation(data: CreateTranslationData): Promise<TranslationItem> {
  const response = await apiClient.post<{ translation: TranslationItem }>(
    `${TRANSLATIONS_ENDPOINT}/upsert`,
    data
  );
  return response.data?.translation as TranslationItem;
}

/**
 * Bulk upsert translations
 */
export async function bulkUpsertTranslations(
  translations: CreateTranslationData[]
): Promise<TranslationItem[]> {
  const response = await apiClient.post<{ translations: TranslationItem[] }>(
    `${TRANSLATIONS_ENDPOINT}/bulk`,
    { translations }
  );
  return response.data?.translations || [];
}

/**
 * Delete translation by ID
 */
export async function deleteTranslation(id: string): Promise<void> {
  await apiClient.delete(`${TRANSLATIONS_ENDPOINT}/${id}`);
}

export const translationsService = {
  getByNamespace,
  getAllByLocale,
  getAllTranslations,
  getTranslation,
  getNamespaces,
  searchTranslations,
  createTranslation,
  updateTranslation,
  upsertTranslation,
  bulkUpsertTranslations,
  deleteTranslation,
};

export default translationsService;
