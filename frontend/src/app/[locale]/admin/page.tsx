/**
 * Admin Dashboard Page
 * صفحة لوحة التحكم الرئيسية
 */

'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { FolderKanban, MessageSquare, Users, Mail, TrendingUp } from 'lucide-react';
import { StatsCard, DashboardCharts, RecentActivity } from '@/components/admin';
import type { ActivityItem } from '@/components/admin';

// Mock data - replace with actual API calls
const mockStats = {
  totalProjects: 24,
  newMessages: 12,
  todayVisitors: 1250,
  newsletterSubscribers: 380,
  trends: {
    projects: 8,
    messages: 15,
    visitors: 12,
    subscribers: 5,
  },
};

const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'message',
    titleAr: 'أحمد محمد',
    titleEn: 'Ahmed Mohammed',
    descriptionAr: 'استفسار عن تطوير تطبيق موبايل',
    descriptionEn: 'Inquiry about mobile app development',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    href: '/admin/messages/1',
  },
  {
    id: '2',
    type: 'subscriber',
    titleAr: 'user@example.com',
    titleEn: 'user@example.com',
    descriptionAr: 'اشترك في النشرة البريدية',
    descriptionEn: 'Subscribed to newsletter',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '3',
    type: 'project_update',
    titleAr: 'تحديث مشروع التجارة الإلكترونية',
    titleEn: 'E-commerce project updated',
    descriptionAr: 'تم تحديث معلومات المشروع',
    descriptionEn: 'Project information updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    href: '/admin/projects/1',
  },
  {
    id: '4',
    type: 'message',
    titleAr: 'سارة عبدالله',
    titleEn: 'Sara Abdullah',
    descriptionAr: 'طلب عرض سعر لتصميم UI/UX',
    descriptionEn: 'Quote request for UI/UX design',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    href: '/admin/messages/2',
  },
  {
    id: '5',
    type: 'user_login',
    titleAr: 'تسجيل دخول المدير',
    titleEn: 'Admin logged in',
    descriptionAr: 'تم تسجيل الدخول من جهاز جديد',
    descriptionEn: 'Logged in from a new device',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

export default function AdminDashboard() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</h1>
        <p className="text-muted-foreground">
          {isRTL ? 'مرحباً بك في لوحة تحكم MWM' : 'Welcome to MWM Admin Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          titleAr="إجمالي المشاريع"
          titleEn="Total Projects"
          value={mockStats.totalProjects}
          icon={<FolderKanban className="size-6" />}
          trend={{
            value: mockStats.trends.projects,
            isPositive: true,
          }}
          variant="primary"
        />
        <StatsCard
          titleAr="الرسائل الجديدة"
          titleEn="New Messages"
          value={mockStats.newMessages}
          icon={<MessageSquare className="size-6" />}
          trend={{
            value: mockStats.trends.messages,
            isPositive: true,
          }}
          variant="warning"
        />
        <StatsCard
          titleAr="زوار اليوم"
          titleEn="Today's Visitors"
          value={mockStats.todayVisitors}
          icon={<TrendingUp className="size-6" />}
          trend={{
            value: mockStats.trends.visitors,
            isPositive: true,
          }}
          variant="success"
        />
        <StatsCard
          titleAr="مشتركي النشرة"
          titleEn="Newsletter Subscribers"
          value={mockStats.newsletterSubscribers}
          icon={<Mail className="size-6" />}
          trend={{
            value: mockStats.trends.subscribers,
            isPositive: true,
          }}
          variant="default"
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Bottom Section: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity items={mockActivityItems} viewAllHref={`/${locale}/admin/activity`} />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border-border rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
          <div className="space-y-3">
            <QuickActionButton
              labelAr="إضافة مشروع جديد"
              labelEn="Add New Project"
              href={`/${locale}/admin/projects/new`}
              icon={<FolderKanban className="size-4" />}
            />
            <QuickActionButton
              labelAr="إضافة عضو فريق"
              labelEn="Add Team Member"
              href={`/${locale}/admin/team/new`}
              icon={<Users className="size-4" />}
            />
            <QuickActionButton
              labelAr="عرض الرسائل"
              labelEn="View Messages"
              href={`/${locale}/admin/messages`}
              icon={<MessageSquare className="size-4" />}
            />
            <QuickActionButton
              labelAr="إدارة النشرة البريدية"
              labelEn="Manage Newsletter"
              href={`/${locale}/admin/newsletter`}
              icon={<Mail className="size-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  labelAr,
  labelEn,
  href,
  icon,
}: {
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ReactNode;
}) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const label = isRTL ? labelAr : labelEn;

  return (
    <a
      href={href}
      className="bg-accent/50 hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
    >
      <span className="text-primary shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}
