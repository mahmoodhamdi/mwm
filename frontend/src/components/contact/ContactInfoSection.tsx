'use client';

/**
 * ContactInfoSection
 * مكون قسم معلومات التواصل
 *
 * Fetches contact and social settings from the public API and renders
 * ContactInfo. Falls back to hardcoded defaults when the API is unavailable.
 */

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ContactInfo } from './ContactInfo';
import type { ContactInfoItem, SocialLink } from './ContactInfo';
import {
  getPublicSettings,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_SOCIAL_SETTINGS,
} from '@/services/public/settings.service';
import type {
  PublicContactSettings,
  PublicSocialSettings,
} from '@/services/public/settings.service';

// ── Skeleton loader ────────────────────────────────────────────────────────────

function ContactInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading contact info">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-72 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Info card skeletons (2×2 grid matching default variant) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800"
          >
            <div className="size-12 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Social links skeleton */}
      <div className="flex gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="size-11 rounded-full bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Build the ContactInfoItem array from settings data.
 */
function buildContactItems(
  contact: PublicContactSettings,
  locale: string,
  labels: { email: string; phone: string; address: string; workingHours: string }
): ContactInfoItem[] {
  const isRTL = locale === 'ar';

  return [
    {
      type: 'email' as const,
      title: labels.email,
      value: contact.email,
      link: `mailto:${contact.email}`,
    },
    {
      type: 'phone' as const,
      title: labels.phone,
      value: contact.phone,
      link: `tel:${contact.phone}`,
    },
    {
      type: 'address' as const,
      title: labels.address,
      value: isRTL ? contact.address.ar : contact.address.en,
    },
    {
      type: 'hours' as const,
      title: labels.workingHours,
      value: isRTL ? contact.workingHours.ar : contact.workingHours.en,
    },
  ];
}

/**
 * Social platform entries for the `social` settings object.
 * WhatsApp is deliberately excluded here — it lives in contact.whatsapp.
 */
type SocialPlatformEntry = {
  key: keyof PublicSocialSettings;
  type: SocialLink['type'];
  label: string;
};

const SOCIAL_PLATFORM_ORDER: SocialPlatformEntry[] = [
  { key: 'facebook', type: 'facebook', label: 'Facebook' },
  { key: 'linkedin', type: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', type: 'instagram', label: 'Instagram' },
  { key: 'twitter', type: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', type: 'youtube', label: 'YouTube' },
  { key: 'tiktok', type: 'tiktok', label: 'TikTok' },
];

/**
 * Build the SocialLink array from settings data.
 *
 * WhatsApp is sourced from contact.whatsapp and prepended when present.
 * Other platforms come from the social settings object in order.
 * Platforms with empty/missing URLs are excluded.
 */
function buildSocialLinks(
  contact: PublicContactSettings,
  social: PublicSocialSettings
): SocialLink[] {
  const links: SocialLink[] = [];

  // WhatsApp comes from contact settings, not social
  if (contact.whatsapp && contact.whatsapp.trim() !== '') {
    const waNumber = contact.whatsapp.replace(/\D/g, '');
    links.push({ type: 'whatsapp', url: `https://wa.me/${waNumber}`, label: 'WhatsApp' });
  }

  // Remaining social platforms
  for (const { key, type, label } of SOCIAL_PLATFORM_ORDER) {
    const url = social[key];
    if (url && url.trim() !== '') {
      links.push({ type, url, label });
    }
  }

  return links;
}

// ── Component ──────────────────────────────────────────────────────────────────

interface ContactInfoSectionProps {
  /** Additional class names applied to the wrapper */
  className?: string;
}

export function ContactInfoSection({ className }: ContactInfoSectionProps) {
  const locale = useLocale();
  const t = useTranslations('contact');

  const [contactSettings, setContactSettings] = useState<PublicContactSettings | null>(null);
  const [socialSettings, setSocialSettings] = useState<PublicSocialSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      setIsLoading(true);
      const settings = await getPublicSettings();

      if (!cancelled) {
        if (settings) {
          setContactSettings(settings.contact);
          setSocialSettings(settings.social);
        } else {
          // API unavailable — use hardcoded fallbacks
          setContactSettings(DEFAULT_CONTACT_SETTINGS);
          setSocialSettings(DEFAULT_SOCIAL_SETTINGS);
        }
        setIsLoading(false);
      }
    }

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <ContactInfoSkeleton />;
  }

  // At this point state is guaranteed non-null (fallbacks ensure it)
  const contact = contactSettings ?? DEFAULT_CONTACT_SETTINGS;
  const social = socialSettings ?? DEFAULT_SOCIAL_SETTINGS;

  const labels = {
    email: t('info.email'),
    phone: t('info.phone'),
    address: t('info.address'),
    workingHours: t('info.workingHours'),
  };

  const contactItems = buildContactItems(contact, locale, labels);
  const socialLinks = buildSocialLinks(contact, social);

  return (
    <ContactInfo
      className={className}
      items={contactItems}
      socialLinks={socialLinks}
      variant="default"
      showTitle={true}
    />
  );
}

export default ContactInfoSection;
