/**
 * Admin Services Tests
 * اختبارات خدمات الإدارة
 */

import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  extractData: jest.fn(
    (response: { data?: { data?: unknown } }) => response.data?.data || response.data
  ),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Admin Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dashboard Service', () => {
    let dashboardService: typeof import('../admin/dashboard.service');

    beforeEach(async () => {
      jest.resetModules();
      dashboardService = await import('../admin/dashboard.service');
    });

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
        mockApi.get.mockResolvedValue({ data: { data: mockStats } });

        const result = await dashboardService.getStats();

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/stats');
        expect(result).toBeDefined();
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
        mockApi.get.mockResolvedValue({ data: { data: mockActivity } });

        await dashboardService.getRecentActivity();

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/activity', {
          params: { limit: undefined },
        });
      });

      it('should fetch recent activity with custom limit', async () => {
        mockApi.get.mockResolvedValue({ data: { data: {} } });

        await dashboardService.getRecentActivity(10);

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/activity', { params: { limit: 10 } });
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
        mockApi.get.mockResolvedValue({ data: { data: mockData } });

        await dashboardService.getChartsData();

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/charts', {
          params: { period: undefined },
        });
      });

      it('should fetch charts data with custom period', async () => {
        mockApi.get.mockResolvedValue({ data: { data: {} } });

        await dashboardService.getChartsData(30);

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/charts', { params: { period: 30 } });
      });
    });

    describe('getQuickStats', () => {
      it('should fetch quick stats', async () => {
        const mockStats = {
          unreadMessages: 5,
          pendingApplications: 10,
          unreadNotifications: 3,
        };
        mockApi.get.mockResolvedValue({ data: { data: mockStats } });

        const result = await dashboardService.getQuickStats();

        expect(mockApi.get).toHaveBeenCalledWith('/dashboard/quick-stats');
        expect(result).toBeDefined();
      });
    });
  });

  describe('Activity Service', () => {
    let activityService: typeof import('../admin/activity.service');

    beforeEach(async () => {
      jest.resetModules();
      activityService = await import('../admin/activity.service');
    });

    describe('getLogs', () => {
      it('should fetch activity logs with default params', async () => {
        const mockResponse = {
          logs: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
        mockApi.get.mockResolvedValue({ data: { data: mockResponse } });

        await activityService.getLogs();

        expect(mockApi.get).toHaveBeenCalledWith('/activity', { params: undefined });
      });

      it('should fetch activity logs with custom params', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], pagination: {} } } });

        await activityService.getLogs({
          page: 2,
          limit: 20,
          action: 'create',
          resource: 'posts',
          userId: 'user123',
        });

        expect(mockApi.get).toHaveBeenCalledWith('/activity', {
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
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getLogsByUser('user123');

        expect(mockApi.get).toHaveBeenCalledWith('/activity/user/user123', { params: undefined });
      });

      it('should fetch logs by user with filters', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getLogsByUser('user123', { page: 1, limit: 10, action: 'create' });

        expect(mockApi.get).toHaveBeenCalledWith('/activity/user/user123', {
          params: { page: 1, limit: 10, action: 'create' },
        });
      });
    });

    describe('getLogsByResource', () => {
      it('should fetch logs by resource', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getLogsByResource('posts');

        expect(mockApi.get).toHaveBeenCalledWith('/activity/resource/posts', { params: undefined });
      });

      it('should fetch logs by resource with params', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getLogsByResource('posts', { resourceId: 'post123', page: 1 });

        expect(mockApi.get).toHaveBeenCalledWith('/activity/resource/posts', {
          params: { resourceId: 'post123', page: 1 },
        });
      });
    });

    describe('getRecentLogs', () => {
      it('should fetch recent logs', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [] } } });

        await activityService.getRecentLogs();

        expect(mockApi.get).toHaveBeenCalledWith('/activity/recent', {
          params: { limit: undefined },
        });
      });

      it('should fetch recent logs with limit', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [] } } });

        await activityService.getRecentLogs(5);

        expect(mockApi.get).toHaveBeenCalledWith('/activity/recent', { params: { limit: 5 } });
      });
    });

    describe('getStatistics', () => {
      it('should fetch statistics', async () => {
        const mockStats = {
          byAction: { create: 10, update: 5 },
          byResource: { posts: 8, projects: 7 },
          byUser: { user1: 10, user2: 5 },
        };
        mockApi.get.mockResolvedValue({ data: { data: mockStats } });

        await activityService.getStatistics();

        expect(mockApi.get).toHaveBeenCalledWith('/activity/stats', { params: undefined });
      });

      it('should fetch statistics with date range', async () => {
        mockApi.get.mockResolvedValue({ data: { data: {} } });

        await activityService.getStatistics({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        });

        expect(mockApi.get).toHaveBeenCalledWith('/activity/stats', {
          params: { startDate: '2024-01-01', endDate: '2024-12-31' },
        });
      });
    });

    describe('getMyActivity', () => {
      it('should fetch current user activity', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getMyActivity();

        expect(mockApi.get).toHaveBeenCalledWith('/activity/me', { params: undefined });
      });

      it('should fetch current user activity with filters', async () => {
        mockApi.get.mockResolvedValue({ data: { data: { logs: [], total: 0 } } });

        await activityService.getMyActivity({ page: 1, limit: 10, action: 'update' });

        expect(mockApi.get).toHaveBeenCalledWith('/activity/me', {
          params: { page: 1, limit: 10, action: 'update' },
        });
      });
    });

    describe('deleteOldLogs', () => {
      it('should delete old logs with default days', async () => {
        mockApi.delete.mockResolvedValue({ data: { data: { deleted: 100 } } });

        await activityService.deleteOldLogs();

        expect(mockApi.delete).toHaveBeenCalledWith('/activity/old', {
          data: { daysOld: undefined },
        });
      });

      it('should delete old logs with custom days', async () => {
        mockApi.delete.mockResolvedValue({ data: { data: { deleted: 50 } } });

        await activityService.deleteOldLogs(90);

        expect(mockApi.delete).toHaveBeenCalledWith('/activity/old', { data: { daysOld: 90 } });
      });
    });
  });
});
