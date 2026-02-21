/**
 * Skeleton Component Tests
 * اختبارات مكون الهيكل العظمي للتحميل
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  CardSkeleton,
  TableRowSkeleton,
  ListItemSkeleton,
  StatsCardSkeleton,
} from '../Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-gray-200');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders with text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('rounded');
  });

  it('renders with circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders with rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('bg-gray-200');
  });

  it('renders with rounded variant', () => {
    const { container } = render(<Skeleton variant="rounded" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies pulse animation by default', () => {
    const { container } = render(<Skeleton animation="pulse" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('applies wave animation when specified', () => {
    const { container } = render(<Skeleton animation="wave" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('animate-shimmer');
    expect(skeleton).toHaveClass('bg-gradient-to-r');
  });

  it('applies no animation when animation is none', () => {
    const { container } = render(<Skeleton animation="none" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).not.toHaveClass('animate-pulse');
    expect(skeleton).not.toHaveClass('animate-shimmer');
  });

  it('applies custom width as number', () => {
    const { container } = render(<Skeleton width={200} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ width: '200px' });
  });

  it('applies custom width as string', () => {
    const { container } = render(<Skeleton width="50%" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ width: '50%' });
  });

  it('applies custom height as number', () => {
    const { container } = render(<Skeleton height={100} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ height: '100px' });
  });

  it('applies custom height as string', () => {
    const { container } = render(<Skeleton height="10rem" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ height: '10rem' });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    const { container } = render(<Skeleton data-testid="test-skeleton" />);

    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
  });
});

describe('CardSkeleton', () => {
  it('renders card skeleton with all elements', () => {
    const { container } = render(<CardSkeleton />);

    expect(container.querySelector('.rounded-lg.border')).toBeInTheDocument();
    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(<CardSkeleton className="custom-card" />);

    expect(container.firstChild).toHaveClass('custom-card');
  });
});

describe('TableRowSkeleton', () => {
  it('renders table row with default 5 columns', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRowSkeleton />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(5);
  });

  it('renders table row with custom column count', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRowSkeleton columns={3} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('renders skeletons in each cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRowSkeleton columns={2} />
        </tbody>
      </table>
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBe(2);
  });
});

describe('ListItemSkeleton', () => {
  it('renders list item with avatar by default', () => {
    const { container } = render(<ListItemSkeleton />);

    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('renders list item without avatar when hasAvatar is false', () => {
    const { container } = render(<ListItemSkeleton hasAvatar={false} />);

    const avatar = container.querySelector('.rounded-full');
    expect(avatar).not.toBeInTheDocument();
  });

  it('renders text skeletons', () => {
    const { container } = render(<ListItemSkeleton />);

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(1); // Avatar + text lines
  });
});

describe('StatsCardSkeleton', () => {
  it('renders stats card skeleton', () => {
    const { container } = render(<StatsCardSkeleton />);

    expect(container.querySelector('.rounded-lg.border')).toBeInTheDocument();
  });

  it('renders multiple skeleton elements', () => {
    const { container } = render(<StatsCardSkeleton />);

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(2); // Icon, title, value, subtitle
  });
});
