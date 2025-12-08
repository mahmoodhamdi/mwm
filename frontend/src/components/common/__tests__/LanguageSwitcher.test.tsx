/**
 * LanguageSwitcher Component Tests
 * اختبارات مكون تبديل اللغة
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'ar',
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/ar/about',
}));

// Mock useClickOutside
jest.mock('@/hooks', () => ({
  useClickOutside: (_handler: () => void) => {
    const ref = { current: null };
    return ref;
  },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Minimal variant', () => {
    it('renders language buttons', () => {
      render(<LanguageSwitcher variant="minimal" />);
      expect(screen.getByText('AR')).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('highlights current language', () => {
      render(<LanguageSwitcher variant="minimal" />);
      const arButton = screen.getByText('AR');
      expect(arButton).toHaveClass('bg-primary-100');
    });

    it('switches language on click', () => {
      render(<LanguageSwitcher variant="minimal" />);
      const enButton = screen.getByText('EN');

      fireEvent.click(enButton);

      expect(mockPush).toHaveBeenCalledWith('/en/about');
    });
  });

  describe('Buttons variant', () => {
    it('renders language buttons with full names', () => {
      render(<LanguageSwitcher variant="buttons" />);
      expect(screen.getByText('العربية')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('shows globe icon when showIcon is true', () => {
      const { container } = render(<LanguageSwitcher variant="buttons" showIcon />);
      // Globe icon should be rendered (check for SVG in the whole component)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('hides globe icon when showIcon is false', () => {
      render(<LanguageSwitcher variant="buttons" showIcon={false} />);
      const container = screen.getByText('العربية').closest('div');
      // Should not have the globe SVG before the buttons
      expect(container?.parentElement?.querySelector('.size-4')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown variant (default)', () => {
    it('renders dropdown button', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    it('shows dropdown on click', () => {
      render(<LanguageSwitcher />);
      const dropdownButton = screen.getByRole('button', { expanded: false });

      fireEvent.click(dropdownButton);

      expect(screen.getAllByText('English').length).toBeGreaterThan(0);
    });

    it('closes dropdown when clicking outside', () => {
      render(<LanguageSwitcher />);
      const dropdownButton = screen.getByRole('button', { expanded: false });

      // Open dropdown
      fireEvent.click(dropdownButton);

      // Close by clicking the button again
      fireEvent.click(dropdownButton);

      // Dropdown should be closed
      expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
    });

    it('switches language and closes dropdown', () => {
      render(<LanguageSwitcher />);
      const dropdownButton = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(dropdownButton);

      // Click English option
      const englishOption = screen.getByRole('option', { name: /english/i });
      fireEvent.click(englishOption);

      expect(mockPush).toHaveBeenCalledWith('/en/about');
    });

    it('shows check icon for selected language', () => {
      render(<LanguageSwitcher />);
      const dropdownButton = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(dropdownButton);

      // Arabic option should have check icon (it's the current language)
      const arabicOption = screen.getByRole('option', { selected: true });
      expect(arabicOption).toHaveTextContent('العربية');
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<LanguageSwitcher className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('shows label when showLabel is true', () => {
      render(<LanguageSwitcher showLabel />);
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-expanded attribute on dropdown', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-label on language buttons', () => {
      render(<LanguageSwitcher variant="minimal" />);
      expect(screen.getByLabelText(/switch to العربية/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/switch to english/i)).toBeInTheDocument();
    });

    it('has correct role on dropdown options', () => {
      render(<LanguageSwitcher />);
      const dropdownButton = screen.getByRole('button');

      fireEvent.click(dropdownButton);

      expect(screen.getAllByRole('option').length).toBe(2);
    });
  });
});
