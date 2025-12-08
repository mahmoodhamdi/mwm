/**
 * Menus Service
 * خدمة القوائم
 */

import { apiClient } from '@/lib/api';

// Types
export interface BilingualText {
  ar: string;
  en: string;
}

export type MenuLocation = 'header' | 'footer' | 'sidebar' | 'mobile';
export type MenuItemType = 'internal' | 'external' | 'custom';
export type MenuItemTarget = '_self' | '_blank';

export interface MenuItem {
  _id?: string;
  label: BilingualText;
  url: string;
  type: MenuItemType;
  target: MenuItemTarget;
  icon?: string;
  order: number;
  isActive: boolean;
  children?: MenuItem[];
}

export interface Menu {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  location: MenuLocation;
  items: MenuItem[];
  isActive: boolean;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface MenuFilters {
  location?: MenuLocation;
  isActive?: boolean;
}

export interface CreateMenuData {
  name: string;
  nameAr: string;
  slug: string;
  location: MenuLocation;
  items?: MenuItem[];
  isActive?: boolean;
}

export interface UpdateMenuData {
  name?: string;
  nameAr?: string;
  location?: MenuLocation;
  items?: MenuItem[];
  isActive?: boolean;
}

export interface CreateMenuItemData {
  label: BilingualText;
  url: string;
  type: MenuItemType;
  target: MenuItemTarget;
  icon?: string;
  order?: number;
  isActive?: boolean;
  parentId?: string;
}

// API endpoints
const MENUS_ENDPOINT = '/menus';

/**
 * Get menu by location
 */
export async function getMenuByLocation(
  location: MenuLocation,
  locale?: 'ar' | 'en'
): Promise<Menu> {
  const params: Record<string, unknown> = {};
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ menu: Menu }>(
    `${MENUS_ENDPOINT}/location/${location}`,
    params
  );
  return response.data?.menu as Menu;
}

/**
 * Get menu by slug
 */
export async function getMenuBySlug(slug: string, locale?: 'ar' | 'en'): Promise<Menu> {
  const params: Record<string, unknown> = {};
  if (locale) params.locale = locale;

  const response = await apiClient.get<{ menu: Menu }>(`${MENUS_ENDPOINT}/slug/${slug}`, params);
  return response.data?.menu as Menu;
}

/**
 * Get all menus (Admin)
 */
export async function getAllMenus(filters: MenuFilters = {}): Promise<Menu[]> {
  const response = await apiClient.get<{ menus: Menu[] }>(
    MENUS_ENDPOINT,
    filters as Record<string, unknown>
  );
  return response.data?.menus || [];
}

/**
 * Get single menu by ID (Admin)
 */
export async function getMenu(id: string): Promise<Menu> {
  const response = await apiClient.get<{ menu: Menu }>(`${MENUS_ENDPOINT}/${id}`);
  return response.data?.menu as Menu;
}

/**
 * Create menu
 */
export async function createMenu(data: CreateMenuData): Promise<Menu> {
  const response = await apiClient.post<{ menu: Menu }>(MENUS_ENDPOINT, data);
  return response.data?.menu as Menu;
}

/**
 * Update menu
 */
export async function updateMenu(id: string, data: UpdateMenuData): Promise<Menu> {
  const response = await apiClient.put<{ menu: Menu }>(`${MENUS_ENDPOINT}/${id}`, data);
  return response.data?.menu as Menu;
}

/**
 * Delete menu
 */
export async function deleteMenu(id: string): Promise<void> {
  await apiClient.delete(`${MENUS_ENDPOINT}/${id}`);
}

/**
 * Add menu item
 */
export async function addMenuItem(menuId: string, item: CreateMenuItemData): Promise<Menu> {
  const response = await apiClient.post<{ menu: Menu }>(`${MENUS_ENDPOINT}/${menuId}/items`, item);
  return response.data?.menu as Menu;
}

/**
 * Update menu item
 */
export async function updateMenuItem(
  menuId: string,
  itemId: string,
  data: Partial<CreateMenuItemData>
): Promise<Menu> {
  const response = await apiClient.put<{ menu: Menu }>(
    `${MENUS_ENDPOINT}/${menuId}/items/${itemId}`,
    data
  );
  return response.data?.menu as Menu;
}

/**
 * Remove menu item
 */
export async function removeMenuItem(menuId: string, itemId: string): Promise<Menu> {
  const response = await apiClient.delete<{ menu: Menu }>(
    `${MENUS_ENDPOINT}/${menuId}/items/${itemId}`
  );
  return response.data?.menu as Menu;
}

/**
 * Reorder menu items
 */
export async function reorderMenuItems(menuId: string, itemIds: string[]): Promise<Menu> {
  const response = await apiClient.put<{ menu: Menu }>(`${MENUS_ENDPOINT}/${menuId}/reorder`, {
    itemIds,
  });
  return response.data?.menu as Menu;
}

export const menusService = {
  getMenuByLocation,
  getMenuBySlug,
  getAllMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
  reorderMenuItems,
};

export default menusService;
