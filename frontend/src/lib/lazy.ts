/**
 * Lazy Loading Utilities
 * أدوات التحميل الكسول
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';

type LoadingComponent = (props: DynamicOptionsLoadingProps) => React.ReactElement | null;

/**
 * Create a lazy-loaded component with optional loading state
 * إنشاء مكون محمل بشكل كسول مع حالة تحميل اختيارية
 */
export function lazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: LoadingComponent;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading,
    ssr: options?.ssr ?? true,
  });
}

/**
 * Lazy load heavy components without SSR
 * تحميل المكونات الثقيلة بشكل كسول بدون SSR
 */
export function lazyClientOnly<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  loading?: LoadingComponent
) {
  return dynamic(importFn, {
    loading,
    ssr: false,
  });
}

/**
 * Intersection Observer based lazy loading hook
 * خطاف التحميل الكسول المعتمد على مراقب التقاطع
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    root: options?.root ?? null,
    rootMargin: options?.rootMargin ?? '100px',
    threshold: options?.threshold ?? 0,
  });
}

/**
 * Preload an image
 * تحميل صورة مسبقاً
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 * تحميل صور متعددة مسبقاً
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Debounce function for performance
 * دالة تأخير للأداء
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Throttle function for performance
 * دالة التحكم في المعدل للأداء
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request idle callback with fallback
 * طلب رد الاتصال الخامل مع البديل
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for Safari and older browsers
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 50,
    });
  }, 1) as unknown as number;
}

/**
 * Cancel idle callback
 * إلغاء رد الاتصال الخامل
 */
export function cancelIdleCallback(handle: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
}

/**
 * Measure component render time (development only)
 * قياس وقت عرض المكون (للتطوير فقط)
 */
export function measureRenderTime(componentName: string): () => void {
  if (process.env.NODE_ENV !== 'development') {
    return () => {};
  }

  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    // eslint-disable-next-line no-console
    console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
  };
}
