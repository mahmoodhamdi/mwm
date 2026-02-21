/**
 * JsonLd Component Tests
 * اختبارات مكون البيانات المنظمة JSON-LD
 */

import React from 'react';
import { render } from '@testing-library/react';
import {
  JsonLd,
  OrganizationJsonLd,
  WebsiteJsonLd,
  ArticleJsonLd,
  BreadcrumbJsonLd,
  ServiceJsonLd,
  FAQJsonLd,
  WebPageJsonLd,
  LocalBusinessJsonLd,
  ProductJsonLd,
} from '../JsonLd';

describe('JsonLd', () => {
  it('renders script tag with correct type', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Test' };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('renders JSON data correctly', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: 'MWM' };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Organization"');
    expect(script?.textContent).toContain('"name":"MWM"');
  });

  it('renders array of data', () => {
    const data = [
      { '@type': 'Organization', name: 'Org1' },
      { '@type': 'Organization', name: 'Org2' },
    ];
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('Org1');
    expect(script?.textContent).toContain('Org2');
  });
});

describe('OrganizationJsonLd', () => {
  it('renders organization schema', () => {
    const { container } = render(
      <OrganizationJsonLd
        name="MWM"
        description="Software company"
        url="https://mwm.com"
        logo="https://mwm.com/logo.png"
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Organization"');
    expect(script?.textContent).toContain('"name":"MWM"');
    expect(script?.textContent).toContain('"description":"Software company"');
  });

  it('includes optional contact information', () => {
    const { container } = render(
      <OrganizationJsonLd
        name="MWM"
        description="Software company"
        url="https://mwm.com"
        logo="https://mwm.com/logo.png"
        email="info@mwm.com"
        phone="+1234567890"
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"email":"info@mwm.com"');
    expect(script?.textContent).toContain('"telephone":"+1234567890"');
  });

  it('includes social profiles', () => {
    const { container } = render(
      <OrganizationJsonLd
        name="MWM"
        description="Software company"
        url="https://mwm.com"
        logo="https://mwm.com/logo.png"
        socialProfiles={['https://twitter.com/mwm', 'https://facebook.com/mwm']}
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('twitter.com/mwm');
    expect(script?.textContent).toContain('facebook.com/mwm');
  });

  it('includes address', () => {
    const { container } = render(
      <OrganizationJsonLd
        name="MWM"
        description="Software company"
        url="https://mwm.com"
        logo="https://mwm.com/logo.png"
        address={{ street: '123 Main St', city: 'Riyadh', country: 'SA' }}
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"PostalAddress"');
    expect(script?.textContent).toContain('"addressLocality":"Riyadh"');
  });
});

describe('WebsiteJsonLd', () => {
  it('renders website schema', () => {
    const { container } = render(<WebsiteJsonLd name="MWM" url="https://mwm.com" />);

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"WebSite"');
    expect(script?.textContent).toContain('"name":"MWM"');
  });

  it('includes search action when searchUrl provided', () => {
    const { container } = render(
      <WebsiteJsonLd
        name="MWM"
        url="https://mwm.com"
        searchUrl="https://mwm.com/search?q={search_term_string}"
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"SearchAction"');
    expect(script?.textContent).toContain('potentialAction');
  });
});

describe('ArticleJsonLd', () => {
  it('renders article schema', () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="Article description"
        url="https://mwm.com/blog/test"
        publishedTime="2024-01-01T00:00:00Z"
        author="John Doe"
        publisher={{ name: 'MWM', logo: 'https://mwm.com/logo.png' }}
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Article"');
    expect(script?.textContent).toContain('"headline":"Test Article"');
    expect(script?.textContent).toContain('"@type":"Person"');
    expect(script?.textContent).toContain('"name":"John Doe"');
  });

  it('includes modified time', () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="Article description"
        url="https://mwm.com/blog/test"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime="2024-01-02T00:00:00Z"
        author="John Doe"
        publisher={{ name: 'MWM', logo: 'https://mwm.com/logo.png' }}
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"dateModified":"2024-01-02T00:00:00Z"');
  });
});

describe('BreadcrumbJsonLd', () => {
  it('renders breadcrumb schema', () => {
    const items = [
      { name: 'Home', url: 'https://mwm.com' },
      { name: 'Blog', url: 'https://mwm.com/blog' },
      { name: 'Post', url: 'https://mwm.com/blog/post' },
    ];

    const { container } = render(<BreadcrumbJsonLd items={items} />);

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"BreadcrumbList"');
    expect(script?.textContent).toContain('"position":1');
    expect(script?.textContent).toContain('"position":2');
    expect(script?.textContent).toContain('"position":3');
  });
});

describe('ServiceJsonLd', () => {
  it('renders service schema', () => {
    const { container } = render(
      <ServiceJsonLd
        name="Web Development"
        description="Custom web development services"
        url="https://mwm.com/services/web"
        provider={{ name: 'MWM', url: 'https://mwm.com' }}
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Service"');
    expect(script?.textContent).toContain('"name":"Web Development"');
  });
});

describe('FAQJsonLd', () => {
  it('renders FAQ schema', () => {
    const questions = [
      { question: 'What is MWM?', answer: 'Software company' },
      { question: 'Where are you located?', answer: 'Riyadh' },
    ];

    const { container } = render(<FAQJsonLd questions={questions} />);

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"FAQPage"');
    expect(script?.textContent).toContain('"@type":"Question"');
    expect(script?.textContent).toContain('What is MWM?');
  });
});

describe('WebPageJsonLd', () => {
  it('renders webpage schema', () => {
    const { container } = render(
      <WebPageJsonLd name="About Us" description="About MWM" url="https://mwm.com/about" />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"WebPage"');
  });
});

describe('LocalBusinessJsonLd', () => {
  it('renders local business schema', () => {
    const { container } = render(
      <LocalBusinessJsonLd name="MWM Office" description="Software company" url="https://mwm.com" />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"LocalBusiness"');
  });
});

describe('ProductJsonLd', () => {
  it('renders product schema', () => {
    const { container } = render(
      <ProductJsonLd name="Web Package" description="Complete web solution" />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Product"');
  });

  it('includes price information', () => {
    const { container } = render(
      <ProductJsonLd
        name="Web Package"
        description="Complete web solution"
        price={5000}
        currency="SAR"
      />
    );

    const script = container.querySelector('script');
    expect(script?.textContent).toContain('"@type":"Offer"');
    expect(script?.textContent).toContain('"price":5000');
    expect(script?.textContent).toContain('"priceCurrency":"SAR"');
  });
});
