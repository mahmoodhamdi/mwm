/**
 * Contact Routes
 * مسارات رسائل التواصل
 */

import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authenticate, authorize, validate } from '../middlewares';
import { contactValidation } from '../validations';

const router = Router();

// ============ PUBLIC ROUTES ============

/**
 * @route   POST /api/v1/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post(
  '/',
  validate({ body: contactValidation.submitContactSchema }),
  contactController.submitContact
);

// ============ ADMIN ROUTES ============

/**
 * @route   GET /api/v1/contact/messages/statistics
 * @desc    Get message statistics
 * @access  Private (Admin)
 */
router.get(
  '/messages/statistics',
  authenticate,
  authorize('messages:read'),
  contactController.getStatistics
);

/**
 * @route   GET /api/v1/contact/messages/unread-count
 * @desc    Get unread message count
 * @access  Private (Admin)
 */
router.get(
  '/messages/unread-count',
  authenticate,
  authorize('messages:read'),
  contactController.getUnreadCount
);

/**
 * @route   POST /api/v1/contact/messages/bulk
 * @desc    Bulk action on messages
 * @access  Private (Admin)
 */
router.post(
  '/messages/bulk',
  authenticate,
  authorize('messages:update'),
  validate({ body: contactValidation.bulkActionSchema }),
  contactController.bulkAction
);

/**
 * @route   GET /api/v1/contact/messages
 * @desc    Get all messages
 * @access  Private (Admin)
 */
router.get(
  '/messages',
  authenticate,
  authorize('messages:read'),
  validate({ query: contactValidation.queryMessagesSchema }),
  contactController.getMessages
);

/**
 * @route   GET /api/v1/contact/messages/:id
 * @desc    Get message by ID
 * @access  Private (Admin)
 */
router.get(
  '/messages/:id',
  authenticate,
  authorize('messages:read'),
  contactController.getMessageById
);

/**
 * @route   PUT /api/v1/contact/messages/:id
 * @desc    Update message
 * @access  Private (Admin)
 */
router.put(
  '/messages/:id',
  authenticate,
  authorize('messages:update'),
  validate({ body: contactValidation.updateMessageSchema }),
  contactController.updateMessage
);

/**
 * @route   POST /api/v1/contact/messages/:id/reply
 * @desc    Reply to message
 * @access  Private (Admin)
 */
router.post(
  '/messages/:id/reply',
  authenticate,
  authorize('messages:update'),
  validate({ body: contactValidation.replyMessageSchema }),
  contactController.replyToMessage
);

/**
 * @route   PUT /api/v1/contact/messages/:id/star
 * @desc    Toggle message starred status
 * @access  Private (Admin)
 */
router.put(
  '/messages/:id/star',
  authenticate,
  authorize('messages:update'),
  contactController.toggleStar
);

/**
 * @route   PUT /api/v1/contact/messages/:id/spam
 * @desc    Mark message as spam
 * @access  Private (Admin)
 */
router.put(
  '/messages/:id/spam',
  authenticate,
  authorize('messages:update'),
  contactController.markAsSpam
);

/**
 * @route   PUT /api/v1/contact/messages/:id/archive
 * @desc    Archive message
 * @access  Private (Admin)
 */
router.put(
  '/messages/:id/archive',
  authenticate,
  authorize('messages:update'),
  contactController.archiveMessage
);

/**
 * @route   DELETE /api/v1/contact/messages/:id
 * @desc    Delete message
 * @access  Private (Admin)
 */
router.delete(
  '/messages/:id',
  authenticate,
  authorize('messages:delete'),
  contactController.deleteMessage
);

export default router;
