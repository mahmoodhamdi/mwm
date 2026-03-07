import { Metadata } from 'next';
import { generateMetaTags } from '@/components/seo/MetaTags';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { BlogPostClient } from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface BlogPostApiResponse {
  success: boolean;
  data?: {
    post?: {
      title?: { ar: string; en: string };
      excerpt?: { ar: string; en: string };
      featuredImage?: string;
      author?: { name?: string } | string;
      publishedAt?: string;
      tags?: ({ ar: string; en: string } | string)[];
      category?: { name?: { ar: string; en: string } } | string;
    };
  };
}

async function fetchPostForMetadata(
  slug: string,
  locale: string
): Promise<BlogPostApiResponse['data']> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const response = await fetch(`${apiUrl}/blog/posts/${slug}?locale=${locale}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return undefined;
    }

    const json: BlogPostApiResponse = await response.json();
    return json.success ? json.data : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isArabic = locale === 'ar';

  const data = await fetchPostForMetadata(slug, locale);
  const post = data?.post;

  if (!post) {
    return generateMetaTags({
      title: isArabic ? 'مقال | MWM' : 'Article | MWM',
      description: isArabic
        ? 'اقرأ أحدث مقالاتنا في مجال التقنية والتصميم والتسويق'
        : 'Read our latest articles on technology, design, and marketing',
      url: `/${locale}/blog/${slug}`,
      locale,
      type: 'article',
    });
  }

  const title =
    typeof post.title === 'string'
      ? post.title
      : isArabic
        ? (post.title?.ar ?? '')
        : (post.title?.en ?? '');

  const description =
    typeof post.excerpt === 'string'
      ? post.excerpt
      : isArabic
        ? (post.excerpt?.ar ?? '')
        : (post.excerpt?.en ?? '');

  const authorName =
    typeof post.author === 'string' ? post.author : (post.author?.name ?? undefined);

  const tags = (post.tags ?? []).map(tag =>
    typeof tag === 'string' ? tag : isArabic ? (tag.ar ?? '') : (tag.en ?? '')
  );

  return generateMetaTags({
    title,
    description,
    image: post.featuredImage,
    url: `/${locale}/blog/${slug}`,
    locale,
    type: 'article',
    publishedTime: post.publishedAt,
    author: authorName,
    tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const isArabic = locale === 'ar';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwm.com';

  const data = await fetchPostForMetadata(slug, locale);
  const post = data?.post;

  const title = post
    ? typeof post.title === 'string'
      ? post.title
      : isArabic
        ? (post.title?.ar ?? '')
        : (post.title?.en ?? '')
    : '';

  const description = post
    ? typeof post.excerpt === 'string'
      ? post.excerpt
      : isArabic
        ? (post.excerpt?.ar ?? '')
        : (post.excerpt?.en ?? '')
    : '';

  return (
    <>
      {post && (
        <ArticleJsonLd
          title={title}
          description={description}
          url={`${siteUrl}/${locale}/blog/${slug}`}
          image={post.featuredImage ? `${siteUrl}${post.featuredImage}` : undefined}
          publishedTime={post.publishedAt || new Date().toISOString()}
          author={typeof post.author === 'string' ? post.author : (post.author?.name ?? 'MWM Team')}
          publisher={{
            name: 'MWM Software Solutions',
            logo: `${siteUrl}/favicon.svg`,
          }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  );
}
