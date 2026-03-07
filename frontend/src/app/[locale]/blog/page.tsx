import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateMetaTags } from '@/components/seo/MetaTags';
import { BlogPageClient } from './BlogPageClient';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return generateMetaTags({
    title: isArabic
      ? 'مدونة MWM التقنية | مقالات برمجة وتطوير مواقع وتطبيقات'
      : 'MWM Tech Blog | Software Development, Web & Mobile App Articles',
    description: isArabic
      ? 'مدونة MWM التقنية: 50+ مقالة احترافية في تطوير الويب، برمجة التطبيقات، Next.js، Flutter، Node.js، Laravel، قواعد البيانات، الأمان، DevOps، والذكاء الاصطناعي. دروس عملية مع أمثلة كود حقيقية من مشاريعنا.'
      : 'MWM Tech Blog: 50+ professional articles on web development, mobile apps, Next.js, Flutter, Node.js, Laravel, databases, security, DevOps, and AI. Practical tutorials with real code examples from our projects.',
    keywords: isArabic
      ? [
          'مدونة تقنية',
          'مقالات برمجة',
          'دروس Next.js',
          'شرح Flutter',
          'تعلم Node.js',
          'دروس Laravel',
          'تطوير ويب',
          'برمجة تطبيقات',
          'أمن معلومات',
          'DevOps',
          'قواعد بيانات',
          'MongoDB',
          'PostgreSQL',
          'React',
          'TypeScript',
          'دروس برمجة عربي',
          'تعلم البرمجة',
          'مقالات تقنية عربية',
        ]
      : [
          'tech blog',
          'software development articles',
          'Next.js tutorial',
          'Flutter guide',
          'Node.js best practices',
          'Laravel development',
          'React patterns',
          'TypeScript tips',
          'MongoDB tutorial',
          'PostgreSQL guide',
          'web security',
          'DevOps practices',
          'Docker tutorial',
          'API development',
          'mobile app development',
          'programming blog',
          'code examples',
          'developer tutorials',
        ],
    url: `/${locale}/blog`,
    locale,
    type: 'website',
  });
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPageClient />
    </Suspense>
  );
}
