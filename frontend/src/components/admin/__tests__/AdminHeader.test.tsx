/**
 * AdminHeader Component Tests
 * اختبارات مكون رأس لوحة التحكم
 */

// Mock hooks first
const mockUseLocale = jest.fn(() => 'en');
const mockUseTranslations = jest.fn(() => (key: string) => key);

jest.mock('next-intl', () => ({
  useLocale: mockUseLocale,
  useTranslations: mockUseTranslations,
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/en/admin',
}));

// Mock AuthProvider
const mockLogout = jest.fn();
const mockUseAuth = jest.fn(() => ({
  user: {
    _id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  },
  logout: mockLogout,
}));

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: mockUseAuth,
}));

// Mock ThemeProvider
const mockUseTheme = jest.fn(() => ({
  theme: 'light',
  setTheme: jest.fn(),
}));

jest.mock('@/providers/ThemeProvider', () => ({
  useTheme: mockUseTheme,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminHeader } from '../AdminHeader';

describe('AdminHeader', () => {
  const mockOnMenuToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks with defaults
    mockUseLocale.mockReturnValue('en');
    mockUseAuth.mockReturnValue({
      user: {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      },
      logout: mockLogout,
    });
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });
    // Reset document classes
    document.documentElement.className = '';
  });

  it('renders header with all elements', () => {
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    // Check menu toggle button exists
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();

    // Check search input exists
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();

    // Check language switcher exists
    expect(screen.getByLabelText('Switch language')).toBeInTheDocument();

    // Check dark mode toggle exists
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();

    // Check notifications bell exists
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();

    // Check user name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    const menuButton = screen.getByLabelText('Open menu');
    await user.click(menuButton);

    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('displays unread message count badge', () => {
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} unreadMessages={5} />);

    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
  });

  it('displays 99+ for unread messages over 99', () => {
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} unreadMessages={150} />);

    const badge = screen.getByText('99+');
    expect(badge).toBeInTheDocument();
  });

  it('does not show badge when no unread messages', () => {
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} unreadMessages={0} />);

    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('toggles dark mode when dark mode button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    const darkModeButton = screen.getByLabelText('Toggle dark mode');
    await user.click(darkModeButton);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('opens and closes user menu dropdown', async () => {
    const user = userEvent.setup();
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    // User menu should be closed initially
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    // Click user menu button
    const userButton = screen.getByRole('button', { name: /john doe/i });
    await user.click(userButton);

    // Menu items should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click backdrop to close
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  it('calls logout function when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    // Open user menu
    const userButton = screen.getByRole('button', { name: /john doe/i });
    await user.click(userButton);

    // Click logout button
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('renders in RTL mode for Arabic locale', () => {
    mockUseLocale.mockReturnValue('ar');

    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    // Check Arabic translations
    expect(screen.getByLabelText('فتح القائمة')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('بحث...')).toBeInTheDocument();
  });

  it('displays default name when user name is not available', () => {
    mockUseAuth.mockReturnValue({
      user: { _id: '123', name: '', email: 'test@example.com', role: 'admin' },
      logout: mockLogout,
    });

    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('changes language when language switcher is clicked', async () => {
    const user = userEvent.setup();
    delete (window as any).location;
    window.location = { href: 'http://localhost/en/admin', pathname: '/en/admin' } as any;

    render(<AdminHeader onMenuToggle={mockOnMenuToggle} />);

    const langButton = screen.getByLabelText('Switch language');
    await user.click(langButton);

    expect(window.location.href).toBe('/ar/admin');
  });
});
