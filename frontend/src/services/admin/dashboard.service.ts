/**
 * Dashboard Admin Service
 * خدمة لوحة التحكم
 */

import { api, extractData } from '@/lib/api';

// Types
export interface DashboardStats {
  contacts: { total: number; unread: number };
  projects: { total: number; published: number };
  services: { total: number; active: number };
  posts: { total: number; published: number };
  jobs: { total: number; open: number };
  applications: { total: number; pending: number };
  subscribers: { total: number; active: number };
  team: { total: number; active: number };
}

export interface RecentContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
  status: string;
}

export interface RecentPost {
  _id: string;
  title: { ar: string; en: string };
  status: string;
  createdAt: string;
  author?: { name: string };
}

export interface RecentApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  job?: { title: { ar: string; en: string } };
}

export interface RecentSubscriber {
  _id: string;
  email: string;
  name?: string;
  status: string;
  subscribedAt: string;
}

export interface ActivityLogEntry {
  _id: string;
  user: { _id: string; name: string; email: string; avatar?: string };
  action: string;
  resource: string;
  resourceId?: string;
  resourceTitle?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface RecentActivityResponse {
  recentContacts: RecentContact[];
  recentPosts: RecentPost[];
  recentApplications: RecentApplication[];
  recentSubscribers: RecentSubscriber[];
  recentActivity: ActivityLogEntry[];
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface ChartsDataResponse {
  timeSeries: {
    contacts: TimeSeriesData[];
    subscribers: TimeSeriesData[];
    applications: TimeSeriesData[];
    posts: TimeSeriesData[];
  };
  distributions: {
    contactsByStatus: Record<string, number>;
    applicationsByStatus: Record<string, number>;
    jobsByType: Record<string, number>;
  };
}

export interface QuickStatsResponse {
  unreadMessages: number;
  pendingApplications: number;
  unreadNotifications: number;
}

// Service functions
export async function getStats(): Promise<DashboardStats> {
  const response = await api.get('/dashboard/stats');
  return extractData<DashboardStats>(response);
}

export async function getRecentActivity(limit?: number): Promise<RecentActivityResponse> {
  const response = await api.get('/dashboard/activity', { params: { limit } });
  return extractData<RecentActivityResponse>(response);
}

export async function getChartsData(period?: number): Promise<ChartsDataResponse> {
  const response = await api.get('/dashboard/charts', { params: { period } });
  return extractData<ChartsDataResponse>(response);
}

export async function getQuickStats(): Promise<QuickStatsResponse> {
  const response = await api.get('/dashboard/quick-stats');
  return extractData<QuickStatsResponse>(response);
}

// Service object
export const dashboardService = {
  getStats,
  getRecentActivity,
  getChartsData,
  getQuickStats,
};

export default dashboardService;
