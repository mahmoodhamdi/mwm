/**
 * Admin Layout
 * تخطيط لوحة التحكم
 */

import { AdminLayout } from '@/components/admin';
import { AuthProvider } from '@/providers/AuthProvider';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export const metadata = {
  title: 'Admin Dashboard | MWM',
  description: 'MWM Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthGuard>
        <AdminLayout>{children}</AdminLayout>
      </AdminAuthGuard>
    </AuthProvider>
  );
}
