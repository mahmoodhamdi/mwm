/**
 * Container Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from '../Container';

describe('Container', () => {
  describe('basic rendering', () => {
    it('should render children', () => {
      render(<Container>Container content</Container>);
      expect(screen.getByText('Container content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('DIV');
    });

    it('should apply custom className', () => {
      render(
        <Container className="custom-class" data-testid="container">
          Content
        </Container>
      );
      expect(screen.getByTestId('container')).toHaveClass('custom-class');
    });
  });

  describe('sizes', () => {
    it('should render default size (xl = 7xl)', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-7xl');
    });

    it('should render sm size', () => {
      render(
        <Container size="sm" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-3xl');
    });

    it('should render md size', () => {
      render(
        <Container size="md" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-5xl');
    });

    it('should render lg size', () => {
      render(
        <Container size="lg" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-6xl');
    });
  });

  describe('centering', () => {
    it('should have mx-auto for horizontal centering', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('mx-auto');
    });
  });

  describe('padding', () => {
    it('should have horizontal padding', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      expect(container).toHaveClass('px-4');
    });
  });

  describe('nested content', () => {
    it('should render complex nested content', () => {
      render(
        <Container>
          <header>Header</header>
          <main>Main content</main>
          <footer>Footer</footer>
        </Container>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});
