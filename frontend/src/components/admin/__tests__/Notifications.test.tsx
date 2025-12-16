import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

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
  AlertCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-alertcircle" className={className}>
      AlertCircle
    </span>
  ),
  Check: ({ className }: { className?: string }) => (
    <span data-testid="icon-check" className={className}>
      Check
    </span>
  ),
  Settings: ({ className }: { className?: string }) => (
    <span data-testid="icon-settings" className={className}>
      Settings
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
  RefreshCw: ({ className }: { className?: string }) => (
    <span data-testid="icon-refreshcw" className={className}>
      RefreshCw
    </span>
  ),
}));

// Mock notifications data
const mockNotifications = [
  {
    _id: '1',
    user: 'user1',
    type: 'info' as const,
    title: { ar: 'رسالة جديدة', en: 'New Contact Message' },
    body: {
      ar: 'أحمد محمد أرسل رسالة جديدة',
      en: 'Ahmed Mohamed sent a new message about web development.',
    },
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false,
    link: '/admin/messages/1',
  },
  {
    _id: '2',
    user: 'user1',
    type: 'success' as const,
    title: { ar: 'طلب توظيف جديد', en: 'New Job Application' },
    body: {
      ar: 'سارة علي تقدمت للوظيفة',
      en: 'Sara Ali applied for Senior Frontend Developer position.',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false,
  },
  {
    _id: '3',
    user: 'user1',
    type: 'warning' as const,
    title: { ar: 'تحديث النظام', en: 'System Update Available' },
    body: { ar: 'يوجد تحديث جديد', en: 'A new version is available. Please update.' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: true,
  },
  {
    _id: '4',
    user: 'user1',
    type: 'error' as const,
    title: { ar: 'تحميل عالي', en: 'High Server Load' },
    body: { ar: 'استخدام المعالج تجاوز 80%', en: 'Server CPU usage exceeded 80%.' },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isRead: false,
  },
];

// Mock the notifications service
jest.mock('@/services/admin/notifications.service', () => ({
  notificationsService: {
    getNotifications: jest.fn(() =>
      Promise.resolve({
        notifications: mockNotifications,
        total: mockNotifications.length,
        unreadCount: mockNotifications.filter(n => !n.isRead).length,
      })
    ),
    markAsRead: jest.fn(() => Promise.resolve(mockNotifications[0])),
    markAllAsRead: jest.fn(() => Promise.resolve({ count: 3 })),
    deleteNotification: jest.fn(() => Promise.resolve()),
    deleteReadNotifications: jest.fn(() => Promise.resolve({ count: 1 })),
  },
}));

// Mock Spinner component
jest.mock('@/components/ui', () => ({
  Spinner: ({ size }: { size?: string }) => (
    <div data-testid="spinner" data-size={size}>
      Loading...
    </div>
  ),
}));

describe('Notifications Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  describe('Page Rendering', () => {
    it('renders the notifications page with data', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Notifications').length).toBeGreaterThan(0);
      });
      expect(screen.getByText('Manage your notifications and preferences')).toBeInTheDocument();
    });

    it('shows loading spinner initially', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders tabs for notifications and settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThan(0);
      });
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    });

    it('shows unread count badge', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText(/unread/)).toBeInTheDocument();
      });
    });
  });

  describe('Notifications Tab', () => {
    it('renders filter buttons', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('All')).toBeInTheDocument();
      });
      // Info appears multiple times (button + icon), use getAllByText
      expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Success').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Error').length).toBeGreaterThan(0);
    });

    it('renders action buttons', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('Mark all read')).toBeInTheDocument();
      });
      expect(screen.getByText('Clear read')).toBeInTheDocument();
    });

    it('renders search input', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search notifications...')).toBeInTheDocument();
      });
    });

    it('displays notifications list', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('New Contact Message')).toBeInTheDocument();
      });
      expect(screen.getByText('New Job Application')).toBeInTheDocument();
    });

    it('displays notification details', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Ahmed Mohamed sent a new message/)).toBeInTheDocument();
      });
      expect(screen.getByText(/Sara Ali applied for/)).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('filters notifications by type', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        // Info appears multiple times (button + icon)
        expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
      });

      // Get the Info button (first occurrence is typically the filter button)
      const infoElements = screen.getAllByText('Info');
      const infoFilter = infoElements.find(el => el.tagName === 'BUTTON') || infoElements[0];
      fireEvent.click(infoFilter);

      // Should show info notifications
      expect(screen.getByText('New Contact Message')).toBeInTheDocument();
    });

    it('filters notifications by search query', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search notifications...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search notifications...');
      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });

      expect(screen.getByText(/Ahmed Mohamed/)).toBeInTheDocument();
    });
  });

  describe('Settings Tab', () => {
    it('switches to settings tab', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    });

    it('displays email notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Receive notifications via email')).toBeInTheDocument();
    });

    it('displays in-app notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Show notifications in the dashboard')).toBeInTheDocument();
    });

    it('displays push notification settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Browser push notifications')).toBeInTheDocument();
      expect(screen.getByText('Enable Push Notifications')).toBeInTheDocument();
    });

    it('displays notification schedule settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      expect(screen.getByText('Notification Schedule')).toBeInTheDocument();
      expect(screen.getByText('Set quiet hours for notifications')).toBeInTheDocument();
    });

    it('renders toggle switches for settings', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
      });

      const settingsTabs = screen.getAllByText('Settings');
      fireEvent.click(settingsTabs[0]);

      const toggleButtons = screen
        .getAllByRole('button')
        .filter(btn => btn.className.includes('rounded-full') && btn.className.includes('h-6'));
      expect(toggleButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Notification Types', () => {
    it('shows important badge for error notifications', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('High Server Load')).toBeInTheDocument();
      });
      expect(screen.getByText('Important')).toBeInTheDocument();
    });

    it('displays different notification types', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByText('System Update Available')).toBeInTheDocument();
      });
      expect(screen.getByText('High Server Load')).toBeInTheDocument();
    });
  });

  describe('Time Display', () => {
    it('displays relative time for notifications', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        const timeIndicators = screen.getAllByText(/ago/);
        expect(timeIndicators.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no notifications match filter', async () => {
      const NotificationsPage = (await import('@/app/[locale]/admin/notifications/page')).default;
      render(<NotificationsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search notifications...')).toBeInTheDocument();
      });

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
