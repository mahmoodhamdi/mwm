/**
 * Dashboard Controller
 * تحكم لوحة التحكم
 */

import { Request, Response } from 'express';
import {
  Contact,
  Project,
  Service,
  BlogPost,
  Job,
  JobApplication,
  Subscriber,
  TeamMember,
  Notification,
  ActivityLog,
} from '../models';
import { asyncHandler } from '../middlewares';
import { redis } from '../config/redis';
import { sendSuccess } from '../utils/response';

// Cache TTL: 5 minutes
const CACHE_TTL = 60 * 5;

/**
 * Get dashboard statistics
 * @route GET /api/v1/dashboard/stats
 * @access Private (Admin)
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  // Check cache
  const cacheKey = 'dashboard:stats';
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  // Get all counts in parallel
  const [
    totalContacts,
    unreadContacts,
    totalProjects,
    publishedProjects,
    totalServices,
    activeServices,
    totalPosts,
    publishedPosts,
    totalJobs,
    openJobs,
    totalApplications,
    pendingApplications,
    totalSubscribers,
    activeSubscribers,
    totalTeamMembers,
    activeTeamMembers,
  ] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Project.countDocuments(),
    Project.countDocuments({ isPublished: true }),
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'open' }),
    JobApplication.countDocuments(),
    JobApplication.countDocuments({ status: 'pending' }),
    Subscriber.countDocuments(),
    Subscriber.countDocuments({ status: 'active' }),
    TeamMember.countDocuments(),
    TeamMember.countDocuments({ isActive: true }),
  ]);

  const stats = {
    contacts: { total: totalContacts, unread: unreadContacts },
    projects: { total: totalProjects, published: publishedProjects },
    services: { total: totalServices, active: activeServices },
    posts: { total: totalPosts, published: publishedPosts },
    jobs: { total: totalJobs, open: openJobs },
    applications: { total: totalApplications, pending: pendingApplications },
    subscribers: { total: totalSubscribers, active: activeSubscribers },
    team: { total: totalTeamMembers, active: activeTeamMembers },
  };

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(stats));

  sendSuccess(res, stats);
});

/**
 * Get recent activity
 * @route GET /api/v1/dashboard/activity
 * @access Private (Admin)
 */
export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20 } = req.query;

  // Check cache
  const cacheKey = `dashboard:activity:${limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const [recentContacts, recentPosts, recentApplications, recentSubscribers, recentActivity] =
    await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name email subject createdAt status'),
      BlogPost.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status createdAt author')
        .populate('author', 'name'),
      JobApplication.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email status createdAt job')
        .populate('job', 'title'),
      Subscriber.find().sort({ createdAt: -1 }).limit(5).select('email name status subscribedAt'),
      ActivityLog.getRecent(Number(limit)),
    ]);

  const result = {
    recentContacts,
    recentPosts,
    recentApplications,
    recentSubscribers,
    recentActivity,
  };

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  sendSuccess(res, result);
});

/**
 * Get dashboard charts data
 * @route GET /api/v1/dashboard/charts
 * @access Private (Admin)
 */
export const getChartsData = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30' } = req.query;
  const days = Number(period);

  // Check cache
  const cacheKey = `dashboard:charts:${days}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get daily data for charts
  const [contactsByDay, subscribersByDay, applicationsByDay, postsByDay] = await Promise.all([
    Contact.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Subscriber.aggregate([
      { $match: { subscribedAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscribedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    JobApplication.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    BlogPost.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'published' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Get status distributions
  const [contactsByStatus, applicationsByStatus, jobsByType] = await Promise.all([
    Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    JobApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Job.aggregate([
      { $match: { status: 'open' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]),
  ]);

  const result = {
    timeSeries: {
      contacts: contactsByDay.map(d => ({ date: d._id, count: d.count })),
      subscribers: subscribersByDay.map(d => ({ date: d._id, count: d.count })),
      applications: applicationsByDay.map(d => ({ date: d._id, count: d.count })),
      posts: postsByDay.map(d => ({ date: d._id, count: d.count })),
    },
    distributions: {
      contactsByStatus: Object.fromEntries(contactsByStatus.map(s => [s._id, s.count])),
      applicationsByStatus: Object.fromEntries(applicationsByStatus.map(s => [s._id, s.count])),
      jobsByType: Object.fromEntries(jobsByType.map(j => [j._id, j.count])),
    },
  };

  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  sendSuccess(res, result);
});

/**
 * Get quick stats for header
 * @route GET /api/v1/dashboard/quick-stats
 * @access Private (Admin)
 */
export const getQuickStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { _id: string } }).user._id;

  // Check cache
  const cacheKey = `dashboard:quick:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    sendSuccess(res, JSON.parse(cached));
    return;
  }

  const [unreadMessages, pendingApplications, unreadNotifications] = await Promise.all([
    Contact.countDocuments({ status: 'new' }),
    JobApplication.countDocuments({ status: 'pending' }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  const result = {
    unreadMessages,
    pendingApplications,
    unreadNotifications,
  };

  // Cache result (shorter TTL for quick stats)
  await redis.setex(cacheKey, 60, JSON.stringify(result));

  sendSuccess(res, result);
});

export const dashboardController = {
  getStats,
  getRecentActivity,
  getChartsData,
  getQuickStats,
};

export default dashboardController;
