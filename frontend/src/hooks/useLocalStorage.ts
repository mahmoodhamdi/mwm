'use client';

/**
 * useLocalStorage Hook
 * خطاف التخزين المحلي
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Store initialValue in a ref to avoid re-creating callbacks
  const initialValueRef = useRef(initialValue);
  // Track the current key to detect changes
  const keyRef = useRef(key);

  // Read value from localStorage
  const readValue = useCallback((storageKey: string): T => {
    if (typeof window === 'undefined') {
      return initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading localStorage key "${storageKey}":`, error);
      return initialValueRef.current;
    }
  }, []);

  // Get stored value or initial value (lazy initialization)
  const [storedValue, setStoredValue] = useState<T>(() => readValue(key));

  // Update value when key changes
  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setStoredValue(readValue(key));
    }
  }, [key, readValue]);

  // Set value to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue(prev => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            // Dispatch storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', { key }));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValueRef.current);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const item = window.localStorage.getItem(key);
          setStoredValue(item ? (JSON.parse(item) as T) : initialValueRef.current);
        } catch (error) {
          console.warn(`Error reading localStorage key "${key}":`, error);
          setStoredValue(initialValueRef.current);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
