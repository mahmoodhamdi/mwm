/**
 * Menu Routes
 * مسارات القوائم
 */

import { Router } from 'express';
import { menuController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema, idWithItemIdParamsSchema } from '../middlewares/validate';

const router = Router();

/**
 * Public Routes
 * المسارات العامة
 */

// GET /api/v1/menus/location/:location - Get menu by location
router.get('/location/:location', menuController.getMenuByLocation);

// GET /api/v1/menus/slug/:slug - Get menu by slug
router.get('/slug/:slug', menuController.getMenuBySlug);

/**
 * Admin Routes
 * مسارات المسؤول
 */

// GET /api/v1/menus - Get all menus (Admin)
router.get('/', authenticate, authorize('settings:read'), menuController.getAllMenus);

// GET /api/v1/menus/:id - Get single menu
router.get(
  '/:id',
  authenticate,
  authorize('settings:read'),
  validate({ params: idParamsSchema }),
  menuController.getMenu
);

// POST /api/v1/menus - Create menu
router.post('/', authenticate, authorize('settings:update'), menuController.createMenu);

// PUT /api/v1/menus/:id - Update menu
router.put(
  '/:id',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.updateMenu
);

// DELETE /api/v1/menus/:id - Delete menu
router.delete(
  '/:id',
  authenticate,
  authorize('settings:delete'),
  validate({ params: idParamsSchema }),
  menuController.deleteMenu
);

/**
 * Menu Items Routes
 * مسارات عناصر القوائم
 */

// POST /api/v1/menus/:id/items - Add menu item
router.post(
  '/:id/items',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.addMenuItem
);

// PUT /api/v1/menus/:id/items/:itemId - Update menu item
router.put(
  '/:id/items/:itemId',
  authenticate,
  authorize('settings:update'),
  validate({ params: idWithItemIdParamsSchema }),
  menuController.updateMenuItem
);

// DELETE /api/v1/menus/:id/items/:itemId - Remove menu item
router.delete(
  '/:id/items/:itemId',
  authenticate,
  authorize('settings:update'),
  validate({ params: idWithItemIdParamsSchema }),
  menuController.removeMenuItem
);

// POST /api/v1/menus/:id/reorder - Reorder menu items
router.post(
  '/:id/reorder',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.reorderMenuItems
);

export default router;
