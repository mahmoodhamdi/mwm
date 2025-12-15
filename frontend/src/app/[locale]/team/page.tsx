/**
 * Team Page
 * صفحة الفريق
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container, Spinner } from '@/components/ui';
import { TeamCard } from '@/components/team';
import { Suspense } from 'react';
import type { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type BilingualText = LocalizedString;

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
}

interface TeamMember {
  _id: string;
  name: BilingualText;
  slug: string;
  position: BilingualText;
  bio: BilingualText;
  department?: Department | null;
  avatar: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
  isFeatured: boolean;
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

// Team Grid Component
async function TeamGrid({ locale }: { locale: string }) {
  const { members } = await getTeamMembers();

  if (!members || members.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {locale === 'ar'
            ? 'لا يوجد أعضاء فريق متاحين حالياً'
            : 'No team members available at the moment'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member: TeamMember) => (
        <TeamCard
          key={member._id}
          slug={member.slug}
          name={member.name[locale as 'ar' | 'en']}
          position={member.position[locale as 'ar' | 'en']}
          shortBio={member.bio[locale as 'ar' | 'en']}
          avatar={
            member.avatar ||
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
          }
          socialLinks={member.socialLinks}
        />
      ))}
    </div>
  );
}

// Department Filter Component
async function DepartmentFilter({ locale }: { locale: string }) {
  const departments = await getDepartments();

  if (departments.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-3">
      <button className="border-primary-500 bg-primary-500 rounded-full border px-6 py-2 text-sm font-medium text-white transition-colors">
        {locale === 'ar' ? 'الكل' : 'All'}
      </button>
      {departments.map(department => (
        <button
          key={department._id}
          className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
        >
          {department.name[locale as 'ar' | 'en']}
        </button>
      ))}
    </div>
  );
}

// Loading Component
function TeamLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export default async function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const isRTL = locale === 'ar';

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
          <Suspense fallback={<div className="h-10" />}>
            <DepartmentFilter locale={locale} />
          </Suspense>
          <Suspense fallback={<TeamLoading />}>
            <TeamGrid locale={locale} />
          </Suspense>
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
