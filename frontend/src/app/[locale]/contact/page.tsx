/**
 * Contact Page
 * صفحة اتصل بنا
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ContactForm, ContactInfo } from '@/components/contact';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('contact');
  const isRTL = locale === 'ar';

  // Contact info items
  const contactItems = [
    {
      type: 'email' as const,
      title: t('info.email'),
      value: 'mwm.softwars.solutions@gmail.com',
      link: 'mailto:mwm.softwars.solutions@gmail.com',
    },
    {
      type: 'phone' as const,
      title: t('info.phone'),
      value: '+201019793768',
      link: 'tel:+201019793768',
    },
    {
      type: 'address' as const,
      title: t('info.address'),
      value: isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt',
    },
    {
      type: 'hours' as const,
      title: t('info.workingHours'),
      value: isRTL ? 'الأحد - الخميس: 9 ص - 6 م' : 'Sun - Thu: 9 AM - 6 PM',
    },
  ];

  // Social links
  const socialLinks = [
    { type: 'whatsapp' as const, url: 'https://wa.me/201019793768', label: 'WhatsApp' },
    { type: 'facebook' as const, url: 'https://facebook.com/mwm', label: 'Facebook' },
    { type: 'linkedin' as const, url: 'https://linkedin.com/company/mwm', label: 'LinkedIn' },
    { type: 'instagram' as const, url: 'https://instagram.com/mwm', label: 'Instagram' },
  ];

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

            {/* Contact Info */}
            <div>
              <ContactInfo
                items={contactItems}
                socialLinks={socialLinks}
                variant="default"
                showTitle={true}
              />

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
