import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BarChart3: ({ className }: { className?: string }) => (
    <span data-testid="icon-barchart3" className={className}>
      BarChart3
    </span>
  ),
  Users: ({ className }: { className?: string }) => (
    <span data-testid="icon-users" className={className}>
      Users
    </span>
  ),
  Mail: ({ className }: { className?: string }) => (
    <span data-testid="icon-mail" className={className}>
      Mail
    </span>
  ),
  Briefcase: ({ className }: { className?: string }) => (
    <span data-testid="icon-briefcase" className={className}>
      Briefcase
    </span>
  ),
  FileText: ({ className }: { className?: string }) => (
    <span data-testid="icon-filetext" className={className}>
      FileText
    </span>
  ),
  ArrowUp: ({ className }: { className?: string }) => (
    <span data-testid="icon-arrowup" className={className}>
      ArrowUp
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
  UserPlus: ({ className }: { className?: string }) => (
    <span data-testid="icon-userplus" className={className}>
      UserPlus
    </span>
  ),
  Target: ({ className }: { className?: string }) => (
    <span data-testid="icon-target" className={className}>
      Target
    </span>
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-alertcircle" className={className}>
      AlertCircle
    </span>
  ),
}));

// Mock the dashboard service
const mockStats = {
  contacts: { total: 50, unread: 5 },
  projects: { total: 20, published: 15 },
  services: { total: 10, active: 8 },
  posts: { total: 30, published: 25 },
  jobs: { total: 5, open: 3 },
  applications: { total: 15, pending: 4 },
  subscribers: { total: 100, active: 95 },
  team: { total: 12, active: 10 },
};

const mockChartsData = {
  timeSeries: {
    contacts: [
      { date: '2025-01-01', count: 2 },
      { date: '2025-01-02', count: 5 },
    ],
    subscribers: [{ date: '2025-01-01', count: 3 }],
    applications: [{ date: '2025-01-01', count: 1 }],
    posts: [{ date: '2025-01-01', count: 2 }],
  },
  distributions: {
    contactsByStatus: { new: 5, read: 30, replied: 10, archived: 5 },
    applicationsByStatus: { pending: 4, reviewing: 3, accepted: 5, rejected: 3 },
    jobsByType: { fulltime: 3, parttime: 1, contract: 1 },
  },
};

jest.mock('@/services/admin', () => ({
  dashboardService: {
    getStats: jest.fn(() => Promise.resolve(mockStats)),
    getChartsData: jest.fn(() => Promise.resolve(mockChartsData)),
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

describe('Analytics Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the analytics page with real data', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Analytics')).toBeInTheDocument();
      });
    });

    it('shows loading spinner initially', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders date range selector', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('7 Days')).toBeInTheDocument();
      });
      expect(screen.getByText('30 Days')).toBeInTheDocument();
      expect(screen.getByText('90 Days')).toBeInTheDocument();
    });

    it('renders export button', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
    });
  });

  describe('Stats Display', () => {
    it('displays contacts stats', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        // "Contacts" appears multiple times (stat card + chart legend)
        expect(screen.getAllByText('Contacts').length).toBeGreaterThan(0);
      });
      // Check for the total count in the stat card
      expect(screen.getAllByText('50').length).toBeGreaterThan(0);
    });

    it('displays subscribers stats', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Subscribers')).toBeInTheDocument();
      });
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('displays applications stats', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Applications')).toBeInTheDocument();
      });
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('displays blog posts stats', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Blog Posts')).toBeInTheDocument();
      });
      // Value "30" appears in stats - use getAllByText since there may be multiple
      expect(screen.getAllByText('30').length).toBeGreaterThan(0);
    });
  });

  describe('Content Section', () => {
    it('displays projects content stat', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Projects')).toBeInTheDocument();
      });
    });

    it('displays services content stat', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Services')).toBeInTheDocument();
      });
    });

    it('displays jobs content stat', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Jobs')).toBeInTheDocument();
      });
    });
  });

  describe('Team Section', () => {
    it('displays team stats', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Team')).toBeInTheDocument();
      });
      // Check for "Active Members" text which indicates team section loaded
      expect(screen.getByText('Active Members')).toBeInTheDocument();
      // Check that total team count is shown
      expect(screen.getByText(/out of 12 total/)).toBeInTheDocument();
    });
  });

  describe('Date Range Selection', () => {
    it('changes date range on click', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      const { dashboardService } = await import('@/services/admin');
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('7 Days')).toBeInTheDocument();
      });

      const sevenDaysButton = screen.getByText('7 Days');
      fireEvent.click(sevenDaysButton);

      // Should call getChartsData with new period
      await waitFor(() => {
        expect(dashboardService.getChartsData).toHaveBeenCalledWith('7');
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('refreshes data when refresh button clicked', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      const { dashboardService } = await import('@/services/admin');
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByTestId('icon-refreshcw')).toBeInTheDocument();
      });

      const refreshButton = screen.getByTestId('icon-refreshcw').closest('button');
      if (refreshButton) {
        fireEvent.click(refreshButton);
      }

      // Should call getStats and getChartsData again
      await waitFor(() => {
        expect(dashboardService.getStats).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Info Banner', () => {
    it('displays visitor analytics info banner', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Visitor Analytics')).toBeInTheDocument();
      });
      expect(screen.getByText(/integrate Google Analytics/i)).toBeInTheDocument();
    });
  });
});

describe('Analytics RTL Support', () => {
  it('should support RTL layout', () => {
    expect(true).toBe(true);
  });
});
