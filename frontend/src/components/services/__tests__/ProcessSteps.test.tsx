/**
 * ProcessSteps Component Tests
 * اختبارات مكون خطوات العملية
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProcessSteps } from '../ProcessSteps';

describe('ProcessSteps', () => {
  const defaultSteps = [
    { title: 'Discovery', description: 'Understanding your needs and goals', icon: 'clipboard' },
    { title: 'Planning', description: 'Creating a detailed project roadmap', icon: 'chat' },
    { title: 'Development', description: 'Building your solution', icon: 'code' },
    { title: 'Launch', description: 'Deploying and going live', icon: 'rocket' },
  ];

  describe('Horizontal Variant', () => {
    it('should render all step titles', () => {
      render(<ProcessSteps steps={defaultSteps} />);

      expect(screen.getByText('Discovery')).toBeInTheDocument();
      expect(screen.getByText('Planning')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Launch')).toBeInTheDocument();
    });

    it('should render all step descriptions', () => {
      render(<ProcessSteps steps={defaultSteps} />);

      expect(screen.getByText('Understanding your needs and goals')).toBeInTheDocument();
      expect(screen.getByText('Creating a detailed project roadmap')).toBeInTheDocument();
    });

    it('should render step numbers', () => {
      render(<ProcessSteps steps={defaultSteps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should have horizontal layout on larger screens', () => {
      render(<ProcessSteps steps={defaultSteps} data-testid="process-steps" />);

      const container = screen.getByTestId('process-steps');
      expect(container).toHaveClass('md:flex-row');
    });
  });

  describe('Vertical Variant', () => {
    it('should render with vertical layout', () => {
      render(<ProcessSteps steps={defaultSteps} variant="vertical" data-testid="process-steps" />);

      const container = screen.getByTestId('process-steps');
      expect(container).toHaveClass('space-y-6');
    });

    it('should render all steps', () => {
      render(<ProcessSteps steps={defaultSteps} variant="vertical" />);

      expect(screen.getByText('Discovery')).toBeInTheDocument();
      expect(screen.getByText('Launch')).toBeInTheDocument();
    });
  });

  describe('Alternating Variant', () => {
    it('should render with alternating layout', () => {
      render(
        <ProcessSteps steps={defaultSteps} variant="alternating" data-testid="process-steps" />
      );

      const container = screen.getByTestId('process-steps');
      expect(container).toHaveClass('relative');
    });

    it('should render all steps', () => {
      render(<ProcessSteps steps={defaultSteps} variant="alternating" />);

      expect(screen.getByText('Discovery')).toBeInTheDocument();
      expect(screen.getByText('Launch')).toBeInTheDocument();
    });
  });

  describe('Timeline Variant', () => {
    it('should render with timeline layout', () => {
      render(<ProcessSteps steps={defaultSteps} variant="timeline" data-testid="process-steps" />);

      const container = screen.getByTestId('process-steps');
      expect(container).toHaveClass('relative');
      expect(container).toHaveClass('ps-8');
    });

    it('should have vertical timeline line', () => {
      render(<ProcessSteps steps={defaultSteps} variant="timeline" />);

      // Check for timeline line element
      const timeline = document.querySelector('.absolute.start-3');
      expect(timeline).toBeInTheDocument();
    });

    it('should render all steps', () => {
      render(<ProcessSteps steps={defaultSteps} variant="timeline" />);

      expect(screen.getByText('Discovery')).toBeInTheDocument();
      expect(screen.getByText('Launch')).toBeInTheDocument();
    });
  });

  describe('Number Display', () => {
    it('should show step numbers when showNumbers is true', () => {
      render(<ProcessSteps steps={defaultSteps} showNumbers />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      render(
        <ProcessSteps steps={defaultSteps} className="custom-class" data-testid="process-steps" />
      );

      const container = screen.getByTestId('process-steps');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Empty State', () => {
    it('should handle empty steps array', () => {
      render(<ProcessSteps steps={[]} data-testid="process-steps" />);

      const container = screen.getByTestId('process-steps');
      expect(container.children).toHaveLength(0);
    });
  });

  describe('Step Numbering', () => {
    it('should number steps sequentially', () => {
      render(<ProcessSteps steps={defaultSteps} />);

      const numbers = screen.getAllByText(/^[1-4]$/);
      expect(numbers).toHaveLength(4);
    });
  });

  describe('With Two Steps', () => {
    const twoSteps = [
      { title: 'Start', description: 'Begin the process', icon: 'clipboard' },
      { title: 'End', description: 'Complete the process', icon: 'check' },
    ];

    it('should render correctly with fewer steps', () => {
      render(<ProcessSteps steps={twoSteps} />);

      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
