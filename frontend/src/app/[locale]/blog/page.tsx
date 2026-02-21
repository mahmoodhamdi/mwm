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
    title: isArabic ? 'المدونة | MWM' : 'Blog | MWM',
    description: isArabic
      ? 'اكتشف أحدث المقالات والنصائح في مجال التقنية والتصميم والتسويق من خبراء MWM'
      : 'Discover the latest articles, insights, and tips on technology, design, and marketing from MWM experts',
    keywords: isArabic
      ? ['مدونة', 'مقالات', 'تقنية', 'تصميم', 'تسويق', 'برمجة', 'ويب']
      : ['blog', 'articles', 'technology', 'design', 'marketing', 'software', 'web development'],
    url: `/${locale}/blog`,
    locale,
    type: 'website',
  });
}

export default function BlogPage() {
  return <BlogPageClient />;
}
