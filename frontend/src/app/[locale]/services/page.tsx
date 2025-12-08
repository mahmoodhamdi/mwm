/**
 * Services List Page
 * صفحة قائمة الخدمات
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ServiceCard } from '@/components/services';
import { Container, Spinner } from '@/components/ui';
import { Suspense } from 'react';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
    },
  };
}

// Fetch services from API
async function getServices() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/services`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch services:', res.status);
      return { services: [], total: 0 };
    }

    const data = await res.json();
    return data.data || { services: [], total: 0 };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { services: [], total: 0 };
  }
}

// Services Grid Component
async function ServicesGrid({ locale }: { locale: string }) {
  const { services } = await getServices();

  if (!services || services.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {locale === 'ar' ? 'لا توجد خدمات متاحة حالياً' : 'No services available at the moment'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map(
        (service: {
          _id: string;
          title: { ar: string; en: string };
          shortDescription: { ar: string; en: string };
          slug: string;
          icon?: string;
          category?: { name: { ar: string; en: string } } | null;
        }) => (
          <ServiceCard
            key={service._id}
            title={service.title[locale as 'ar' | 'en']}
            description={service.shortDescription[locale as 'ar' | 'en']}
            slug={service.slug}
            icon={service.icon || 'code'}
            category={service.category?.name?.[locale as 'ar' | 'en'] || ''}
            variant="default"
          />
        )
      )}
    </div>
  );
}

// Loading Component
function ServicesLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'services' });
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('pageTitle')}</h1>
            <p className="text-primary-100 text-lg md:text-xl">{t('pageDescription')}</p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <Container>
          <Suspense fallback={<ServicesLoading />}>
            <ServicesGrid locale={locale} />
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
