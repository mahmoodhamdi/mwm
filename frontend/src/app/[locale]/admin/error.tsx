/**
 * Admin Error Page
 * صفحة خطأ لوحة التحكم
 */

'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[AdminError]', error);
  }, [error]);

  const texts = {
    ar: {
      title: 'حدث خطأ غير متوقع',
      description: 'نعتذر، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.',
      retry: 'إعادة المحاولة',
      backToDashboard: 'العودة للوحة التحكم',
      errorDetails: 'تفاصيل الخطأ',
    },
    en: {
      title: 'Something went wrong',
      description: "We're sorry, an error occurred while loading this page. Please try again.",
      retry: 'Try again',
      backToDashboard: 'Back to Dashboard',
      errorDetails: 'Error details',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div
      className={`flex min-h-[60vh] items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <AlertTriangle className="size-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">{t.description}</p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mb-6 rounded-lg bg-gray-100 p-4 text-start dark:bg-gray-800">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.errorDetails}
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-red-600 dark:text-red-400">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <RefreshCw className="size-4" />
            {t.retry}
          </button>

          <Link
            href={`/${locale}/admin`}
            className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
          >
            <Home className="size-4" />
            {t.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
