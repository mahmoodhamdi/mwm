/**
 * DashboardCharts Component Tests
 * اختبارات مكون رسومات لوحة التحكم
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LineChart, PieChart, BarChart, DashboardCharts } from '../DashboardCharts';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('LineChart', () => {
  const defaultProps = {
    titleAr: 'الزيارات',
    titleEn: 'Visitors',
    data: [
      { date: '1', value: 100 },
      { date: '5', value: 150 },
      { date: '10', value: 200 },
    ],
  };

  it('should render chart title', () => {
    render(<LineChart {...defaultProps} />);
    expect(screen.getByText('Visitors')).toBeInTheDocument();
  });

  it('should render SVG element', () => {
    const { container } = render(<LineChart {...defaultProps} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const { container } = render(<LineChart {...defaultProps} loading={true} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('Visitors')).not.toBeInTheDocument();
  });
});

describe('PieChart', () => {
  const defaultProps = {
    titleAr: 'مصادر الزيارات',
    titleEn: 'Traffic Sources',
    data: [
      { label: 'Direct', value: 35 },
      { label: 'Social', value: 25 },
      { label: 'Search', value: 30 },
    ],
  };

  it('should render chart title', () => {
    render(<PieChart {...defaultProps} />);
    expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
  });

  it('should render all data labels', () => {
    render(<PieChart {...defaultProps} />);
    expect(screen.getByText('Direct')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should render percentage values', () => {
    render(<PieChart {...defaultProps} />);
    // Total is 90, so Direct (35) should be about 38.9%
    expect(screen.getByText('38.9%')).toBeInTheDocument();
  });

  it('should render total in center', () => {
    render(<PieChart {...defaultProps} />);
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const { container } = render(<PieChart {...defaultProps} loading={true} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('BarChart', () => {
  const defaultProps = {
    titleAr: 'الرسائل حسب الخدمة',
    titleEn: 'Messages by Service',
    data: [
      { label: 'Web Development', value: 45 },
      { label: 'Mobile Apps', value: 30 },
      { label: 'UI/UX Design', value: 15 },
    ],
  };

  it('should render chart title', () => {
    render(<BarChart {...defaultProps} />);
    expect(screen.getByText('Messages by Service')).toBeInTheDocument();
  });

  it('should render all data labels', () => {
    render(<BarChart {...defaultProps} />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Mobile Apps')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
  });

  it('should render data values', () => {
    render(<BarChart {...defaultProps} />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const { container } = render(<BarChart {...defaultProps} loading={true} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('DashboardCharts', () => {
  it('should render all four chart components', () => {
    render(<DashboardCharts />);
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
    expect(screen.getByText('Messages by Service')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
  });

  it('should render with default data when no props provided', () => {
    render(<DashboardCharts />);
    // Should render with default data
    expect(screen.getByText('Direct')).toBeInTheDocument();
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('should render loading state for all charts', () => {
    const { container } = render(<DashboardCharts loading={true} />);
    const loadingElements = container.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBe(4);
  });

  it('should render custom visitors data', () => {
    const customData = [
      { date: '1', value: 500 },
      { date: '2', value: 600 },
    ];
    render(<DashboardCharts visitorsData={customData} />);
    expect(screen.getByText('Visitors')).toBeInTheDocument();
  });

  it('should render custom traffic sources data', () => {
    const customData = [{ label: 'Custom Source', value: 100 }];
    render(<DashboardCharts trafficSourcesData={customData} />);
    expect(screen.getByText('Custom Source')).toBeInTheDocument();
  });
});
