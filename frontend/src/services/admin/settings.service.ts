/**
 * Settings Service
 * خدمة الإعدادات
 */

import { apiClient } from '@/lib/api';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
export type BilingualText = LocalizedString;

export interface GeneralSettings {
  siteName: BilingualText;
  siteTagline: BilingualText;
  logo: string;
  favicon: string;
  defaultLanguage: 'ar' | 'en';
  timezone: string;
  dateFormat: string;
  maintenanceMode: boolean;
  maintenanceMessage: BilingualText;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: BilingualText;
  mapLocation?: {
    lat: number;
    lng: number;
  };
  workingHours: BilingualText;
}

export interface SocialSettings {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface SEOSettings {
  titleTemplate: BilingualText;
  defaultTitle: BilingualText;
  defaultDescription: BilingualText;
  defaultKeywords: BilingualText;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsTxt: string;
  sitemapEnabled: boolean;
  analyticsId: string;
}

export interface FeatureSettings {
  blog: boolean;
  portfolio: boolean;
  testimonials: boolean;
  newsletter: boolean;
  userRegistration: boolean;
  comments: boolean;
  livechat: boolean;
  analytics: boolean;
  apiAccess: boolean;
  caching: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: BilingualText;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  logoLight: string;
  logoDark: string;
}

export interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  fromName: string;
  fromEmail: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  apiKey?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newMessageAlert: boolean;
  newSubscriberAlert: boolean;
  newContactAlert: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  ipWhitelist: string[];
}

export interface Settings {
  _id?: string;
  general: GeneralSettings;
  contact: ContactSettings;
  social: SocialSettings;
  seo: SEOSettings;
  features: FeatureSettings;
  theme: ThemeSettings;
  email?: EmailSettings;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
  homepage?: {
    heroSection: boolean;
    servicesSection: boolean;
    portfolioSection: boolean;
    testimonialsSection: boolean;
    teamSection: boolean;
    blogSection: boolean;
    contactSection: boolean;
  };
  updatedAt?: string;
}

// API endpoints
const SETTINGS_ENDPOINT = '/settings';

/**
 * Get all settings (Admin)
 */
export async function getSettings(): Promise<Settings> {
  const response = await apiClient.get<{ settings: Settings }>(SETTINGS_ENDPOINT);
  return response.data?.settings as Settings;
}

/**
 * Get public settings
 */
export async function getPublicSettings(): Promise<Partial<Settings>> {
  const response = await apiClient.get<{ settings: Partial<Settings> }>(
    `${SETTINGS_ENDPOINT}/public`
  );
  return response.data?.settings as Partial<Settings>;
}

/**
 * Update all settings
 */
export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const response = await apiClient.put<{ settings: Settings }>(SETTINGS_ENDPOINT, data);
  return response.data?.settings as Settings;
}

/**
 * Update a specific settings section
 */
export async function updateSettingsSection(
  section:
    | 'general'
    | 'contact'
    | 'social'
    | 'seo'
    | 'features'
    | 'theme'
    | 'email'
    | 'notifications'
    | 'security'
    | 'homepage',
  data: unknown
): Promise<Settings> {
  const response = await apiClient.patch<{ settings: Settings }>(
    `${SETTINGS_ENDPOINT}/${section}`,
    { data }
  );
  return response.data?.settings as Settings;
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<Settings> {
  const response = await apiClient.post<{ settings: Settings }>(`${SETTINGS_ENDPOINT}/reset`);
  return response.data?.settings as Settings;
}

export const settingsService = {
  getSettings,
  getPublicSettings,
  updateSettings,
  updateSettingsSection,
  resetSettings,
};

export default settingsService;
