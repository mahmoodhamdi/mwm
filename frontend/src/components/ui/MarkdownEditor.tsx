'use client';

/**
 * Markdown Editor Component
 * مكون محرر Markdown مع دعم الوضع المظلم/الفاتح
 */

import { useState, useEffect } from 'react';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  minHeight?: number;
  maxHeight?: number;
  previewOnly?: boolean;
  /** @deprecated Use dir instead */
  language?: 'en' | 'ar';
  dir?: 'ltr' | 'rtl';
  disabled?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Write your content here...',
  className,
  editorClassName,
  minHeight = 300,
  maxHeight = 600,
  previewOnly = false,
  language: _language,
  dir = 'ltr',
  disabled = false,
}: MarkdownEditorProps) {
  // language prop is deprecated, use dir instead
  void _language;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle change
  const handleChange = (val: string | undefined) => {
    onChange(val || '');
  };

  // Custom toolbar commands
  const customCommands: ICommand[] = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.divider,
    commands.title,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.image,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
    commands.help,
  ];

  if (!mounted) {
    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div
          className="animate-pulse rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
          style={{ height: minHeight }}
        />
      </div>
    );
  }

  if (previewOnly) {
    return (
      <div className={cn('w-full', className)} data-color-mode={resolvedTheme}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div
          className={cn(
            'overflow-auto rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
            editorClassName
          )}
          style={{ minHeight, maxHeight }}
          dir={dir}
        >
          <MDEditor.Markdown source={value} style={{ padding: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} data-color-mode={resolvedTheme}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div
        className={cn(
          'overflow-hidden rounded-lg transition-colors duration-200',
          error
            ? '[&_.w-md-editor]:border-red-500 [&_.w-md-editor]:focus-within:ring-2 [&_.w-md-editor]:focus-within:ring-red-500/20'
            : '[&_.w-md-editor]:focus-within:ring-primary-500/20 [&_.w-md-editor]:border-gray-300 [&_.w-md-editor]:focus-within:ring-2 dark:[&_.w-md-editor]:border-gray-600',
          disabled && 'cursor-not-allowed opacity-60',
          editorClassName
        )}
        dir={dir}
      >
        <MDEditor
          value={value}
          onChange={handleChange}
          height={minHeight}
          preview="live"
          commands={customCommands}
          extraCommands={[
            commands.codeEdit,
            commands.codeLive,
            commands.codePreview,
            commands.divider,
            commands.fullscreen,
          ]}
          textareaProps={{
            placeholder,
            disabled,
            dir,
            style: {
              direction: dir,
              textAlign: dir === 'rtl' ? 'right' : 'left',
            },
          }}
          previewOptions={{
            style: {
              direction: dir,
              textAlign: dir === 'rtl' ? 'right' : 'left',
            },
          }}
        />
      </div>
      {(error || helperText) && (
        <p
          className={cn(
            'mt-1.5 text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default MarkdownEditor;
