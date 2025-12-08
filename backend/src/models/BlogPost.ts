/**
 * Blog Post Model
 * نموذج مقال المدونة
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Bilingual content interface
 * واجهة المحتوى ثنائي اللغة
 */
interface IBilingual {
  ar: string;
  en: string;
}

/**
 * SEO interface
 * واجهة السيو
 */
interface ISEO {
  metaTitle?: IBilingual;
  metaDescription?: IBilingual;
  metaKeywords?: string[];
  ogImage?: string;
}

/**
 * Blog Post status type
 * نوع حالة المقال
 */
export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

/**
 * Blog Post interface
 * واجهة مقال المدونة
 */
export interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: IBilingual;
  slug: string;
  excerpt: IBilingual;
  content: IBilingual;
  featuredImage?: string;
  images?: string[];
  category: mongoose.Types.ObjectId;
  tags: IBilingual[];
  author: mongoose.Types.ObjectId;
  status: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  isFeatured: boolean;
  views: number;
  readingTime: number;
  seo?: ISEO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Post schema
 * مخطط مقال المدونة
 */
const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      ar: {
        type: String,
        required: [true, 'Arabic title is required | العنوان بالعربية مطلوب'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters | العنوان لا يمكن أن يتجاوز 200 حرف'],
      },
      en: {
        type: String,
        required: [true, 'English title is required | العنوان بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters | العنوان لا يمكن أن يتجاوز 200 حرف'],
      },
    },

    slug: {
      type: String,
      required: [true, 'Slug is required | الرابط المختصر مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be URL-friendly | الرابط المختصر يجب أن يكون صالحاً للعناوين',
      ],
    },

    excerpt: {
      ar: {
        type: String,
        required: [true, 'Arabic excerpt is required | الملخص بالعربية مطلوب'],
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters | الملخص لا يمكن أن يتجاوز 500 حرف'],
      },
      en: {
        type: String,
        required: [true, 'English excerpt is required | الملخص بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters | الملخص لا يمكن أن يتجاوز 500 حرف'],
      },
    },

    content: {
      ar: {
        type: String,
        required: [true, 'Arabic content is required | المحتوى بالعربية مطلوب'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English content is required | المحتوى بالإنجليزية مطلوب'],
        trim: true,
      },
    },

    featuredImage: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    category: {
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory',
      required: [true, 'Category is required | الفئة مطلوبة'],
      index: true,
    },

    tags: [
      {
        ar: { type: String, trim: true },
        en: { type: String, trim: true },
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required | الكاتب مطلوب'],
      index: true,
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true,
    },

    publishedAt: {
      type: Date,
      index: true,
    },

    scheduledAt: {
      type: Date,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 1,
    },

    seo: {
      metaTitle: {
        ar: { type: String, trim: true, maxlength: 60 },
        en: { type: String, trim: true, maxlength: 60 },
      },
      metaDescription: {
        ar: { type: String, trim: true, maxlength: 160 },
        en: { type: String, trim: true, maxlength: 160 },
      },
      metaKeywords: [{ type: String, trim: true }],
      ogImage: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    collection: 'blogposts',
  }
);

// Indexes
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1, publishedAt: -1 });
blogPostSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });
blogPostSchema.index({
  'title.ar': 'text',
  'title.en': 'text',
  'excerpt.ar': 'text',
  'excerpt.en': 'text',
  'content.ar': 'text',
  'content.en': 'text',
});

// Pre-save middleware to calculate reading time
blogPostSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    // Calculate reading time based on average reading speed (200 words/minute)
    const arWords = this.content.ar?.split(/\s+/).length || 0;
    const enWords = this.content.en?.split(/\s+/).length || 0;
    const totalWords = Math.max(arWords, enWords);
    this.readingTime = Math.ceil(totalWords / 200) || 1;
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

/**
 * Get published posts
 * جلب المقالات المنشورة
 */
blogPostSchema.statics.getPublishedPosts = async function (
  options: {
    category?: string;
    tag?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  } = {}
): Promise<{ posts: IBlogPost[]; total: number }> {
  const { category, tag, locale, featured, limit = 10, page = 1, search } = options;

  const filter: Record<string, unknown> = {
    status: 'published',
    publishedAt: { $lte: new Date() },
  };

  if (category) filter.category = category;
  if (featured !== undefined) filter.isFeatured = featured;
  if (tag) {
    filter.$or = [{ 'tags.ar': tag }, { 'tags.en': tag }];
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  const posts = await this.find(filter)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  if (locale) {
    const localizedPosts = posts.map((post: IBlogPost) => ({
      ...post.toObject(),
      title: post.title[locale],
      excerpt: post.excerpt[locale],
      content: post.content[locale],
      tags: post.tags?.map(t => t[locale]),
    }));
    return { posts: localizedPosts, total };
  }

  return { posts, total };
};

/**
 * Get post by slug
 * جلب المقال بالرابط المختصر
 */
blogPostSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IBlogPost | null> {
  const post = await this.findOne({
    slug,
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  if (!post) return null;

  // Increment view count
  await this.updateOne({ _id: post._id }, { $inc: { views: 1 } });

  if (locale) {
    return {
      ...post.toObject(),
      title: post.title[locale],
      excerpt: post.excerpt[locale],
      content: post.content[locale],
      tags: post.tags?.map((t: IBilingual) => t[locale]),
      seo: post.seo
        ? {
            ...post.seo,
            metaTitle: post.seo.metaTitle?.[locale],
            metaDescription: post.seo.metaDescription?.[locale],
          }
        : undefined,
    };
  }

  return post;
};

/**
 * Get featured posts
 * جلب المقالات المميزة
 */
blogPostSchema.statics.getFeaturedPosts = async function (
  limit = 5,
  locale?: 'ar' | 'en'
): Promise<IBlogPost[]> {
  const posts = await this.find({
    status: 'published',
    isFeatured: true,
    publishedAt: { $lte: new Date() },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  if (locale) {
    return posts.map((post: IBlogPost) => ({
      ...post.toObject(),
      title: post.title[locale],
      excerpt: post.excerpt[locale],
    }));
  }

  return posts;
};

/**
 * Get related posts
 * جلب المقالات ذات الصلة
 */
blogPostSchema.statics.getRelatedPosts = async function (
  postId: string,
  categoryId: string,
  limit = 4,
  locale?: 'ar' | 'en'
): Promise<IBlogPost[]> {
  const posts = await this.find({
    _id: { $ne: postId },
    category: categoryId,
    status: 'published',
    publishedAt: { $lte: new Date() },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .populate('author', 'name email avatar');

  if (locale) {
    return posts.map((post: IBlogPost) => ({
      ...post.toObject(),
      title: post.title[locale],
      excerpt: post.excerpt[locale],
    }));
  }

  return posts;
};

/**
 * Get all unique tags
 * جلب جميع الوسوم الفريدة
 */
blogPostSchema.statics.getAllTags = async function (locale?: 'ar' | 'en'): Promise<string[]> {
  const posts = await this.find({
    status: 'published',
    publishedAt: { $lte: new Date() },
  }).select('tags');

  const tagsSet = new Set<string>();

  posts.forEach((post: IBlogPost) => {
    post.tags?.forEach((tag: IBilingual) => {
      if (locale) {
        if (tag[locale]) tagsSet.add(tag[locale]);
      } else {
        if (tag.ar) tagsSet.add(tag.ar);
        if (tag.en) tagsSet.add(tag.en);
      }
    });
  });

  return Array.from(tagsSet);
};

export interface IBlogPostModel extends mongoose.Model<IBlogPost> {
  getPublishedPosts(options?: {
    category?: string;
    tag?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{ posts: IBlogPost[]; total: number }>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IBlogPost | null>;
  getFeaturedPosts(limit?: number, locale?: 'ar' | 'en'): Promise<IBlogPost[]>;
  getRelatedPosts(
    postId: string,
    categoryId: string,
    limit?: number,
    locale?: 'ar' | 'en'
  ): Promise<IBlogPost[]>;
  getAllTags(locale?: 'ar' | 'en'): Promise<string[]>;
}

export const BlogPost = mongoose.model<IBlogPost, IBlogPostModel>('BlogPost', blogPostSchema);

export default BlogPost;
