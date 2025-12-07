'use client';

/**
 * TeamGrid Component
 * مكون شبكة الفريق
 */

import { forwardRef, HTMLAttributes, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TeamCard, TeamCardProps } from './TeamCard';

export interface TeamMemberData {
  id: string;
  name: string;
  slug: string;
  position: string;
  shortBio?: string;
  avatar: string;
  department?: {
    id: string;
    name: string;
    slug: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    email?: string;
  };
  skills?: Array<{
    name: string;
    level: number;
    category?: 'technical' | 'soft' | 'language' | 'tool' | 'other';
  }>;
  isLeader?: boolean;
  isFeatured?: boolean;
}

export interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}

export interface TeamGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of team members */
  members: TeamMemberData[];
  /** Available departments for filtering */
  departments?: DepartmentData[];
  /** Grid variant */
  variant?: 'grid' | 'masonry' | 'list';
  /** Number of columns (for grid variant) */
  columns?: 2 | 3 | 4;
  /** Whether to show department filter */
  showFilter?: boolean;
  /** Whether to animate items */
  animated?: boolean;
  /** Card variant to use */
  cardVariant?: TeamCardProps['variant'];
  /** Empty state message */
  emptyMessage?: string;
}

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const TeamGrid = forwardRef<HTMLDivElement, TeamGridProps>(
  (
    {
      className,
      members,
      departments = [],
      variant = 'grid',
      columns = 3,
      showFilter = false,
      animated = true,
      cardVariant = 'default',
      emptyMessage,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    // Filter members by department
    const filteredMembers = selectedDepartment
      ? members.filter(member => member.department?.id === selectedDepartment)
      : members;

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    // Render empty state
    if (filteredMembers.length === 0) {
      return (
        <div ref={ref} className={cn('py-12 text-center', className)} {...props}>
          <div className="mb-4 text-6xl">👥</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'لا يوجد أعضاء' : 'No Members Found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {emptyMessage ||
              (isRTL ? 'لم يتم العثور على أعضاء في الفريق' : 'No team members were found')}
          </p>
        </div>
      );
    }

    // Grid variant
    if (variant === 'grid') {
      return (
        <div ref={ref} className={className} {...props}>
          {/* Filter buttons */}
          {showFilter && departments.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedDepartment(null)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selectedDepartment === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selectedDepartment === dept.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {animated ? (
            <motion.div
              className={cn('grid grid-cols-1 gap-6', columnClasses[columns])}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(member => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <TeamCard
                      name={member.name}
                      slug={member.slug}
                      position={member.position}
                      shortBio={member.shortBio}
                      avatar={member.avatar}
                      department={member.department?.name}
                      socialLinks={member.socialLinks}
                      skills={member.skills}
                      isLeader={member.isLeader}
                      isFeatured={member.isFeatured}
                      variant={cardVariant}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className={cn('grid grid-cols-1 gap-6', columnClasses[columns])}>
              {filteredMembers.map(member => (
                <TeamCard
                  key={member.id}
                  name={member.name}
                  slug={member.slug}
                  position={member.position}
                  shortBio={member.shortBio}
                  avatar={member.avatar}
                  department={member.department?.name}
                  socialLinks={member.socialLinks}
                  skills={member.skills}
                  isLeader={member.isLeader}
                  isFeatured={member.isFeatured}
                  variant={cardVariant}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // List variant
    if (variant === 'list') {
      return (
        <div ref={ref} className={className} {...props}>
          {/* Filter buttons */}
          {showFilter && departments.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedDepartment(null)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selectedDepartment === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selectedDepartment === dept.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {/* List */}
          <div className="space-y-6">
            {filteredMembers.map(member => (
              <TeamCard
                key={member.id}
                name={member.name}
                slug={member.slug}
                position={member.position}
                shortBio={member.shortBio}
                avatar={member.avatar}
                department={member.department?.name}
                socialLinks={member.socialLinks}
                skills={member.skills}
                isLeader={member.isLeader}
                isFeatured={member.isFeatured}
                variant="horizontal"
              />
            ))}
          </div>
        </div>
      );
    }

    // Masonry variant
    if (variant === 'masonry') {
      return (
        <div ref={ref} className={className} {...props}>
          {/* Filter buttons */}
          {showFilter && departments.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedDepartment(null)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  selectedDepartment === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selectedDepartment === dept.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {/* Masonry Grid */}
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {filteredMembers.map(member => (
              <div key={member.id} className="mb-6 break-inside-avoid">
                <TeamCard
                  name={member.name}
                  slug={member.slug}
                  position={member.position}
                  shortBio={member.shortBio}
                  avatar={member.avatar}
                  department={member.department?.name}
                  socialLinks={member.socialLinks}
                  skills={member.skills}
                  isLeader={member.isLeader}
                  isFeatured={member.isFeatured}
                  variant={cardVariant}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }
);

TeamGrid.displayName = 'TeamGrid';

export { TeamGrid };
export default TeamGrid;
