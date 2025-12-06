'use client';

/**
 * Language Switcher Component
 * مكون تبديل اللغة
 */

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks';
import { locales, localeNames, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  className,
  showIcon = true,
  showLabel = true,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      // Remove current locale from pathname and add new locale
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPathname = segments.join('/');
      router.push(newPathname);
      setIsOpen(false);
    },
    [pathname, router]
  );

  // Minimal variant - just icons
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {locales.map(loc => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={cn(
              'rounded-md px-2 py-1 text-sm font-medium transition-colors',
              locale === loc
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
            aria-label={`Switch to ${localeNames[loc]}`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Buttons variant - horizontal buttons
  if (variant === 'buttons') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showIcon && <Globe className="size-4 text-gray-500" />}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          {locales.map(loc => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors first:rounded-s-lg last:rounded-e-lg',
                locale === loc
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              aria-label={`Switch to ${localeNames[loc]}`}
            >
              {showLabel ? localeNames[loc] : loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          isOpen && 'bg-gray-100 dark:bg-gray-800'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {showIcon && <Globe className="size-4" />}
        {showLabel && <span>{localeNames[locale]}</span>}
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800',
            // RTL support - dropdown opens in correct direction
            'end-0'
          )}
          role="listbox"
          aria-label="Select language"
        >
          {locales.map(loc => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                locale === loc
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
              role="option"
              aria-selected={locale === loc}
            >
              <span>{localeNames[loc]}</span>
              {locale === loc && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
