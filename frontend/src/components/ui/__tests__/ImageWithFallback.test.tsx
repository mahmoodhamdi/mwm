/**
 * ImageWithFallback Component Tests
 * اختبارات مكون الصورة مع الصورة البديلة
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageWithFallback } from '../ImageWithFallback';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, fill, priority, ...props }: any) => {
    // Render actual attributes for boolean props
    const attrs: any = { src, alt, onError, 'data-testid': 'next-image', ...props };
    if (fill) attrs.fill = '';
    if (priority) attrs.priority = '';
    return <img {...attrs} />;
  },
}));

describe('ImageWithFallback', () => {
  it('renders image with correct src and alt', () => {
    render(<ImageWithFallback src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('displays fallback image on error', () => {
    render(
      <ImageWithFallback
        src="/broken-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test Image');

    // Trigger error
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/fallback.jpg');
  });

  it('uses default fallback when not provided', () => {
    render(<ImageWithFallback src="/broken-image.jpg" alt="Test Image" width={500} height={300} />);

    const image = screen.getByAltText('Test Image');

    // Trigger error
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/images/placeholder.svg');
  });

  it('uses fallbackAlt when provided and error occurs', () => {
    render(
      <ImageWithFallback
        src="/broken-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        fallbackAlt="Fallback Image"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test Image');

    // Trigger error
    fireEvent.error(image);

    expect(screen.getByAltText('Fallback Image')).toBeInTheDocument();
  });

  it('keeps original alt when fallbackAlt is not provided', () => {
    render(
      <ImageWithFallback
        src="/broken-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test Image');

    // Trigger error
    fireEvent.error(image);

    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
  });

  it('passes through additional props to Image component', () => {
    render(
      <ImageWithFallback
        src="/test-image.jpg"
        alt="Test Image"
        width={500}
        height={300}
        className="custom-class"
        priority
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveClass('custom-class');
    expect(image).toHaveAttribute('priority');
  });

  it('handles multiple error events correctly', () => {
    render(
      <ImageWithFallback
        src="/broken-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test Image');

    // Trigger error multiple times
    fireEvent.error(image);
    fireEvent.error(image);
    fireEvent.error(image);

    // Should still show fallback
    expect(image).toHaveAttribute('src', '/fallback.jpg');
  });

  it('does not change src when no error occurs', () => {
    render(
      <ImageWithFallback
        src="/test-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test Image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('works with fill layout', () => {
    render(
      <ImageWithFallback src="/test-image.jpg" alt="Test Image" fill fallback="/fallback.jpg" />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('fill');
  });

  it('works with responsive sizes', () => {
    render(
      <ImageWithFallback
        src="/test-image.jpg"
        alt="Test Image"
        width={500}
        height={300}
        sizes="(max-width: 768px) 100vw, 50vw"
        fallback="/fallback.jpg"
      />
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });
});
