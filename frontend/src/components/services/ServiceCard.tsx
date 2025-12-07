'use client';

/**
 * ServiceCard Component
 * مكون بطاقة الخدمة
 */

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  ServerStackIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

// Icon mapping for services
const serviceIcons: Record<string, React.ElementType> = {
  code: CodeBracketIcon,
  mobile: DevicePhoneMobileIcon,
  design: PaintBrushIcon,
  server: ServerStackIcon,
  analytics: ChartBarIcon,
  support: WrenchScrewdriverIcon,
};

export interface ServiceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Service title */
  title: string;
  /** Short description */
  description: string;
  /** URL slug for the service detail page */
  slug: string;
  /** Icon key or custom icon name */
  icon?: string;
  /** Custom image URL */
  image?: string;
  /** Card variant */
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  /** Whether to show the arrow link */
  showArrow?: boolean;
  /** Category name for display */
  category?: string;
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      className,
      title,
      description,
      slug,
      icon = 'code',
      image,
      variant = 'default',
      showArrow = true,
      category,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;
    const IconComponent = serviceIcons[icon] || CodeBracketIcon;

    // Default variant
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          className={cn(
            'group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-xl',
            'dark:bg-gray-800',
            className
          )}
          {...props}
        >
          {/* Icon */}
          <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex rounded-xl p-3">
            <IconComponent className="size-6" />
          </div>

          {/* Category badge */}
          {category && (
            <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {category}
            </span>
          )}

          {/* Title */}
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">{description}</p>

          {/* Link */}
          {showArrow && (
            <Link
              href={`/${locale}/services/${slug}`}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 font-medium transition-colors"
            >
              <span>{isRTL ? 'اعرف المزيد' : 'Learn more'}</span>
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          )}

          {/* Hover gradient overlay */}
          <div className="from-primary-500 to-primary-600 absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100" />
        </div>
      );
    }

    // Featured variant
    if (variant === 'featured') {
      return (
        <div
          ref={ref}
          className={cn(
            'from-primary-600 to-primary-700 group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-white shadow-lg transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-2xl',
            className
          )}
          {...props}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white" />
            <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-white" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-6 inline-flex rounded-2xl bg-white/20 p-4">
              <IconComponent className="size-8" />
            </div>

            {/* Title */}
            <h3 className="mb-3 text-2xl font-bold">{title}</h3>

            {/* Description */}
            <p className="mb-6 line-clamp-3 text-white/90">{description}</p>

            {/* Link */}
            {showArrow && (
              <Link
                href={`/${locale}/services/${slug}`}
                className="text-primary-600 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium transition-all hover:bg-white/90"
              >
                <span>{isRTL ? 'اعرف المزيد' : 'Learn more'}</span>
                <ArrowIcon className="size-4" />
              </Link>
            )}
          </div>
        </div>
      );
    }

    // Compact variant
    if (variant === 'compact') {
      return (
        <Link
          href={`/${locale}/services/${slug}`}
          className={cn(
            'group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300',
            'hover:bg-gray-50 hover:shadow-md',
            'dark:hover:bg-gray-750 dark:bg-gray-800',
            className
          )}
        >
          {/* Icon */}
          <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shrink-0 rounded-lg p-2.5">
            <IconComponent className="size-5" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>

          {/* Arrow */}
          {showArrow && (
            <ArrowIcon className="size-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          )}
        </Link>
      );
    }

    // Horizontal variant
    if (variant === 'horizontal') {
      return (
        <div
          ref={ref}
          className={cn(
            'group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 md:flex-row',
            'hover:-translate-y-1 hover:shadow-xl',
            'dark:bg-gray-800',
            className
          )}
          {...props}
        >
          {/* Image */}
          {image && (
            <div className="relative h-48 w-full md:h-auto md:w-2/5">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-6">
            {/* Category */}
            {category && (
              <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium">
                {category}
              </span>
            )}

            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">{description}</p>

            {/* Link */}
            {showArrow && (
              <Link
                href={`/${locale}/services/${slug}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 font-medium transition-colors"
              >
                <span>{isRTL ? 'اعرف المزيد' : 'Learn more'}</span>
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      );
    }

    return null;
  }
);

ServiceCard.displayName = 'ServiceCard';

export { ServiceCard };
export default ServiceCard;
