/**
 * Admin Layout
 * تخطيط لوحة التحكم
 */

import { AdminLayout } from '@/components/admin';

export const metadata = {
  title: 'Admin Dashboard | MWM',
  description: 'MWM Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
