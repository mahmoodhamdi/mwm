/**
 * Notifications Hook
 * هوك الإشعارات
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessagePayload } from 'firebase/messaging';
import {
  requestNotificationPermission,
  onForegroundMessage,
  showNotification,
} from '@/lib/firebase';
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
}

/**
 * Hook for managing notifications
 * هوك لإدارة الإشعارات
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true, locale = 'ar' } = options;
  const queryClient = useQueryClient();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.data;
    },
    enabled,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch unread count
  const { data: unreadCountData } = useQuery<{ count: number }>({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread-count');
      return response.data.data;
    },
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
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

  return {
    notifications: notificationsData?.notifications || [],
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
    locale,
  };
}

export default useNotifications;
