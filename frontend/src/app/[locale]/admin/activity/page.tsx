'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  Activity,
  Search,
  Calendar,
  User,
  FileText,
  Settings,
  Users,
  Trash2,
  Edit,
  Plus,
  Eye,
  LogIn,
  LogOut,
  Key,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  Globe,
  EyeOff,
} from 'lucide-react';
import { activityService, type ActivityLogEntry } from '@/services/admin/activity.service';
import { Spinner } from '@/components/ui';

type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'view'
  | 'export'
  | 'import'
  | 'publish'
  | 'unpublish';

export default function ActivityLogsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 20;

  const activityTypes: {
    value: ActivityAction;
    labelAr: string;
    labelEn: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      value: 'login',
      labelAr: 'تسجيل دخول',
      labelEn: 'Login',
      icon: <LogIn className="size-4" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      value: 'logout',
      labelAr: 'تسجيل خروج',
      labelEn: 'Logout',
      icon: <LogOut className="size-4" />,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
    {
      value: 'create',
      labelAr: 'إنشاء',
      labelEn: 'Create',
      icon: <Plus className="size-4" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      value: 'update',
      labelAr: 'تحديث',
      labelEn: 'Update',
      icon: <Edit className="size-4" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    {
      value: 'delete',
      labelAr: 'حذف',
      labelEn: 'Delete',
      icon: <Trash2 className="size-4" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      value: 'view',
      labelAr: 'عرض',
      labelEn: 'View',
      icon: <Eye className="size-4" />,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      value: 'export',
      labelAr: 'تصدير',
      labelEn: 'Export',
      icon: <Download className="size-4" />,
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    },
    {
      value: 'import',
      labelAr: 'استيراد',
      labelEn: 'Import',
      icon: <Upload className="size-4" />,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      value: 'publish',
      labelAr: 'نشر',
      labelEn: 'Publish',
      icon: <Globe className="size-4" />,
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      value: 'unpublish',
      labelAr: 'إلغاء النشر',
      labelEn: 'Unpublish',
      icon: <EyeOff className="size-4" />,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  const resources = [
    'auth',
    'projects',
    'services',
    'blog',
    'team',
    'users',
    'settings',
    'messages',
    'newsletter',
    'careers',
    'contact',
  ];

  const fetchLogs = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (actionFilter !== 'all') params.action = actionFilter;
      if (resourceFilter !== 'all') params.resource = resourceFilter;
      if (dateRange.from) params.startDate = dateRange.from;
      if (dateRange.to) params.endDate = dateRange.to;

      const response = await activityService.getLogs(params);
      setLogs(response.logs);
      setTotalPages(response.pagination.totalPages);
      setTotalLogs(response.pagination.total);
      setError(null);
    } catch (err) {
      setError(locale === 'ar' ? 'فشل في تحميل سجلات النشاط' : 'Failed to load activity logs');
      // eslint-disable-next-line no-console
      console.error('Error fetching activity logs:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, actionFilter, resourceFilter, dateRange, locale]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRefresh = () => {
    fetchLogs();
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'auth':
        return <Key className="size-4" />;
      case 'projects':
        return <FileText className="size-4" />;
      case 'services':
        return <Settings className="size-4" />;
      case 'blog':
        return <FileText className="size-4" />;
      case 'team':
        return <Users className="size-4" />;
      case 'users':
        return <User className="size-4" />;
      case 'settings':
        return <Settings className="size-4" />;
      case 'messages':
      case 'contact':
        return <FileText className="size-4" />;
      case 'newsletter':
        return <FileText className="size-4" />;
      case 'careers':
        return <FileText className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  // Filter logs by search query (client-side for immediate feedback)
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.user?.name?.toLowerCase().includes(query) ||
      log.user?.email?.toLowerCase().includes(query) ||
      log.resourceTitle?.toLowerCase().includes(query) ||
      log.resource?.toLowerCase().includes(query)
    );
  });

  const getActivityTypeInfo = (action: ActivityAction) =>
    activityTypes.find(t => t.value === action);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (locale === 'ar') {
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return `منذ ${diffDays} يوم`;
    } else {
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'User', 'Email', 'Action', 'Resource', 'Resource Title', 'IP', 'User Agent'],
      ...filteredLogs.map(log => [
        formatDateTime(log.createdAt),
        log.user?.name || '',
        log.user?.email || '',
        log.action,
        log.resource,
        log.resourceTitle || '',
        log.ip || '',
        log.userAgent || '',
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const texts = {
    ar: {
      title: 'سجل النشاط',
      search: 'بحث...',
      allActions: 'جميع الإجراءات',
      allResources: 'جميع الموارد',
      from: 'من',
      to: 'إلى',
      export: 'تصدير',
      refresh: 'تحديث',
      user: 'المستخدم',
      action: 'الإجراء',
      resource: 'المورد',
      details: 'التفاصيل',
      ip: 'عنوان IP',
      time: 'الوقت',
      noLogs: 'لا توجد سجلات',
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة',
      of: 'من',
      showing: 'عرض',
      results: 'نتيجة',
      error: 'حدث خطأ',
    },
    en: {
      title: 'Activity Logs',
      search: 'Search...',
      allActions: 'All Actions',
      allResources: 'All Resources',
      from: 'From',
      to: 'To',
      export: 'Export',
      refresh: 'Refresh',
      user: 'User',
      action: 'Action',
      resource: 'Resource',
      details: 'Details',
      ip: 'IP Address',
      time: 'Time',
      noLogs: 'No activity logs found',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      showing: 'Showing',
      results: 'results',
      error: 'An error occurred',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Activity className="size-7" />
            {t.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t.refresh}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Download className="size-4" />
            {t.export}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-64 flex-1">
            <Search
              className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}
            />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
            />
          </div>

          <select
            value={actionFilter}
            onChange={e => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t.allActions}</option>
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {locale === 'ar' ? type.labelAr : type.labelEn}
              </option>
            ))}
          </select>

          <select
            value={resourceFilter}
            onChange={e => {
              setResourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border px-3 py-2 capitalize dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t.allResources}</option>
            {resources.map(resource => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">{t.from}:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => {
                setDateRange(prev => ({ ...prev, from: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">{t.to}:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => {
                setDateRange(prev => ({ ...prev, to: e.target.value }));
                setCurrentPage(1);
              }}
              className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="divide-y dark:divide-gray-700">
          {filteredLogs.map(log => {
            const typeInfo = getActivityTypeInfo(log.action);
            return (
              <div key={log._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {log.user?.avatar ? (
                      <img
                        src={log.user.avatar}
                        alt={log.user.name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      log.user?.name?.charAt(0) || '?'
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {log.user?.name || 'Unknown User'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo?.color}`}
                      >
                        {typeInfo?.icon}
                        {locale === 'ar' ? typeInfo?.labelAr : typeInfo?.labelEn}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        {getResourceIcon(log.resource)}
                        <span className="capitalize">{log.resource}</span>
                      </span>
                      {log.resourceTitle && (
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {log.resourceTitle}
                        </span>
                      )}
                    </div>

                    {log.details && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {typeof log.details === 'object'
                          ? JSON.stringify(log.details)
                          : String(log.details)}
                      </p>
                    )}

                    {log.changes && log.changes.length > 0 && (
                      <div className="mt-2 rounded-lg bg-gray-50 p-2 text-sm dark:bg-gray-700">
                        {log.changes.slice(0, 3).map((change, idx) => (
                          <div key={idx} className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{change.field}:</span>{' '}
                            <span className="text-red-500 line-through">
                              {String(change.oldValue)}
                            </span>{' '}
                            → <span className="text-green-500">{String(change.newValue)}</span>
                          </div>
                        ))}
                        {log.changes.length > 3 && (
                          <div className="text-gray-500">
                            +{log.changes.length - 3} more changes
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDateTime(log.createdAt)}
                      </span>
                      {log.ip && (
                        <span>
                          {t.ip}: {log.ip}
                        </span>
                      )}
                      {log.userAgent && <span className="max-w-xs truncate">{log.userAgent}</span>}
                    </div>
                  </div>

                  {/* Relative Time */}
                  <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                    {getRelativeTime(log.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t.noLogs}</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t.showing} {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalLogs)} {t.of} {totalLogs} {t.results}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
