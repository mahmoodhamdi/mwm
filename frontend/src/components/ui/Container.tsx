'use client';

/**
 * Container Component
 * مكون الحاوية
 */

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', centered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full px-4 sm:px-6 lg:px-8', sizes[size], centered && 'mx-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Container };
export default Container;
