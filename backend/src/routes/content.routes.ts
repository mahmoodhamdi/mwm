/**
 * Content Routes (CMS)
 * مسارات المحتوى
 */

import { Router } from 'express';
import { contentController } from '../controllers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Content
 *     description: CMS content management
 */

/**
 * Public Routes
 * المسارات العامة
 */

/**
 * @swagger
 * /content/sections:
 *   get:
 *     summary: Get all content sections
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: List of content sections
 */
router.get('/sections', contentController.getSections);

/**
 * @swagger
 * /content/section/{section}:
 *   get:
 *     summary: Get content by section
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Section name (e.g., home, about, contact)
 *     responses:
 *       200:
 *         description: Content for the section
 */
router.get('/section/:section', contentController.getContentBySection);

/**
 * @swagger
 * /content/{key}:
 *   get:
 *     summary: Get content by key
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Content key
 *     responses:
 *       200:
 *         description: Content item
 *       404:
 *         description: Content not found
 */
router.get('/:key', contentController.getContentByKey);

/**
 * Admin Routes
 * مسارات المسؤول
 */

/**
 * @swagger
 * /content:
 *   get:
 *     summary: Get all content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All content items
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize('settings:read'), contentController.getAllContent);

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Create content
 *     tags: [Content]
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
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               section:
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
 *         description: Content created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('settings:update'), contentController.createContent);

/**
 * @swagger
 * /content/bulk:
 *   post:
 *     summary: Bulk upsert content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
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
 *                     key:
 *                       type: string
 *                     section:
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
  contentController.bulkUpsertContent
);

/**
 * @swagger
 * /content/{key}:
 *   put:
 *     summary: Update content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: object
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content updated
 *       404:
 *         description: Content not found
 */
router.put('/:key', authenticate, authorize('settings:update'), contentController.updateContent);

/**
 * @swagger
 * /content/{key}/upsert:
 *   put:
 *     summary: Upsert content (create or update)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: object
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content upserted
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:key/upsert',
  authenticate,
  authorize('settings:update'),
  contentController.upsertContent
);

/**
 * @swagger
 * /content/{key}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted
 *       404:
 *         description: Content not found
 */
router.delete('/:key', authenticate, authorize('settings:delete'), contentController.deleteContent);

export default router;
