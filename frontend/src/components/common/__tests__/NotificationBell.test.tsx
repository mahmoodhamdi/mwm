/**
 * NotificationBell Component Tests
 * اختبارات مكون جرس الإشعارات
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationBell } from '../NotificationBell';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: jest.fn(() => 'en'),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
});

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}));

// Mock useNotifications hook
const mockNotifications = [
  {
    _id: 'notif1',
    title: { ar: 'إشعار جديد', en: 'New Notification' },
    body: { ar: 'لديك رسالة جديدة', en: 'You have a new message' },
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/en/admin/messages',
  },
  {
    _id: 'notif2',
    title: { ar: 'تحديث', en: 'Update' },
    body: { ar: 'تم تحديث المشروع', en: 'Project has been updated' },
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockMarkAsRead = jest.fn();
const mockMarkAllAsRead = jest.fn();
const mockDeleteNotification = jest.fn();
const mockRequestPermission = jest.fn().mockResolvedValue(undefined);

jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
    unreadCount: 1,
    isLoading: false,
    markAsRead: mockMarkAsRead,
    markAllAsRead: mockMarkAllAsRead,
    deleteNotification: mockDeleteNotification,
    requestPermission: mockRequestPermission,
    permissionGranted: false,
  }),
}));

describe('NotificationBell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bell icon', () => {
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    expect(button).toBeInTheDocument();
  });

  it('displays unread count badge when there are unread notifications', () => {
    render(<NotificationBell />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays 99+ for unread count over 99', () => {
    const { useNotifications } = require('@/hooks/useNotifications');
    useNotifications.mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 150,
      isLoading: false,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
      deleteNotification: mockDeleteNotification,
      requestPermission: mockRequestPermission,
      permissionGranted: false,
    });

    render(<NotificationBell />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('opens dropdown when bell is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('New Notification')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    // Open dropdown
    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    });
  });

  it('displays all notifications in dropdown', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Notification')).toBeInTheDocument();
      expect(screen.getByText('You have a new message')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(screen.getByText('Project has been updated')).toBeInTheDocument();
    });
  });

  it('shows mark all as read button when there are unread notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Mark all read')).toBeInTheDocument();
    });
  });

  it('calls markAllAsRead when button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Mark all read')).toBeInTheDocument();
    });

    const markAllButton = screen.getByText('Mark all read');
    await user.click(markAllButton);

    expect(mockMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('calls markAsRead when mark as read icon is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTitle('Mark as read')).toBeInTheDocument();
    });

    const markReadButton = screen.getByTitle('Mark as read');
    await user.click(markReadButton);

    expect(mockMarkAsRead).toHaveBeenCalledWith('notif1');
  });

  it('calls deleteNotification when delete icon is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    expect(mockDeleteNotification).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { useNotifications } = require('@/hooks/useNotifications');
    useNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: true,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
      deleteNotification: mockDeleteNotification,
      requestPermission: mockRequestPermission,
      permissionGranted: false,
    });

    render(<NotificationBell />);
    const button = screen.getByLabelText('notifications');
    fireEvent.click(button);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows empty state when no notifications', async () => {
    const { useNotifications } = require('@/hooks/useNotifications');
    useNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
      deleteNotification: mockDeleteNotification,
      requestPermission: mockRequestPermission,
      permissionGranted: false,
    });

    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });

  it('renders in RTL mode for Arabic locale', async () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('ar');

    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('الإشعارات')).toBeInTheDocument();
      expect(screen.getByText('إشعار جديد')).toBeInTheDocument();
    });
  });

  it('requests notification permission on first open if not granted', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    const button = screen.getByLabelText('notifications');
    await user.click(button);

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    });
  });
});
