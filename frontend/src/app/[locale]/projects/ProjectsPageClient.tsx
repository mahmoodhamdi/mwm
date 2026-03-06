'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { ProjectCard } from '@/components/projects';

interface Project {
  _id: string;
  title: { ar: string; en: string };
  shortDescription: { ar: string; en: string };
  slug: string;
  category?: { _id: string; name: { ar: string; en: string }; slug: string } | null;
  thumbnail: string;
  technologies: Array<{ name: string; icon?: string }>;
  isActive: boolean;
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  isActive: boolean;
}

interface ProjectsPageClientProps {
  projects: Project[];
  categories: Category[];
}

export function ProjectsPageClient({ projects, categories }: ProjectsPageClientProps) {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter(p => p.category?._id === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {isRTL ? 'الكل' : 'All'}
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category._id
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {category.name[locale]}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {isRTL
          ? `${filteredProjects.length} مشروع`
          : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
      </p>

      {/* Projects Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {isRTL ? 'لا توجد مشاريع في هذا التصنيف' : 'No projects in this category'}
            </p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              title={project.title[locale]}
              description={project.shortDescription[locale]}
              slug={project.slug}
              thumbnail={
                project.thumbnail ||
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
              }
              category={project.category?.name?.[locale] || ''}
              technologies={project.technologies || []}
            />
          ))
        )}
      </div>
    </>
  );
}
