/**
 * Admin Sidebar Component
 * مكون الشريط الجانبي للوحة التحكم
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Mail,
  Menu as MenuIcon,
  Globe,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  href?: string;
  permission?: string;
  children?: SidebarItem[];
}

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    labelAr: 'لوحة التحكم',
    labelEn: 'Dashboard',
    icon: <LayoutDashboard className="size-5" />,
    href: '/admin',
  },
  {
    id: 'projects',
    labelAr: 'المشاريع',
    labelEn: 'Projects',
    icon: <FolderKanban className="size-5" />,
    href: '/admin/projects',
    permission: 'projects:read',
  },
  {
    id: 'services',
    labelAr: 'الخدمات',
    labelEn: 'Services',
    icon: <Briefcase className="size-5" />,
    href: '/admin/services',
    permission: 'services:read',
  },
  {
    id: 'team',
    labelAr: 'الفريق',
    labelEn: 'Team',
    icon: <Users className="size-5" />,
    href: '/admin/team',
    permission: 'team:read',
  },
  {
    id: 'messages',
    labelAr: 'الرسائل',
    labelEn: 'Messages',
    icon: <MessageSquare className="size-5" />,
    href: '/admin/messages',
    permission: 'messages:read',
  },
  {
    id: 'content',
    labelAr: 'المحتوى',
    labelEn: 'Content',
    icon: <FileText className="size-5" />,
    permission: 'content:read',
    children: [
      {
        id: 'site-content',
        labelAr: 'محتوى الموقع',
        labelEn: 'Site Content',
        icon: <Globe className="size-4" />,
        href: '/admin/content/site',
      },
      {
        id: 'translations',
        labelAr: 'الترجمات',
        labelEn: 'Translations',
        icon: <Globe className="size-4" />,
        href: '/admin/content/translations',
      },
      {
        id: 'menus',
        labelAr: 'القوائم',
        labelEn: 'Menus',
        icon: <MenuIcon className="size-4" />,
        href: '/admin/content/menus',
      },
    ],
  },
  {
    id: 'newsletter',
    labelAr: 'النشرة البريدية',
    labelEn: 'Newsletter',
    icon: <Mail className="size-5" />,
    href: '/admin/newsletter',
    permission: 'newsletter:read',
  },
  {
    id: 'users',
    labelAr: 'المستخدمين',
    labelEn: 'Users',
    icon: <Users className="size-5" />,
    href: '/admin/users',
    permission: 'users:read',
  },
  {
    id: 'settings',
    labelAr: 'الإعدادات',
    labelEn: 'Settings',
    icon: <Settings className="size-5" />,
    href: '/admin/settings',
    permission: 'settings:read',
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === 'ar';
  const [expandedItems, setExpandedItems] = useState<string[]>(['content']);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isActive = (href: string) => {
    const adminPath = `/${locale}/admin`;
    const fullHref = href === '/admin' ? adminPath : `/${locale}${href}`;
    return pathname === fullHref || (href !== '/admin' && pathname.startsWith(fullHref));
  };

  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = item.href ? isActive(item.href) : false;
    const label = isRTL ? item.labelAr : item.labelEn;

    const itemContent = (
      <div
        className={`
          flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
          ${depth > 0 ? (isRTL ? 'pr-12' : 'pl-12') : ''}
          ${
            active
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }
        `}
        onClick={hasChildren ? () => toggleExpanded(item.id) : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1 font-medium">{label}</span>
        {hasChildren && (
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
            )}
          </span>
        )}
      </div>
    );

    return (
      <li key={item.id}>
        {item.href && !hasChildren ? (
          <Link href={`/${locale}${item.href}`} onClick={() => onClose()}>
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}
        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children!.map(child => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bg-card border- z-50
          h-full w-72${isRTL ? 'l' : 'r'} border-border
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="border-border flex h-16 items-center justify-between border-b px-6">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2">
            <span className="text-primary text-2xl font-bold">MWM</span>
            <span className="text-muted-foreground text-xs">{isRTL ? 'لوحة التحكم' : 'Admin'}</span>
          </Link>
          <button
            onClick={onClose}
            className="hover:bg-accent rounded-lg p-2 lg:hidden"
            aria-label={isRTL ? 'إغلاق القائمة' : 'Close menu'}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">{sidebarItems.map(item => renderItem(item))}</ul>
        </nav>

        {/* Footer */}
        <div className="border-border border-t p-4">
          <Link
            href={`/${locale}`}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
          >
            <LogOut className="size-5" />
            <span className="font-medium">{isRTL ? 'العودة للموقع' : 'Back to Site'}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
