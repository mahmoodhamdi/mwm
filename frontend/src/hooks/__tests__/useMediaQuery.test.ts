/**
 * useMediaQuery Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from '../useMediaQuery';

describe('useMediaQuery', () => {
  let mockMatchMedia: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;

  beforeEach(() => {
    listeners = new Map();
    mockAddEventListener = jest.fn((event, handler) => {
      if (event === 'change') {
        listeners.set('change', handler);
      }
    });
    mockRemoveEventListener = jest.fn();

    mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  describe('useMediaQuery', () => {
    it('should return false by default', () => {
      const { result } = renderHook(() => useMediaQuery('(max-width: 639px)'));

      expect(result.current).toBe(false);
    });

    it('should return true when media query matches', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => useMediaQuery('(max-width: 639px)'));

      expect(result.current).toBe(true);
    });

    it('should add event listener for changes', () => {
      renderHook(() => useMediaQuery('(max-width: 639px)'));

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(max-width: 639px)'));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update when media query changes', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => useMediaQuery('(max-width: 639px)'));

      expect(result.current).toBe(false);

      // Simulate media query change
      const handler = listeners.get('change');
      if (handler) {
        act(() => {
          handler({ matches: true } as MediaQueryListEvent);
        });
      }

      expect(result.current).toBe(true);
    });

    it('should call matchMedia with correct query', () => {
      renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });

  describe('useIsMobile', () => {
    it('should check for max-width: 639px', () => {
      renderHook(() => useIsMobile());

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 639px)');
    });

    it('should return true when on mobile', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(max-width: 639px)',
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });
  });

  describe('useIsTablet', () => {
    it('should check for tablet breakpoint', () => {
      renderHook(() => useIsTablet());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 640px) and (max-width: 1023px)');
    });
  });

  describe('useIsDesktop', () => {
    it('should check for min-width: 1024px', () => {
      renderHook(() => useIsDesktop());

      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });

    it('should return true when on desktop', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => useIsDesktop());

      expect(result.current).toBe(true);
    });
  });

  describe('usePrefersDarkMode', () => {
    it('should check for prefers-color-scheme: dark', () => {
      renderHook(() => usePrefersDarkMode());

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should return true when dark mode is preferred', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => usePrefersDarkMode());

      expect(result.current).toBe(true);
    });
  });

  describe('usePrefersReducedMotion', () => {
    it('should check for prefers-reduced-motion: reduce', () => {
      renderHook(() => usePrefersReducedMotion());

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should return true when reduced motion is preferred', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));

      const { result } = renderHook(() => usePrefersReducedMotion());

      expect(result.current).toBe(true);
    });
  });
});
