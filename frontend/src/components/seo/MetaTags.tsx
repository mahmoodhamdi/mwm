/**
 * Meta Tags Component
 * مكون وسوم الميتا
 */

import { Metadata } from 'next';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * Generate metadata for pages
 * This function should be used in page.tsx files to generate metadata
 */
export function generateMetaTags({
  title,
  description,
  keywords = [],
  image,
  url,
  locale = 'ar',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noIndex = false,
  noFollow = false,
}: MetaTagsProps): Metadata {
  const siteName = 'MWM - Integrated Software Solutions';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';
  const defaultImage = `${siteUrl}/og-image.png`;

  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || defaultImage;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    alternates: {
      canonical: fullUrl,
      languages: {
        ar: `${siteUrl}/ar${url || ''}`,
        en: `${siteUrl}/en${url || ''}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    };
  }

  return metadata;
}

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com'),
  title: {
    default: 'MWM - Integrated Software Solutions',
    template: '%s | MWM',
  },
  description: 'A company specialized in software development and integrated digital solutions',
  keywords: [
    'software development',
    'web development',
    'mobile apps',
    'digital solutions',
    'تطوير برمجيات',
    'تطوير مواقع',
    'تطبيقات موبايل',
  ],
  authors: [{ name: 'MWM' }],
  creator: 'MWM',
  publisher: 'MWM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    siteName: 'MWM - Integrated Software Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@mwm',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
