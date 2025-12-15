/**
 * Admin Dashboard Page
 * صفحة لوحة التحكم الرئيسية
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { FolderKanban, MessageSquare, Users, Mail, TrendingUp, Briefcase } from 'lucide-react';
import { StatsCard, DashboardCharts, RecentActivity } from '@/components/admin';
import type { ActivityItem } from '@/components/admin';
import {
  dashboardService,
  type DashboardStats,
  type RecentActivityResponse,
} from '@/services/admin/dashboard.service';

export default function AdminDashboard() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [statsData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(10),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(isRTL ? 'فشل في تحميل بيانات لوحة التحكم' : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isRTL]);

  // Transform API data to ActivityItem format
  const activityItems: ActivityItem[] = React.useMemo(() => {
    if (!activity) return [];

    const items: ActivityItem[] = [];

    // Add recent contacts
    activity.recentContacts?.forEach(contact => {
      items.push({
        id: contact._id,
        type: 'message',
        titleAr: contact.name,
        titleEn: contact.name,
        descriptionAr: contact.subject,
        descriptionEn: contact.subject,
        timestamp: new Date(contact.createdAt),
        href: `/${locale}/admin/messages/${contact._id}`,
      });
    });

    // Add recent subscribers
    activity.recentSubscribers?.forEach(subscriber => {
      items.push({
        id: subscriber._id,
        type: 'subscriber',
        titleAr: subscriber.email,
        titleEn: subscriber.email,
        descriptionAr: 'اشترك في النشرة البريدية',
        descriptionEn: 'Subscribed to newsletter',
        timestamp: new Date(subscriber.subscribedAt),
      });
    });

    // Add recent applications
    activity.recentApplications?.forEach(application => {
      items.push({
        id: application._id,
        type: 'project_update',
        titleAr: `${application.firstName} ${application.lastName}`,
        titleEn: `${application.firstName} ${application.lastName}`,
        descriptionAr: application.job?.title?.ar || 'طلب توظيف جديد',
        descriptionEn: application.job?.title?.en || 'New job application',
        timestamp: new Date(application.createdAt),
        href: `/${locale}/admin/careers`,
      });
    });

    // Add activity logs
    activity.recentActivity?.forEach(log => {
      items.push({
        id: log._id,
        type: log.action === 'login' ? 'user_login' : 'project_update',
        titleAr: log.resourceTitle || log.resource,
        titleEn: log.resourceTitle || log.resource,
        descriptionAr: `${log.action} - ${log.resource}`,
        descriptionEn: `${log.action} - ${log.resource}`,
        timestamp: new Date(log.createdAt),
      });
    });

    // Sort by timestamp (newest first) and take top 10
    return items
      .sort((a, b) => {
        const timeA =
          a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
        const timeB =
          b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return timeB - timeA;
      })
      .slice(0, 10);
  }, [activity, locale]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2"
          >
            {isRTL ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

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
          value={stats?.projects?.total ?? 0}
          icon={<FolderKanban className="size-6" />}
          trend={{
            value: stats?.projects?.published ?? 0,
            isPositive: true,
          }}
          variant="primary"
        />
        <StatsCard
          titleAr="الرسائل الجديدة"
          titleEn="New Messages"
          value={stats?.contacts?.unread ?? 0}
          icon={<MessageSquare className="size-6" />}
          trend={{
            value: stats?.contacts?.total ?? 0,
            isPositive: true,
          }}
          variant="warning"
        />
        <StatsCard
          titleAr="الخدمات النشطة"
          titleEn="Active Services"
          value={stats?.services?.active ?? 0}
          icon={<Briefcase className="size-6" />}
          trend={{
            value: stats?.services?.total ?? 0,
            isPositive: true,
          }}
          variant="success"
        />
        <StatsCard
          titleAr="مشتركي النشرة"
          titleEn="Newsletter Subscribers"
          value={stats?.subscribers?.active ?? 0}
          icon={<Mail className="size-6" />}
          trend={{
            value: stats?.subscribers?.total ?? 0,
            isPositive: true,
          }}
          variant="default"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          titleAr="أعضاء الفريق"
          titleEn="Team Members"
          value={stats?.team?.active ?? 0}
          icon={<Users className="size-6" />}
          variant="default"
        />
        <StatsCard
          titleAr="المقالات المنشورة"
          titleEn="Published Posts"
          value={stats?.posts?.published ?? 0}
          icon={<TrendingUp className="size-6" />}
          variant="default"
        />
        <StatsCard
          titleAr="الوظائف المتاحة"
          titleEn="Open Jobs"
          value={stats?.jobs?.open ?? 0}
          icon={<Briefcase className="size-6" />}
          variant="default"
        />
        <StatsCard
          titleAr="طلبات التوظيف"
          titleEn="Pending Applications"
          value={stats?.applications?.pending ?? 0}
          icon={<Users className="size-6" />}
          variant="default"
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Bottom Section: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity items={activityItems} viewAllHref={`/${locale}/admin/activity`} />
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
