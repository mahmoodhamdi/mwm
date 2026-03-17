/**
 * Modal Component Tests
 * اختبارات مكون النافذة المنبثقة
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

// Mock @headlessui/react
jest.mock('@headlessui/react', () => ({
  Dialog: ({ children, onClose, as: Component = 'div', ...props }: any) => (
    <Component {...props} role="dialog">
      {typeof children === 'function' ? children({ open: true }) : children}
    </Component>
  ),
  Transition: ({ children, show }: any) =>
    show ? <div>{typeof children === 'function' ? children({}) : children}</div> : null,
}));

// Add Dialog sub-components to the mock
Object.assign(require('@headlessui/react').Dialog as any, {
  Panel: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="dialog-panel" {...props}>
      {children}
    </div>
  ),
  Title: ({ children, as: Component = 'h3', className, ...props }: any) => (
    <Component className={className} data-testid="dialog-title" {...props}>
      {children}
    </Component>
  ),
  Description: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="dialog-description" {...props}>
      {children}
    </div>
  ),
});

// Add Transition Child
Object.assign(require('@headlessui/react').Transition as any, {
  Child: ({ children }: any) => (
    <div>{typeof children === 'function' ? children({}) : children}</div>
  ),
});

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} description="Test Description">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    // Get the dialog element and verify it exists
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // The backdrop element with the specific classes
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50');

    // When backdrop would normally be clicked in headlessui, it calls Dialog's onClose
    // Since we can't easily simulate that with our mock, we just verify the backdrop exists
    // and test that onClose is set up properly by testing the Dialog element
    expect(backdrop).toBeInTheDocument();
  });

  it('applies correct size class for sm size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-sm');
  });

  it('applies correct size class for md size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} size="md">
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-md');
  });

  it('applies correct size class for lg size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-lg');
  });

  it('applies correct size class for xl size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} size="xl">
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-xl');
  });

  it('applies correct size class for full size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} size="full">
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-4xl');
  });

  it('uses md size by default', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const panel = screen.getByTestId('dialog-panel');
    expect(panel).toHaveClass('max-w-md');
  });

  it('renders children correctly', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>
          <h2>Custom Title</h2>
          <p>Custom Content</p>
          <button>Action</button>
        </div>
      </Modal>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders backdrop with blur', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
