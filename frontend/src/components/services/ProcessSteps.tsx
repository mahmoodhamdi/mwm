'use client';

/**
 * ProcessSteps Component
 * مكون خطوات العملية
 */

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  CogIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Icon mapping for process steps
const stepIcons: Record<string, React.ElementType> = {
  clipboard: ClipboardDocumentCheckIcon,
  chat: ChatBubbleLeftRightIcon,
  code: CodeBracketIcon,
  rocket: RocketLaunchIcon,
  cog: CogIcon,
  check: CheckCircleIcon,
};

export interface ProcessStep {
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Icon key */
  icon?: string;
}

export interface ProcessStepsProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of process steps */
  steps: ProcessStep[];
  /** Layout variant */
  variant?: 'horizontal' | 'vertical' | 'alternating' | 'timeline';
  /** Show step numbers */
  showNumbers?: boolean;
  /** Step number format */
  numberFormat?: 'number' | 'circle' | 'filled';
}

const ProcessSteps = forwardRef<HTMLDivElement, ProcessStepsProps>(
  (
    {
      className,
      steps,
      variant = 'horizontal',
      showNumbers = true,
      numberFormat = 'filled',
      ...props
    },
    ref
  ) => {
    const getIcon = (iconKey?: string) => {
      const IconComponent = stepIcons[iconKey || 'clipboard'] || ClipboardDocumentCheckIcon;
      return IconComponent;
    };

    // Horizontal variant
    if (variant === 'horizontal') {
      return (
        <div ref={ref} className={cn('flex flex-col gap-8 md:flex-row', className)} {...props}>
          {steps.map((step, index) => {
            const IconComponent = getIcon(step.icon);
            return (
              <div key={index} className="relative flex flex-1 flex-col items-center text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute start-1/2 top-8 hidden h-0.5 w-full bg-gray-200 md:block dark:bg-gray-700" />
                )}

                {/* Step number/icon */}
                <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 relative z-10 mb-4 flex size-16 items-center justify-center rounded-full">
                  {showNumbers && numberFormat === 'filled' ? (
                    <span className="text-xl font-bold">{index + 1}</span>
                  ) : (
                    <IconComponent className="size-7" />
                  )}
                </div>

                {/* Content */}
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            );
          })}
        </div>
      );
    }

    // Vertical variant
    if (variant === 'vertical') {
      return (
        <div ref={ref} className={cn('space-y-6', className)} {...props}>
          {steps.map((step, index) => {
            const IconComponent = getIcon(step.icon);
            return (
              <div key={index} className="flex gap-4">
                {/* Step number/icon */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      'flex size-12 items-center justify-center rounded-full',
                      'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    )}
                  >
                    {showNumbers && numberFormat !== 'number' ? (
                      <span className="font-bold">{index + 1}</span>
                    ) : (
                      <IconComponent className="size-6" />
                    )}
                  </div>
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-full w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  {showNumbers && numberFormat === 'number' && (
                    <span className="text-primary-500 text-sm font-medium">Step {index + 1}</span>
                  )}
                  <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Alternating variant
    if (variant === 'alternating') {
      return (
        <div ref={ref} className={cn('relative', className)} {...props}>
          {/* Center line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gray-200 md:block dark:bg-gray-700" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = getIcon(step.icon);
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={cn(
                    'flex flex-col md:flex-row',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  {/* Content */}
                  <div
                    className={cn(
                      'flex-1',
                      isEven ? 'md:pe-8 md:text-end' : 'md:ps-8 md:text-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800',
                        isEven ? 'md:ms-auto' : 'md:me-auto',
                        'max-w-md'
                      )}
                    >
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>

                  {/* Center icon */}
                  <div className="relative z-10 hidden md:flex">
                    <div className="bg-primary-500 flex size-12 items-center justify-center rounded-full text-white">
                      {showNumbers ? (
                        <span className="font-bold">{index + 1}</span>
                      ) : (
                        <IconComponent className="size-5" />
                      )}
                    </div>
                  </div>

                  {/* Empty space */}
                  <div className="hidden flex-1 md:block" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Timeline variant
    if (variant === 'timeline') {
      return (
        <div ref={ref} className={cn('relative ps-8', className)} {...props}>
          {/* Left line */}
          <div className="from-primary-500 via-primary-400 absolute start-3 top-0 h-full w-0.5 bg-gradient-to-b to-gray-200 dark:to-gray-700" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = getIcon(step.icon);
              return (
                <div key={index} className="relative">
                  {/* Dot */}
                  <div className="bg-primary-500 absolute -start-8 top-0 flex size-6 items-center justify-center rounded-full text-white ring-4 ring-white dark:ring-gray-900">
                    {showNumbers ? (
                      <span className="text-xs font-bold">{index + 1}</span>
                    ) : (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                      <IconComponent className="text-primary-500 size-5" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }
);

ProcessSteps.displayName = 'ProcessSteps';

export { ProcessSteps };
export default ProcessSteps;
