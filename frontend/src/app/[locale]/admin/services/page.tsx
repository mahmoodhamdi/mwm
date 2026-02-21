'use client';

/**
 * Services Management Page
 * صفحة إدارة الخدمات
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Code,
  Smartphone,
  Palette,
  Server,
  Shield,
  LineChart,
  RefreshCw,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';
import {
  servicesAdminService,
  type Service,
  type ServicesResponse,
  type UpdateServiceData,
} from '@/services/admin/services.service';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
  server: Server,
  shield: Shield,
  'line-chart': LineChart,
};

const ICON_OPTIONS = ['code', 'smartphone', 'palette', 'server', 'shield', 'line-chart'];

export default function ServicesPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState<{
    nameAr: string;
    nameEn: string;
    shortDescriptionAr: string;
    shortDescriptionEn: string;
    icon: string;
    isActive: boolean;
    isFeatured: boolean;
    order: number;
  }>({
    nameAr: '',
    nameEn: '',
    shortDescriptionAr: '',
    shortDescriptionEn: '',
    icon: 'code',
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ServicesResponse = await servicesAdminService.getAllServices({
        page,
        limit: 10,
        sort: 'order',
      });
      setServices(response.services);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(isArabic ? 'فشل في تحميل الخدمات' : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [page, isArabic]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Open edit modal pre-populated with service data
  const openEditModal = (service: Service) => {
    setEditingItem(service);
    setEditForm({
      nameAr: service.name.ar,
      nameEn: service.name.en,
      shortDescriptionAr: service.shortDescription.ar,
      shortDescriptionEn: service.shortDescription.en,
      icon: service.icon || 'code',
      isActive: service.isActive,
      isFeatured: service.isFeatured,
      order: service.order,
    });
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setEditSaving(true);
    try {
      const data: UpdateServiceData = {
        name: { ar: editForm.nameAr, en: editForm.nameEn },
        shortDescription: { ar: editForm.shortDescriptionAr, en: editForm.shortDescriptionEn },
        icon: editForm.icon,
        isActive: editForm.isActive,
        isFeatured: editForm.isFeatured,
        order: editForm.order,
      };
      await servicesAdminService.updateService(editingItem._id, data);
      toast.success(isArabic ? 'تم تحديث الخدمة بنجاح' : 'Service updated successfully');
      setShowEditModal(false);
      setEditingItem(null);
      fetchServices();
    } catch (err) {
      console.error('Failed to update service:', err);
      toast.error(isArabic ? 'فشل في تحديث الخدمة' : 'Failed to update service');
    } finally {
      setEditSaving(false);
    }
  };

  // Toggle service status
  const toggleStatus = async (service: Service) => {
    try {
      await servicesAdminService.updateService(service._id, {
        isActive: !service.isActive,
      });
      fetchServices();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error(isArabic ? 'فشل في تغيير الحالة' : 'Failed to toggle status');
    }
  };

  // Delete service
  const deleteService = async (service: Service) => {
    if (
      !confirm(
        isArabic
          ? 'هل أنت متأكد من حذف هذه الخدمة؟'
          : 'Are you sure you want to delete this service?'
      )
    ) {
      return;
    }

    try {
      await servicesAdminService.deleteService(service._id);
      fetchServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
      toast.error(isArabic ? 'فشل في حذف الخدمة' : 'Failed to delete service');
    }
  };

  // Bulk delete
  const bulkDelete = async (selectedIds: string[]) => {
    if (
      !confirm(
        isArabic
          ? `هل أنت متأكد من حذف ${selectedIds.length} خدمة؟`
          : `Are you sure you want to delete ${selectedIds.length} services?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => servicesAdminService.deleteService(id)));
      fetchServices();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      toast.error(isArabic ? 'فشل في حذف الخدمات' : 'Failed to delete services');
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (selectedIds: string[], isActive: boolean) => {
    try {
      await Promise.all(
        selectedIds.map(id => servicesAdminService.updateService(id, { isActive }))
      );
      fetchServices();
    } catch (err) {
      console.error('Failed to bulk update:', err);
      toast.error(isArabic ? 'فشل في تحديث الخدمات' : 'Failed to update services');
    }
  };

  // Table columns
  const columns: Column<Service>[] = [
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
      id: 'icon',
      headerAr: 'الأيقونة',
      headerEn: 'Icon',
      accessor: 'icon',
      width: '80px',
      render: value => {
        const IconComponent = iconMap[(value as string) || 'code'] || Code;
        return (
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <IconComponent className="text-primary size-5" />
          </div>
        );
      },
    },
    {
      id: 'name',
      headerAr: 'الخدمة',
      headerEn: 'Service',
      accessor: row => (isArabic ? row.name.ar : row.name.en),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground line-clamp-1 text-sm">
            {isArabic ? row.shortDescription.ar : row.shortDescription.en}
          </div>
        </div>
      ),
    },
    {
      id: 'viewCount',
      headerAr: 'المشاهدات',
      headerEn: 'Views',
      accessor: 'viewCount',
      sortable: true,
      align: 'center',
      render: value => (
        <span className="bg-muted inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-sm font-medium">
          {value as number}
        </span>
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
                {isArabic ? 'مفعّل' : 'Active'}
              </>
            ) : (
              <>
                <EyeOff className="size-3" />
                {isArabic ? 'معطّل' : 'Inactive'}
              </>
            )}
          </span>
        );
      },
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
  const actions: DataTableAction<Service>[] = [
    tableActions.view(service => {
      window.open(`/${locale}/services/${service.slug}`, '_blank');
    }),
    tableActions.edit(service => {
      openEditModal(service);
    }),
    {
      id: 'toggle-status',
      labelAr: 'تبديل الحالة',
      labelEn: 'Toggle Status',
      icon: <Eye className="size-4" />,
      onClick: toggleStatus,
    },
    tableActions.delete(deleteService),
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
      id: 'activate',
      labelAr: 'تفعيل المحدد',
      labelEn: 'Activate Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => bulkUpdateStatus(selectedIds, true),
    },
    {
      id: 'deactivate',
      labelAr: 'تعطيل المحدد',
      labelEn: 'Deactivate Selected',
      icon: <EyeOff className="size-4" />,
      onClick: (selectedIds: string[]) => bulkUpdateStatus(selectedIds, false),
    },
  ];

  const activeCount = services.filter(s => s.isActive).length;
  const inactiveCount = services.filter(s => !s.isActive).length;

  if (loading && services.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchServices}
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
            {isArabic ? 'إدارة الخدمات' : 'Services Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic ? 'إدارة وتنظيم الخدمات المقدمة' : 'Manage and organize offered services'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchServices}
            className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-3 py-2"
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setEditForm({
                nameAr: '',
                nameEn: '',
                shortDescriptionAr: '',
                shortDescriptionEn: '',
                icon: 'code',
                isActive: true,
                isFeatured: false,
                order: services.length + 1,
              });
              setShowEditModal(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
          >
            <Plus className="size-5" />
            <span>{isArabic ? 'خدمة جديدة' : 'New Service'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'إجمالي الخدمات' : 'Total Services'}
          </div>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'خدمات مفعّلة' : 'Active Services'}
          </div>
        </div>
        <div className="rounded-lg border border-gray-500/20 bg-gray-500/10 p-4">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{inactiveCount}</div>
          <div className="text-muted-foreground text-sm">
            {isArabic ? 'خدمات معطّلة' : 'Inactive Services'}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={services}
        columns={columns}
        keyField="_id"
        actions={actions}
        searchable
        selectable
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          onPageChange: (newPage: number) => setPage(newPage),
        }}
        bulkActions={bulkActions}
        emptyStateAr="لا توجد خدمات"
        emptyStateEn="No services found"
      />

      {/* Pagination Info */}
      <div className="text-muted-foreground text-center text-sm">
        {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
      </div>

      {/* Edit / Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-lg rounded-lg shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold">
                {editingItem
                  ? isArabic
                    ? 'تعديل الخدمة'
                    : 'Edit Service'
                  : isArabic
                    ? 'خدمة جديدة'
                    : 'New Service'}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="hover:bg-muted rounded-lg p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={editForm.nameAr}
                    onChange={e => setEditForm(f => ({ ...f, nameAr: e.target.value }))}
                    className="bg-background w-full rounded-lg border px-3 py-2"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={editForm.nameEn}
                    onChange={e => setEditForm(f => ({ ...f, nameEn: e.target.value }))}
                    className="bg-background w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الوصف المختصر (عربي)' : 'Short Description (Arabic)'}
                  </label>
                  <textarea
                    value={editForm.shortDescriptionAr}
                    onChange={e => setEditForm(f => ({ ...f, shortDescriptionAr: e.target.value }))}
                    className="bg-background w-full rounded-lg border px-3 py-2"
                    rows={3}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الوصف المختصر (إنجليزي)' : 'Short Description (English)'}
                  </label>
                  <textarea
                    value={editForm.shortDescriptionEn}
                    onChange={e => setEditForm(f => ({ ...f, shortDescriptionEn: e.target.value }))}
                    className="bg-background w-full rounded-lg border px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الأيقونة' : 'Icon'}
                  </label>
                  <select
                    value={editForm.icon}
                    onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))}
                    className="bg-background w-full rounded-lg border px-3 py-2"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    {isArabic ? 'الترتيب' : 'Order'}
                  </label>
                  <input
                    type="number"
                    value={editForm.order}
                    onChange={e =>
                      setEditForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))
                    }
                    className="bg-background w-full rounded-lg border px-3 py-2"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{isArabic ? 'مفعّل' : 'Active'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isFeatured}
                    onChange={e => setEditForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{isArabic ? 'مميز' : 'Featured'}</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="hover:bg-muted rounded-lg border px-4 py-2"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving || !editForm.nameAr || !editForm.nameEn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 disabled:opacity-50"
              >
                {editSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {isArabic ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
