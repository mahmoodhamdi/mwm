/**
 * Sitemap Generation
 * إنشاء خريطة الموقع
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';

// Static pages for the sitemap
const staticPages = ['', '/about', '/services', '/portfolio', '/blog', '/careers', '/contact'];

// Locales
const locales = ['ar', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages for all locales
  const staticRoutes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      staticRoutes.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar${page}`,
            en: `${SITE_URL}/en${page}`,
          },
        },
      });
    }
  }

  // Services pages (static for now, can be dynamic from API)
  const services = [
    'web-development',
    'mobile-development',
    'ui-ux-design',
    'cloud-solutions',
    'digital-marketing',
    'data-analytics',
    'cybersecurity',
    'ai-ml-solutions',
    'erp-solutions',
    'ecommerce',
    'maintenance-support',
    'consulting',
  ];

  const serviceRoutes: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const service of services) {
      serviceRoutes.push({
        url: `${SITE_URL}/${locale}/services/${service}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/services/${service}`,
            en: `${SITE_URL}/en/services/${service}`,
          },
        },
      });
    }
  }

  // Admin routes (lower priority, might be excluded in production)
  const adminRoutes: MetadataRoute.Sitemap = [];
  if (process.env.NODE_ENV === 'development') {
    const adminPages = [
      '/admin/dashboard',
      '/admin/users',
      '/admin/content',
      '/admin/services',
      '/admin/projects',
      '/admin/team',
      '/admin/settings',
      '/admin/translations',
      '/admin/menus',
      '/admin/blog',
      '/admin/careers',
      '/admin/analytics',
      '/admin/notifications',
    ];

    for (const page of adminPages) {
      adminRoutes.push({
        url: `${SITE_URL}/en${page}`,
        lastModified: currentDate,
        changeFrequency: 'yearly',
        priority: 0.1,
      });
    }
  }

  return [...staticRoutes, ...serviceRoutes, ...adminRoutes];
}
