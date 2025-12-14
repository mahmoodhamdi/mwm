'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  User,
  Clock,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Bookmark,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts, type BlogPost } from '@/services/public';
import { createSanitizedHtml } from '@/lib/sanitize';

export default function BlogPostPage() {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const postData = await getBlogPostBySlug(slug, locale);

        if (!postData) {
          setError(isRTL ? 'المقال غير موجود' : 'Post not found');
          return;
        }

        setPost(postData);

        // Fetch related posts
        const related = await getRelatedPosts(slug, 3, locale);
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(isRTL ? 'حدث خطأ أثناء تحميل المقال' : 'Error loading post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, locale, isRTL]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLocalizedText = (text: { ar: string; en: string } | string): string => {
    if (typeof text === 'string') return text;
    return text[locale] || text.en || '';
  };

  const getCategoryName = (category: BlogPost['category']): string => {
    if (typeof category === 'string') return category;
    return getLocalizedText(category.name);
  };

  const getCategorySlug = (category: BlogPost['category']): string => {
    if (typeof category === 'string') return category;
    return category.slug;
  };

  const getAuthorName = (author: BlogPost['author']): string => {
    if (typeof author === 'string') return author;
    return author.name || '';
  };

  const getAuthorAvatar = (author: BlogPost['author']): string | undefined => {
    if (typeof author === 'string') return undefined;
    return author.avatar;
  };

  const getTagText = (tag: { ar: string; en: string } | string): string => {
    if (typeof tag === 'string') return tag;
    return tag[locale] || tag.en || '';
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract table of contents from content
  const extractTOC = (content: string): { id: string; title: string; level: number }[] => {
    const regex = /<h([2-3])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[2-3]>/gi;
    const toc: { id: string; title: string; level: number }[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      toc.push({
        level: parseInt(match[1]),
        id: match[2],
        title: match[3],
      });
    }

    return toc;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {error || (isRTL ? 'المقال غير موجود' : 'Post not found')}
        </h1>
        <Link href={`/${locale}/blog`} className="text-blue-600 hover:text-blue-800">
          {isRTL ? 'العودة إلى المدونة' : 'Back to Blog'}
        </Link>
      </div>
    );
  }

  const content = getLocalizedText(post.content);
  const tableOfContents = extractTOC(content);

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto p-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
            <Link href={`/${locale}/blog`} className="hover:text-blue-600">
              {isRTL ? 'المدونة' : 'Blog'}
            </Link>
            <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-gray-900">{getLocalizedText(post.title)}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Category */}
          <Link
            href={`/${locale}/blog/category/${getCategorySlug(post.category)}`}
            className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
          >
            {getCategoryName(post.category)}
          </Link>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            {getLocalizedText(post.title)}
          </h1>

          {/* Excerpt */}
          <p className="mb-8 text-xl text-gray-600">{getLocalizedText(post.excerpt)}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center gap-3">
              <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                {getAuthorAvatar(post.author) ? (
                  <Image
                    src={getAuthorAvatar(post.author)!}
                    alt={getAuthorName(post.author)}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="size-6 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{getAuthorName(post.author)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {post.readingTime} {isRTL ? 'دقيقة قراءة' : 'min read'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto mb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200">
            {post.featuredImage && (
              <Image
                src={post.featuredImage}
                alt={getLocalizedText(post.title)}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl gap-12">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-8">
              {tableOfContents.length > 0 && (
                <>
                  <h3 className="mb-4 font-bold text-gray-900">
                    {isRTL ? 'محتويات المقال' : 'Table of Contents'}
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map(item => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </>
              )}

              {/* Share */}
              <div className="mt-8 border-t pt-8">
                <h3 className="mb-4 font-bold text-gray-900">{isRTL ? 'شارك المقال' : 'Share'}</h3>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700">
                    <Facebook className="size-5" />
                  </button>
                  <button className="rounded-lg bg-sky-500 p-2 text-white hover:bg-sky-600">
                    <Twitter className="size-5" />
                  </button>
                  <button className="rounded-lg bg-blue-700 p-2 text-white hover:bg-blue-800">
                    <Linkedin className="size-5" />
                  </button>
                  <button className="rounded-lg border bg-white p-2 text-gray-600 hover:bg-gray-50">
                    <LinkIcon className="size-5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button className="flex w-full items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">
                  <Bookmark className="size-5" />
                  {isRTL ? 'حفظ للقراءة لاحقاً' : 'Save for later'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Article Content */}
            <div
              className="prose prose-lg prose-headings:font-bold prose-h2:mt-8 prose-h2:text-2xl prose-p:text-gray-700 prose-a:text-blue-600 prose-ul:my-4 prose-li:text-gray-700 max-w-none"
              dangerouslySetInnerHTML={createSanitizedHtml(content)}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="size-5 text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/blog?tag=${encodeURIComponent(getTagText(tag))}`}
                      className="rounded-full border px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
                    >
                      {getTagText(tag)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Box */}
            <div className="mt-12 rounded-2xl bg-gray-50 p-8">
              <div className="flex items-start gap-6">
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {getAuthorAvatar(post.author) ? (
                    <Image
                      src={getAuthorAvatar(post.author)!}
                      alt={getAuthorName(post.author)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="size-10 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {getAuthorName(post.author)}
                  </h3>
                  <p className="mb-4 text-gray-600">{isRTL ? 'كاتب في المدونة' : 'Blog Author'}</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12 border-t pt-12">
              <h2 className="mb-6 text-2xl font-bold">{isRTL ? 'التعليقات' : 'Comments'}</h2>
              <div className="rounded-xl border p-8 text-center">
                <MessageCircle className="mx-auto mb-4 size-12 text-gray-300" />
                <p className="mb-4 text-gray-500">
                  {isRTL
                    ? 'لا توجد تعليقات بعد. كن أول من يعلق!'
                    : 'No comments yet. Be the first to comment!'}
                </p>
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                  {isRTL ? 'أضف تعليق' : 'Add Comment'}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">
              {isRTL ? 'مقالات ذات صلة' : 'Related Posts'}
            </h2>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost._id} href={`/${locale}/blog/${relatedPost.slug}`}>
                  <article className="group h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                      {relatedPost.featuredImage && (
                        <Image
                          src={relatedPost.featuredImage}
                          alt={getLocalizedText(relatedPost.title)}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {getLocalizedText(relatedPost.title)}
                      </h3>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="size-4" />
                        {relatedPost.readingTime} {isRTL ? 'دقيقة' : 'min'}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl justify-center">
            <Link
              href={`/${locale}/blog`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
              <span>{isRTL ? 'العودة إلى المدونة' : 'Back to Blog'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
