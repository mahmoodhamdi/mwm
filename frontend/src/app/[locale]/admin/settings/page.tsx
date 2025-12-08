'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { settingsService, Settings as SettingsData } from '@/services/admin';
import { ApiError } from '@/lib/api';
import {
  Settings as SettingsIcon,
  Globe,
  Palette,
  Search,
  Shield,
  Bell,
  Mail,
  Save,
  RefreshCw,
  Upload,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  CheckCircle,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

// Types
type TabType = 'general' | 'seo' | 'theme' | 'features' | 'notifications' | 'security';

interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
}

interface SEOSettings {
  titleTemplate: { ar: string; en: string };
  defaultTitle: { ar: string; en: string };
  defaultDescription: { ar: string; en: string };
  defaultKeywords: { ar: string; en: string };
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsTxt: string;
  sitemapEnabled: boolean;
  analyticsId: string;
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: { ar: string; en: string };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  logoLight: string;
  logoDark: string;
  favicon: string;
}

interface FeatureToggle {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  enabled: boolean;
  category: 'content' | 'user' | 'integration' | 'advanced';
}

interface NotificationSettings {
  emailNotifications: boolean;
  newMessageAlert: boolean;
  newSubscriberAlert: boolean;
  newContactAlert: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
}

interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  ipWhitelist: string[];
  maintenanceMode: boolean;
}

export default function SettingsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // General Settings
  const [siteName, setSiteName] = useState({ ar: 'موقع الشركة', en: 'Company Website' });
  const [siteTagline, setSiteTagline] = useState({ ar: 'شعار الموقع', en: 'Website Tagline' });
  const [siteEmail, setSiteEmail] = useState('info@company.com');
  const [sitePhone, setSitePhone] = useState('+966 12 345 6789');
  const [siteAddress, setSiteAddress] = useState({
    ar: 'الرياض، المملكة العربية السعودية',
    en: 'Riyadh, Saudi Arabia',
  });
  const [defaultLanguage, setDefaultLanguage] = useState<'ar' | 'en'>('ar');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: 'https://facebook.com/company',
    twitter: 'https://twitter.com/company',
    linkedin: 'https://linkedin.com/company/company',
    instagram: 'https://instagram.com/company',
    youtube: 'https://youtube.com/company',
  });

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    titleTemplate: { ar: '%s | الشركة', en: '%s | Company' },
    defaultTitle: { ar: 'الصفحة الرئيسية', en: 'Home' },
    defaultDescription: { ar: 'وصف الموقع الافتراضي', en: 'Default site description' },
    defaultKeywords: { ar: 'كلمات مفتاحية', en: 'keywords, seo' },
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemapEnabled: true,
    analyticsId: 'G-XXXXXXXXXX',
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'system',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    fontFamily: { ar: 'Noto Sans Arabic', en: 'Inter' },
    borderRadius: 'md',
    logoLight: '/images/logo-light.png',
    logoDark: '/images/logo-dark.png',
    favicon: '/favicon.ico',
  });

  // Feature Toggles
  const [features, setFeatures] = useState<FeatureToggle[]>([
    {
      id: 'blog',
      nameAr: 'المدونة',
      nameEn: 'Blog',
      descriptionAr: 'تفعيل قسم المدونة',
      descriptionEn: 'Enable blog section',
      enabled: true,
      category: 'content',
    },
    {
      id: 'portfolio',
      nameAr: 'معرض الأعمال',
      nameEn: 'Portfolio',
      descriptionAr: 'عرض المشاريع السابقة',
      descriptionEn: 'Show portfolio projects',
      enabled: true,
      category: 'content',
    },
    {
      id: 'testimonials',
      nameAr: 'آراء العملاء',
      nameEn: 'Testimonials',
      descriptionAr: 'عرض تقييمات العملاء',
      descriptionEn: 'Display client testimonials',
      enabled: true,
      category: 'content',
    },
    {
      id: 'newsletter',
      nameAr: 'النشرة البريدية',
      nameEn: 'Newsletter',
      descriptionAr: 'الاشتراك في النشرة البريدية',
      descriptionEn: 'Newsletter subscription',
      enabled: true,
      category: 'content',
    },
    {
      id: 'userRegistration',
      nameAr: 'تسجيل المستخدمين',
      nameEn: 'User Registration',
      descriptionAr: 'السماح بتسجيل مستخدمين جدد',
      descriptionEn: 'Allow new user registration',
      enabled: false,
      category: 'user',
    },
    {
      id: 'comments',
      nameAr: 'التعليقات',
      nameEn: 'Comments',
      descriptionAr: 'تفعيل التعليقات على المقالات',
      descriptionEn: 'Enable comments on posts',
      enabled: true,
      category: 'user',
    },
    {
      id: 'livechat',
      nameAr: 'الدردشة المباشرة',
      nameEn: 'Live Chat',
      descriptionAr: 'دردشة مباشرة مع الزوار',
      descriptionEn: 'Live chat with visitors',
      enabled: false,
      category: 'integration',
    },
    {
      id: 'analytics',
      nameAr: 'التحليلات',
      nameEn: 'Analytics',
      descriptionAr: 'تتبع زيارات الموقع',
      descriptionEn: 'Track website visits',
      enabled: true,
      category: 'integration',
    },
    {
      id: 'apiAccess',
      nameAr: 'API',
      nameEn: 'API Access',
      descriptionAr: 'الوصول للواجهة البرمجية',
      descriptionEn: 'API access for developers',
      enabled: false,
      category: 'advanced',
    },
    {
      id: 'caching',
      nameAr: 'التخزين المؤقت',
      nameEn: 'Caching',
      descriptionAr: 'تسريع تحميل الصفحات',
      descriptionEn: 'Speed up page loading',
      enabled: true,
      category: 'advanced',
    },
  ]);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    newMessageAlert: true,
    newSubscriberAlert: true,
    newContactAlert: true,
    weeklyReport: true,
    securityAlerts: true,
    emailDigest: 'daily',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorRequired: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: false,
    ipWhitelist: [],
    maintenanceMode: false,
  });

  const [newIp, setNewIp] = useState('');

  // Tabs
  const tabs: { id: TabType; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      labelAr: 'عام',
      labelEn: 'General',
      icon: <SettingsIcon className="size-5" />,
    },
    { id: 'seo', labelAr: 'محركات البحث', labelEn: 'SEO', icon: <Search className="size-5" /> },
    { id: 'theme', labelAr: 'المظهر', labelEn: 'Theme', icon: <Palette className="size-5" /> },
    { id: 'features', labelAr: 'الميزات', labelEn: 'Features', icon: <Globe className="size-5" /> },
    {
      id: 'notifications',
      labelAr: 'الإشعارات',
      labelEn: 'Notifications',
      icon: <Bell className="size-5" />,
    },
    { id: 'security', labelAr: 'الأمان', labelEn: 'Security', icon: <Shield className="size-5" /> },
  ];

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsService.getSettings();

      // Update all state from API data
      if (data.general) {
        setSiteName(data.general.siteName || { ar: '', en: '' });
        setSiteTagline(data.general.siteTagline || { ar: '', en: '' });
        setDefaultLanguage(data.general.defaultLanguage || 'ar');
        setTimezone(data.general.timezone || 'Asia/Riyadh');
        setDateFormat(data.general.dateFormat || 'DD/MM/YYYY');
      }
      if (data.contact) {
        setSiteEmail(data.contact.email || '');
        setSitePhone(data.contact.phone || '');
        setSiteAddress(data.contact.address || { ar: '', en: '' });
      }
      if (data.social) {
        setSocialMedia({
          facebook: data.social.facebook || '',
          twitter: data.social.twitter || '',
          linkedin: data.social.linkedin || '',
          instagram: data.social.instagram || '',
          youtube: data.social.youtube || '',
        });
      }
      if (data.seo) {
        setSeoSettings({
          titleTemplate: data.seo.titleTemplate || { ar: '', en: '' },
          defaultTitle: data.seo.defaultTitle || { ar: '', en: '' },
          defaultDescription: data.seo.defaultDescription || { ar: '', en: '' },
          defaultKeywords: data.seo.defaultKeywords || { ar: '', en: '' },
          ogImage: data.seo.ogImage || '',
          twitterCard: data.seo.twitterCard || 'summary_large_image',
          robotsTxt: data.seo.robotsTxt || '',
          sitemapEnabled: data.seo.sitemapEnabled ?? true,
          analyticsId: data.seo.analyticsId || '',
        });
      }
      if (data.theme) {
        setThemeSettings({
          mode: data.theme.mode || 'system',
          primaryColor: data.theme.primaryColor || '#3B82F6',
          secondaryColor: data.theme.secondaryColor || '#10B981',
          accentColor: data.theme.accentColor || '#F59E0B',
          fontFamily: data.theme.fontFamily || { ar: 'Noto Sans Arabic', en: 'Inter' },
          borderRadius: data.theme.borderRadius || 'md',
          logoLight: data.theme.logoLight || '',
          logoDark: data.theme.logoDark || '',
          favicon: '',
        });
      }
      if (data.features) {
        setFeatures(prev =>
          prev.map(f => ({
            ...f,
            enabled: data.features?.[f.id as keyof typeof data.features] ?? f.enabled,
          }))
        );
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load settings');
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const settingsData: Partial<SettingsData> = {
        general: {
          siteName,
          siteTagline,
          logo: '',
          favicon: themeSettings.favicon,
          defaultLanguage,
          timezone,
          dateFormat,
          maintenanceMode: securitySettings.maintenanceMode,
          maintenanceMessage: { ar: '', en: '' },
        },
        contact: {
          email: siteEmail,
          phone: sitePhone,
          address: siteAddress,
          workingHours: { ar: '', en: '' },
        },
        social: socialMedia,
        seo: seoSettings,
        theme: {
          mode: themeSettings.mode,
          primaryColor: themeSettings.primaryColor,
          secondaryColor: themeSettings.secondaryColor,
          accentColor: themeSettings.accentColor,
          fontFamily: themeSettings.fontFamily,
          borderRadius: themeSettings.borderRadius,
          logoLight: themeSettings.logoLight,
          logoDark: themeSettings.logoDark,
        },
        features: features.reduce(
          (acc, f) => ({ ...acc, [f.id]: f.enabled }),
          {}
        ) as SettingsData['features'],
      };

      await settingsService.updateSettings(settingsData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const addIpToWhitelist = () => {
    if (newIp && !securitySettings.ipWhitelist.includes(newIp)) {
      setSecuritySettings({
        ...securitySettings,
        ipWhitelist: [...securitySettings.ipWhitelist, newIp],
      });
      setNewIp('');
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSecuritySettings({
      ...securitySettings,
      ipWhitelist: securitySettings.ipWhitelist.filter(i => i !== ip),
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Site Information */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'معلومات الموقع' : 'Site Information'}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'اسم الموقع (عربي)' : 'Site Name (Arabic)'}
            </label>
            <input
              type="text"
              value={siteName.ar}
              onChange={e => setSiteName({ ...siteName, ar: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'اسم الموقع (إنجليزي)' : 'Site Name (English)'}
            </label>
            <input
              type="text"
              value={siteName.en}
              onChange={e => setSiteName({ ...siteName, en: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'شعار الموقع (عربي)' : 'Tagline (Arabic)'}
            </label>
            <input
              type="text"
              value={siteTagline.ar}
              onChange={e => setSiteTagline({ ...siteTagline, ar: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'شعار الموقع (إنجليزي)' : 'Tagline (English)'}
            </label>
            <input
              type="text"
              value={siteTagline.en}
              onChange={e => setSiteTagline({ ...siteTagline, en: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={siteEmail}
                onChange={e => setSiteEmail(e.target.value)}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'الهاتف' : 'Phone'}
            </label>
            <input
              type="tel"
              value={sitePhone}
              onChange={e => setSitePhone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'العنوان (عربي)' : 'Address (Arabic)'}
            </label>
            <input
              type="text"
              value={siteAddress.ar}
              onChange={e => setSiteAddress({ ...siteAddress, ar: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'العنوان (إنجليزي)' : 'Address (English)'}
            </label>
            <input
              type="text"
              value={siteAddress.en}
              onChange={e => setSiteAddress({ ...siteAddress, en: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'الإقليمية' : 'Localization'}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'اللغة الافتراضية' : 'Default Language'}
            </label>
            <select
              value={defaultLanguage}
              onChange={e => setDefaultLanguage(e.target.value as 'ar' | 'en')}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'المنطقة الزمنية' : 'Timezone'}
            </label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
              <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'تنسيق التاريخ' : 'Date Format'}
            </label>
            <select
              value={dateFormat}
              onChange={e => setDateFormat(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'وسائل التواصل الاجتماعي' : 'Social Media'}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Facebook</label>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-blue-600" />
              <input
                type="url"
                value={socialMedia.facebook}
                onChange={e => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Twitter</label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-blue-400" />
              <input
                type="url"
                value={socialMedia.twitter}
                onChange={e => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-blue-700" />
              <input
                type="url"
                value={socialMedia.linkedin}
                onChange={e => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Instagram</label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-pink-600" />
              <input
                type="url"
                value={socialMedia.instagram}
                onChange={e => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube</label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-red-600" />
              <input
                type="url"
                value={socialMedia.youtube}
                onChange={e => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      {/* Meta Tags */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'وسوم الميتا' : 'Meta Tags'}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'قالب العنوان (عربي)' : 'Title Template (Arabic)'}
              </label>
              <input
                type="text"
                value={seoSettings.titleTemplate.ar}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    titleTemplate: { ...seoSettings.titleTemplate, ar: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                placeholder="%s | اسم الموقع"
              />
              <p className="mt-1 text-xs text-gray-500">
                {isRTL ? 'استخدم %s للعنوان الديناميكي' : 'Use %s for dynamic title'}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'قالب العنوان (إنجليزي)' : 'Title Template (English)'}
              </label>
              <input
                type="text"
                value={seoSettings.titleTemplate.en}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    titleTemplate: { ...seoSettings.titleTemplate, en: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="%s | Site Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'الوصف الافتراضي (عربي)' : 'Default Description (Arabic)'}
              </label>
              <textarea
                value={seoSettings.defaultDescription.ar}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    defaultDescription: { ...seoSettings.defaultDescription, ar: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={3}
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'الوصف الافتراضي (إنجليزي)' : 'Default Description (English)'}
              </label>
              <textarea
                value={seoSettings.defaultDescription.en}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    defaultDescription: { ...seoSettings.defaultDescription, en: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'الكلمات المفتاحية (عربي)' : 'Keywords (Arabic)'}
              </label>
              <input
                type="text"
                value={seoSettings.defaultKeywords.ar}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    defaultKeywords: { ...seoSettings.defaultKeywords, ar: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                placeholder="كلمة1, كلمة2, كلمة3"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'الكلمات المفتاحية (إنجليزي)' : 'Keywords (English)'}
              </label>
              <input
                type="text"
                value={seoSettings.defaultKeywords.en}
                onChange={e =>
                  setSeoSettings({
                    ...seoSettings,
                    defaultKeywords: { ...seoSettings.defaultKeywords, en: e.target.value },
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'المشاركة الاجتماعية' : 'Social Sharing'}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'صورة Open Graph' : 'Open Graph Image'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={seoSettings.ogImage}
                onChange={e => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200">
                <Upload className="size-5" />
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'نوع بطاقة تويتر' : 'Twitter Card Type'}
            </label>
            <select
              value={seoSettings.twitterCard}
              onChange={e =>
                setSeoSettings({
                  ...seoSettings,
                  twitterCard: e.target.value as 'summary' | 'summary_large_image',
                })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technical SEO */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'SEO التقني' : 'Technical SEO'}</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">robots.txt</label>
            <textarea
              value={seoSettings.robotsTxt}
              onChange={e => setSeoSettings({ ...seoSettings, robotsTxt: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium">{isRTL ? 'خريطة الموقع' : 'Sitemap'}</p>
              <p className="text-sm text-gray-500">
                {isRTL ? 'توليد خريطة الموقع تلقائياً' : 'Auto-generate sitemap.xml'}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={seoSettings.sitemapEnabled}
                onChange={e => setSeoSettings({ ...seoSettings, sitemapEnabled: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'معرف Google Analytics' : 'Google Analytics ID'}
            </label>
            <input
              type="text"
              value={seoSettings.analyticsId}
              onChange={e => setSeoSettings({ ...seoSettings, analyticsId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-6">
      {/* Color Mode */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'وضع الألوان' : 'Color Mode'}</h3>
        <div className="flex gap-4">
          {[
            { id: 'light', labelAr: 'فاتح', labelEn: 'Light', icon: <Sun className="size-5" /> },
            { id: 'dark', labelAr: 'داكن', labelEn: 'Dark', icon: <Moon className="size-5" /> },
            {
              id: 'system',
              labelAr: 'النظام',
              labelEn: 'System',
              icon: <Monitor className="size-5" />,
            },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() =>
                setThemeSettings({ ...themeSettings, mode: mode.id as 'light' | 'dark' | 'system' })
              }
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                themeSettings.mode === mode.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {mode.icon}
              <span>{isRTL ? mode.labelAr : mode.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'الألوان' : 'Colors'}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'اللون الأساسي' : 'Primary Color'}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={themeSettings.primaryColor}
                onChange={e => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded"
              />
              <input
                type="text"
                value={themeSettings.primaryColor}
                onChange={e => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'اللون الثانوي' : 'Secondary Color'}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={themeSettings.secondaryColor}
                onChange={e =>
                  setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })
                }
                className="h-10 w-12 cursor-pointer rounded"
              />
              <input
                type="text"
                value={themeSettings.secondaryColor}
                onChange={e =>
                  setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })
                }
                className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'لون التأكيد' : 'Accent Color'}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={themeSettings.accentColor}
                onChange={e => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded"
              />
              <input
                type="text"
                value={themeSettings.accentColor}
                onChange={e => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'الخطوط' : 'Typography'}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'خط النصوص العربية' : 'Arabic Font'}
            </label>
            <select
              value={themeSettings.fontFamily.ar}
              onChange={e =>
                setThemeSettings({
                  ...themeSettings,
                  fontFamily: { ...themeSettings.fontFamily, ar: e.target.value },
                })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Noto Sans Arabic">Noto Sans Arabic</option>
              <option value="Cairo">Cairo</option>
              <option value="Tajawal">Tajawal</option>
              <option value="Almarai">Almarai</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'خط النصوص الإنجليزية' : 'English Font'}
            </label>
            <select
              value={themeSettings.fontFamily.en}
              onChange={e =>
                setThemeSettings({
                  ...themeSettings,
                  fontFamily: { ...themeSettings.fontFamily, en: e.target.value },
                })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'نصف قطر الحواف' : 'Border Radius'}</h3>
        <div className="flex gap-4">
          {[
            { id: 'none', label: '0' },
            { id: 'sm', label: '2px' },
            { id: 'md', label: '4px' },
            { id: 'lg', label: '8px' },
            { id: 'xl', label: '16px' },
          ].map(radius => (
            <button
              key={radius.id}
              onClick={() =>
                setThemeSettings({
                  ...themeSettings,
                  borderRadius: radius.id as ThemeSettings['borderRadius'],
                })
              }
              className={`flex-1 border-2 p-3 ${
                themeSettings.borderRadius === radius.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
              style={{ borderRadius: radius.id === 'none' ? '0' : radius.label }}
            >
              {radius.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo & Branding */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'الشعار والهوية' : 'Logo & Branding'}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'الشعار (فاتح)' : 'Logo (Light)'}
            </label>
            <div className="rounded-lg border-2 border-dashed p-4 text-center">
              <Upload className="mx-auto mb-2 size-8 text-gray-400" />
              <p className="text-sm text-gray-500">{isRTL ? 'رفع صورة' : 'Upload image'}</p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'الشعار (داكن)' : 'Logo (Dark)'}
            </label>
            <div className="rounded-lg border-2 border-dashed p-4 text-center">
              <Upload className="mx-auto mb-2 size-8 text-gray-400" />
              <p className="text-sm text-gray-500">{isRTL ? 'رفع صورة' : 'Upload image'}</p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Favicon</label>
            <div className="rounded-lg border-2 border-dashed p-4 text-center">
              <Upload className="mx-auto mb-2 size-8 text-gray-400" />
              <p className="text-sm text-gray-500">{isRTL ? 'رفع صورة' : 'Upload image'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatureToggles = () => {
    const categories = [
      { id: 'content', labelAr: 'المحتوى', labelEn: 'Content' },
      { id: 'user', labelAr: 'المستخدمين', labelEn: 'User' },
      { id: 'integration', labelAr: 'التكاملات', labelEn: 'Integrations' },
      { id: 'advanced', labelAr: 'متقدم', labelEn: 'Advanced' },
    ];

    return (
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">
              {isRTL ? category.labelAr : category.labelEn}
            </h3>
            <div className="space-y-3">
              {features
                .filter(f => f.category === category.id)
                .map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-medium">{isRTL ? feature.nameAr : feature.nameEn}</p>
                      <p className="text-sm text-gray-500">
                        {isRTL ? feature.descriptionAr : feature.descriptionEn}
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={feature.enabled}
                        onChange={() => toggleFeature(feature.id)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
        </h3>
        <div className="space-y-3">
          {[
            {
              key: 'emailNotifications',
              labelAr: 'تفعيل الإشعارات',
              labelEn: 'Enable notifications',
              descAr: 'استقبال إشعارات عبر البريد',
              descEn: 'Receive email notifications',
            },
            {
              key: 'newMessageAlert',
              labelAr: 'رسائل جديدة',
              labelEn: 'New messages',
              descAr: 'إشعار عند استلام رسالة جديدة',
              descEn: 'Alert when new message received',
            },
            {
              key: 'newSubscriberAlert',
              labelAr: 'مشتركين جدد',
              labelEn: 'New subscribers',
              descAr: 'إشعار عند اشتراك مستخدم جديد',
              descEn: 'Alert when new subscriber signs up',
            },
            {
              key: 'newContactAlert',
              labelAr: 'طلبات تواصل',
              labelEn: 'Contact requests',
              descAr: 'إشعار عند تقديم طلب تواصل',
              descEn: 'Alert when contact form submitted',
            },
            {
              key: 'weeklyReport',
              labelAr: 'تقرير أسبوعي',
              labelEn: 'Weekly report',
              descAr: 'ملخص أسبوعي لنشاط الموقع',
              descEn: 'Weekly site activity summary',
            },
            {
              key: 'securityAlerts',
              labelAr: 'تنبيهات أمنية',
              labelEn: 'Security alerts',
              descAr: 'إشعارات المحاولات المشبوهة',
              descEn: 'Suspicious activity notifications',
            },
          ].map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <div>
                <p className="font-medium">{isRTL ? item.labelAr : item.labelEn}</p>
                <p className="text-sm text-gray-500">{isRTL ? item.descAr : item.descEn}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'ملخص البريد' : 'Email Digest'}</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {isRTL ? 'تكرار الملخص' : 'Digest Frequency'}
          </label>
          <div className="flex gap-4">
            {[
              { value: 'none', labelAr: 'بدون', labelEn: 'None' },
              { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' },
              { value: 'weekly', labelAr: 'أسبوعي', labelEn: 'Weekly' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailDigest: option.value as NotificationSettings['emailDigest'],
                  })
                }
                className={`flex-1 rounded-lg border-2 p-3 ${
                  notificationSettings.emailDigest === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isRTL ? option.labelAr : option.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Authentication */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'المصادقة' : 'Authentication'}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium">
                {isRTL ? 'المصادقة الثنائية مطلوبة' : 'Two-Factor Required'}
              </p>
              <p className="text-sm text-gray-500">
                {isRTL ? 'إجبار المستخدمين على تفعيل 2FA' : 'Force users to enable 2FA'}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorRequired}
                onChange={e =>
                  setSecuritySettings({ ...securitySettings, twoFactorRequired: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'مهلة الجلسة (دقائق)' : 'Session Timeout (minutes)'}
              </label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={e =>
                  setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min="5"
                max="1440"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'محاولات الدخول القصوى' : 'Max Login Attempts'}
              </label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={e =>
                  setSecuritySettings({
                    ...securitySettings,
                    maxLoginAttempts: parseInt(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min="3"
                max="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'سياسة كلمة المرور' : 'Password Policy'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isRTL ? 'الحد الأدنى للطول' : 'Minimum Length'}
            </label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={e =>
                setSecuritySettings({
                  ...securitySettings,
                  passwordMinLength: parseInt(e.target.value),
                })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 md:w-48"
              min="6"
              max="32"
            />
          </div>
          <div className="space-y-3">
            {[
              {
                key: 'passwordRequireUppercase',
                labelAr: 'أحرف كبيرة مطلوبة',
                labelEn: 'Require uppercase letters',
              },
              {
                key: 'passwordRequireNumbers',
                labelAr: 'أرقام مطلوبة',
                labelEn: 'Require numbers',
              },
              {
                key: 'passwordRequireSpecial',
                labelAr: 'رموز خاصة مطلوبة',
                labelEn: 'Require special characters',
              },
            ].map(item => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <p className="font-medium">{isRTL ? item.labelAr : item.labelEn}</p>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={securitySettings[item.key as keyof SecuritySettings] as boolean}
                    onChange={e =>
                      setSecuritySettings({ ...securitySettings, [item.key]: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'قائمة IP المسموحة' : 'IP Whitelist'}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIp}
              onChange={e => setNewIp(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="192.168.1.1"
            />
            <button
              onClick={addIpToWhitelist}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isRTL ? 'إضافة' : 'Add'}
            </button>
          </div>
          {securitySettings.ipWhitelist.length > 0 ? (
            <div className="space-y-2">
              {securitySettings.ipWhitelist.map(ip => (
                <div
                  key={ip}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <span className="font-mono">{ip}</span>
                  <button
                    onClick={() => removeIpFromWhitelist(ip)}
                    className="text-red-600 hover:text-red-700"
                  >
                    {isRTL ? 'حذف' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {isRTL
                ? 'لم يتم إضافة عناوين IP. جميع العناوين مسموحة.'
                : 'No IPs added. All IPs allowed.'}
            </p>
          )}
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">{isRTL ? 'وضع الصيانة' : 'Maintenance Mode'}</h3>
        <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div>
            <p className="font-medium text-yellow-800">
              {isRTL ? 'تفعيل وضع الصيانة' : 'Enable Maintenance Mode'}
            </p>
            <p className="text-sm text-yellow-600">
              {isRTL ? 'الموقع سيكون غير متاح للزوار' : 'Site will be unavailable to visitors'}
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={securitySettings.maintenanceMode}
              onChange={e =>
                setSecuritySettings({ ...securitySettings, maintenanceMode: e.target.checked })
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-yellow-300"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}
      >
        <div className="text-center">
          <RefreshCw className="mx-auto size-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'الإعدادات' : 'Settings'}</h1>
            <p className="text-gray-500">
              {isRTL ? 'إدارة إعدادات الموقع' : 'Manage site settings'}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="size-5 animate-spin" /> : <Save className="size-5" />}
            {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle className="size-5" />
          {isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully'}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <Shield className="size-5" />
          {error}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="min-h-screen w-64 border-r bg-white p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                {activeTab === tab.id && (
                  <ChevronRight className={`size-5 ${isRTL ? 'rotate-180' : ''} ml-auto`} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'seo' && renderSEOSettings()}
          {activeTab === 'theme' && renderThemeSettings()}
          {activeTab === 'features' && renderFeatureToggles()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
        </div>
      </div>
    </div>
  );
}
