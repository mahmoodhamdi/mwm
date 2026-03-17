/**
 * Root Layout
 * التخطيط الجذري
 *
 * Note: The [locale]/layout.tsx provides the full document shell (<html>, <body>).
 * This root layout only wraps children to avoid duplicate <html> tags.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MWM - Integrated Software Solutions',
  description: 'A company specialized in software development and integrated digital solutions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
