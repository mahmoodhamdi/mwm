/**
 * Projects Page
 * صفحة المشاريع
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import { ProjectCard } from '@/components/projects';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  };
}

// Sample projects data (will be replaced with API call)
const projects = [
  {
    id: '1',
    slug: 'ecommerce-platform',
    title: { ar: 'منصة تجارة إلكترونية', en: 'E-Commerce Platform' },
    description: {
      ar: 'منصة متكاملة للتجارة الإلكترونية مع نظام دفع آمن وإدارة مخزون',
      en: 'Full-featured e-commerce platform with secure payment and inventory management',
    },
    category: { ar: 'ويب', en: 'Web' },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    id: '2',
    slug: 'mobile-banking-app',
    title: { ar: 'تطبيق بنكي', en: 'Mobile Banking App' },
    description: {
      ar: 'تطبيق بنكي آمن للهواتف الذكية مع خدمات متعددة',
      en: 'Secure mobile banking app with multiple services',
    },
    category: { ar: 'موبايل', en: 'Mobile' },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
    technologies: ['React Native', 'Node.js', 'PostgreSQL'],
  },
  {
    id: '3',
    slug: 'healthcare-system',
    title: { ar: 'نظام إدارة المستشفيات', en: 'Healthcare Management System' },
    description: {
      ar: 'نظام متكامل لإدارة المستشفيات والعيادات الطبية',
      en: 'Comprehensive hospital and clinic management system',
    },
    category: { ar: 'ويب', en: 'Web' },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    technologies: ['React', 'Express.js', 'MySQL', 'Docker'],
  },
  {
    id: '4',
    slug: 'real-estate-app',
    title: { ar: 'تطبيق عقارات', en: 'Real Estate App' },
    description: {
      ar: 'تطبيق للبحث عن العقارات وإدارتها',
      en: 'Property search and management application',
    },
    category: { ar: 'موبايل', en: 'Mobile' },
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    technologies: ['Flutter', 'Firebase', 'Google Maps'],
  },
  {
    id: '5',
    slug: 'learning-platform',
    title: { ar: 'منصة تعليمية', en: 'Learning Platform' },
    description: {
      ar: 'منصة تعليمية تفاعلية مع دورات وشهادات',
      en: 'Interactive learning platform with courses and certificates',
    },
    category: { ar: 'ويب', en: 'Web' },
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
    technologies: ['Next.js', 'Prisma', 'AWS', 'WebRTC'],
  },
  {
    id: '6',
    slug: 'restaurant-pos',
    title: { ar: 'نظام نقاط البيع للمطاعم', en: 'Restaurant POS System' },
    description: {
      ar: 'نظام نقاط بيع متكامل للمطاعم والكافيهات',
      en: 'Complete point of sale system for restaurants and cafes',
    },
    category: { ar: 'ويب', en: 'Web' },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    technologies: ['Vue.js', 'Laravel', 'Redis', 'Electron'],
  },
];

export default function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('projects');
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
            <p className="text-primary-100 text-lg md:text-xl">{t('subtitle')}</p>
          </div>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-200 py-6 dark:border-gray-800">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'web', 'mobile', 'design'].map(category => (
              <button
                key={category}
                className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title[locale as 'ar' | 'en']}
                description={project.description[locale as 'ar' | 'en']}
                slug={project.slug}
                image={project.image}
                category={project.category[locale as 'ar' | 'en']}
                technologies={project.technologies}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'هل لديك مشروع في بالك؟' : 'Have a project in mind?'}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'تواصل معنا اليوم لمناقشة كيف يمكننا مساعدتك في تحقيق أهدافك'
                : 'Contact us today to discuss how we can help you achieve your goals'}
            </p>
            <Link
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
