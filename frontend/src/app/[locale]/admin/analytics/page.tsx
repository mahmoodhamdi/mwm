'use client';

import { useState } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Filter,
  MapPin,
  FileText,
  MousePointer,
  Target,
} from 'lucide-react';

// Mock analytics data
const analyticsData = {
  overview: {
    totalVisitors: 45678,
    visitorsTrend: 12.5,
    pageViews: 128450,
    pageViewsTrend: 8.3,
    avgSessionDuration: '3:45',
    sessionTrend: -2.1,
    bounceRate: 42.3,
    bounceTrend: -5.2,
  },
  trafficSources: [
    { source: 'Organic Search', visitors: 18500, percentage: 40.5, color: 'bg-blue-500' },
    { source: 'Direct', visitors: 12300, percentage: 26.9, color: 'bg-green-500' },
    { source: 'Social Media', visitors: 8900, percentage: 19.5, color: 'bg-purple-500' },
    { source: 'Referral', visitors: 4200, percentage: 9.2, color: 'bg-yellow-500' },
    { source: 'Email', visitors: 1778, percentage: 3.9, color: 'bg-red-500' },
  ],
  topPages: [
    { page: '/services', views: 24500, avgTime: '2:30', bounceRate: 35.2 },
    { page: '/portfolio', views: 18200, avgTime: '3:15', bounceRate: 28.5 },
    { page: '/about', views: 15800, avgTime: '2:45', bounceRate: 42.1 },
    { page: '/contact', views: 12400, avgTime: '1:50', bounceRate: 55.3 },
    { page: '/blog', views: 9800, avgTime: '4:20', bounceRate: 25.8 },
  ],
  devices: [
    { device: 'Desktop', icon: Monitor, visitors: 25200, percentage: 55.2 },
    { device: 'Mobile', icon: Smartphone, visitors: 17500, percentage: 38.3 },
    { device: 'Tablet', icon: Tablet, visitors: 2978, percentage: 6.5 },
  ],
  locations: [
    { country: 'Egypt', flag: '🇪🇬', visitors: 18500, percentage: 40.5 },
    { country: 'Saudi Arabia', flag: '🇸🇦', visitors: 8200, percentage: 17.9 },
    { country: 'UAE', flag: '🇦🇪', visitors: 6500, percentage: 14.2 },
    { country: 'Kuwait', flag: '🇰🇼', visitors: 4200, percentage: 9.2 },
    { country: 'Qatar', flag: '🇶🇦', visitors: 3100, percentage: 6.8 },
    { country: 'Others', flag: '🌍', visitors: 5178, percentage: 11.4 },
  ],
  dailyVisitors: [
    { day: 'Mon', visitors: 6200 },
    { day: 'Tue', visitors: 7100 },
    { day: 'Wed', visitors: 6800 },
    { day: 'Thu', visitors: 7500 },
    { day: 'Fri', visitors: 5800 },
    { day: 'Sat', visitors: 5200 },
    { day: 'Sun', visitors: 7078 },
  ],
  conversions: {
    contactForms: { count: 245, rate: 3.2 },
    newsletter: { count: 890, rate: 5.8 },
    applications: { count: 67, rate: 1.4 },
    downloads: { count: 432, rate: 2.9 },
  },
  realtime: {
    activeUsers: 127,
    pageViews: 342,
    avgTimeOnPage: '2:15',
    topActivePages: [
      { page: '/services/web-development', users: 23 },
      { page: '/portfolio', users: 18 },
      { page: '/contact', users: 15 },
      { page: '/blog/latest-trends', users: 12 },
    ],
  },
};

type DateRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const maxDailyVisitors = Math.max(...analyticsData.dailyVisitors.map(d => d.visitors));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your website performance and visitor insights</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border bg-white p-1">
            {(['7d', '30d', '90d', '1y'] as DateRange[]).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  dateRange === range ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7d'
                  ? '7 Days'
                  : range === '30d'
                    ? '30 Days'
                    : range === '90d'
                      ? '90 Days'
                      : '1 Year'}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Download className="size-4" />
            Export
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
          </span>
          <span className="font-medium">Real-time</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-white/70">Active Users</p>
            <p className="text-3xl font-bold">{analyticsData.realtime.activeUsers}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Page Views (Last Hour)</p>
            <p className="text-3xl font-bold">{analyticsData.realtime.pageViews}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Avg. Time on Page</p>
            <p className="text-3xl font-bold">{analyticsData.realtime.avgTimeOnPage}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Top Active Page</p>
            <p className="truncate text-lg font-medium">
              {analyticsData.realtime.topActivePages[0].page}
            </p>
            <p className="text-sm text-white/70">
              {analyticsData.realtime.topActivePages[0].users} users
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={formatNumber(analyticsData.overview.totalVisitors)}
          trend={analyticsData.overview.visitorsTrend}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Page Views"
          value={formatNumber(analyticsData.overview.pageViews)}
          trend={analyticsData.overview.pageViewsTrend}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Avg. Session Duration"
          value={analyticsData.overview.avgSessionDuration}
          trend={analyticsData.overview.sessionTrend}
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="Bounce Rate"
          value={`${analyticsData.overview.bounceRate}%`}
          trend={analyticsData.overview.bounceTrend}
          icon={Target}
          color="yellow"
          invertTrend
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Visitors Chart */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold">Daily Visitors</h2>
            <BarChart3 className="size-5 text-gray-400" />
          </div>
          <div className="flex h-64 items-end gap-4">
            {analyticsData.dailyVisitors.map((day, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                  style={{ height: `${(day.visitors / maxDailyVisitors) * 100}%` }}
                  title={`${day.visitors} visitors`}
                />
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold">Traffic Sources</h2>
            <Globe className="size-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={index}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">
                    {formatNumber(source.visitors)} ({source.percentage}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full ${source.color} transition-all`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-bold">Devices</h2>
          <div className="space-y-4">
            {analyticsData.devices.map((device, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-3">
                  <device.icon className="size-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.device}</span>
                    <span className="text-sm text-gray-500">{device.percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Top Locations</h2>
            <MapPin className="size-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analyticsData.locations.map((location, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xl">{location.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{location.country}</span>
                    <span className="text-xs text-gray-500">
                      {formatNumber(location.visitors)} ({location.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversions */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Conversions</h2>
            <MousePointer className="size-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <ConversionItem
              title="Contact Forms"
              count={analyticsData.conversions.contactForms.count}
              rate={analyticsData.conversions.contactForms.rate}
              color="bg-blue-500"
            />
            <ConversionItem
              title="Newsletter Signups"
              count={analyticsData.conversions.newsletter.count}
              rate={analyticsData.conversions.newsletter.rate}
              color="bg-green-500"
            />
            <ConversionItem
              title="Job Applications"
              count={analyticsData.conversions.applications.count}
              rate={analyticsData.conversions.applications.rate}
              color="bg-purple-500"
            />
            <ConversionItem
              title="Resource Downloads"
              count={analyticsData.conversions.downloads.count}
              rate={analyticsData.conversions.downloads.rate}
              color="bg-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Top Pages</h2>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500">Page</th>
                <th className="pb-3 font-medium text-gray-500">Views</th>
                <th className="pb-3 font-medium text-gray-500">Avg. Time</th>
                <th className="pb-3 font-medium text-gray-500">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topPages.map((page, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-400" />
                      <span className="font-medium text-blue-600 hover:underline">{page.page}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{formatNumber(page.views)}</td>
                  <td className="py-3 text-gray-600">{page.avgTime}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        page.bounceRate < 35
                          ? 'bg-green-100 text-green-700'
                          : page.bounceRate < 50
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {page.bounceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  invertTrend?: boolean;
}

function StatCard({ title, value, trend, icon: Icon, color, invertTrend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const isPositive = invertTrend ? trend < 0 : trend > 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="size-5" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

interface ConversionItemProps {
  title: string;
  count: number;
  rate: number;
  color: string;
}

function ConversionItem({ title, count, rate, color }: ConversionItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`size-3 rounded-full ${color}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-sm font-bold text-gray-900">{count}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-1 h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full ${color}`} style={{ width: `${rate * 10}%` }} />
          </div>
          <span className="ml-2 text-xs text-gray-500">{rate}%</span>
        </div>
      </div>
    </div>
  );
}
