/**
 * Sitemap Generation
 * إنشاء خريطة الموقع
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const locales = ['ar', 'en'];

// Static pages
const staticPages = [
  { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/blog', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/careers', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/team', changeFrequency: 'monthly' as const, priority: 0.6 },
];

async function fetchSlugs(endpoint: string, key: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/${endpoint}?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.data?.[key] || [];
    return items.map((item: { slug: string }) => item.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Fetch dynamic slugs in parallel
  const [projectSlugs, blogSlugs, serviceSlugs] = await Promise.all([
    fetchSlugs('projects', 'projects'),
    fetchSlugs('blog', 'posts'),
    fetchSlugs('services', 'services'),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for all locales
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar${page.path}`,
            en: `${SITE_URL}/en${page.path}`,
          },
        },
      });
    }
  }

  // Dynamic project pages
  for (const locale of locales) {
    for (const slug of projectSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/projects/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/projects/${slug}`,
            en: `${SITE_URL}/en/projects/${slug}`,
          },
        },
      });
    }
  }

  // Dynamic blog posts
  for (const locale of locales) {
    for (const slug of blogSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/blog/${slug}`,
            en: `${SITE_URL}/en/blog/${slug}`,
          },
        },
      });
    }
  }

  // Dynamic service pages
  for (const locale of locales) {
    for (const slug of serviceSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/services/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/services/${slug}`,
            en: `${SITE_URL}/en/services/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
