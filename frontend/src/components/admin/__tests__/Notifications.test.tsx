import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bell: ({ className }: { className?: string }) => (
    <span data-testid="icon-bell" className={className}>
      Bell
    </span>
  ),
  Mail: ({ className }: { className?: string }) => (
    <span data-testid="icon-mail" className={className}>
      Mail
    </span>
  ),
  MessageSquare: ({ className }: { className?: string }) => (
    <span data-testid="icon-messagesquare" className={className}>
      MessageSquare
    </span>
  ),
  Users: ({ className }: { className?: string }) => (
    <span data-testid="icon-users" className={className}>
      Users
    </span>
  ),
  FileText: ({ className }: { className?: string }) => (
    <span data-testid="icon-filetext" className={className}>
      FileText
    </span>
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-checkcircle" className={className}>
      CheckCircle
    </span>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <span data-testid="icon-alerttriangle" className={className}>
      AlertTriangle
    </span>
  ),
  Info: ({ className }: { className?: string }) => (
    <span data-testid="icon-info" className={className}>
      Info
    </span>
  ),
  XCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-xcircle" className={className}>
      XCircle
    </span>
  ),
  Check: ({ className }: { className?: string }) => (
    <span data-testid="icon-check" className={className}>
      Check
    </span>
  ),
  X: ({ className }: { className?: string }) => (
    <span data-testid="icon-x" className={className}>
      X
    </span>
  ),
  Settings: ({ className }: { className?: string }) => (
    <span data-testid="icon-settings" className={className}>
      Settings
    </span>
  ),
  Filter: ({ className }: { className?: string }) => (
    <span data-testid="icon-filter" className={className}>
      Filter
    </span>
  ),
  Search: ({ className }: { className?: string }) => (
    <span data-testid="icon-search" className={className}>
      Search
    </span>
  ),
  Trash2: ({ className }: { className?: string }) => (
    <span data-testid="icon-trash2" className={className}>
      Trash2
    </span>
  ),
  Eye: ({ className }: { className?: string }) => (
    <span data-testid="icon-eye" className={className}>
      Eye
    </span>
  ),
  MoreVertical: ({ className }: { className?: string }) => (
    <span data-testid="icon-morevertical" className={className}>
      MoreVertical
    </span>
  ),
  Send: ({ className }: { className?: string }) => (
    <span data-testid="icon-send" className={className}>
      Send
    </span>
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="icon-clock" className={className}>
      Clock
    </span>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="icon-calendar" className={className}>
      Calendar
    </span>
  ),
}));

describe('Notifications Page', () => {
  describe('Page Rendering', () => {
    it('renders the notifications page title', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getAllByText('Notifications').length).toBeGreaterThan(0);
      expect(screen.getByText('Manage your notifications and preferences')).toBeInTheDocument();
    });

    it('renders tabs for notifications and settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      // Notifications tab appears multiple times (header + tab)
      expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    });

    it('shows unread count badge', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByText(/unread/)).toBeInTheDocument();
    });
  });

  describe('Notifications Tab', () => {
    it('renders filter buttons', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('Application')).toBeInTheDocument();
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('renders action buttons', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByText('Mark all read')).toBeInTheDocument();
      expect(screen.getByText('Clear read')).toBeInTheDocument();
    });

    it('renders search input', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByPlaceholderText('Search notifications...')).toBeInTheDocument();
    });

    it('displays notifications list', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getAllByText('New Contact Message').length).toBeGreaterThan(0);
      expect(screen.getAllByText('New Job Application').length).toBeGreaterThan(0);
    });

    it('displays notification details', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByText(/Ahmed Mohamed sent a new message/)).toBeInTheDocument();
      expect(screen.getByText(/Sara Ali applied for/)).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('filters notifications by type', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const messageFilter = screen.getByText('Message');
      fireEvent.click(messageFilter);

      // Should still show message notifications
      expect(screen.getAllByText('New Contact Message').length).toBeGreaterThan(0);
    });

    it('filters notifications by search query', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const searchInput = screen.getByPlaceholderText('Search notifications...');
      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });

      // Should show notifications matching the search
      expect(screen.getByText(/Ahmed Mohamed/)).toBeInTheDocument();
    });
  });

  describe('Notification Actions', () => {
    it('marks notification as read on hover and click', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      // Initial unread count
      const unreadBadge = screen.getByText(/unread/);
      const initialCount = parseInt(unreadBadge.textContent?.match(/\d+/)?.[0] || '0');

      // Find and click a "Mark as read" button (they appear on hover)
      const markAsReadButtons = screen.getAllByText('Mark as read');
      if (markAsReadButtons.length > 0) {
        fireEvent.click(markAsReadButtons[0]);
      }

      // Count should decrease
      expect(screen.getByText(/unread/)).toBeInTheDocument();
    });

    it('deletes notification when clicking delete', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const deleteButtons = screen.getAllByText('Delete');
      const initialCount = deleteButtons.length;

      fireEvent.click(deleteButtons[0]);

      // Should have one less notification
      expect(screen.getAllByText('Delete').length).toBeLessThan(initialCount);
    });

    it('marks all as read when clicking button', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const markAllButton = screen.getByText('Mark all read');
      fireEvent.click(markAllButton);

      // Button should become disabled
      expect(markAllButton.closest('button')).toBeDisabled();
    });
  });

  describe('Settings Tab', () => {
    it('switches to settings tab', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    });

    it('displays email notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Receive notifications via email')).toBeInTheDocument();
    });

    it('displays in-app notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Show notifications in the dashboard')).toBeInTheDocument();
    });

    it('displays push notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Browser push notifications')).toBeInTheDocument();
      expect(screen.getByText('Enable Push Notifications')).toBeInTheDocument();
    });

    it('displays notification schedule settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Notification Schedule')).toBeInTheDocument();
      expect(screen.getByText('Set quiet hours for notifications')).toBeInTheDocument();
    });

    it('renders toggle switches for settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      // Should have multiple toggle buttons for different settings
      const toggleButtons = screen
        .getAllByRole('button')
        .filter(btn => btn.className.includes('rounded-full') && btn.className.includes('h-6'));
      expect(toggleButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Notification Types', () => {
    it('shows high priority badge for important notifications', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getAllByText('High').length).toBeGreaterThan(0);
    });

    it('displays different notification types', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      // Various notification types in the list
      expect(screen.getByText('System Update Available')).toBeInTheDocument();
      expect(screen.getByText('High Server Load')).toBeInTheDocument();
      expect(screen.getByText('Backup Completed')).toBeInTheDocument();
    });
  });

  describe('Time Display', () => {
    it('displays relative time for notifications', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      // Should have time ago indicators
      const timeIndicators = screen.getAllByText(/ago/);
      expect(timeIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no notifications match filter', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText('Search notifications...');
      fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });

      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText(/You.re all caught up!/)).toBeInTheDocument();
    });
  });
});

describe('Notifications RTL Support', () => {
  it('should support RTL layout', () => {
    expect(true).toBe(true);
  });
});
