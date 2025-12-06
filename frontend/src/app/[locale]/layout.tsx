/**
 * Locale-specific Layout
 * التخطيط الخاص باللغة
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Cairo, Inter } from 'next/font/google';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import '@/styles/globals.css';

// Arabic font
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

// English font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'MWM - حلول برمجية متكاملة' : 'MWM - Integrated Software Solutions',
    description: isArabic
      ? 'شركة متخصصة في تطوير البرمجيات والحلول الرقمية المتكاملة'
      : 'A company specialized in software development and integrated digital solutions',
    keywords: isArabic
      ? ['برمجة', 'تطوير مواقع', 'تطبيقات', 'حلول رقمية']
      : ['software', 'web development', 'apps', 'digital solutions'],
    openGraph: {
      title: isArabic ? 'MWM - حلول برمجية متكاملة' : 'MWM - Integrated Software Solutions',
      description: isArabic
        ? 'شركة متخصصة في تطوير البرمجيات والحلول الرقمية المتكاملة'
        : 'A company specialized in software development and integrated digital solutions',
      locale: isArabic ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = localeDirection[locale as Locale];
  const fontClass = locale === 'ar' ? cairo.variable : inter.variable;

  return (
    <html lang={locale} dir={direction} className={fontClass} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <OrganizationJsonLd
          name="MWM - Integrated Software Solutions"
          description="A company specialized in software development and integrated digital solutions"
          url={process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com'}
          logo={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com'}/logo.png`}
          email="info@mwm.com"
          phone="+966500000000"
          address={{
            street: '123 Business Street',
            city: 'Tech City',
            country: 'SA',
          }}
          socialProfiles={[
            'https://facebook.com/mwm',
            'https://twitter.com/mwm',
            'https://linkedin.com/company/mwm',
            'https://instagram.com/mwm',
          ]}
        />
      </head>
      <body
        className={`min-h-screen font-sans antialiased ${direction === 'rtl' ? 'font-cairo' : 'font-inter'}`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="system">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pt-16 md:pt-20">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
