/**
 * Accessibility Utilities
 * أدوات إمكانية الوصول
 */

/**
 * ARIA live region announcer for screen readers
 * إعلان المنطقة الحية ARIA لقارئات الشاشة
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return;

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;

  document.body.appendChild(announcer);

  // Delay to ensure the announcer is in the DOM before announcing
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Focus management utilities
 * أدوات إدارة التركيز
 */
export const focusUtils = {
  /**
   * Trap focus within an element (for modals, dialogs)
   * حصر التركيز داخل عنصر (للنوافذ المنبثقة)
   */
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Return focus to the element that triggered a modal
   * إرجاع التركيز إلى العنصر الذي فتح النافذة المنبثقة
   */
  saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  },

  restoreFocus(element: HTMLElement | null): void {
    element?.focus();
  },
};

/**
 * Skip link target creator
 * منشئ هدف رابط التخطي
 */
export function createSkipLinkTarget(id: string): void {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(id);
  if (target && !target.getAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }
}

/**
 * Check if user prefers reduced motion
 * التحقق من تفضيل المستخدم لتقليل الحركة
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 * التحقق من تفضيل المستخدم للتباين العالي
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Keyboard navigation helpers
 * مساعدات التنقل بلوحة المفاتيح
 */
export const keyboardNav = {
  /**
   * Handle arrow key navigation in a list
   * التعامل مع التنقل بمفاتيح الأسهم في قائمة
   */
  handleArrowKeys(
    e: React.KeyboardEvent,
    currentIndex: number,
    itemCount: number,
    onSelect: (index: number) => void
  ): void {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    onSelect(newIndex);
  },

  /**
   * Handle typeahead search in a list
   * التعامل مع البحث بالكتابة في قائمة
   */
  createTypeaheadHandler(items: string[], onSelect: (index: number) => void, timeout = 500) {
    let searchString = '';
    let searchTimeout: ReturnType<typeof setTimeout>;

    return (e: React.KeyboardEvent) => {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

      clearTimeout(searchTimeout);
      searchString += e.key.toLowerCase();

      const matchIndex = items.findIndex(item => item.toLowerCase().startsWith(searchString));

      if (matchIndex !== -1) {
        onSelect(matchIndex);
      }

      searchTimeout = setTimeout(() => {
        searchString = '';
      }, timeout);
    };
  },
};

/**
 * WCAG 2.1 color contrast utilities
 * أدوات تباين الألوان WCAG 2.1
 */
export const colorContrast = {
  /**
   * Calculate relative luminance of a color
   * حساب الإضاءة النسبية للون
   */
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   * حساب نسبة التباين بين لونين
   */
  getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
    const lum1 = this.getLuminance(...color1);
    const lum2 = this.getLuminance(...color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if contrast meets WCAG AA requirements (4.5:1 for normal text)
   * التحقق من استيفاء التباين لمتطلبات WCAG AA
   */
  meetsWCAGAA(
    color1: [number, number, number],
    color2: [number, number, number],
    largeText = false
  ): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return largeText ? ratio >= 3 : ratio >= 4.5;
  },

  /**
   * Check if contrast meets WCAG AAA requirements (7:1 for normal text)
   * التحقق من استيفاء التباين لمتطلبات WCAG AAA
   */
  meetsWCAGAAA(
    color1: [number, number, number],
    color2: [number, number, number],
    largeText = false
  ): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return largeText ? ratio >= 4.5 : ratio >= 7;
  },
};

const accessibilityUtils = {
  announceToScreenReader,
  focusUtils,
  createSkipLinkTarget,
  prefersReducedMotion,
  prefersHighContrast,
  keyboardNav,
  colorContrast,
};

export default accessibilityUtils;
