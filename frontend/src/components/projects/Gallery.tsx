'use client';

/**
 * Gallery Component
 * مكون معرض الصور
 */

import { forwardRef, HTMLAttributes, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface GalleryProps extends HTMLAttributes<HTMLDivElement> {
  /** Gallery images */
  images: (string | GalleryImage)[];
  /** Gallery variant */
  variant?: 'grid' | 'carousel' | 'masonry';
  /** Number of columns for grid variant */
  columns?: 2 | 3 | 4;
  /** Whether to enable lightbox */
  lightbox?: boolean;
  /** Gap between images */
  gap?: 'sm' | 'md' | 'lg';
  /** Whether to show image captions */
  showCaptions?: boolean;
  /** Aspect ratio for grid images */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

const Gallery = forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      className,
      images,
      variant = 'grid',
      columns = 3,
      lightbox = true,
      gap = 'md',
      showCaptions = false,
      aspectRatio = 'video',
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Normalize images to GalleryImage format
    const normalizedImages: GalleryImage[] = images.map(img =>
      typeof img === 'string' ? { src: img, alt: '' } : img
    );

    // Navigation functions
    const openLightbox = (index: number) => {
      if (lightbox) {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
      }
    };

    const closeLightbox = useCallback(() => {
      setSelectedIndex(null);
      document.body.style.overflow = '';
    }, []);

    const goNext = useCallback(() => {
      setSelectedIndex(prev => (prev !== null ? (prev + 1) % normalizedImages.length : 0));
    }, [normalizedImages.length]);

    const goPrev = useCallback(() => {
      setSelectedIndex(prev =>
        prev !== null ? (prev - 1 + normalizedImages.length) % normalizedImages.length : 0
      );
    }, [normalizedImages.length]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (selectedIndex === null) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') isRTL ? goPrev() : goNext();
        if (e.key === 'ArrowLeft') isRTL ? goNext() : goPrev();
      },
      [selectedIndex, closeLightbox, goNext, goPrev, isRTL]
    );

    // Gap classes
    const gapClasses: Record<string, string> = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    // Column classes
    const gridCols: Record<number, string> = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    };

    // Aspect ratio classes
    const aspectClasses: Record<string, string> = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      auto: '',
    };

    // Lightbox component
    const Lightbox = () => {
      if (selectedIndex === null) return null;

      const currentImage = normalizedImages[selectedIndex];

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label={isRTL ? 'معرض الصور' : 'Image gallery'}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute end-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label={isRTL ? 'إغلاق' : 'Close'}
            >
              <XMarkIcon className="size-6" />
            </button>

            {/* Navigation buttons */}
            {normalizedImages.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    isRTL ? goNext() : goPrev();
                  }}
                  className="absolute start-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label={isRTL ? 'السابق' : 'Previous'}
                >
                  <ChevronLeftIcon className="size-6" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    isRTL ? goPrev() : goNext();
                  }}
                  className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label={isRTL ? 'التالي' : 'Next'}
                >
                  <ChevronRightIcon className="size-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt || ''}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
                priority
              />
            </motion.div>

            {/* Caption & Counter */}
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
              {currentImage.caption && (
                <p className="max-w-2xl text-center text-white">{currentImage.caption}</p>
              )}
              <span className="text-sm text-white/60">
                {selectedIndex + 1} / {normalizedImages.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    };

    // Grid variant
    if (variant === 'grid') {
      return (
        <>
          <div
            ref={ref}
            className={cn('grid', gridCols[columns], gapClasses[gap], className)}
            {...props}
          >
            {normalizedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={cn(
                  'group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
                  aspectClasses[aspectRatio],
                  lightbox && 'cursor-pointer'
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt || ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${Math.floor(100 / columns)}vw`}
                />

                {/* Hover overlay */}
                {lightbox && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowsPointingOutIcon className="size-8 text-white" />
                  </div>
                )}

                {/* Caption */}
                {showCaptions && image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-sm text-white">{image.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedIndex !== null && <Lightbox />}
        </>
      );
    }

    // Carousel variant
    if (variant === 'carousel') {
      return (
        <>
          <div ref={ref} className={cn('relative w-full', className)} {...props}>
            {/* Main image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative size-full"
                >
                  <Image
                    src={normalizedImages[currentSlide].src}
                    alt={normalizedImages[currentSlide].alt || ''}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {normalizedImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        prev => (prev - 1 + normalizedImages.length) % normalizedImages.length
                      )
                    }
                    className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                    aria-label={isRTL ? 'السابق' : 'Previous'}
                  >
                    <ChevronLeftIcon className="size-5 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % normalizedImages.length)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                    aria-label={isRTL ? 'التالي' : 'Next'}
                  >
                    <ChevronRightIcon className="size-5 text-gray-900 dark:text-white" />
                  </button>
                </>
              )}

              {/* Lightbox button */}
              {lightbox && (
                <button
                  onClick={() => openLightbox(currentSlide)}
                  className="absolute end-4 top-4 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                  aria-label={isRTL ? 'تكبير' : 'Expand'}
                >
                  <ArrowsPointingOutIcon className="size-5 text-gray-900 dark:text-white" />
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className={cn('mt-4 flex overflow-x-auto', gapClasses[gap])}>
              {normalizedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    'relative size-16 shrink-0 overflow-hidden rounded-lg transition-all sm:size-20',
                    index === currentSlide
                      ? 'ring-primary-500 ring-2 ring-offset-2'
                      : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || ''}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {selectedIndex !== null && <Lightbox />}
        </>
      );
    }

    // Masonry variant
    if (variant === 'masonry') {
      const masonryCols: Record<number, string> = {
        2: 'columns-1 sm:columns-2',
        3: 'columns-1 sm:columns-2 lg:columns-3',
        4: 'columns-2 sm:columns-3 lg:columns-4',
      };

      return (
        <>
          <div
            ref={ref}
            className={cn(masonryCols[columns], gapClasses[gap], className)}
            {...props}
          >
            {normalizedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={cn(
                  'group relative mb-4 block w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
                  lightbox && 'cursor-pointer'
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt || ''}
                  width={600}
                  height={400}
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${Math.floor(100 / columns)}vw`}
                />

                {/* Hover overlay */}
                {lightbox && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowsPointingOutIcon className="size-8 text-white" />
                  </div>
                )}

                {/* Caption */}
                {showCaptions && image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-sm text-white">{image.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedIndex !== null && <Lightbox />}
        </>
      );
    }

    return null;
  }
);

Gallery.displayName = 'Gallery';

export { Gallery };
export default Gallery;
