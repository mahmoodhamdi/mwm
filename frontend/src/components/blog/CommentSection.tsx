'use client';

/**
 * Blog Comment Section Component
 * مكون قسم التعليقات
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  MessageCircle,
  Send,
  ThumbsUp,
  Reply,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import {
  getPostComments,
  createComment,
  createGuestComment,
  toggleCommentLike,
  updateComment,
  deleteComment,
  type BlogComment,
} from '@/services/public/blog.service';
import { useAuth } from '@/providers/AuthProvider';

interface CommentSectionProps {
  postId: string;
  postSlug: string;
}

interface CommentItemProps {
  comment: BlogComment;
  postId: string;
  onReply: (parentId: string) => void;
  onRefresh: () => void;
  isAuthenticated: boolean;
  currentUserId?: string;
  locale: 'ar' | 'en';
}

function CommentItem({
  comment,
  postId: _postId, // Reserved for future nested replies feature
  onReply,
  onRefresh,
  isAuthenticated,
  currentUserId,
  locale,
}: CommentItemProps) {
  const isRTL = locale === 'ar';
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isLiked, setIsLiked] = useState(
    currentUserId ? comment.likedBy?.includes(currentUserId) : false
  );
  const [showReplies, setShowReplies] = useState(false);

  const isOwner = currentUserId && comment.author?._id === currentUserId;
  const authorName = comment.author?.name || comment.guestName || (isRTL ? 'ضيف' : 'Guest');
  const authorAvatar = comment.author?.avatar;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = hours / 24;

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return isRTL ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    }
    if (hours < 24) {
      return isRTL ? `منذ ${Math.floor(hours)} ساعة` : `${Math.floor(hours)}h ago`;
    }
    if (days < 7) {
      return isRTL ? `منذ ${Math.floor(days)} يوم` : `${Math.floor(days)}d ago`;
    }
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return;
    setIsLiking(true);
    try {
      const result = await toggleCommentLike(comment._id);
      setLikesCount(result.likesCount);
      setIsLiked(result.liked);
    } catch (err) {
      console.error('Failed to like comment:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      await updateComment(comment._id, editContent);
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to edit comment:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Delete this comment?')) return;
    try {
      await deleteComment(comment._id);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  // Future: nested replies feature will be implemented here

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          {authorAvatar ? (
            <Image
              src={authorAvatar}
              alt={authorName}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            <User className="size-5 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{authorName}</span>
            {comment.guestName && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                {isRTL ? 'ضيف' : 'Guest'}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="size-3" />
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">{isRTL ? '(معدل)' : '(edited)'}</span>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleEdit}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  {isRTL ? 'حفظ' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="rounded-lg border px-4 py-1.5 text-sm hover:bg-gray-50"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-gray-700">{comment.content}</p>
          )}

          {/* Actions */}
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated || isLiking}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              title={!isAuthenticated ? (isRTL ? 'سجل دخول للإعجاب' : 'Login to like') : ''}
            >
              <ThumbsUp className={`size-4 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            <button
              onClick={() => onReply(comment._id)}
              className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-600"
            >
              <Reply className="size-4" />
              {isRTL ? 'رد' : 'Reply'}
            </button>

            {comment.repliesCount && comment.repliesCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-sm text-blue-600"
              >
                {showReplies ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
                {comment.repliesCount} {isRTL ? 'رد' : 'replies'}
              </button>
            )}

            {/* Owner Actions */}
            {isOwner && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
                >
                  <MoreVertical className="size-4" />
                </button>
                {showMenu && (
                  <div className="absolute end-0 top-8 z-10 rounded-lg border bg-white py-1 shadow-lg">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Edit className="size-4" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                      {isRTL ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Replies placeholder - would be loaded from API */}
          {showReplies && (
            <div className="mt-4 border-s-2 border-gray-100 ps-4">
              <p className="text-sm text-gray-500">
                {isRTL ? 'جاري تحميل الردود...' : 'Loading replies...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId, postSlug }: CommentSectionProps) {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const { user, isAuthenticated } = useAuth();

  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // New comment form
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchComments = useCallback(
    async (pageNum: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPostComments(postSlug, { page: pageNum, limit: 10 });
        if (pageNum === 1) {
          setComments(response.data || []);
        } else {
          setComments(prev => [...prev, ...(response.data || [])]);
        }
        setTotal(response.pagination?.total || 0);
        setHasMore(pageNum < (response.pagination?.pages || 1));
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setError(isRTL ? 'فشل في تحميل التعليقات' : 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    },
    [postSlug, isRTL]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      if (isAuthenticated) {
        await createComment({
          post: postId,
          content: newComment,
          parent: replyingTo || undefined,
        });
        setSubmitSuccess(isRTL ? 'تم نشر تعليقك بنجاح' : 'Your comment was posted successfully');
      } else {
        if (!guestName.trim() || !guestEmail.trim()) {
          alert(isRTL ? 'يرجى إدخال الاسم والبريد الإلكتروني' : 'Please enter name and email');
          setIsSubmitting(false);
          return;
        }
        await createGuestComment({
          post: postId,
          content: newComment,
          guestName,
          guestEmail,
          parent: replyingTo || undefined,
        });
        setSubmitSuccess(
          isRTL
            ? 'تم إرسال تعليقك للمراجعة. سيظهر بعد الموافقة عليه.'
            : 'Your comment was submitted for review. It will appear after approval.'
        );
      }

      setNewComment('');
      setReplyingTo(null);
      fetchComments(1);
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert(isRTL ? 'فشل في إرسال التعليق' : 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  return (
    <div className="mt-12 border-t pt-12" id="comments">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <MessageCircle className="size-6" />
        {isRTL ? 'التعليقات' : 'Comments'}
        {total > 0 && <span className="text-lg font-normal text-gray-500">({total})</span>}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-gray-50 p-6">
        <h3 className="mb-4 font-medium">
          {replyingTo
            ? isRTL
              ? 'إضافة رد'
              : 'Add a reply'
            : isRTL
              ? 'إضافة تعليق'
              : 'Add a comment'}
        </h3>

        {replyingTo && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <Reply className="size-4" />
            {isRTL ? 'الرد على تعليق' : 'Replying to comment'}
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-blue-600 hover:underline"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        )}

        {/* Guest fields */}
        {!isAuthenticated && (
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">{isRTL ? 'الاسم' : 'Name'} *</label>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                required={!isAuthenticated}
                className="w-full rounded-lg border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {isRTL ? 'البريد الإلكتروني' : 'Email'} *
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                required={!isAuthenticated}
                className="w-full rounded-lg border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              />
            </div>
          </div>
        )}

        <div>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
            rows={4}
            className="w-full resize-none rounded-lg border bg-white p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isRTL ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
          />
        </div>

        {submitSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
            <AlertCircle className="size-5" />
            {submitSuccess}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {isAuthenticated ? (
              <>
                {isRTL ? 'تعليق كـ ' : 'Commenting as '}
                <span className="font-medium">{user?.name}</span>
              </>
            ) : (
              <>
                {isRTL
                  ? 'تعليقات الضيوف تحتاج للمراجعة قبل النشر'
                  : 'Guest comments require approval before publishing'}
              </>
            )}
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
            {isRTL ? 'إرسال' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
          <button
            onClick={() => fetchComments()}
            className="mt-2 block text-blue-600 hover:underline"
          >
            {isRTL ? 'إعادة المحاولة' : 'Try again'}
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <MessageCircle className="mx-auto mb-4 size-12 text-gray-300" />
          <p className="text-gray-500">
            {isRTL
              ? 'لا توجد تعليقات بعد. كن أول من يعلق!'
              : 'No comments yet. Be the first to comment!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              onReply={setReplyingTo}
              onRefresh={() => fetchComments(1)}
              isAuthenticated={isAuthenticated}
              currentUserId={user?._id}
              locale={locale}
            />
          ))}

          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ChevronDown className="size-5" />
                )}
                {isRTL ? 'تحميل المزيد' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
