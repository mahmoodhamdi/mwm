/**
 * Notifications Hook
 * هوك الإشعارات
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessagePayload } from 'firebase/messaging';
import {
  requestNotificationPermission,
  onForegroundMessage,
  showNotification,
} from '@/lib/firebase';
import { connectSocket, disconnectSocket, subscribeToEvent, NotificationData } from '@/lib/socket';
import api from '@/lib/api';

interface Notification {
  _id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

interface UseNotificationsOptions {
  enabled?: boolean;
  locale?: 'ar' | 'en';
  token?: string | null; // JWT token for socket auth
}

/**
 * Hook for managing notifications
 * هوك لإدارة الإشعارات
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true, locale = 'ar', token = null } = options;
  const queryClient = useQueryClient();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketConnectedRef = useRef(false);

  // Fetch notifications (reduced polling when socket connected)
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationsResponse> => {
      const response = await api.get<{ data: NotificationsResponse }>('/notifications');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (response.data as any).data as NotificationsResponse;
    },
    enabled,
    // Reduce polling when socket is connected (5 min backup vs 1 min without socket)
    refetchInterval: socketConnectedRef.current ? 300000 : 60000,
  });

  // Fetch unread count (reduced polling when socket connected)
  const { data: unreadCountData } = useQuery<{ count: number }>({
    queryKey: ['notifications-unread-count'],
    queryFn: async (): Promise<{ count: number }> => {
      const response = await api.get<{ data: { count: number } }>('/notifications/unread-count');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (response.data as any).data as { count: number };
    },
    enabled,
    // Reduce polling when socket is connected (5 min backup vs 30 sec without socket)
    refetchInterval: socketConnectedRef.current ? 300000 : 30000,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put('/notifications/read-all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // Register device token mutation
  const registerDeviceTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post('/notifications/device-token', {
        token,
        deviceType: 'web',
        browser: navigator.userAgent,
      });
      return response.data;
    },
  });

  // Request permission and register token
  const requestPermission = useCallback(async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setFcmToken(token);
      setPermissionGranted(true);
      // Register token with backend
      registerDeviceTokenMutation.mutate(token);
    }
    return token;
  }, [registerDeviceTokenMutation]);

  // Handle foreground messages
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const unsubscribe = onForegroundMessage((payload: MessagePayload) => {
      // Refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });

      // Show browser notification
      if (payload.notification) {
        showNotification(payload.notification.title || 'New Notification', {
          body: payload.notification.body,
          icon: '/favicon.svg',
          data: payload.data,
        });
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enabled, queryClient]);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Socket connection and event handling
  useEffect(() => {
    if (!enabled || !token || typeof window === 'undefined') return;

    // Connect to socket
    const socket = connectSocket(token);

    socket.on('connect', () => {
      setSocketConnected(true);
      socketConnectedRef.current = true;
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      socketConnectedRef.current = false;
    });

    // Handle real-time notification events
    const unsubscribeNew = subscribeToEvent<{ notification: NotificationData }>(
      'notification:new',
      data => {
        // Add new notification to cache
        queryClient.setQueryData<NotificationsResponse>(['notifications'], old => {
          if (!old) return old;
          return {
            ...old,
            notifications: [data.notification as unknown as Notification, ...old.notifications],
            total: old.total + 1,
            unreadCount: old.unreadCount + 1,
          };
        });

        // Show browser notification
        const title = locale === 'ar' ? data.notification.title.ar : data.notification.title.en;
        const body = locale === 'ar' ? data.notification.body.ar : data.notification.body.en;
        showNotification(title, {
          body,
          icon: '/favicon.svg',
          data: { link: data.notification.link },
        });
      }
    );

    const unsubscribeUpdated = subscribeToEvent<{ id: string; isRead: boolean }>(
      'notification:updated',
      data => {
        // Update notification in cache
        queryClient.setQueryData<NotificationsResponse>(['notifications'], old => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map(n =>
              n._id === data.id ? { ...n, isRead: data.isRead } : n
            ),
          };
        });
      }
    );

    const unsubscribeDeleted = subscribeToEvent<{ id: string }>('notification:deleted', data => {
      // Remove notification from cache
      queryClient.setQueryData<NotificationsResponse>(['notifications'], old => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.filter(n => n._id !== data.id),
          total: old.total - 1,
        };
      });
    });

    const unsubscribeCount = subscribeToEvent<{ count: number }>('notification:count', data => {
      // Update unread count
      queryClient.setQueryData<{ count: number }>(['notifications-unread-count'], {
        count: data.count,
      });
    });

    const unsubscribeReadAll = subscribeToEvent<{ count: number }>('notification:read-all', () => {
      // Mark all as read in cache
      queryClient.setQueryData<NotificationsResponse>(['notifications'], old => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        };
      });
    });

    // Cleanup on unmount
    return () => {
      unsubscribeNew();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeCount();
      unsubscribeReadAll();
      disconnectSocket();
    };
  }, [enabled, token, locale, queryClient]);

  return {
    notifications: (notificationsData?.notifications || []) as Notification[],
    total: notificationsData?.total || 0,
    unreadCount: unreadCountData?.count || notificationsData?.unreadCount || 0,
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    requestPermission,
    fcmToken,
    permissionGranted,
    socketConnected,
    locale,
  };
}

export default useNotifications;
