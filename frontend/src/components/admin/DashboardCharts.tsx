/**
 * Dashboard Charts Component
 * مكون رسومات لوحة التحكم
 */

'use client';

import React from 'react';
import { useLocale } from 'next-intl';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartProps {
  titleAr: string;
  titleEn: string;
  data: { date: string; value: number }[];
  loading?: boolean;
}

export interface PieChartProps {
  titleAr: string;
  titleEn: string;
  data: ChartData[];
  loading?: boolean;
}

export interface BarChartProps {
  titleAr: string;
  titleEn: string;
  data: ChartData[];
  loading?: boolean;
}

// Simple Line Chart (CSS-based)
export function LineChart({ titleAr, titleEn, data, loading = false }: LineChartProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const title = isRTL ? titleAr : titleEn;

  if (loading) {
    return (
      <div className="bg-card border-border animate-pulse rounded-xl border p-6">
        <div className="bg-muted mb-4 h-6 w-32 rounded" />
        <div className="bg-muted h-48 rounded" />
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Generate path for line
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,100 L ${points.join(' L ')} L 100,100 Z`;

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="relative h-48">
        <svg viewBox="0 0 100 100" className="size-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}
          {/* Area under line */}
          <path d={areaD} fill="url(#gradient)" opacity="0.3" />
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {/* X-axis labels */}
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 flex justify-between pt-2 text-xs">
          {data
            .filter((_, i) => i % Math.ceil(data.length / 5) === 0)
            .map((d, i) => (
              <span key={i}>{d.date}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

// Simple Pie/Donut Chart (CSS-based)
export function PieChart({ titleAr, titleEn, data, loading = false }: PieChartProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const title = isRTL ? titleAr : titleEn;

  if (loading) {
    return (
      <div className="bg-card border-border animate-pulse rounded-xl border p-6">
        <div className="bg-muted mb-4 h-6 w-32 rounded" />
        <div className="bg-muted mx-auto size-48 rounded-full" />
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const defaultColors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2, 142 76% 36%))',
    'hsl(var(--chart-3, 262 83% 58%))',
    'hsl(var(--chart-4, 25 95% 53%))',
    'hsl(var(--chart-5, 47 96% 53%))',
  ];

  let cumulativePercent = 0;
  const segments = data.map((d, i) => {
    const percent = (d.value / total) * 100;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...d,
      percent,
      startPercent,
      color: d.color || defaultColors[i % defaultColors.length],
    };
  });

  // Build conic gradient
  const gradientStops = segments
    .map(s => `${s.color} ${s.startPercent}% ${s.startPercent + s.percent}%`)
    .join(', ');

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="flex items-center gap-6">
        <div
          className="relative size-40 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${gradientStops})`,
          }}
        >
          {/* Inner circle for donut effect */}
          <div className="bg-card absolute inset-6 flex items-center justify-center rounded-full">
            <span className="text-xl font-bold">{total.toLocaleString(locale)}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-muted-foreground flex-1">{s.label}</span>
              <span className="font-medium">{s.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple Bar Chart (CSS-based)
export function BarChart({ titleAr, titleEn, data, loading = false }: BarChartProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const title = isRTL ? titleAr : titleEn;

  if (loading) {
    return (
      <div className="bg-card border-border animate-pulse rounded-xl border p-6">
        <div className="bg-muted mb-4 h-6 w-32 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-muted h-8 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const defaultColors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2, 142 76% 36%))',
    'hsl(var(--chart-3, 262 83% 58%))',
    'hsl(var(--chart-4, 25 95% 53%))',
    'hsl(var(--chart-5, 47 96% 53%))',
  ];

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        {data.map((d, i) => {
          const percentage = (d.value / maxValue) * 100;
          const color = d.color || defaultColors[i % defaultColors.length];

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium">{d.value.toLocaleString(locale)}</span>
              </div>
              <div className="bg-accent h-2 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Dashboard Charts Grid Component
export interface DashboardChartsProps {
  visitorsData?: { date: string; value: number }[];
  trafficSourcesData?: ChartData[];
  messagesData?: ChartData[];
  devicesData?: ChartData[];
  loading?: boolean;
}

export function DashboardCharts({
  visitorsData,
  trafficSourcesData,
  messagesData,
  devicesData,
  loading = false,
}: DashboardChartsProps) {
  const defaultVisitorsData = [
    { date: '1', value: 120 },
    { date: '5', value: 190 },
    { date: '10', value: 150 },
    { date: '15', value: 280 },
    { date: '20', value: 220 },
    { date: '25', value: 310 },
    { date: '30', value: 290 },
  ];

  const defaultTrafficData: ChartData[] = [
    { label: 'Direct', value: 35 },
    { label: 'Social', value: 25 },
    { label: 'Search', value: 30 },
    { label: 'Referral', value: 10 },
  ];

  const defaultMessagesData: ChartData[] = [
    { label: 'Web Development', value: 45 },
    { label: 'Mobile Apps', value: 30 },
    { label: 'UI/UX Design', value: 15 },
    { label: 'Consulting', value: 10 },
  ];

  const defaultDevicesData: ChartData[] = [
    { label: 'Desktop', value: 55 },
    { label: 'Mobile', value: 35 },
    { label: 'Tablet', value: 10 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <LineChart
        titleAr="الزيارات"
        titleEn="Visitors"
        data={visitorsData || defaultVisitorsData}
        loading={loading}
      />
      <PieChart
        titleAr="مصادر الزيارات"
        titleEn="Traffic Sources"
        data={trafficSourcesData || defaultTrafficData}
        loading={loading}
      />
      <BarChart
        titleAr="الرسائل حسب الخدمة"
        titleEn="Messages by Service"
        data={messagesData || defaultMessagesData}
        loading={loading}
      />
      <PieChart
        titleAr="الأجهزة"
        titleEn="Devices"
        data={devicesData || defaultDevicesData}
        loading={loading}
      />
    </div>
  );
}

export default DashboardCharts;
