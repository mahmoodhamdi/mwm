/**
 * Admin Layout Component
 * مكون تخطيط لوحة التحكم
 */

'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export interface AdminLayoutProps {
  children: React.ReactNode;
  unreadMessages?: number;
}

export function AdminLayout({ children, unreadMessages = 0 }: AdminLayoutProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
      />

      {/* Header */}
      <AdminHeader onMenuToggle={handleSidebarToggle} unreadMessages={unreadMessages} />

      {/* Main Content */}
      <main
        className={`
          min-h-screen pt-16
          ${isRTL ? 'lg:mr-72' : 'lg:ml-72'}
          transition-all duration-300
        `}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
