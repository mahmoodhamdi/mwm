'use client';

/**
 * Analytics Page - Uses real backend data
 * صفحة التحليلات - تستخدم بيانات حقيقية من الخادم
 */

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  BarChart3,
  Users,
  Mail,
  Briefcase,
  FileText,
  ArrowUp,
  Download,
  RefreshCw,
  UserPlus,
  Target,
  AlertCircle,
} from 'lucide-react';
import { dashboardService } from '@/services/admin';
import { Spinner } from '@/components/ui';

interface Stats {
  contacts: { total: number; unread: number };
  projects: { total: number; published: number };
  services: { total: number; active: number };
  posts: { total: number; published: number };
  jobs: { total: number; open: number };
  applications: { total: number; pending: number };
  subscribers: { total: number; active: number };
  team: { total: number; active: number };
}

interface TimeSeriesData {
  contacts: { date: string; count: number }[];
  subscribers: { date: string; count: number }[];
  applications: { date: string; count: number }[];
  posts: { date: string; count: number }[];
}

interface Distributions {
  contactsByStatus: Record<string, number>;
  applicationsByStatus: Record<string, number>;
  jobsByType: Record<string, number>;
}

interface ChartsData {
  timeSeries: TimeSeriesData;
  distributions: Distributions;
}

type DateRange = '7' | '30' | '90';

export default function AnalyticsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const [statsResponse, chartsResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getChartsData(dateRange),
      ]);

      setStats(statsResponse as Stats);
      setChartsData(chartsResponse as ChartsData);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError(isRTL ? 'فشل في تحميل البيانات' : 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleExport = () => {
    // Generate CSV from current data
    if (!stats || !chartsData) return;

    const csvContent = [
      ['Metric', 'Total', 'Active/Published'],
      ['Contacts', stats.contacts.total, stats.contacts.unread],
      ['Subscribers', stats.subscribers.total, stats.subscribers.active],
      ['Applications', stats.applications.total, stats.applications.pending],
      ['Posts', stats.posts.total, stats.posts.published],
      ['Projects', stats.projects.total, stats.projects.published],
      ['Services', stats.services.total, stats.services.active],
      ['Jobs', stats.jobs.total, stats.jobs.open],
      ['Team', stats.team.total, stats.team.active],
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculate totals for time series
  const calculateTotal = (data: { date: string; count: number }[] | undefined) => {
    return data?.reduce((sum, item) => sum + item.count, 0) || 0;
  };

  // Get status distribution as percentage
  const getStatusPercentage = (
    distribution: Record<string, number> | undefined,
    status: string
  ) => {
    if (!distribution) return 0;
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    return total > 0 ? Math.round(((distribution[status] || 0) / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto size-12 text-red-500" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => fetchData()}
            className="bg-primary-600 hover:bg-primary-700 mt-4 rounded-lg px-4 py-2 text-white"
          >
            {isRTL ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isRTL ? 'التحليلات' : 'Analytics'}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {isRTL ? 'نظرة عامة على أداء الموقع' : 'Overview of site performance'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {[
              { value: '7', label: isRTL ? '7 أيام' : '7 Days' },
              { value: '30', label: isRTL ? '30 يوم' : '30 Days' },
              { value: '90', label: isRTL ? '90 يوم' : '90 Days' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value as DateRange)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  dateRange === option.value
                    ? 'text-primary-600 dark:text-primary-400 bg-white shadow dark:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2 rounded-lg px-4 py-2 text-white"
          >
            <Download className="size-4" />
            <span>{isRTL ? 'تصدير' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={isRTL ? 'جهات الاتصال' : 'Contacts'}
          value={stats?.contacts.total || 0}
          subValue={stats?.contacts.unread || 0}
          subLabel={isRTL ? 'جديد' : 'New'}
          icon={Mail}
          color="blue"
          trend={calculateTotal(chartsData?.timeSeries.contacts)}
          trendLabel={isRTL ? `في ${dateRange} يوم` : `in ${dateRange} days`}
        />
        <StatCard
          title={isRTL ? 'المشتركين' : 'Subscribers'}
          value={stats?.subscribers.total || 0}
          subValue={stats?.subscribers.active || 0}
          subLabel={isRTL ? 'نشط' : 'Active'}
          icon={UserPlus}
          color="green"
          trend={calculateTotal(chartsData?.timeSeries.subscribers)}
          trendLabel={isRTL ? `في ${dateRange} يوم` : `in ${dateRange} days`}
        />
        <StatCard
          title={isRTL ? 'طلبات التوظيف' : 'Applications'}
          value={stats?.applications.total || 0}
          subValue={stats?.applications.pending || 0}
          subLabel={isRTL ? 'قيد الانتظار' : 'Pending'}
          icon={Briefcase}
          color="purple"
          trend={calculateTotal(chartsData?.timeSeries.applications)}
          trendLabel={isRTL ? `في ${dateRange} يوم` : `in ${dateRange} days`}
        />
        <StatCard
          title={isRTL ? 'المقالات' : 'Blog Posts'}
          value={stats?.posts.total || 0}
          subValue={stats?.posts.published || 0}
          subLabel={isRTL ? 'منشور' : 'Published'}
          icon={FileText}
          color="orange"
          trend={calculateTotal(chartsData?.timeSeries.posts)}
          trendLabel={isRTL ? `في ${dateRange} يوم` : `in ${dateRange} days`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Time Series Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'النشاط خلال الفترة' : 'Activity Over Time'}
          </h3>
          <div className="h-64">
            <SimpleLineChart
              data={chartsData?.timeSeries.contacts || []}
              dataKey="count"
              color="#3B82F6"
              label={isRTL ? 'جهات الاتصال' : 'Contacts'}
            />
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'جهات الاتصال' : 'Contacts'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'توزيع حالة الرسائل' : 'Message Status Distribution'}
          </h3>
          <div className="space-y-4">
            {chartsData?.distributions.contactsByStatus &&
              Object.entries(chartsData.distributions.contactsByStatus).map(([status, count]) => (
                <StatusBar
                  key={status}
                  label={getStatusLabel(status, isRTL)}
                  count={count}
                  percentage={getStatusPercentage(
                    chartsData.distributions.contactsByStatus,
                    status
                  )}
                  color={getStatusColor(status)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Stats */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'المحتوى' : 'Content'}
          </h3>
          <div className="space-y-4">
            <ContentStat
              icon={Briefcase}
              label={isRTL ? 'المشاريع' : 'Projects'}
              total={stats?.projects.total || 0}
              active={stats?.projects.published || 0}
              activeLabel={isRTL ? 'منشور' : 'Published'}
            />
            <ContentStat
              icon={Target}
              label={isRTL ? 'الخدمات' : 'Services'}
              total={stats?.services.total || 0}
              active={stats?.services.active || 0}
              activeLabel={isRTL ? 'نشط' : 'Active'}
            />
            <ContentStat
              icon={Briefcase}
              label={isRTL ? 'الوظائف' : 'Jobs'}
              total={stats?.jobs.total || 0}
              active={stats?.jobs.open || 0}
              activeLabel={isRTL ? 'مفتوح' : 'Open'}
            />
          </div>
        </div>

        {/* Application Status */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'حالة الطلبات' : 'Application Status'}
          </h3>
          <div className="space-y-4">
            {chartsData?.distributions.applicationsByStatus &&
              Object.entries(chartsData.distributions.applicationsByStatus).map(
                ([status, count]) => (
                  <StatusBar
                    key={status}
                    label={getApplicationStatusLabel(status, isRTL)}
                    count={count}
                    percentage={getStatusPercentage(
                      chartsData.distributions.applicationsByStatus,
                      status
                    )}
                    color={getApplicationStatusColor(status)}
                  />
                )
              )}
          </div>
        </div>

        {/* Team Stats */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'الفريق' : 'Team'}
          </h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Users className="text-primary-500 mx-auto size-12" />
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                {stats?.team.active || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {isRTL ? 'عضو نشط' : 'Active Members'}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {isRTL
                  ? `من أصل ${stats?.team.total || 0} عضو`
                  : `out of ${stats?.team.total || 0} total`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <BarChart3 className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              {isRTL ? 'تحليلات الزوار' : 'Visitor Analytics'}
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {isRTL
                ? 'لتفعيل تحليلات الزوار المفصلة (عدد الزيارات، مصادر الترافيك، المواقع الجغرافية)، يرجى ربط Google Analytics مع الموقع.'
                : 'To enable detailed visitor analytics (page views, traffic sources, geographic locations), please integrate Google Analytics with the site.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  subValue: number;
  subLabel: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: number;
  trendLabel?: string;
}

function StatCard({
  title,
  value,
  subValue,
  subLabel,
  icon: Icon,
  color,
  trend,
  trendLabel,
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="size-6" />
        </div>
        {trend !== undefined && trend > 0 && (
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUp className="size-4" />
            <span className="text-sm">+{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {subValue} {subLabel}
        </span>
        {trendLabel && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{trendLabel}</span>
        )}
      </div>
    </div>
  );
}

// Simple Line Chart Component
interface SimpleLineChartProps {
  data: { date: string; count: number }[];
  dataKey: string;
  color: string;
  label: string;
}

function SimpleLineChart({ data, color }: SimpleLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">No data available</div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const height = 200;
  const width = 100; // percentage

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y = height - (item.count / maxCount) * height;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 100 ${height}`} className="size-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points.join(' ')}
        vectorEffect="non-scaling-stroke"
      />
      {data.map((item, index) => {
        const x = (index / (data.length - 1 || 1)) * width;
        const y = height - (item.count / maxCount) * height;
        return (
          <circle key={index} cx={x} cy={y} r="3" fill={color} vectorEffect="non-scaling-stroke" />
        );
      })}
    </svg>
  );
}

// Status Bar Component
interface StatusBarProps {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

function StatusBar({ label, count, percentage, color }: StatusBarProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// Content Stat Component
interface ContentStatProps {
  icon: React.ElementType;
  label: string;
  total: number;
  active: number;
  activeLabel: string;
}

function ContentStat({ icon: Icon, label, total, active, activeLabel }: ContentStatProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-gray-400" />
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <div className="text-right">
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          ({active} {activeLabel})
        </span>
      </div>
    </div>
  );
}

// Helper functions for status labels and colors
function getStatusLabel(status: string, isRTL: boolean): string {
  const labels: Record<string, { ar: string; en: string }> = {
    new: { ar: 'جديد', en: 'New' },
    read: { ar: 'مقروء', en: 'Read' },
    replied: { ar: 'تم الرد', en: 'Replied' },
    archived: { ar: 'مؤرشف', en: 'Archived' },
  };
  return labels[status]?.[isRTL ? 'ar' : 'en'] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-500',
    read: 'bg-gray-500',
    replied: 'bg-green-500',
    archived: 'bg-yellow-500',
  };
  return colors[status] || 'bg-gray-500';
}

function getApplicationStatusLabel(status: string, isRTL: boolean): string {
  const labels: Record<string, { ar: string; en: string }> = {
    pending: { ar: 'قيد الانتظار', en: 'Pending' },
    reviewing: { ar: 'قيد المراجعة', en: 'Reviewing' },
    shortlisted: { ar: 'مختار', en: 'Shortlisted' },
    interviewed: { ar: 'تمت المقابلة', en: 'Interviewed' },
    accepted: { ar: 'مقبول', en: 'Accepted' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
  };
  return labels[status]?.[isRTL ? 'ar' : 'en'] || status;
}

function getApplicationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    reviewing: 'bg-blue-500',
    shortlisted: 'bg-purple-500',
    interviewed: 'bg-indigo-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}
