/**
 * Admin Blog Service Tests
 * اختبارات خدمة إدارة المدونة
 */

import { apiClient } from '@/lib/api';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  bulkUpdatePostsStatus,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPostStats,
} from '../admin/blog.service';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Admin Blog Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Posts API', () => {
    describe('getPosts', () => {
      it('should fetch posts with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            posts: [{ _id: '1', title: { ar: 'مقال', en: 'Post' }, slug: 'post-1' }],
            total: 1,
            pagination: { page: 1, limit: 10, pages: 1 },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getPosts();

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/posts', {});
        expect(result).toEqual(mockResponse);
      });

      it('should fetch posts with filters', async () => {
        const mockResponse = {
          success: true,
          data: { posts: [], total: 0, pagination: { page: 1, limit: 10, pages: 0 } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        await getPosts({
          page: 2,
          limit: 20,
          status: 'published',
          category: 'cat-1',
          search: 'test',
        });

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/posts', {
          page: 2,
          limit: 20,
          status: 'published',
          category: 'cat-1',
          search: 'test',
        });
      });

      it('should handle API errors', async () => {
        mockApiClient.get.mockRejectedValue(new Error('Network error'));

        await expect(getPosts()).rejects.toThrow('Network error');
      });
    });

    describe('getPostById', () => {
      it('should fetch post by ID', async () => {
        const mockResponse = {
          success: true,
          data: { post: { _id: '123', title: { ar: 'مقال', en: 'Post' } } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getPostById('123');

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/posts/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('createPost', () => {
      it('should create a new post', async () => {
        const postData = {
          title: { ar: 'مقال جديد', en: 'New Post' },
          slug: 'new-post',
          excerpt: { ar: 'مقتطف', en: 'Excerpt' },
          content: { ar: 'محتوى', en: 'Content' },
          category: 'cat-1',
          status: 'draft' as const,
        };
        const mockResponse = {
          success: true,
          data: { message: 'Post created', post: { _id: '123', ...postData } },
        };
        mockApiClient.post.mockResolvedValue(mockResponse);

        const result = await createPost(postData);

        expect(mockApiClient.post).toHaveBeenCalledWith('/blog/admin/posts', postData);
        expect(result).toEqual(mockResponse);
      });

      it('should handle validation errors', async () => {
        const postData = {
          title: { ar: '', en: '' },
          slug: '',
          excerpt: { ar: '', en: '' },
          content: { ar: '', en: '' },
          category: '',
        };
        mockApiClient.post.mockRejectedValue({ response: { status: 400 } });

        await expect(createPost(postData)).rejects.toBeDefined();
      });
    });

    describe('updatePost', () => {
      it('should update an existing post', async () => {
        const updateData = { title: { ar: 'عنوان محدث', en: 'Updated Title' } };
        const mockResponse = {
          success: true,
          data: { message: 'Post updated', post: { _id: '123', ...updateData } },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await updatePost('123', updateData);

        expect(mockApiClient.put).toHaveBeenCalledWith('/blog/admin/posts/123', updateData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deletePost', () => {
      it('should delete a post', async () => {
        const mockResponse = { success: true, data: { message: 'Post deleted' } };
        mockApiClient.delete.mockResolvedValue(mockResponse);

        const result = await deletePost('123');

        expect(mockApiClient.delete).toHaveBeenCalledWith('/blog/admin/posts/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('bulkUpdatePostsStatus', () => {
      it('should bulk update posts status', async () => {
        const bulkData = { ids: ['1', '2', '3'], status: 'published' as const };
        const mockResponse = {
          success: true,
          data: { message: '3 posts updated', modifiedCount: 3 },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await bulkUpdatePostsStatus(bulkData);

        expect(mockApiClient.put).toHaveBeenCalledWith('/blog/admin/posts/bulk-status', bulkData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getPostStats', () => {
      it('should fetch post statistics', async () => {
        const mockResponse = {
          success: true,
          data: {
            total: 100,
            published: 50,
            draft: 30,
            scheduled: 10,
            archived: 10,
            totalViews: 5000,
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getPostStats();

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/stats');
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Categories API', () => {
    describe('getCategories', () => {
      it('should fetch categories with default filters', async () => {
        const mockResponse = {
          success: true,
          data: {
            categories: [{ _id: '1', name: { ar: 'تصنيف', en: 'Category' }, slug: 'category' }],
            total: 1,
            pagination: { page: 1, limit: 100, pages: 1 },
          },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getCategories();

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/categories', {});
        expect(result).toEqual(mockResponse);
      });

      it('should fetch categories with filters', async () => {
        const mockResponse = { success: true, data: { categories: [], total: 0 } };
        mockApiClient.get.mockResolvedValue(mockResponse);

        await getCategories({ page: 1, limit: 50, isActive: true, search: 'test' });

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/categories', {
          page: 1,
          limit: 50,
          isActive: true,
          search: 'test',
        });
      });

      it('should handle null parent filter', async () => {
        const mockResponse = { success: true, data: { categories: [] } };
        mockApiClient.get.mockResolvedValue(mockResponse);

        await getCategories({ parent: null });

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/categories', {
          parent: 'null',
        });
      });
    });

    describe('getCategoryById', () => {
      it('should fetch category by ID', async () => {
        const mockResponse = {
          success: true,
          data: { category: { _id: '123', name: { ar: 'تصنيف', en: 'Category' } } },
        };
        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await getCategoryById('123');

        expect(mockApiClient.get).toHaveBeenCalledWith('/blog/admin/categories/123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('createCategory', () => {
      it('should create a new category', async () => {
        const categoryData = {
          name: { ar: 'تصنيف جديد', en: 'New Category' },
          slug: 'new-category',
          order: 1,
          isActive: true,
        };
        const mockResponse = {
          success: true,
          data: { message: 'Category created', category: { _id: '123', ...categoryData } },
        };
        mockApiClient.post.mockResolvedValue(mockResponse);

        const result = await createCategory(categoryData);

        expect(mockApiClient.post).toHaveBeenCalledWith('/blog/admin/categories', categoryData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateCategory', () => {
      it('should update an existing category', async () => {
        const updateData = { name: { ar: 'تصنيف محدث', en: 'Updated Category' } };
        const mockResponse = {
          success: true,
          data: { message: 'Category updated', category: { _id: '123', ...updateData } },
        };
        mockApiClient.put.mockResolvedValue(mockResponse);

        const result = await updateCategory('123', updateData);

        expect(mockApiClient.put).toHaveBeenCalledWith('/blog/admin/categories/123', updateData);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteCategory', () => {
      it('should delete a category', async () => {
        const mockResponse = { success: true, data: { message: 'Category deleted' } };
        mockApiClient.delete.mockResolvedValue(mockResponse);

        const result = await deleteCategory('123');

        expect(mockApiClient.delete).toHaveBeenCalledWith('/blog/admin/categories/123');
        expect(result).toEqual(mockResponse);
      });

      it('should handle deletion of category with posts', async () => {
        mockApiClient.delete.mockRejectedValue({
          response: { status: 400, data: { message: 'Cannot delete category with posts' } },
        });

        await expect(deleteCategory('123')).rejects.toBeDefined();
      });
    });
  });
});
