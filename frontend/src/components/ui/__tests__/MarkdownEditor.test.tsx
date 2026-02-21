/**
 * MarkdownEditor Component Tests
 * اختبارات مكون محرر Markdown
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownEditor } from '../MarkdownEditor';

// Mock MDEditor
jest.mock('@uiw/react-md-editor', () => {
  const MDEditor = ({ value, onChange, textareaProps, height }: any) => (
    <div data-testid="md-editor" data-height={height}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={textareaProps?.placeholder}
        disabled={textareaProps?.disabled}
        dir={textareaProps?.dir}
        data-testid="md-textarea"
      />
    </div>
  );

  MDEditor.Markdown = ({ source }: any) => <div data-testid="md-preview">{source}</div>;

  return {
    __esModule: true,
    default: MDEditor,
    commands: {
      bold: {},
      italic: {},
      strikethrough: {},
      hr: {},
      divider: {},
      title: {},
      link: {},
      quote: {},
      code: {},
      codeBlock: {},
      image: {},
      unorderedListCommand: {},
      orderedListCommand: {},
      checkedListCommand: {},
      help: {},
      codeEdit: {},
      codeLive: {},
      codePreview: {},
      fullscreen: {},
    },
  };
});

// Mock ThemeProvider
jest.mock('@/providers/ThemeProvider', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
  }),
}));

describe('MarkdownEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders editor with value', async () => {
    render(<MarkdownEditor value="# Hello World" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByTestId('md-editor')).toBeInTheDocument();
      expect(screen.getByDisplayValue('# Hello World')).toBeInTheDocument();
    });
  });

  it('renders with label', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} label="Content" />);

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByTestId('md-textarea')).toBeInTheDocument();
    });

    const textarea = screen.getByTestId('md-textarea');
    await user.type(textarea, 'New content');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays error message when provided', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} error="This field is required" />);

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('displays helper text when provided', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} helperText="Use markdown syntax" />);

    await waitFor(() => {
      expect(screen.getByText('Use markdown syntax')).toBeInTheDocument();
    });
  });

  it('displays placeholder', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} placeholder="Enter your content..." />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your content...')).toBeInTheDocument();
    });
  });

  it('applies custom height', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} minHeight={400} />);

    await waitFor(() => {
      const editor = screen.getByTestId('md-editor');
      expect(editor).toHaveAttribute('data-height', '400');
    });
  });

  it('renders in preview-only mode', async () => {
    render(<MarkdownEditor value="# Preview Content" onChange={mockOnChange} previewOnly />);

    await waitFor(() => {
      expect(screen.getByTestId('md-preview')).toBeInTheDocument();
      expect(screen.getByText('# Preview Content')).toBeInTheDocument();
    });
  });

  it('is disabled when disabled prop is true', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} disabled />);

    await waitFor(() => {
      const textarea = screen.getByTestId('md-textarea');
      expect(textarea).toBeDisabled();
    });
  });

  it('renders with RTL direction', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} dir="rtl" />);

    await waitFor(() => {
      const textarea = screen.getByTestId('md-textarea');
      expect(textarea).toHaveAttribute('dir', 'rtl');
    });
  });

  it('renders with LTR direction by default', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);

    await waitFor(() => {
      const textarea = screen.getByTestId('md-textarea');
      expect(textarea).toHaveAttribute('dir', 'ltr');
    });
  });

  it('shows loading skeleton before mounting', () => {
    // Mock mounted state to be false
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);

    render(<MarkdownEditor value="" onChange={mockOnChange} label="Editor" />);

    expect(screen.getByText('Editor')).toBeInTheDocument();
    // Skeleton should be visible
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('handles empty value onChange', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor value="Some content" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByTestId('md-textarea')).toBeInTheDocument();
    });

    const textarea = screen.getByTestId('md-textarea');
    await user.clear(textarea);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('uses dark theme when resolvedTheme is dark', async () => {
    const { useTheme } = require('@/providers/ThemeProvider');
    useTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(container.querySelector('[data-color-mode="dark"]')).toBeInTheDocument();
    });
  });

  it('applies custom className', async () => {
    const { container } = render(
      <MarkdownEditor value="" onChange={mockOnChange} className="custom-editor" />
    );

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('custom-editor');
    });
  });
});
