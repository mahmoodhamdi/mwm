/**
 * Newsletter Controller
 * تحكم النشرة البريدية
 */

import { Request, Response } from 'express';
import { Subscriber, SubscriberStatus, SubscriberSource } from '../models/Subscriber';
import { Newsletter, CampaignStatus } from '../models/Newsletter';
import { newsletterService } from '../services/newsletter.service';
import { asyncHandler } from '../middlewares';
import { redis } from '../config/redis';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { generateCacheKey } from '../utils/helpers';

// Cache TTL: 5 minutes
const CACHE_TTL = 60 * 5;

// ============ PUBLIC ============

/**
 * Subscribe to newsletter
 * @route POST /api/v1/newsletter/subscribe
 * @access Public
 */
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, locale } = req.body;

  // Get request metadata
  const ip = req.ip || req.connection.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const refHeader = req.headers.referer || req.headers.referrer;
  const referrer = Array.isArray(refHeader) ? refHeader[0] : refHeader || '';

  const { subscriber, isNew } = await newsletterService.subscribe({
    email,
    name,
    locale: locale || 'ar',
    source: 'website',
    metadata: { ip, userAgent, referrer },
  });

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  const responseLocale = locale || 'ar';
  res.status(isNew ? 201 : 200);
  sendSuccess(res, {
    message:
      responseLocale === 'ar'
        ? 'تم الاشتراك في النشرة البريدية بنجاح'
        : 'Successfully subscribed to the newsletter',
    subscriber: {
      email: subscriber.email,
      name: subscriber.name,
    },
  });
});

/**
 * Unsubscribe from newsletter
 * @route POST /api/v1/newsletter/unsubscribe
 * @access Public
 */
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.body;

  const success = await newsletterService.unsubscribe(email, token);

  if (!success) {
    throw new ApiError(400, 'UNSUBSCRIBE_FAILED', 'Invalid email or token');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, {
    message: 'Successfully unsubscribed from the newsletter',
  });
});

/**
 * Verify email subscription
 * @route GET /api/v1/newsletter/verify/:token
 * @access Public
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  const subscriber = await newsletterService.verifyEmail(token);

  if (!subscriber) {
    throw new ApiError(400, 'VERIFICATION_FAILED', 'Invalid or expired verification token');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, {
    message: 'Email verified successfully',
    subscriber: {
      email: subscriber.email,
      name: subscriber.name,
    },
  });
});

// ============ ADMIN - SUBSCRIBERS ============

/**
 * Get all subscribers
 * @route GET /api/v1/newsletter/subscribers
 * @access Private (Admin)
 */
export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, tags, search, page, limit, sort } = req.query;

  // Check cache
  const cacheKey = generateCacheKey('newsletter:subscribers', req.query as Record<string, unknown>);
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  // Parse tags if string
  let parsedTags: string[] | undefined;
  if (tags) {
    parsedTags = typeof tags === 'string' ? tags.split(',') : (tags as string[]);
  }

  const result = await Subscriber.getSubscribers({
    status: status as SubscriberStatus | undefined,
    source: source as SubscriberSource | undefined,
    tags: parsedTags,
    search: search as string,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    sort: sort as string,
  });

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  sendSuccess(res, result);
});

/**
 * Get subscriber statistics
 * @route GET /api/v1/newsletter/subscribers/stats
 * @access Private (Admin)
 */
export const getSubscriberStats = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = 'newsletter:subscribers:stats';
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const stats = await Subscriber.getStats();

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(stats));

  sendSuccess(res, stats);
});

/**
 * Get all subscriber tags
 * @route GET /api/v1/newsletter/subscribers/tags
 * @access Private (Admin)
 */
export const getSubscriberTags = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = 'newsletter:subscribers:tags';
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, { tags: JSON.parse(cached) });
    return;
  }

  const tags = await Subscriber.getAllTags();

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(tags));

  sendSuccess(res, { tags });
});

/**
 * Create subscriber (admin)
 * @route POST /api/v1/newsletter/subscribers
 * @access Private (Admin)
 */
export const createSubscriber = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, status, source, tags, locale } = req.body;

  // Check if subscriber already exists
  const existing = await Subscriber.getByEmail(email);
  if (existing) {
    throw new ApiError(400, 'SUBSCRIBER_EXISTS', 'A subscriber with this email already exists');
  }

  const subscriber = await Subscriber.create({
    email,
    name,
    status: status || 'active',
    source: source || 'manual',
    tags: tags || [],
    locale: locale || 'ar',
  });

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  res.status(201);
  sendSuccess(res, { subscriber });
});

/**
 * Update subscriber
 * @route PUT /api/v1/newsletter/subscribers/:id
 * @access Private (Admin)
 */
export const updateSubscriber = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, tags, locale } = req.body;

  const subscriber = await Subscriber.findById(id);
  if (!subscriber) {
    throw new ApiError(404, 'SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
  }

  if (name !== undefined) subscriber.name = name;
  if (status !== undefined) {
    subscriber.status = status;
    if (status === 'unsubscribed') {
      subscriber.unsubscribedAt = new Date();
    }
  }
  if (tags !== undefined) subscriber.tags = tags;
  if (locale !== undefined) subscriber.locale = locale;

  await subscriber.save();

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { subscriber });
});

/**
 * Delete subscriber
 * @route DELETE /api/v1/newsletter/subscribers/:id
 * @access Private (Admin)
 */
export const deleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subscriber = await Subscriber.findByIdAndDelete(id);
  if (!subscriber) {
    throw new ApiError(404, 'SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message: 'Subscriber deleted successfully' });
});

/**
 * Bulk subscriber action
 * @route POST /api/v1/newsletter/subscribers/bulk
 * @access Private (Admin)
 */
export const bulkSubscriberAction = asyncHandler(async (req: Request, res: Response) => {
  const { ids, action, tags } = req.body;

  let count = 0;

  switch (action) {
    case 'delete': {
      const deleteResult = await Subscriber.deleteMany({ _id: { $in: ids } });
      count = deleteResult.deletedCount;
      break;
    }
    case 'unsubscribe':
      count = await Subscriber.bulkUpdateStatus(ids, 'unsubscribed');
      break;
    case 'activate':
      count = await Subscriber.bulkUpdateStatus(ids, 'active');
      break;
    case 'addTags': {
      const addResult = await Subscriber.updateMany(
        { _id: { $in: ids } },
        { $addToSet: { tags: { $each: tags } } }
      );
      count = addResult.modifiedCount;
      break;
    }
    case 'removeTags': {
      const removeResult = await Subscriber.updateMany(
        { _id: { $in: ids } },
        { $pullAll: { tags } }
      );
      count = removeResult.modifiedCount;
      break;
    }
  }

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message: `${action} action completed`, count });
});

/**
 * Import subscribers from CSV
 * @route POST /api/v1/newsletter/subscribers/import
 * @access Private (Admin)
 */
export const importSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { subscribers, locale, tags } = req.body;

  if (!Array.isArray(subscribers) || subscribers.length === 0) {
    throw new ApiError(400, 'INVALID_DATA', 'Subscribers array is required');
  }

  const result = await newsletterService.importSubscribers(subscribers, { locale, tags });

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:subscribers:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, result);
});

/**
 * Export subscribers
 * @route GET /api/v1/newsletter/subscribers/export
 * @access Private (Admin)
 */
export const exportSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { status, tags } = req.query;

  let parsedTags: string[] | undefined;
  if (tags) {
    parsedTags = typeof tags === 'string' ? tags.split(',') : (tags as string[]);
  }

  const subscribers = await newsletterService.exportSubscribers({
    status: status as SubscriberStatus | undefined,
    tags: parsedTags,
  });

  sendSuccess(res, { subscribers });
});

// ============ ADMIN - CAMPAIGNS ============

/**
 * Get all campaigns
 * @route GET /api/v1/newsletter/campaigns
 * @access Private (Admin)
 */
export const getCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const { status, search, page, limit, sort } = req.query;

  // Check cache
  const cacheKey = generateCacheKey('newsletter:campaigns', req.query as Record<string, unknown>);
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const result = await Newsletter.getCampaigns({
    status: status as CampaignStatus | undefined,
    search: search as string,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    sort: sort as string,
  });

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  sendSuccess(res, result);
});

/**
 * Get campaign statistics
 * @route GET /api/v1/newsletter/campaigns/stats
 * @access Private (Admin)
 */
export const getCampaignStats = asyncHandler(async (_req: Request, res: Response) => {
  const cacheKey = 'newsletter:campaigns:stats';
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const stats = await Newsletter.getStats();

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(stats));

  sendSuccess(res, stats);
});

/**
 * Get campaign by ID
 * @route GET /api/v1/newsletter/campaigns/:id
 * @access Private (Admin)
 */
export const getCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const campaign = await Newsletter.getById(id);
  if (!campaign) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  sendSuccess(res, { campaign });
});

/**
 * Create campaign
 * @route POST /api/v1/newsletter/campaigns
 * @access Private (Admin)
 */
export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { subject, preheader, content, recipientType, recipientTags, recipientIds } = req.body;

  const campaign = await Newsletter.create({
    subject,
    preheader,
    content,
    recipientType: recipientType || 'all',
    recipientTags,
    recipientIds,
    status: 'draft',
    createdBy: req.user?._id,
  });

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  res.status(201);
  sendSuccess(res, { campaign });
});

/**
 * Update campaign
 * @route PUT /api/v1/newsletter/campaigns/:id
 * @access Private (Admin)
 */
export const updateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subject, preheader, content, recipientType, recipientTags, recipientIds } = req.body;

  const campaign = await Newsletter.findById(id);
  if (!campaign) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  if (campaign.status !== 'draft') {
    throw new ApiError(400, 'CAMPAIGN_NOT_EDITABLE', 'Only draft campaigns can be edited');
  }

  if (subject) campaign.subject = subject;
  if (preheader) campaign.preheader = preheader;
  if (content) campaign.content = content;
  if (recipientType) campaign.recipientType = recipientType;
  if (recipientTags) campaign.recipientTags = recipientTags;
  if (recipientIds) campaign.recipientIds = recipientIds;
  campaign.updatedBy = req.user?._id;

  await campaign.save();

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { campaign });
});

/**
 * Delete campaign
 * @route DELETE /api/v1/newsletter/campaigns/:id
 * @access Private (Admin)
 */
export const deleteCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const campaign = await Newsletter.findById(id);
  if (!campaign) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  if (campaign.status === 'sending') {
    throw new ApiError(
      400,
      'CAMPAIGN_SENDING',
      'Cannot delete a campaign that is currently sending'
    );
  }

  await Newsletter.findByIdAndDelete(id);

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { message: 'Campaign deleted successfully' });
});

/**
 * Send campaign immediately
 * @route POST /api/v1/newsletter/campaigns/:id/send
 * @access Private (Admin)
 */
export const sendCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await newsletterService.sendCampaign(id);

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, {
    message: 'Campaign sent successfully',
    sentCount: result.sentCount,
    errors: result.errors,
  });
});

/**
 * Schedule campaign
 * @route POST /api/v1/newsletter/campaigns/:id/schedule
 * @access Private (Admin)
 */
export const scheduleCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { scheduledAt } = req.body;

  const campaign = await newsletterService.scheduleCampaign(id, new Date(scheduledAt));

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { campaign });
});

/**
 * Cancel scheduled campaign
 * @route POST /api/v1/newsletter/campaigns/:id/cancel
 * @access Private (Admin)
 */
export const cancelCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const campaign = await newsletterService.cancelCampaign(id);

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  sendSuccess(res, { campaign });
});

/**
 * Duplicate campaign
 * @route POST /api/v1/newsletter/campaigns/:id/duplicate
 * @access Private (Admin)
 */
export const duplicateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const original = await Newsletter.findById(id);
  if (!original) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  const duplicate = await Newsletter.create({
    subject: {
      ar: `${original.subject.ar} (نسخة)`,
      en: `${original.subject.en} (Copy)`,
    },
    preheader: original.preheader,
    content: original.content,
    recipientType: original.recipientType,
    recipientTags: original.recipientTags,
    recipientIds: original.recipientIds,
    status: 'draft',
    createdBy: req.user?._id,
  });

  // Invalidate cache
  const cacheKeys = await redis.keys('newsletter:campaigns:*');
  if (cacheKeys.length > 0) {
    await redis.del(...cacheKeys);
  }

  res.status(201);
  sendSuccess(res, { campaign: duplicate });
});
