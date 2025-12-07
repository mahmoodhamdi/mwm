'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
}

/**
 * Lazy loaded image with skeleton and error fallback
 * صورة محملة بشكل كسول مع هيكل عظمي ومعالجة الأخطاء
 */
export function LazyImage({
  src,
  alt,
  className,
  fallback = '/images/placeholder.jpg',
  showSkeleton = true,
  skeletonClassName,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const imageSrc = hasError ? fallback : src;

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <Skeleton
          variant="rectangular"
          className={cn('absolute inset-0 z-10', skeletonClassName)}
        />
      )}

      {/* Only render image when in viewport */}
      {isIntersecting && (
        <Image
          src={imageSrc}
          alt={alt}
          className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Background lazy image for hero sections
 * صورة خلفية محملة بشكل كسول للأقسام الرئيسية
 */
export function LazyBackgroundImage({
  src,
  className,
  children,
  fallback = '/images/placeholder.jpg',
}: {
  src: string;
  className?: string;
  children?: React.ReactNode;
  fallback?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const imageSrc = hasError ? fallback : src;

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{
        backgroundImage: isIntersecting && !isLoading ? `url(${imageSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Hidden image to trigger load event */}
      {isIntersecting && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="hidden" onLoad={handleLoad} onError={handleError} />
      )}

      {/* Skeleton while loading */}
      {isLoading && <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default LazyImage;
