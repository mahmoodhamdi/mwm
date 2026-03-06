/**
 * Projects Page
 * صفحة المشاريع
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import type { LocalizedString } from '@mwm/shared';
import { ProjectsPageClient } from './ProjectsPageClient';

// Type alias for backward compatibility
type BilingualText = LocalizedString;

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
async function getProjects(): Promise<{ projects: Project[]; total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/projects?limit=100`, {
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

export default async function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'projects' });
  const isRTL = locale === 'ar';
  const [{ projects }, categories] = await Promise.all([getProjects(), getCategories()]);

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

      {/* Filter + Projects */}
      <section className="py-16">
        <Container>
          <ProjectsPageClient projects={projects || []} categories={categories || []} />
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
