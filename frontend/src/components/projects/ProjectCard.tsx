'use client';

/**
 * ProjectCard Component
 * مكون بطاقة المشروع
 */

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

export interface ProjectTechnology {
  name: string;
  icon?: string;
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

export interface ProjectCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Project title */
  title: string;
  /** Short description */
  description: string;
  /** URL slug for the project detail page */
  slug: string;
  /** Thumbnail image URL */
  thumbnail: string;
  /** Technologies used */
  technologies?: ProjectTechnology[];
  /** Category name for display */
  category?: string;
  /** Live project URL */
  liveUrl?: string;
  /** View count */
  views?: number;
  /** Is featured project */
  isFeatured?: boolean;
  /** Card variant */
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  /** Whether to show the arrow link */
  showArrow?: boolean;
  /** Completion date */
  completedAt?: string;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      className,
      title,
      description,
      slug,
      thumbnail,
      technologies = [],
      category,
      liveUrl,
      views,
      isFeatured = false,
      variant = 'default',
      showArrow = true,
      completedAt,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

    // Format date if provided
    const formattedDate = completedAt
      ? new Date(completedAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'short',
        })
      : null;

    // Default variant - Grid card
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          className={cn(
            'group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-xl',
            'dark:bg-gray-800',
            className
          )}
          {...props}
        >
          {/* Image Container */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Link
                href={`/${locale}/projects/${slug}`}
                className="flex size-12 items-center justify-center rounded-full bg-white text-gray-900 transition-transform hover:scale-110"
              >
                <EyeIcon className="size-5" />
              </Link>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-500 flex size-12 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                >
                  <ArrowTopRightOnSquareIcon className="size-5" />
                </a>
              )}
            </div>

            {/* Featured badge */}
            {isFeatured && (
              <div className="bg-primary-500 absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'مميز' : 'Featured'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category */}
            {category && (
              <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {category}
              </span>
            )}

            {/* Title */}
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{title}</h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tech.name}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              {showArrow && (
                <Link
                  href={`/${locale}/projects/${slug}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <span>{isRTL ? 'عرض المشروع' : 'View Project'}</span>
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              )}

              {views !== undefined && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <EyeIcon className="size-4" />
                  {views}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Featured variant - Large card
    if (variant === 'featured') {
      return (
        <div
          ref={ref}
          className={cn(
            'group relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl',
            className
          )}
          {...props}
        >
          {/* Background Image */}
          <div className="relative h-96 w-full md:h-[500px]">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            {/* Category */}
            {category && (
              <span className="bg-primary-500 mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
                {category}
              </span>
            )}

            {/* Title */}
            <h3 className="mb-3 text-2xl font-bold text-white md:text-4xl">{title}</h3>

            {/* Description */}
            <p className="mb-6 max-w-2xl text-gray-300 md:text-lg">{description}</p>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {technologies.slice(0, 6).map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/projects/${slug}`}
                className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors"
              >
                <span>{isRTL ? 'تفاصيل المشروع' : 'View Details'}</span>
                <ArrowIcon className="size-4" />
              </Link>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  <span>{isRTL ? 'معاينة حية' : 'Live Preview'}</span>
                  <ArrowTopRightOnSquareIcon className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Compact variant - Small card for sidebar/lists
    if (variant === 'compact') {
      return (
        <Link
          href={`/${locale}/projects/${slug}`}
          className={cn(
            'group flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm transition-all duration-300',
            'hover:bg-gray-50 hover:shadow-md',
            'dark:hover:bg-gray-750 dark:bg-gray-800',
            className
          )}
        >
          {/* Thumbnail */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image src={thumbnail} alt={title} fill className="object-cover" sizes="64px" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">{category}</p>
          </div>

          {/* Arrow */}
          {showArrow && (
            <ArrowIcon className="size-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          )}
        </Link>
      );
    }

    // Horizontal variant - Full width card
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
          <div className="relative h-56 w-full md:h-auto md:w-2/5">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            {isFeatured && (
              <div className="bg-primary-500 absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'مميز' : 'Featured'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-6">
            {/* Category & Date */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              {category && (
                <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full px-3 py-1 text-xs font-medium">
                  {category}
                </span>
              )}
              {formattedDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">{description}</p>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {technologies.slice(0, 5).map((tech, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/projects/${slug}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 font-medium transition-colors"
              >
                <span>{isRTL ? 'عرض المشروع' : 'View Project'}</span>
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowTopRightOnSquareIcon className="size-4" />
                  <span>{isRTL ? 'معاينة' : 'Preview'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

ProjectCard.displayName = 'ProjectCard';

export { ProjectCard };
export default ProjectCard;
