'use client';

/**
 * Team Management Page
 * صفحة إدارة فريق العمل
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
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
  Star,
  StarOff,
  RefreshCw,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';
import {
  teamAdminService,
  type TeamMember,
  type TeamResponse,
} from '@/services/admin/team.service';

export default function TeamPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: TeamResponse = await teamAdminService.getAllMembers({
        page,
        limit: 10,
        sort: 'order',
      });
      setTeamMembers(response.members);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
      setError(isArabic ? 'فشل في تحميل أعضاء الفريق' : 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [page, isArabic]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Toggle visibility
  const toggleVisibility = async (member: TeamMember) => {
    try {
      await teamAdminService.toggleActiveStatus(member._id);
      fetchTeamMembers();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
      alert(isArabic ? 'فشل في تغيير الحالة' : 'Failed to toggle visibility');
    }
  };

  // Toggle featured
  const toggleFeatured = async (member: TeamMember) => {
    try {
      await teamAdminService.toggleFeaturedStatus(member._id);
      fetchTeamMembers();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      alert(isArabic ? 'فشل في تغيير حالة المميز' : 'Failed to toggle featured');
    }
  };

  // Delete member
  const deleteMember = async (member: TeamMember) => {
    if (
      !confirm(
        isArabic
          ? 'هل أنت متأكد من حذف هذا العضو؟'
          : 'Are you sure you want to delete this team member?'
      )
    ) {
      return;
    }

    try {
      await teamAdminService.deleteMember(member._id);
      fetchTeamMembers();
    } catch (err) {
      console.error('Failed to delete member:', err);
      alert(isArabic ? 'فشل في حذف العضو' : 'Failed to delete member');
    }
  };

  // Bulk delete
  const bulkDelete = async (selectedIds: string[]) => {
    if (
      !confirm(
        isArabic
          ? `هل أنت متأكد من حذف ${selectedIds.length} عضو؟`
          : `Are you sure you want to delete ${selectedIds.length} team members?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => teamAdminService.deleteMember(id)));
      fetchTeamMembers();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      alert(isArabic ? 'فشل في حذف الأعضاء' : 'Failed to delete members');
    }
  };

  // Bulk update visibility
  const bulkUpdateVisibility = async (selectedIds: string[], isActive: boolean) => {
    try {
      await Promise.all(selectedIds.map(id => teamAdminService.updateMember(id, { isActive })));
      fetchTeamMembers();
    } catch (err) {
      console.error('Failed to bulk update:', err);
      alert(isArabic ? 'فشل في تحديث الأعضاء' : 'Failed to update members');
    }
  };

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
      render: value => (
        <div className="relative size-12 overflow-hidden rounded-full">
          {value ? (
            <Image
              src={value as string}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="from-primary/20 to-primary/5 flex size-full items-center justify-center bg-gradient-to-br"><svg class="text-muted-foreground size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
              }}
              unoptimized
            />
          ) : (
            <div className="from-primary/20 to-primary/5 flex size-full items-center justify-center bg-gradient-to-br">
              <UserCircle className="text-muted-foreground size-8" />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'name',
      headerAr: 'الاسم',
      headerEn: 'Name',
      accessor: row => (isArabic ? row.name.ar : row.name.en),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? row.position.ar : row.position.en}
          </div>
        </div>
      ),
    },
    {
      id: 'department',
      headerAr: 'القسم',
      headerEn: 'Department',
      accessor: row => {
        const dept = row.department as { name?: { ar: string; en: string } } | string;
        if (typeof dept === 'object' && dept?.name) {
          return isArabic ? dept.name.ar : dept.name.en;
        }
        return '-';
      },
      sortable: true,
    },
    {
      id: 'socialLinks',
      headerAr: 'التواصل',
      headerEn: 'Social',
      accessor: 'social',
      render: value => {
        const links = value as TeamMember['social'];
        if (!links) return <span className="text-muted-foreground">-</span>;
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
            {links.email && (
              <a
                href={`mailto:${links.email}`}
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Mail className="size-4 text-blue-600" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      id: 'isFeatured',
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
      window.open(`/${locale}/team/${member.slug}`, '_blank');
    }),
    tableActions.edit(member => {
      window.location.href = `/${locale}/admin/team/${member._id}/edit`;
    }),
    {
      id: 'toggle-visibility',
      labelAr: 'تبديل الظهور',
      labelEn: 'Toggle Visibility',
      icon: <Eye className="size-4" />,
      onClick: toggleVisibility,
    },
    {
      id: 'toggle-featured',
      labelAr: 'تبديل المميز',
      labelEn: 'Toggle Featured',
      icon: <Star className="size-4" />,
      onClick: toggleFeatured,
    },
    tableActions.delete(deleteMember),
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
      id: 'show',
      labelAr: 'إظهار المحدد',
      labelEn: 'Show Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => bulkUpdateVisibility(selectedIds, true),
    },
    {
      id: 'hide',
      labelAr: 'إخفاء المحدد',
      labelEn: 'Hide Selected',
      icon: <EyeOff className="size-4" />,
      onClick: (selectedIds: string[]) => bulkUpdateVisibility(selectedIds, false),
    },
  ];

  const visibleCount = teamMembers.filter(m => m.isActive).length;
  const hiddenCount = teamMembers.filter(m => !m.isActive).length;
  const featuredCount = teamMembers.filter(m => m.isFeatured).length;

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error && teamMembers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchTeamMembers}
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
            {isArabic ? 'إدارة فريق العمل' : 'Team Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic ? 'إدارة وتنظيم أعضاء الفريق' : 'Manage and organize team members'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTeamMembers}
            className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-3 py-2"
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={`/${locale}/admin/team/new`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
          >
            <Plus className="size-5" />
            <span>{isArabic ? 'عضو جديد' : 'New Member'}</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{total}</div>
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
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {featuredCount}
          </div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'أعضاء مميزين' : 'Featured Members'}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={teamMembers}
        columns={columns}
        keyField="_id"
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

      {/* Pagination Info */}
      <div className="text-muted-foreground text-center text-sm">
        {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
      </div>
    </div>
  );
}
