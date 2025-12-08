/**
 * Team Page
 * صفحة الفريق
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import { TeamCard } from '@/components/team';

// Generate metadata
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('ourTeam'),
    description: t('description'),
    openGraph: {
      title: t('ourTeam'),
      description: t('description'),
    },
  };
}

// Sample team data (will be replaced with API call)
const teamMembers = [
  {
    id: '1',
    name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
    position: { ar: 'المؤسس والرئيس التنفيذي', en: 'Founder & CEO' },
    bio: {
      ar: 'خبرة أكثر من 10 سنوات في مجال تطوير البرمجيات وإدارة المشاريع التقنية',
      en: 'Over 10 years of experience in software development and technical project management',
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    id: '2',
    name: { ar: 'سارة أحمد', en: 'Sara Ahmed' },
    position: { ar: 'مدير التقنية', en: 'CTO' },
    bio: {
      ar: 'متخصصة في هندسة البرمجيات والذكاء الاصطناعي',
      en: 'Specialized in software engineering and artificial intelligence',
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '3',
    name: { ar: 'محمد علي', en: 'Mohamed Ali' },
    position: { ar: 'مطور واجهات أمامية', en: 'Senior Frontend Developer' },
    bio: {
      ar: 'متخصص في React و Next.js مع خبرة 5 سنوات',
      en: 'Specialized in React and Next.js with 5 years of experience',
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: '4',
    name: { ar: 'نورا حسن', en: 'Nora Hassan' },
    position: { ar: 'مصممة UI/UX', en: 'UI/UX Designer' },
    bio: {
      ar: 'شغوفة بتصميم تجارب مستخدم استثنائية ومبتكرة',
      en: 'Passionate about designing exceptional and innovative user experiences',
    },
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
    },
  },
  {
    id: '5',
    name: { ar: 'خالد إبراهيم', en: 'Khaled Ibrahim' },
    position: { ar: 'مطور خوادم', en: 'Backend Developer' },
    bio: {
      ar: 'متخصص في Node.js و Python مع خبرة في قواعد البيانات',
      en: 'Specialized in Node.js and Python with database expertise',
    },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: '6',
    name: { ar: 'مريم عبدالله', en: 'Mariam Abdullah' },
    position: { ar: 'مطورة تطبيقات موبايل', en: 'Mobile Developer' },
    bio: {
      ar: 'متخصصة في React Native و Flutter',
      en: 'Specialized in React Native and Flutter',
    },
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
];

export default function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('about');
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="from-primary-600 to-primary-800 bg-gradient-to-br py-16 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('ourTeam')}</h1>
            <p className="text-primary-100 text-lg md:text-xl">
              {isRTL
                ? 'تعرف على فريقنا المميز من المحترفين'
                : 'Meet our amazing team of professionals'}
            </p>
          </div>
        </Container>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map(member => (
              <TeamCard
                key={member.id}
                name={member.name[locale as 'ar' | 'en']}
                position={member.position[locale as 'ar' | 'en']}
                bio={member.bio[locale as 'ar' | 'en']}
                image={member.image}
                social={member.social}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {isRTL ? 'انضم إلى فريقنا' : 'Join Our Team'}
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {isRTL
                ? 'نحن دائماً نبحث عن مواهب جديدة للانضمام إلى فريقنا المتنامي'
                : "We're always looking for new talents to join our growing team"}
            </p>
            <Link
              href="/careers"
              className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors"
            >
              {isRTL ? 'تصفح الوظائف المتاحة' : 'Browse Open Positions'}
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
