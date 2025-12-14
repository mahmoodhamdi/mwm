'use client';

/**
 * FAQAccordion Component
 * مكون الأسئلة الشائعة (الأكورديون)
 */

import { useState, forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { createSanitizedHtml } from '@/lib/sanitize';

export interface FAQItem {
  /** Question text */
  question: string;
  /** Answer text (supports HTML) */
  answer: string;
}

export interface FAQAccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of FAQ items */
  items: FAQItem[];
  /** Allow multiple items to be open */
  allowMultiple?: boolean;
  /** Default open item indexes */
  defaultOpen?: number[];
  /** Card variant */
  variant?: 'default' | 'bordered' | 'separated' | 'minimal';
}

const FAQAccordion = forwardRef<HTMLDivElement, FAQAccordionProps>(
  (
    { className, items, allowMultiple = false, defaultOpen = [], variant = 'default', ...props },
    ref
  ) => {
    const [openItems, setOpenItems] = useState<number[]>(defaultOpen);

    const toggleItem = (index: number) => {
      if (allowMultiple) {
        setOpenItems(prev =>
          prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
      } else {
        setOpenItems(prev => (prev.includes(index) ? [] : [index]));
      }
    };

    const isOpen = (index: number) => openItems.includes(index);

    // Default variant
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}
          {...props}
        >
          {items.map((item, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between text-start"
                aria-expanded={isOpen(index)}
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={cn(
                    'size-5 shrink-0 text-gray-500 transition-transform duration-200',
                    isOpen(index) && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-3 text-gray-600 dark:text-gray-300"
                      dangerouslySetInnerHTML={createSanitizedHtml(item.answer)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      );
    }

    // Bordered variant
    if (variant === 'bordered') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-xl border transition-colors',
                isOpen(index)
                  ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/10'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              )}
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between p-4 text-start"
                aria-expanded={isOpen(index)}
              >
                <span
                  className={cn(
                    'font-medium',
                    isOpen(index)
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={cn(
                    'size-5 shrink-0 transition-transform duration-200',
                    isOpen(index) ? 'text-primary-500 rotate-180' : 'text-gray-400'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="border-primary-200 dark:border-primary-800 border-t px-4 pb-4 pt-3 text-gray-600 dark:text-gray-300"
                      dangerouslySetInnerHTML={createSanitizedHtml(item.answer)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      );
    }

    // Separated variant (cards)
    if (variant === 'separated') {
      return (
        <div ref={ref} className={cn('space-y-4', className)} {...props}>
          {items.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between p-5 text-start"
                aria-expanded={isOpen(index)}
              >
                <span className="pe-4 text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </span>
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen(index)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700'
                  )}
                >
                  <ChevronDownIcon
                    className={cn(
                      'size-5 transition-transform duration-200',
                      isOpen(index) && 'rotate-180'
                    )}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="border-t border-gray-100 px-5 pb-5 pt-4 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={createSanitizedHtml(item.answer)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      );
    }

    // Minimal variant
    if (variant === 'minimal') {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {items.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-100 py-3 last:border-0 dark:border-gray-800"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between text-start"
                aria-expanded={isOpen(index)}
              >
                <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
                <span className="text-primary-500">{isOpen(index) ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                      dangerouslySetInnerHTML={createSanitizedHtml(item.answer)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      );
    }

    return null;
  }
);

FAQAccordion.displayName = 'FAQAccordion';

export { FAQAccordion };
export default FAQAccordion;
