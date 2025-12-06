/**
 * Utils Tests
 */

/* eslint-disable tailwindcss/no-contradicting-classname */
import { cn } from '../utils';

describe('cn (className utility)', () => {
  describe('basic functionality', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle empty strings', () => {
      expect(cn('', 'foo', '')).toBe('foo');
    });

    it('should handle undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('should handle null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('should handle boolean values', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar');
      expect(cn('foo', true && 'baz', 'bar')).toBe('foo baz bar');
    });
  });

  describe('conditional classes', () => {
    it('should handle conditional object syntax', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('should handle mixed conditional and string classes', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });
  });

  describe('tailwind merge functionality', () => {
    it('should merge conflicting tailwind classes', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should merge conflicting padding classes', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('should merge conflicting margin classes', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    it('should merge conflicting text size classes', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('should merge conflicting text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should merge conflicting background color classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should keep non-conflicting classes', () => {
      expect(cn('p-2', 'mx-4', 'text-lg')).toBe('p-2 mx-4 text-lg');
    });

    it('should handle responsive variants', () => {
      expect(cn('p-2', 'md:p-4', 'lg:p-6')).toBe('p-2 md:p-4 lg:p-6');
    });

    it('should merge conflicting responsive variants', () => {
      expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4');
    });

    it('should handle state variants', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });

    it('should handle flex classes', () => {
      expect(cn('flex', 'flex-row', 'flex-col')).toBe('flex flex-col');
    });

    it('should handle width classes', () => {
      expect(cn('w-10', 'w-20')).toBe('w-20');
    });

    it('should handle height classes', () => {
      expect(cn('h-10', 'h-20')).toBe('h-20');
    });

    it('should handle rounded classes', () => {
      expect(cn('rounded', 'rounded-lg')).toBe('rounded-lg');
    });

    it('should handle border classes', () => {
      expect(cn('border', 'border-2')).toBe('border-2');
    });

    it('should handle font weight classes', () => {
      expect(cn('font-normal', 'font-bold')).toBe('font-bold');
    });
  });

  describe('complex scenarios', () => {
    it('should handle component base styles with overrides', () => {
      const baseStyles = 'px-4 py-2 bg-blue-500 text-white rounded';
      const overrides = 'bg-red-500 px-6';
      expect(cn(baseStyles, overrides)).toBe('py-2 text-white rounded bg-red-500 px-6');
    });

    it('should handle button variants', () => {
      const base = 'inline-flex items-center justify-center rounded-md';
      const primary = 'bg-blue-500 text-white hover:bg-blue-600';
      const disabled = 'opacity-50 cursor-not-allowed';

      expect(cn(base, primary, disabled)).toContain('bg-blue-500');
      expect(cn(base, primary, disabled)).toContain('opacity-50');
    });

    it('should handle input styles', () => {
      const base = 'w-full px-3 py-2 border rounded-md';
      const error = 'border-red-500 focus:ring-red-500';
      const normal = 'border-gray-300 focus:ring-blue-500';

      // Error state should override normal border
      expect(cn(base, normal, error)).toContain('border-red-500');
    });

    it('should handle RTL-specific classes', () => {
      const ltr = 'ml-2 text-left';
      const rtl = 'mr-2 text-right';

      // RTL classes should override LTR
      expect(cn(ltr, rtl)).toContain('mr-2');
      expect(cn(ltr, rtl)).toContain('text-right');
    });
  });

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should handle single argument', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('should handle deeply nested arrays', () => {
      expect(cn([['foo'], [['bar']]])).toBe('foo bar');
    });

    it('should handle whitespace in class names', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar');
    });
  });
});
