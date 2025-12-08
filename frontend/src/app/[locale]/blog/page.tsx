'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Search, Calendar, User, Clock, Tag, ArrowRight, ArrowLeft } from 'lucide-react';

// Types
interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  postsCount: number;
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
  avatar: string;
}

interface BlogPost {
  id: string;
  title: { ar: string; en: string };
  slug: string;
  excerpt: { ar: string; en: string };
  featuredImage: string;
  category: Category;
  tags: BlogTag[];
  author: Author;
  publishedAt: string;
  readingTime: number;
}

export default function BlogListingPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sample data
  const categories: Category[] = [
    { id: '1', nameAr: 'التقنية', nameEn: 'Technology', slug: 'technology', postsCount: 15 },
    { id: '2', nameAr: 'التصميم', nameEn: 'Design', slug: 'design', postsCount: 8 },
    { id: '3', nameAr: 'التسويق', nameEn: 'Marketing', slug: 'marketing', postsCount: 12 },
    { id: '4', nameAr: 'الأعمال', nameEn: 'Business', slug: 'business', postsCount: 6 },
  ];

  const popularTags: BlogTag[] = [
    { id: '1', nameAr: 'ويب', nameEn: 'Web', slug: 'web' },
    { id: '2', nameAr: 'موبايل', nameEn: 'Mobile', slug: 'mobile' },
    { id: '3', nameAr: 'AI', nameEn: 'AI', slug: 'ai' },
    { id: '4', nameAr: 'سيو', nameEn: 'SEO', slug: 'seo' },
    { id: '5', nameAr: 'UX', nameEn: 'UX', slug: 'ux' },
  ];

  const posts: BlogPost[] = [
    {
      id: '1',
      title: { ar: 'مستقبل تطوير الويب في 2024', en: 'Future of Web Development in 2024' },
      slug: 'future-of-web-development-2024',
      excerpt: {
        ar: 'نظرة شاملة على أهم التقنيات والاتجاهات التي ستشكل مستقبل تطوير الويب في العام القادم...',
        en: 'A comprehensive look at the key technologies and trends that will shape the future of web development...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
      category: categories[0],
      tags: [popularTags[0], popularTags[2]],
      author: {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-20',
      readingTime: 8,
    },
    {
      id: '2',
      title: { ar: 'أفضل ممارسات تصميم UI/UX', en: 'Best UI/UX Design Practices' },
      slug: 'best-ui-ux-design-practices',
      excerpt: {
        ar: 'دليل شامل لأفضل الممارسات في تصميم واجهات المستخدم وتجربة المستخدم...',
        en: 'A comprehensive guide to best practices in user interface and user experience design...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
      category: categories[1],
      tags: [popularTags[4]],
      author: {
        id: '2',
        name: 'Sarah Ali',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-18',
      readingTime: 12,
    },
    {
      id: '3',
      title: {
        ar: 'استراتيجيات التسويق الرقمي الفعالة',
        en: 'Effective Digital Marketing Strategies',
      },
      slug: 'effective-digital-marketing-strategies',
      excerpt: {
        ar: 'كيف تبني استراتيجية تسويق رقمي ناجحة لعملك في العصر الحديث...',
        en: 'How to build a successful digital marketing strategy for your business in the modern era...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      category: categories[2],
      tags: [popularTags[3]],
      author: {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-15',
      readingTime: 6,
    },
    {
      id: '4',
      title: { ar: 'الذكاء الاصطناعي في الأعمال', en: 'AI in Business' },
      slug: 'ai-in-business',
      excerpt: {
        ar: 'كيف يغير الذكاء الاصطناعي طريقة عمل الشركات وما هي الفرص المتاحة...',
        en: 'How AI is changing the way businesses operate and what opportunities are available...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
      category: categories[3],
      tags: [popularTags[2]],
      author: {
        id: '2',
        name: 'Sarah Ali',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-12',
      readingTime: 10,
    },
    {
      id: '5',
      title: { ar: 'تطوير تطبيقات الموبايل', en: 'Mobile App Development' },
      slug: 'mobile-app-development',
      excerpt: {
        ar: 'دليل شامل لتطوير تطبيقات الهاتف المحمول باستخدام أحدث التقنيات...',
        en: 'A comprehensive guide to mobile app development using the latest technologies...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
      category: categories[0],
      tags: [popularTags[1]],
      author: {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-10',
      readingTime: 9,
    },
    {
      id: '6',
      title: { ar: 'تحسين محركات البحث للمبتدئين', en: 'SEO for Beginners' },
      slug: 'seo-for-beginners',
      excerpt: {
        ar: 'كل ما تحتاج معرفته عن تحسين محركات البحث لموقعك الإلكتروني...',
        en: 'Everything you need to know about search engine optimization for your website...',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop',
      category: categories[2],
      tags: [popularTags[3], popularTags[0]],
      author: {
        id: '2',
        name: 'Sarah Ali',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      },
      publishedAt: '2024-01-08',
      readingTime: 7,
    },
  ];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Featured post (first published post)
  const featuredPost = posts[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold md:text-5xl">
            {isRTL ? 'المدونة' : 'Blog'}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-blue-100">
            {isRTL
              ? 'اكتشف أحدث المقالات والنصائح في مجال التقنية والتصميم والتسويق'
              : 'Discover the latest articles and tips in technology, design, and marketing'}
          </p>

          {/* Search */}
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث في المقالات...' : 'Search articles...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-0 py-4 pl-12 pr-4 text-gray-900 shadow-lg focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Post */}
            {featuredPost && currentPage === 1 && selectedCategory === 'all' && !searchQuery && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">
                  {isRTL ? 'المقال المميز' : 'Featured Post'}
                </h2>
                <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={featuredPost.featuredImage}
                        alt={isRTL ? featuredPost.title.ar : featuredPost.title.en}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                          {isRTL ? featuredPost.category.nameAr : featuredPost.category.nameEn}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="size-4" />
                          {formatDate(featuredPost.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {isRTL ? featuredPost.title.ar : featuredPost.title.en}
                      </h3>
                      <p className="mb-4 text-gray-600">
                        {isRTL ? featuredPost.excerpt.ar : featuredPost.excerpt.en}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            className="size-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{featuredPost.author.name}</p>
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="size-3" />
                              {featuredPost.readingTime} {isRTL ? 'دقيقة قراءة' : 'min read'}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 font-medium text-blue-600">
                          {isRTL ? 'اقرأ المزيد' : 'Read more'}
                          {isRTL ? (
                            <ArrowLeft className="size-4" />
                          ) : (
                            <ArrowRight className="size-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Posts Grid */}
            <div className="mb-8">
              <h2 className="mb-6 text-2xl font-bold">
                {isRTL ? 'أحدث المقالات' : 'Latest Articles'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {paginatedPosts.map(post => (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                    <article className="group h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={isRTL ? post.title.ar : post.title.en}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                            {isRTL ? post.category.nameAr : post.category.nameEn}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {isRTL ? post.title.ar : post.title.en}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {isRTL ? post.excerpt.ar : post.excerpt.en}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="size-8 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-700">{post.author.name}</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="size-3" />
                            {post.readingTime} {isRTL ? 'د' : 'min'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  {isRTL ? 'لا توجد مقالات' : 'No articles found'}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-10 rounded-lg ${
                      currentPage === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isRTL ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            {/* Categories */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-bold">{isRTL ? 'التصنيفات' : 'Categories'}</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${
                      selectedCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{isRTL ? 'الكل' : 'All'}</span>
                    <span className="rounded-full bg-gray-100 px-2 text-sm text-gray-600">
                      {posts.length}
                    </span>
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{isRTL ? category.nameAr : category.nameEn}</span>
                      <span className="rounded-full bg-gray-100 px-2 text-sm text-gray-600">
                        {category.postsCount}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-bold">
                {isRTL ? 'الوسوم الشائعة' : 'Popular Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/blog/tag/${tag.slug}`}
                    className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-blue-500 hover:text-blue-600"
                  >
                    <Tag className="size-3" />
                    {isRTL ? tag.nameAr : tag.nameEn}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-md">
              <h3 className="mb-2 text-lg font-bold">
                {isRTL ? 'اشترك في النشرة البريدية' : 'Subscribe to Newsletter'}
              </h3>
              <p className="mb-4 text-sm text-blue-100">
                {isRTL
                  ? 'احصل على أحدث المقالات والنصائح في بريدك'
                  : 'Get the latest articles and tips in your inbox'}
              </p>
              <input
                type="email"
                placeholder={isRTL ? 'البريد الإلكتروني' : 'Email address'}
                className="mb-3 w-full rounded-lg border-0 px-4 py-2 text-gray-900"
              />
              <button className="w-full rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50">
                {isRTL ? 'اشترك الآن' : 'Subscribe'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
