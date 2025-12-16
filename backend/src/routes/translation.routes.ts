/**
 * Translation Routes
 * مسارات الترجمة
 */

import { Router } from 'express';
import { translationController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Translations
 *     description: Translation and i18n management
 */

/**
 * Public Routes
 * المسارات العامة
 */

/**
 * @swagger
 * /translations/all:
 *   get:
 *     summary: Get all translations for a locale
 *     tags: [Translations]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *         description: Locale to get translations for
 *     responses:
 *       200:
 *         description: Translations for the locale
 */
router.get('/all', translationController.getAllByLocale);

/**
 * @swagger
 * /translations/namespaces:
 *   get:
 *     summary: Get all translation namespaces
 *     tags: [Translations]
 *     responses:
 *       200:
 *         description: List of namespaces
 */
router.get('/namespaces', translationController.getNamespaces);

/**
 * @swagger
 * /translations/namespace/{namespace}:
 *   get:
 *     summary: Get translations by namespace
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *     responses:
 *       200:
 *         description: Translations for the namespace
 */
router.get('/namespace/:namespace', translationController.getByNamespace);

/**
 * Admin Routes
 * مسارات المسؤول
 */

/**
 * @swagger
 * /translations:
 *   get:
 *     summary: Get all translations
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All translations
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('settings:read'), translationController.getAllTranslations);

/**
 * @swagger
 * /translations/search:
 *   get:
 *     summary: Search translations
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/search',
  authenticate,
  authorize('settings:read'),
  translationController.searchTranslations
);

/**
 * @swagger
 * /translations/{id}:
 *   get:
 *     summary: Get translation by ID
 *     tags: [Translations]
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
 *         description: Translation details
 *       404:
 *         description: Translation not found
 */
router.get('/:id', authenticate, authorize('settings:read'), translationController.getTranslation);

/**
 * @swagger
 * /translations:
 *   post:
 *     summary: Create translation
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - namespace
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               namespace:
 *                 type: string
 *               value:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *     responses:
 *       201:
 *         description: Translation created
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  authorize('settings:update'),
  translationController.createTranslation
);

/**
 * @swagger
 * /translations/upsert:
 *   post:
 *     summary: Upsert translation
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - namespace
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               namespace:
 *                 type: string
 *               value:
 *                 type: object
 *     responses:
 *       200:
 *         description: Translation upserted
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/upsert',
  authenticate,
  authorize('settings:update'),
  translationController.upsertTranslation
);

/**
 * @swagger
 * /translations/bulk:
 *   post:
 *     summary: Bulk upsert translations
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - translations
 *             properties:
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     namespace:
 *                       type: string
 *                     value:
 *                       type: object
 *     responses:
 *       200:
 *         description: Bulk upsert completed
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/bulk',
  authenticate,
  authorize('settings:update'),
  translationController.bulkUpsertTranslations
);

/**
 * @swagger
 * /translations/{id}:
 *   put:
 *     summary: Update translation
 *     tags: [Translations]
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
 *               value:
 *                 type: object
 *               namespace:
 *                 type: string
 *     responses:
 *       200:
 *         description: Translation updated
 *       404:
 *         description: Translation not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('settings:update'),
  translationController.updateTranslation
);

/**
 * @swagger
 * /translations/{id}:
 *   delete:
 *     summary: Delete translation
 *     tags: [Translations]
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
 *         description: Translation deleted
 *       404:
 *         description: Translation not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('settings:delete'),
  translationController.deleteTranslation
);

export default router;
