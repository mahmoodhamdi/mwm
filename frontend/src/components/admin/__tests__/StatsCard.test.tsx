/**
 * StatsCard Component Tests
 * اختبارات مكون بطاقة الإحصائيات
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';
import { FolderKanban } from 'lucide-react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('StatsCard', () => {
  const defaultProps = {
    titleAr: 'إجمالي المشاريع',
    titleEn: 'Total Projects',
    value: 24,
    icon: <FolderKanban data-testid="card-icon" />,
  };

  describe('Rendering', () => {
    it('should render title in English', () => {
      render(<StatsCard {...defaultProps} />);
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
    });

    it('should render value', () => {
      render(<StatsCard {...defaultProps} />);
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('should render icon', () => {
      render(<StatsCard {...defaultProps} />);
      expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    });

    it('should render string value', () => {
      render(<StatsCard {...defaultProps} value="N/A" />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Trend Display', () => {
    it('should render positive trend', () => {
      render(<StatsCard {...defaultProps} trend={{ value: 15, isPositive: true }} />);
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('from last month')).toBeInTheDocument();
    });

    it('should render negative trend', () => {
      render(<StatsCard {...defaultProps} trend={{ value: -10, isPositive: false }} />);
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('should render zero trend', () => {
      render(<StatsCard {...defaultProps} trend={{ value: 0 }} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should render custom trend labels', () => {
      render(
        <StatsCard
          {...defaultProps}
          trend={{ value: 5, labelEn: 'this week', labelAr: 'هذا الأسبوع' }}
        />
      );
      expect(screen.getByText('this week')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      const { container } = render(<StatsCard {...defaultProps} variant="default" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-card');
    });

    it('should apply primary variant styles', () => {
      const { container } = render(<StatsCard {...defaultProps} variant="primary" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-primary/10');
    });

    it('should apply success variant styles', () => {
      const { container } = render(<StatsCard {...defaultProps} variant="success" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-green-500/10');
    });

    it('should apply warning variant styles', () => {
      const { container } = render(<StatsCard {...defaultProps} variant="warning" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-yellow-500/10');
    });

    it('should apply danger variant styles', () => {
      const { container } = render(<StatsCard {...defaultProps} variant="danger" />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-red-500/10');
    });
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      const { container } = render(<StatsCard {...defaultProps} loading={true} />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should not render value when loading', () => {
      render(<StatsCard {...defaultProps} loading={true} />);
      expect(screen.queryByText('24')).not.toBeInTheDocument();
    });

    it('should not render title when loading', () => {
      render(<StatsCard {...defaultProps} loading={true} />);
      expect(screen.queryByText('Total Projects')).not.toBeInTheDocument();
    });
  });

  describe('Number Formatting', () => {
    it('should format large numbers with locale', () => {
      render(<StatsCard {...defaultProps} value={1250} />);
      expect(screen.getByText('1,250')).toBeInTheDocument();
    });
  });
});
