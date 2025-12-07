'use client';

/**
 * ProjectGrid Component
 * مكون شبكة المشاريع
 */

import { forwardRef, HTMLAttributes, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard, ProjectCardProps, ProjectTechnology } from './ProjectCard';

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  technologies?: ProjectTechnology[];
  category?: ProjectCategory;
  liveUrl?: string;
  views?: number;
  isFeatured?: boolean;
  completedAt?: string;
}

export interface ProjectGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Projects data */
  projects: ProjectData[];
  /** Available categories for filtering */
  categories?: ProjectCategory[];
  /** Grid variant */
  variant?: 'grid' | 'masonry' | 'list';
  /** Number of columns on large screens */
  columns?: 2 | 3 | 4;
  /** Whether to show category filter */
  showFilter?: boolean;
  /** Whether to animate cards */
  animated?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Card variant to use */
  cardVariant?: ProjectCardProps['variant'];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const ProjectGrid = forwardRef<HTMLDivElement, ProjectGridProps>(
  (
    {
      className,
      projects,
      categories = [],
      variant = 'grid',
      columns = 3,
      showFilter = false,
      animated = true,
      emptyMessage,
      cardVariant = 'default',
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Filter projects based on selected category
    const filteredProjects = useMemo(() => {
      if (activeFilter === 'all') return projects;
      return projects.filter(project => project.category?.slug === activeFilter);
    }, [projects, activeFilter]);

    // Grid column classes
    const gridCols: Record<number, string> = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    // Empty state
    const EmptyState = () => (
      <div className="col-span-full py-16 text-center">
        <div className="mx-auto mb-4 size-16 rounded-full bg-gray-100 dark:bg-gray-700" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          {isRTL ? 'لا توجد مشاريع' : 'No Projects Found'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {emptyMessage ||
            (isRTL
              ? 'لم يتم العثور على مشاريع في هذه الفئة'
              : 'No projects found in this category')}
        </p>
      </div>
    );

    // Filter component
    const FilterBar = () => {
      if (!showFilter || categories.length === 0) return null;

      return (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              activeFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            {isRTL ? 'الكل' : 'All'}
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.slug)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                activeFilter === category.slug
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      );
    };

    // Grid variant
    if (variant === 'grid') {
      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <FilterBar />

          {animated ? (
            <motion.div
              className={cn('grid gap-6', gridCols[columns])}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <motion.div key={project.id} variants={itemVariants} layout exit="exit">
                      <ProjectCard
                        title={project.title}
                        description={project.description}
                        slug={project.slug}
                        thumbnail={project.thumbnail}
                        technologies={project.technologies}
                        category={project.category?.name}
                        liveUrl={project.liveUrl}
                        views={project.views}
                        isFeatured={project.isFeatured}
                        completedAt={project.completedAt}
                        variant={cardVariant}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className={cn('grid gap-6', gridCols[columns])}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    slug={project.slug}
                    thumbnail={project.thumbnail}
                    technologies={project.technologies}
                    category={project.category?.name}
                    liveUrl={project.liveUrl}
                    views={project.views}
                    isFeatured={project.isFeatured}
                    completedAt={project.completedAt}
                    variant={cardVariant}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          )}
        </div>
      );
    }

    // Masonry variant (using CSS columns)
    if (variant === 'masonry') {
      const masonryCols: Record<number, string> = {
        2: 'columns-1 sm:columns-2',
        3: 'columns-1 sm:columns-2 lg:columns-3',
        4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
      };

      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <FilterBar />

          <div className={cn('gap-6 space-y-6', masonryCols[columns])}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div key={project.id} className="break-inside-avoid">
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    slug={project.slug}
                    thumbnail={project.thumbnail}
                    technologies={project.technologies}
                    category={project.category?.name}
                    liveUrl={project.liveUrl}
                    views={project.views}
                    isFeatured={project.isFeatured}
                    completedAt={project.completedAt}
                    variant={cardVariant}
                  />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      );
    }

    // List variant
    if (variant === 'list') {
      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <FilterBar />

          {animated ? (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <motion.div key={project.id} variants={itemVariants} layout exit="exit">
                      <ProjectCard
                        title={project.title}
                        description={project.description}
                        slug={project.slug}
                        thumbnail={project.thumbnail}
                        technologies={project.technologies}
                        category={project.category?.name}
                        liveUrl={project.liveUrl}
                        views={project.views}
                        isFeatured={project.isFeatured}
                        completedAt={project.completedAt}
                        variant="horizontal"
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    slug={project.slug}
                    thumbnail={project.thumbnail}
                    technologies={project.technologies}
                    category={project.category?.name}
                    liveUrl={project.liveUrl}
                    views={project.views}
                    isFeatured={project.isFeatured}
                    completedAt={project.completedAt}
                    variant="horizontal"
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);

ProjectGrid.displayName = 'ProjectGrid';

export { ProjectGrid };
export default ProjectGrid;
