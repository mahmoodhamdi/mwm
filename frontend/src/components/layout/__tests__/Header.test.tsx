/**
 * Header Component Tests
 * اختبارات مكون الهيدر
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../Header';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'ar',
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        blog: 'Blog',
        careers: 'Careers',
        contact: 'Contact',
      },
      common: {
        contactUs: 'Contact Us',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/ar',
}));

// Mock ThemeProvider
jest.mock('@/providers/ThemeProvider', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
  }),
}));

// Mock LanguageSwitcher
jest.mock('@/components/common/LanguageSwitcher', () => ({
  LanguageSwitcher: ({ variant }: { variant?: string }) => (
    <div data-testid="language-switcher" data-variant={variant}>
      Language Switcher
    </div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    // Reset window scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('renders logo', () => {
    render(<Header />);
    expect(screen.getByText('MWM')).toBeInTheDocument();
  });

  it('renders navigation links on desktop', () => {
    render(<Header />);
    // Header renders both desktop and mobile navigation, so use getAllByText
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
  });

  it('renders theme toggle', () => {
    render(<Header />);
    const themeToggles = screen.getAllByTestId('theme-toggle');
    expect(themeToggles.length).toBeGreaterThan(0);
  });

  it('renders language switcher', () => {
    render(<Header />);
    const languageSwitchers = screen.getAllByTestId('language-switcher');
    expect(languageSwitchers.length).toBeGreaterThan(0);
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();

    // Close menu
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('renders contact button', () => {
    render(<Header />);
    const contactButtons = screen.getAllByText('Contact Us');
    expect(contactButtons.length).toBeGreaterThan(0);
  });

  it('applies transparent class when transparent prop is true', () => {
    const { container } = render(<Header transparent />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-transparent');
  });

  it('adds scroll styles when page is scrolled', async () => {
    const { container } = render(<Header transparent />);

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 50 });
    fireEvent.scroll(window);

    await waitFor(() => {
      const header = container.querySelector('header');
      expect(header).toHaveClass('shadow-sm');
    });
  });

  it('applies custom className', () => {
    const { container } = render(<Header className="custom-class" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });
});
