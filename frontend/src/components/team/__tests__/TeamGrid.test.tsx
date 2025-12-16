/**
 * TeamGrid Component Tests
 * اختبارات مكون شبكة الفريق
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamGrid } from '../TeamGrid';

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
  return function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} />;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      // Filter out framer-motion specific props and keep only HTML-valid props
      const { layout, variants, initial, animate, exit, ...htmlProps } = props as Record<
        string,
        unknown
      >;
      // Suppress unused variable warnings - these props are intentionally removed
      void layout;
      void variants;
      void initial;
      void animate;
      void exit;
      return <div {...htmlProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('TeamGrid', () => {
  const mockMembers = [
    {
      id: '1',
      name: 'Ahmed Mohamed',
      slug: 'ahmed-mohamed',
      position: 'Senior Developer',
      avatar: '/images/ahmed.jpg',
      department: { id: 'dev', name: 'Development', slug: 'development' },
    },
    {
      id: '2',
      name: 'Sara Ali',
      slug: 'sara-ali',
      position: 'UI Designer',
      avatar: '/images/sara.jpg',
      department: { id: 'design', name: 'Design', slug: 'design' },
    },
    {
      id: '3',
      name: 'Omar Hassan',
      slug: 'omar-hassan',
      position: 'Backend Developer',
      avatar: '/images/omar.jpg',
      department: { id: 'dev', name: 'Development', slug: 'development' },
    },
  ];

  const mockDepartments = [
    { id: 'dev', name: 'Development', slug: 'development' },
    { id: 'design', name: 'Design', slug: 'design' },
  ];

  describe('Grid Variant', () => {
    it('should render all members', () => {
      render(<TeamGrid members={mockMembers} animated={false} />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.getByText('Omar Hassan')).toBeInTheDocument();
    });

    it('should render member positions', () => {
      render(<TeamGrid members={mockMembers} animated={false} />);
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('UI Designer')).toBeInTheDocument();
    });

    it('should render member avatars', () => {
      render(<TeamGrid members={mockMembers} animated={false} />);
      expect(screen.getByAltText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByAltText('Sara Ali')).toBeInTheDocument();
    });
  });

  describe('Department Filtering', () => {
    it('should render department filter buttons when showFilter is true', () => {
      render(
        <TeamGrid members={mockMembers} departments={mockDepartments} showFilter animated={false} />
      );
      // Use getAllByRole to find filter buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Development' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
    });

    it('should filter members by department when button clicked', () => {
      render(
        <TeamGrid members={mockMembers} departments={mockDepartments} showFilter animated={false} />
      );

      // Click on Design department button
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));

      // Only Sara should be visible (she's in Design)
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    });

    it('should show all members when All button clicked', () => {
      render(
        <TeamGrid members={mockMembers} departments={mockDepartments} showFilter animated={false} />
      );

      // First click Design to filter
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      // Then click All
      fireEvent.click(screen.getByRole('button', { name: 'All' }));

      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.getByText('Omar Hassan')).toBeInTheDocument();
    });
  });

  describe('List Variant', () => {
    it('should render in list layout', () => {
      const { container } = render(<TeamGrid members={mockMembers} variant="list" />);
      // List variant should have space-y-6 class
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('should render all members in list', () => {
      render(<TeamGrid members={mockMembers} variant="list" />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    });
  });

  describe('Masonry Variant', () => {
    it('should render members', () => {
      render(<TeamGrid members={mockMembers} variant="masonry" />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    });

    it('should have masonry column classes', () => {
      const { container } = render(<TeamGrid members={mockMembers} variant="masonry" />);
      expect(container.querySelector('.columns-1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty message when no members', () => {
      render(<TeamGrid members={[]} />);
      expect(screen.getByText('No Members Found')).toBeInTheDocument();
    });

    it('should render custom empty message', () => {
      render(<TeamGrid members={[]} emptyMessage="No results" />);
      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  });

  describe('Card Variants', () => {
    it('should render cards with default variant', () => {
      render(<TeamGrid members={mockMembers} cardVariant="compact" animated={false} />);
      // Cards should still render
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });

    it('should render cards with featured variant', () => {
      render(<TeamGrid members={mockMembers} cardVariant="featured" animated={false} />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });
  });

  describe('Column Configuration', () => {
    it('should apply column class for 2 columns', () => {
      const { container } = render(<TeamGrid members={mockMembers} columns={2} animated={false} />);
      expect(container.querySelector('.sm\\:grid-cols-2')).toBeInTheDocument();
    });

    it('should apply column class for 4 columns', () => {
      const { container } = render(<TeamGrid members={mockMembers} columns={4} animated={false} />);
      expect(container.querySelector('.xl\\:grid-cols-4')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <TeamGrid members={mockMembers} className="custom-class" animated={false} />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Animation', () => {
    it('should render with animation enabled', () => {
      render(<TeamGrid members={mockMembers} animated={true} />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });

    it('should render without animation', () => {
      render(<TeamGrid members={mockMembers} animated={false} />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });
  });
});
