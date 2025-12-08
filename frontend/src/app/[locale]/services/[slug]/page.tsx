/**
 * Service Detail Page
 * صفحة تفاصيل الخدمة
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { FAQAccordion, PricingCard, ProcessSteps, ServiceCard } from '@/components/services';
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import { Container, Spinner } from '@/components/ui';
import { CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';

// Types
interface BilingualText {
  ar: string;
  en: string;
}

interface ServiceFeature {
  title: BilingualText;
  description: BilingualText;
  icon?: string;
}

interface PricingPlan {
  name: BilingualText;
  description?: BilingualText;
  price: number;
  currency?: string;
  period?: string;
  features: BilingualText[];
  isPopular?: boolean;
  order: number;
}

interface FAQ {
  question: BilingualText;
  answer: BilingualText;
  order: number;
}

interface ProcessStep {
  title: BilingualText;
  description: BilingualText;
  icon?: string;
  order: number;
}

interface Service {
  _id: string;
  title: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  category?: { _id: string; name: BilingualText; slug: string } | null;
  icon?: string;
  image?: string;
  features: ServiceFeature[];
  pricingPlans?: PricingPlan[];
  faqs?: FAQ[];
  processSteps?: ProcessStep[];
  technologies?: string[];
  isActive: boolean;
  isFeatured: boolean;
}

// Fetch service by slug
async function getService(slug: string): Promise<Service | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/services/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data?.service || null;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// Fetch related services
async function getRelatedServices(currentSlug: string): Promise<Service[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/services?limit=4`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const services = data.data?.services || [];
    return services.filter((s: Service) => s.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related services:', error);
    return [];
  }
}

// Generate metadata
export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const title = service.title[locale as 'ar' | 'en'];
  const description = service.shortDescription[locale as 'ar' | 'en'];

  return {
    title: `${title} | MWM`,
    description,
    openGraph: {
      title: `${title} | MWM`,
      description,
      images: service.image ? [service.image] : undefined,
    },
  };
}

// Service Content Component
async function ServiceContent({ slug, locale }: { slug: string; locale: string }) {
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

  const service = await getService(slug);
  const relatedServices = await getRelatedServices(slug);

  if (!service) {
    notFound();
  }

  const title = service.title[locale as 'ar' | 'en'];
  const description = service.description[locale as 'ar' | 'en'];
  const shortDescription = service.shortDescription[locale as 'ar' | 'en'];
  const features = service.features || [];
  const pricingPlans = service.pricingPlans || [];
  const faqs = service.faqs || [];
  const processSteps = service.processSteps || [];

  return (
    <>
      {/* Structured Data */}
      <ServiceJsonLd
        name={title}
        description={shortDescription}
        provider={{ name: 'MWM - Integrated Software Solutions', url: 'https://mwm.com' }}
        url={`https://mwm.com/${locale}/services/${slug}`}
      />
      {faqs.length > 0 && (
        <FAQJsonLd
          questions={faqs.map(faq => ({
            question: faq.question[locale as 'ar' | 'en'],
            answer: faq.answer[locale as 'ar' | 'en'],
          }))}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: isRTL ? 'الرئيسية' : 'Home', url: `https://mwm.com/${locale}` },
          { name: isRTL ? 'الخدمات' : 'Services', url: `https://mwm.com/${locale}/services` },
          { name: title, url: `https://mwm.com/${locale}/services/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {/* Breadcrumb */}
            <nav className="text-primary-200 mb-6 flex items-center justify-center gap-2 text-sm">
              <Link href="/" className="hover:text-white">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white">
                {isRTL ? 'الخدمات' : 'Services'}
              </Link>
              <span>/</span>
              <span className="text-white">{title}</span>
            </nav>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
            <p className="text-primary-100 text-lg md:text-xl">{shortDescription}</p>
          </div>
        </Container>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-16">
          <Container>
            <div className="mx-auto max-w-4xl">
              <div
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'ما نقدمه' : 'What We Offer'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
                >
                  <CheckCircleIcon className="text-primary-500 size-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feature.title[locale as 'ar' | 'en']}
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {feature.description[locale as 'ar' | 'en']}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Process Steps Section */}
      {processSteps.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'كيف نعمل' : 'How We Work'}
            </h2>
            <ProcessSteps
              steps={processSteps
                .sort((a, b) => a.order - b.order)
                .map(step => ({
                  title: step.title[locale as 'ar' | 'en'],
                  description: step.description[locale as 'ar' | 'en'],
                  icon: step.icon,
                }))}
              variant="horizontal"
            />
          </Container>
        </section>
      )}

      {/* Pricing Section */}
      {pricingPlans.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'باقات الأسعار' : 'Pricing Plans'}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300">
              {isRTL ? 'اختر الباقة المناسبة لاحتياجاتك' : 'Choose the plan that fits your needs'}
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {pricingPlans
                .sort((a, b) => a.order - b.order)
                .map((plan, index) => (
                  <PricingCard
                    key={index}
                    name={plan.name[locale as 'ar' | 'en']}
                    description={plan.description?.[locale as 'ar' | 'en']}
                    price={plan.price}
                    features={plan.features.map(f => f[locale as 'ar' | 'en'])}
                    isPopular={plan.isPopular}
                    ctaLink="/contact"
                    variant="default"
                  />
                ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="mx-auto max-w-3xl">
              <FAQAccordion
                items={faqs
                  .sort((a, b) => a.order - b.order)
                  .map(faq => ({
                    question: faq.question[locale as 'ar' | 'en'],
                    answer: faq.answer[locale as 'ar' | 'en'],
                  }))}
                variant="separated"
              />
            </div>
          </Container>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'خدمات أخرى' : 'Other Services'}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedServices.map(relatedService => (
                <ServiceCard
                  key={relatedService._id}
                  title={relatedService.title[locale as 'ar' | 'en']}
                  description={relatedService.shortDescription[locale as 'ar' | 'en']}
                  slug={relatedService.slug}
                  icon={relatedService.icon || 'code'}
                  variant="compact"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {isRTL ? 'جاهز لبدء مشروعك؟' : 'Ready to start your project?'}
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              {isRTL
                ? 'تواصل معنا اليوم للحصول على استشارة مجانية'
                : 'Contact us today for a free consultation'}
            </p>
            <Link
              href="/contact"
              className="text-primary-600 hover:bg-primary-50 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold transition-colors"
            >
              <span>{tCommon('contactUs')}</span>
              <ArrowIcon className="size-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

// Loading Component
function ServiceLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<ServiceLoading />}>
        <ServiceContent slug={slug} locale={locale} />
      </Suspense>
    </main>
  );
}
