/**
 * Translation Routes
 * مسارات الترجمة
 */

import { Router } from 'express';
import { translationController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * Public Routes
 * المسارات العامة
 */

// GET /api/v1/translations/all - Get all translations for a locale
router.get('/all', translationController.getAllByLocale);

// GET /api/v1/translations/namespaces - Get namespaces list
router.get('/namespaces', translationController.getNamespaces);

// GET /api/v1/translations/namespace/:namespace - Get translations by namespace
router.get('/namespace/:namespace', translationController.getByNamespace);

/**
 * Admin Routes
 * مسارات المسؤول
 */

// GET /api/v1/translations - Get all translations (Admin)
router.get('/', authenticate, authorize('settings:read'), translationController.getAllTranslations);

// GET /api/v1/translations/search - Search translations
router.get(
  '/search',
  authenticate,
  authorize('settings:read'),
  translationController.searchTranslations
);

// GET /api/v1/translations/:id - Get single translation
router.get('/:id', authenticate, authorize('settings:read'), translationController.getTranslation);

// POST /api/v1/translations - Create translation
router.post(
  '/',
  authenticate,
  authorize('settings:update'),
  translationController.createTranslation
);

// POST /api/v1/translations/upsert - Upsert translation
router.post(
  '/upsert',
  authenticate,
  authorize('settings:update'),
  translationController.upsertTranslation
);

// POST /api/v1/translations/bulk - Bulk upsert translations
router.post(
  '/bulk',
  authenticate,
  authorize('settings:update'),
  translationController.bulkUpsertTranslations
);

// PUT /api/v1/translations/:id - Update translation
router.put(
  '/:id',
  authenticate,
  authorize('settings:update'),
  translationController.updateTranslation
);

// DELETE /api/v1/translations/:id - Delete translation
router.delete(
  '/:id',
  authenticate,
  authorize('settings:delete'),
  translationController.deleteTranslation
);

export default router;
