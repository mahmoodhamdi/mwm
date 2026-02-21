/**
 * MetaTags Component Tests
 * اختبارات مكون وسوم الميتا
 */

import { generateMetaTags, defaultMetadata } from '../MetaTags';

describe('generateMetaTags', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SITE_URL: 'https://mwm.com',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('generates metadata with title and description', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(metadata.title).toBe('Test Page | MWM - Integrated Software Solutions');
    expect(metadata.description).toBe('Test description');
  });

  it('generates OpenGraph metadata', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      url: '/test',
    });

    expect(metadata.openGraph).toMatchObject({
      title: 'Test Page | MWM - Integrated Software Solutions',
      description: 'Test description',
      url: 'https://mwm.com/test',
      siteName: 'MWM - Integrated Software Solutions',
      type: 'website',
    });
  });

  it('generates Twitter metadata', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Test Page | MWM - Integrated Software Solutions',
      description: 'Test description',
    });
  });

  it('includes keywords when provided', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      keywords: ['software', 'development', 'web'],
    });

    expect(metadata.keywords).toBe('software, development, web');
  });

  it('includes author when provided', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      author: 'John Doe',
    });

    expect(metadata.authors).toEqual([{ name: 'John Doe' }]);
  });

  it('generates canonical URL correctly', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      url: '/about',
    });

    expect(metadata.alternates?.canonical).toBe('https://mwm.com/about');
  });

  it('generates alternate language URLs', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      url: '/about',
    });

    expect(metadata.alternates?.languages).toEqual({
      ar: 'https://mwm.com/ar/about',
      en: 'https://mwm.com/en/about',
    });
  });

  it('uses Arabic locale when specified', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      locale: 'ar',
    });

    expect(metadata.openGraph?.locale).toBe('ar_SA');
  });

  it('uses English locale by default', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      locale: 'en',
    });

    expect(metadata.openGraph?.locale).toBe('en_US');
  });

  it('includes custom image when provided', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      image: 'https://mwm.com/custom-image.jpg',
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://mwm.com/custom-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Test Page',
      },
    ]);
  });

  it('uses default OG image when not provided', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://mwm.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Test Page',
      },
    ]);
  });

  it('sets article type metadata', () => {
    const metadata = generateMetaTags({
      title: 'Blog Post',
      description: 'Blog description',
      type: 'article',
      publishedTime: '2024-01-01T00:00:00Z',
      modifiedTime: '2024-01-02T00:00:00Z',
      author: 'John Doe',
      section: 'Technology',
      tags: ['software', 'development'],
    });

    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2024-01-01T00:00:00Z',
      modifiedTime: '2024-01-02T00:00:00Z',
      authors: ['John Doe'],
      section: 'Technology',
      tags: ['software', 'development'],
    });
  });

  it('sets noIndex and noFollow robots meta', () => {
    const metadata = generateMetaTags({
      title: 'Private Page',
      description: 'Private description',
      noIndex: true,
      noFollow: true,
    });

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it('allows indexing and following by default', () => {
    const metadata = generateMetaTags({
      title: 'Public Page',
      description: 'Public description',
    });

    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
  });

  it('includes googleBot specific settings', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(metadata.robots?.googleBot).toMatchObject({
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    });
  });

  it('uses site URL from environment variable', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      url: '/about',
    });

    expect(metadata.alternates?.canonical).toBe('https://mwm.com/about');
  });

  it('falls back to default site URL when env is not set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      url: '/about',
    });

    expect(metadata.alternates?.canonical).toBe('https://mwm.com/about');
  });
});

describe('defaultMetadata', () => {
  it('has correct default title structure', () => {
    expect(defaultMetadata.title).toEqual({
      default: 'MWM - Integrated Software Solutions',
      template: '%s | MWM',
    });
  });

  it('has default description', () => {
    expect(defaultMetadata.description).toBe(
      'A company specialized in software development and integrated digital solutions'
    );
  });

  it('includes default keywords', () => {
    expect(defaultMetadata.keywords).toContain('software development');
    expect(defaultMetadata.keywords).toContain('تطوير برمجيات');
  });

  it('has OpenGraph configuration', () => {
    expect(defaultMetadata.openGraph).toMatchObject({
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      siteName: 'MWM - Integrated Software Solutions',
    });
  });

  it('has Twitter card configuration', () => {
    expect(defaultMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      creator: '@mwm',
    });
  });

  it('has robots configuration', () => {
    expect(defaultMetadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
  });

  it('includes icon paths', () => {
    expect(defaultMetadata.icons).toMatchObject({
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    });
  });

  it('includes manifest path', () => {
    expect(defaultMetadata.manifest).toBe('/site.webmanifest');
  });

  it('has format detection disabled', () => {
    expect(defaultMetadata.formatDetection).toMatchObject({
      email: false,
      address: false,
      telephone: false,
    });
  });
});
