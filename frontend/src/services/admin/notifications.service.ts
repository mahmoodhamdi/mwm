/**
 * Notifications Admin Service
 * خدمة إدارة الإشعارات
 */

import { api, extractData } from '@/lib/api';

// Types
export interface Notification {
  _id: string;
  user: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  link?: string;
  data?: Record<string, string>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface DeviceToken {
  _id: string;
  user: string;
  token: string;
  deviceType: 'web' | 'android' | 'ios';
  deviceId?: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  isActive: boolean;
  lastUsedAt: string;
  createdAt: string;
}

export interface SendNotificationInput {
  userId?: string;
  userIds?: string[];
  userRole?: string;
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  data?: Record<string, string>;
}

export interface BroadcastNotificationInput {
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  data?: Record<string, string>;
  topic?: string;
}

// Service functions
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationsResponse> {
  const response = await api.get('/notifications', { params });
  return extractData<NotificationsResponse>(response);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const response = await api.get('/notifications/unread-count');
  return extractData<{ count: number }>(response);
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  const response = await api.put(`/notifications/${notificationId}/read`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (response.data as any).data.notification as Notification;
}

export async function markAllAsRead(): Promise<{ count: number }> {
  const response = await api.put('/notifications/read-all');
  return extractData<{ count: number }>(response);
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await api.delete(`/notifications/${notificationId}`);
}

export async function deleteReadNotifications(): Promise<{ count: number }> {
  const response = await api.delete('/notifications/read');
  return extractData<{ count: number }>(response);
}

export async function registerDeviceToken(
  token: string,
  deviceInfo?: {
    deviceType?: 'web' | 'android' | 'ios';
    deviceId?: string;
    deviceName?: string;
    browser?: string;
    os?: string;
  }
): Promise<DeviceToken> {
  const response = await api.post('/notifications/device-token', {
    token,
    ...deviceInfo,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (response.data as any).data.deviceToken as DeviceToken;
}

export async function removeDeviceToken(token: string): Promise<void> {
  await api.delete('/notifications/device-token', { data: { token } });
}

export async function getDeviceTokens(): Promise<{ tokens: DeviceToken[] }> {
  const response = await api.get('/notifications/device-tokens');
  return extractData<{ tokens: DeviceToken[] }>(response);
}

export async function subscribeToTopic(topic: string, token: string): Promise<void> {
  await api.post(`/notifications/topics/${topic}/subscribe`, { token });
}

export async function unsubscribeFromTopic(topic: string, token: string): Promise<void> {
  await api.post(`/notifications/topics/${topic}/unsubscribe`, { token });
}

// Admin functions
export async function sendNotification(input: SendNotificationInput): Promise<void> {
  await api.post('/notifications/admin/send', input);
}

export async function broadcastNotification(input: BroadcastNotificationInput): Promise<void> {
  await api.post('/notifications/admin/broadcast', input);
}

// Service object
export const notificationsService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  registerDeviceToken,
  removeDeviceToken,
  getDeviceTokens,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendNotification,
  broadcastNotification,
};

export default notificationsService;
