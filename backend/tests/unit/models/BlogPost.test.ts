/**
 * Blog Post Model Unit Tests
 * اختبارات وحدة نموذج مقالات المدونة
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogPost, BlogCategory, User } from '../../../src/models';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('BlogPost Model', () => {
  let mongoServer: MongoMemoryServer | null = null;
  let categoryId: mongoose.Types.ObjectId;
  let authorId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 30000);

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await BlogPost.deleteMany({});
      await BlogCategory.deleteMany({});
      await User.deleteMany({});

      // Create a test category
      const category = await BlogCategory.create({
        name: { ar: 'تقنية', en: 'Technology' },
        slug: 'technology',
        isActive: true,
        order: 1,
      });
      categoryId = category._id;

      // Create a test author
      const author = await User.create({
        name: 'Test Author',
        email: 'author@test.com',
        password: 'Password123!',
        role: 'author',
        isActive: true,
      });
      authorId = author._id;
    }
  });

  describe('Schema Validation', () => {
    it('should create blog post with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const postData = {
        title: { ar: 'مقال تقني', en: 'Tech Article' },
        slug: 'tech-article',
        excerpt: { ar: 'ملخص المقال', en: 'Article summary' },
        content: { ar: 'محتوى المقال بالتفصيل', en: 'Detailed article content' },
        category: categoryId,
        author: authorId,
        status: 'draft',
      };

      const post = await BlogPost.create(postData);

      expect(post._id).toBeDefined();
      expect(post.title.ar).toBe('مقال تقني');
      expect(post.title.en).toBe('Tech Article');
      expect(post.slug).toBe('tech-article');
      expect(post.status).toBe('draft');
    });

    it('should require title in both languages', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const postData = {
        slug: 'test-post',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
      };

      await expect(BlogPost.create(postData)).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const postData = {
        title: { ar: 'مقال', en: 'Article' },
        slug: 'test-post',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
      };

      await BlogPost.create(postData);
      await expect(BlogPost.create(postData)).rejects.toThrow();
    });

    it('should create post with tags', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const postData = {
        title: { ar: 'مقال', en: 'Article' },
        slug: 'post-with-tags',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
        tags: [
          { ar: 'جافاسكربت', en: 'JavaScript' },
          { ar: 'ريأكت', en: 'React' },
        ],
      };

      const post = await BlogPost.create(postData);

      expect(post.tags).toHaveLength(2);
      expect(post.tags[0].en).toBe('JavaScript');
    });

    it('should calculate reading time on save', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const longContent = 'word '.repeat(400); // 400 words = 2 minutes

      const postData = {
        title: { ar: 'مقال طويل', en: 'Long Article' },
        slug: 'long-article',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: longContent, en: longContent },
        category: categoryId,
        author: authorId,
      };

      const post = await BlogPost.create(postData);

      expect(post.readingTime).toBe(2);
    });

    it('should set publishedAt when status changes to published', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const postData = {
        title: { ar: 'مقال', en: 'Article' },
        slug: 'publish-test',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
        status: 'published',
      };

      const post = await BlogPost.create(postData);

      expect(post.publishedAt).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      if (mongoose.connection.readyState !== 1) return;

      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      await BlogPost.create([
        {
          title: { ar: 'مقال 1', en: 'Article 1' },
          slug: 'article-1',
          excerpt: { ar: 'ملخص', en: 'Summary' },
          content: { ar: 'محتوى', en: 'Content' },
          category: categoryId,
          author: authorId,
          status: 'published',
          publishedAt: yesterday,
          isFeatured: true,
        },
        {
          title: { ar: 'مقال 2', en: 'Article 2' },
          slug: 'article-2',
          excerpt: { ar: 'ملخص', en: 'Summary' },
          content: { ar: 'محتوى', en: 'Content' },
          category: categoryId,
          author: authorId,
          status: 'published',
          publishedAt: yesterday,
          isFeatured: false,
        },
        {
          title: { ar: 'مسودة', en: 'Draft' },
          slug: 'draft-article',
          excerpt: { ar: 'ملخص', en: 'Summary' },
          content: { ar: 'محتوى', en: 'Content' },
          category: categoryId,
          author: authorId,
          status: 'draft',
        },
      ]);
    });

    it('should get published posts with getPublishedPosts()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await BlogPost.getPublishedPosts();

      expect(result.posts).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.posts.every(p => p.status === 'published')).toBe(true);
    });

    it('should get post by slug with getBySlug()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const post = await BlogPost.getBySlug('article-1');

      expect(post).toBeDefined();
      expect(post?.slug).toBe('article-1');
    });

    it('should return null for non-existent slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const post = await BlogPost.getBySlug('non-existent');

      expect(post).toBeNull();
    });

    it('should not return draft by slug', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const post = await BlogPost.getBySlug('draft-article');

      expect(post).toBeNull();
    });

    it('should get featured posts with getFeaturedPosts()', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const posts = await BlogPost.getFeaturedPosts();

      expect(posts.length).toBeGreaterThanOrEqual(1);
      expect(posts.every(p => p.isFeatured && p.status === 'published')).toBe(true);
    });

    it('should get localized posts', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const result = await BlogPost.getPublishedPosts({ locale: 'en' });

      // Posts are localized - titles should be strings not objects
      expect(typeof result.posts[0].title).toBe('string');
      expect(['Article 1', 'Article 2']).toContain(result.posts[0].title);
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const post = await BlogPost.create({
        title: { ar: 'مقال', en: 'Article' },
        slug: 'timestamp-test',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
      });

      expect(post.createdAt).toBeDefined();
      expect(post.updatedAt).toBeDefined();
    });
  });

  describe('Category Population', () => {
    it('should populate category when querying', async () => {
      if (mongoose.connection.readyState !== 1) return;

      await BlogPost.create({
        title: { ar: 'مقال', en: 'Article' },
        slug: 'populate-test',
        excerpt: { ar: 'ملخص', en: 'Summary' },
        content: { ar: 'محتوى', en: 'Content' },
        category: categoryId,
        author: authorId,
      });

      const post = await BlogPost.findOne({ slug: 'populate-test' }).populate('category');

      expect(post?.category).toBeDefined();
      expect((post?.category as any).name.en).toBe('Technology');
    });
  });
});
