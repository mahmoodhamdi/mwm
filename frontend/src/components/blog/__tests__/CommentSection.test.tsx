/**
 * CommentSection Component Tests
 * اختبارات مكون قسم التعليقات
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentSection from '../CommentSection';
import * as blogService from '@/services/public/blog.service';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: jest.fn(() => 'en'),
}));

// Mock AuthProvider
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
};

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    isAuthenticated: true,
  })),
}));

// Mock blog service
jest.mock('@/services/public/blog.service', () => ({
  getPostComments: jest.fn(),
  createComment: jest.fn(),
  createGuestComment: jest.fn(),
  toggleCommentLike: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
}));

const mockComments = [
  {
    _id: 'comment1',
    content: 'Great post!',
    author: { _id: 'user123', name: 'Test User', avatar: '/avatar.jpg' },
    createdAt: new Date().toISOString(),
    likesCount: 5,
    likedBy: ['user123'],
    isEdited: false,
    repliesCount: 0,
  },
  {
    _id: 'comment2',
    content: 'Very informative',
    guestName: 'Guest User',
    guestEmail: 'guest@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likesCount: 2,
    likedBy: [],
    isEdited: false,
    repliesCount: 1,
  },
];

describe('CommentSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset useAuth to authenticated user (guest fields test overrides this)
    const { useAuth } = require('@/providers/AuthProvider');
    useAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });
    (blogService.getPostComments as jest.Mock).mockResolvedValue({
      data: mockComments,
      pagination: { total: 2, pages: 1, page: 1, limit: 10 },
    });
  });

  it('renders comment section with title', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });
  });

  it('displays total comment count', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });
  });

  it('fetches and displays comments', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('Great post!')).toBeInTheDocument();
      expect(screen.getByText('Very informative')).toBeInTheDocument();
    });

    expect(blogService.getPostComments).toHaveBeenCalledWith('test-post', {
      page: 1,
      limit: 10,
    });
  });

  it('displays comment form for authenticated user', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('Add a comment')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Write your comment here...')).toBeInTheDocument();
      expect(screen.getByText('Commenting as')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('displays guest fields for unauthenticated user', async () => {
    const { useAuth } = require('@/providers/AuthProvider');
    useAuth.mockReturnValue({ user: null, isAuthenticated: false });

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });
  });

  it('submits comment for authenticated user', async () => {
    const user = userEvent.setup();
    (blogService.createComment as jest.Mock).mockResolvedValue({});

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write your comment here...')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Write your comment here...');
    await user.type(textarea, 'This is my comment');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(blogService.createComment).toHaveBeenCalledWith({
        post: 'post123',
        content: 'This is my comment',
        parent: undefined,
      });
    });
  });

  it('shows loading state while fetching comments', () => {
    (blogService.getPostComments as jest.Mock).mockReturnValue(
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<CommentSection postId="post123" postSlug="test-post" />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    // Loading spinner should be visible
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    (blogService.getPostComments as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load comments')).toBeInTheDocument();
    });
  });

  it('displays empty state when no comments', async () => {
    (blogService.getPostComments as jest.Mock).mockResolvedValue({
      data: [],
      pagination: { total: 0, pages: 0, page: 1, limit: 10 },
    });

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
    });
  });

  it('displays like button and count for comments', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Like count for first comment
    });
  });

  it('toggles like when like button is clicked', async () => {
    const user = userEvent.setup();
    (blogService.toggleCommentLike as jest.Mock).mockResolvedValue({
      likesCount: 6,
      liked: false,
    });

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('Great post!')).toBeInTheDocument();
    });

    // Find like buttons by their ThumbsUp icon (lucide-thumbs-up class)
    const likeButtons = screen.getAllByRole('button').filter(btn => {
      const svg = btn.querySelector('.lucide-thumbs-up');
      return svg !== null;
    });

    expect(likeButtons.length).toBeGreaterThan(0);
    await user.click(likeButtons[0]);

    await waitFor(() => {
      expect(blogService.toggleCommentLike).toHaveBeenCalledWith('comment1');
    });
  });

  it('displays guest badge for guest comments', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      const guestBadges = screen.getAllByText('Guest');
      expect(guestBadges.length).toBeGreaterThan(0);
    });
  });

  it('shows reply button for each comment', async () => {
    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      const replyButtons = screen.getAllByText('Reply');
      expect(replyButtons.length).toBe(2); // One for each comment
    });
  });

  it('renders in RTL mode for Arabic locale', async () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('ar');

    render(<CommentSection postId="post123" postSlug="test-post" />);

    await waitFor(() => {
      expect(screen.getByText('التعليقات')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('اكتب تعليقك هنا...')).toBeInTheDocument();
    });
  });
});
