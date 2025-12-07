'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Tag,
  Clock,
  FileText,
  Image,
  X,
  Save,
} from 'lucide-react';

// Types
type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  postsCount: number;
}

interface Tag {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface BlogPost {
  id: string;
  title: { ar: string; en: string };
  slug: string;
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  featuredImage: string;
  category: Category;
  tags: Tag[];
  author: Author;
  status: PostStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTime: number;
  views: number;
  seo: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    keywords: { ar: string; en: string };
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State
  const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'tags'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Sample data
  const categories: Category[] = [
    { id: '1', nameAr: 'التقنية', nameEn: 'Technology', slug: 'technology', postsCount: 15 },
    { id: '2', nameAr: 'التصميم', nameEn: 'Design', slug: 'design', postsCount: 8 },
    { id: '3', nameAr: 'التسويق', nameEn: 'Marketing', slug: 'marketing', postsCount: 12 },
    { id: '4', nameAr: 'الأعمال', nameEn: 'Business', slug: 'business', postsCount: 6 },
  ];

  const tags: Tag[] = [
    { id: '1', nameAr: 'ويب', nameEn: 'Web', slug: 'web' },
    { id: '2', nameAr: 'موبايل', nameEn: 'Mobile', slug: 'mobile' },
    { id: '3', nameAr: 'AI', nameEn: 'AI', slug: 'ai' },
    { id: '4', nameAr: 'سيو', nameEn: 'SEO', slug: 'seo' },
    { id: '5', nameAr: 'UX', nameEn: 'UX', slug: 'ux' },
  ];

  const authors: Author[] = [
    { id: '1', name: 'Ahmed Hassan', email: 'ahmed@company.com', avatar: '/avatars/ahmed.jpg' },
    { id: '2', name: 'Sarah Ali', email: 'sarah@company.com', avatar: '/avatars/sarah.jpg' },
  ];

  const [posts] = useState<BlogPost[]>([
    {
      id: '1',
      title: { ar: 'مستقبل تطوير الويب في 2024', en: 'Future of Web Development in 2024' },
      slug: 'future-of-web-development-2024',
      excerpt: { ar: 'نظرة على أهم التقنيات...', en: 'A look at the key technologies...' },
      content: { ar: 'محتوى المقال...', en: 'Article content...' },
      featuredImage: '/images/blog/web-dev.jpg',
      category: categories[0],
      tags: [tags[0], tags[2]],
      author: authors[0],
      status: 'published',
      publishedAt: '2024-01-20',
      scheduledAt: null,
      readingTime: 8,
      views: 1250,
      seo: {
        title: { ar: 'مستقبل تطوير الويب', en: 'Future of Web Development' },
        description: { ar: 'وصف سيو', en: 'SEO description' },
        keywords: { ar: 'ويب، تطوير', en: 'web, development' },
      },
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
    },
    {
      id: '2',
      title: { ar: 'أفضل ممارسات تصميم UI/UX', en: 'Best UI/UX Design Practices' },
      slug: 'best-ui-ux-design-practices',
      excerpt: { ar: 'دليل شامل لتصميم...', en: 'Comprehensive guide to design...' },
      content: { ar: 'محتوى المقال...', en: 'Article content...' },
      featuredImage: '/images/blog/ui-ux.jpg',
      category: categories[1],
      tags: [tags[4]],
      author: authors[1],
      status: 'draft',
      publishedAt: null,
      scheduledAt: null,
      readingTime: 12,
      views: 0,
      seo: {
        title: { ar: 'تصميم UI/UX', en: 'UI/UX Design' },
        description: { ar: 'وصف سيو', en: 'SEO description' },
        keywords: { ar: 'تصميم، UX', en: 'design, UX' },
      },
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
    },
    {
      id: '3',
      title: { ar: 'استراتيجيات التسويق الرقمي', en: 'Digital Marketing Strategies' },
      slug: 'digital-marketing-strategies',
      excerpt: { ar: 'كيف تبني استراتيجية...', en: 'How to build a strategy...' },
      content: { ar: 'محتوى المقال...', en: 'Article content...' },
      featuredImage: '/images/blog/marketing.jpg',
      category: categories[2],
      tags: [tags[3]],
      author: authors[0],
      status: 'scheduled',
      publishedAt: null,
      scheduledAt: '2024-01-30',
      readingTime: 6,
      views: 0,
      seo: {
        title: { ar: 'التسويق الرقمي', en: 'Digital Marketing' },
        description: { ar: 'وصف سيو', en: 'SEO description' },
        keywords: { ar: 'تسويق، رقمي', en: 'marketing, digital' },
      },
      createdAt: '2024-01-21',
      updatedAt: '2024-01-21',
    },
    {
      id: '4',
      title: { ar: 'الذكاء الاصطناعي في الأعمال', en: 'AI in Business' },
      slug: 'ai-in-business',
      excerpt: { ar: 'كيف يغير AI طريقة...', en: 'How AI is changing the way...' },
      content: { ar: 'محتوى المقال...', en: 'Article content...' },
      featuredImage: '/images/blog/ai-business.jpg',
      category: categories[3],
      tags: [tags[2]],
      author: authors[1],
      status: 'archived',
      publishedAt: '2023-12-15',
      scheduledAt: null,
      readingTime: 10,
      views: 3420,
      seo: {
        title: { ar: 'AI في الأعمال', en: 'AI in Business' },
        description: { ar: 'وصف سيو', en: 'SEO description' },
        keywords: { ar: 'ذكاء، اصطناعي', en: 'AI, artificial intelligence' },
      },
      createdAt: '2023-12-10',
      updatedAt: '2023-12-15',
    },
  ]);

  // Status config
  const statusConfig: Record<PostStatus, { labelAr: string; labelEn: string; color: string }> = {
    draft: { labelAr: 'مسودة', labelEn: 'Draft', color: 'bg-gray-100 text-gray-800' },
    published: { labelAr: 'منشور', labelEn: 'Published', color: 'bg-green-100 text-green-800' },
    scheduled: { labelAr: 'مجدول', labelEn: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    archived: { labelAr: 'مؤرشف', labelEn: 'Archived', color: 'bg-yellow-100 text-yellow-800' },
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.title.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category.id === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Stats
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const selectAllPosts = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setShowTagModal(true);
  };

  const renderPostsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'إجمالي المقالات' : 'Total Posts'}</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'منشور' : 'Published'}</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'مسودات' : 'Drafts'}</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'مجدول' : 'Scheduled'}</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">{isRTL ? 'إجمالي المشاهدات' : 'Total Views'}</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث في المقالات...' : 'Search posts...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as PostStatus | 'all')}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {isRTL ? config.labelAr : config.labelEn}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{isRTL ? 'كل التصنيفات' : 'All Categories'}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {isRTL ? cat.nameAr : cat.nameEn}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowPostModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="size-5" />
          {isRTL ? 'مقال جديد' : 'New Post'}
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
          <span className="text-sm text-blue-800">
            {isRTL
              ? `تم اختيار ${selectedPosts.length} مقال`
              : `${selectedPosts.length} posts selected`}
          </span>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            {isRTL ? 'نشر' : 'Publish'}
          </button>
          <button className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700">
            {isRTL ? 'أرشفة' : 'Archive'}
          </button>
          <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
            {isRTL ? 'حذف' : 'Delete'}
          </button>
        </div>
      )}

      {/* Posts Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedPosts.length === filteredPosts.length && filteredPosts.length > 0
                  }
                  onChange={selectAllPosts}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'المقال' : 'Post'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'التصنيف' : 'Category'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'الكاتب' : 'Author'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'الحالة' : 'Status'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'المشاهدات' : 'Views'}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {isRTL ? 'التاريخ' : 'Date'}
              </th>
              <th className="w-24 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => togglePostSelection(post.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-16 overflow-hidden rounded-lg bg-gray-100">
                      {post.featuredImage ? (
                        <div className="flex size-full items-center justify-center bg-gray-200">
                          <Image className="size-6 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <FileText className="size-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{isRTL ? post.title.ar : post.title.en}</p>
                      <p className="line-clamp-1 text-sm text-gray-500">
                        {isRTL ? post.excerpt.ar : post.excerpt.en}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="size-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {post.readingTime} {isRTL ? 'دقيقة' : 'min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm">
                    {isRTL ? post.category.nameAr : post.category.nameEn}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
                      <User className="size-4 text-gray-500" />
                    </div>
                    <span className="text-sm">{post.author.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${statusConfig[post.status].color}`}
                  >
                    {isRTL ? statusConfig[post.status].labelAr : statusConfig[post.status].labelEn}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="size-4" />
                    {post.views.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {post.status === 'scheduled'
                    ? post.scheduledAt
                    : post.status === 'published'
                      ? post.publishedAt
                      : post.updatedAt}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="rounded p-1 hover:bg-gray-100"
                      title={isRTL ? 'تعديل' : 'Edit'}
                    >
                      <Edit className="size-4 text-gray-500" />
                    </button>
                    <button
                      className="rounded p-1 hover:bg-gray-100"
                      title={isRTL ? 'معاينة' : 'Preview'}
                    >
                      <Eye className="size-4 text-gray-500" />
                    </button>
                    <button
                      className="rounded p-1 hover:bg-gray-100"
                      title={isRTL ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {isRTL ? 'لا توجد مقالات' : 'No posts found'}
          </div>
        )}
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'التصنيفات' : 'Categories'}</h3>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="size-5" />
          {isRTL ? 'تصنيف جديد' : 'New Category'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <div key={category.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{isRTL ? category.nameAr : category.nameEn}</h4>
                <p className="text-sm text-gray-500">/{category.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <Edit className="size-4 text-gray-500" />
                </button>
                <button className="rounded p-1 hover:bg-gray-100">
                  <Trash2 className="size-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <FileText className="size-4" />
              <span>
                {category.postsCount} {isRTL ? 'مقال' : 'posts'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTagsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'الوسوم' : 'Tags'}</h3>
        <button
          onClick={() => {
            setEditingTag(null);
            setShowTagModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="size-5" />
          {isRTL ? 'وسم جديد' : 'New Tag'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center gap-2 rounded-full border bg-white px-4 py-2"
          >
            <Tag className="size-4 text-gray-400" />
            <span>{isRTL ? tag.nameAr : tag.nameEn}</span>
            <button
              onClick={() => handleEditTag(tag)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <Edit className="size-3 text-gray-400" />
            </button>
            <button className="rounded-full p-1 hover:bg-gray-100">
              <X className="size-3 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPostModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-bold">
            {editingPost
              ? isRTL
                ? 'تعديل المقال'
                : 'Edit Post'
              : isRTL
                ? 'مقال جديد'
                : 'New Post'}
          </h2>
          <button onClick={() => setShowPostModal(false)} className="rounded p-1 hover:bg-gray-100">
            <X className="size-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                defaultValue={editingPost?.title.ar}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                defaultValue={editingPost?.title.en}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              defaultValue={editingPost?.slug}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Excerpt */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'المقتطف (عربي)' : 'Excerpt (Arabic)'}
              </label>
              <textarea
                defaultValue={editingPost?.excerpt.ar}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={3}
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'المقتطف (إنجليزي)' : 'Excerpt (English)'}
              </label>
              <textarea
                defaultValue={editingPost?.excerpt.en}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'}
              </label>
              <textarea
                defaultValue={editingPost?.content.ar}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={10}
                dir="rtl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'}
              </label>
              <textarea
                defaultValue={editingPost?.content.en}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={10}
              />
            </div>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'التصنيف' : 'Category'}
              </label>
              <select
                defaultValue={editingPost?.category.id}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {isRTL ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{isRTL ? 'الوسوم' : 'Tags'}</label>
              <div className="flex flex-wrap gap-2 rounded-lg border p-2">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      defaultChecked={editingPost?.tags.some(t => t.id === tag.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{isRTL ? tag.nameAr : tag.nameEn}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الصورة الرئيسية' : 'Featured Image'}
            </label>
            <div className="rounded-lg border-2 border-dashed p-4 text-center">
              <Image className="mx-auto mb-2 size-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                {isRTL ? 'اسحب أو اختر صورة' : 'Drag or select image'}
              </p>
            </div>
          </div>

          {/* Status and Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الحالة' : 'Status'}
              </label>
              <select
                defaultValue={editingPost?.status || 'draft'}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {isRTL ? config.labelAr : config.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'تاريخ النشر المجدول' : 'Scheduled Date'}
              </label>
              <input
                type="datetime-local"
                defaultValue={editingPost?.scheduledAt || ''}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-medium">{isRTL ? 'إعدادات SEO' : 'SEO Settings'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'عنوان SEO (عربي)' : 'SEO Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    defaultValue={editingPost?.seo.title.ar}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'عنوان SEO (إنجليزي)' : 'SEO Title (English)'}
                  </label>
                  <input
                    type="text"
                    defaultValue={editingPost?.seo.title.en}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'وصف SEO (عربي)' : 'SEO Description (Arabic)'}
                  </label>
                  <textarea
                    defaultValue={editingPost?.seo.description.ar}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {isRTL ? 'وصف SEO (إنجليزي)' : 'SEO Description (English)'}
                  </label>
                  <textarea
                    defaultValue={editingPost?.seo.description.en}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={() => setShowPostModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Save className="size-5" />
            {isRTL ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCategoryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            {editingCategory
              ? isRTL
                ? 'تعديل التصنيف'
                : 'Edit Category'
              : isRTL
                ? 'تصنيف جديد'
                : 'New Category'}
          </h2>
          <button
            onClick={() => setShowCategoryModal(false)}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X className="size-6" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}
            </label>
            <input
              type="text"
              defaultValue={editingCategory?.nameAr}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}
            </label>
            <input
              type="text"
              defaultValue={editingCategory?.nameEn}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              defaultValue={editingCategory?.slug}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={() => setShowCategoryModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {isRTL ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTagModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            {editingTag ? (isRTL ? 'تعديل الوسم' : 'Edit Tag') : isRTL ? 'وسم جديد' : 'New Tag'}
          </h2>
          <button onClick={() => setShowTagModal(false)} className="rounded p-1 hover:bg-gray-100">
            <X className="size-6" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}
            </label>
            <input
              type="text"
              defaultValue={editingTag?.nameAr}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}
            </label>
            <input
              type="text"
              defaultValue={editingTag?.nameEn}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              defaultValue={editingTag?.slug}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={() => setShowTagModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {isRTL ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'المدونة' : 'Blog'}</h1>
            <p className="text-gray-500">
              {isRTL ? 'إدارة المقالات والتصنيفات' : 'Manage posts and categories'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex gap-4">
          {[
            { id: 'posts', labelAr: 'المقالات', labelEn: 'Posts' },
            { id: 'categories', labelAr: 'التصنيفات', labelEn: 'Categories' },
            { id: 'tags', labelAr: 'الوسوم', labelEn: 'Tags' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'posts' | 'categories' | 'tags')}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {isRTL ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'posts' && renderPostsTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'tags' && renderTagsTab()}
      </div>

      {/* Modals */}
      {showPostModal && renderPostModal()}
      {showCategoryModal && renderCategoryModal()}
      {showTagModal && renderTagModal()}
    </div>
  );
}
