'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Clock, Tag, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import {
  getBlogPosts,
  getBlogCategories,
  getFeaturedBlogPosts,
  getBlogTags,
  type BlogPost,
  type BlogCategory,
} from '@/services/public';

export default function BlogListingPage() {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and tags on mount
  // Using Promise.allSettled for graceful degradation if any request fails
  useEffect(() => {
    const fetchInitialData = async () => {
      const results = await Promise.allSettled([
        getBlogCategories(locale),
        getBlogTags(locale),
        getFeaturedBlogPosts(1, locale),
      ]);

      // Handle categories result
      if (results[0].status === 'fulfilled') {
        setCategories(results[0].value);
      } else {
        console.error('Error fetching categories:', results[0].reason);
      }

      // Handle tags result
      if (results[1].status === 'fulfilled') {
        setTags(results[1].value);
      } else {
        console.error('Error fetching tags:', results[1].reason);
      }

      // Handle featured posts result
      if (results[2].status === 'fulfilled') {
        setFeaturedPost(results[2].value[0] || null);
      } else {
        console.error('Error fetching featured posts:', results[2].reason);
      }
    };

    fetchInitialData();
  }, [locale]);

  // Fetch posts when filters change
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBlogPosts({
        page: currentPage,
        limit: postsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        locale,
      });

      if (response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(isRTL ? 'حدث خطأ أثناء تحميل المقالات' : 'Error loading articles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, locale, isRTL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

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

  const getCategoryName = (category: BlogCategory | string): string => {
    if (typeof category === 'string') return category;
    return getLocalizedText(category.name);
  };

  const getAuthorName = (author: BlogPost['author']): string => {
    if (typeof author === 'string') return author;
    return author.name || '';
  };

  const getAuthorAvatar = (author: BlogPost['author']): string | undefined => {
    if (typeof author === 'string') return undefined;
    return author.avatar;
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
                    <div className="relative aspect-video overflow-hidden bg-gray-200">
                      {featuredPost.featuredImage && (
                        <Image
                          src={featuredPost.featuredImage}
                          alt={getLocalizedText(featuredPost.title)}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                          {getCategoryName(featuredPost.category)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="size-4" />
                          {formatDate(featuredPost.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {getLocalizedText(featuredPost.title)}
                      </h3>
                      <p className="mb-4 text-gray-600">{getLocalizedText(featuredPost.excerpt)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 overflow-hidden rounded-full bg-gray-200">
                            {getAuthorAvatar(featuredPost.author) ? (
                              <Image
                                src={getAuthorAvatar(featuredPost.author)!}
                                alt={getAuthorName(featuredPost.author)}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-gray-400">
                                {getAuthorName(featuredPost.author).charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getAuthorName(featuredPost.author)}
                            </p>
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

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-500">{error}</div>
              ) : posts.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  {isRTL ? 'لا توجد مقالات' : 'No articles found'}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {posts.map(post => (
                    <Link key={post._id} href={`/${locale}/blog/${post.slug}`}>
                      <article className="group h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                        <div className="relative aspect-video overflow-hidden bg-gray-200">
                          {post.featuredImage && (
                            <Image
                              src={post.featuredImage}
                              alt={getLocalizedText(post.title)}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="mb-3 flex items-center gap-3">
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                              {getCategoryName(post.category)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                          <h3 className="mb-2 line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                            {getLocalizedText(post.title)}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                            {getLocalizedText(post.excerpt)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="relative size-8 overflow-hidden rounded-full bg-gray-200">
                                {getAuthorAvatar(post.author) ? (
                                  <Image
                                    src={getAuthorAvatar(post.author)!}
                                    alt={getAuthorName(post.author)}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex size-full items-center justify-center text-xs text-gray-400">
                                    {getAuthorName(post.author).charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-gray-700">
                                {getAuthorName(post.author)}
                              </span>
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
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category._id}>
                    <button
                      onClick={() => setSelectedCategory(category._id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${
                        selectedCategory === category._id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{getLocalizedText(category.name)}</span>
                      {category.postCount !== undefined && (
                        <span className="rounded-full bg-gray-100 px-2 text-sm text-gray-600">
                          {category.postCount}
                        </span>
                      )}
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
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                    className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-blue-500 hover:text-blue-600"
                  >
                    <Tag className="size-3" />
                    {tag}
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
