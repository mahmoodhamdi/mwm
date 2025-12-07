'use client';

import { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Check,
  Settings,
  Search,
  Trash2,
  Eye,
  Send,
  Clock,
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'message' as const,
    title: 'New Contact Message',
    message: 'Ahmed Mohamed sent a new message about web development services.',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    read: false,
    priority: 'high' as const,
    link: '/admin/messages/1',
  },
  {
    id: '2',
    type: 'application' as const,
    title: 'New Job Application',
    message: 'Sara Ali applied for Senior Frontend Developer position.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    read: false,
    priority: 'medium' as const,
    link: '/admin/careers',
  },
  {
    id: '3',
    type: 'newsletter' as const,
    title: 'New Newsletter Subscriber',
    message: 'mohamed@example.com subscribed to the newsletter.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
    priority: 'low' as const,
    link: '/admin/newsletter',
  },
  {
    id: '4',
    type: 'system' as const,
    title: 'System Update Available',
    message: 'A new version is available. Please update to get the latest features.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    priority: 'low' as const,
  },
  {
    id: '5',
    type: 'alert' as const,
    title: 'High Server Load',
    message: 'Server CPU usage exceeded 80%. Consider scaling resources.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: false,
    priority: 'high' as const,
  },
  {
    id: '6',
    type: 'message' as const,
    title: 'New Contact Message',
    message: 'Omar Hassan asked about mobile app development pricing.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: true,
    priority: 'medium' as const,
    link: '/admin/messages/2',
  },
  {
    id: '7',
    type: 'success' as const,
    title: 'Backup Completed',
    message: 'Weekly database backup completed successfully.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: true,
    priority: 'low' as const,
  },
  {
    id: '8',
    type: 'application' as const,
    title: 'New Job Application',
    message: 'Nour Ahmed applied for UI/UX Designer position.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    priority: 'medium' as const,
    link: '/admin/careers',
  },
];

// Notification settings
const notificationSettings = {
  email: {
    newMessage: true,
    newSubscriber: true,
    newApplication: true,
    securityAlerts: true,
    weeklyReport: false,
    systemUpdates: true,
  },
  inApp: {
    newMessage: true,
    newSubscriber: true,
    newApplication: true,
    securityAlerts: true,
    systemUpdates: true,
  },
  push: {
    newMessage: false,
    securityAlerts: true,
  },
};

type NotificationType =
  | 'all'
  | 'message'
  | 'application'
  | 'newsletter'
  | 'system'
  | 'alert'
  | 'success';
type Tab = 'notifications' | 'settings';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notifications');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState(notificationSettings);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="size-5" />;
      case 'application':
        return <FileText className="size-5" />;
      case 'newsletter':
        return <Mail className="size-5" />;
      case 'system':
        return <Info className="size-5" />;
      case 'alert':
        return <AlertTriangle className="size-5" />;
      case 'success':
        return <CheckCircle className="size-5" />;
      default:
        return <Bell className="size-5" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'application':
        return 'bg-purple-100 text-purple-600';
      case 'newsletter':
        return 'bg-green-100 text-green-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      case 'alert':
        return 'bg-yellow-100 text-yellow-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const toggleSetting = (category: keyof typeof settings, key: string) => {
    setSettings(prev => {
      const categorySettings = prev[category] as Record<string, boolean>;
      return {
        ...prev,
        [category]: {
          ...categorySettings,
          [key]: !categorySettings[key],
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage your notifications and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell className="size-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="size-4" />
              Settings
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'notifications' && (
        <>
          {/* Filters and Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  'all',
                  'message',
                  'application',
                  'newsletter',
                  'system',
                  'alert',
                ] as NotificationType[]
              ).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="size-4" />
                Mark all read
              </button>
              <button
                onClick={deleteAllRead}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Clear read
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-md">
                <Bell className="mx-auto size-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-2 text-gray-500">You&apos;re all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`group flex items-start gap-4 rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg ${
                    !notification.read ? 'border-l-4 border-blue-500 bg-blue-50/30' : ''
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${getNotificationColor(
                      notification.type,
                      notification.priority
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.priority === 'high' && (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            High
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          <Check className="size-3" />
                          Mark as read
                        </button>
                      )}
                      {notification.link && (
                        <button className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
                          <Eye className="size-3" />
                          View
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Email Notifications */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Mail className="size-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold">Email Notifications</h2>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('email', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Bell className="size-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold">In-App Notifications</h2>
                <p className="text-sm text-gray-500">Show notifications in the dashboard</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.inApp).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('inApp', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Send className="size-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold">Push Notifications</h2>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('push', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                Push notifications require browser permission. Click the button below to enable.
              </p>
              <button className="mt-2 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                Enable Push Notifications
              </button>
            </div>
          </div>

          {/* Notification Schedule */}
          <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-3">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-bold">Notification Schedule</h2>
                <p className="text-sm text-gray-500">Set quiet hours for notifications</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quiet Hours Start</label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quiet Hours End</label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              During quiet hours, only high-priority notifications will be delivered.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
