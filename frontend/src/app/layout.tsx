/**
 * Root Layout
 * التخطيط الجذري
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MWM - Integrated Software Solutions',
  description: 'A company specialized in software development and integrated digital solutions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
