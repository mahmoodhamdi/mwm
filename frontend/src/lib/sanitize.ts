/**
 * HTML Sanitization Utility
 * أداة تنظيف HTML
 *
 * Provides XSS protection by sanitizing HTML content
 * before rendering with dangerouslySetInnerHTML
 */

import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks
 * تنظيف محتوى HTML لمنع هجمات XSS
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return sanitizeHtmlLib(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'del',
      'ins',
      'a',
      'img',
      'blockquote',
      'pre',
      'code',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
      'figure',
      'figcaption',
      'sup',
      'sub',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    disallowedTagsMode: 'discard',
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: attribs.target || '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  });
}

/**
 * Create sanitized HTML props for React dangerouslySetInnerHTML
 * إنشاء خصائص HTML منظفة لـ dangerouslySetInnerHTML في React
 */
export function createSanitizedHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
}

export default sanitizeHtml;
