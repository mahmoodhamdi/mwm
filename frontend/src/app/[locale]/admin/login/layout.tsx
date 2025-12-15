/**
 * Login Page Layout
 * تخطيط صفحة تسجيل الدخول
 */

import { AuthProvider } from '@/providers/AuthProvider';

export const metadata = {
  title: 'Login | MWM Admin',
  description: 'Login to MWM Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
