/**
 * Menu Controller
 * متحكم القوائم
 */

import { Request, Response } from 'express';
import { Menu, MenuLocation, IMenuItem } from '../models';
import { menuValidation } from '../validations';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Errors } from '../utils/ApiError';
import { successResponse } from '../utils/response';
import { redis } from '../config';
import mongoose from 'mongoose';

const MENU_CACHE_PREFIX = 'menu';
const MENU_CACHE_TTL = 3600; // 1 hour

/**
 * Get menu by location
 * جلب القائمة حسب الموقع
 */
export const getMenuByLocation = asyncHandler(async (req: Request, res: Response) => {
  const { location } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${MENU_CACHE_PREFIX}:location:${location}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      menu: JSON.parse(cached),
    });
  }

  const menu = await Menu.getByLocation(location as MenuLocation, locale);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Cache the menu
  await redis.setex(cacheKey, MENU_CACHE_TTL, JSON.stringify(menu));

  return successResponse(res, { menu });
});

/**
 * Get menu by slug
 * جلب القائمة حسب المعرف
 */
export const getMenuBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const locale = (req.query.locale as 'ar' | 'en') || undefined;

  const cacheKey = `${MENU_CACHE_PREFIX}:slug:${slug}:${locale || 'all'}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return successResponse(res, {
      menu: JSON.parse(cached),
    });
  }

  const menu = await Menu.getBySlug(slug, locale);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Cache the menu
  await redis.setex(cacheKey, MENU_CACHE_TTL, JSON.stringify(menu));

  return successResponse(res, { menu });
});

/**
 * Get all menus (Admin)
 * جلب كل القوائم (للمسؤول)
 */
export const getAllMenus = asyncHandler(async (req: Request, res: Response) => {
  const { location, isActive } = req.query;

  const filter: Record<string, unknown> = {};

  if (location) {
    filter.location = location;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const menus = await Menu.find(filter)
    .sort({ location: 1, name: 1 })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return successResponse(res, { menus });
});

/**
 * Get single menu (Admin)
 * جلب قائمة واحدة (للمسؤول)
 */
export const getMenu = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const menu = await Menu.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  return successResponse(res, { menu });
});

/**
 * Create menu
 * إنشاء قائمة
 */
export const createMenu = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = menuValidation.create.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  // Check if slug already exists
  const existing = await Menu.findOne({ slug: value.slug });
  if (existing) {
    throw Errors.VALIDATION_ERROR([
      {
        field: 'slug',
        message: 'Menu slug already exists | معرف القائمة موجود مسبقاً',
      },
    ]);
  }

  const menu = await Menu.create({
    ...value,
    createdBy: req.user?._id,
  });

  // Invalidate cache
  await invalidateMenuCache(value.slug, value.location);

  return successResponse(
    res,
    {
      message: 'Menu created successfully | تم إنشاء القائمة بنجاح',
      menu,
    },
    201
  );
});

/**
 * Update menu
 * تحديث القائمة
 */
export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = menuValidation.update.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const menu = await Menu.findByIdAndUpdate(
    id,
    {
      ...value,
      updatedBy: req.user?._id,
    },
    { new: true, runValidators: true }
  );

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu updated successfully | تم تحديث القائمة بنجاح',
    menu,
  });
});

/**
 * Delete menu
 * حذف القائمة
 */
export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const menu = await Menu.findById(id);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  await Menu.deleteOne({ _id: id });

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu deleted successfully | تم حذف القائمة بنجاح',
  });
});

/**
 * Add menu item
 * إضافة عنصر للقائمة
 */
export const addMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = menuValidation.addItem.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const menu = await Menu.addItem(new mongoose.Types.ObjectId(id), value as IMenuItem);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu item added successfully | تم إضافة عنصر القائمة بنجاح',
    menu,
  });
});

/**
 * Update menu item
 * تحديث عنصر في القائمة
 */
export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { id, itemId } = req.params;

  const { error, value } = menuValidation.updateItem.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const menu = await Menu.updateItem(
    new mongoose.Types.ObjectId(id),
    itemId,
    value as Partial<IMenuItem>
  );

  if (!menu) {
    throw Errors.NOT_FOUND('Menu or item | القائمة أو العنصر');
  }

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu item updated successfully | تم تحديث عنصر القائمة بنجاح',
    menu,
  });
});

/**
 * Remove menu item
 * حذف عنصر من القائمة
 */
export const removeMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { id, itemId } = req.params;

  const menu = await Menu.removeItem(new mongoose.Types.ObjectId(id), itemId);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu item removed successfully | تم حذف عنصر القائمة بنجاح',
    menu,
  });
});

/**
 * Reorder menu items
 * إعادة ترتيب عناصر القائمة
 */
export const reorderMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error, value } = menuValidation.reorderItems.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw Errors.VALIDATION_ERROR(
      error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    );
  }

  const menu = await Menu.reorderItems(new mongoose.Types.ObjectId(id), value.itemIds);

  if (!menu) {
    throw Errors.NOT_FOUND('Menu | القائمة');
  }

  // Invalidate cache
  await invalidateMenuCache(menu.slug, menu.location);

  return successResponse(res, {
    message: 'Menu items reordered successfully | تم إعادة ترتيب عناصر القائمة بنجاح',
    menu,
  });
});

/**
 * Helper: Invalidate menu cache
 * مساعد: إبطال ذاكرة التخزين المؤقت للقوائم
 */
async function invalidateMenuCache(slug: string, location: MenuLocation) {
  const keysToDelete = [
    `${MENU_CACHE_PREFIX}:slug:${slug}:ar`,
    `${MENU_CACHE_PREFIX}:slug:${slug}:en`,
    `${MENU_CACHE_PREFIX}:slug:${slug}:all`,
    `${MENU_CACHE_PREFIX}:location:${location}:ar`,
    `${MENU_CACHE_PREFIX}:location:${location}:en`,
    `${MENU_CACHE_PREFIX}:location:${location}:all`,
  ];

  for (const k of keysToDelete) {
    await redis.del(k);
  }
}

export const menuController = {
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

export default menuController;
