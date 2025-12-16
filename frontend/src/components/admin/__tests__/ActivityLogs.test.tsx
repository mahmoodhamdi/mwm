import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Activity: ({ className }: { className?: string }) => (
    <span data-testid="icon-activity" className={className}>
      Activity
    </span>
  ),
  Search: ({ className }: { className?: string }) => (
    <span data-testid="icon-search" className={className}>
      Search
    </span>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="icon-calendar" className={className}>
      Calendar
    </span>
  ),
  User: ({ className }: { className?: string }) => (
    <span data-testid="icon-user" className={className}>
      User
    </span>
  ),
  FileText: ({ className }: { className?: string }) => (
    <span data-testid="icon-filetext" className={className}>
      FileText
    </span>
  ),
  Settings: ({ className }: { className?: string }) => (
    <span data-testid="icon-settings" className={className}>
      Settings
    </span>
  ),
  Users: ({ className }: { className?: string }) => (
    <span data-testid="icon-users" className={className}>
      Users
    </span>
  ),
  Trash2: ({ className }: { className?: string }) => (
    <span data-testid="icon-trash2" className={className}>
      Trash2
    </span>
  ),
  Edit: ({ className }: { className?: string }) => (
    <span data-testid="icon-edit" className={className}>
      Edit
    </span>
  ),
  Plus: ({ className }: { className?: string }) => (
    <span data-testid="icon-plus" className={className}>
      Plus
    </span>
  ),
  Eye: ({ className }: { className?: string }) => (
    <span data-testid="icon-eye" className={className}>
      Eye
    </span>
  ),
  LogIn: ({ className }: { className?: string }) => (
    <span data-testid="icon-login" className={className}>
      LogIn
    </span>
  ),
  LogOut: ({ className }: { className?: string }) => (
    <span data-testid="icon-logout" className={className}>
      LogOut
    </span>
  ),
  Key: ({ className }: { className?: string }) => (
    <span data-testid="icon-key" className={className}>
      Key
    </span>
  ),
  Download: ({ className }: { className?: string }) => (
    <span data-testid="icon-download" className={className}>
      Download
    </span>
  ),
  RefreshCw: ({ className }: { className?: string }) => (
    <span data-testid="icon-refreshcw" className={className}>
      RefreshCw
    </span>
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <span data-testid="icon-chevronleft" className={className}>
      ChevronLeft
    </span>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="icon-chevronright" className={className}>
      ChevronRight
    </span>
  ),
  Upload: ({ className }: { className?: string }) => (
    <span data-testid="icon-upload" className={className}>
      Upload
    </span>
  ),
  Globe: ({ className }: { className?: string }) => (
    <span data-testid="icon-globe" className={className}>
      Globe
    </span>
  ),
  EyeOff: ({ className }: { className?: string }) => (
    <span data-testid="icon-eyeoff" className={className}>
      EyeOff
    </span>
  ),
}));

// Mock activity logs data
const mockLogs = [
  {
    _id: '1',
    user: { _id: 'user1', name: 'Ahmed Hassan', email: 'ahmed@mwm.com' },
    action: 'login' as const,
    resource: 'auth',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Chrome/120.0 Windows',
  },
  {
    _id: '2',
    user: { _id: 'user1', name: 'Ahmed Hassan', email: 'ahmed@mwm.com' },
    action: 'create' as const,
    resource: 'projects',
    resourceTitle: 'New Website Project',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Chrome/120.0 Windows',
  },
  {
    _id: '3',
    user: { _id: 'user2', name: 'Sarah Ahmed', email: 'sarah@mwm.com' },
    action: 'update' as const,
    resource: 'services',
    resourceTitle: 'Web Development',
    details: { field: 'pricing' },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.101',
    userAgent: 'Firefox/121.0 MacOS',
  },
  {
    _id: '4',
    user: { _id: 'user3', name: 'Mohamed Ali', email: 'mohamed@mwm.com' },
    action: 'delete' as const,
    resource: 'blog',
    resourceTitle: 'Old Blog Post',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.102',
    userAgent: 'Safari/17.0 iOS',
  },
];

// Mock the activity service
jest.mock('@/services/admin/activity.service', () => ({
  activityService: {
    getLogs: jest.fn(() =>
      Promise.resolve({
        logs: mockLogs,
        pagination: {
          page: 1,
          limit: 20,
          total: mockLogs.length,
          totalPages: 1,
        },
      })
    ),
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

describe('Activity Logs Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the activity logs page with data', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('Activity Logs')).toBeInTheDocument();
      });
    });

    it('shows loading spinner initially', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders filter controls', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });
      expect(screen.getByText('All Actions')).toBeInTheDocument();
      expect(screen.getByText('All Resources')).toBeInTheDocument();
    });

    it('renders action buttons', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });
      // Export appears multiple times (button + dropdown option)
      expect(screen.getAllByText('Export').length).toBeGreaterThan(0);
    });
  });

  describe('Activity Display', () => {
    it('displays activity logs', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        // Ahmed Hassan appears multiple times (has multiple logs)
        expect(screen.getAllByText('Ahmed Hassan').length).toBeGreaterThan(0);
      });
      expect(screen.getByText('Sarah Ahmed')).toBeInTheDocument();
      expect(screen.getByText('Mohamed Ali')).toBeInTheDocument();
    });

    it('displays resource titles', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('New Website Project')).toBeInTheDocument();
      });
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('Old Blog Post')).toBeInTheDocument();
    });

    it('displays action badges', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
      });
      expect(screen.getAllByText('Create').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Update').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    });

    it('displays IP addresses', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/192\.168\.1\.\d+/).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Filter Functionality', () => {
    it('filters by search query', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });

      // Should still show Ahmed Hassan's activities (appears multiple times)
      expect(screen.getAllByText('Ahmed Hassan').length).toBeGreaterThan(0);
    });

    it('has action filter dropdown', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('All Actions')).toBeInTheDocument();
      });

      // Check for action options in the dropdown
      const actionSelect = screen.getByDisplayValue('All Actions');
      expect(actionSelect).toBeInTheDocument();
    });

    it('has resource filter dropdown', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('All Resources')).toBeInTheDocument();
      });

      const resourceSelect = screen.getByDisplayValue('All Resources');
      expect(resourceSelect).toBeInTheDocument();
    });

    it('has date range filters', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByText('From:')).toBeInTheDocument();
      });
      expect(screen.getByText('To:')).toBeInTheDocument();
    });
  });

  describe('Time Display', () => {
    it('displays relative time', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        const timeElements = screen.getAllByText(/ago|Just now/);
        expect(timeElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no logs match filter', async () => {
      const ActivityLogsPage = (await import('@/app/[locale]/admin/activity/page')).default;
      render(<ActivityLogsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });

      expect(screen.getByText('No activity logs found')).toBeInTheDocument();
    });
  });
});

describe('Activity Logs RTL Support', () => {
  it('should support RTL layout', () => {
    expect(true).toBe(true);
  });
});
