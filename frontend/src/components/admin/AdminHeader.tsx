/**
 * Admin Header Component
 * مكون رأس لوحة التحكم
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export interface AdminHeaderProps {
  onMenuToggle: () => void;
  unreadMessages?: number;
}

export function AdminHeader({ onMenuToggle, unreadMessages = 0 }: AdminHeaderProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    window.location.href = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
  };

  return (
    <header
      className={`
        fixed top-0 ${isRTL ? 'right-0 lg:right-72' : 'left-0 lg:left-72'}
        ${isRTL ? 'left-0' : 'right-0'}
        bg-card border-border z-30 flex h-16
        items-center justify-between border-b px-4 lg:px-6
      `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
          aria-label={isRTL ? 'فتح القائمة' : 'Open menu'}
        >
          <Menu className="size-6" />
        </button>

        {/* Search Bar */}
        <div className="bg-accent/50 hidden w-64 items-center gap-2 rounded-lg px-3 py-2 md:flex">
          <Search className="text-muted-foreground size-4" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث...' : 'Search...'}
            className="placeholder:text-muted-foreground w-full border-none bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={switchLanguage}
          className="hover:bg-accent rounded-lg p-2 transition-colors"
          aria-label={isRTL ? 'تبديل اللغة' : 'Switch language'}
        >
          <Globe className="size-5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="hover:bg-accent rounded-lg p-2 transition-colors"
          aria-label={isRTL ? 'تبديل الوضع الداكن' : 'Toggle dark mode'}
        >
          {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        {/* Notifications */}
        <Link
          href={`/${locale}/admin/messages`}
          className="hover:bg-accent relative rounded-lg p-2 transition-colors"
          aria-label={isRTL ? 'الإشعارات' : 'Notifications'}
        >
          <Bell className="size-5" />
          {unreadMessages > 0 && (
            <span className="bg-destructive absolute right-0 top-0 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">
              {unreadMessages > 99 ? '99+' : unreadMessages}
            </span>
          )}
        </Link>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="hover:bg-accent flex items-center gap-2 rounded-lg p-2 transition-colors"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
              <User className="size-5" />
            </div>
            <span className="hidden text-sm font-medium md:block">
              {user?.name || (isRTL ? 'المدير' : 'Admin')}
            </span>
            <ChevronDown
              className={`size-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
              <div
                className={`
                  absolute top-full ${isRTL ? 'left-0' : 'right-0'} bg-card border-border
                  z-50 mt-2 w-48 overflow-hidden rounded-lg border
                  py-1 shadow-lg
                `}
              >
                <Link
                  href={`/${locale}/admin/profile`}
                  className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="size-4" />
                  <span>{isRTL ? 'الملف الشخصي' : 'Profile'}</span>
                </Link>
                <Link
                  href={`/${locale}/admin/settings`}
                  className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="size-4" />
                  <span>{isRTL ? 'الإعدادات' : 'Settings'}</span>
                </Link>
                <hr className="border-border my-1" />
                <button
                  className="text-destructive hover:bg-accent flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors"
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await logout();
                  }}
                >
                  <LogOut className="size-4" />
                  <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
