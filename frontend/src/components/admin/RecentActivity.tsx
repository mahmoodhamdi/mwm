/**
 * Recent Activity Component
 * مكون النشاط الأخير
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { MessageSquare, Mail, UserPlus, FileEdit, Eye, Clock, ChevronRight } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'message' | 'subscriber' | 'project_update' | 'project_view' | 'user_login';
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  timestamp: Date | string;
  href?: string;
  avatar?: string;
}

export interface RecentActivityProps {
  items: ActivityItem[];
  loading?: boolean;
  showViewAll?: boolean;
  viewAllHref?: string;
  maxItems?: number;
}

const activityIcons = {
  message: <MessageSquare className="size-4" />,
  subscriber: <Mail className="size-4" />,
  project_update: <FileEdit className="size-4" />,
  project_view: <Eye className="size-4" />,
  user_login: <UserPlus className="size-4" />,
};

const activityColors = {
  message: 'bg-blue-500/10 text-blue-600',
  subscriber: 'bg-green-500/10 text-green-600',
  project_update: 'bg-yellow-500/10 text-yellow-600',
  project_view: 'bg-purple-500/10 text-purple-600',
  user_login: 'bg-primary/10 text-primary',
};

function formatTimeAgo(date: Date | string, isRTL: boolean): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return isRTL ? 'الآن' : 'just now';
  }
  if (diffMins < 60) {
    return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  }
  return then.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function RecentActivity({
  items,
  loading = false,
  showViewAll = true,
  viewAllHref,
  maxItems = 5,
}: RecentActivityProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const displayItems = items.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-card border-border rounded-xl border p-6">
        <div className="bg-muted mb-4 h-6 w-32 animate-pulse rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex animate-pulse items-start gap-3">
              <div className="bg-muted size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-card border-border rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
        </h3>
        <div className="text-muted-foreground py-8 text-center">
          <Clock className="mx-auto mb-3 size-12 opacity-50" />
          <p>{isRTL ? 'لا يوجد نشاط حتى الآن' : 'No activity yet'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'النشاط الأخير' : 'Recent Activity'}</h3>
        {showViewAll && viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-primary flex items-center gap-1 text-sm hover:underline"
          >
            {isRTL ? 'عرض الكل' : 'View all'}
            <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {displayItems.map(item => {
          const title = isRTL ? item.titleAr : item.titleEn;
          const description = isRTL ? item.descriptionAr : item.descriptionEn;

          const content = (
            <div className="group flex items-start gap-3">
              <div
                className={`
                  flex size-10 shrink-0 items-center justify-center rounded-full
                  ${activityColors[item.type]}
                `}
              >
                {item.avatar ? (
                  <img src={item.avatar} alt="" className="size-full rounded-full object-cover" />
                ) : (
                  activityIcons[item.type]
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary line-clamp-1 text-sm font-medium transition-colors">
                  {title}
                </p>
                {description && (
                  <p className="text-muted-foreground line-clamp-1 text-sm">{description}</p>
                )}
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatTimeAgo(item.timestamp, isRTL)}
                </p>
              </div>
            </div>
          );

          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className="hover:bg-accent/50 -mx-2 block rounded-lg px-2 py-1 transition-colors"
            >
              {content}
            </Link>
          ) : (
            <div key={item.id} className="py-1">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Preset: Recent Messages
export interface RecentMessagesProps {
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: Date | string;
  }>;
  loading?: boolean;
}

export function RecentMessages({ messages, loading = false }: RecentMessagesProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const items: ActivityItem[] = messages.map(msg => ({
    id: msg.id,
    type: 'message',
    titleAr: msg.name,
    titleEn: msg.name,
    descriptionAr: msg.subject,
    descriptionEn: msg.subject,
    timestamp: msg.createdAt,
    href: `/${locale}/admin/messages/${msg.id}`,
  }));

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'آخر الرسائل' : 'Recent Messages'}</h3>
        <Link
          href={`/${locale}/admin/messages`}
          className="text-primary flex items-center gap-1 text-sm hover:underline"
        >
          {isRTL ? 'عرض الكل' : 'View all'}
          <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
      <RecentActivity items={items} loading={loading} showViewAll={false} />
    </div>
  );
}

// Preset: Recent Subscribers
export interface RecentSubscribersProps {
  subscribers: Array<{
    id: string;
    email: string;
    createdAt: Date | string;
  }>;
  loading?: boolean;
}

export function RecentSubscribers({ subscribers, loading = false }: RecentSubscribersProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const items: ActivityItem[] = subscribers.map(sub => ({
    id: sub.id,
    type: 'subscriber',
    titleAr: sub.email,
    titleEn: sub.email,
    descriptionAr: 'اشترك في النشرة البريدية',
    descriptionEn: 'Subscribed to newsletter',
    timestamp: sub.createdAt,
  }));

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isRTL ? 'آخر المشتركين' : 'Recent Subscribers'}</h3>
        <Link
          href={`/${locale}/admin/newsletter`}
          className="text-primary flex items-center gap-1 text-sm hover:underline"
        >
          {isRTL ? 'عرض الكل' : 'View all'}
          <ChevronRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
      <RecentActivity items={items} loading={loading} showViewAll={false} />
    </div>
  );
}

export default RecentActivity;
