/**
 * Settings Routes
 * مسارات الإعدادات
 */

import { Router } from 'express';
import { settingsController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: Site settings management
 */

/**
 * Public Routes
 * المسارات العامة
 */

/**
 * @swagger
 * /settings/public:
 *   get:
 *     summary: Get public settings
 *     description: Returns site settings visible to public users
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Public settings
 */
router.get('/public', settingsController.getPublicSettings);

/**
 * Admin Routes
 * مسارات المسؤول
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All site settings
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('settings:read'), settingsController.getSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update all settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               general:
 *                 type: object
 *               contact:
 *                 type: object
 *               social:
 *                 type: object
 *               seo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticate, authorize('settings:update'), settingsController.updateSettings);

/**
 * @swagger
 * /settings/{section}:
 *   put:
 *     summary: Update specific settings section
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           enum: [general, contact, social, seo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Section updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:section',
  authenticate,
  authorize('settings:update'),
  settingsController.updateSettingsSection
);

/**
 * @swagger
 * /settings/reset:
 *   post:
 *     summary: Reset settings to defaults
 *     description: Super Admin only - resets all settings to default values
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings reset to defaults
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin only
 */
router.post('/reset', authenticate, authorize('settings:delete'), settingsController.resetSettings);

export default router;
