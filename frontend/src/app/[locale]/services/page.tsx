/**
 * Services List Page
 * صفحة قائمة الخدمات
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ServiceCard } from '@/components/services';
import { Container } from '@/components/ui';

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

// Static services data (will be replaced with API call)
const services = [
  {
    id: '1',
    slug: 'web-development',
    icon: 'code',
    category: { ar: 'تطوير', en: 'Development' },
  },
  {
    id: '2',
    slug: 'mobile-development',
    icon: 'mobile',
    category: { ar: 'تطوير', en: 'Development' },
  },
  {
    id: '3',
    slug: 'ui-ux-design',
    icon: 'design',
    category: { ar: 'تصميم', en: 'Design' },
  },
  {
    id: '4',
    slug: 'backend-development',
    icon: 'server',
    category: { ar: 'تطوير', en: 'Development' },
  },
  {
    id: '5',
    slug: 'consulting',
    icon: 'analytics',
    category: { ar: 'استشارات', en: 'Consulting' },
  },
  {
    id: '6',
    slug: 'support',
    icon: 'support',
    category: { ar: 'دعم', en: 'Support' },
  },
];

export default function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('services');
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                title={t(`${service.slug.replace(/-/g, '')}.title`)}
                description={t(`${service.slug.replace(/-/g, '')}.description`)}
                slug={service.slug}
                icon={service.icon}
                category={service.category[locale as 'ar' | 'en']}
                variant="default"
              />
            ))}
          </div>
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
