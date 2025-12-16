'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
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
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { notificationsService, type Notification } from '@/services/admin/notifications.service';
import { Spinner } from '@/components/ui';
import Link from 'next/link';

type NotificationType = 'all' | 'info' | 'success' | 'warning' | 'error';
type Tab = 'notifications' | 'settings';

// Notification settings (stored in localStorage for now)
interface NotificationSettings {
  email: {
    newMessage: boolean;
    newSubscriber: boolean;
    newApplication: boolean;
    securityAlerts: boolean;
    weeklyReport: boolean;
    systemUpdates: boolean;
  };
  inApp: {
    newMessage: boolean;
    newSubscriber: boolean;
    newApplication: boolean;
    securityAlerts: boolean;
    systemUpdates: boolean;
  };
  push: {
    newMessage: boolean;
    securityAlerts: boolean;
  };
}

const defaultSettings: NotificationSettings = {
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

export default function NotificationsPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Load notifications
  const fetchNotifications = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setIsRefreshing(true);
      const response = await notificationsService.getNotifications({
        page: pageNum,
        limit,
      });
      setNotifications(prev =>
        append ? [...prev, ...response.notifications] : response.notifications
      );
      setTotal(response.total);
      setUnreadCount(response.unreadCount);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      // eslint-disable-next-line no-console
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // Use default settings
      }
    }
  }, []);

  // Save settings to localStorage when changed
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const title = locale === 'ar' ? notification.title.ar : notification.title.en;
    const body = locale === 'ar' ? notification.body.ar : notification.body.en;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notification = notifications.find(n => n._id === id);
      await notificationsService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setTotal(prev => prev - 1);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting notification:', err);
    }
  };

  const deleteAllRead = async () => {
    try {
      await notificationsService.deleteReadNotifications();
      setNotifications(prev => prev.filter(n => !n.isRead));
      // Recalculate total
      const readCount = notifications.filter(n => n.isRead).length;
      setTotal(prev => prev - readCount);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting read notifications:', err);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchNotifications(1, false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="size-5" />;
      case 'success':
        return <CheckCircle className="size-5" />;
      case 'warning':
        return <AlertTriangle className="size-5" />;
      case 'error':
        return <AlertCircle className="size-5" />;
      default:
        return <Bell className="size-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'success':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
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

  const toggleSetting = (category: keyof NotificationSettings, key: string) => {
    const categorySettings = settings[category] as Record<string, boolean>;
    const newSettings = {
      ...settings,
      [category]: {
        ...categorySettings,
        [key]: !categorySettings[key],
      },
    };
    saveSettings(newSettings);
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Permission granted - you could register the device token here
        alert(locale === 'ar' ? 'تم تفعيل الإشعارات بنجاح!' : 'Push notifications enabled!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'ar'
              ? 'إدارة إشعاراتك وتفضيلاتك'
              : 'Manage your notifications and preferences'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {unreadCount} {locale === 'ar' ? 'غير مقروء' : 'unread'}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell className="size-4" />
              {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
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
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="size-4" />
              {locale === 'ar' ? 'الإعدادات' : 'Settings'}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'notifications' && (
        <>
          {/* Filters and Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'info', 'success', 'warning', 'error'] as NotificationType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {type === 'all'
                    ? locale === 'ar'
                      ? 'الكل'
                      : 'All'
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'بحث...' : 'Search notifications...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Check className="size-4" />
                {locale === 'ar' ? 'قراءة الكل' : 'Mark all read'}
              </button>
              <button
                onClick={deleteAllRead}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-red-600 hover:bg-red-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="size-4" />
                {locale === 'ar' ? 'حذف المقروءة' : 'Clear read'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-md dark:bg-gray-800">
                <Bell className="mx-auto size-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {locale === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {locale === 'ar' ? 'أنت على اطلاع بكل شيء!' : "You're all caught up!"}
                </p>
              </div>
            ) : (
              <>
                {filteredNotifications.map(notification => {
                  const title = locale === 'ar' ? notification.title.ar : notification.title.en;
                  const body = locale === 'ar' ? notification.body.ar : notification.body.en;

                  return (
                    <div
                      key={notification._id}
                      className={`group flex items-start gap-4 rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-800 ${
                        !notification.isRead
                          ? 'border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10'
                          : ''
                      }`}
                    >
                      <div className={`rounded-lg p-3 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                              {title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{body}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.type === 'error' && (
                              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                {locale === 'ar' ? 'مهم' : 'Important'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                              <Check className="size-3" />
                              {locale === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                            </button>
                          )}
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <Eye className="size-3" />
                              {locale === 'ar' ? 'عرض' : 'View'}
                            </Link>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="size-3" />
                            {locale === 'ar' ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Load More Button */}
                {notifications.length < total && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={loadMore}
                      disabled={isRefreshing}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isRefreshing ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="size-4 animate-spin" />
                          {locale === 'ar' ? 'جارِ التحميل...' : 'Loading...'}
                        </span>
                      ) : locale === 'ar' ? (
                        'تحميل المزيد'
                      ) : (
                        'Load More'
                      )}
                    </button>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {locale === 'ar'
                        ? `عرض ${notifications.length} من ${total}`
                        : `Showing ${notifications.length} of ${total}`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Email Notifications */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Mail className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {locale === 'ar' ? 'إشعارات البريد' : 'Email Notifications'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'استلام الإشعارات عبر البريد'
                    : 'Receive notifications via email'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('email', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
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
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                <Bell className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {locale === 'ar' ? 'إشعارات التطبيق' : 'In-App Notifications'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'عرض الإشعارات في لوحة التحكم'
                    : 'Show notifications in the dashboard'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.inApp).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('inApp', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
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
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Send className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {locale === 'ar' ? 'إشعارات المتصفح' : 'Push Notifications'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'ar' ? 'إشعارات فورية في المتصفح' : 'Browser push notifications'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleSetting('push', key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      value ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
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
            <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'ar'
                  ? 'تتطلب الإشعارات الفورية إذن المتصفح. انقر على الزر أدناه للتفعيل.'
                  : 'Push notifications require browser permission. Click the button below to enable.'}
              </p>
              <button
                onClick={requestPushPermission}
                className="mt-2 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                {locale === 'ar' ? 'تفعيل الإشعارات الفورية' : 'Enable Push Notifications'}
              </button>
            </div>
          </div>

          {/* Notification Schedule */}
          <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-3 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
                <Clock className="size-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {locale === 'ar' ? 'جدول الإشعارات' : 'Notification Schedule'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'تعيين ساعات الهدوء للإشعارات'
                    : 'Set quiet hours for notifications'}
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {locale === 'ar' ? 'بداية ساعات الهدوء' : 'Quiet Hours Start'}
                </label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {locale === 'ar' ? 'نهاية ساعات الهدوء' : 'Quiet Hours End'}
                </label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {locale === 'ar'
                ? 'خلال ساعات الهدوء، سيتم تسليم الإشعارات ذات الأولوية العالية فقط.'
                : 'During quiet hours, only high-priority notifications will be delivered.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
