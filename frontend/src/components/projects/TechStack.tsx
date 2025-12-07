'use client';

/**
 * TechStack Component
 * مكون مكدس التقنيات
 */

import { forwardRef, HTMLAttributes } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { ProjectTechnology } from './ProjectCard';

export interface TechStackProps extends HTMLAttributes<HTMLDivElement> {
  /** Technologies array */
  technologies: ProjectTechnology[];
  /** Display variant */
  variant?: 'default' | 'grouped' | 'compact' | 'badges';
  /** Whether to show category headers in grouped variant */
  showCategories?: boolean;
  /** Maximum number of technologies to show (0 for all) */
  maxItems?: number;
}

// Category labels
const categoryLabels: Record<string, { ar: string; en: string }> = {
  frontend: { ar: 'الواجهة الأمامية', en: 'Frontend' },
  backend: { ar: 'الواجهة الخلفية', en: 'Backend' },
  database: { ar: 'قواعد البيانات', en: 'Database' },
  devops: { ar: 'البنية التحتية', en: 'DevOps' },
  mobile: { ar: 'تطبيقات الجوال', en: 'Mobile' },
  other: { ar: 'أخرى', en: 'Other' },
};

// Category colors
const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  backend: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  database: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  devops: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  mobile: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const TechStack = forwardRef<HTMLDivElement, TechStackProps>(
  (
    { className, technologies, variant = 'default', showCategories = true, maxItems = 0, ...props },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Limit technologies if maxItems is set
    const displayTechnologies = maxItems > 0 ? technologies.slice(0, maxItems) : technologies;
    const remainingCount = maxItems > 0 ? Math.max(0, technologies.length - maxItems) : 0;

    // Group technologies by category
    const groupedTechnologies = displayTechnologies.reduce(
      (acc, tech) => {
        const category = tech.category || 'other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(tech);
        return acc;
      },
      {} as Record<string, ProjectTechnology[]>
    );

    // Category order
    const categoryOrder = ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'];

    // Default variant - Simple list
    if (variant === 'default') {
      return (
        <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
          {displayTechnologies.map((tech, index) => (
            <div
              key={index}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-2',
                categoryColors[tech.category || 'other']
              )}
            >
              {tech.icon && <span className="text-lg">{tech.icon}</span>}
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              +{remainingCount} {isRTL ? 'أخرى' : 'more'}
            </div>
          )}
        </div>
      );
    }

    // Grouped variant - Organized by category
    if (variant === 'grouped') {
      return (
        <div ref={ref} className={cn('space-y-6', className)} {...props}>
          {categoryOrder.map(category => {
            const techs = groupedTechnologies[category];
            if (!techs || techs.length === 0) return null;

            return (
              <div key={category}>
                {showCategories && (
                  <h4 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {categoryLabels[category][isRTL ? 'ar' : 'en']}
                  </h4>
                )}
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech, index) => (
                    <div
                      key={index}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg px-3 py-2',
                        categoryColors[category]
                      )}
                    >
                      {tech.icon && <span className="text-lg">{tech.icon}</span>}
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Compact variant - Small pills
    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('flex flex-wrap gap-1.5', className)} {...props}>
          {displayTechnologies.map((tech, index) => (
            <span
              key={index}
              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tech.name}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              +{remainingCount}
            </span>
          )}
        </div>
      );
    }

    // Badges variant - Larger badges with icons
    if (variant === 'badges') {
      return (
        <div ref={ref} className={cn('flex flex-wrap gap-3', className)} {...props}>
          {displayTechnologies.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
            >
              {tech.icon ? (
                <span className="text-2xl">{tech.icon}</span>
              ) : (
                <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    {tech.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {tech.name}
              </span>
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
              <span className="text-lg font-bold text-gray-400">+{remainingCount}</span>
              <span className="text-xs text-gray-400">{isRTL ? 'أخرى' : 'more'}</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);

TechStack.displayName = 'TechStack';

export { TechStack };
export default TechStack;
