/**
 * Team Page
 * صفحة الفريق
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import { TeamPageClient } from './TeamPageClient';
import type { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type BilingualText = LocalizedString;

interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
}

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('ourTeam'),
    description: t('description'),
    openGraph: {
      title: t('ourTeam'),
      description: t('description'),
    },
  };
}

// Fetch team members from API
async function getTeamMembers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/team`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch team members:', res.status);
      return { members: [], total: 0 };
    }

    const data = await res.json();
    return data.data || { members: [], total: 0 };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return { members: [], total: 0 };
  }
}

// Fetch departments from API
async function getDepartments(): Promise<Department[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/team/departments`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data?.departments || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export default async function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const isRTL = locale === 'ar';
  const [{ members }, departments] = await Promise.all([getTeamMembers(), getDepartments()]);

  return (
    <main className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('ourTeam')}</h1>
            <p className="text-primary-100 text-lg md:text-xl">
              {isRTL
                ? 'تعرف على فريقنا المميز من المحترفين'
                : 'Meet our amazing team of professionals'}
            </p>
          </div>
        </Container>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <Container>
          <TeamPageClient members={members || []} departments={departments || []} />
        </Container>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'انضم إلى فريقنا' : 'Join Our Team'}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'نحن دائماً نبحث عن مواهب جديدة للانضمام إلى فريقنا المتنامي'
                : "We're always looking for new talents to join our growing team"}
            </p>
            <Link
              href="/careers"
              className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors"
            >
              {isRTL ? 'تصفح الوظائف المتاحة' : 'Browse Open Positions'}
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
