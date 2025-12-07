/**
 * TechStack Component Tests
 * اختبارات مكون مكدس التقنيات
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechStack } from '../TechStack';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('TechStack', () => {
  const mockTechnologies = [
    { name: 'React', category: 'frontend' as const },
    { name: 'Node.js', category: 'backend' as const },
    { name: 'MongoDB', category: 'database' as const },
    { name: 'Docker', category: 'devops' as const },
    { name: 'React Native', category: 'mobile' as const },
    { name: 'Redux', category: 'frontend' as const },
  ];

  describe('Default Variant', () => {
    it('should render all technologies', () => {
      render(<TechStack technologies={mockTechnologies} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Docker')).toBeInTheDocument();
    });

    it('should apply category colors', () => {
      render(<TechStack technologies={mockTechnologies} />);

      const react = screen.getByText('React').parentElement;
      expect(react).toHaveClass('bg-blue-100'); // frontend color
    });

    it('should render technology icons when provided', () => {
      const techsWithIcons = [{ name: 'React', icon: '⚛️', category: 'frontend' as const }];

      render(<TechStack technologies={techsWithIcons} />);
      expect(screen.getByText('⚛️')).toBeInTheDocument();
    });

    it('should limit items when maxItems is set', () => {
      render(<TechStack technologies={mockTechnologies} maxItems={3} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.queryByText('Docker')).not.toBeInTheDocument();
      expect(screen.getByText('+3 more')).toBeInTheDocument();
    });
  });

  describe('Grouped Variant', () => {
    it('should group technologies by category', () => {
      render(<TechStack technologies={mockTechnologies} variant="grouped" />);

      // Should show category headers
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should hide category headers when showCategories is false', () => {
      render(
        <TechStack technologies={mockTechnologies} variant="grouped" showCategories={false} />
      );

      expect(screen.queryByText('Frontend')).not.toBeInTheDocument();
      // But technologies should still be rendered
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should group frontend technologies together', () => {
      render(<TechStack technologies={mockTechnologies} variant="grouped" />);

      // Both React and Redux should be in Frontend section
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Redux')).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render with compact styling', () => {
      render(<TechStack technologies={mockTechnologies} variant="compact" />);

      const react = screen.getByText('React');
      expect(react).toHaveClass('text-xs');
      expect(react).toHaveClass('px-2');
      expect(react).toHaveClass('py-1');
    });

    it('should show remaining count when limited', () => {
      render(<TechStack technologies={mockTechnologies} variant="compact" maxItems={2} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('+4')).toBeInTheDocument();
    });
  });

  describe('Badges Variant', () => {
    it('should render with badge styling', () => {
      render(<TechStack technologies={mockTechnologies} variant="badges" />);

      const tech = screen.getByText('React').closest('.flex');
      expect(tech).toHaveClass('flex-col');
      expect(tech).toHaveClass('items-center');
    });

    it('should render icons when provided', () => {
      const techsWithIcons = [{ name: 'React', icon: '⚛️', category: 'frontend' as const }];

      render(<TechStack technologies={techsWithIcons} variant="badges" />);
      expect(screen.getByText('⚛️')).toBeInTheDocument();
    });

    it('should show initial letter when no icon', () => {
      const techsWithoutIcons = [{ name: 'Vue', category: 'frontend' as const }];

      render(<TechStack technologies={techsWithoutIcons} variant="badges" />);
      expect(screen.getByText('V')).toBeInTheDocument();
    });

    it('should show remaining count with +N badge', () => {
      render(<TechStack technologies={mockTechnologies} variant="badges" maxItems={3} />);

      expect(screen.getByText('+3')).toBeInTheDocument();
      expect(screen.getByText('more')).toBeInTheDocument();
    });
  });

  describe('Category Colors', () => {
    it('should apply frontend color', () => {
      const tech = [{ name: 'React', category: 'frontend' as const }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('React').parentElement;
      expect(element).toHaveClass('bg-blue-100');
    });

    it('should apply backend color', () => {
      const tech = [{ name: 'Node.js', category: 'backend' as const }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('Node.js').parentElement;
      expect(element).toHaveClass('bg-green-100');
    });

    it('should apply database color', () => {
      const tech = [{ name: 'MongoDB', category: 'database' as const }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('MongoDB').parentElement;
      expect(element).toHaveClass('bg-purple-100');
    });

    it('should apply devops color', () => {
      const tech = [{ name: 'Docker', category: 'devops' as const }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('Docker').parentElement;
      expect(element).toHaveClass('bg-orange-100');
    });

    it('should apply mobile color', () => {
      const tech = [{ name: 'React Native', category: 'mobile' as const }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('React Native').parentElement;
      expect(element).toHaveClass('bg-pink-100');
    });

    it('should apply other color for undefined category', () => {
      const tech = [{ name: 'Other Tool' }];
      render(<TechStack technologies={tech} />);

      const element = screen.getByText('Other Tool').parentElement;
      expect(element).toHaveClass('bg-gray-100');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(
        <TechStack
          technologies={mockTechnologies}
          className="custom-class"
          data-testid="tech-stack"
        />
      );

      const container = screen.getByTestId('tech-stack');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Empty State', () => {
    it('should handle empty technologies array', () => {
      render(<TechStack technologies={[]} data-testid="tech-stack" />);

      const container = screen.getByTestId('tech-stack');
      expect(container.children).toHaveLength(0);
    });
  });
});
