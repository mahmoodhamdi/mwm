/**
 * About Page
 * صفحة من نحن
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import {
  LightBulbIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('about');
  const isRTL = locale === 'ar';

  // Company values
  const values = [
    {
      icon: <LightBulbIcon className="size-8" />,
      title: isRTL ? 'الابتكار' : 'Innovation',
      description: isRTL
        ? 'نسعى دائماً لتقديم حلول مبتكرة ومتطورة'
        : 'We always strive to provide innovative and advanced solutions',
    },
    {
      icon: <ShieldCheckIcon className="size-8" />,
      title: isRTL ? 'الجودة' : 'Quality',
      description: isRTL
        ? 'نلتزم بأعلى معايير الجودة في كل مشروع'
        : 'We commit to the highest quality standards in every project',
    },
    {
      icon: <UserGroupIcon className="size-8" />,
      title: isRTL ? 'التعاون' : 'Collaboration',
      description: isRTL
        ? 'نعمل كفريق واحد مع عملائنا لتحقيق أهدافهم'
        : 'We work as one team with our clients to achieve their goals',
    },
    {
      icon: <HeartIcon className="size-8" />,
      title: isRTL ? 'الشغف' : 'Passion',
      description: isRTL
        ? 'شغفنا بالتقنية هو ما يدفعنا للتميز'
        : 'Our passion for technology drives us to excel',
    },
  ];

  // Stats
  const stats = [
    { value: '50+', label: isRTL ? 'مشروع منجز' : 'Projects Completed' },
    { value: '30+', label: isRTL ? 'عميل سعيد' : 'Happy Clients' },
    { value: '5+', label: isRTL ? 'سنوات خبرة' : 'Years Experience' },
    { value: '10+', label: isRTL ? 'مطور محترف' : 'Expert Developers' },
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

      {/* About Content */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg dark:prose-invert mx-auto text-center">
              <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                {t('description')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-primary-600 dark:text-primary-400 mb-2 text-4xl font-bold md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-6 inline-flex size-16 items-center justify-center rounded-2xl">
                <RocketLaunchIcon className="size-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('mission')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{t('missionText')}</p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-6 inline-flex size-16 items-center justify-center rounded-2xl">
                <EyeIcon className="size-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('vision')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{t('visionText')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('values')}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-gray-800"
              >
                <div className="text-primary-600 dark:text-primary-400 mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'هل تريد العمل معنا؟' : 'Want to work with us?'}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'انضم إلى فريقنا المميز أو تواصل معنا لبدء مشروعك'
                : 'Join our amazing team or contact us to start your project'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors"
              >
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600"
              >
                {t('joinUs')}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
