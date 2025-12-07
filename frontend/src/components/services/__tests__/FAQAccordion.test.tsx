/**
 * FAQAccordion Component Tests
 * اختبارات مكون الأسئلة الشائعة (الأكورديون)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQAccordion } from '../FAQAccordion';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('FAQAccordion', () => {
  const defaultItems = [
    { question: 'What is your service?', answer: 'We provide software development services.' },
    { question: 'How much does it cost?', answer: 'Pricing depends on project requirements.' },
    { question: 'How long does it take?', answer: 'Timeline varies by project complexity.' },
  ];

  describe('Default Variant', () => {
    it('should render all questions', () => {
      render(<FAQAccordion items={defaultItems} />);

      expect(screen.getByText('What is your service?')).toBeInTheDocument();
      expect(screen.getByText('How much does it cost?')).toBeInTheDocument();
      expect(screen.getByText('How long does it take?')).toBeInTheDocument();
    });

    it('should not show answers initially', () => {
      render(<FAQAccordion items={defaultItems} />);

      // Answers should not be visible initially (without defaultOpen)
      const answer = screen.queryByText('We provide software development services.');
      // With AnimatePresence mocked, answer won't be in DOM when closed
      expect(answer).not.toBeInTheDocument();
    });

    it('should toggle answer visibility on click', () => {
      render(<FAQAccordion items={defaultItems} />);

      const questionButton = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(questionButton);

      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();
    });

    it('should close previously opened item when clicking another (single mode)', () => {
      render(<FAQAccordion items={defaultItems} allowMultiple={false} />);

      // Open first item
      const firstButton = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(firstButton);
      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();

      // Open second item
      const secondButton = screen.getByRole('button', { name: /How much does it cost\?/i });
      fireEvent.click(secondButton);

      // First item should be closed
      expect(
        screen.queryByText('We provide software development services.')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Pricing depends on project requirements.')).toBeInTheDocument();
    });

    it('should allow multiple items open when allowMultiple is true', () => {
      render(<FAQAccordion items={defaultItems} allowMultiple />);

      // Open first item
      const firstButton = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(firstButton);

      // Open second item
      const secondButton = screen.getByRole('button', { name: /How much does it cost\?/i });
      fireEvent.click(secondButton);

      // Both should be visible
      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();
      expect(screen.getByText('Pricing depends on project requirements.')).toBeInTheDocument();
    });

    it('should have items open by default when defaultOpen is provided', () => {
      render(<FAQAccordion items={defaultItems} defaultOpen={[0]} />);

      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();
    });
  });

  describe('Bordered Variant', () => {
    it('should render with bordered styling', () => {
      render(<FAQAccordion items={defaultItems} variant="bordered" data-testid="faq-accordion" />);

      const accordion = screen.getByTestId('faq-accordion');
      expect(accordion).toHaveClass('space-y-3');
    });

    it('should toggle items correctly', () => {
      render(<FAQAccordion items={defaultItems} variant="bordered" />);

      const button = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(button);
      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();
    });
  });

  describe('Separated Variant', () => {
    it('should render with separated card styling', () => {
      render(<FAQAccordion items={defaultItems} variant="separated" data-testid="faq-accordion" />);

      const accordion = screen.getByTestId('faq-accordion');
      expect(accordion).toHaveClass('space-y-4');
    });

    it('should toggle items correctly', () => {
      render(<FAQAccordion items={defaultItems} variant="separated" />);

      const button = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(button);
      expect(screen.getByText('We provide software development services.')).toBeInTheDocument();
    });
  });

  describe('Minimal Variant', () => {
    it('should render with minimal styling', () => {
      render(<FAQAccordion items={defaultItems} variant="minimal" data-testid="faq-accordion" />);

      const accordion = screen.getByTestId('faq-accordion');
      expect(accordion).toHaveClass('space-y-2');
    });

    it('should show + and - indicators', () => {
      render(<FAQAccordion items={defaultItems} variant="minimal" />);

      // Initially should show +
      expect(screen.getAllByText('+')).toHaveLength(3);

      // After clicking, should show -
      const button = screen.getByRole('button', { name: /What is your service\?/i });
      fireEvent.click(button);
      expect(screen.getByText('−')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-expanded attribute on buttons', () => {
      render(<FAQAccordion items={defaultItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded');
      });
    });

    it('should update aria-expanded when toggling', () => {
      render(<FAQAccordion items={defaultItems} />);

      const button = screen.getByRole('button', { name: /What is your service\?/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('HTML in Answers', () => {
    it('should render HTML content in answers', () => {
      const itemsWithHtml = [
        {
          question: 'What is included?',
          answer: '<ul><li>Feature 1</li><li>Feature 2</li></ul>',
        },
      ];

      render(<FAQAccordion items={itemsWithHtml} defaultOpen={[0]} />);

      // Check that HTML is rendered
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(
        <FAQAccordion items={defaultItems} className="custom-class" data-testid="faq-accordion" />
      );

      const accordion = screen.getByTestId('faq-accordion');
      expect(accordion).toHaveClass('custom-class');
    });
  });

  describe('Empty State', () => {
    it('should handle empty items array', () => {
      render(<FAQAccordion items={[]} data-testid="faq-accordion" />);

      const accordion = screen.getByTestId('faq-accordion');
      expect(accordion).toBeInTheDocument();
      expect(accordion.children).toHaveLength(0);
    });
  });
});
