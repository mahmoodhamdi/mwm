/**
 * Settings Routes
 * مسارات الإعدادات
 */

import { Router } from 'express';
import { settingsController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * Public Routes
 * المسارات العامة
 */

// GET /api/v1/settings/public - Get public settings
router.get('/public', settingsController.getPublicSettings);

/**
 * Admin Routes
 * مسارات المسؤول
 */

// GET /api/v1/settings - Get all settings (Admin)
router.get('/', authenticate, authorize('settings:read'), settingsController.getSettings);

// PUT /api/v1/settings - Update all settings
router.put('/', authenticate, authorize('settings:update'), settingsController.updateSettings);

// PUT /api/v1/settings/:section - Update specific section
router.put(
  '/:section',
  authenticate,
  authorize('settings:update'),
  settingsController.updateSettingsSection
);

// POST /api/v1/settings/reset - Reset to defaults (Super Admin only)
router.post('/reset', authenticate, authorize('settings:delete'), settingsController.resetSettings);

export default router;
