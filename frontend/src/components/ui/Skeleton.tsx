'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading placeholder component
 * مكون الهيكل العظمي للتحميل
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...props}
    />
  );
}

/**
 * Card skeleton for loading states
 * هيكل البطاقة للتحميل
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-white p-4 dark:bg-gray-800', className)}>
      <Skeleton variant="rounded" className="mb-4 h-48 w-full" />
      <Skeleton variant="text" className="mb-2 h-6 w-3/4" />
      <Skeleton variant="text" className="mb-4 h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-1/2" />
    </div>
  );
}

/**
 * Table row skeleton
 * هيكل صف الجدول
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * List item skeleton
 * هيكل عنصر القائمة
 */
export function ListItemSkeleton({ hasAvatar = true }: { hasAvatar?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3">
      {hasAvatar && <Skeleton variant="circular" className="size-10" />}
      <div className="flex-1">
        <Skeleton variant="text" className="mb-1 h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Stats card skeleton
 * هيكل بطاقة الإحصائيات
 */
export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="circular" className="size-8" />
      </div>
      <Skeleton variant="text" className="mt-3 h-8 w-32" />
      <Skeleton variant="text" className="mt-2 h-3 w-20" />
    </div>
  );
}

/**
 * Page skeleton for full page loading
 * هيكل الصفحة للتحميل الكامل
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" className="mb-2 h-8 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
        <Skeleton variant="rounded" className="h-10 w-32" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
