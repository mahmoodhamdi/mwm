/**
 * useIntersectionObserver Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useIntersectionObserver, useLazyLoad } from '../useIntersectionObserver';

// Store observer instances globally
const observerInstances: MockIntersectionObserver[] = [];

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = (options?.root as Element | null) || null;
    this.rootMargin = options?.rootMargin || '100px';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold || 0];

    observerInstances.push(this);
  }

  observe(target: Element): void {
    this.elements.add(target);

    // Auto-trigger an initial entry
    const entry: IntersectionObserverEntry = {
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0,
      intersectionRect: {} as DOMRectReadOnly,
      isIntersecting: false,
      rootBounds: null,
      target,
      time: Date.now(),
    };
    this.callback([entry], this);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  disconnect(): void {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Helper method to trigger intersection
  trigger(isIntersecting: boolean): void {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(target => ({
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      isIntersecting,
      rootBounds: null,
      target,
      time: Date.now(),
    }));

    if (entries.length > 0) {
      this.callback(entries, this);
    }
  }
}

// Helper to set ref.current (readonly in RefObject)
function setRefCurrent(ref: React.RefObject<HTMLDivElement | null>, value: HTMLDivElement | null) {
  Object.defineProperty(ref, 'current', { value, writable: true, configurable: true });
}

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    observerInstances.length = 0;

    // Setup mock IntersectionObserver
    (window as any).IntersectionObserver = jest.fn((callback, options) => {
      return new MockIntersectionObserver(callback, options);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    observerInstances.length = 0;
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.entry).toBeUndefined();
      expect(result.current.ref).toBeDefined();
      expect(result.current.ref.current).toBeNull();
    });

    it('should not create observer without element', () => {
      renderHook(() => useIntersectionObserver());

      expect(window.IntersectionObserver).not.toHaveBeenCalled();
    });
  });

  describe('intersection detection with element', () => {
    it('should detect when element is intersecting', async () => {
      const { result, rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver();
        // Simulate element being in DOM
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      // Force a rerender after element is set
      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      // Trigger intersection
      observerInstances[0].trigger(true);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(true);
        expect(result.current.entry?.isIntersecting).toBe(true);
      });

      // Cleanup
      if (result.current.ref.current) {
        document.body.removeChild(result.current.ref.current);
      }
    });

    it('should detect when element is not intersecting', async () => {
      const { result, rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver();
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      // Trigger not intersecting
      observerInstances[0].trigger(false);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(false);
      });

      if (result.current.ref.current) {
        document.body.removeChild(result.current.ref.current);
      }
    });

    it('should update when intersection state changes', async () => {
      const { result, rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver();
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      const observer = observerInstances[0];

      // Start not intersecting
      observer.trigger(false);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(false);
      });

      // Change to intersecting
      observer.trigger(true);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(true);
      });

      // Change back to not intersecting
      observer.trigger(false);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(false);
      });

      if (result.current.ref.current) {
        document.body.removeChild(result.current.ref.current);
      }
    });
  });

  describe('observer options', () => {
    it('should use custom threshold option', async () => {
      const { rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver({ threshold: 0.5 });
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances[0]?.thresholds).toEqual([0.5]);
      });
    });

    it('should use custom root margin option', async () => {
      const { rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver({ rootMargin: '50px' });
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances[0]?.rootMargin).toBe('50px');
      });
    });

    it('should handle multiple threshold values', async () => {
      const thresholds = [0, 0.25, 0.5, 0.75, 1];
      const { rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver({ threshold: thresholds });
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances[0]?.thresholds).toEqual(thresholds);
      });
    });
  });

  describe('freezeOnceVisible option', () => {
    it('should freeze state once element becomes visible', async () => {
      const { result, rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver({ freezeOnceVisible: true });
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      const observer = observerInstances[0];

      // Trigger intersection
      observer.trigger(true);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(true);
      });

      // Try to change to not intersecting (should remain true due to freeze)
      observer.trigger(false);

      // Wait a bit to ensure no state change
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should remain true because it's frozen
      expect(result.current.isIntersecting).toBe(true);

      if (result.current.ref.current) {
        document.body.removeChild(result.current.ref.current);
      }
    });

    it('should allow updates if never intersected', async () => {
      const { result, rerender } = renderHook(() => {
        const hookResult = useIntersectionObserver({ freezeOnceVisible: true });
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      const observer = observerInstances[0];

      // Never intersecting
      observer.trigger(false);

      await waitFor(() => {
        expect(result.current.isIntersecting).toBe(false);
      });

      // Should update again
      observer.trigger(false);

      expect(result.current.isIntersecting).toBe(false);

      if (result.current.ref.current) {
        document.body.removeChild(result.current.ref.current);
      }
    });
  });

  describe('cleanup', () => {
    it('should disconnect observer on unmount', async () => {
      const { rerender, unmount } = renderHook(() => {
        const hookResult = useIntersectionObserver();
        if (!hookResult.ref.current) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          setRefCurrent(hookResult.ref, el);
        }
        return hookResult;
      });

      rerender();

      await waitFor(() => {
        expect(observerInstances.length).toBeGreaterThan(0);
      });

      const disconnectSpy = jest.spyOn(observerInstances[0], 'disconnect');

      unmount();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});

describe('useLazyLoad', () => {
  beforeEach(() => {
    observerInstances.length = 0;

    (window as any).IntersectionObserver = jest.fn((callback, options) => {
      return new MockIntersectionObserver(callback, options);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    observerInstances.length = 0;
  });

  it('should initialize with shouldLoad false', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current.shouldLoad).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it('should set shouldLoad to true when element is visible', async () => {
    const { result, rerender } = renderHook(() => {
      const hookResult = useLazyLoad();
      if (!hookResult.ref.current) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        setRefCurrent(hookResult.ref, el);
      }
      return hookResult;
    });

    rerender();

    await waitFor(() => {
      expect(observerInstances.length).toBeGreaterThan(0);
    });

    observerInstances[0].trigger(true);

    await waitFor(() => {
      expect(result.current.shouldLoad).toBe(true);
    });

    if (result.current.ref.current) {
      document.body.removeChild(result.current.ref.current);
    }
  });

  it('should use default root margin of 200px', async () => {
    const { rerender } = renderHook(() => {
      const hookResult = useLazyLoad();
      if (!hookResult.ref.current) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        setRefCurrent(hookResult.ref, el);
      }
      return hookResult;
    });

    rerender();

    await waitFor(() => {
      expect(observerInstances[0]?.rootMargin).toBe('200px');
    });
  });

  it('should use custom root margin', async () => {
    const { rerender } = renderHook(() => {
      const hookResult = useLazyLoad('300px');
      if (!hookResult.ref.current) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        setRefCurrent(hookResult.ref, el);
      }
      return hookResult;
    });

    rerender();

    await waitFor(() => {
      expect(observerInstances[0]?.rootMargin).toBe('300px');
    });
  });

  it('should freeze once visible (lazy loading behavior)', async () => {
    const { result, rerender } = renderHook(() => {
      const hookResult = useLazyLoad();
      if (!hookResult.ref.current) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        setRefCurrent(hookResult.ref, el);
      }
      return hookResult;
    });

    rerender();

    await waitFor(() => {
      expect(observerInstances.length).toBeGreaterThan(0);
    });

    // Trigger intersection
    observerInstances[0].trigger(true);

    await waitFor(() => {
      expect(result.current.shouldLoad).toBe(true);
    });

    // Element leaves viewport
    observerInstances[0].trigger(false);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));

    // Should remain true because freezeOnceVisible is enabled
    expect(result.current.shouldLoad).toBe(true);

    if (result.current.ref.current) {
      document.body.removeChild(result.current.ref.current);
    }
  });

  it('should enable freezeOnceVisible by default', async () => {
    const { result, rerender } = renderHook(() => {
      const hookResult = useLazyLoad();
      if (!hookResult.ref.current) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        setRefCurrent(hookResult.ref, el);
      }
      return hookResult;
    });

    rerender();

    await waitFor(() => {
      expect(observerInstances.length).toBeGreaterThan(0);
    });

    // Become visible
    observerInstances[0].trigger(true);

    await waitFor(() => {
      expect(result.current.shouldLoad).toBe(true);
    });

    // Leave viewport
    observerInstances[0].trigger(false);

    await new Promise(resolve => setTimeout(resolve, 50));

    // Should still be true (frozen)
    expect(result.current.shouldLoad).toBe(true);

    if (result.current.ref.current) {
      document.body.removeChild(result.current.ref.current);
    }
  });
});
