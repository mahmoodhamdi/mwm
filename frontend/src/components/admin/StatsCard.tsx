/**
 * Stats Card Component
 * مكون بطاقة الإحصائيات
 */

'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  titleAr: string;
  titleEn: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    labelAr?: string;
    labelEn?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'bg-primary/10 border border-primary/20',
  success: 'bg-green-500/10 border border-green-500/20',
  warning: 'bg-yellow-500/10 border border-yellow-500/20',
  danger: 'bg-red-500/10 border border-red-500/20',
};

const iconVariantStyles = {
  default: 'bg-accent text-accent-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-green-500/20 text-green-600',
  warning: 'bg-yellow-500/20 text-yellow-600',
  danger: 'bg-red-500/20 text-red-600',
};

export function StatsCard({
  titleAr,
  titleEn,
  value,
  icon,
  trend,
  variant = 'default',
  loading = false,
}: StatsCardProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const title = isRTL ? titleAr : titleEn;

  if (loading) {
    return (
      <div className={`rounded-xl p-6 ${variantStyles[variant]} animate-pulse`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="bg-muted h-4 w-24 rounded" />
            <div className="bg-muted h-8 w-16 rounded" />
            <div className="bg-muted h-3 w-32 rounded" />
          </div>
          <div className="bg-muted size-12 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${variantStyles[variant]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">
            {typeof value === 'number' ? value.toLocaleString(locale) : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              {trend.value === 0 ? (
                <Minus className="text-muted-foreground size-4" />
              ) : (trend.isPositive ?? trend.value > 0) ? (
                <TrendingUp className="size-4 text-green-600" />
              ) : (
                <TrendingDown className="size-4 text-red-600" />
              )}
              <span
                className={
                  trend.value === 0
                    ? 'text-muted-foreground'
                    : (trend.isPositive ?? trend.value > 0)
                      ? 'text-green-600'
                      : 'text-red-600'
                }
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">
                {isRTL ? trend.labelAr || 'من الشهر الماضي' : trend.labelEn || 'from last month'}
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-xl p-3 ${iconVariantStyles[variant]}`}>{icon}</div>
      </div>
    </div>
  );
}

export default StatsCard;
