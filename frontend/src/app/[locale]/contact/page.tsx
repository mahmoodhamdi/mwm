/**
 * Contact Page
 * صفحة اتصل بنا
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ContactForm } from '@/components/contact';
import { ContactInfoSection } from '@/components/contact/ContactInfoSection';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });

  const isArabic = locale === 'ar';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';

  return {
    title: isArabic
      ? 'تواصل معنا | احصل على عرض سعر مجاني لمشروعك البرمجي - MWM'
      : 'Contact Us | Get a Free Quote for Your Software Project - MWM',
    description: isArabic
      ? 'تواصل مع فريق MWM للحصول على استشارة مجانية وعرض سعر لمشروعك. نطور مواقع ويب، تطبيقات موبايل، APIs، ومتاجر إلكترونية. القاهرة، مصر. هاتف: +201019793768'
      : 'Contact MWM team for a free consultation and project quote. We develop websites, mobile apps, APIs, and e-commerce stores. Cairo, Egypt. Phone: +201019793768',
    keywords: isArabic
      ? ['تواصل معنا', 'عرض سعر', 'استشارة مجانية', 'شركة برمجة القاهرة', 'طلب مشروع برمجي']
      : [
          'contact us',
          'free quote',
          'software consultation',
          'Cairo software company',
          'project inquiry',
        ],
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${siteUrl}/${locale}/contact`,
    },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { ar: '/ar/contact', en: '/en/contact' },
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('contact');
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

      {/* Contact Section */}
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <ContactForm variant="default" showBudget={true} showCompany={true} />
            </div>

            {/* Contact Info — fetched from API with fallback to defaults */}
            <div>
              <ContactInfoSection />

              {/* Map Placeholder */}
              <div className="mt-8 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <div className="flex h-64 items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {isRTL ? 'خريطة الموقع' : 'Location Map'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
