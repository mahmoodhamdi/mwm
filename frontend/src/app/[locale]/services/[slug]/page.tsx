/**
 * Service Detail Page
 * صفحة تفاصيل الخدمة
 */

import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { FAQAccordion, PricingCard, ProcessSteps, ServiceCard } from '@/components/services';
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import { Container } from '@/components/ui';
import { CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Static service data (will be replaced with API call)
const servicesData: Record<
  string,
  {
    icon: string;
    features: { ar: string; en: string }[];
    pricingPlans?: {
      name: { ar: string; en: string };
      description?: { ar: string; en: string };
      price: number;
      features: { ar: string; en: string }[];
      isPopular?: boolean;
    }[];
    faqs?: { question: { ar: string; en: string }; answer: { ar: string; en: string } }[];
    processSteps?: {
      title: { ar: string; en: string };
      description: { ar: string; en: string };
      icon?: string;
    }[];
  }
> = {
  'web-development': {
    icon: 'code',
    features: [
      { ar: 'مواقع ويب متجاوبة وحديثة', en: 'Responsive and modern websites' },
      { ar: 'تطوير React و Next.js', en: 'React and Next.js development' },
      { ar: 'تحسين محركات البحث SEO', en: 'SEO optimization' },
      { ar: 'دعم فني وصيانة', en: 'Technical support and maintenance' },
    ],
    pricingPlans: [
      {
        name: { ar: 'الأساسية', en: 'Basic' },
        description: { ar: 'للمشاريع الصغيرة', en: 'For small projects' },
        price: 5000,
        features: [
          { ar: 'صفحة واحدة', en: 'Single page' },
          { ar: 'تصميم متجاوب', en: 'Responsive design' },
          { ar: 'دعم لمدة شهر', en: '1 month support' },
        ],
      },
      {
        name: { ar: 'المتقدمة', en: 'Professional' },
        description: { ar: 'للأعمال المتوسطة', en: 'For medium businesses' },
        price: 15000,
        features: [
          { ar: 'حتى 10 صفحات', en: 'Up to 10 pages' },
          { ar: 'لوحة تحكم CMS', en: 'CMS dashboard' },
          { ar: 'تحسين SEO', en: 'SEO optimization' },
          { ar: 'دعم لمدة 3 أشهر', en: '3 months support' },
        ],
        isPopular: true,
      },
      {
        name: { ar: 'المؤسسية', en: 'Enterprise' },
        description: { ar: 'للشركات الكبيرة', en: 'For large enterprises' },
        price: 50000,
        features: [
          { ar: 'صفحات غير محدودة', en: 'Unlimited pages' },
          { ar: 'نظام متكامل', en: 'Full system' },
          { ar: 'API مخصصة', en: 'Custom API' },
          { ar: 'دعم سنوي', en: 'Yearly support' },
        ],
      },
    ],
    faqs: [
      {
        question: {
          ar: 'كم يستغرق تطوير موقع ويب؟',
          en: 'How long does it take to develop a website?',
        },
        answer: {
          ar: 'يعتمد ذلك على حجم المشروع. المواقع البسيطة تستغرق 2-4 أسابيع، بينما المشاريع الكبيرة قد تستغرق 2-3 أشهر.',
          en: 'It depends on the project size. Simple websites take 2-4 weeks, while larger projects may take 2-3 months.',
        },
      },
      {
        question: {
          ar: 'هل تقدمون الدعم بعد التسليم؟',
          en: 'Do you provide support after delivery?',
        },
        answer: {
          ar: 'نعم، نقدم دعم فني وصيانة حسب الباقة المختارة، مع إمكانية تمديد فترة الدعم.',
          en: 'Yes, we provide technical support and maintenance according to the chosen plan, with the option to extend.',
        },
      },
    ],
    processSteps: [
      {
        title: { ar: 'التحليل والتخطيط', en: 'Analysis & Planning' },
        description: {
          ar: 'نفهم متطلباتك ونضع خطة تفصيلية',
          en: 'We understand your requirements and create a detailed plan',
        },
        icon: 'clipboard',
      },
      {
        title: { ar: 'التصميم', en: 'Design' },
        description: {
          ar: 'نصمم واجهات مستخدم جذابة ومتجاوبة',
          en: 'We design attractive and responsive UI',
        },
        icon: 'design',
      },
      {
        title: { ar: 'التطوير', en: 'Development' },
        description: {
          ar: 'نبني موقعك باستخدام أحدث التقنيات',
          en: 'We build your site using latest technologies',
        },
        icon: 'code',
      },
      {
        title: { ar: 'الإطلاق', en: 'Launch' },
        description: {
          ar: 'نختبر ونطلق موقعك بنجاح',
          en: 'We test and launch your site successfully',
        },
        icon: 'rocket',
      },
    ],
  },
  'mobile-development': {
    icon: 'mobile',
    features: [
      { ar: 'تطبيقات iOS و Android', en: 'iOS and Android apps' },
      { ar: 'تطوير React Native', en: 'React Native development' },
      { ar: 'أداء عالي وسرعة', en: 'High performance and speed' },
      { ar: 'نشر على المتاجر', en: 'App store publishing' },
    ],
  },
  'ui-ux-design': {
    icon: 'design',
    features: [
      { ar: 'تصميم واجهات مستخدم', en: 'UI design' },
      { ar: 'تجربة مستخدم محسنة', en: 'Optimized UX' },
      { ar: 'نماذج تفاعلية', en: 'Interactive prototypes' },
      { ar: 'اختبارات المستخدم', en: 'User testing' },
    ],
  },
  'backend-development': {
    icon: 'server',
    features: [
      { ar: 'تطوير APIs', en: 'API development' },
      { ar: 'قواعد بيانات', en: 'Database design' },
      { ar: 'أمان متقدم', en: 'Advanced security' },
      { ar: 'قابلية التوسع', en: 'Scalability' },
    ],
  },
  consulting: {
    icon: 'analytics',
    features: [
      { ar: 'استشارات تقنية', en: 'Technical consulting' },
      { ar: 'تحليل الأعمال', en: 'Business analysis' },
      { ar: 'استراتيجية رقمية', en: 'Digital strategy' },
      { ar: 'تقييم التقنيات', en: 'Technology assessment' },
    ],
  },
  support: {
    icon: 'support',
    features: [
      { ar: 'دعم فني 24/7', en: '24/7 technical support' },
      { ar: 'صيانة دورية', en: 'Regular maintenance' },
      { ar: 'تحديثات أمنية', en: 'Security updates' },
      { ar: 'مراقبة الأداء', en: 'Performance monitoring' },
    ],
  },
};

// Generate static params
export async function generateStaticParams() {
  return Object.keys(servicesData).map(slug => ({ slug }));
}

// Generate metadata
export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'services' });
  const serviceKey = slug.replace(/-/g, '');

  const title = t(`${serviceKey}.title`);
  const description = t(`${serviceKey}.description`);

  return {
    title: `${title} | MWM`,
    description,
    openGraph: {
      title: `${title} | MWM`,
      description,
    },
  };
}

export default function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

  // Get service data
  const service = servicesData[slug];
  if (!service) {
    notFound();
  }

  const serviceKey = slug.replace(/-/g, '');
  const title = t(`${serviceKey}.title`);
  const description = t(`${serviceKey}.description`);
  const features = service.features || [];
  const pricingPlans = service.pricingPlans || [];
  const faqs = service.faqs || [];
  const processSteps = service.processSteps || [];

  // Related services (excluding current)
  const relatedServices = Object.keys(servicesData)
    .filter(s => s !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Structured Data */}
      <ServiceJsonLd
        name={title}
        description={description}
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
            <p className="text-primary-100 text-lg md:text-xl">{description}</p>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16">
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
                <span className="text-gray-700 dark:text-gray-300">
                  {feature[locale as 'ar' | 'en']}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Steps Section */}
      {processSteps.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'كيف نعمل' : 'How We Work'}
            </h2>
            <ProcessSteps
              steps={processSteps.map(step => ({
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
        <section className="py-16">
          <Container>
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'باقات الأسعار' : 'Pricing Plans'}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300">
              {isRTL ? 'اختر الباقة المناسبة لاحتياجاتك' : 'Choose the plan that fits your needs'}
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
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
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="mx-auto max-w-3xl">
              <FAQAccordion
                items={faqs.map(faq => ({
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
      <section className="py-16">
        <Container>
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isRTL ? 'خدمات أخرى' : 'Other Services'}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedServices.map(serviceSlug => (
              <ServiceCard
                key={serviceSlug}
                title={t(`${serviceSlug.replace(/-/g, '')}.title`)}
                description={t(`${serviceSlug.replace(/-/g, '')}.description`)}
                slug={serviceSlug}
                icon={servicesData[serviceSlug].icon}
                variant="compact"
              />
            ))}
          </div>
        </Container>
      </section>

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
    </main>
  );
}
