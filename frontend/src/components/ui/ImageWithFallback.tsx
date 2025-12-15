'use client';

import React, { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallback?: string;
  fallbackAlt?: string;
}

/**
 * Next.js Image with error handling and fallback support
 * صورة Next.js مع معالجة الأخطاء ودعم الصورة البديلة
 */
export function ImageWithFallback({
  src,
  alt,
  fallback = '/images/placeholder.jpg',
  fallbackAlt,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <Image
      src={hasError ? fallback : src}
      alt={hasError && fallbackAlt ? fallbackAlt : alt}
      onError={handleError}
      {...props}
    />
  );
}

export default ImageWithFallback;
