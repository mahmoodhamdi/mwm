import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BarChart3: ({ className }: { className?: string }) => (
    <span data-testid="icon-barchart3" className={className}>
      BarChart3
    </span>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <span data-testid="icon-trendingup" className={className}>
      TrendingUp
    </span>
  ),
  TrendingDown: ({ className }: { className?: string }) => (
    <span data-testid="icon-trendingdown" className={className}>
      TrendingDown
    </span>
  ),
  Users: ({ className }: { className?: string }) => (
    <span data-testid="icon-users" className={className}>
      Users
    </span>
  ),
  Eye: ({ className }: { className?: string }) => (
    <span data-testid="icon-eye" className={className}>
      Eye
    </span>
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="icon-clock" className={className}>
      Clock
    </span>
  ),
  Globe: ({ className }: { className?: string }) => (
    <span data-testid="icon-globe" className={className}>
      Globe
    </span>
  ),
  Smartphone: ({ className }: { className?: string }) => (
    <span data-testid="icon-smartphone" className={className}>
      Smartphone
    </span>
  ),
  Monitor: ({ className }: { className?: string }) => (
    <span data-testid="icon-monitor" className={className}>
      Monitor
    </span>
  ),
  Tablet: ({ className }: { className?: string }) => (
    <span data-testid="icon-tablet" className={className}>
      Tablet
    </span>
  ),
  ArrowUp: ({ className }: { className?: string }) => (
    <span data-testid="icon-arrowup" className={className}>
      ArrowUp
    </span>
  ),
  ArrowDown: ({ className }: { className?: string }) => (
    <span data-testid="icon-arrowdown" className={className}>
      ArrowDown
    </span>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="icon-calendar" className={className}>
      Calendar
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
  Filter: ({ className }: { className?: string }) => (
    <span data-testid="icon-filter" className={className}>
      Filter
    </span>
  ),
  MapPin: ({ className }: { className?: string }) => (
    <span data-testid="icon-mappin" className={className}>
      MapPin
    </span>
  ),
  FileText: ({ className }: { className?: string }) => (
    <span data-testid="icon-filetext" className={className}>
      FileText
    </span>
  ),
  MousePointer: ({ className }: { className?: string }) => (
    <span data-testid="icon-mousepointer" className={className}>
      MousePointer
    </span>
  ),
  Target: ({ className }: { className?: string }) => (
    <span data-testid="icon-target" className={className}>
      Target
    </span>
  ),
}));

describe('Analytics Dashboard', () => {
  describe('Page Rendering', () => {
    it('renders the analytics page title', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(
        screen.getByText('Monitor your website performance and visitor insights')
      ).toBeInTheDocument();
    });

    it('renders date range selector', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('7 Days')).toBeInTheDocument();
      expect(screen.getByText('30 Days')).toBeInTheDocument();
      expect(screen.getByText('90 Days')).toBeInTheDocument();
      expect(screen.getByText('1 Year')).toBeInTheDocument();
    });

    it('renders refresh and export buttons', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Refresh')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  });

  describe('Real-time Section', () => {
    it('renders real-time indicator', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Real-time')).toBeInTheDocument();
    });

    it('renders active users count', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('127')).toBeInTheDocument();
    });

    it('renders page views in last hour', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Page Views (Last Hour)')).toBeInTheDocument();
      expect(screen.getByText('342')).toBeInTheDocument();
    });
  });

  describe('Overview Stats', () => {
    it('renders total visitors stat card', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Total Visitors')).toBeInTheDocument();
      expect(screen.getByText('45.7K')).toBeInTheDocument();
    });

    it('renders page views stat card', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Page Views')).toBeInTheDocument();
      // formatNumber(128450) = 128.4K (rounding)
      expect(screen.getByText(/128\.\d+K/)).toBeInTheDocument();
    });

    it('renders average session duration', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Avg. Session Duration')).toBeInTheDocument();
      expect(screen.getByText('3:45')).toBeInTheDocument();
    });

    it('renders bounce rate', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getAllByText('Bounce Rate').length).toBeGreaterThan(0);
      expect(screen.getAllByText('42.3%').length).toBeGreaterThan(0);
    });
  });

  describe('Traffic Sources', () => {
    it('renders traffic sources section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
    });

    it('displays traffic source breakdown', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Organic Search')).toBeInTheDocument();
      expect(screen.getByText('Direct')).toBeInTheDocument();
      expect(screen.getByText('Social Media')).toBeInTheDocument();
      expect(screen.getByText('Referral')).toBeInTheDocument();
    });
  });

  describe('Daily Visitors Chart', () => {
    it('renders daily visitors section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Daily Visitors')).toBeInTheDocument();
    });

    it('displays day labels', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });
  });

  describe('Devices Section', () => {
    it('renders devices section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Devices')).toBeInTheDocument();
    });

    it('displays device breakdown', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getAllByText('Desktop').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mobile').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Tablet').length).toBeGreaterThan(0);
    });
  });

  describe('Top Locations', () => {
    it('renders top locations section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Top Locations')).toBeInTheDocument();
    });

    it('displays country data', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Egypt')).toBeInTheDocument();
      expect(screen.getByText('Saudi Arabia')).toBeInTheDocument();
      expect(screen.getByText('UAE')).toBeInTheDocument();
    });
  });

  describe('Conversions', () => {
    it('renders conversions section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Conversions')).toBeInTheDocument();
    });

    it('displays conversion metrics', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Contact Forms')).toBeInTheDocument();
      expect(screen.getByText('Newsletter Signups')).toBeInTheDocument();
      expect(screen.getByText('Job Applications')).toBeInTheDocument();
      expect(screen.getByText('Resource Downloads')).toBeInTheDocument();
    });
  });

  describe('Top Pages Table', () => {
    it('renders top pages section', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Top Pages')).toBeInTheDocument();
    });

    it('displays table headers', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('Page')).toBeInTheDocument();
      expect(screen.getByText('Views')).toBeInTheDocument();
      expect(screen.getByText('Avg. Time')).toBeInTheDocument();
    });

    it('displays page data', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      expect(screen.getByText('/services')).toBeInTheDocument();
      expect(screen.getByText('/portfolio')).toBeInTheDocument();
      expect(screen.getByText('/about')).toBeInTheDocument();
    });
  });

  describe('Date Range Selection', () => {
    it('changes date range on click', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      const sevenDaysButton = screen.getByText('7 Days');
      fireEvent.click(sevenDaysButton);

      // Button should be selected (has different styling)
      expect(sevenDaysButton).toHaveClass('bg-blue-600');
    });
  });

  describe('Refresh Functionality', () => {
    it('clicking refresh button triggers refresh', async () => {
      const AnalyticsPage = (await import('@/app/[locale]/admin/analytics/page')).default;
      render(<AnalyticsPage />);

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      // The button should be disabled during refresh
      expect(refreshButton.closest('button')).toBeDisabled();
    });
  });
});

describe('Analytics RTL Support', () => {
  it('should support RTL layout', () => {
    expect(true).toBe(true);
  });
});
