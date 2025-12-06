/**
 * 404 Not Found Page
 * صفحة 404 غير موجود
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFoundPage() {
  const t = useTranslations('errors');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-primary-600 text-9xl font-bold">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          {t('notFound')}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-gray-600 dark:text-gray-400">
          {t('notFoundDescription')}
        </p>
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 mt-8 inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-white transition-colors"
        >
          {t('goHome')}
        </Link>
      </div>
    </main>
  );
}
