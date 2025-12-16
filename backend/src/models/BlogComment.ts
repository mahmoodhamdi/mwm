/**
 * Blog Comment Model
 * نموذج تعليق المدونة
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Comment status type
 * نوع حالة التعليق
 */
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

/**
 * Blog Comment interface
 * واجهة تعليق المدونة
 */
export interface IBlogComment extends Document {
  _id: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  author?: mongoose.Types.ObjectId;
  guestName?: string;
  guestEmail?: string;
  content: string;
  parent?: mongoose.Types.ObjectId;
  status: CommentStatus;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
  editedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Comment schema
 * مخطط تعليق المدونة
 */
const blogCommentSchema = new Schema<IBlogComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: [true, 'Post is required | المقال مطلوب'],
      index: true,
    },

    // For registered users
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    // For guest comments
    guestName: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
    },

    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email | يرجى تقديم بريد إلكتروني صالح'],
    },

    content: {
      type: String,
      required: [true, 'Comment content is required | محتوى التعليق مطلوب'],
      trim: true,
      minlength: [1, 'Comment cannot be empty | التعليق لا يمكن أن يكون فارغاً'],
      maxlength: [
        2000,
        'Comment cannot exceed 2000 characters | التعليق لا يمكن أن يتجاوز 2000 حرف',
      ],
    },

    // For nested replies
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'BlogComment',
      index: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'spam'],
      default: 'pending',
      index: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    repliesCount: {
      type: Number,
      default: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    approvedAt: {
      type: Date,
    },

    // For moderation and spam detection
    ip: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'blogcomments',
  }
);

// Indexes
blogCommentSchema.index({ post: 1, status: 1, createdAt: -1 });
blogCommentSchema.index({ author: 1, createdAt: -1 });
blogCommentSchema.index({ parent: 1, status: 1 });

/**
 * Get comments for a post
 * جلب التعليقات للمقال
 */
blogCommentSchema.statics.getByPost = async function (
  postId: string,
  options: {
    status?: CommentStatus;
    parentId?: string | null;
    limit?: number;
    page?: number;
    sort?: 'newest' | 'oldest' | 'popular';
  } = {}
): Promise<{ comments: IBlogComment[]; total: number }> {
  const { status = 'approved', parentId = null, limit = 20, page = 1, sort = 'newest' } = options;

  const filter: Record<string, unknown> = {
    post: new mongoose.Types.ObjectId(postId),
    status,
    parent: parentId ? new mongoose.Types.ObjectId(parentId) : null,
  };

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'popular') sortOption = { likesCount: -1, createdAt: -1 };

  const comments = await this.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate('author', 'name avatar')
    .populate({
      path: 'parent',
      select: 'content author guestName',
      populate: { path: 'author', select: 'name' },
    });

  return { comments, total };
};

/**
 * Get replies for a comment
 * جلب الردود على التعليق
 */
blogCommentSchema.statics.getReplies = async function (
  commentId: string,
  options: { limit?: number; page?: number } = {}
): Promise<{ replies: IBlogComment[]; total: number }> {
  const { limit = 10, page = 1 } = options;

  const filter = {
    parent: new mongoose.Types.ObjectId(commentId),
    status: 'approved',
  };

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);

  const replies = await this.find(filter)
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name avatar');

  return { replies, total };
};

/**
 * Update comment status
 * تحديث حالة التعليق
 */
blogCommentSchema.statics.updateStatus = async function (
  commentId: string,
  status: CommentStatus,
  moderatorId?: string
): Promise<IBlogComment | null> {
  const updateData: Record<string, unknown> = { status };

  if (status === 'approved' && moderatorId) {
    updateData.approvedBy = moderatorId;
    updateData.approvedAt = new Date();
  }

  return this.findByIdAndUpdate(commentId, updateData, { new: true })
    .populate('author', 'name avatar')
    .populate('post', 'title slug');
};

/**
 * Toggle like on comment
 * تبديل الإعجاب على التعليق
 */
blogCommentSchema.statics.toggleLike = async function (
  commentId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const isLiked = comment.likes.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId));

  if (isLiked) {
    comment.likes = comment.likes.filter((id: mongoose.Types.ObjectId) => !id.equals(userObjectId));
    comment.likesCount = Math.max(0, comment.likesCount - 1);
  } else {
    comment.likes.push(userObjectId);
    comment.likesCount = comment.likesCount + 1;
  }

  await comment.save();

  return { liked: !isLiked, likesCount: comment.likesCount };
};

/**
 * Get comment statistics for a post
 * جلب إحصائيات التعليقات للمقال
 */
blogCommentSchema.statics.getStatsByPost = async function (
  postId: string
): Promise<Record<CommentStatus, number>> {
  const stats = await this.aggregate([
    { $match: { post: new mongoose.Types.ObjectId(postId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const result: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
  };

  stats.forEach((stat: { _id: string; count: number }) => {
    result[stat._id] = stat.count;
  });

  return result as Record<CommentStatus, number>;
};

/**
 * Increment replies count on parent
 */
blogCommentSchema.post('save', async function () {
  if (this.parent && this.status === 'approved') {
    await BlogComment.findByIdAndUpdate(this.parent, {
      $inc: { repliesCount: 1 },
    });
  }
});

export interface IBlogCommentModel extends Model<IBlogComment> {
  getByPost(
    postId: string,
    options?: {
      status?: CommentStatus;
      parentId?: string | null;
      limit?: number;
      page?: number;
      sort?: 'newest' | 'oldest' | 'popular';
    }
  ): Promise<{ comments: IBlogComment[]; total: number }>;
  getReplies(
    commentId: string,
    options?: { limit?: number; page?: number }
  ): Promise<{ replies: IBlogComment[]; total: number }>;
  updateStatus(
    commentId: string,
    status: CommentStatus,
    moderatorId?: string
  ): Promise<IBlogComment | null>;
  toggleLike(commentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }>;
  getStatsByPost(postId: string): Promise<Record<CommentStatus, number>>;
}

export const BlogComment = mongoose.model<IBlogComment, IBlogCommentModel>(
  'BlogComment',
  blogCommentSchema
);

export default BlogComment;
