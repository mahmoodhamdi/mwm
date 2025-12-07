/**
 * ProjectGrid Component Tests
 * اختبارات مكون شبكة المشاريع
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectGrid } from '../ProjectGrid';

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
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProjectGrid', () => {
  const mockCategories = [
    { id: '1', name: 'Web Apps', slug: 'web-apps' },
    { id: '2', name: 'Mobile Apps', slug: 'mobile-apps' },
  ];

  const mockProjects = [
    {
      id: '1',
      title: 'Project 1',
      description: 'Description 1',
      slug: 'project-1',
      thumbnail: '/img1.jpg',
      category: mockCategories[0],
    },
    {
      id: '2',
      title: 'Project 2',
      description: 'Description 2',
      slug: 'project-2',
      thumbnail: '/img2.jpg',
      category: mockCategories[1],
    },
    {
      id: '3',
      title: 'Project 3',
      description: 'Description 3',
      slug: 'project-3',
      thumbnail: '/img3.jpg',
      category: mockCategories[0],
    },
  ];

  describe('Grid Variant', () => {
    it('should render all projects', () => {
      render(<ProjectGrid projects={mockProjects} />);

      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      expect(screen.getByText('Project 3')).toBeInTheDocument();
    });

    it('should render with default grid layout', () => {
      render(<ProjectGrid projects={mockProjects} data-testid="project-grid" />);

      const grid = screen.getByTestId('project-grid').querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('should support different column counts', () => {
      render(<ProjectGrid projects={mockProjects} columns={2} data-testid="project-grid" />);

      const grid = screen.getByTestId('project-grid').querySelector('.grid');
      expect(grid).toHaveClass('sm:grid-cols-2');
    });
  });

  describe('Category Filtering', () => {
    it('should show filter buttons when showFilter is true', () => {
      render(<ProjectGrid projects={mockProjects} categories={mockCategories} showFilter />);

      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Web Apps' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Mobile Apps' })).toBeInTheDocument();
    });

    it('should not show filter buttons when showFilter is false', () => {
      render(<ProjectGrid projects={mockProjects} categories={mockCategories} />);

      expect(screen.queryByText('All')).not.toBeInTheDocument();
    });

    it('should filter projects when category button is clicked', () => {
      render(<ProjectGrid projects={mockProjects} categories={mockCategories} showFilter />);

      // Click on Web Apps filter
      const webAppsButton = screen.getByRole('button', { name: 'Web Apps' });
      fireEvent.click(webAppsButton);

      // Should show Web Apps projects
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 3')).toBeInTheDocument();
      // Should not show Mobile Apps project
      expect(screen.queryByText('Project 2')).not.toBeInTheDocument();
    });

    it('should show all projects when All filter is clicked', () => {
      render(<ProjectGrid projects={mockProjects} categories={mockCategories} showFilter />);

      // First filter to Web Apps
      const webAppsButton = screen.getByRole('button', { name: 'Web Apps' });
      fireEvent.click(webAppsButton);

      // Then click All
      const allButton = screen.getByRole('button', { name: 'All' });
      fireEvent.click(allButton);

      // Should show all projects
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      expect(screen.getByText('Project 3')).toBeInTheDocument();
    });
  });

  describe('List Variant', () => {
    it('should render with list layout', () => {
      render(<ProjectGrid projects={mockProjects} variant="list" data-testid="project-grid" />);

      const container = screen.getByTestId('project-grid');
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('should render all projects in list format', () => {
      render(<ProjectGrid projects={mockProjects} variant="list" />);

      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
      expect(screen.getByText('Project 3')).toBeInTheDocument();
    });
  });

  describe('Masonry Variant', () => {
    it('should render with masonry layout', () => {
      render(<ProjectGrid projects={mockProjects} variant="masonry" data-testid="project-grid" />);

      const container = screen.getByTestId('project-grid');
      expect(container.querySelector('.columns-1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no projects', () => {
      render(<ProjectGrid projects={[]} />);

      expect(screen.getByText('No Projects Found')).toBeInTheDocument();
    });

    it('should show custom empty message', () => {
      render(<ProjectGrid projects={[]} emptyMessage="No projects available at the moment" />);

      expect(screen.getByText('No projects available at the moment')).toBeInTheDocument();
    });

    it('should show empty state when filter has no results', () => {
      const projects = [
        {
          id: '1',
          title: 'Project 1',
          description: 'Description 1',
          slug: 'project-1',
          thumbnail: '/img1.jpg',
          category: mockCategories[0],
        },
      ];

      render(<ProjectGrid projects={projects} categories={mockCategories} showFilter />);

      // Filter to Mobile Apps (no projects)
      const mobileButton = screen.getByRole('button', { name: 'Mobile Apps' });
      fireEvent.click(mobileButton);

      expect(screen.getByText('No Projects Found')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should render without animation when animated is false', () => {
      render(<ProjectGrid projects={mockProjects} animated={false} />);

      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(
        <ProjectGrid projects={mockProjects} className="custom-class" data-testid="project-grid" />
      );

      const container = screen.getByTestId('project-grid');
      expect(container).toHaveClass('custom-class');
    });
  });
});
