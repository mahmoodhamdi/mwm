'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
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
} from 'lucide-react';

// Types
interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

interface BlogTag {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  bio: { ar: string; en: string };
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
  };
}

interface BlogPost {
  id: string;
  title: { ar: string; en: string };
  slug: string;
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  featuredImage: string;
  category: Category;
  tags: BlogTag[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tableOfContents: { id: string; titleAr: string; titleEn: string; level: number }[];
}

export default function BlogPostPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // In real app, use useParams().slug to fetch post data
  // Sample post data
  const post: BlogPost = {
    id: '1',
    title: { ar: 'مستقبل تطوير الويب في 2024', en: 'Future of Web Development in 2024' },
    slug: 'future-of-web-development-2024',
    excerpt: {
      ar: 'نظرة شاملة على أهم التقنيات والاتجاهات التي ستشكل مستقبل تطوير الويب...',
      en: 'A comprehensive look at the key technologies and trends that will shape web development...',
    },
    content: {
      ar: `
        <h2 id="intro">مقدمة</h2>
        <p>يشهد عالم تطوير الويب تطورات متسارعة ومستمرة، حيث تظهر تقنيات جديدة كل عام تغير الطريقة التي نبني بها المواقع والتطبيقات. في هذا المقال، سنستعرض أهم الاتجاهات والتقنيات التي نتوقع أن تسيطر على المشهد في عام 2024.</p>

        <h2 id="ai-integration">دمج الذكاء الاصطناعي</h2>
        <p>أصبح الذكاء الاصطناعي جزءًا لا يتجزأ من تطوير الويب الحديث. من أدوات كتابة الكود المساعدة إلى تحسين تجربة المستخدم، يلعب AI دورًا متزايد الأهمية.</p>
        <ul>
          <li>GitHub Copilot وأدوات مماثلة</li>
          <li>تخصيص المحتوى بالذكاء الاصطناعي</li>
          <li>روبوتات المحادثة الذكية</li>
        </ul>

        <h2 id="web-components">مكونات الويب</h2>
        <p>تستمر مكونات الويب في اكتساب شعبية كطريقة لإنشاء عناصر قابلة لإعادة الاستخدام عبر المنصات والإطارات المختلفة.</p>

        <h2 id="performance">الأداء وتجربة المستخدم</h2>
        <p>يظل الأداء عاملاً حاسماً في نجاح أي موقع ويب. مع Core Web Vitals من Google، أصبح تحسين الأداء ضرورة وليس خياراً.</p>

        <h2 id="conclusion">الخلاصة</h2>
        <p>مستقبل تطوير الويب مشرق ومليء بالفرص. المطورون الذين يتبنون هذه التقنيات الجديدة سيكونون في وضع أفضل للنجاح.</p>
      `,
      en: `
        <h2 id="intro">Introduction</h2>
        <p>The world of web development is witnessing rapid and continuous developments, with new technologies emerging every year that change the way we build websites and applications. In this article, we will review the most important trends and technologies that we expect to dominate the scene in 2024.</p>

        <h2 id="ai-integration">AI Integration</h2>
        <p>Artificial intelligence has become an integral part of modern web development. From code-writing assistants to improving user experience, AI plays an increasingly important role.</p>
        <ul>
          <li>GitHub Copilot and similar tools</li>
          <li>AI-powered content personalization</li>
          <li>Intelligent chatbots</li>
        </ul>

        <h2 id="web-components">Web Components</h2>
        <p>Web Components continue to gain popularity as a way to create reusable elements across different platforms and frameworks.</p>

        <h2 id="performance">Performance and User Experience</h2>
        <p>Performance remains a crucial factor in the success of any website. With Google's Core Web Vitals, performance optimization has become a necessity, not an option.</p>

        <h2 id="conclusion">Conclusion</h2>
        <p>The future of web development is bright and full of opportunities. Developers who embrace these new technologies will be better positioned for success.</p>
      `,
    },
    featuredImage: '/images/blog/web-dev.jpg',
    category: { id: '1', nameAr: 'التقنية', nameEn: 'Technology', slug: 'technology' },
    tags: [
      { id: '1', nameAr: 'ويب', nameEn: 'Web', slug: 'web' },
      { id: '3', nameAr: 'AI', nameEn: 'AI', slug: 'ai' },
    ],
    author: {
      id: '1',
      name: 'Ahmed Hassan',
      bio: {
        ar: 'مطور ويب متخصص في React و Node.js مع خبرة أكثر من 5 سنوات',
        en: 'Web developer specializing in React and Node.js with over 5 years of experience',
      },
      avatar: '/avatars/ahmed.jpg',
      social: { twitter: 'https://twitter.com/ahmed', linkedin: 'https://linkedin.com/in/ahmed' },
    },
    publishedAt: '2024-01-20',
    updatedAt: '2024-01-22',
    readingTime: 8,
    tableOfContents: [
      { id: 'intro', titleAr: 'مقدمة', titleEn: 'Introduction', level: 2 },
      {
        id: 'ai-integration',
        titleAr: 'دمج الذكاء الاصطناعي',
        titleEn: 'AI Integration',
        level: 2,
      },
      { id: 'web-components', titleAr: 'مكونات الويب', titleEn: 'Web Components', level: 2 },
      {
        id: 'performance',
        titleAr: 'الأداء وتجربة المستخدم',
        titleEn: 'Performance and UX',
        level: 2,
      },
      { id: 'conclusion', titleAr: 'الخلاصة', titleEn: 'Conclusion', level: 2 },
    ],
  };

  // Related posts
  const relatedPosts = [
    {
      id: '2',
      title: { ar: 'أفضل ممارسات تصميم UI/UX', en: 'Best UI/UX Design Practices' },
      slug: 'best-ui-ux-design-practices',
      featuredImage: '/images/blog/ui-ux.jpg',
      readingTime: 12,
    },
    {
      id: '5',
      title: { ar: 'تطوير تطبيقات الموبايل', en: 'Mobile App Development' },
      slug: 'mobile-app-development',
      featuredImage: '/images/blog/mobile.jpg',
      readingTime: 9,
    },
    {
      id: '4',
      title: { ar: 'الذكاء الاصطناعي في الأعمال', en: 'AI in Business' },
      slug: 'ai-in-business',
      featuredImage: '/images/blog/ai.jpg',
      readingTime: 10,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <span className="text-gray-900">{isRTL ? post.title.ar : post.title.en}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Category */}
          <Link
            href={`/${locale}/blog/category/${post.category.slug}`}
            className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
          >
            {isRTL ? post.category.nameAr : post.category.nameEn}
          </Link>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            {isRTL ? post.title.ar : post.title.en}
          </h1>

          {/* Excerpt */}
          <p className="mb-8 text-xl text-gray-600">{isRTL ? post.excerpt.ar : post.excerpt.en}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-200">
                <User className="size-6 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm">{isRTL ? post.author.bio.ar : post.author.bio.en}</p>
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
          <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200"></div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl gap-12">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-8">
              <h3 className="mb-4 font-bold text-gray-900">
                {isRTL ? 'محتويات المقال' : 'Table of Contents'}
              </h3>
              <nav className="space-y-2">
                {post.tableOfContents.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                  >
                    {isRTL ? item.titleAr : item.titleEn}
                  </button>
                ))}
              </nav>

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
              dangerouslySetInnerHTML={{ __html: isRTL ? post.content.ar : post.content.en }}
            />

            {/* Tags */}
            <div className="mt-12 border-t pt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="size-5 text-gray-400" />
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/blog/tag/${tag.slug}`}
                    className="rounded-full border px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
                  >
                    {isRTL ? tag.nameAr : tag.nameEn}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-12 rounded-2xl bg-gray-50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gray-200">
                  <User className="size-10 text-gray-500" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{post.author.name}</h3>
                  <p className="mb-4 text-gray-600">
                    {isRTL ? post.author.bio.ar : post.author.bio.en}
                  </p>
                  <div className="flex gap-3">
                    {post.author.social.twitter && (
                      <a
                        href={post.author.social.twitter}
                        className="text-gray-400 hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="size-5" />
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a
                        href={post.author.social.linkedin}
                        className="text-gray-400 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="size-5" />
                      </a>
                    )}
                  </div>
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
      <section className="mt-16 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            {isRTL ? 'مقالات ذات صلة' : 'Related Posts'}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {relatedPosts.map(relatedPost => (
              <Link key={relatedPost.id} href={`/${locale}/blog/${relatedPost.slug}`}>
                <article className="group h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200"></div>
                  <div className="p-4">
                    <h3 className="mb-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {isRTL ? relatedPost.title.ar : relatedPost.title.en}
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

      {/* Navigation */}
      <div className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl justify-between">
            <Link
              href={`/${locale}/blog/previous-post`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
              <span>{isRTL ? 'المقال السابق' : 'Previous Post'}</span>
            </Link>
            <Link
              href={`/${locale}/blog/next-post`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <span>{isRTL ? 'المقال التالي' : 'Next Post'}</span>
              {isRTL ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
