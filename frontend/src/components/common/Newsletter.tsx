'use client';

/**
 * Newsletter Component
 * مكون النشرة البريدية
 */

import { useState, useCallback, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'card';
  className?: string;
  showTitle?: boolean;
  showDescription?: boolean;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function Newsletter({
  variant = 'default',
  className,
  showTitle = false,
  showDescription = false,
}: NewsletterProps) {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!email || !email.includes('@')) {
        setStatus('error');
        setErrorMessage('Please enter a valid email address');
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
        // TODO: Implement actual API call
        // const response = await api.post('/newsletter/subscribe', { email });

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');

        // Reset to idle after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to subscribe. Please try again.');
      }
    },
    [email]
  );

  // Compact variant - single line
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('newsletterPlaceholder')}
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white transition-colors placeholder:text-gray-500',
              'focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-1',
              status === 'error' && 'border-red-500',
              status === 'success' && 'border-green-500'
            )}
          />
          {status === 'success' && (
            <CheckCircle className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-green-500" />
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={cn(
            'bg-primary-600 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
            'hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label={t('subscribe')}
        >
          {status === 'loading' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </button>
      </form>
    );
  }

  // Card variant - full featured
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'from-primary-600 to-primary-800 rounded-2xl bg-gradient-to-br p-8 text-white',
          className
        )}
      >
        {showTitle && <h3 className="mb-2 text-2xl font-bold">{t('newsletter')}</h3>}
        {showDescription && (
          <p className="text-primary-100 mb-6">
            Subscribe to our newsletter to receive the latest news and updates.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletterPlaceholder')}
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                'w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-colors placeholder:text-white/60',
                'focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20',
                status === 'error' && 'border-red-400'
              )}
            />
            {status === 'error' && errorMessage && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-200">
                <AlertCircle className="size-4" />
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'text-primary-600 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium transition-colors',
              'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50',
              'disabled:cursor-not-allowed disabled:opacity-70'
            )}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="size-5" />
                <span>Subscribed!</span>
              </>
            ) : (
              <>
                <Send className="size-5" />
                <span>{t('subscribe')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-4', className)}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('newsletter')}</h3>
      )}
      {showDescription && (
        <p className="text-gray-600 dark:text-gray-400">
          Subscribe to our newsletter to receive the latest news and updates.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('newsletterPlaceholder')}
            disabled={status === 'loading' || status === 'success'}
            error={status === 'error' ? errorMessage : undefined}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={status === 'loading'}
          disabled={status === 'success'}
          className="sm:w-auto"
        >
          {status === 'success' ? (
            <>
              <CheckCircle className="me-2 size-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Send className="me-2 size-4" />
              {t('subscribe')}
            </>
          )}
        </Button>
      </form>

      {status === 'error' && errorMessage && (
        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="size-4" />
          {errorMessage}
        </p>
      )}

      {status === 'success' && (
        <p className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="size-4" />
          Thank you for subscribing!
        </p>
      )}
    </div>
  );
}

export default Newsletter;
