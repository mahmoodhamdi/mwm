'use client';

/**
 * Spinner Component
 * مكون مؤشر التحميل
 */

import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colors = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-secondary-600 dark:text-secondary-400',
  white: 'text-white',
  gray: 'text-gray-600 dark:text-gray-400',
};

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', sizes[size], colors[color], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Full Page Spinner
 * مؤشر تحميل الصفحة الكاملة
 */
export function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
}

/**
 * Inline Spinner with Text
 * مؤشر تحميل مع نص
 */
export interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = 'Loading...', size = 'md' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner size={size} />
      <span className="text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
}

export default Spinner;
