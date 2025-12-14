/**
 * Team Member Detail Page
 * صفحة تفاصيل عضو الفريق
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container, Spinner } from '@/components/ui';
import { TeamCard, SkillsChart } from '@/components/team';
import { ProjectCard } from '@/components/projects';
import { BreadcrumbJsonLd } from '@/components/seo';
import {
  EnvelopeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import { createSanitizedHtml } from '@/lib/sanitize';

// Types
interface BilingualText {
  ar: string;
  en: string;
}

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  email?: string;
}

interface Skill {
  name: BilingualText;
  level: number;
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'other';
}

interface Education {
  degree: BilingualText;
  institution: BilingualText;
  year?: number;
}

interface Certification {
  name: BilingualText;
  issuer?: BilingualText;
  year?: number;
  url?: string;
}

interface Department {
  _id: string;
  name: BilingualText;
  slug: string;
}

interface Project {
  _id: string;
  title: BilingualText;
  slug: string;
  thumbnail: string;
  shortDescription: BilingualText;
  technologies?: Array<{ name: string; icon?: string }>;
}

interface TeamMember {
  _id: string;
  name: BilingualText;
  slug: string;
  position: BilingualText;
  bio: BilingualText;
  shortBio?: BilingualText;
  department?: Department | null;
  avatar: string;
  coverImage?: string;
  skills?: Skill[];
  socialLinks?: SocialLinks;
  experience?: number;
  education?: Education[];
  certifications?: Certification[];
  projects?: Project[];
  isLeader: boolean;
  isFeatured: boolean;
  isActive: boolean;
  joinedAt?: string;
}

// Fetch team member by slug
async function getTeamMember(slug: string): Promise<TeamMember | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/team/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data?.member || null;
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
}

// Fetch other team members
async function getOtherTeamMembers(
  currentSlug: string,
  departmentSlug?: string
): Promise<TeamMember[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const params = departmentSlug ? `?department=${departmentSlug}&limit=4` : '?limit=4';
    const res = await fetch(`${baseUrl}/team${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const members = data.data?.members || [];
    return members.filter((m: TeamMember) => m.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Generate metadata
export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const member = await getTeamMember(slug);

  if (!member) {
    return {
      title: 'Team Member Not Found',
    };
  }

  const name = member.name[locale as 'ar' | 'en'];
  const position = member.position[locale as 'ar' | 'en'];
  const shortBio =
    member.shortBio?.[locale as 'ar' | 'en'] || member.bio[locale as 'ar' | 'en'].slice(0, 160);

  return {
    title: `${name} - ${position} | MWM`,
    description: shortBio,
    openGraph: {
      title: `${name} - ${position} | MWM`,
      description: shortBio,
      images: member.avatar ? [member.avatar] : undefined,
    },
  };
}

// Team Member Content Component
async function TeamMemberContent({ slug, locale }: { slug: string; locale: string }) {
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeftIcon : ArrowRightIcon;

  const member = await getTeamMember(slug);
  const otherMembers = await getOtherTeamMembers(slug, member?.department?.slug);

  if (!member) {
    notFound();
  }

  const name = member.name[locale as 'ar' | 'en'];
  const position = member.position[locale as 'ar' | 'en'];
  const bio = member.bio[locale as 'ar' | 'en'];
  const skills = member.skills || [];
  const education = member.education || [];
  const certifications = member.certifications || [];
  const projects = member.projects || [];
  const socialLinks = member.socialLinks || {};

  // Format joined date
  const joinedDate = member.joinedAt
    ? new Date(member.joinedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
      })
    : null;

  // Social link icons
  const socialIcons: Record<string, JSX.Element> = {
    linkedin: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    github: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    website: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: isRTL ? 'الرئيسية' : 'Home', url: `https://mwm.com/${locale}` },
          { name: isRTL ? 'الفريق' : 'Team', url: `https://mwm.com/${locale}/team` },
          { name: name, url: `https://mwm.com/${locale}/team/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="relative">
        {/* Cover Image */}
        <div className="from-primary-600 to-primary-800 h-48 bg-gradient-to-br md:h-64">
          {member.coverImage && (
            <Image src={member.coverImage} alt="" fill className="object-cover opacity-30" />
          )}
        </div>

        <Container>
          <div className="relative -mt-24 pb-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
              {/* Avatar */}
              <div className="relative size-40 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl md:size-48 dark:border-gray-900">
                <Image
                  src={
                    member.avatar ||
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
                  }
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Basic Info */}
              <div className="text-center md:pb-4 md:text-start">
                {/* Badges */}
                <div className="mb-2 flex flex-wrap justify-center gap-2 md:justify-start">
                  {member.isLeader && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      {isRTL ? 'قائد الفريق' : 'Team Leader'}
                    </span>
                  )}
                  {member.department && (
                    <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full px-3 py-1 text-xs font-medium">
                      {member.department.name[locale as 'ar' | 'en']}
                    </span>
                  )}
                </div>

                <h1 className="mb-1 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                  {name}
                </h1>
                <p className="text-primary-600 dark:text-primary-400 text-lg font-medium">
                  {position}
                </p>

                {/* Meta Info */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 md:justify-start dark:text-gray-400">
                  {member.experience && (
                    <div className="flex items-center gap-1">
                      <BriefcaseIcon className="size-4" />
                      <span>
                        {member.experience} {isRTL ? 'سنوات خبرة' : 'years experience'}
                      </span>
                    </div>
                  )}
                  {joinedDate && (
                    <div className="flex items-center gap-1">
                      <span>
                        {isRTL ? 'انضم في' : 'Joined'} {joinedDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {Object.keys(socialLinks).length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                    {Object.entries(socialLinks).map(([key, value]) => {
                      if (!value) return null;
                      const href = key === 'email' ? `mailto:${value}` : value;
                      return (
                        <a
                          key={key}
                          href={href}
                          target={key === 'email' ? undefined : '_blank'}
                          rel={key === 'email' ? undefined : 'noopener noreferrer'}
                          className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label={key}
                        >
                          {key === 'email' ? <EnvelopeIcon className="size-5" /> : socialIcons[key]}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bio Section */}
      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'نبذة تعريفية' : 'About'}
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={createSanitizedHtml(bio)}
            />
          </div>
        </Container>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'المهارات' : 'Skills'}
            </h2>
            <div className="mx-auto max-w-3xl">
              <SkillsChart
                skills={skills.map(skill => ({
                  name: skill.name[locale as 'ar' | 'en'],
                  level: skill.level,
                  category: skill.category,
                }))}
                variant="grouped"
                showCategories
                animated
              />
            </div>
          </Container>
        </section>
      )}

      {/* Education & Certifications Section */}
      {(education.length > 0 || certifications.length > 0) && (
        <section className="py-16">
          <Container>
            <div className="grid gap-12 md:grid-cols-2">
              {/* Education */}
              {education.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="bg-primary-100 dark:bg-primary-900/30 flex size-12 items-center justify-center rounded-xl">
                      <AcademicCapIcon className="text-primary-600 dark:text-primary-400 size-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isRTL ? 'التعليم' : 'Education'}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div
                        key={index}
                        className="relative border-s-2 border-gray-200 ps-6 dark:border-gray-700"
                      >
                        <div className="absolute -start-[9px] top-0 size-4 rounded-full border-2 border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {edu.degree[locale as 'ar' | 'en']}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {edu.institution[locale as 'ar' | 'en']}
                        </p>
                        {edu.year && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">{edu.year}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                      <svg
                        className="size-6 text-amber-600 dark:text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isRTL ? 'الشهادات' : 'Certifications'}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {cert.url ? (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {cert.name[locale as 'ar' | 'en']}
                            </a>
                          ) : (
                            cert.name[locale as 'ar' | 'en']
                          )}
                        </h3>
                        {cert.issuer && (
                          <p className="text-gray-600 dark:text-gray-400">
                            {cert.issuer[locale as 'ar' | 'en']}
                          </p>
                        )}
                        {cert.year && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">{cert.year}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'المشاريع' : 'Projects'}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  title={project.title[locale as 'ar' | 'en']}
                  description={project.shortDescription[locale as 'ar' | 'en']}
                  slug={project.slug}
                  thumbnail={
                    project.thumbnail ||
                    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
                  }
                  technologies={project.technologies || []}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isRTL ? 'أعضاء الفريق الآخرين' : 'Other Team Members'}
              </h2>
              <Link
                href="/team"
                className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
              >
                <span>{isRTL ? 'عرض الكل' : 'View All'}</span>
                <ArrowIcon className="size-4" />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {otherMembers.map(otherMember => (
                <TeamCard
                  key={otherMember._id}
                  slug={otherMember.slug}
                  name={otherMember.name[locale as 'ar' | 'en']}
                  position={otherMember.position[locale as 'ar' | 'en']}
                  shortBio={
                    otherMember.shortBio?.[locale as 'ar' | 'en'] ||
                    otherMember.bio[locale as 'ar' | 'en']
                  }
                  avatar={
                    otherMember.avatar ||
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
                  }
                  socialLinks={otherMember.socialLinks}
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
              {isRTL ? 'هل تريد العمل معنا؟' : 'Want to work with us?'}
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              {isRTL
                ? 'انضم إلى فريقنا المميز وساهم في بناء حلول تقنية مبتكرة'
                : 'Join our amazing team and help build innovative tech solutions'}
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
function TeamMemberLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function TeamMemberDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<TeamMemberLoading />}>
        <TeamMemberContent slug={slug} locale={locale} />
      </Suspense>
    </main>
  );
}
