/**
 * GitHub OAuth Callback Page
 * صفحة رد اتصال GitHub OAuth
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { verifyState } from '@/lib/github';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check for OAuth errors
      if (errorParam) {
        setError(errorDescription || errorParam);
        setTimeout(() => router.push('/ar/admin/login'), 3000);
        return;
      }

      // Verify code exists
      if (!code) {
        setError('No authorization code received');
        setTimeout(() => router.push('/ar/admin/login'), 3000);
        return;
      }

      // Verify state (CSRF protection)
      if (state && !verifyState(state)) {
        setError('Invalid state parameter');
        setTimeout(() => router.push('/ar/admin/login'), 3000);
        return;
      }

      try {
        // Exchange code for tokens
        await authService.loginWithGitHub(code);

        // Redirect to admin dashboard
        router.push('/ar/admin');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'GitHub authentication failed';
        setError(errorMessage);
        setTimeout(() => router.push('/ar/admin/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="text-center">
      {error ? (
        <div className="space-y-4">
          <div className="text-lg text-red-500">{error}</div>
          <div className="text-muted-foreground">Redirecting to login...</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-primary mx-auto size-8 animate-spin rounded-full border-4 border-t-transparent" />
          <div className="text-muted-foreground">Completing GitHub sign-in...</div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="space-y-4">
        <div className="border-primary mx-auto size-8 animate-spin rounded-full border-4 border-t-transparent" />
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Suspense fallback={<LoadingFallback />}>
        <GitHubCallbackContent />
      </Suspense>
    </div>
  );
}
