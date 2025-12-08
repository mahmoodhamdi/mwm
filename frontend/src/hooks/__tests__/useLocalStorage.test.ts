/**
 * useLocalStorage Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current[0]).toBe('initial');
    });

    it('should return stored value when localStorage has data', () => {
      window.localStorage.setItem('test-key', JSON.stringify('stored-value'));

      renderHook(() => useLocalStorage('test-key', 'initial'));

      // After mount effect runs, it should read from localStorage
      expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle object values', () => {
      const initialValue = { name: 'test', count: 0 };
      const { result } = renderHook(() => useLocalStorage('test-object', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });

    it('should handle array values', () => {
      const initialValue = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage('test-array', initialValue));

      expect(result.current[0]).toEqual(initialValue);
    });
  });

  describe('setValue', () => {
    it('should update state and localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('new-value')
      );
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-count', 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should handle object updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-obj', { count: 0 }));

      act(() => {
        result.current[1](prev => ({ ...prev, count: prev.count + 1 }));
      });

      expect(result.current[0]).toEqual({ count: 1 });
    });
  });

  describe('removeValue', () => {
    it('should remove value from localStorage and reset to initial', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('initial');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (window.localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

      expect(result.current[0]).toBe('fallback');
      consoleSpy.mockRestore();
    });

    it('should handle invalid JSON in localStorage', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (window.localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');

      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

      // Should handle the parse error
      expect(result.current[0]).toBe('fallback');
      consoleSpy.mockRestore();
    });
  });

  describe('key changes', () => {
    it('should update when key changes', () => {
      const { result, rerender } = renderHook(({ key }) => useLocalStorage(key, 'initial'), {
        initialProps: { key: 'key1' },
      });

      act(() => {
        result.current[1]('value1');
      });

      expect(result.current[0]).toBe('value1');

      rerender({ key: 'key2' });

      // Should reset to initial for new key
      expect(result.current[0]).toBe('initial');
    });
  });
});
