/**
 * RecentActivity Component Tests
 * اختبارات مكون النشاط الأخير
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecentActivity } from '../RecentActivity';
import type { ActivityItem } from '../RecentActivity';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('RecentActivity', () => {
  const mockItems: ActivityItem[] = [
    {
      id: '1',
      type: 'message',
      titleAr: 'أحمد محمد',
      titleEn: 'Ahmed Mohammed',
      descriptionAr: 'استفسار عن تطوير تطبيق',
      descriptionEn: 'Inquiry about app development',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      href: '/admin/messages/1',
    },
    {
      id: '2',
      type: 'subscriber',
      titleAr: 'user@example.com',
      titleEn: 'user@example.com',
      descriptionAr: 'اشترك في النشرة البريدية',
      descriptionEn: 'Subscribed to newsletter',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: '3',
      type: 'project_update',
      titleAr: 'تحديث مشروع',
      titleEn: 'Project updated',
      descriptionAr: 'تم تحديث المشروع',
      descriptionEn: 'Project was updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];

  describe('Rendering', () => {
    it('should render title', () => {
      render(<RecentActivity items={mockItems} />);
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('should render all activity items', () => {
      render(<RecentActivity items={mockItems} />);
      expect(screen.getByText('Ahmed Mohammed')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(screen.getByText('Project updated')).toBeInTheDocument();
    });

    it('should render item descriptions', () => {
      render(<RecentActivity items={mockItems} />);
      expect(screen.getByText('Inquiry about app development')).toBeInTheDocument();
      expect(screen.getByText('Subscribed to newsletter')).toBeInTheDocument();
    });

    it('should render relative timestamps', () => {
      render(<RecentActivity items={mockItems} />);
      expect(screen.getByText('30m ago')).toBeInTheDocument();
      expect(screen.getByText('1h ago')).toBeInTheDocument();
      expect(screen.getByText('1d ago')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no items', () => {
      render(<RecentActivity items={[]} />);
      expect(screen.getByText('No activity yet')).toBeInTheDocument();
    });
  });

  describe('View All Link', () => {
    it('should render view all link when showViewAll is true', () => {
      render(<RecentActivity items={mockItems} showViewAll={true} viewAllHref="/admin/activity" />);
      expect(screen.getByText('View all')).toBeInTheDocument();
    });

    it('should not render view all link when showViewAll is false', () => {
      render(<RecentActivity items={mockItems} showViewAll={false} />);
      expect(screen.queryByText('View all')).not.toBeInTheDocument();
    });
  });

  describe('Max Items', () => {
    it('should limit items to maxItems prop', () => {
      const manyItems: ActivityItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        type: 'message' as const,
        titleAr: `عنصر ${i}`,
        titleEn: `Item ${i}`,
        timestamp: new Date(),
      }));

      render(<RecentActivity items={manyItems} maxItems={3} />);
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      const { container } = render(<RecentActivity items={[]} loading={true} />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should not render items when loading', () => {
      render(<RecentActivity items={mockItems} loading={true} />);
      expect(screen.queryByText('Ahmed Mohammed')).not.toBeInTheDocument();
    });
  });

  describe('Activity Types', () => {
    it('should render message type', () => {
      render(<RecentActivity items={[mockItems[0]]} />);
      expect(screen.getByText('Ahmed Mohammed')).toBeInTheDocument();
    });

    it('should render subscriber type', () => {
      render(<RecentActivity items={[mockItems[1]]} />);
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    it('should render project_update type', () => {
      render(<RecentActivity items={[mockItems[2]]} />);
      expect(screen.getByText('Project updated')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('should render item as link when href is provided', () => {
      render(<RecentActivity items={[mockItems[0]]} />);
      const link = screen.getByText('Ahmed Mohammed').closest('a');
      expect(link).toHaveAttribute('href', '/admin/messages/1');
    });

    it('should render item as div when href is not provided', () => {
      render(<RecentActivity items={[mockItems[1]]} />);
      const item = screen.getByText('user@example.com');
      expect(item.closest('a')).toBeNull();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should show "just now" for very recent items', () => {
      const recentItem: ActivityItem = {
        id: '1',
        type: 'message',
        titleAr: 'عنصر',
        titleEn: 'Item',
        timestamp: new Date(),
      };
      render(<RecentActivity items={[recentItem]} />);
      expect(screen.getByText('just now')).toBeInTheDocument();
    });

    it('should show minutes ago for items less than an hour', () => {
      const item: ActivityItem = {
        id: '1',
        type: 'message',
        titleAr: 'عنصر',
        titleEn: 'Item',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      };
      render(<RecentActivity items={[item]} />);
      expect(screen.getByText('45m ago')).toBeInTheDocument();
    });

    it('should show hours ago for items less than a day', () => {
      const item: ActivityItem = {
        id: '1',
        type: 'message',
        titleAr: 'عنصر',
        titleEn: 'Item',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      };
      render(<RecentActivity items={[item]} />);
      expect(screen.getByText('5h ago')).toBeInTheDocument();
    });
  });
});
