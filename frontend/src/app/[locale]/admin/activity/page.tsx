'use client';

import React, { useState } from 'react';
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
  Shield,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type ActivityType =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'password_change'
  | 'settings_update'
  | 'permission_change'
  | 'export';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  type: ActivityType;
  resource: string;
  resourceId?: string;
  resourceName?: string;
  details?: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export default function ActivityLogsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data
  const [logs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Ahmed Hassan',
      userEmail: 'ahmed@mwm.com',
      type: 'login',
      resource: 'auth',
      details: 'Successful login',
      ip: '192.168.1.100',
      userAgent: 'Chrome/120.0 Windows',
      createdAt: '2024-01-22T10:30:00',
    },
    {
      id: '2',
      userId: '1',
      userName: 'Ahmed Hassan',
      userEmail: 'ahmed@mwm.com',
      type: 'create',
      resource: 'projects',
      resourceId: 'proj-123',
      resourceName: 'New Website Project',
      ip: '192.168.1.100',
      userAgent: 'Chrome/120.0 Windows',
      createdAt: '2024-01-22T10:45:00',
    },
    {
      id: '3',
      userId: '2',
      userName: 'Sarah Ahmed',
      userEmail: 'sarah@mwm.com',
      type: 'update',
      resource: 'services',
      resourceId: 'srv-456',
      resourceName: 'Web Development',
      details: 'Updated pricing',
      ip: '192.168.1.101',
      userAgent: 'Firefox/121.0 MacOS',
      createdAt: '2024-01-22T11:00:00',
    },
    {
      id: '4',
      userId: '1',
      userName: 'Ahmed Hassan',
      userEmail: 'ahmed@mwm.com',
      type: 'settings_update',
      resource: 'settings',
      details: 'Updated site settings',
      ip: '192.168.1.100',
      userAgent: 'Chrome/120.0 Windows',
      createdAt: '2024-01-22T11:15:00',
    },
    {
      id: '5',
      userId: '3',
      userName: 'Mohamed Ali',
      userEmail: 'mohamed@mwm.com',
      type: 'delete',
      resource: 'blog',
      resourceId: 'blog-789',
      resourceName: 'Old Blog Post',
      ip: '192.168.1.102',
      userAgent: 'Safari/17.0 iOS',
      createdAt: '2024-01-22T11:30:00',
    },
    {
      id: '6',
      userId: '2',
      userName: 'Sarah Ahmed',
      userEmail: 'sarah@mwm.com',
      type: 'permission_change',
      resource: 'users',
      resourceId: 'user-101',
      resourceName: 'Youssef Khaled',
      details: 'Changed role from viewer to editor',
      ip: '192.168.1.101',
      userAgent: 'Firefox/121.0 MacOS',
      createdAt: '2024-01-22T12:00:00',
    },
    {
      id: '7',
      userId: '1',
      userName: 'Ahmed Hassan',
      userEmail: 'ahmed@mwm.com',
      type: 'export',
      resource: 'messages',
      details: 'Exported 150 messages to CSV',
      ip: '192.168.1.100',
      userAgent: 'Chrome/120.0 Windows',
      createdAt: '2024-01-22T12:30:00',
    },
    {
      id: '8',
      userId: '3',
      userName: 'Mohamed Ali',
      userEmail: 'mohamed@mwm.com',
      type: 'view',
      resource: 'projects',
      resourceId: 'proj-123',
      resourceName: 'New Website Project',
      ip: '192.168.1.102',
      userAgent: 'Safari/17.0 iOS',
      createdAt: '2024-01-22T13:00:00',
    },
    {
      id: '9',
      userId: '2',
      userName: 'Sarah Ahmed',
      userEmail: 'sarah@mwm.com',
      type: 'password_change',
      resource: 'auth',
      details: 'Password updated successfully',
      ip: '192.168.1.101',
      userAgent: 'Firefox/121.0 MacOS',
      createdAt: '2024-01-22T14:00:00',
    },
    {
      id: '10',
      userId: '1',
      userName: 'Ahmed Hassan',
      userEmail: 'ahmed@mwm.com',
      type: 'logout',
      resource: 'auth',
      ip: '192.168.1.100',
      userAgent: 'Chrome/120.0 Windows',
      createdAt: '2024-01-22T18:00:00',
    },
  ]);

  const activityTypes: {
    value: ActivityType;
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
      color: 'bg-green-100 text-green-800',
    },
    {
      value: 'logout',
      labelAr: 'تسجيل خروج',
      labelEn: 'Logout',
      icon: <LogOut className="size-4" />,
      color: 'bg-gray-100 text-gray-800',
    },
    {
      value: 'create',
      labelAr: 'إنشاء',
      labelEn: 'Create',
      icon: <Plus className="size-4" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      value: 'update',
      labelAr: 'تحديث',
      labelEn: 'Update',
      icon: <Edit className="size-4" />,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      value: 'delete',
      labelAr: 'حذف',
      labelEn: 'Delete',
      icon: <Trash2 className="size-4" />,
      color: 'bg-red-100 text-red-800',
    },
    {
      value: 'view',
      labelAr: 'عرض',
      labelEn: 'View',
      icon: <Eye className="size-4" />,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      value: 'password_change',
      labelAr: 'تغيير كلمة المرور',
      labelEn: 'Password Change',
      icon: <Key className="size-4" />,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      value: 'settings_update',
      labelAr: 'تحديث الإعدادات',
      labelEn: 'Settings Update',
      icon: <Settings className="size-4" />,
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      value: 'permission_change',
      labelAr: 'تغيير الصلاحيات',
      labelEn: 'Permission Change',
      icon: <Shield className="size-4" />,
      color: 'bg-pink-100 text-pink-800',
    },
    {
      value: 'export',
      labelAr: 'تصدير',
      labelEn: 'Export',
      icon: <Download className="size-4" />,
      color: 'bg-teal-100 text-teal-800',
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
  ];

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
        return <FileText className="size-4" />;
      case 'newsletter':
        return <FileText className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter;
    return matchesSearch && matchesType && matchesResource;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getActivityTypeInfo = (type: ActivityType) => activityTypes.find(t => t.value === type);

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
      ['Date', 'User', 'Email', 'Action', 'Resource', 'Details', 'IP', 'User Agent'],
      ...filteredLogs.map(log => [
        formatDateTime(log.createdAt),
        log.userName,
        log.userEmail,
        log.type,
        log.resource,
        log.details || '',
        log.ip,
        log.userAgent,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-logs.csv';
    a.click();
  };

  const texts = {
    ar: {
      title: 'سجل النشاط',
      search: 'بحث...',
      allTypes: 'جميع الأنواع',
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
    },
    en: {
      title: 'Activity Logs',
      search: 'Search...',
      allTypes: 'All Types',
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
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Activity className="size-7" />
            {t.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            <RefreshCw className="size-4" />
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

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-64 flex-1">
            <Search
              className={`absolute top-1/2 size-4 -translate-y-1/2 text-gray-400${isRTL ? 'right-3' : 'left-3'}`}
            />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 ${isRTL ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="all">{t.allTypes}</option>
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {locale === 'ar' ? type.labelAr : type.labelEn}
              </option>
            ))}
          </select>

          <select
            value={resourceFilter}
            onChange={e => setResourceFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 capitalize"
          >
            <option value="all">{t.allResources}</option>
            {resources.map(resource => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">{t.from}:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">{t.to}:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="rounded-lg border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg bg-white shadow">
        <div className="divide-y">
          {paginatedLogs.map(log => {
            const typeInfo = getActivityTypeInfo(log.type);
            return (
              <div key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600">
                    {log.userName.charAt(0)}
                  </div>

                  {/* Activity Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900">{log.userName}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo?.color}`}
                      >
                        {typeInfo?.icon}
                        {locale === 'ar' ? typeInfo?.labelAr : typeInfo?.labelEn}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        {getResourceIcon(log.resource)}
                        <span className="capitalize">{log.resource}</span>
                      </span>
                      {log.resourceName && (
                        <span className="text-sm font-medium text-blue-600">
                          {log.resourceName}
                        </span>
                      )}
                    </div>

                    {log.details && <p className="mt-1 text-sm text-gray-600">{log.details}</p>}

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDateTime(log.createdAt)}
                      </span>
                      <span>
                        {t.ip}: {log.ip}
                      </span>
                      <span className="max-w-xs truncate">{log.userAgent}</span>
                    </div>
                  </div>

                  {/* Relative Time */}
                  <div className="shrink-0 text-sm text-gray-500">
                    {getRelativeTime(log.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedLogs.length === 0 && (
          <div className="py-12 text-center text-gray-500">{t.noLogs}</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              {t.showing} {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)} {t.of}{' '}
              {filteredLogs.length} {t.results}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-gray-600">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
