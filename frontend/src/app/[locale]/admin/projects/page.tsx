'use client';

/**
 * Projects Management Page
 * صفحة إدارة المشاريع
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';
import {
  projectsAdminService,
  type Project,
  type ProjectsResponse,
} from '@/services/admin/projects.service';

export default function ProjectsPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Parameters<typeof projectsAdminService.getAllProjects>[0] = {
        page,
        limit: 10,
        sort: '-updatedAt',
      };

      if (statusFilter === 'published') params.isPublished = true;
      if (statusFilter === 'draft') params.isPublished = false;
      if (featuredFilter !== null) params.isFeatured = featuredFilter;

      const response: ProjectsResponse = await projectsAdminService.getAllProjects(params);
      setProjects(response.projects);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(isArabic ? 'فشل في تحميل المشاريع' : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, featuredFilter, isArabic]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Toggle featured status
  const toggleFeatured = async (project: Project) => {
    try {
      await projectsAdminService.toggleFeaturedStatus(project._id);
      fetchProjects();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      alert(isArabic ? 'فشل في تغيير حالة المميز' : 'Failed to toggle featured status');
    }
  };

  // Toggle publish status
  const togglePublish = async (project: Project) => {
    try {
      await projectsAdminService.togglePublishStatus(project._id);
      fetchProjects();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      alert(isArabic ? 'فشل في تغيير حالة النشر' : 'Failed to toggle publish status');
    }
  };

  // Delete project
  const deleteProject = async (project: Project) => {
    if (
      !confirm(
        isArabic
          ? 'هل أنت متأكد من حذف هذا المشروع؟'
          : 'Are you sure you want to delete this project?'
      )
    ) {
      return;
    }

    try {
      await projectsAdminService.deleteProject(project._id);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert(isArabic ? 'فشل في حذف المشروع' : 'Failed to delete project');
    }
  };

  // Bulk delete
  const bulkDelete = async (selectedIds: string[]) => {
    if (
      !confirm(
        isArabic
          ? `هل أنت متأكد من حذف ${selectedIds.length} مشروع؟`
          : `Are you sure you want to delete ${selectedIds.length} projects?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => projectsAdminService.deleteProject(id)));
      fetchProjects();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      alert(isArabic ? 'فشل في حذف المشاريع' : 'Failed to delete projects');
    }
  };

  // Bulk publish
  const bulkPublish = async (selectedIds: string[], publish: boolean) => {
    try {
      await Promise.all(
        selectedIds.map(id => projectsAdminService.updateProject(id, { isPublished: publish }))
      );
      fetchProjects();
    } catch (err) {
      console.error('Failed to bulk update:', err);
      alert(isArabic ? 'فشل في تحديث المشاريع' : 'Failed to update projects');
    }
  };

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
            <img
              src={value as string}
              alt=""
              className="size-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
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
      accessor: row => (isArabic ? row.title.ar : row.title.en),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground text-sm">{row.client?.name || '-'}</div>
        </div>
      ),
    },
    {
      id: 'category',
      headerAr: 'التصنيف',
      headerEn: 'Category',
      accessor: row => {
        const cat = row.category as { name?: { ar: string; en: string } } | string;
        if (typeof cat === 'object' && cat?.name) {
          return isArabic ? cat.name.ar : cat.name.en;
        }
        return '-';
      },
      sortable: true,
    },
    {
      id: 'status',
      headerAr: 'الحالة',
      headerEn: 'Status',
      accessor: 'isPublished',
      sortable: true,
      render: value => {
        const isPublished = value as boolean;
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              isPublished
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
            }`}
          >
            {isPublished ? (isArabic ? 'منشور' : 'Published') : isArabic ? 'مسودة' : 'Draft'}
          </span>
        );
      },
    },
    {
      id: 'featured',
      headerAr: 'مميز',
      headerEn: 'Featured',
      accessor: 'isFeatured',
      align: 'center',
      render: value =>
        value ? (
          <Star className="mx-auto size-5 fill-yellow-500 text-yellow-500" />
        ) : (
          <StarOff className="text-muted-foreground mx-auto size-5" />
        ),
    },
    {
      id: 'views',
      headerAr: 'المشاهدات',
      headerEn: 'Views',
      accessor: 'views',
      sortable: true,
      align: 'center',
      render: value => (
        <span className="bg-muted inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-sm font-medium">
          {value as number}
        </span>
      ),
    },
    {
      id: 'updatedAt',
      headerAr: 'آخر تحديث',
      headerEn: 'Last Updated',
      accessor: 'updatedAt',
      sortable: true,
      render: value => {
        const date = new Date(value as string);
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
      window.open(`/${locale}/projects/${project.slug}`, '_blank');
    }),
    tableActions.edit(project => {
      window.location.href = `/${locale}/admin/projects/${project._id}/edit`;
    }),
    {
      id: 'toggle-featured',
      labelAr: 'تبديل المميز',
      labelEn: 'Toggle Featured',
      icon: <Star className="size-4" />,
      onClick: toggleFeatured,
    },
    {
      id: 'toggle-publish',
      labelAr: 'تبديل النشر',
      labelEn: 'Toggle Publish',
      icon: <Eye className="size-4" />,
      onClick: togglePublish,
    },
    {
      id: 'preview',
      labelAr: 'معاينة',
      labelEn: 'Preview',
      icon: <ExternalLink className="size-4" />,
      onClick: project => {
        window.open(`/${locale}/projects/${project.slug}`, '_blank');
      },
    },
    tableActions.delete(deleteProject),
  ];

  // Bulk actions
  const bulkActions = [
    {
      id: 'delete',
      labelAr: 'حذف المحدد',
      labelEn: 'Delete Selected',
      icon: <Trash2 className="size-4" />,
      variant: 'destructive' as const,
      onClick: bulkDelete,
    },
    {
      id: 'publish',
      labelAr: 'نشر المحدد',
      labelEn: 'Publish Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => bulkPublish(selectedIds, true),
    },
    {
      id: 'unpublish',
      labelAr: 'إلغاء نشر المحدد',
      labelEn: 'Unpublish Selected',
      icon: <Archive className="size-4" />,
      onClick: (selectedIds: string[]) => bulkPublish(selectedIds, false),
    },
  ];

  const publishedCount = projects.filter(p => p.isPublished).length;
  const draftCount = projects.filter(p => !p.isPublished).length;
  const featuredCount = projects.filter(p => p.isFeatured).length;

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2"
          >
            <RefreshCw className="size-4" />
            {isArabic ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-3 py-2"
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={`/${locale}/admin/projects/new`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
          >
            <Plus className="size-5" />
            <span>{isArabic ? 'مشروع جديد' : 'New Project'}</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setStatusFilter(null);
            setFeaturedFilter(null);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            statusFilter === null && featuredFilter === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isArabic ? 'الكل' : 'All'} ({total})
        </button>
        <button
          onClick={() => {
            setStatusFilter('published');
            setFeaturedFilter(null);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            statusFilter === 'published'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isArabic ? 'منشور' : 'Published'} ({publishedCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('draft');
            setFeaturedFilter(null);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            statusFilter === 'draft'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isArabic ? 'مسودة' : 'Draft'} ({draftCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter(null);
            setFeaturedFilter(true);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            featuredFilter === true
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Star className="mr-1 inline-block size-4" />
          {isArabic ? 'مميز' : 'Featured'} ({featuredCount})
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={projects}
        columns={columns}
        keyField="_id"
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

      {/* Pagination Info */}
      <div className="text-muted-foreground text-center text-sm">
        {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
      </div>
    </div>
  );
}
