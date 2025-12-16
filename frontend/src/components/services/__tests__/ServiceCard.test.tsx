/**
 * ServiceCard Component Tests
 * اختبارات مكون بطاقة الخدمة
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceCard } from '../ServiceCard';

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

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ''} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('ServiceCard', () => {
  const defaultProps = {
    title: 'Web Development',
    description: 'We build modern, fast, and responsive websites',
    slug: 'web-development',
    icon: 'code',
  };

  describe('Default Variant', () => {
    it('should render title and description', () => {
      render(<ServiceCard {...defaultProps} />);

      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(
        screen.getByText('We build modern, fast, and responsive websites')
      ).toBeInTheDocument();
    });

    it('should render "Learn more" link', () => {
      render(<ServiceCard {...defaultProps} />);

      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('should link to correct service page', () => {
      render(<ServiceCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/en/services/web-development');
    });

    it('should hide arrow when showArrow is false', () => {
      render(<ServiceCard {...defaultProps} showArrow={false} />);

      expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    });

    it('should render category badge when provided', () => {
      render(<ServiceCard {...defaultProps} category="Development" />);

      expect(screen.getByText('Development')).toBeInTheDocument();
    });
  });

  describe('Featured Variant', () => {
    it('should render with featured styling', () => {
      render(<ServiceCard {...defaultProps} variant="featured" data-testid="service-card" />);

      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('bg-gradient-to-br');
    });

    it('should render title and description', () => {
      render(<ServiceCard {...defaultProps} variant="featured" />);

      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(
        screen.getByText('We build modern, fast, and responsive websites')
      ).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render as a link', () => {
      render(<ServiceCard {...defaultProps} variant="compact" />);

      // In compact variant, the entire card is a link
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should render title and truncated description', () => {
      render(<ServiceCard {...defaultProps} variant="compact" />);

      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });

  describe('Horizontal Variant', () => {
    it('should render with horizontal layout', () => {
      render(<ServiceCard {...defaultProps} variant="horizontal" data-testid="service-card" />);

      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('md:flex-row');
    });

    it('should render category when provided', () => {
      render(<ServiceCard {...defaultProps} variant="horizontal" category="Design" />);

      expect(screen.getByText('Design')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render code icon by default', () => {
      render(<ServiceCard {...defaultProps} />);

      // Icon should be rendered (we can't test the actual icon easily, but we can test the container)
      const iconContainer = document.querySelector('.rounded-xl.bg-primary-100');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render different icons based on icon prop', () => {
      render(<ServiceCard {...defaultProps} icon="mobile" />);

      // Component should still render without errors
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<ServiceCard {...defaultProps} className="custom-class" data-testid="service-card" />);

      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('custom-class');
    });
  });
});
