/**
 * ProjectCard Component Tests
 * اختبارات مكون بطاقة المشروع
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('ProjectCard', () => {
  const defaultProps = {
    title: 'E-commerce Platform',
    description: 'A modern e-commerce solution with React and Node.js',
    slug: 'ecommerce-platform',
    thumbnail: '/images/project.jpg',
  };

  describe('Default Variant', () => {
    it('should render project title', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(
        screen.getByText('A modern e-commerce solution with React and Node.js')
      ).toBeInTheDocument();
    });

    it('should render project thumbnail', () => {
      render(<ProjectCard {...defaultProps} />);
      const img = screen.getByAltText('E-commerce Platform');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/project.jpg');
    });

    it('should render link to project detail page', () => {
      render(<ProjectCard {...defaultProps} />);
      const links = screen.getAllByRole('link');
      expect(links.some(link => link.getAttribute('href')?.includes('ecommerce-platform'))).toBe(
        true
      );
    });

    it('should render category when provided', () => {
      render(<ProjectCard {...defaultProps} category="Web Development" />);
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    it('should render technologies when provided', () => {
      const technologies = [
        { name: 'React', category: 'frontend' as const },
        { name: 'Node.js', category: 'backend' as const },
      ];
      render(<ProjectCard {...defaultProps} technologies={technologies} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should show remaining count when more than 4 technologies', () => {
      const technologies = [
        { name: 'React', category: 'frontend' as const },
        { name: 'Node.js', category: 'backend' as const },
        { name: 'MongoDB', category: 'database' as const },
        { name: 'Docker', category: 'devops' as const },
        { name: 'AWS', category: 'devops' as const },
      ];
      render(<ProjectCard {...defaultProps} technologies={technologies} />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('should render view count when provided', () => {
      render(<ProjectCard {...defaultProps} views={150} />);
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should render featured badge when isFeatured', () => {
      render(<ProjectCard {...defaultProps} isFeatured />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should render live URL link when provided', () => {
      render(<ProjectCard {...defaultProps} liveUrl="https://example.com" />);
      const liveLink = document.querySelector('a[href="https://example.com"]');
      expect(liveLink).toBeInTheDocument();
    });
  });

  describe('Featured Variant', () => {
    it('should render with featured styling', () => {
      render(<ProjectCard {...defaultProps} variant="featured" />);
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    it('should render category badge', () => {
      render(<ProjectCard {...defaultProps} variant="featured" category="Web Development" />);
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    it('should render up to 6 technologies', () => {
      const technologies = Array.from({ length: 8 }, (_, i) => ({
        name: `Tech ${i + 1}`,
        category: 'frontend' as const,
      }));
      render(<ProjectCard {...defaultProps} variant="featured" technologies={technologies} />);
      expect(screen.getByText('Tech 1')).toBeInTheDocument();
      expect(screen.getByText('Tech 6')).toBeInTheDocument();
      expect(screen.queryByText('Tech 7')).not.toBeInTheDocument();
    });

    it('should render View Details and Live Preview links', () => {
      render(<ProjectCard {...defaultProps} variant="featured" liveUrl="https://example.com" />);
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Live Preview')).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render as a link', () => {
      render(<ProjectCard {...defaultProps} variant="compact" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('ecommerce-platform'));
    });

    it('should render title and category', () => {
      render(<ProjectCard {...defaultProps} variant="compact" category="Web Apps" />);
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
      expect(screen.getByText('Web Apps')).toBeInTheDocument();
    });

    it('should render thumbnail', () => {
      render(<ProjectCard {...defaultProps} variant="compact" />);
      expect(screen.getByAltText('E-commerce Platform')).toBeInTheDocument();
    });
  });

  describe('Horizontal Variant', () => {
    it('should render with horizontal layout', () => {
      render(<ProjectCard {...defaultProps} variant="horizontal" />);
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    it('should render all content elements', () => {
      render(
        <ProjectCard
          {...defaultProps}
          variant="horizontal"
          category="Web Development"
          completedAt="2024-01-15"
          liveUrl="https://example.com"
        />
      );
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('View Project')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('should render featured badge when isFeatured', () => {
      render(<ProjectCard {...defaultProps} variant="horizontal" isFeatured />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should render up to 5 technologies', () => {
      const technologies = Array.from({ length: 7 }, (_, i) => ({
        name: `Tech ${i + 1}`,
        category: 'frontend' as const,
      }));
      render(<ProjectCard {...defaultProps} variant="horizontal" technologies={technologies} />);
      expect(screen.getByText('Tech 1')).toBeInTheDocument();
      expect(screen.getByText('Tech 5')).toBeInTheDocument();
      expect(screen.queryByText('Tech 6')).not.toBeInTheDocument();
    });
  });

  describe('Arrow Link', () => {
    it('should show arrow by default', () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText('View Project')).toBeInTheDocument();
    });

    it('should hide arrow when showArrow is false', () => {
      render(<ProjectCard {...defaultProps} showArrow={false} />);
      expect(screen.queryByText('View Project')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ProjectCard {...defaultProps} className="custom-class" data-testid="project-card" />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });
});
