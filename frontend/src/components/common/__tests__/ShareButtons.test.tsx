/**
 * ShareButtons Component Tests
 * اختبارات مكون أزرار المشاركة
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButtons } from '../ShareButtons';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
};
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

describe('ShareButtons', () => {
  const defaultProps = {
    url: '/en/blog/test-post',
    title: 'Test Post Title',
    description: 'Test post description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should render all share buttons', () => {
      render(<ShareButtons {...defaultProps} />);

      expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<ShareButtons {...defaultProps} className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Facebook Share', () => {
    it('should open Facebook share dialog on click', () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Share on Facebook'));

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer'),
        'facebook-share',
        'width=600,height=400'
      );
    });

    it('should include encoded URL in Facebook share', () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Share on Facebook'));

      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('https://example.com/en/blog/test-post'));
    });
  });

  describe('Twitter Share', () => {
    it('should open Twitter share dialog on click', () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Share on Twitter'));

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        'twitter-share',
        'width=600,height=400'
      );
    });

    it('should include title and description in Twitter share', () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Share on Twitter'));

      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('text=');
      expect(calledUrl).toContain(encodeURIComponent('Test Post Title'));
    });

    it('should use only title when no description provided', () => {
      render(<ShareButtons url={defaultProps.url} title={defaultProps.title} />);

      fireEvent.click(screen.getByLabelText('Share on Twitter'));

      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('Test Post Title'));
    });
  });

  describe('LinkedIn Share', () => {
    it('should open LinkedIn share dialog on click', () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Share on LinkedIn'));

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing'),
        'linkedin-share',
        'width=600,height=400'
      );
    });
  });

  describe('Copy Link', () => {
    it('should copy URL to clipboard on click', async () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Copy link'));

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          'https://example.com/en/blog/test-post'
        );
      });
    });

    it('should show copied state after copying', async () => {
      render(<ShareButtons {...defaultProps} />);

      fireEvent.click(screen.getByLabelText('Copy link'));

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByLabelText('Link copied!')).toBeInTheDocument();
      });
    });

    it('should use full URL when url starts with http', async () => {
      render(<ShareButtons url="https://mwm.com/blog/test" title="Test" />);

      fireEvent.click(screen.getByLabelText('Copy link'));

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('https://mwm.com/blog/test');
      });
    });
  });

  describe('URL Handling', () => {
    it('should prepend origin to relative URLs', () => {
      render(<ShareButtons url="/relative/path" title="Test" />);

      fireEvent.click(screen.getByLabelText('Share on Facebook'));

      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('https://example.com/relative/path'));
    });

    it('should use absolute URLs as-is', () => {
      render(<ShareButtons url="https://absolute.com/path" title="Test" />);

      fireEvent.click(screen.getByLabelText('Share on Facebook'));

      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('https://absolute.com/path'));
    });
  });
});
