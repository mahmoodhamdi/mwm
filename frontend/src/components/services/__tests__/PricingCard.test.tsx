/**
 * PricingCard Component Tests
 * اختبارات مكون بطاقة الأسعار
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PricingCard } from '../PricingCard';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('PricingCard', () => {
  const defaultProps = {
    name: 'Basic Plan',
    price: 1000,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  };

  describe('Default Variant', () => {
    it('should render plan name', () => {
      render(<PricingCard {...defaultProps} />);

      expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    });

    it('should render formatted price', () => {
      render(<PricingCard {...defaultProps} />);

      // Price should be formatted with currency
      expect(screen.getByText(/1,000/)).toBeInTheDocument();
    });

    it('should render all features', () => {
      render(<PricingCard {...defaultProps} />);

      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(<PricingCard {...defaultProps} description="Perfect for small businesses" />);

      expect(screen.getByText('Perfect for small businesses')).toBeInTheDocument();
    });

    it('should render default CTA text', () => {
      render(<PricingCard {...defaultProps} />);

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('should render custom CTA text', () => {
      render(<PricingCard {...defaultProps} ctaText="Choose Plan" />);

      expect(screen.getByText('Choose Plan')).toBeInTheDocument();
    });
  });

  describe('Popular Badge', () => {
    it('should show "Most Popular" badge when isPopular is true', () => {
      render(<PricingCard {...defaultProps} isPopular />);

      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('should not show badge when isPopular is false', () => {
      render(<PricingCard {...defaultProps} isPopular={false} />);

      expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
    });
  });

  describe('Period Display', () => {
    it('should show monthly period', () => {
      render(<PricingCard {...defaultProps} period="monthly" />);

      expect(screen.getByText('/month')).toBeInTheDocument();
    });

    it('should show yearly period', () => {
      render(<PricingCard {...defaultProps} period="yearly" />);

      expect(screen.getByText('/year')).toBeInTheDocument();
    });

    it('should show one-time period', () => {
      render(<PricingCard {...defaultProps} period="one-time" />);

      expect(screen.getByText('one-time')).toBeInTheDocument();
    });

    it('should show custom period label', () => {
      render(<PricingCard {...defaultProps} periodLabel="per project" />);

      expect(screen.getByText('per project')).toBeInTheDocument();
    });
  });

  describe('Bordered Variant', () => {
    it('should render with bordered styling', () => {
      render(<PricingCard {...defaultProps} variant="bordered" data-testid="pricing-card" />);

      const card = screen.getByTestId('pricing-card');
      expect(card).toHaveClass('border-2');
    });

    it('should show "Featured" badge for popular plans', () => {
      render(<PricingCard {...defaultProps} variant="bordered" isPopular />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  describe('Gradient Variant', () => {
    it('should render with gradient styling', () => {
      render(<PricingCard {...defaultProps} variant="gradient" data-testid="pricing-card" />);

      const card = screen.getByTestId('pricing-card');
      expect(card).toHaveClass('bg-gradient-to-br');
    });

    it('should show "Best Value" badge for popular plans', () => {
      render(<PricingCard {...defaultProps} variant="gradient" isPopular />);

      expect(screen.getByText('Best Value')).toBeInTheDocument();
    });
  });

  describe('CTA Link', () => {
    it('should use default contact link', () => {
      render(<PricingCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '#contact');
    });

    it('should use custom ctaLink', () => {
      render(<PricingCard {...defaultProps} ctaLink="/checkout" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/checkout');
    });
  });

  describe('Currency', () => {
    it('should format price with SAR currency by default', () => {
      render(<PricingCard {...defaultProps} />);

      // Should contain SAR or ر.س depending on locale
      expect(screen.getByText(/SAR|ر\.س/)).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<PricingCard {...defaultProps} className="custom-class" data-testid="pricing-card" />);

      const card = screen.getByTestId('pricing-card');
      expect(card).toHaveClass('custom-class');
    });
  });
});
