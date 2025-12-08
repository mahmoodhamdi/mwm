/**
 * Activity Log Admin Service
 * خدمة سجل النشاط
 */

import api from '@/lib/api';

// Types
export interface ActivityLogEntry {
  _id: string;
  user: { _id: string; name: string; email: string; avatar?: string };
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'login'
    | 'logout'
    | 'view'
    | 'export'
    | 'import'
    | 'publish'
    | 'unpublish';
  resource: string;
  resourceId?: string;
  resourceTitle?: string;
  details?: Record<string, unknown>;
  changes?: { field: string; oldValue: unknown; newValue: unknown }[];
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityStatistics {
  byAction: Record<string, number>;
  byResource: Record<string, number>;
  byUser: Record<string, number>;
}

export interface GetLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// Service functions
export async function getLogs(params?: GetLogsParams): Promise<ActivityLogsResponse> {
  const response = await api.get('/activity', { params });
  return response.data.data;
}

export async function getLogsByUser(
  userId: string,
  params?: { page?: number; limit?: number; action?: string; resource?: string }
): Promise<{ logs: ActivityLogEntry[]; total: number }> {
  const response = await api.get(`/activity/user/${userId}`, { params });
  return response.data.data;
}

export async function getLogsByResource(
  resource: string,
  params?: { resourceId?: string; page?: number; limit?: number }
): Promise<{ logs: ActivityLogEntry[]; total: number }> {
  const response = await api.get(`/activity/resource/${resource}`, { params });
  return response.data.data;
}

export async function getRecentLogs(limit?: number): Promise<{ logs: ActivityLogEntry[] }> {
  const response = await api.get('/activity/recent', { params: { limit } });
  return response.data.data;
}

export async function getStatistics(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ActivityStatistics> {
  const response = await api.get('/activity/stats', { params });
  return response.data.data;
}

export async function getMyActivity(params?: {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
}): Promise<{ logs: ActivityLogEntry[]; total: number }> {
  const response = await api.get('/activity/me', { params });
  return response.data.data;
}

export async function deleteOldLogs(daysOld?: number): Promise<{ deleted: number }> {
  const response = await api.delete('/activity/old', { data: { daysOld } });
  return response.data.data;
}

// Service object
export const activityService = {
  getLogs,
  getLogsByUser,
  getLogsByResource,
  getRecentLogs,
  getStatistics,
  getMyActivity,
  deleteOldLogs,
};

export default activityService;
