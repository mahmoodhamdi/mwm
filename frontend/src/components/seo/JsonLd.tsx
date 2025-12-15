/**
 * JSON-LD Structured Data Component
 * مكون البيانات المنظمة JSON-LD
 */

import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Component to inject JSON-LD structured data into the page
 * مكون لإدراج البيانات المنظمة في الصفحة
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * Multiple JSON-LD schemas wrapper
 * غلاف لمخططات JSON-LD متعددة
 */
export function MultipleJsonLd({ schemas }: { schemas: Record<string, unknown>[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
    </>
  );
}

/**
 * Organization JSON-LD Schema Component
 * مكون مخطط المؤسسة JSON-LD
 */
interface OrganizationJsonLdProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  socialProfiles?: string[];
}

export function OrganizationJsonLd({
  name,
  description,
  url,
  logo,
  email,
  phone,
  address,
  socialProfiles,
}: OrganizationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(socialProfiles && socialProfiles.length > 0 && { sameAs: socialProfiles }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.country && { addressCountry: address.country }),
      },
    }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
      ...(phone && { telephone: phone }),
      ...(email && { email }),
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * Website JSON-LD Schema Component
 * مكون مخطط الموقع JSON-LD
 */
interface WebsiteJsonLdProps {
  name: string;
  url: string;
  searchUrl?: string;
}

export function WebsiteJsonLd({ name, url, searchUrl }: WebsiteJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return <JsonLd data={schema} />;
}

/**
 * Article JSON-LD Schema Component
 * مكون مخطط المقالة JSON-LD
 */
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  publisher: {
    name: string;
    logo: string;
  };
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  publisher,
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: publisher.logo,
      },
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * Breadcrumb JSON-LD Schema Component
 * مكون مخطط التنقل JSON-LD
 */
interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * Service JSON-LD Schema Component
 * مكون مخطط الخدمة JSON-LD
 */
interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  provider: {
    name: string;
    url: string;
  };
  category?: string;
}

export function ServiceJsonLd({
  name,
  description,
  url,
  image,
  provider,
  category,
}: ServiceJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    ...(image && { image }),
    ...(category && { serviceType: category }),
    provider: {
      '@type': 'Organization',
      name: provider.name,
      url: provider.url,
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * FAQ JSON-LD Schema Component
 * مكون مخطط الأسئلة الشائعة JSON-LD
 */
interface FAQJsonLdProps {
  questions: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * WebPage JSON-LD Schema Component
 * مكون مخطط صفحة الويب JSON-LD
 */
interface WebPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
}

export function WebPageJsonLd({ name, description, url, image }: WebPageJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(image && { image }),
  };

  return <JsonLd data={schema} />;
}

/**
 * LocalBusiness JSON-LD Schema Component
 * مكون مخطط الأعمال المحلية JSON-LD
 */
interface LocalBusinessJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  openingHours?: string[];
  priceRange?: string;
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  image,
  phone,
  email,
  address,
  openingHours,
  priceRange,
}: LocalBusinessJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    ...(image && { image }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(priceRange && { priceRange }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.region && { addressRegion: address.region }),
        ...(address.postalCode && { postalCode: address.postalCode }),
        ...(address.country && { addressCountry: address.country }),
      },
    }),
  };

  return <JsonLd data={schema} />;
}

/**
 * Product JSON-LD Schema Component
 * مكون مخطط المنتج JSON-LD
 */
interface ProductJsonLdProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: {
    value: number;
    count: number;
  };
}

export function ProductJsonLd({
  name,
  description,
  image,
  brand,
  sku,
  price,
  currency = 'SAR',
  availability = 'InStock',
  rating,
}: ProductJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(image && { image }),
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand,
      },
    }),
    ...(sku && { sku }),
  };

  if (price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    };
  }

  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
    };
  }

  return <JsonLd data={schema} />;
}

export default JsonLd;
