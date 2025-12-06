/**
 * Error Page
 * صفحة الخطأ
 */

'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  const tErrors = useTranslations('errors');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600">500</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          {tErrors('serverError')}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-gray-600 dark:text-gray-400">
          {tErrors('serverErrorDescription')}
        </p>
        <button
          onClick={reset}
          className="bg-primary-600 hover:bg-primary-700 mt-8 inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-white transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    </main>
  );
}
