/**
 * Contact Controller
 * تحكم رسائل التواصل
 */

import { Request, Response } from 'express';
import { Contact, ContactStatus, ContactPriority } from '../models';
import { asyncHandler } from '../middlewares';
import { redis } from '../config/redis';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { verifyRecaptcha } from '../services/recaptcha.service';
import { notifyNewContact } from '../services/notification.service';
import emailService from '../services/email.service';
import { sanitizeString, detectXssPayload } from '../utils/security';

// Cache TTL: 5 minutes for messages (shorter because they change frequently)
const CACHE_TTL = 60 * 5;

// ============ PUBLIC ============

/**
 * Submit contact form
 * @route POST /api/v1/contact
 * @access Public
 */
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    company,
    website,
    subject,
    message,
    service,
    budget,
    preferredContact,
    recaptchaToken,
  } = req.body;

  // Detect potential XSS payloads in user input
  const userInputs = [name, subject, message, company, website].filter(Boolean);
  for (const input of userInputs) {
    if (detectXssPayload(input)) {
      throw new ApiError(400, 'INVALID_INPUT', 'Invalid characters detected in input');
    }
  }

  // Sanitize user input to prevent XSS
  const sanitizedName = sanitizeString(name || '');
  const sanitizedSubject = sanitizeString(subject || '');
  const sanitizedMessage = sanitizeString(message || '');
  const sanitizedCompany = company ? sanitizeString(company) : undefined;
  const sanitizedWebsite = website ? sanitizeString(website) : undefined;
  const sanitizedService = service ? sanitizeString(service) : undefined;
  const sanitizedBudget = budget ? sanitizeString(budget) : undefined;

  // Get request metadata
  const ip = req.ip || req.connection.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const locale = req.headers['accept-language']?.startsWith('ar') ? 'ar' : 'en';
  const referrer = req.headers.referer || req.headers.referrer || '';

  // Verify reCAPTCHA token if provided
  let recaptchaScore: number | undefined;
  if (recaptchaToken) {
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      throw new ApiError(400, 'RECAPTCHA_FAILED', 'reCAPTCHA verification failed');
    }
    recaptchaScore = recaptchaResult.score;
  }

  // Create contact message with sanitized data
  const contact = await Contact.create({
    name: sanitizedName,
    email, // Email is validated by schema, no sanitization needed
    phone, // Phone is validated by schema
    company: sanitizedCompany,
    website: sanitizedWebsite,
    subject: sanitizedSubject,
    message: sanitizedMessage,
    service: sanitizedService,
    budget: sanitizedBudget,
    preferredContact,
    ip,
    userAgent,
    locale,
    referrer,
    source: 'website',
    recaptchaToken,
    recaptchaScore,
  });

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  // Send push notification to admins
  await notifyNewContact(contact._id.toString(), sanitizedName, sanitizedSubject);

  sendSuccess(
    res,
    {
      contactId: contact._id,
    },
    {
      message:
        locale === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully',
      statusCode: 201,
    }
  );
});

// ============ ADMIN ============

/**
 * Get all messages
 * @route GET /api/v1/contact/messages
 * @access Private (Admin)
 */
export const getMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    status,
    priority,
    starred,
    search,
    service,
    assignedTo,
    dateFrom,
    dateTo,
    page,
    limit,
    sort,
  } = req.query;

  // Check cache
  const cacheKey = `contact:messages:${JSON.stringify(req.query)}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const result = await Contact.getMessages({
    status: status as ContactStatus | undefined,
    priority: priority as ContactPriority | undefined,
    starred: starred === 'true',
    search: search as string,
    service: service as string,
    assignedTo: assignedTo as string,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    sort: sort as string,
  });

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  sendSuccess(res, result);
});

/**
 * Get message by ID
 * @route GET /api/v1/contact/messages/:id
 * @access Private (Admin)
 */
export const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.getById(id);

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Mark as read if new
  if (message.status === 'new') {
    await Contact.markAsRead(id);
    message.status = 'read';
    // Invalidate cache
    const cacheKeys = await redis.keys('contact:*');
    if (cacheKeys.length > 0) {
      await redis.del(...cacheKeys);
    }
  }

  sendSuccess(res, { message });
});

/**
 * Update message
 * @route PUT /api/v1/contact/messages/:id
 * @access Private (Admin)
 */
export const updateMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const message = await Contact.findByIdAndUpdate(id, updateData, { new: true });

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message });
});

/**
 * Reply to message
 * @route POST /api/v1/contact/messages/:id/reply
 * @access Private (Admin)
 */
export const replyToMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message: replyMessage, sendEmail = true } = req.body;
  const userId = (req as Request & { user: { _id: string } }).user._id;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Add reply
  contact.replies = contact.replies || [];
  contact.replies.push({
    message: replyMessage,
    sentAt: new Date(),
    sentBy: userId,
  });
  contact.status = 'replied';
  contact.repliedAt = new Date();

  await contact.save();

  // Send email to contact if sendEmail is true
  if (sendEmail) {
    await emailService.sendContactReply(
      contact.email,
      contact.name,
      contact.subject,
      replyMessage,
      (contact.locale as 'ar' | 'en') || 'ar'
    );
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message: contact });
});

/**
 * Delete message
 * @route DELETE /api/v1/contact/messages/:id
 * @access Private (Admin)
 */
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.findByIdAndDelete(id);

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message: 'Message deleted successfully' });
});

/**
 * Bulk action on messages
 * @route POST /api/v1/contact/messages/bulk
 * @access Private (Admin)
 */
export const bulkAction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { ids, action, value } = req.body;

  let updateData: Record<string, unknown> = {};

  switch (action) {
    case 'read':
      updateData = { status: 'read' };
      break;
    case 'archive':
      updateData = { status: 'archived', archivedAt: new Date() };
      break;
    case 'spam':
      updateData = { status: 'spam' };
      break;
    case 'delete': {
      await Contact.deleteMany({ _id: { $in: ids } });
      // Invalidate cache
      const cacheKeys = await redis.keys('contact:*');
      if (cacheKeys.length > 0) {
        await redis.del(...cacheKeys);
      }
      sendSuccess(res, { message: `${ids.length} messages deleted` });
      return;
    }
    case 'assign':
      updateData = { assignedTo: value };
      break;
    case 'setPriority':
      updateData = { priority: value };
      break;
    default:
      throw new ApiError(400, 'INVALID_ACTION', 'Invalid action');
  }

  await Contact.updateMany({ _id: { $in: ids } }, updateData);

  // Invalidate cache
  const cacheKeysAfter = await redis.keys('contact:*');
  if (cacheKeysAfter.length > 0) {
    await redis.del(...cacheKeysAfter);
  }

  sendSuccess(res, { message: `${ids.length} messages updated` });
});

/**
 * Get message statistics
 * @route GET /api/v1/contact/messages/statistics
 * @access Private (Admin)
 */
export const getStatistics = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Check cache
  const cacheKey = 'contact:statistics';
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const statistics = await Contact.getStatistics();

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(statistics));

  sendSuccess(res, statistics);
});

/**
 * Get unread count
 * @route GET /api/v1/contact/messages/unread-count
 * @access Private (Admin)
 */
export const getUnreadCount = asyncHandler(async (_req: Request, res: Response) => {
  const count = await Contact.getUnreadCount();
  sendSuccess(res, { count });
});

/**
 * Toggle starred status
 * @route PUT /api/v1/contact/messages/:id/star
 * @access Private (Admin)
 */
export const toggleStar = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.findById(id);

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  message.isStarred = !message.isStarred;
  await message.save();

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message, starred: message.isStarred });
});

/**
 * Mark as spam
 * @route PUT /api/v1/contact/messages/:id/spam
 * @access Private (Admin)
 */
export const markAsSpam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.markAsSpam(id);

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message });
});

/**
 * Archive message
 * @route PUT /api/v1/contact/messages/:id/archive
 * @access Private (Admin)
 */
export const archiveMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await Contact.archive(id);

  if (!message) {
    throw new ApiError(404, 'MESSAGE_NOT_FOUND', 'Message not found');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('contact:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message });
});

export const contactController = {
  // Public
  submitContact,
  // Admin
  getMessages,
  getMessageById,
  updateMessage,
  replyToMessage,
  deleteMessage,
  bulkAction,
  getStatistics,
  getUnreadCount,
  toggleStar,
  markAsSpam,
  archiveMessage,
};

export default contactController;
