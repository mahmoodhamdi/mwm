/**
 * Gallery Component Tests
 * اختبارات مكون معرض الصور
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Gallery } from '../Gallery';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Gallery', () => {
  const mockImages = ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg'];

  const mockImagesWithDetails = [
    { src: '/img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
    { src: '/img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
    { src: '/img3.jpg', alt: 'Image 3', caption: 'Caption 3' },
  ];

  describe('Grid Variant', () => {
    it('should render all images', () => {
      render(<Gallery images={mockImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
    });

    it('should render images as clickable buttons for lightbox', () => {
      render(<Gallery images={mockImages} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('should apply default grid layout', () => {
      render(<Gallery images={mockImages} data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('grid');
      expect(gallery).toHaveClass('lg:grid-cols-3');
    });

    it('should support different column counts', () => {
      render(<Gallery images={mockImages} columns={4} data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('lg:grid-cols-4');
    });

    it('should render with custom alt text', () => {
      render(<Gallery images={mockImagesWithDetails} />);

      expect(screen.getByAltText('Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Image 2')).toBeInTheDocument();
    });

    it('should show captions when showCaptions is true', () => {
      render(<Gallery images={mockImagesWithDetails} showCaptions />);

      expect(screen.getByText('Caption 1')).toBeInTheDocument();
      expect(screen.getByText('Caption 2')).toBeInTheDocument();
    });
  });

  describe('Lightbox', () => {
    it('should open lightbox when image is clicked', () => {
      render(<Gallery images={mockImages} />);

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      // Lightbox should be open - check for close button or navigation
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close lightbox when close button is clicked', () => {
      render(<Gallery images={mockImages} />);

      // Open lightbox
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      // Find and click close button (within dialog)
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // Lightbox should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should show image counter in lightbox', () => {
      render(<Gallery images={mockImages} />);

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(screen.getByText('1 / 4')).toBeInTheDocument();
    });

    it('should navigate to next image', () => {
      render(<Gallery images={mockImages} />);

      // Open lightbox on first image
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      // Click next button
      const nextButton = screen.getByLabelText('Next');
      fireEvent.click(nextButton);

      expect(screen.getByText('2 / 4')).toBeInTheDocument();
    });

    it('should navigate to previous image', () => {
      render(<Gallery images={mockImages} />);

      // Open lightbox on second image
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[1]);

      // Click previous button
      const prevButton = screen.getByLabelText('Previous');
      fireEvent.click(prevButton);

      expect(screen.getByText('1 / 4')).toBeInTheDocument();
    });

    it('should not show navigation when only one image', () => {
      render(<Gallery images={['/single.jpg']} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.queryByLabelText('Next')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument();
    });

    it('should not open lightbox when lightbox is disabled', () => {
      render(<Gallery images={mockImages} lightbox={false} />);

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Carousel Variant', () => {
    it('should render with carousel layout', () => {
      render(<Gallery images={mockImages} variant="carousel" data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('relative');
    });

    it('should render main image and thumbnails', () => {
      render(<Gallery images={mockImages} variant="carousel" />);

      // Should have main image + thumbnails
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(1);
    });

    it('should have expand button', () => {
      render(<Gallery images={mockImages} variant="carousel" />);

      expect(screen.getByLabelText('Expand')).toBeInTheDocument();
    });
  });

  describe('Masonry Variant', () => {
    it('should render with masonry layout', () => {
      render(<Gallery images={mockImages} variant="masonry" data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('columns-1');
    });

    it('should render all images', () => {
      render(<Gallery images={mockImages} variant="masonry" />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
    });
  });

  describe('Gap Sizes', () => {
    it('should apply small gap', () => {
      render(<Gallery images={mockImages} gap="sm" data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('gap-2');
    });

    it('should apply medium gap (default)', () => {
      render(<Gallery images={mockImages} data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('gap-4');
    });

    it('should apply large gap', () => {
      render(<Gallery images={mockImages} gap="lg" data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('gap-6');
    });
  });

  describe('Aspect Ratios', () => {
    it('should apply video aspect ratio (default)', () => {
      render(<Gallery images={mockImages} />);

      const button = screen.getAllByRole('button')[0];
      expect(button).toHaveClass('aspect-video');
    });

    it('should apply square aspect ratio', () => {
      render(<Gallery images={mockImages} aspectRatio="square" />);

      const button = screen.getAllByRole('button')[0];
      expect(button).toHaveClass('aspect-square');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<Gallery images={mockImages} className="custom-class" data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery).toHaveClass('custom-class');
    });
  });

  describe('Empty State', () => {
    it('should handle empty images array', () => {
      render(<Gallery images={[]} data-testid="gallery" />);

      const gallery = screen.getByTestId('gallery');
      expect(gallery.children).toHaveLength(0);
    });
  });
});
