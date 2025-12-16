/**
 * Contact Routes
 * مسارات رسائل التواصل
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contactController } from '../controllers/contact.controller';
import { authenticate, authorize, validate, idParamsSchema, csrfValidation } from '../middlewares';
import { contactValidation } from '../validations';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Public contact form submission
 *   - name: Contact Admin
 *     description: Contact message management (Admin only)
 */

// Check if running in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Rate limit for contact form submissions (5 per hour per IP)
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  skip: () => isTestEnv, // Skip in test environment
  message: {
    success: false,
    message:
      'Too many contact form submissions. Please try again later | تم إرسال طلبات كثيرة. يرجى المحاولة لاحقاً',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============ PUBLIC ROUTES ============

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit contact form
 *     description: Public endpoint to submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               subject:
 *                 type: string
 *                 example: Business Inquiry
 *               message:
 *                 type: string
 *                 example: I would like to discuss a project...
 *     responses:
 *       201:
 *         description: Message submitted successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post(
  '/',
  contactFormLimiter,
  csrfValidation,
  validate({ body: contactValidation.submitContactSchema }),
  contactController.submitContact
);

// ============ ADMIN ROUTES ============

/**
 * @swagger
 * /contact/messages/statistics:
 *   get:
 *     summary: Get message statistics
 *     tags: [Contact Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message statistics
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/messages/statistics',
  authenticate,
  authorize('messages:read'),
  contactController.getStatistics
);

/**
 * @swagger
 * /contact/messages/unread-count:
 *   get:
 *     summary: Get unread message count
 *     tags: [Contact Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/messages/unread-count',
  authenticate,
  authorize('messages:read'),
  contactController.getUnreadCount
);

/**
 * @swagger
 * /contact/messages/bulk:
 *   post:
 *     summary: Bulk action on messages
 *     tags: [Contact Admin]
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
 *                 enum: [delete, archive, markRead, markUnread, markSpam]
 *     responses:
 *       200:
 *         description: Bulk action completed
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/messages/bulk',
  authenticate,
  authorize('messages:update'),
  validate({ body: contactValidation.bulkActionSchema }),
  contactController.bulkAction
);

/**
 * @swagger
 * /contact/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Contact Admin]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied, archived, spam]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: starred
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/messages',
  authenticate,
  authorize('messages:read'),
  validate({ query: contactValidation.queryMessagesSchema }),
  contactController.getMessages
);

/**
 * @swagger
 * /contact/messages/{id}:
 *   get:
 *     summary: Get message by ID
 *     tags: [Contact Admin]
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
 *         description: Message details
 *       404:
 *         description: Message not found
 */
router.get(
  '/messages/:id',
  authenticate,
  authorize('messages:read'),
  validate({ params: idParamsSchema }),
  contactController.getMessageById
);

/**
 * @swagger
 * /contact/messages/{id}:
 *   put:
 *     summary: Update message
 *     tags: [Contact Admin]
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
 *               status:
 *                 type: string
 *               starred:
 *                 type: boolean
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated
 *       404:
 *         description: Message not found
 */
router.put(
  '/messages/:id',
  authenticate,
  authorize('messages:update'),
  validate({ params: idParamsSchema, body: contactValidation.updateMessageSchema }),
  contactController.updateMessage
);

/**
 * @swagger
 * /contact/messages/{id}/reply:
 *   post:
 *     summary: Reply to message
 *     tags: [Contact Admin]
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply sent successfully
 *       404:
 *         description: Message not found
 */
router.post(
  '/messages/:id/reply',
  authenticate,
  authorize('messages:update'),
  validate({ params: idParamsSchema, body: contactValidation.replyMessageSchema }),
  contactController.replyToMessage
);

/**
 * @swagger
 * /contact/messages/{id}/star:
 *   put:
 *     summary: Toggle message starred status
 *     tags: [Contact Admin]
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
 *         description: Star status toggled
 *       404:
 *         description: Message not found
 */
router.put(
  '/messages/:id/star',
  authenticate,
  authorize('messages:update'),
  validate({ params: idParamsSchema }),
  contactController.toggleStar
);

/**
 * @swagger
 * /contact/messages/{id}/spam:
 *   put:
 *     summary: Mark message as spam
 *     tags: [Contact Admin]
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
 *         description: Message marked as spam
 *       404:
 *         description: Message not found
 */
router.put(
  '/messages/:id/spam',
  authenticate,
  authorize('messages:update'),
  validate({ params: idParamsSchema }),
  contactController.markAsSpam
);

/**
 * @swagger
 * /contact/messages/{id}/archive:
 *   put:
 *     summary: Archive message
 *     tags: [Contact Admin]
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
 *         description: Message archived
 *       404:
 *         description: Message not found
 */
router.put(
  '/messages/:id/archive',
  authenticate,
  authorize('messages:update'),
  validate({ params: idParamsSchema }),
  contactController.archiveMessage
);

/**
 * @swagger
 * /contact/messages/{id}:
 *   delete:
 *     summary: Delete message
 *     tags: [Contact Admin]
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
 *         description: Message deleted
 *       404:
 *         description: Message not found
 */
router.delete(
  '/messages/:id',
  authenticate,
  authorize('messages:delete'),
  validate({ params: idParamsSchema }),
  contactController.deleteMessage
);

export default router;
