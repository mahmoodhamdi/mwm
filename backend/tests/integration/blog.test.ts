/**
 * Blog Integration Tests
 * اختبارات تكامل المدونة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';
process.env['CLIENT_URL'] = 'http://localhost:3000';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import { User, BlogCategory, BlogPost, BlogComment } from '../../src/models';
import { Express } from 'express';
import { getCookieValue } from '../helpers/auth.helper';

async function getAdminToken(app: Express): Promise<string> {
  const user = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Test@1234',
    role: 'super_admin',
    isActive: true,
    isEmailVerified: true,
  });
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.com', password: 'Test@1234' });
  return getCookieValue(res, 'accessToken');
}

async function getUserToken(app: Express): Promise<string> {
  const user = await User.create({
    name: 'Regular User',
    email: 'user@test.com',
    password: 'Test@1234',
    role: 'viewer',
    isActive: true,
    isEmailVerified: true,
  });
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'user@test.com', password: 'Test@1234' });
  return getCookieValue(res, 'accessToken');
}

describe('Blog API', () => {
  let app: Express | null = null;
  let mongoServer: MongoMemoryServer | null = null;
  let isConnected = false;

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      app = createApp();
      isConnected = true;
    } catch {
      console.warn('MongoMemoryServer could not start');
      isConnected = false;
    }
  }, 120000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
      await User.deleteMany({});
      await BlogCategory.deleteMany({});
      await BlogPost.deleteMany({});
      await BlogComment.deleteMany({});
    }
  });

  // ============================================
  // PUBLIC ROUTES - Categories
  // ============================================

  describe('GET /api/v1/blog/categories', () => {
    it('should get all active categories', async () => {
      if (!isConnected || !app) return;

      await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/blog/categories').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categories).toHaveLength(1);
    });
  });

  describe('GET /api/v1/blog/categories/:slug', () => {
    it('should get category by slug', async () => {
      if (!isConnected || !app) return;

      await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const response = await request(app).get('/api/v1/blog/categories/technology').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.category.slug).toBe('technology');
    });
  });

  // ============================================
  // PUBLIC ROUTES - Posts
  // ============================================

  describe('GET /api/v1/blog/tags', () => {
    it('should get all tags', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/blog/tags').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tags)).toBe(true);
    });
  });

  describe('GET /api/v1/blog/featured', () => {
    it('should get featured posts', async () => {
      if (!isConnected || !app) return;

      const response = await request(app).get('/api/v1/blog/featured').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
    });
  });

  describe('GET /api/v1/blog/posts', () => {
    it('should get published posts with pagination', async () => {
      if (!isConnected || !app) return;

      const response = await request(app)
        .get('/api/v1/blog/posts')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.posts).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe('GET /api/v1/blog/posts/:slug', () => {
    it('should get post by slug', async () => {
      if (!isConnected || !app) return;

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const response = await request(app).get('/api/v1/blog/posts/tech-post').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post.slug).toBe('tech-post');
    });
  });

  describe('GET /api/v1/blog/posts/:slug/related', () => {
    it('should get related posts', async () => {
      if (!isConnected || !app) return;

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const response = await request(app).get('/api/v1/blog/posts/tech-post/related').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
    });
  });

  describe('GET /api/v1/blog/posts/:slug/comments', () => {
    it('should get post comments', async () => {
      if (!isConnected || !app) return;

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const response = await request(app)
        .get('/api/v1/blog/posts/tech-post/comments')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  // ============================================
  // PUBLIC ROUTES - Comments
  // ============================================

  describe('POST /api/v1/blog/posts/comments/guest', () => {
    it('should create guest comment', async () => {
      if (!isConnected || !app) return;

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/blog/posts/comments/guest')
        .send({
          post: post._id.toString(),
          content: 'Great article!',
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comment.content).toBe('Great article!');
    });
  });

  // ============================================
  // USER ROUTES
  // ============================================

  describe('POST /api/v1/blog/posts/comments', () => {
    it('should create authenticated comment', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/blog/posts/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          post: post._id.toString(),
          content: 'Excellent post!',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comment.content).toBe('Excellent post!');
    });
  });

  describe('POST /api/v1/blog/comments/:id/like', () => {
    it('should toggle comment like', async () => {
      if (!isConnected || !app) return;

      const userToken = await getUserToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.create({
        name: 'Author',
        email: 'author@test.com',
        password: 'Test@1234',
        role: 'author',
      });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const comment = await BlogComment.create({
        post: post._id,
        content: 'Test comment',
        guestName: 'Guest',
        guestEmail: 'guest@test.com',
        status: 'approved',
      });

      const response = await request(app)
        .post(`/api/v1/blog/comments/${comment._id}/like`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  // ============================================
  // ADMIN ROUTES - Categories
  // ============================================

  describe('GET /api/v1/blog/admin/categories', () => {
    it('should get all categories for admin', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/blog/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/v1/blog/admin/categories', () => {
    it('should create category', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .post('/api/v1/blog/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: { ar: 'تقنية', en: 'Technology' },
          slug: 'technology',
          description: { ar: 'وصف', en: 'Description' },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.category.slug).toBe('technology');
    });
  });

  describe('PUT /api/v1/blog/admin/categories/:id', () => {
    it('should update category', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const response = await request(app)
        .put(`/api/v1/blog/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: { ar: 'تقنية محدثة', en: 'Updated Technology' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/blog/admin/categories/:id', () => {
    it('should delete category', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/v1/blog/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN ROUTES - Posts
  // ============================================

  describe('GET /api/v1/blog/admin/posts', () => {
    it('should get all posts for admin', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/blog/admin/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/v1/blog/admin/posts/:id', () => {
    it('should get post by ID', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'draft',
      });

      const response = await request(app)
        .get(`/api/v1/blog/admin/posts/${post._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post.slug).toBe('tech-post');
    });
  });

  describe('POST /api/v1/blog/admin/posts', () => {
    it('should create post', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const response = await request(app)
        .post('/api/v1/blog/admin/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { ar: 'مقال جديد', en: 'New Post' },
          slug: 'new-post',
          excerpt: { ar: 'ملخص', en: 'Excerpt' },
          content: { ar: 'محتوى طويل', en: 'Long content' },
          category: category._id.toString(),
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post.slug).toBe('new-post');
    });
  });

  describe('PUT /api/v1/blog/admin/posts/:id', () => {
    it('should update post', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'draft',
      });

      const response = await request(app)
        .put(`/api/v1/blog/admin/posts/${post._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { ar: 'مقال محدث', en: 'Updated Post' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/blog/admin/posts/:id', () => {
    it('should delete post', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'draft',
      });

      const response = await request(app)
        .delete(`/api/v1/blog/admin/posts/${post._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/blog/admin/posts/bulk-status', () => {
    it('should bulk update post status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post1 = await BlogPost.create({
        title: { ar: 'مقال 1', en: 'Post 1' },
        slug: 'post-1',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'draft',
      });

      const post2 = await BlogPost.create({
        title: { ar: 'مقال 2', en: 'Post 2' },
        slug: 'post-2',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'draft',
      });

      const response = await request(app)
        .put('/api/v1/blog/admin/posts/bulk-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ids: [post1._id.toString(), post2._id.toString()],
          status: 'published',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN ROUTES - Comments
  // ============================================

  describe('GET /api/v1/blog/admin/comments', () => {
    it('should get all comments for admin', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/blog/admin/comments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/v1/blog/admin/comments/:id', () => {
    it('should update comment status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const comment = await BlogComment.create({
        post: post._id,
        content: 'Test comment',
        guestName: 'Guest',
        guestEmail: 'guest@test.com',
        status: 'pending',
      });

      const response = await request(app)
        .put(`/api/v1/blog/admin/comments/${comment._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/blog/admin/comments/:id', () => {
    it('should delete comment', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const comment = await BlogComment.create({
        post: post._id,
        content: 'Test comment',
        guestName: 'Guest',
        guestEmail: 'guest@test.com',
        status: 'pending',
      });

      const response = await request(app)
        .delete(`/api/v1/blog/admin/comments/${comment._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/v1/blog/admin/comments/bulk-status', () => {
    it('should bulk update comment status', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
      });

      const author = await User.findOne({ email: 'admin@test.com' });

      const post = await BlogPost.create({
        title: { ar: 'مقال تقني', en: 'Tech Post' },
        slug: 'tech-post',
        excerpt: { ar: 'ملخص', en: 'Excerpt' },
        content: { ar: 'محتوى', en: 'Content' },
        category: category._id,
        author: author!._id,
        status: 'published',
        publishedAt: new Date(),
      });

      const comment1 = await BlogComment.create({
        post: post._id,
        content: 'Comment 1',
        guestName: 'Guest',
        guestEmail: 'guest@test.com',
        status: 'pending',
      });

      const comment2 = await BlogComment.create({
        post: post._id,
        content: 'Comment 2',
        guestName: 'Guest',
        guestEmail: 'guest@test.com',
        status: 'pending',
      });

      const response = await request(app)
        .put('/api/v1/blog/admin/comments/bulk-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ids: [comment1._id.toString(), comment2._id.toString()],
          status: 'approved',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/blog/admin/stats', () => {
    it('should get blog statistics', async () => {
      if (!isConnected || !app) return;

      const adminToken = await getAdminToken(app);

      const response = await request(app)
        .get('/api/v1/blog/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeDefined();
    });
  });
});
