/**
 * Public Settings Service
 * خدمة الإعدادات العامة
 *
 * Fetches publicly-accessible site settings from the backend.
 * No authentication required.
 */

import { apiClient } from '@/lib/api';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface PublicContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: BilingualText;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: BilingualText;
}

/**
 * Social platforms stored in the `social` section of settings.
 * Note: WhatsApp is stored in `contact.whatsapp`, not here.
 */
export interface PublicSocialSettings {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
  behance?: string;
  dribbble?: string;
}

export interface PublicGeneralSettings {
  siteName: BilingualText;
  siteTagline: BilingualText;
  logo: {
    light: string;
    dark: string;
  };
  favicon: string;
  defaultLanguage: 'ar' | 'en';
  maintenanceMode: boolean;
  maintenanceMessage?: BilingualText;
}

export interface PublicSeoSettings {
  defaultTitle: BilingualText;
  defaultDescription: BilingualText;
  ogImage: string;
}

export interface PublicFeatureSettings {
  blog: boolean;
  careers: boolean;
  newsletter: boolean;
  testimonials: boolean;
  darkMode: boolean;
  multiLanguage: boolean;
  contactForm: boolean;
  chatWidget: boolean;
  analytics: boolean;
}

export interface PublicHomepageSettings {
  heroEnabled: boolean;
  servicesEnabled: boolean;
  portfolioEnabled: boolean;
  statsEnabled: boolean;
  testimonialsEnabled: boolean;
  teamEnabled: boolean;
  blogEnabled: boolean;
  clientsEnabled: boolean;
  ctaEnabled: boolean;
  sectionsOrder: string[];
}

export interface PublicThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: {
    heading: string;
    body: string;
    arabic: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  buttonStyle: 'solid' | 'outline' | 'ghost';
}

export interface PublicSettings {
  general: PublicGeneralSettings;
  contact: PublicContactSettings;
  social: PublicSocialSettings;
  seo: PublicSeoSettings;
  features: PublicFeatureSettings;
  homepage: PublicHomepageSettings;
  theme: PublicThemeSettings;
}

/**
 * Default fallback values for contact settings.
 * Used when the API call fails (graceful degradation).
 */
export const DEFAULT_CONTACT_SETTINGS: PublicContactSettings = {
  email: 'mwm.softwars.solutions@gmail.com',
  phone: '+201019793768',
  whatsapp: '+201019793768',
  address: {
    ar: 'القاهرة، مصر',
    en: 'Cairo, Egypt',
  },
  location: { lat: 30.0444, lng: 31.2357 },
  workingHours: {
    ar: 'الأحد - الخميس: 9 ص - 6 م',
    en: 'Sun - Thu: 9 AM - 6 PM',
  },
};

/**
 * Default fallback values for social settings.
 * Note: whatsapp lives in contact settings, not here.
 */
export const DEFAULT_SOCIAL_SETTINGS: PublicSocialSettings = {
  facebook: 'https://facebook.com/mwm',
  linkedin: 'https://linkedin.com/company/mwm',
  instagram: 'https://instagram.com/mwm',
};

/**
 * Fetch public settings from the backend.
 * Returns null if the request fails so callers can fall back to defaults.
 */
export async function getPublicSettings(): Promise<PublicSettings | null> {
  try {
    const response = await apiClient.get<{ settings: PublicSettings }>('/settings/public');
    return response.data?.settings ?? null;
  } catch {
    return null;
  }
}

export const publicSettingsService = {
  getPublicSettings,
};

export default publicSettingsService;
