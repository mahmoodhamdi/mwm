'use client';

/**
 * SkillsChart Component
 * مكون رسم بياني للمهارات
 */

import { forwardRef, HTMLAttributes } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export interface SkillData {
  name: string;
  level: number; // 1-100
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'other';
}

export interface SkillsChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of skills */
  skills: SkillData[];
  /** Display variant */
  variant?: 'bars' | 'radial' | 'grouped' | 'compact';
  /** Whether to show category headers in grouped variant */
  showCategories?: boolean;
  /** Maximum number of skills to show (0 for all) */
  maxItems?: number;
  /** Whether to animate bars */
  animated?: boolean;
}

// Category labels
const categoryLabels: Record<string, { ar: string; en: string }> = {
  technical: { ar: 'المهارات التقنية', en: 'Technical Skills' },
  soft: { ar: 'المهارات الشخصية', en: 'Soft Skills' },
  language: { ar: 'اللغات', en: 'Languages' },
  tool: { ar: 'الأدوات', en: 'Tools' },
  other: { ar: 'أخرى', en: 'Other' },
};

// Category colors
const categoryColors: Record<string, { bg: string; fill: string }> = {
  technical: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    fill: 'bg-blue-500',
  },
  soft: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    fill: 'bg-green-500',
  },
  language: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    fill: 'bg-purple-500',
  },
  tool: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    fill: 'bg-orange-500',
  },
  other: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    fill: 'bg-gray-500',
  },
};

const SkillsChart = forwardRef<HTMLDivElement, SkillsChartProps>(
  (
    {
      className,
      skills,
      variant = 'bars',
      showCategories = true,
      maxItems = 0,
      animated = true,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Limit skills if maxItems is set
    const displaySkills = maxItems > 0 ? skills.slice(0, maxItems) : skills;
    const remainingCount = maxItems > 0 ? Math.max(0, skills.length - maxItems) : 0;

    // Group skills by category
    const groupedSkills = displaySkills.reduce(
      (acc, skill) => {
        const category = skill.category || 'other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, SkillData[]>
    );

    // Category order
    const categoryOrder = ['technical', 'soft', 'language', 'tool', 'other'];

    // Get level label
    const getLevelLabel = (level: number) => {
      if (level >= 90) return isRTL ? 'خبير' : 'Expert';
      if (level >= 70) return isRTL ? 'متقدم' : 'Advanced';
      if (level >= 50) return isRTL ? 'متوسط' : 'Intermediate';
      if (level >= 30) return isRTL ? 'مبتدئ' : 'Beginner';
      return isRTL ? 'أساسي' : 'Basic';
    };

    // Bars variant - Simple horizontal bars
    if (variant === 'bars') {
      return (
        <div ref={ref} className={cn('space-y-4', className)} {...props}>
          {displaySkills.map((skill, index) => {
            const category = skill.category || 'other';
            const colors = categoryColors[category];

            return (
              <div key={index}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}%</span>
                </div>
                <div className={cn('h-2 w-full rounded-full', colors.bg)}>
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', colors.fill)}
                    style={{
                      width: animated ? `${skill.level}%` : '0%',
                      animation: animated
                        ? `growWidth 1s ease-out ${index * 0.1}s forwards`
                        : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              +{remainingCount} {isRTL ? 'مهارات أخرى' : 'more skills'}
            </div>
          )}
          <style jsx>{`
            @keyframes growWidth {
              from {
                width: 0%;
              }
            }
          `}</style>
        </div>
      );
    }

    // Radial variant - Circular progress indicators
    if (variant === 'radial') {
      const size = 80;
      const strokeWidth = 6;
      const radius = (size - strokeWidth) / 2;
      const circumference = radius * 2 * Math.PI;

      return (
        <div ref={ref} className={cn('flex flex-wrap justify-center gap-6', className)} {...props}>
          {displaySkills.map((skill, index) => {
            const category = skill.category || 'other';
            const offset = circumference - (skill.level / 100) * circumference;

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative" style={{ width: size, height: size }}>
                  {/* Background circle */}
                  <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={animated ? offset : circumference}
                      className={cn(
                        'transition-all duration-1000',
                        category === 'technical' && 'text-blue-500',
                        category === 'soft' && 'text-green-500',
                        category === 'language' && 'text-purple-500',
                        category === 'tool' && 'text-orange-500',
                        category === 'other' && 'text-gray-500'
                      )}
                      style={{
                        stroke: 'currentColor',
                        animation: animated
                          ? `drawCircle 1s ease-out ${index * 0.15}s forwards`
                          : 'none',
                      }}
                    />
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {skill.level}%
                    </span>
                  </div>
                </div>
                <span className="max-w-[80px] text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              +{remainingCount}
            </div>
          )}
          <style jsx>{`
            @keyframes drawCircle {
              from {
                stroke-dashoffset: ${circumference};
              }
            }
          `}</style>
        </div>
      );
    }

    // Grouped variant - Organized by category
    if (variant === 'grouped') {
      return (
        <div ref={ref} className={cn('space-y-8', className)} {...props}>
          {categoryOrder.map(category => {
            const skills = groupedSkills[category];
            if (!skills || skills.length === 0) return null;
            const colors = categoryColors[category];

            return (
              <div key={category}>
                {showCategories && (
                  <h4 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {categoryLabels[category][isRTL ? 'ar' : 'en']}
                  </h4>
                )}
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getLevelLabel(skill.level)}
                        </span>
                      </div>
                      <div className={cn('h-2 w-full rounded-full', colors.bg)}>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            colors.fill
                          )}
                          style={{ width: animated ? `${skill.level}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Compact variant - Small pills with visual level indicator
    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
          {displaySkills.map((skill, index) => {
            const category = skill.category || 'other';
            const colors = categoryColors[category];
            const dots = Math.ceil(skill.level / 20); // 1-5 dots

            return (
              <div
                key={index}
                className={cn('flex items-center gap-2 rounded-full px-3 py-1.5', colors.bg)}
              >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'size-1.5 rounded-full',
                        i < dots ? colors.fill : 'bg-gray-300 dark:bg-gray-600'
                      )}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className="flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              +{remainingCount}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);

SkillsChart.displayName = 'SkillsChart';

export { SkillsChart };
export default SkillsChart;
