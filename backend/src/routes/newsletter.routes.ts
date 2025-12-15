/**
 * Newsletter Routes
 * مسارات النشرة البريدية
 */

import { Router } from 'express';
import * as newsletterController from '../controllers/newsletter.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate, idParamsSchema } from '../middlewares/validate';
import {
  subscribeSchema,
  unsubscribeSchema,
  createSubscriberSchema,
  updateSubscriberSchema,
  bulkSubscriberActionSchema,
  querySubscribersSchema,
  createCampaignSchema,
  updateCampaignSchema,
  scheduleCampaignSchema,
  queryCampaignsSchema,
} from '../validations/newsletter.validation';

const router = Router();

// ============ PUBLIC ROUTES ============

/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               locale:
 *                 type: string
 *                 enum: [ar, en]
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *       400:
 *         description: Invalid input
 */
router.post('/subscribe', validate({ body: subscribeSchema }), newsletterController.subscribe);

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *       400:
 *         description: Invalid email or token
 */
router.post(
  '/unsubscribe',
  validate({ body: unsubscribeSchema }),
  newsletterController.unsubscribe
);

/**
 * @swagger
 * /newsletter/verify/{token}:
 *   get:
 *     summary: Verify email subscription
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify/:token', newsletterController.verifyEmail);

// ============ ADMIN ROUTES - SUBSCRIBERS ============

/**
 * @swagger
 * /newsletter/subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, unsubscribed, bounced, pending]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [website, import, manual, api]
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subscribers
 */
router.get(
  '/subscribers',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ query: querySubscribersSchema }),
  newsletterController.getSubscribers
);

/**
 * @swagger
 * /newsletter/subscribers/stats:
 *   get:
 *     summary: Get subscriber statistics
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscriber statistics
 */
router.get(
  '/subscribers/stats',
  authenticate,
  authorize('admin', 'super_admin'),
  newsletterController.getSubscriberStats
);

/**
 * @swagger
 * /newsletter/subscribers/tags:
 *   get:
 *     summary: Get all subscriber tags
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get(
  '/subscribers/tags',
  authenticate,
  authorize('admin', 'super_admin'),
  newsletterController.getSubscriberTags
);

/**
 * @swagger
 * /newsletter/subscribers/import:
 *   post:
 *     summary: Import subscribers from CSV data
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscribers
 *             properties:
 *               subscribers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *               locale:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Import results
 */
router.post(
  '/subscribers/import',
  authenticate,
  authorize('admin', 'super_admin'),
  newsletterController.importSubscribers
);

/**
 * @swagger
 * /newsletter/subscribers/export:
 *   get:
 *     summary: Export subscribers
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exported subscribers
 */
router.get(
  '/subscribers/export',
  authenticate,
  authorize('admin', 'super_admin'),
  newsletterController.exportSubscribers
);

/**
 * @swagger
 * /newsletter/subscribers/bulk:
 *   post:
 *     summary: Bulk subscriber action
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - action
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               action:
 *                 type: string
 *                 enum: [delete, unsubscribe, activate, addTags, removeTags]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Action completed
 */
router.post(
  '/subscribers/bulk',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ body: bulkSubscriberActionSchema }),
  newsletterController.bulkSubscriberAction
);

/**
 * @swagger
 * /newsletter/subscribers:
 *   post:
 *     summary: Create subscriber manually
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Subscriber created
 */
router.post(
  '/subscribers',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ body: createSubscriberSchema }),
  newsletterController.createSubscriber
);

/**
 * @swagger
 * /newsletter/subscribers/{id}:
 *   put:
 *     summary: Update subscriber
 *     tags: [Newsletter Admin]
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
 *         description: Subscriber updated
 */
router.put(
  '/subscribers/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema, body: updateSubscriberSchema }),
  newsletterController.updateSubscriber
);

/**
 * @swagger
 * /newsletter/subscribers/{id}:
 *   delete:
 *     summary: Delete subscriber
 *     tags: [Newsletter Admin]
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
 *         description: Subscriber deleted
 */
router.delete(
  '/subscribers/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.deleteSubscriber
);

// ============ ADMIN ROUTES - CAMPAIGNS ============

/**
 * @swagger
 * /newsletter/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, scheduled, sending, sent, cancelled]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get(
  '/campaigns',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ query: queryCampaignsSchema }),
  newsletterController.getCampaigns
);

/**
 * @swagger
 * /newsletter/campaigns/stats:
 *   get:
 *     summary: Get campaign statistics
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Campaign statistics
 */
router.get(
  '/campaigns/stats',
  authenticate,
  authorize('admin', 'super_admin'),
  newsletterController.getCampaignStats
);

/**
 * @swagger
 * /newsletter/campaigns:
 *   post:
 *     summary: Create campaign
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - content
 *             properties:
 *               subject:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               content:
 *                 type: object
 *                 properties:
 *                   ar:
 *                     type: string
 *                   en:
 *                     type: string
 *               recipientType:
 *                 type: string
 *                 enum: [all, tags, specific]
 *     responses:
 *       201:
 *         description: Campaign created
 */
router.post(
  '/campaigns',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ body: createCampaignSchema }),
  newsletterController.createCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Newsletter Admin]
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
 *         description: Campaign details
 */
router.get(
  '/campaigns/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.getCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}:
 *   put:
 *     summary: Update campaign
 *     tags: [Newsletter Admin]
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
 *         description: Campaign updated
 */
router.put(
  '/campaigns/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema, body: updateCampaignSchema }),
  newsletterController.updateCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}:
 *   delete:
 *     summary: Delete campaign
 *     tags: [Newsletter Admin]
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
 *         description: Campaign deleted
 */
router.delete(
  '/campaigns/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.deleteCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}/send:
 *   post:
 *     summary: Send campaign immediately
 *     tags: [Newsletter Admin]
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
 *         description: Campaign sent
 */
router.post(
  '/campaigns/:id/send',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.sendCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}/schedule:
 *   post:
 *     summary: Schedule campaign
 *     tags: [Newsletter Admin]
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
 *               - scheduledAt
 *             properties:
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Campaign scheduled
 */
router.post(
  '/campaigns/:id/schedule',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema, body: scheduleCampaignSchema }),
  newsletterController.scheduleCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}/cancel:
 *   post:
 *     summary: Cancel scheduled campaign
 *     tags: [Newsletter Admin]
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
 *         description: Campaign cancelled
 */
router.post(
  '/campaigns/:id/cancel',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.cancelCampaign
);

/**
 * @swagger
 * /newsletter/campaigns/{id}/duplicate:
 *   post:
 *     summary: Duplicate campaign
 *     tags: [Newsletter Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Campaign duplicated
 */
router.post(
  '/campaigns/:id/duplicate',
  authenticate,
  authorize('admin', 'super_admin'),
  validate({ params: idParamsSchema }),
  newsletterController.duplicateCampaign
);

export default router;
