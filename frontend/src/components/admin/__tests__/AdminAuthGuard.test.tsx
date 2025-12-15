/**
 * AdminAuthGuard Component Tests
 * اختبارات مكون حماية صفحات لوحة التحكم
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminAuthGuard } from '../AdminAuthGuard';

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AdminAuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner while checking auth', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <AdminAuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AdminAuthGuard>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should return null when not authenticated (prevents content flash)', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    const { container } = render(
      <AdminAuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AdminAuthGuard>
    );

    // Should render nothing (null) when not authenticated
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <AdminAuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AdminAuthGuard>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should not show loading spinner when auth check is complete', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <AdminAuthGuard>
        <div>Content</div>
      </AdminAuthGuard>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should render nested children correctly when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(
      <AdminAuthGuard>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to admin panel</p>
        </div>
      </AdminAuthGuard>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to admin panel')).toBeInTheDocument();
  });
});
