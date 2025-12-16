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
 * @swagger
 * tags:
 *   - name: Menus
 *     description: Navigation menu management
 */

/**
 * Public Routes
 * المسارات العامة
 */

/**
 * @swagger
 * /menus/location/{location}:
 *   get:
 *     summary: Get menu by location
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *           enum: [header, footer, sidebar]
 *     responses:
 *       200:
 *         description: Menu for the location
 *       404:
 *         description: Menu not found
 */
router.get('/location/:location', menuController.getMenuByLocation);

/**
 * @swagger
 * /menus/slug/{slug}:
 *   get:
 *     summary: Get menu by slug
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu details
 *       404:
 *         description: Menu not found
 */
router.get('/slug/:slug', menuController.getMenuBySlug);

/**
 * Admin Routes
 * مسارات المسؤول
 */

/**
 * @swagger
 * /menus:
 *   get:
 *     summary: Get all menus
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all menus
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('settings:read'), menuController.getAllMenus);

/**
 * @swagger
 * /menus/{id}:
 *   get:
 *     summary: Get menu by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu details
 *       404:
 *         description: Menu not found
 */
router.get(
  '/:id',
  authenticate,
  authorize('settings:read'),
  validate({ params: idParamsSchema }),
  menuController.getMenu
);

/**
 * @swagger
 * /menus:
 *   post:
 *     summary: Create menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               slug:
 *                 type: string
 *               location:
 *                 type: string
 *                 enum: [header, footer, sidebar]
 *               items:
 *                 type: array
 *     responses:
 *       201:
 *         description: Menu created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('settings:update'), menuController.createMenu);

/**
 * @swagger
 * /menus/{id}:
 *   put:
 *     summary: Update menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *               slug:
 *                 type: string
 *               location:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu updated
 *       404:
 *         description: Menu not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.updateMenu
);

/**
 * @swagger
 * /menus/{id}:
 *   delete:
 *     summary: Delete menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted
 *       404:
 *         description: Menu not found
 */
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

/**
 * @swagger
 * /menus/{id}/items:
 *   post:
 *     summary: Add menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - url
 *             properties:
 *               label:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               url:
 *                 type: string
 *               target:
 *                 type: string
 *                 enum: [_self, _blank]
 *               parentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added
 *       404:
 *         description: Menu not found
 */
router.post(
  '/:id/items',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.addMenuItem
);

/**
 * @swagger
 * /menus/{id}/items/{itemId}:
 *   put:
 *     summary: Update menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: object
 *               url:
 *                 type: string
 *               target:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Menu or item not found
 */
router.put(
  '/:id/items/:itemId',
  authenticate,
  authorize('settings:update'),
  validate({ params: idWithItemIdParamsSchema }),
  menuController.updateMenuItem
);

/**
 * @swagger
 * /menus/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Menu or item not found
 */
router.delete(
  '/:id/items/:itemId',
  authenticate,
  authorize('settings:update'),
  validate({ params: idWithItemIdParamsSchema }),
  menuController.removeMenuItem
);

/**
 * @swagger
 * /menus/{id}/reorder:
 *   post:
 *     summary: Reorder menu items
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Items reordered
 *       404:
 *         description: Menu not found
 */
router.post(
  '/:id/reorder',
  authenticate,
  authorize('settings:update'),
  validate({ params: idParamsSchema }),
  menuController.reorderMenuItems
);

export default router;
