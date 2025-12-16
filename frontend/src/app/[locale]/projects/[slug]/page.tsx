/**
 * Project Detail Page
 * صفحة تفاصيل المشروع
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container, Spinner } from '@/components/ui';
import { Gallery, TechStack, ProjectCard } from '@/components/projects';
import { BreadcrumbJsonLd } from '@/components/seo';
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import { createSanitizedHtml } from '@/lib/sanitize';
import { getSafeVideoUrl } from '@/lib/utils';
import { ShareButtons } from '@/components/common';
import type { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type BilingualText = LocalizedString;

interface ProjectTechnology {
  name: string;
  icon?: string;
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

interface ProjectClient {
  name: BilingualText;
  logo?: string;
  website?: string;
}

interface ProjectTestimonial {
  text: BilingualText;
  author: BilingualText;
  position: BilingualText;
  photo?: string;
}

interface Project {
  _id: string;
  title: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  challenge?: BilingualText;
  solution?: BilingualText;
  results?: BilingualText;
  thumbnail: string;
  images: string[];
  video?: string;
  category?: { _id: string; name: BilingualText; slug: string } | null;
  technologies: ProjectTechnology[];
  client?: ProjectClient;
  testimonial?: ProjectTestimonial;
  liveUrl?: string;
  githubUrl?: string;
  duration?: string;
  completedAt?: string;
  isFeatured: boolean;
  isPublished: boolean;
}

// Fetch project by slug
async function getProject(slug: string): Promise<Project | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/projects/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data?.project || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Fetch related projects
async function getRelatedProjects(currentSlug: string, categorySlug?: string): Promise<Project[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const params = categorySlug ? `?category=${categorySlug}&limit=4` : '?limit=4';
    const res = await fetch(`${baseUrl}/projects${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const projects = data.data?.projects || [];
    return projects.filter((p: Project) => p.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related projects:', error);
    return [];
  }
}

// Generate metadata
export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = project.title[locale as 'ar' | 'en'];
  const description = project.shortDescription[locale as 'ar' | 'en'];

  return {
    title: `${title} | MWM`,
    description,
    openGraph: {
      title: `${title} | MWM`,
      description,
      images: project.thumbnail ? [project.thumbnail] : undefined,
    },
  };
}

// Project Content Component
async function ProjectContent({ slug, locale }: { slug: string; locale: string }) {
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

  const project = await getProject(slug);
  const relatedProjects = await getRelatedProjects(slug, project?.category?.slug);

  if (!project) {
    notFound();
  }

  const title = project.title[locale as 'ar' | 'en'];
  const description = project.description[locale as 'ar' | 'en'];
  const shortDescription = project.shortDescription[locale as 'ar' | 'en'];
  const challenge = project.challenge?.[locale as 'ar' | 'en'];
  const solution = project.solution?.[locale as 'ar' | 'en'];
  const results = project.results?.[locale as 'ar' | 'en'];
  const technologies = project.technologies || [];
  const images = project.images || [];
  const testimonial = project.testimonial;
  const client = project.client;

  // Format completion date
  const completedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: isRTL ? 'الرئيسية' : 'Home', url: `https://mwm.com/${locale}` },
          { name: isRTL ? 'المشاريع' : 'Projects', url: `https://mwm.com/${locale}/projects` },
          { name: title, url: `https://mwm.com/${locale}/projects/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-20 text-white">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="text-primary-200 mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="hover:text-white">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-white">
                {isRTL ? 'المشاريع' : 'Projects'}
              </Link>
              <span>/</span>
              <span className="text-white">{title}</span>
            </nav>

            {/* Category Badge */}
            {project.category && (
              <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm">
                {project.category.name[locale as 'ar' | 'en']}
              </span>
            )}

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
            <p className="text-primary-100 mb-8 text-lg md:text-xl">{shortDescription}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {completedDate && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-5" />
                  <span>{completedDate}</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-5" />
                  <span>{project.duration}</span>
                </div>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
                >
                  <ArrowTopRightOnSquareIcon className="size-4" />
                  <span>{isRTL ? 'عرض المشروع' : 'View Live'}</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
                >
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
            </div>

            {/* Share Buttons */}
            <div className="mt-6">
              <p className="mb-2 text-sm text-white/80">
                {isRTL ? 'شارك المشروع' : 'Share this project'}
              </p>
              <ShareButtons
                url={`/${locale}/projects/${slug}`}
                title={title}
                description={shortDescription}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="py-12">
        <Container>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={
                project.thumbnail ||
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=675&fit=crop'
              }
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <div
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createSanitizedHtml(description)}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Challenge/Solution/Results Section */}
      {(challenge || solution || results) && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              {challenge && (
                <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? 'التحدي' : 'The Challenge'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{challenge}</p>
                </div>
              )}

              {solution && (
                <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? 'الحل' : 'The Solution'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{solution}</p>
                </div>
              )}

              {results && (
                <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? 'النتائج' : 'The Results'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{results}</p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Technologies Section */}
      {technologies.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'التقنيات المستخدمة' : 'Technologies Used'}
            </h2>
            <div className="mx-auto max-w-4xl">
              <TechStack technologies={technologies} variant="grouped" showCategories />
            </div>
          </Container>
        </section>
      )}

      {/* Gallery Section */}
      {images.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'معرض الصور' : 'Project Gallery'}
            </h2>
            <Gallery
              images={images}
              variant="grid"
              columns={3}
              lightbox
              gap="md"
              aspectRatio="video"
            />
          </Container>
        </section>
      )}

      {/* Video Section */}
      {getSafeVideoUrl(project.video) && (
        <section className="py-16">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'فيديو المشروع' : 'Project Video'}
            </h2>
            <div className="mx-auto max-w-4xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <iframe
                  src={getSafeVideoUrl(project.video)!}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Testimonial Section */}
      {testimonial && testimonial.text?.[locale as 'ar' | 'en'] && (
        <section className="py-16">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <svg
                className="text-primary-500 mb-6 size-12 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mb-6 text-xl text-gray-700 dark:text-gray-300">
                &ldquo;{testimonial.text[locale as 'ar' | 'en']}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                {testimonial.photo && (
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.author[locale as 'ar' | 'en']}
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author[locale as 'ar' | 'en']}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.position[locale as 'ar' | 'en']}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Client Info */}
      {client && client.name?.[locale as 'ar' | 'en'] && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h3 className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                {isRTL ? 'مشروع لصالح' : 'Project for'}
              </h3>
              <div className="flex flex-col items-center gap-4">
                {client.logo && (
                  <Image
                    src={client.logo}
                    alt={client.name[locale as 'ar' | 'en']}
                    width={120}
                    height={60}
                    className="h-16 w-auto object-contain"
                  />
                )}
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {client.name[locale as 'ar' | 'en']}
                </p>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
                  >
                    <span>{isRTL ? 'زيارة الموقع' : 'Visit Website'}</span>
                    <ArrowTopRightOnSquareIcon className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isRTL ? 'مشاريع مشابهة' : 'Similar Projects'}
              </h2>
              <Link
                href="/projects"
                className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
              >
                <span>{isRTL ? 'عرض الكل' : 'View All'}</span>
                <ArrowIcon className="size-4" />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedProjects.map(relatedProject => (
                <ProjectCard
                  key={relatedProject._id}
                  title={relatedProject.title[locale as 'ar' | 'en']}
                  description={relatedProject.shortDescription[locale as 'ar' | 'en']}
                  slug={relatedProject.slug}
                  thumbnail={
                    relatedProject.thumbnail ||
                    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
                  }
                  category={relatedProject.category?.name?.[locale as 'ar' | 'en'] || ''}
                  technologies={relatedProject.technologies || []}
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
              {isRTL ? 'هل لديك مشروع مماثل؟' : 'Have a similar project?'}
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              {isRTL
                ? 'تواصل معنا اليوم لمناقشة كيف يمكننا مساعدتك في تحقيق رؤيتك'
                : 'Contact us today to discuss how we can help bring your vision to life'}
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
function ProjectLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function ProjectDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<ProjectLoading />}>
        <ProjectContent slug={slug} locale={locale} />
      </Suspense>
    </main>
  );
}
