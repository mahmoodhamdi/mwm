/**
 * Spinner Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner, PageSpinner, Loading } from '../Spinner';

describe('Spinner', () => {
  describe('basic rendering', () => {
    it('should render spinner element', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('should have animation class', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toHaveClass('animate-spin');
    });

    it('should have aria-label for accessibility', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-4');
      expect(spinner).toHaveClass('w-4');
    });

    it('should render medium size by default', () => {
      render(<Spinner />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-6');
      expect(spinner).toHaveClass('w-6');
    });

    it('should render large size', () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-8');
      expect(spinner).toHaveClass('w-8');
    });

    it('should render xl size', () => {
      render(<Spinner size="xl" />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-12');
      expect(spinner).toHaveClass('w-12');
    });
  });

  describe('colors', () => {
    it('should render primary color by default', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toHaveClass('text-primary-600');
    });

    it('should render white color', () => {
      render(<Spinner color="white" />);
      expect(screen.getByLabelText('Loading')).toHaveClass('text-white');
    });

    it('should render gray color', () => {
      render(<Spinner color="gray" />);
      expect(screen.getByLabelText('Loading')).toHaveClass('text-gray-600');
    });

    it('should render secondary color', () => {
      render(<Spinner color="secondary" />);
      expect(screen.getByLabelText('Loading')).toHaveClass('text-secondary-600');
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      render(<Spinner className="custom-spinner" />);
      expect(screen.getByLabelText('Loading')).toHaveClass('custom-spinner');
    });
  });
});

describe('PageSpinner', () => {
  it('should render centered spinner', () => {
    render(<PageSpinner />);
    const spinner = screen.getByLabelText('Loading');
    const container = spinner.parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  it('should contain a Spinner component', () => {
    render(<PageSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should render xl spinner', () => {
    render(<PageSpinner />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveClass('h-12');
    expect(spinner).toHaveClass('w-12');
  });
});

describe('Loading', () => {
  it('should render spinner with default text', () => {
    render(<Loading />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<Loading text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should render medium size by default', () => {
    render(<Loading />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveClass('h-6');
    expect(spinner).toHaveClass('w-6');
  });

  it('should support different sizes', () => {
    render(<Loading size="lg" />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
  });

  it('should be centered', () => {
    render(<Loading />);
    const spinner = screen.getByLabelText('Loading');
    const container = spinner.parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });
});
