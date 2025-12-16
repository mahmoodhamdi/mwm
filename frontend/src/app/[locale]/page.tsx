/**
 * Home Page
 * الصفحة الرئيسية
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-900 relative bg-gradient-to-br text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">{t('home.heroTitle')}</h1>
            <p className="text-primary-100 mb-4 text-xl md:text-2xl">{t('home.title')}</p>
            <p className="text-primary-200 mx-auto mb-8 max-w-2xl text-lg md:text-xl">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="text-primary-600 hover:bg-primary-50 inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors"
              >
                {t('home.ctaPrimary')}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-primary-600 mb-2 text-4xl font-bold md:text-5xl">50+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.stats.projects')}</div>
            </div>
            <div className="text-center">
              <div className="text-primary-600 mb-2 text-4xl font-bold md:text-5xl">30+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.stats.clients')}</div>
            </div>
            <div className="text-center">
              <div className="text-primary-600 mb-2 text-4xl font-bold md:text-5xl">5+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.stats.experience')}</div>
            </div>
            <div className="text-center">
              <div className="text-primary-600 mb-2 text-4xl font-bold md:text-5xl">10+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('home.stats.team')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('home.ourServices')}</h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Web Development */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.webDev.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('services.webDev.description')}</p>
            </div>

            {/* Mobile Development */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.mobileDev.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('services.mobileDev.description')}
              </p>
            </div>

            {/* UI/UX Design */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.uiux.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('services.uiux.description')}</p>
            </div>

            {/* Backend Development */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.backend.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('services.backend.description')}
              </p>
            </div>

            {/* Technical Consulting */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.consulting.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('services.consulting.description')}
              </p>
            </div>

            {/* Support & Maintenance */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
              <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex size-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-600 size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t('services.support.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('services.support.description')}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="text-primary-600 hover:text-primary-700 inline-flex items-center font-semibold"
            >
              {t('common.viewAll')}
              <svg
                className="ms-2 size-5 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{t('home.ctaPrimary')}</h2>
          <p className="text-primary-100 mx-auto mb-8 max-w-2xl">{t('home.heroDescription')}</p>
          <Link
            href="/contact"
            className="text-primary-600 hover:bg-primary-50 inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors"
          >
            {t('common.contactUs')}
          </Link>
        </div>
      </section>
    </main>
  );
}
