/**
 * Content Routes (CMS)
 * مسارات المحتوى
 */

import { Router } from 'express';
import { contentController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * Public Routes
 * المسارات العامة
 */

// GET /api/v1/content/sections - Get all sections
router.get('/sections', contentController.getSections);

// GET /api/v1/content/section/:section - Get content by section
router.get('/section/:section', contentController.getContentBySection);

// GET /api/v1/content/:key - Get content by key
router.get('/:key', contentController.getContentByKey);

/**
 * Admin Routes
 * مسارات المسؤول
 */

// GET /api/v1/content - Get all content (Admin)
router.get('/', authenticate, authorize('settings:read'), contentController.getAllContent);

// POST /api/v1/content - Create content
router.post('/', authenticate, authorize('settings:update'), contentController.createContent);

// POST /api/v1/content/bulk - Bulk upsert content
router.post(
  '/bulk',
  authenticate,
  authorize('settings:update'),
  contentController.bulkUpsertContent
);

// PUT /api/v1/content/:key - Update content
router.put('/:key', authenticate, authorize('settings:update'), contentController.updateContent);

// PUT /api/v1/content/:key/upsert - Upsert content
router.put(
  '/:key/upsert',
  authenticate,
  authorize('settings:update'),
  contentController.upsertContent
);

// DELETE /api/v1/content/:key - Delete content
router.delete('/:key', authenticate, authorize('settings:delete'), contentController.deleteContent);

export default router;
