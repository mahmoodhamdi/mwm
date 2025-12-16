/**
 * SEO Utilities
 * أدوات تحسين محركات البحث
 */

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';
const SITE_NAME = 'MWM - Integrated Software Solutions';

interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  locale?: 'ar' | 'en';
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

/**
 * Generate page metadata for SEO
 * إنشاء بيانات التعريف للصفحة
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/images/og-default.jpg',
    locale = 'en',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
  } = options;

  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: fullTitle,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        ar: `${SITE_URL}/ar`,
        en: `${SITE_URL}/en`,
      },
    },
  };
}

/**
 * Organization Schema for structured data
 * مخطط المؤسسة للبيانات المنظمة
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/mwm',
      'https://twitter.com/mwm',
      'https://www.linkedin.com/company/mwm',
      'https://www.instagram.com/mwm',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966-XX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
    },
  };
}

/**
 * WebSite Schema for structured data
 * مخطط الموقع للبيانات المنظمة
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Service Schema for structured data
 * مخطط الخدمة للبيانات المنظمة
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  image?: string;
  url: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: service.image ? `${SITE_URL}${service.image}` : undefined,
    url: `${SITE_URL}${service.url}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    serviceType: service.category,
  };
}

/**
 * Article Schema for blog posts
 * مخطط المقالة للمدونة
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${SITE_URL}${article.image}` : undefined,
    url: `${SITE_URL}${article.url}`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    articleSection: article.category,
  };
}

/**
 * Project/Portfolio Schema
 * مخطط المشروع/المعرض
 */
export function generateProjectSchema(project: {
  name: string;
  description: string;
  image?: string;
  url: string;
  client?: string;
  technologies?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    image: project.image ? `${SITE_URL}${project.image}` : undefined,
    url: `${SITE_URL}${project.url}`,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    ...(project.client && {
      accountablePerson: project.client,
    }),
    ...(project.technologies && {
      keywords: project.technologies.join(', '),
    }),
  };
}

/**
 * Job Posting Schema
 * مخطط إعلان الوظيفة
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  location?: string;
  remote?: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Remote',
        addressCountry: 'SA',
      },
    },
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
    ...(job.salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary.currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary.min,
          maxValue: job.salary.max,
          unitText: 'MONTH',
        },
      },
    }),
  };
}

/**
 * BreadcrumbList Schema
 * مخطط قائمة التنقل
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * FAQ Schema
 * مخطط الأسئلة الشائعة
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

const seoUtils = {
  generateMetadata,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateProjectSchema,
  generateJobPostingSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
};

export default seoUtils;
