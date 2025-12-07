'use client';

/**
 * TeamCard Component
 * مكون بطاقة عضو الفريق
 */

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export interface TeamMemberSocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  email?: string;
}

export interface TeamMemberSkill {
  name: string;
  level: number;
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'other';
}

export interface TeamCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Member name */
  name: string;
  /** URL slug for the member profile page */
  slug: string;
  /** Position/title */
  position: string;
  /** Short bio */
  shortBio?: string;
  /** Avatar image URL */
  avatar: string;
  /** Department name */
  department?: string;
  /** Social media links */
  socialLinks?: TeamMemberSocialLinks;
  /** Skills */
  skills?: TeamMemberSkill[];
  /** Is team leader */
  isLeader?: boolean;
  /** Is featured member */
  isFeatured?: boolean;
  /** Card variant */
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  /** Whether to show the arrow link */
  showArrow?: boolean;
}

const TeamCard = forwardRef<HTMLDivElement, TeamCardProps>(
  (
    {
      className,
      name,
      slug,
      position,
      shortBio,
      avatar,
      department,
      socialLinks,
      skills = [],
      isLeader = false,
      isFeatured = false,
      variant = 'default',
      showArrow = true,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

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
          {/* Avatar Container */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-white text-gray-900 transition-transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-white text-gray-900 transition-transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-white text-gray-900 transition-transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {socialLinks?.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex size-10 items-center justify-center rounded-full bg-white text-gray-900 transition-transform hover:scale-110"
                  aria-label="Email"
                >
                  <EnvelopeIcon className="size-5" />
                </a>
              )}
            </div>

            {/* Leader badge */}
            {isLeader && (
              <div className="bg-primary-500 absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'قائد' : 'Leader'}
              </div>
            )}

            {/* Featured badge */}
            {isFeatured && !isLeader && (
              <div className="absolute start-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'مميز' : 'Featured'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 text-center">
            {/* Department */}
            {department && (
              <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {department}
              </span>
            )}

            {/* Name */}
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{name}</h3>

            {/* Position */}
            <p className="text-primary-600 dark:text-primary-400 mb-3 text-sm font-medium">
              {position}
            </p>

            {/* Short Bio */}
            {shortBio && (
              <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {shortBio}
              </p>
            )}

            {/* Skills preview */}
            {skills.length > 0 && (
              <div className="mb-4 flex flex-wrap justify-center gap-1">
                {skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {skill.name}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    +{skills.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* View Profile Link */}
            {showArrow && (
              <Link
                href={`/${locale}/team/${slug}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <span>{isRTL ? 'عرض الملف الشخصي' : 'View Profile'}</span>
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            )}
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
          <div className="flex flex-col md:flex-row">
            {/* Avatar */}
            <div className="relative h-64 w-full md:h-auto md:w-2/5">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
              {/* Department */}
              {department && (
                <span className="bg-primary-500 mb-4 inline-block w-fit rounded-full px-4 py-1.5 text-sm font-medium text-white">
                  {department}
                </span>
              )}

              {/* Name */}
              <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">{name}</h3>

              {/* Position */}
              <p className="text-primary-400 mb-4 text-lg font-medium">{position}</p>

              {/* Bio */}
              {shortBio && <p className="mb-6 text-gray-300">{shortBio}</p>}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/team/${slug}`}
                  className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors"
                >
                  <span>{isRTL ? 'عرض الملف الشخصي' : 'View Profile'}</span>
                  <ArrowIcon className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Compact variant - Small card
    if (variant === 'compact') {
      return (
        <Link
          href={`/${locale}/team/${slug}`}
          className={cn(
            'group flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm transition-all duration-300',
            'hover:bg-gray-50 hover:shadow-md',
            'dark:hover:bg-gray-750 dark:bg-gray-800',
            className
          )}
        >
          {/* Avatar */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
            <Image src={avatar} alt={name} fill className="object-cover" sizes="64px" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">{name}</h4>
            <p className="text-primary-600 dark:text-primary-400 line-clamp-1 text-sm">
              {position}
            </p>
            {department && (
              <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{department}</p>
            )}
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
          {/* Avatar */}
          <div className="relative h-48 w-full md:h-auto md:w-1/4">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {isLeader && (
              <div className="bg-primary-500 absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'قائد' : 'Leader'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-6">
            {/* Department */}
            {department && (
              <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium">
                {department}
              </span>
            )}

            {/* Name */}
            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">{name}</h3>

            {/* Position */}
            <p className="text-primary-600 dark:text-primary-400 mb-3 font-medium">{position}</p>

            {/* Bio */}
            {shortBio && (
              <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">{shortBio}</p>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/team/${slug}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-2 font-medium transition-colors"
              >
                <span>{isRTL ? 'عرض الملف الشخصي' : 'View Profile'}</span>
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

TeamCard.displayName = 'TeamCard';

export { TeamCard };
export default TeamCard;
