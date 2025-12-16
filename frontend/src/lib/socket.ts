/**
 * Socket.io Client Configuration
 * تكوين عميل Socket.io
 */

/* eslint-disable no-console */
import { io, Socket } from 'socket.io-client';

// Socket instance
let socket: Socket | null = null;

// Connection state
let isConnecting = false;

/**
 * Get socket server URL
 * الحصول على عنوان خادم المقبس
 */
function getSocketUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  // Extract base URL (remove /api/v1)
  return apiUrl.replace(/\/api\/v1\/?$/, '');
}

/**
 * Connect to socket server
 * الاتصال بخادم المقبس
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  if (isConnecting) {
    return socket!;
  }

  isConnecting = true;

  const socketUrl = getSocketUrl();

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    isConnecting = false;
  });

  socket.on('connect_error', error => {
    console.error('Socket connection error:', error.message);
    isConnecting = false;
  });

  socket.on('disconnect', reason => {
    console.log('Socket disconnected:', reason);
    isConnecting = false;
  });

  socket.on('reconnect', attemptNumber => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', error => {
    console.error('Socket reconnection error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
    isConnecting = false;
  });

  return socket;
}

/**
 * Disconnect socket
 * قطع الاتصال بالمقبس
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
}

/**
 * Get socket instance
 * الحصول على نسخة المقبس
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Check if socket is connected
 * التحقق من اتصال المقبس
 */
export function isSocketConnected(): boolean {
  return socket?.connected || false;
}

/**
 * Subscribe to socket event
 * الاشتراك في حدث المقبس
 */
export function subscribeToEvent<T>(event: string, callback: (data: T) => void): () => void {
  if (!socket) {
    console.warn('Socket not connected. Cannot subscribe to event:', event);
    return () => {};
  }

  socket.on(event, callback);

  // Return unsubscribe function
  return () => {
    socket?.off(event, callback);
  };
}

/**
 * Emit socket event
 * إرسال حدث المقبس
 */
export function emitEvent<T>(event: string, data?: T): void {
  if (!socket?.connected) {
    console.warn('Socket not connected. Cannot emit event:', event);
    return;
  }

  socket.emit(event, data);
}

/**
 * Socket event types for notifications
 * أنواع أحداث المقبس للإشعارات
 */
export interface NotificationSocketEvents {
  // Server -> Client
  'notification:new': { notification: NotificationData };
  'notification:updated': { id: string; isRead: boolean };
  'notification:deleted': { id: string };
  'notification:deleted-read': { count: number };
  'notification:read-all': { count: number };
  'notification:count': { count: number };
}

export interface NotificationData {
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

const socketClient = {
  connect: connectSocket,
  disconnect: disconnectSocket,
  getSocket,
  isConnected: isSocketConnected,
  subscribe: subscribeToEvent,
  emit: emitEvent,
};

export default socketClient;
