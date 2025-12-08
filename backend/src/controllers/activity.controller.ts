/**
 * Activity Log Controller
 * تحكم سجل النشاط
 */

import { Request, Response } from 'express';
import { ActivityLog } from '../models';
import { asyncHandler } from '../middlewares';
import { sendSuccess } from '../utils/response';

/**
 * Get activity logs
 * @route GET /api/v1/activity
 * @access Private (Admin)
 */
export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, action, resource, userId, startDate, endDate } = req.query;

  const query: Record<string, unknown> = {};

  if (action) query.action = action;
  if (resource) query.resource = resource;
  if (userId) query.user = userId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) (query.createdAt as Record<string, Date>).$gte = new Date(startDate as string);
    if (endDate) (query.createdAt as Record<string, Date>).$lte = new Date(endDate as string);
  }

  const skip = ((Number(page) || 1) - 1) * (Number(limit) || 20);

  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit) || 20)
      .populate('user', 'name email avatar'),
    ActivityLog.countDocuments(query),
  ]);

  sendSuccess(res, {
    logs,
    pagination: {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      total,
      totalPages: Math.ceil(total / (Number(limit) || 20)),
    },
  });
});

/**
 * Get activity logs by user
 * @route GET /api/v1/activity/user/:userId
 * @access Private (Admin)
 */
export const getLogsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page, limit, action, resource } = req.query;

  const result = await ActivityLog.getByUser(userId, {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    action: action as string,
    resource: resource as string,
  });

  sendSuccess(res, result);
});

/**
 * Get activity logs by resource
 * @route GET /api/v1/activity/resource/:resource
 * @access Private (Admin)
 */
export const getLogsByResource = asyncHandler(async (req: Request, res: Response) => {
  const { resource } = req.params;
  const { resourceId, page, limit } = req.query;

  const result = await ActivityLog.getByResource(resource, resourceId as string, {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
  });

  sendSuccess(res, result);
});

/**
 * Get recent activity
 * @route GET /api/v1/activity/recent
 * @access Private (Admin)
 */
export const getRecent = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query;
  const logs = await ActivityLog.getRecent(Number(limit) || 20);
  sendSuccess(res, { logs });
});

/**
 * Get activity statistics
 * @route GET /api/v1/activity/stats
 * @access Private (Admin)
 */
export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const stats = await ActivityLog.getStatistics(
    startDate ? new Date(startDate as string) : undefined,
    endDate ? new Date(endDate as string) : undefined
  );

  sendSuccess(res, stats);
});

/**
 * Get my activity (current user)
 * @route GET /api/v1/activity/me
 * @access Private
 */
export const getMyActivity = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;
  const { page, limit, action, resource } = req.query;

  const result = await ActivityLog.getByUser(userId, {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    action: action as string,
    resource: resource as string,
  });

  sendSuccess(res, result);
});

/**
 * Delete old logs
 * @route DELETE /api/v1/activity/old
 * @access Private (Super Admin)
 */
export const deleteOldLogs = asyncHandler(async (req: Request, res: Response) => {
  const { daysOld = 90 } = req.body;
  const deleted = await ActivityLog.deleteOld(Number(daysOld));
  sendSuccess(res, { message: `${deleted} old logs deleted`, deleted });
});

export const activityController = {
  getLogs,
  getLogsByUser,
  getLogsByResource,
  getRecent,
  getStatistics,
  getMyActivity,
  deleteOldLogs,
};

export default activityController;
