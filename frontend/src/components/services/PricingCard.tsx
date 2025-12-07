'use client';

/**
 * PricingCard Component
 * مكون بطاقة الأسعار
 */

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/solid';

export interface PricingCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Plan name */
  name: string;
  /** Plan description */
  description?: string;
  /** Price value */
  price: number;
  /** Currency code (default: SAR) */
  currency?: string;
  /** Billing period */
  period?: 'monthly' | 'yearly' | 'one-time' | 'custom';
  /** Custom period label */
  periodLabel?: string;
  /** List of features included */
  features: string[];
  /** Whether this plan is highlighted/popular */
  isPopular?: boolean;
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaLink?: string;
  /** Card variant */
  variant?: 'default' | 'bordered' | 'gradient';
}

const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      name,
      description,
      price,
      currency = 'SAR',
      period = 'one-time',
      periodLabel,
      features,
      isPopular = false,
      ctaText,
      ctaLink = '#contact',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Format price with locale
    const formattedPrice = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    // Get period display text
    const getPeriodText = () => {
      if (periodLabel) return periodLabel;
      const periods = {
        ar: {
          monthly: '/شهرياً',
          yearly: '/سنوياً',
          'one-time': 'دفعة واحدة',
          custom: '',
        },
        en: {
          monthly: '/month',
          yearly: '/year',
          'one-time': 'one-time',
          custom: '',
        },
      };
      return periods[locale as 'ar' | 'en']?.[period] || periods.en[period];
    };

    // Default variant
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-xl',
            'dark:bg-gray-800',
            isPopular && 'ring-primary-500 ring-2',
            className
          )}
          {...props}
        >
          {/* Popular badge */}
          {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary-500 rounded-full px-4 py-1 text-sm font-medium text-white">
                {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
              </span>
            </div>
          )}

          {/* Plan name */}
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{name}</h3>

          {/* Description */}
          {description && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{getPeriodText()}</span>
          </div>

          {/* Features */}
          <ul className="mb-6 flex-1 space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon className="text-primary-500 mt-0.5 size-5 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href={ctaLink}
            className={cn(
              'block w-full rounded-xl py-3 text-center font-medium transition-all',
              isPopular
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            )}
          >
            {ctaText || (isRTL ? 'ابدأ الآن' : 'Get Started')}
          </Link>
        </div>
      );
    }

    // Bordered variant
    if (variant === 'bordered') {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex flex-col rounded-2xl border-2 bg-white p-6 transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-lg',
            'dark:bg-gray-800',
            isPopular
              ? 'border-primary-500'
              : 'hover:border-primary-300 dark:hover:border-primary-600 border-gray-200 dark:border-gray-700',
            className
          )}
          {...props}
        >
          {/* Popular badge */}
          {isPopular && (
            <div className="absolute -top-3 left-4">
              <span className="bg-primary-500 rounded-lg px-3 py-1 text-xs font-medium text-white">
                {isRTL ? 'مميز' : 'Featured'}
              </span>
            </div>
          )}

          {/* Plan name */}
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{name}</h3>

          {/* Description */}
          {description && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}

          {/* Price */}
          <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-700">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400"> {getPeriodText()}</span>
          </div>

          {/* Features */}
          <ul className="mb-6 flex-1 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href={ctaLink}
            className={cn(
              'block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-all',
              isPopular
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 border'
            )}
          >
            {ctaText || (isRTL ? 'اختر الباقة' : 'Choose Plan')}
          </Link>
        </div>
      );
    }

    // Gradient variant
    if (variant === 'gradient') {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex flex-col overflow-hidden rounded-2xl p-8 text-white transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-2xl',
            isPopular
              ? 'from-primary-600 via-primary-700 to-primary-800 bg-gradient-to-br'
              : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900',
            className
          )}
          {...props}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-white" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Popular badge */}
            {isPopular && (
              <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {isRTL ? 'الأفضل قيمة' : 'Best Value'}
              </span>
            )}

            {/* Plan name */}
            <h3 className="mb-2 text-2xl font-bold">{name}</h3>

            {/* Description */}
            {description && <p className="mb-4 text-white/80">{description}</p>}

            {/* Price */}
            <div className="mb-8">
              <span className="text-5xl font-bold">{formattedPrice}</span>
              <span className="text-white/80">{getPeriodText()}</span>
            </div>

            {/* Features */}
            <ul className="mb-8 flex-1 space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 size-5 shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={ctaLink}
              className="text-primary-600 block w-full rounded-xl bg-white py-4 text-center font-medium transition-all hover:bg-white/90"
            >
              {ctaText || (isRTL ? 'ابدأ الآن' : 'Get Started')}
            </Link>
          </div>
        </div>
      );
    }

    return null;
  }
);

PricingCard.displayName = 'PricingCard';

export { PricingCard };
export default PricingCard;
