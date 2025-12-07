'use client';

/**
 * Projects Management Page
 * صفحة إدارة المشاريع
 */

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Trash2,
  Star,
  StarOff,
  Archive,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';

// Project type definition
interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  clientAr: string;
  clientEn: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: '1',
    titleAr: 'تطبيق التجارة الإلكترونية',
    titleEn: 'E-commerce Application',
    categoryAr: 'تطوير تطبيقات',
    categoryEn: 'App Development',
    clientAr: 'شركة التقنية المتقدمة',
    clientEn: 'Advanced Tech Co.',
    status: 'published',
    featured: true,
    thumbnail: '/images/projects/ecommerce.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '2',
    titleAr: 'موقع الشركة',
    titleEn: 'Corporate Website',
    categoryAr: 'تطوير الويب',
    categoryEn: 'Web Development',
    clientAr: 'مجموعة الأعمال',
    clientEn: 'Business Group',
    status: 'published',
    featured: false,
    thumbnail: '/images/projects/corporate.jpg',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    titleAr: 'تصميم هوية بصرية',
    titleEn: 'Brand Identity Design',
    categoryAr: 'تصميم UI/UX',
    categoryEn: 'UI/UX Design',
    clientAr: 'ستارت أب',
    clientEn: 'Startup Inc.',
    status: 'draft',
    featured: false,
    thumbnail: '/images/projects/branding.jpg',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    titleAr: 'لوحة تحكم إدارية',
    titleEn: 'Admin Dashboard',
    categoryAr: 'تطوير الويب',
    categoryEn: 'Web Development',
    clientAr: 'شركة الحلول',
    clientEn: 'Solutions Co.',
    status: 'archived',
    featured: false,
    thumbnail: '/images/projects/dashboard.jpg',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    titleAr: 'تطبيق توصيل الطعام',
    titleEn: 'Food Delivery App',
    categoryAr: 'تطوير تطبيقات',
    categoryEn: 'App Development',
    clientAr: 'مطاعم الذواقة',
    clientEn: 'Gourmet Restaurants',
    status: 'published',
    featured: true,
    thumbnail: '/images/projects/food-delivery.jpg',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-01'),
  },
];

export default function ProjectsPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // Table columns
  const columns: Column<Project>[] = [
    {
      id: 'thumbnail',
      headerAr: 'الصورة',
      headerEn: 'Image',
      accessor: 'thumbnail',
      width: '80px',
      render: value => (
        <div className="bg-muted flex size-12 items-center justify-center overflow-hidden rounded-lg">
          {value ? (
            <div className="from-primary/20 to-primary/5 flex size-full items-center justify-center bg-gradient-to-br">
              <ImageIcon className="text-muted-foreground size-5" />
            </div>
          ) : (
            <ImageIcon className="text-muted-foreground size-5" />
          )}
        </div>
      ),
    },
    {
      id: 'title',
      headerAr: 'العنوان',
      headerEn: 'Title',
      accessor: row => (isArabic ? row.titleAr : row.titleEn),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? row.clientAr : row.clientEn}
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      headerAr: 'التصنيف',
      headerEn: 'Category',
      accessor: row => (isArabic ? row.categoryAr : row.categoryEn),
      sortable: true,
    },
    {
      id: 'status',
      headerAr: 'الحالة',
      headerEn: 'Status',
      accessor: 'status',
      sortable: true,
      render: value => {
        const statusStyles = {
          draft: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
          published: 'bg-green-500/10 text-green-600 dark:text-green-400',
          archived: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
        };
        const statusLabels = {
          draft: { ar: 'مسودة', en: 'Draft' },
          published: { ar: 'منشور', en: 'Published' },
          archived: { ar: 'مؤرشف', en: 'Archived' },
        };
        const status = value as keyof typeof statusStyles;
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {isArabic ? statusLabels[status].ar : statusLabels[status].en}
          </span>
        );
      },
    },
    {
      id: 'featured',
      headerAr: 'مميز',
      headerEn: 'Featured',
      accessor: 'featured',
      align: 'center',
      render: value =>
        value ? (
          <Star className="mx-auto size-5 fill-yellow-500 text-yellow-500" />
        ) : (
          <StarOff className="text-muted-foreground mx-auto size-5" />
        ),
    },
    {
      id: 'updatedAt',
      headerAr: 'آخر تحديث',
      headerEn: 'Last Updated',
      accessor: 'updatedAt',
      sortable: true,
      render: value => {
        const date = value as Date;
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
  ];

  // Row actions
  const actions: DataTableAction<Project>[] = [
    tableActions.view(project => {
      console.log('View project:', project.id);
      // Navigate to project view
    }),
    tableActions.edit(project => {
      console.log('Edit project:', project.id);
      // Navigate to project edit
    }),
    {
      id: 'toggle-featured',
      labelAr: 'تبديل المميز',
      labelEn: 'Toggle Featured',
      icon: <Star className="size-4" />,
      onClick: project => {
        setProjects(prev =>
          prev.map(p => (p.id === project.id ? { ...p, featured: !p.featured } : p))
        );
      },
    },
    {
      id: 'archive',
      labelAr: 'أرشفة',
      labelEn: 'Archive',
      icon: <Archive className="size-4" />,
      onClick: project => {
        setProjects(prev =>
          prev.map(p => (p.id === project.id ? { ...p, status: 'archived' as const } : p))
        );
      },
    },
    {
      id: 'preview',
      labelAr: 'معاينة',
      labelEn: 'Preview',
      icon: <ExternalLink className="size-4" />,
      onClick: project => {
        window.open(`/projects/${project.id}`, '_blank');
      },
    },
    tableActions.delete(project => {
      if (
        confirm(
          isArabic
            ? 'هل أنت متأكد من حذف هذا المشروع؟'
            : 'Are you sure you want to delete this project?'
        )
      ) {
        setProjects(prev => prev.filter(p => p.id !== project.id));
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
              ? `هل أنت متأكد من حذف ${selectedIds.length} مشروع؟`
              : `Are you sure you want to delete ${selectedIds.length} projects?`
          )
        ) {
          setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
        }
      },
    },
    {
      id: 'archive',
      labelAr: 'أرشفة المحدد',
      labelEn: 'Archive Selected',
      icon: <Archive className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setProjects(prev =>
          prev.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'archived' as const } : p))
        );
      },
    },
    {
      id: 'publish',
      labelAr: 'نشر المحدد',
      labelEn: 'Publish Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setProjects(prev =>
          prev.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'published' as const } : p))
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'إدارة المشاريع' : 'Projects Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? 'إدارة وتنظيم مشاريع معرض الأعمال'
              : 'Manage and organize portfolio projects'}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="size-5" />
          <span>{isArabic ? 'مشروع جديد' : 'New Project'}</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm font-medium">
          {isArabic ? 'الكل' : 'All'} ({projects.length})
        </button>
        <button className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 text-sm font-medium">
          {isArabic ? 'منشور' : 'Published'} (
          {projects.filter(p => p.status === 'published').length})
        </button>
        <button className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 text-sm font-medium">
          {isArabic ? 'مسودة' : 'Draft'} ({projects.filter(p => p.status === 'draft').length})
        </button>
        <button className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 text-sm font-medium">
          {isArabic ? 'مؤرشف' : 'Archived'} ({projects.filter(p => p.status === 'archived').length})
        </button>
        <button className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 text-sm font-medium">
          <Star className="mr-1 inline-block size-4" />
          {isArabic ? 'مميز' : 'Featured'} ({projects.filter(p => p.featured).length})
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={projects}
        columns={columns}
        keyField="id"
        actions={actions}
        searchable
        selectable
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        bulkActions={bulkActions}
        emptyStateAr="لا توجد مشاريع"
        emptyStateEn="No projects found"
      />
    </div>
  );
}
