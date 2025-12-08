/**
 * Notification Bell Component
 * مكون جرس الإشعارات
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import Link from 'next/link';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const t = useTranslations('common');
  const locale = useLocale() as 'ar' | 'en';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestPermission,
    permissionGranted,
  } = useNotifications({ locale });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Request permission on first open
  const handleOpen = async () => {
    if (!permissionGranted) {
      await requestPermission();
    }
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <span className="text-green-500">✓</span>;
      case 'warning':
        return <span className="text-yellow-500">⚠</span>;
      case 'error':
        return <span className="text-red-500">✕</span>;
      default:
        return <span className="text-blue-500">ℹ</span>;
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: locale === 'ar' ? ar : enUS,
    });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="focus:ring-primary-500 relative rounded-full p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label={t('notifications')}
      >
        {unreadCount > 0 ? (
          <>
            <BellAlertIcon className="text-primary-600 size-6" />
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        ) : (
          <BellIcon className="size-6" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 sm:w-96 dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                >
                  {locale === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="border-primary-600 size-8 animate-spin rounded-full border-b-2"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <BellIcon className="mb-2 size-12 opacity-50" />
                <p>{locale === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map(notification => (
                  <li
                    key={notification._id}
                    className={`px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      !notification.isRead ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">{getNotificationIcon(notification.type)}</div>
                      <div className="min-w-0 flex-1">
                        {notification.link ? (
                          <Link
                            href={notification.link}
                            onClick={() => {
                              if (!notification.isRead) {
                                markAsRead(notification._id);
                              }
                              setIsOpen(false);
                            }}
                            className="block"
                          >
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title[locale]}
                            </p>
                            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                              {notification.body[locale]}
                            </p>
                          </Link>
                        ) : (
                          <>
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title[locale]}
                            </p>
                            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                              {notification.body[locale]}
                            </p>
                          </>
                        )}
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1 text-gray-400 hover:text-green-500"
                            title={locale === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                          >
                            <CheckIcon className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title={locale === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <Link
                href={`/${locale}/admin/notifications`}
                onClick={() => setIsOpen(false)}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 block text-center text-sm"
              >
                {locale === 'ar' ? 'عرض كل الإشعارات' : 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
