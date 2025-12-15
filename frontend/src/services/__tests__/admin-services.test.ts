/**
 * Admin Services Tests
 * اختبارات خدمات الإدارة
 */

// Define mock functions
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

// Mock the API before imports
jest.mock('@/lib/api', () => ({
  api: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  extractData: <T>(response: { data?: { data?: T } }): T => response?.data?.data as T,
}));

// Import services after mocking
import {
  getStats,
  getRecentActivity,
  getChartsData,
  getQuickStats,
} from '../admin/dashboard.service';

import {
  getLogs,
  getLogsByUser,
  getLogsByResource,
  getRecentLogs,
  getStatistics,
  getMyActivity,
  deleteOldLogs,
} from '../admin/activity.service';

describe('Admin Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dashboard Service', () => {
    describe('getStats', () => {
      it('should fetch dashboard stats', async () => {
        const mockStats = {
          contacts: { total: 100, unread: 10 },
          projects: { total: 50, published: 45 },
          services: { total: 20, active: 18 },
          posts: { total: 30, published: 25 },
          jobs: { total: 15, open: 5 },
          applications: { total: 200, pending: 20 },
          subscribers: { total: 500, active: 480 },
          team: { total: 10, active: 10 },
        };
        mockGet.mockResolvedValue({ data: { data: mockStats } });

        const result = await getStats();

        expect(mockGet).toHaveBeenCalledWith('/dashboard/stats');
        expect(result).toEqual(mockStats);
      });
    });

    describe('getRecentActivity', () => {
      it('should fetch recent activity with default limit', async () => {
        const mockActivity = {
          recentContacts: [],
          recentPosts: [],
          recentApplications: [],
          recentSubscribers: [],
          recentActivity: [],
        };
        mockGet.mockResolvedValue({ data: { data: mockActivity } });

        const result = await getRecentActivity();

        expect(mockGet).toHaveBeenCalledWith('/dashboard/activity', {
          params: { limit: undefined },
        });
        expect(result).toEqual(mockActivity);
      });

      it('should fetch recent activity with custom limit', async () => {
        const mockActivity = {
          recentContacts: [],
          recentPosts: [],
          recentApplications: [],
          recentSubscribers: [],
          recentActivity: [],
        };
        mockGet.mockResolvedValue({ data: { data: mockActivity } });

        await getRecentActivity(10);

        expect(mockGet).toHaveBeenCalledWith('/dashboard/activity', { params: { limit: 10 } });
      });
    });

    describe('getChartsData', () => {
      it('should fetch charts data with default period', async () => {
        const mockData = {
          timeSeries: {
            contacts: [],
            subscribers: [],
            applications: [],
            posts: [],
          },
          distributions: {
            contactsByStatus: {},
            applicationsByStatus: {},
            jobsByType: {},
          },
        };
        mockGet.mockResolvedValue({ data: { data: mockData } });

        const result = await getChartsData();

        expect(mockGet).toHaveBeenCalledWith('/dashboard/charts', {
          params: { period: undefined },
        });
        expect(result).toEqual(mockData);
      });

      it('should fetch charts data with custom period', async () => {
        const mockData = {
          timeSeries: { contacts: [], subscribers: [], applications: [], posts: [] },
          distributions: { contactsByStatus: {}, applicationsByStatus: {}, jobsByType: {} },
        };
        mockGet.mockResolvedValue({ data: { data: mockData } });

        await getChartsData(30);

        expect(mockGet).toHaveBeenCalledWith('/dashboard/charts', { params: { period: 30 } });
      });
    });

    describe('getQuickStats', () => {
      it('should fetch quick stats', async () => {
        const mockStats = {
          unreadMessages: 5,
          pendingApplications: 10,
          unreadNotifications: 3,
        };
        mockGet.mockResolvedValue({ data: { data: mockStats } });

        const result = await getQuickStats();

        expect(mockGet).toHaveBeenCalledWith('/dashboard/quick-stats');
        expect(result).toEqual(mockStats);
      });
    });
  });

  describe('Activity Service', () => {
    describe('getLogs', () => {
      it('should fetch activity logs with default params', async () => {
        const mockResponse = {
          logs: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        const result = await getLogs();

        expect(mockGet).toHaveBeenCalledWith('/activity', { params: undefined });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch activity logs with custom params', async () => {
        const mockResponse = { logs: [], pagination: {} };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        await getLogs({
          page: 2,
          limit: 20,
          action: 'create',
          resource: 'posts',
          userId: 'user123',
        });

        expect(mockGet).toHaveBeenCalledWith('/activity', {
          params: {
            page: 2,
            limit: 20,
            action: 'create',
            resource: 'posts',
            userId: 'user123',
          },
        });
      });
    });

    describe('getLogsByUser', () => {
      it('should fetch logs by user', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        const result = await getLogsByUser('user123');

        expect(mockGet).toHaveBeenCalledWith('/activity/user/user123', { params: undefined });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch logs by user with filters', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        await getLogsByUser('user123', { page: 1, limit: 10, action: 'create' });

        expect(mockGet).toHaveBeenCalledWith('/activity/user/user123', {
          params: { page: 1, limit: 10, action: 'create' },
        });
      });
    });

    describe('getLogsByResource', () => {
      it('should fetch logs by resource', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        const result = await getLogsByResource('posts');

        expect(mockGet).toHaveBeenCalledWith('/activity/resource/posts', { params: undefined });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch logs by resource with params', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        await getLogsByResource('posts', { resourceId: 'post123', page: 1 });

        expect(mockGet).toHaveBeenCalledWith('/activity/resource/posts', {
          params: { resourceId: 'post123', page: 1 },
        });
      });
    });

    describe('getRecentLogs', () => {
      it('should fetch recent logs', async () => {
        const mockResponse = { logs: [] };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        const result = await getRecentLogs();

        expect(mockGet).toHaveBeenCalledWith('/activity/recent', { params: { limit: undefined } });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch recent logs with limit', async () => {
        const mockResponse = { logs: [] };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        await getRecentLogs(5);

        expect(mockGet).toHaveBeenCalledWith('/activity/recent', { params: { limit: 5 } });
      });
    });

    describe('getStatistics', () => {
      it('should fetch statistics', async () => {
        const mockStats = {
          byAction: { create: 10, update: 5 },
          byResource: { posts: 8, projects: 7 },
          byUser: { user1: 10, user2: 5 },
        };
        mockGet.mockResolvedValue({ data: { data: mockStats } });

        const result = await getStatistics();

        expect(mockGet).toHaveBeenCalledWith('/activity/stats', { params: undefined });
        expect(result).toEqual(mockStats);
      });

      it('should fetch statistics with date range', async () => {
        const mockStats = { byAction: {}, byResource: {}, byUser: {} };
        mockGet.mockResolvedValue({ data: { data: mockStats } });

        await getStatistics({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        });

        expect(mockGet).toHaveBeenCalledWith('/activity/stats', {
          params: { startDate: '2024-01-01', endDate: '2024-12-31' },
        });
      });
    });

    describe('getMyActivity', () => {
      it('should fetch current user activity', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        const result = await getMyActivity();

        expect(mockGet).toHaveBeenCalledWith('/activity/me', { params: undefined });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch current user activity with filters', async () => {
        const mockResponse = { logs: [], total: 0 };
        mockGet.mockResolvedValue({ data: { data: mockResponse } });

        await getMyActivity({ page: 1, limit: 10, action: 'update' });

        expect(mockGet).toHaveBeenCalledWith('/activity/me', {
          params: { page: 1, limit: 10, action: 'update' },
        });
      });
    });

    describe('deleteOldLogs', () => {
      it('should delete old logs with default days', async () => {
        const mockResponse = { deleted: 100 };
        mockDelete.mockResolvedValue({ data: { data: mockResponse } });

        const result = await deleteOldLogs();

        expect(mockDelete).toHaveBeenCalledWith('/activity/old', {
          data: { daysOld: undefined },
        });
        expect(result).toEqual(mockResponse);
      });

      it('should delete old logs with custom days', async () => {
        const mockResponse = { deleted: 50 };
        mockDelete.mockResolvedValue({ data: { data: mockResponse } });

        const result = await deleteOldLogs(90);

        expect(mockDelete).toHaveBeenCalledWith('/activity/old', { data: { daysOld: 90 } });
        expect(result).toEqual(mockResponse);
      });
    });
  });
});
