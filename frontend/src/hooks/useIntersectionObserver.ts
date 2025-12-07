'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | undefined;
}

/**
 * Hook to observe element intersection with viewport
 * خطاف لمراقبة تقاطع العنصر مع منطقة العرض
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0, root = null, rootMargin = '100px', freezeOnceVisible = false } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = useRef(false);

  const updateEntry = useCallback(
    ([entry]: IntersectionObserverEntry[]): void => {
      if (frozen.current && entry.isIntersecting) return;

      setEntry(entry);

      if (freezeOnceVisible && entry.isIntersecting) {
        frozen.current = true;
      }
    },
    [freezeOnceVisible]
  );

  useEffect(() => {
    const node = ref.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, updateEntry]);

  return {
    ref,
    isIntersecting: entry?.isIntersecting ?? false,
    entry,
  };
}

/**
 * Hook for lazy loading content when it enters viewport
 * خطاف للتحميل الكسول للمحتوى عند دخوله منطقة العرض
 */
export function useLazyLoad(rootMargin = '200px') {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin,
    freezeOnceVisible: true,
  });

  return { ref, shouldLoad: isIntersecting };
}

export default useIntersectionObserver;
