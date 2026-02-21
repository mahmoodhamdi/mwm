/**
 * LazyImage Component Tests
 * اختبارات مكون الصورة الكسولة
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyImage } from '../LazyImage';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, className, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={className}
        data-testid="next-image"
        {...props}
      />
    );
  },
}));

// Mock Skeleton component
jest.mock('../Skeleton', () => ({
  Skeleton: ({ variant, className }: any) => (
    <div data-testid="skeleton" data-variant={variant} className={className} />
  ),
}));

describe('LazyImage', () => {
  let mockIntersectionObserver: jest.Mock;
  let observeCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = jest.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  it('renders container with skeleton initially', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('does not render image until in viewport', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('loads image when element intersects viewport', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    // Simulate intersection
    const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    observeCallback(entries, {} as IntersectionObserver);

    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });
  });

  it('hides skeleton after image loads', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    // Simulate intersection
    const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    observeCallback(entries, {} as IntersectionObserver);

    await waitFor(() => {
      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
    });

    // Simulate image load
    const image = screen.getByTestId('next-image');
    image.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(image).toHaveClass('opacity-100');
    });
  });

  it('shows fallback image on error', async () => {
    render(
      <LazyImage
        src="/broken-image.jpg"
        alt="Test Image"
        fallback="/fallback.jpg"
        width={500}
        height={300}
      />
    );

    // Simulate intersection
    const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    observeCallback(entries, {} as IntersectionObserver);

    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    // Simulate error
    const image = screen.getByTestId('next-image');
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/fallback.jpg');
    });
  });

  it('does not show skeleton when showSkeleton is false', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test Image"
        width={500}
        height={300}
        showSkeleton={false}
      />
    );

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test Image"
        width={500}
        height={300}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom skeletonClassName', () => {
    render(
      <LazyImage
        src="/test-image.jpg"
        alt="Test Image"
        width={500}
        height={300}
        skeletonClassName="custom-skeleton"
      />
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('image has opacity-0 initially and opacity-100 after load', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test Image" width={500} height={300} />);

    // Simulate intersection
    const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    observeCallback(entries, {} as IntersectionObserver);

    await waitFor(() => {
      const image = screen.getByTestId('next-image');
      expect(image).toHaveClass('opacity-0');
    });

    // Simulate load
    const image = screen.getByTestId('next-image');
    image.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(image).toHaveClass('opacity-100');
    });
  });

  it('uses default fallback placeholder', async () => {
    render(<LazyImage src="/broken-image.jpg" alt="Test Image" width={500} height={300} />);

    // Simulate intersection
    const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    observeCallback(entries, {} as IntersectionObserver);

    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    // Simulate error
    const image = screen.getByTestId('next-image');
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/images/placeholder.jpg');
    });
  });
});
