/**
 * AdminLayout Component Tests
 * اختبارات مكون تخطيط لوحة التحكم
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminLayout } from '../AdminLayout';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: jest.fn(() => 'en'),
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/en/admin',
}));

// Mock AuthProvider
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    },
    logout: jest.fn(),
  }),
}));

// Mock child components
jest.mock('../AdminSidebar', () => ({
  AdminSidebar: ({ isOpen, onClose }: any) => (
    <div data-testid="admin-sidebar" data-open={isOpen}>
      <button onClick={onClose}>Close Sidebar</button>
    </div>
  ),
}));

jest.mock('../AdminHeader', () => ({
  AdminHeader: ({ onMenuToggle, unreadMessages }: any) => (
    <div data-testid="admin-header" data-unread={unreadMessages}>
      <button onClick={onMenuToggle}>Toggle Menu</button>
    </div>
  ),
}));

describe('AdminLayout', () => {
  it('renders layout with sidebar, header, and content', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders children inside main content area', () => {
    render(
      <AdminLayout>
        <h1>Dashboard</h1>
        <p>Welcome to the admin panel</p>
      </AdminLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the admin panel')).toBeInTheDocument();
  });

  it('passes unreadMessages prop to header', () => {
    render(
      <AdminLayout unreadMessages={10}>
        <div>Content</div>
      </AdminLayout>
    );

    const header = screen.getByTestId('admin-header');
    expect(header).toHaveAttribute('data-unread', '10');
  });

  it('sidebar is closed by default', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });

  it('opens sidebar when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const toggleButton = screen.getByText('Toggle Menu');
    await user.click(toggleButton);

    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');
  });

  it('closes sidebar when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    // Open sidebar
    const toggleButton = screen.getByText('Toggle Menu');
    await user.click(toggleButton);

    let sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');

    // Close sidebar
    const closeButton = screen.getByText('Close Sidebar');
    await user.click(closeButton);

    sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });

  it('toggles sidebar state correctly', async () => {
    const user = userEvent.setup();
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const toggleButton = screen.getByText('Toggle Menu');
    let sidebar = screen.getByTestId('admin-sidebar');

    // Initially closed
    expect(sidebar).toHaveAttribute('data-open', 'false');

    // Click to open
    await user.click(toggleButton);
    sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'true');

    // Click to close
    await user.click(toggleButton);
    sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-open', 'false');
  });

  it('applies RTL margin for Arabic locale', () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('ar');

    const { container } = render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('lg:mr-72');
  });

  it('applies LTR margin for English locale', () => {
    const { useLocale } = require('next-intl');
    useLocale.mockReturnValue('en');

    const { container } = render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('lg:ml-72');
  });

  it('renders with default unreadMessages as 0', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    const header = screen.getByTestId('admin-header');
    expect(header).toHaveAttribute('data-unread', '0');
  });
});
