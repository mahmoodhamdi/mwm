/**
 * Projects Page
 * صفحة المشاريع
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container, Spinner } from '@/components/ui';
import { ProjectCard } from '@/components/projects';
import { Suspense } from 'react';

// Types
interface BilingualText {
  ar: string;
  en: string;
}

interface Project {
  _id: string;
  title: BilingualText;
  shortDescription: BilingualText;
  slug: string;
  category?: { _id: string; name: BilingualText; slug: string } | null;
  thumbnail: string;
  technologies: Array<{ name: string; icon?: string }>;
  isActive: boolean;
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: BilingualText;
  slug: string;
  isActive: boolean;
}

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  };
}

// Fetch projects from API
async function getProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/projects`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch projects:', res.status);
      return { projects: [], total: 0 };
    }

    const data = await res.json();
    return data.data || { projects: [], total: 0 };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { projects: [], total: 0 };
  }
}

// Fetch categories from API
async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/projects/categories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data?.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Projects Grid Component
async function ProjectsGrid({ locale }: { locale: string }) {
  const { projects } = await getProjects();

  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {locale === 'ar' ? 'لا توجد مشاريع متاحة حالياً' : 'No projects available at the moment'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <ProjectCard
          key={project._id}
          title={project.title[locale as 'ar' | 'en']}
          description={project.shortDescription[locale as 'ar' | 'en']}
          slug={project.slug}
          thumbnail={
            project.thumbnail ||
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
          }
          category={project.category?.name?.[locale as 'ar' | 'en'] || ''}
          technologies={project.technologies || []}
        />
      ))}
    </div>
  );
}

// Category Filter Component
async function CategoryFilter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'projects' });
  const categories = await getCategories();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button className="border-primary-500 bg-primary-500 rounded-full border px-6 py-2 text-sm font-medium text-white transition-colors">
        {t('categories.all')}
      </button>
      {categories.map(category => (
        <button
          key={category._id}
          className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
        >
          {category.name[locale as 'ar' | 'en']}
        </button>
      ))}
    </div>
  );
}

// Loading Component
function ProjectsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export default async function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'projects' });
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
            <p className="text-primary-100 text-lg md:text-xl">{t('subtitle')}</p>
          </div>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-200 py-6 dark:border-gray-800">
        <Container>
          <Suspense fallback={<div className="h-10" />}>
            <CategoryFilter locale={locale} />
          </Suspense>
        </Container>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <Container>
          <Suspense fallback={<ProjectsLoading />}>
            <ProjectsGrid locale={locale} />
          </Suspense>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'هل لديك مشروع في بالك؟' : 'Have a project in mind?'}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'تواصل معنا اليوم لمناقشة كيف يمكننا مساعدتك في تحقيق أهدافك'
                : 'Contact us today to discuss how we can help you achieve your goals'}
            </p>
            <Link
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
