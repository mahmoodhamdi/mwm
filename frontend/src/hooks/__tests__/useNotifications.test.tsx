/**
 * useNotifications Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications } from '../useNotifications';
import * as firebase from '@/lib/firebase';
import * as socket from '@/lib/socket';
import api from '@/lib/api';

// Mock dependencies
jest.mock('@/lib/firebase', () => ({
  requestNotificationPermission: jest.fn(),
  onForegroundMessage: jest.fn(() => jest.fn()),
  showNotification: jest.fn(),
}));

jest.mock('@/lib/socket', () => ({
  connectSocket: jest.fn(),
  disconnectSocket: jest.fn(),
  subscribeToEvent: jest.fn(() => jest.fn()),
}));

jest.mock('@/lib/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('useNotifications', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  const mockNotifications = [
    {
      _id: '1',
      type: 'info' as const,
      title: { ar: 'إشعار 1', en: 'Notification 1' },
      body: { ar: 'نص الإشعار 1', en: 'Notification body 1' },
      isRead: false,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      _id: '2',
      type: 'success' as const,
      title: { ar: 'إشعار 2', en: 'Notification 2' },
      body: { ar: 'نص الإشعار 2', en: 'Notification body 2' },
      isRead: true,
      readAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockNotificationsResponse = {
    data: {
      data: {
        notifications: mockNotifications,
        total: 2,
        unreadCount: 1,
      },
    },
  };

  const mockUnreadCountResponse = {
    data: {
      data: {
        count: 1,
      },
    },
  };

  beforeEach(() => {
    // Create a fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    // Create wrapper with QueryClientProvider
    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Reset mocks
    jest.clearAllMocks();

    // Mock API responses
    mockApi.get.mockImplementation((url: string) => {
      if (url === '/notifications') {
        return Promise.resolve(mockNotificationsResponse);
      }
      if (url === '/notifications/unread-count') {
        return Promise.resolve(mockUnreadCountResponse);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    mockApi.put.mockResolvedValue({ data: { success: true } });
    mockApi.delete.mockResolvedValue({ data: { success: true } });
    mockApi.post.mockResolvedValue({ data: { success: true } });

    // Mock socket
    const mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    };
    (socket.connectSocket as jest.Mock).mockReturnValue(mockSocket);
    (socket.subscribeToEvent as jest.Mock).mockReturnValue(jest.fn());

    // Mock Notification API
    Object.defineProperty(window, 'Notification', {
      writable: true,
      value: {
        permission: 'default',
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('fetching notifications', () => {
    it('should fetch notifications on mount', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockApi.get).toHaveBeenCalledWith('/notifications');
      expect(result.current.notifications).toEqual(mockNotifications);
      expect(result.current.total).toBe(2);
    });

    it('should fetch unread count', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockApi.get).toHaveBeenCalledWith('/notifications/unread-count');
      expect(result.current.unreadCount).toBe(1);
    });

    it('should not fetch when disabled', async () => {
      renderHook(() => useNotifications({ enabled: false }), { wrapper });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockApi.get).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('real-time updates', () => {
    it('should connect to socket when token is provided', async () => {
      const token = 'test-jwt-token';
      renderHook(() => useNotifications({ token }), { wrapper });

      await waitFor(() => {
        expect(socket.connectSocket).toHaveBeenCalledWith(token);
      });
    });

    it('should not connect to socket without token', async () => {
      renderHook(() => useNotifications(), { wrapper });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(socket.connectSocket).not.toHaveBeenCalled();
    });

    it('should subscribe to notification events', async () => {
      const token = 'test-jwt-token';
      renderHook(() => useNotifications({ token }), { wrapper });

      await waitFor(() => {
        expect(socket.subscribeToEvent).toHaveBeenCalledWith(
          'notification:new',
          expect.any(Function)
        );
        expect(socket.subscribeToEvent).toHaveBeenCalledWith(
          'notification:updated',
          expect.any(Function)
        );
        expect(socket.subscribeToEvent).toHaveBeenCalledWith(
          'notification:deleted',
          expect.any(Function)
        );
        expect(socket.subscribeToEvent).toHaveBeenCalledWith(
          'notification:count',
          expect.any(Function)
        );
        expect(socket.subscribeToEvent).toHaveBeenCalledWith(
          'notification:read-all',
          expect.any(Function)
        );
      });
    });

    it('should disconnect socket on unmount', async () => {
      const token = 'test-jwt-token';
      const { unmount } = renderHook(() => useNotifications({ token }), { wrapper });

      await waitFor(() => {
        expect(socket.connectSocket).toHaveBeenCalled();
      });

      unmount();

      expect(socket.disconnectSocket).toHaveBeenCalled();
    });

    it('should update socket connection state', async () => {
      const token = 'test-jwt-token';
      const mockSocket = {
        on: jest.fn((event, callback) => {
          if (event === 'connect') {
            setTimeout(() => callback(), 0);
          }
        }),
        off: jest.fn(),
        emit: jest.fn(),
      };
      (socket.connectSocket as jest.Mock).mockReturnValue(mockSocket);

      const { result } = renderHook(() => useNotifications({ token }), { wrapper });

      await waitFor(() => {
        expect(result.current.socketConnected).toBe(true);
      });
    });
  });

  describe('mark as read', () => {
    it('should mark notification as read', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.markAsRead('1');
      });

      await waitFor(() => {
        expect(mockApi.put).toHaveBeenCalledWith('/notifications/1/read');
      });
    });

    it('should invalidate queries after marking as read', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      act(() => {
        result.current.markAsRead('1');
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ['notifications-unread-count'],
        });
      });
    });

    it('should mark all notifications as read', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.markAllAsRead();
      });

      await waitFor(() => {
        expect(mockApi.put).toHaveBeenCalledWith('/notifications/read-all');
      });
    });
  });

  describe('delete notification', () => {
    it('should delete notification', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteNotification('1');
      });

      await waitFor(() => {
        expect(mockApi.delete).toHaveBeenCalledWith('/notifications/1');
      });
    });

    it('should invalidate queries after deletion', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      act(() => {
        result.current.deleteNotification('1');
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ['notifications-unread-count'],
        });
      });
    });
  });

  describe('push notification permissions', () => {
    it('should request notification permission', async () => {
      const mockToken = 'fcm-token-123';
      (firebase.requestNotificationPermission as jest.Mock).mockResolvedValue(mockToken);

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let token: string | null = null;
      await act(async () => {
        token = await result.current.requestPermission();
      });

      await waitFor(() => {
        expect(firebase.requestNotificationPermission).toHaveBeenCalled();
        expect(token).toBe(mockToken);
        expect(result.current.fcmToken).toBe(mockToken);
        expect(result.current.permissionGranted).toBe(true);
      });
    });

    it('should register device token with backend', async () => {
      const mockToken = 'fcm-token-123';
      (firebase.requestNotificationPermission as jest.Mock).mockResolvedValue(mockToken);

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.requestPermission();
      });

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith('/notifications/device-token', {
          token: mockToken,
          deviceType: 'web',
          browser: expect.any(String),
        });
      });
    });

    it('should check notification permission on mount', () => {
      Object.defineProperty(window, 'Notification', {
        writable: true,
        value: {
          permission: 'granted',
        },
      });

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.permissionGranted).toBe(true);
    });
  });

  describe('locale handling', () => {
    it('should use Arabic locale by default', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.locale).toBe('ar');
      });
    });

    it('should use custom locale', async () => {
      const { result } = renderHook(() => useNotifications({ locale: 'en' }), { wrapper });

      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
    });
  });

  describe('refetch', () => {
    it('should allow manual refetch', async () => {
      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockApi.get.mockClear();

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/notifications');
      });
    });
  });
});
