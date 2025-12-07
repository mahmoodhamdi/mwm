'use client';

/**
 * Team Management Page
 * صفحة إدارة فريق العمل
 */

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Globe,
  UserCircle,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';

// Team member type definition
interface TeamMember {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  bioAr: string;
  bioEn: string;
  email: string;
  avatar: string;
  order: number;
  isActive: boolean;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for team members
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    nameAr: 'أحمد محمد',
    nameEn: 'Ahmed Mohammed',
    roleAr: 'المدير التنفيذي',
    roleEn: 'CEO & Founder',
    bioAr: 'مؤسس الشركة وخبير في تطوير البرمجيات',
    bioEn: 'Company founder and software development expert',
    email: 'ahmed@mwm.com',
    avatar: '/images/team/ahmed.jpg',
    order: 1,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmed',
      twitter: 'https://twitter.com/ahmed',
      github: 'https://github.com/ahmed',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    nameAr: 'سارة أحمد',
    nameEn: 'Sara Ahmed',
    roleAr: 'مديرة التصميم',
    roleEn: 'Design Director',
    bioAr: 'مصممة UI/UX محترفة مع خبرة 8 سنوات',
    bioEn: 'Professional UI/UX designer with 8 years experience',
    email: 'sara@mwm.com',
    avatar: '/images/team/sara.jpg',
    order: 2,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sara',
      website: 'https://saradesigns.com',
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    nameAr: 'محمد علي',
    nameEn: 'Mohammed Ali',
    roleAr: 'مطور أول',
    roleEn: 'Senior Developer',
    bioAr: 'مطور Full Stack متخصص في React و Node.js',
    bioEn: 'Full Stack developer specializing in React and Node.js',
    email: 'mali@mwm.com',
    avatar: '/images/team/mohammed.jpg',
    order: 3,
    isActive: true,
    socialLinks: {
      github: 'https://github.com/mali',
      linkedin: 'https://linkedin.com/in/mali',
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    nameAr: 'فاطمة خالد',
    nameEn: 'Fatima Khaled',
    roleAr: 'مديرة المشاريع',
    roleEn: 'Project Manager',
    bioAr: 'مديرة مشاريع معتمدة PMP مع خبرة في المشاريع التقنية',
    bioEn: 'PMP certified project manager with tech project experience',
    email: 'fatima@mwm.com',
    avatar: '/images/team/fatima.jpg',
    order: 4,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/fatima',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '5',
    nameAr: 'عمر حسن',
    nameEn: 'Omar Hassan',
    roleAr: 'مطور موبايل',
    roleEn: 'Mobile Developer',
    bioAr: 'مطور تطبيقات iOS و Android',
    bioEn: 'iOS and Android app developer',
    email: 'omar@mwm.com',
    avatar: '/images/team/omar.jpg',
    order: 5,
    isActive: false,
    socialLinks: {
      github: 'https://github.com/omar',
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-25'),
  },
];

export default function TeamPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  // Table columns
  const columns: Column<TeamMember>[] = [
    {
      id: 'order',
      headerAr: 'الترتيب',
      headerEn: 'Order',
      accessor: 'order',
      width: '80px',
      render: value => (
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted-foreground size-4 cursor-grab" />
          <span className="text-muted-foreground">{value as number}</span>
        </div>
      ),
    },
    {
      id: 'avatar',
      headerAr: 'الصورة',
      headerEn: 'Avatar',
      accessor: 'avatar',
      width: '80px',
      render: () => (
        <div className="from-primary/20 to-primary/5 flex size-12 items-center justify-center rounded-full bg-gradient-to-br">
          <UserCircle className="text-muted-foreground size-8" />
        </div>
      ),
    },
    {
      id: 'name',
      headerAr: 'الاسم',
      headerEn: 'Name',
      accessor: row => (isArabic ? row.nameAr : row.nameEn),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground text-sm">{isArabic ? row.roleAr : row.roleEn}</div>
        </div>
      ),
    },
    {
      id: 'email',
      headerAr: 'البريد الإلكتروني',
      headerEn: 'Email',
      accessor: 'email',
      sortable: true,
      render: value => (
        <a
          href={`mailto:${value}`}
          className="text-primary flex items-center gap-1 hover:underline"
        >
          <Mail className="size-4" />
          <span>{value as string}</span>
        </a>
      ),
    },
    {
      id: 'socialLinks',
      headerAr: 'التواصل',
      headerEn: 'Social',
      accessor: 'socialLinks',
      render: value => {
        const links = value as TeamMember['socialLinks'];
        return (
          <div className="flex items-center gap-2">
            {links.linkedin && (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Linkedin className="size-4 text-[#0077b5]" />
              </a>
            )}
            {links.twitter && (
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Twitter className="size-4 text-[#1da1f2]" />
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Github className="size-4" />
              </a>
            )}
            {links.website && (
              <a
                href={links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Globe className="size-4 text-green-600" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      id: 'isActive',
      headerAr: 'الحالة',
      headerEn: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: value => {
        const isActive = value as boolean;
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
              isActive
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
            }`}
          >
            {isActive ? (
              <>
                <Eye className="size-3" />
                {isArabic ? 'ظاهر' : 'Visible'}
              </>
            ) : (
              <>
                <EyeOff className="size-3" />
                {isArabic ? 'مخفي' : 'Hidden'}
              </>
            )}
          </span>
        );
      },
    },
  ];

  // Row actions
  const actions: DataTableAction<TeamMember>[] = [
    tableActions.view(member => {
      console.log('View member:', member.id);
    }),
    tableActions.edit(member => {
      console.log('Edit member:', member.id);
    }),
    {
      id: 'toggle-visibility',
      labelAr: 'تبديل الظهور',
      labelEn: 'Toggle Visibility',
      icon: <Eye className="size-4" />,
      onClick: member => {
        setTeamMembers(prev =>
          prev.map(m => (m.id === member.id ? { ...m, isActive: !m.isActive } : m))
        );
      },
    },
    {
      id: 'send-email',
      labelAr: 'إرسال بريد',
      labelEn: 'Send Email',
      icon: <Mail className="size-4" />,
      onClick: member => {
        window.location.href = `mailto:${member.email}`;
      },
    },
    {
      id: 'move-up',
      labelAr: 'تحريك لأعلى',
      labelEn: 'Move Up',
      icon: <GripVertical className="size-4" />,
      onClick: member => {
        const currentIndex = teamMembers.findIndex(m => m.id === member.id);
        if (currentIndex > 0) {
          const newMembers = [...teamMembers];
          const temp = newMembers[currentIndex].order;
          newMembers[currentIndex].order = newMembers[currentIndex - 1].order;
          newMembers[currentIndex - 1].order = temp;
          newMembers.sort((a, b) => a.order - b.order);
          setTeamMembers(newMembers);
        }
      },
    },
    tableActions.delete(member => {
      if (
        confirm(
          isArabic
            ? 'هل أنت متأكد من حذف هذا العضو؟'
            : 'Are you sure you want to delete this team member?'
        )
      ) {
        setTeamMembers(prev => prev.filter(m => m.id !== member.id));
      }
    }),
  ];

  // Bulk actions
  const bulkActions = [
    {
      id: 'delete',
      labelAr: 'حذف المحدد',
      labelEn: 'Delete Selected',
      icon: <Trash2 className="size-4" />,
      variant: 'destructive' as const,
      onClick: (selectedIds: string[]) => {
        if (
          confirm(
            isArabic
              ? `هل أنت متأكد من حذف ${selectedIds.length} عضو؟`
              : `Are you sure you want to delete ${selectedIds.length} team members?`
          )
        ) {
          setTeamMembers(prev => prev.filter(m => !selectedIds.includes(m.id)));
        }
      },
    },
    {
      id: 'show',
      labelAr: 'إظهار المحدد',
      labelEn: 'Show Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setTeamMembers(prev =>
          prev.map(m => (selectedIds.includes(m.id) ? { ...m, isActive: true } : m))
        );
      },
    },
    {
      id: 'hide',
      labelAr: 'إخفاء المحدد',
      labelEn: 'Hide Selected',
      icon: <EyeOff className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setTeamMembers(prev =>
          prev.map(m => (selectedIds.includes(m.id) ? { ...m, isActive: false } : m))
        );
      },
    },
  ];

  const visibleCount = teamMembers.filter(m => m.isActive).length;
  const hiddenCount = teamMembers.filter(m => !m.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'إدارة فريق العمل' : 'Team Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic ? 'إدارة وتنظيم أعضاء الفريق' : 'Manage and organize team members'}
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="size-5" />
          <span>{isArabic ? 'عضو جديد' : 'New Member'}</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{teamMembers.length}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'إجمالي الأعضاء' : 'Total Members'}
          </div>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {visibleCount}
          </div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'أعضاء ظاهرين' : 'Visible Members'}
          </div>
        </div>
        <div className="rounded-lg border border-gray-500/20 bg-gray-500/10 p-4">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{hiddenCount}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'أعضاء مخفيين' : 'Hidden Members'}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={teamMembers}
        columns={columns}
        keyField="id"
        actions={actions}
        searchable
        selectable
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
        }}
        bulkActions={bulkActions}
        emptyStateAr="لا يوجد أعضاء في الفريق"
        emptyStateEn="No team members found"
      />
    </div>
  );
}
