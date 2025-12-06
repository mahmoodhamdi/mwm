/**
 * Newsletter Component Tests
 * اختبارات مكون النشرة البريدية
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Newsletter } from '../Newsletter';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      newsletter: 'Newsletter',
      newsletterPlaceholder: 'Your email',
      subscribe: 'Subscribe',
    };
    return translations[key] || key;
  },
}));

describe('Newsletter', () => {
  describe('Default variant', () => {
    it('renders email input', () => {
      render(<Newsletter />);
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    });

    it('renders subscribe button', () => {
      render(<Newsletter />);
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('shows title when showTitle is true', () => {
      render(<Newsletter showTitle />);
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
    });

    it('handles email input change', async () => {
      render(<Newsletter />);
      const input = screen.getByPlaceholderText('Your email');

      await userEvent.type(input, 'test@example.com');

      expect(input).toHaveValue('test@example.com');
    });

    it('shows error for invalid email', async () => {
      render(<Newsletter />);
      const input = screen.getByPlaceholderText('Your email');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await userEvent.type(input, 'invalid-email');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      render(<Newsletter />);
      const input = screen.getByPlaceholderText('Your email');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await userEvent.type(input, 'test@example.com');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows success state after successful submission', async () => {
      render(<Newsletter />);
      const input = screen.getByPlaceholderText('Your email');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await userEvent.type(input, 'test@example.com');
      fireEvent.click(submitButton);

      await waitFor(
        () => {
          expect(screen.getByText(/subscribed/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('clears email after successful submission', async () => {
      render(<Newsletter />);
      const input = screen.getByPlaceholderText('Your email');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await userEvent.type(input, 'test@example.com');
      fireEvent.click(submitButton);

      await waitFor(
        () => {
          expect(input).toHaveValue('');
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Compact variant', () => {
    it('renders with compact styling', () => {
      render(<Newsletter variant="compact" />);
      const input = screen.getByPlaceholderText('Your email');
      expect(input).toBeInTheDocument();
    });

    it('renders send icon button', () => {
      render(<Newsletter variant="compact" />);
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Card variant', () => {
    it('renders with card styling', () => {
      render(<Newsletter variant="card" showTitle />);
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
    });

    it('shows description when showDescription is true', () => {
      render(<Newsletter variant="card" showDescription />);
      expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Newsletter className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('hides title when showTitle is false', () => {
      render(<Newsletter showTitle={false} />);
      expect(screen.queryByText('Newsletter')).not.toBeInTheDocument();
    });
  });
});
