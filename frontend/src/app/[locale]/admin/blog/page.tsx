'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Clock,
  FileText,
  Image,
  X,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  getPosts,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdatePostsStatus,
  type BlogPost,
  type BlogCategory,
  type PostStatus,
  type CreatePostData,
  type UpdatePostData,
  type CreateCategoryData,
  type UpdateCategoryData,
} from '@/services/admin/blog.service';

export default function BlogPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  // Post form state
  const [postForm, setPostForm] = useState<{
    titleAr: string;
    titleEn: string;
    slug: string;
    excerptAr: string;
    excerptEn: string;
    contentAr: string;
    contentEn: string;
    featuredImage: string;
    category: string;
    status: PostStatus;
    scheduledAt: string;
    isFeatured: boolean;
    readingTime: number;
    seoTitleAr: string;
    seoTitleEn: string;
    seoDescriptionAr: string;
    seoDescriptionEn: string;
  }>({
    titleAr: '',
    titleEn: '',
    slug: '',
    excerptAr: '',
    excerptEn: '',
    contentAr: '',
    contentEn: '',
    featuredImage: '',
    category: '',
    status: 'draft',
    scheduledAt: '',
    isFeatured: false,
    readingTime: 5,
    seoTitleAr: '',
    seoTitleEn: '',
    seoDescriptionAr: '',
    seoDescriptionEn: '',
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState<{
    nameAr: string;
    nameEn: string;
    slug: string;
    descriptionAr: string;
    descriptionEn: string;
    image: string;
    order: number;
    isActive: boolean;
  }>({
    nameAr: '',
    nameEn: '',
    slug: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    order: 0,
    isActive: true,
  });

  // Status config
  const statusConfig: Record<PostStatus, { labelAr: string; labelEn: string; color: string }> = {
    draft: { labelAr: 'مسودة', labelEn: 'Draft', color: 'bg-gray-100 text-gray-800' },
    published: { labelAr: 'منشور', labelEn: 'Published', color: 'bg-green-100 text-green-800' },
    scheduled: { labelAr: 'مجدول', labelEn: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    archived: { labelAr: 'مؤرشف', labelEn: 'Archived', color: 'bg-yellow-100 text-yellow-800' },
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts({
        page: currentPage,
        limit: postsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.pages);
        setTotalPosts(response.data.total);
      }
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحميل المقالات' : 'Error loading posts');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, categoryFilter, searchQuery, isRTL]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories({ limit: 100 });
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch {
      console.error('Error fetching categories');
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchQuery]);

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle post form submit
  const handleSavePost = async () => {
    setActionLoading(true);
    try {
      const postData: CreatePostData | UpdatePostData = {
        title: { ar: postForm.titleAr, en: postForm.titleEn },
        slug: postForm.slug || generateSlug(postForm.titleEn),
        excerpt: { ar: postForm.excerptAr, en: postForm.excerptEn },
        content: { ar: postForm.contentAr, en: postForm.contentEn },
        featuredImage: postForm.featuredImage || undefined,
        category: postForm.category,
        status: postForm.status,
        scheduledAt: postForm.scheduledAt || undefined,
        isFeatured: postForm.isFeatured,
        readingTime: postForm.readingTime,
        seo: {
          metaTitle: { ar: postForm.seoTitleAr, en: postForm.seoTitleEn },
          metaDescription: { ar: postForm.seoDescriptionAr, en: postForm.seoDescriptionEn },
        },
      };

      if (editingPost) {
        await updatePost(editingPost._id, postData);
      } else {
        await createPost(postData as CreatePostData);
      }

      setShowPostModal(false);
      setEditingPost(null);
      resetPostForm();
      fetchPosts();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء حفظ المقال' : 'Error saving post');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle post delete
  const handleDeletePost = async (id: string) => {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this post?'
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await deletePost(id);
      fetchPosts();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء حذف المقال' : 'Error deleting post');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: PostStatus) => {
    if (selectedPosts.length === 0) return;

    setActionLoading(true);
    try {
      await bulkUpdatePostsStatus({ ids: selectedPosts, status });
      setSelectedPosts([]);
      fetchPosts();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء تحديث المقالات' : 'Error updating posts');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle category form submit
  const handleSaveCategory = async () => {
    setActionLoading(true);
    try {
      const categoryData: CreateCategoryData | UpdateCategoryData = {
        name: { ar: categoryForm.nameAr, en: categoryForm.nameEn },
        slug: categoryForm.slug || generateSlug(categoryForm.nameEn),
        description: { ar: categoryForm.descriptionAr, en: categoryForm.descriptionEn },
        image: categoryForm.image || undefined,
        order: categoryForm.order,
        isActive: categoryForm.isActive,
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryData);
      } else {
        await createCategory(categoryData as CreateCategoryData);
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchCategories();
    } catch {
      setError(isRTL ? 'حدث خطأ أثناء حفظ الفئة' : 'Error saving category');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle category delete
  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?'
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      setError(isRTL ? 'لا يمكن حذف فئة تحتوي على مقالات' : 'Cannot delete category with posts');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset forms
  const resetPostForm = () => {
    setPostForm({
      titleAr: '',
      titleEn: '',
      slug: '',
      excerptAr: '',
      excerptEn: '',
      contentAr: '',
      contentEn: '',
      featuredImage: '',
      category: categories[0]?._id || '',
      status: 'draft',
      scheduledAt: '',
      isFeatured: false,
      readingTime: 5,
      seoTitleAr: '',
      seoTitleEn: '',
      seoDescriptionAr: '',
      seoDescriptionEn: '',
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      nameAr: '',
      nameEn: '',
      slug: '',
      descriptionAr: '',
      descriptionEn: '',
      image: '',
      order: 0,
      isActive: true,
    });
  };

  // Edit handlers
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      titleAr: post.title.ar,
      titleEn: post.title.en,
      slug: post.slug,
      excerptAr: post.excerpt.ar,
      excerptEn: post.excerpt.en,
      contentAr: post.content.ar,
      contentEn: post.content.en,
      featuredImage: post.featuredImage || '',
      category: typeof post.category === 'string' ? post.category : post.category._id,
      status: post.status,
      scheduledAt: post.scheduledAt || '',
      isFeatured: post.isFeatured,
      readingTime: post.readingTime,
      seoTitleAr: post.seo?.metaTitle?.ar || '',
      seoTitleEn: post.seo?.metaTitle?.en || '',
      seoDescriptionAr: post.seo?.metaDescription?.ar || '',
      seoDescriptionEn: post.seo?.metaDescription?.en || '',
    });
    setShowPostModal(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      nameAr: category.name.ar,
      nameEn: category.name.en,
      slug: category.slug,
      descriptionAr: category.description?.ar || '',
      descriptionEn: category.description?.en || '',
      image: category.image || '',
      order: category.order,
      isActive: category.isActive,
    });
    setShowCategoryModal(true);
  };

  // Selection handlers
  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const selectAllPosts = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(p => p._id));
    }
  };

  // Get category name helper
  const getCategoryName = (category: BlogCategory | string): string => {
    if (typeof category === 'string') {
      const cat = categories.find(c => c._id === category);
      return cat ? (isRTL ? cat.name.ar : cat.name.en) : '';
    }
    return isRTL ? category.name.ar : category.name.en;
  };

  // Get author name helper
  const getAuthorName = (author: BlogPost['author']): string => {
    if (typeof author === 'string') return '';
    return author.name || '';
  };

  // Stats
  const stats = {
    total: totalPosts,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  };

  // Render posts tab
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
            <option key={cat._id} value={cat._id}>
              {isRTL ? cat.name.ar : cat.name.en}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setEditingPost(null);
            resetPostForm();
            setShowPostModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="size-5" />
          {isRTL ? 'مقال جديد' : 'New Post'}
        </button>
        <button
          onClick={() => fetchPosts()}
          className="rounded-lg border p-2 hover:bg-gray-50"
          title={isRTL ? 'تحديث' : 'Refresh'}
        >
          <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
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
          <button
            onClick={() => handleBulkStatusUpdate('published')}
            disabled={actionLoading}
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isRTL ? 'نشر' : 'Publish'}
          </button>
          <button
            onClick={() => handleBulkStatusUpdate('archived')}
            disabled={actionLoading}
            className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {isRTL ? 'أرشفة' : 'Archive'}
          </button>
          <button
            onClick={() => setSelectedPosts([])}
            className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
          >
            {isRTL ? 'إلغاء التحديد' : 'Clear'}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Posts Table */}
          <div className="overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length && posts.length > 0}
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
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post._id)}
                        onChange={() => togglePostSelection(post._id)}
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
                        {getCategoryName(post.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
                          <User className="size-4 text-gray-500" />
                        </div>
                        <span className="text-sm">{getAuthorName(post.author)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${statusConfig[post.status].color}`}
                      >
                        {isRTL
                          ? statusConfig[post.status].labelAr
                          : statusConfig[post.status].labelEn}
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
                          onClick={() => handleDeletePost(post._id)}
                          className="rounded p-1 hover:bg-gray-100"
                          title={isRTL ? 'حذف' : 'Delete'}
                          disabled={actionLoading}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {isRTL ? 'لا توجد مقالات' : 'No posts found'}
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
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              <span className="text-sm text-gray-500">
                {isRTL
                  ? `صفحة ${currentPage} من ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isRTL ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render categories tab
  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'التصنيفات' : 'Categories'}</h3>
        <button
          onClick={() => {
            setEditingCategory(null);
            resetCategoryForm();
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
          <div key={category._id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{isRTL ? category.name.ar : category.name.en}</h4>
                <p className="text-sm text-gray-500">/{category.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <Edit className="size-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="rounded p-1 hover:bg-gray-100"
                  disabled={actionLoading}
                >
                  <Trash2 className="size-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <FileText className="size-4" />
              <span>
                {category.postCount || 0} {isRTL ? 'مقال' : 'posts'}
              </span>
              {!category.isActive && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {isRTL ? 'غير نشط' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Post Modal
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
                value={postForm.titleAr}
                onChange={e => setPostForm({ ...postForm, titleAr: e.target.value })}
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
                value={postForm.titleEn}
                onChange={e => setPostForm({ ...postForm, titleEn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              value={postForm.slug}
              onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
              placeholder={postForm.titleEn ? generateSlug(postForm.titleEn) : ''}
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
                value={postForm.excerptAr}
                onChange={e => setPostForm({ ...postForm, excerptAr: e.target.value })}
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
                value={postForm.excerptEn}
                onChange={e => setPostForm({ ...postForm, excerptEn: e.target.value })}
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
                value={postForm.contentAr}
                onChange={e => setPostForm({ ...postForm, contentAr: e.target.value })}
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
                value={postForm.contentEn}
                onChange={e => setPostForm({ ...postForm, contentEn: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows={10}
              />
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={postForm.category}
                onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{isRTL ? 'اختر التصنيف' : 'Select Category'}</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {isRTL ? cat.name.ar : cat.name.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'الحالة' : 'Status'}
              </label>
              <select
                value={postForm.status}
                onChange={e => setPostForm({ ...postForm, status: e.target.value as PostStatus })}
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
                {isRTL ? 'وقت القراءة (دقائق)' : 'Reading Time (min)'}
              </label>
              <input
                type="number"
                value={postForm.readingTime}
                onChange={e =>
                  setPostForm({ ...postForm, readingTime: parseInt(e.target.value) || 5 })
                }
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min={1}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isRTL ? 'رابط الصورة الرئيسية' : 'Featured Image URL'}
            </label>
            <input
              type="text"
              value={postForm.featuredImage}
              onChange={e => setPostForm({ ...postForm, featuredImage: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Scheduled Date */}
          {postForm.status === 'scheduled' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'تاريخ النشر المجدول' : 'Scheduled Date'}
              </label>
              <input
                type="datetime-local"
                value={postForm.scheduledAt}
                onChange={e => setPostForm({ ...postForm, scheduledAt: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Featured checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={postForm.isFeatured}
              onChange={e => setPostForm({ ...postForm, isFeatured: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              {isRTL ? 'مقال مميز' : 'Featured Post'}
            </label>
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
                    value={postForm.seoTitleAr}
                    onChange={e => setPostForm({ ...postForm, seoTitleAr: e.target.value })}
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
                    value={postForm.seoTitleEn}
                    onChange={e => setPostForm({ ...postForm, seoTitleEn: e.target.value })}
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
                    value={postForm.seoDescriptionAr}
                    onChange={e => setPostForm({ ...postForm, seoDescriptionAr: e.target.value })}
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
                    value={postForm.seoDescriptionEn}
                    onChange={e => setPostForm({ ...postForm, seoDescriptionEn: e.target.value })}
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
          <button
            onClick={handleSavePost}
            disabled={actionLoading || !postForm.titleAr || !postForm.titleEn || !postForm.category}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Save className="size-5" />
            )}
            {isRTL ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  // Category Modal
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
              value={categoryForm.nameAr}
              onChange={e => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
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
              value={categoryForm.nameEn}
              onChange={e => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الرابط' : 'Slug'}</label>
            <input
              type="text"
              value={categoryForm.slug}
              onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              placeholder={categoryForm.nameEn ? generateSlug(categoryForm.nameEn) : ''}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{isRTL ? 'الترتيب' : 'Order'}</label>
            <input
              type="number"
              value={categoryForm.order}
              onChange={e =>
                setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={categoryForm.isActive}
              onChange={e => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              {isRTL ? 'نشط' : 'Active'}
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={() => setShowCategoryModal(false)}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSaveCategory}
            disabled={actionLoading || !categoryForm.nameAr || !categoryForm.nameEn}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Save className="size-5" />
            )}
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
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'posts' | 'categories')}
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
      </div>

      {/* Modals */}
      {showPostModal && renderPostModal()}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
}
