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
import { AuthProvider } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import '@/styles/globals.css';

// Arabic font with fallbacks
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
});

// English font with fallbacks
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';

  return {
    title: {
      default: isArabic
        ? 'MWM - شركة برمجة وتطوير مواقع وتطبيقات | حلول برمجية متكاملة'
        : 'MWM - Software Development Company | Web & Mobile App Development',
      template: isArabic ? '%s | MWM حلول برمجية' : '%s | MWM Software Solutions',
    },
    description: isArabic
      ? 'شركة MWM متخصصة في تطوير المواقع والتطبيقات والأنظمة البرمجية. نبني مواقع ويب احترافية، تطبيقات موبايل، واجهات برمجية APIs، أنظمة إدارة محتوى، ومتاجر إلكترونية. خبرة في Next.js, Node.js, Flutter, Laravel. تواصل معنا للحصول على عرض سعر مجاني.'
      : 'MWM specializes in web development, mobile apps, and software systems. We build professional websites, mobile applications, REST APIs, CMS platforms, and e-commerce stores. Expert in Next.js, Node.js, Flutter, Laravel. Contact us for a free quote.',
    keywords: isArabic
      ? [
          'شركة برمجة',
          'تطوير مواقع',
          'تطوير تطبيقات',
          'برمجة مواقع',
          'تصميم مواقع',
          'مبرمج',
          'مطور ويب',
          'شركة تطوير برمجيات',
          'تطبيقات موبايل',
          'متجر إلكتروني',
          'واجهة برمجية',
          'API',
          'Next.js',
          'Node.js',
          'Flutter',
          'Laravel',
          'React',
          'تصميم واجهات',
          'UI/UX',
          'مصر',
          'القاهرة',
          'freelancer',
          'مستقل',
          'خمسات',
          'مطور فلاتر',
          'برمجة تطبيقات الجوال',
          'تطوير مواقع ويب',
          'شركة برمجة في مصر',
          'أفضل شركة برمجة',
          'مبرمج محترف',
          'تصميم تطبيقات',
          'بناء متجر إلكتروني',
          'تطوير أنظمة إدارة',
          'برمجة باك اند',
          'تطوير فرونت اند',
          'تصميم لوحات تحكم',
          'بناء API',
          'تطوير ويب احترافي',
          'مطور TypeScript',
          'مطور React',
          'تطوير تطبيقات Flutter',
          'برمجة مواقع ووردبريس',
          'تطوير SaaS',
          'شركة تصميم مواقع',
          'حلول برمجية',
          'أنظمة حجوزات',
          'نظام توصيل طلبات',
          'تطبيق توصيل',
          'MongoDB',
          'PostgreSQL',
          'Redis',
          'Docker',
          'DevOps',
          'تطوير برمجيات السعودية',
          'مبرمج عربي',
          'فريلانسر عربي',
          'أتمتة',
          'web scraping',
          'بوتات واتساب',
          'تطوير بوتات',
          'Socket.io',
          'تطبيقات الوقت الحقيقي',
          'Tailwind CSS',
          'تصميم متجاوب',
          'SEO',
          'تحسين محركات البحث',
        ]
      : [
          'software development company',
          'web development',
          'mobile app development',
          'web developer',
          'programmer',
          'freelance developer',
          'website design',
          'full-stack developer',
          'React developer',
          'Next.js developer',
          'Node.js developer',
          'Flutter developer',
          'Laravel developer',
          'REST API development',
          'e-commerce development',
          'CMS development',
          'UI/UX design',
          'Egypt',
          'Cairo',
          'hire developer',
          'custom software',
          'web application',
          'SaaS development',
          'TypeScript developer',
          'MongoDB developer',
          'PostgreSQL developer',
          'Redis caching',
          'Docker deployment',
          'DevOps engineer',
          'CI/CD pipeline',
          'socket.io real-time',
          'Tailwind CSS developer',
          'responsive web design',
          'progressive web app',
          'PWA development',
          'food delivery app',
          'ride hailing app',
          'booking system',
          'appointment scheduling',
          'price comparison website',
          'web scraping service',
          'automation developer',
          'WhatsApp bot development',
          'email automation',
          'Prisma ORM',
          'Express.js developer',
          'Dart developer',
          'Riverpod state management',
          'BLoC pattern Flutter',
          'bilingual website development',
          'RTL Arabic website',
          'dark mode implementation',
          'SEO optimization',
          'performance optimization',
          'scalable architecture',
          'microservices',
          'monorepo development',
          'API documentation Swagger',
          'JWT authentication',
          'OAuth implementation',
          'Cloudinary integration',
          'payment gateway integration',
          'Paymob integration',
          'best software company Egypt',
          'hire Arab developer',
          'freelance Arab programmer',
          'software agency Middle East',
        ],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      title: isArabic
        ? 'MWM - شركة برمجة وتطوير مواقع وتطبيقات'
        : 'MWM - Software Development Company | Web & Mobile Apps',
      description: isArabic
        ? 'نبني مواقع ويب احترافية، تطبيقات موبايل، واجهات برمجية، وأنظمة متكاملة. +30 مشروع ناجح. تواصل معنا الآن.'
        : 'We build professional websites, mobile apps, APIs, and full-stack platforms. 30+ successful projects. Contact us now.',
      locale: isArabic ? 'ar_SA' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_SA',
      type: 'website',
      siteName: 'MWM Software Solutions',
      url: `${siteUrl}/${locale}`,
      images: [
        {
          url: `${siteUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'MWM حلول برمجية متكاملة' : 'MWM Software Solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'MWM - شركة برمجة وتطوير مواقع' : 'MWM - Software Development Company',
      description: isArabic
        ? 'نبني مواقع ويب، تطبيقات موبايل، وأنظمة برمجية متكاملة'
        : 'We build websites, mobile apps, and full-stack software systems',
      images: [`${siteUrl}/og-image.svg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
  // Include both font variables so they're available for the whole app
  const fontClasses = `${cairo.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={direction} className={fontClasses} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <OrganizationJsonLd
          name="MWM - Integrated Software Solutions"
          description="A company specialized in software development and integrated digital solutions"
          url={process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com'}
          logo={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com'}/logo.png`}
          email="mwm.softwars.solutions@gmail.com"
          phone="+201019793768"
          address={{
            street: 'Cairo',
            city: 'Cairo',
            country: 'EG',
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
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-16 md:pt-20">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
