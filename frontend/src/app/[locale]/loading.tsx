/**
 * Loading Page
 * صفحة التحميل
 */

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="border-primary-600 inline-block size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </main>
  );
}
