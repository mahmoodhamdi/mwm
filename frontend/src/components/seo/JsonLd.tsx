/**
 * JSON-LD Structured Data Components
 * مكونات البيانات المنظمة
 */

interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  logo: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  socialProfiles?: string[];
}

interface ServiceSchema {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
  category?: string;
}

interface ArticleSchema {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}

interface FAQSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface WebPageSchema {
  name: string;
  description: string;
  url: string;
  image?: string;
}

/**
 * Organization JSON-LD
 */
export function OrganizationJsonLd({
  name,
  description,
  url,
  logo,
  email,
  phone,
  address,
  socialProfiles = [],
}: OrganizationSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressCountry: address.country,
      },
    }),
    ...(socialProfiles.length > 0 && { sameAs: socialProfiles }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      ...(email && { email }),
      ...(phone && { telephone: phone }),
      availableLanguage: ['Arabic', 'English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Service JSON-LD
 */
export function ServiceJsonLd({
  name,
  description,
  provider,
  url,
  image,
  category,
}: ServiceSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
    },
    url,
    ...(image && { image }),
    ...(category && { category }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article JSON-LD (for blog posts)
 */
export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
}: ArticleSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: {
      '@type': 'ImageObject',
      url: image,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ JSON-LD
 */
export function FAQJsonLd({ questions }: FAQSchema) {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb JSON-LD
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbSchema) {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebPage JSON-LD
 */
export function WebPageJsonLd({ name, description, url, image }: WebPageSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LocalBusiness JSON-LD
 */
interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  logo: string;
  image?: string;
  email?: string;
  phone?: string;
  priceRange?: string;
  address: {
    street: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  logo,
  image,
  email,
  phone,
  priceRange,
  address,
  geo,
  openingHours,
}: LocalBusinessSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    logo,
    ...(image && { image }),
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(priceRange && { priceRange }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      ...(address.region && { addressRegion: address.region }),
      ...(address.postalCode && { postalCode: address.postalCode }),
      addressCountry: address.country,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(openingHours && { openingHours }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Product JSON-LD (for services as products)
 */
interface ProductSchema {
  name: string;
  description: string;
  image: string;
  brand: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
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
  url,
}: ProductSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    ...(sku && { sku }),
    url,
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
