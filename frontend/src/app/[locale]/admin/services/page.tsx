'use client';

/**
 * Services Management Page
 * صفحة إدارة الخدمات
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
  Code,
  Smartphone,
  Palette,
  Server,
  Shield,
  LineChart,
} from 'lucide-react';
import { DataTable, tableActions } from '@/components/admin';
import type { Column, DataTableAction } from '@/components/admin';

// Service type definition
interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  order: number;
  isActive: boolean;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
  server: Server,
  shield: Shield,
  'line-chart': LineChart,
};

// Mock data for services
const mockServices: Service[] = [
  {
    id: '1',
    titleAr: 'تطوير الويب',
    titleEn: 'Web Development',
    descriptionAr: 'تصميم وتطوير مواقع ويب احترافية وتطبيقات ويب متقدمة',
    descriptionEn: 'Design and develop professional websites and advanced web applications',
    icon: 'code',
    order: 1,
    isActive: true,
    projectCount: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    titleAr: 'تطوير تطبيقات الموبايل',
    titleEn: 'Mobile App Development',
    descriptionAr: 'تطوير تطبيقات iOS و Android عالية الجودة',
    descriptionEn: 'Develop high-quality iOS and Android applications',
    icon: 'smartphone',
    order: 2,
    isActive: true,
    projectCount: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    titleAr: 'تصميم UI/UX',
    titleEn: 'UI/UX Design',
    descriptionAr: 'تصميم واجهات مستخدم جذابة وتجربة مستخدم سلسة',
    descriptionEn: 'Design attractive user interfaces and smooth user experience',
    icon: 'palette',
    order: 3,
    isActive: true,
    projectCount: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    titleAr: 'استضافة وسيرفرات',
    titleEn: 'Hosting & Servers',
    descriptionAr: 'حلول استضافة متكاملة وإدارة السيرفرات',
    descriptionEn: 'Complete hosting solutions and server management',
    icon: 'server',
    order: 4,
    isActive: true,
    projectCount: 8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '5',
    titleAr: 'الأمن السيبراني',
    titleEn: 'Cybersecurity',
    descriptionAr: 'حماية وتأمين التطبيقات والمواقع',
    descriptionEn: 'Application and website security protection',
    icon: 'shield',
    order: 5,
    isActive: false,
    projectCount: 3,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-25'),
  },
  {
    id: '6',
    titleAr: 'تحليل البيانات',
    titleEn: 'Data Analytics',
    descriptionAr: 'تحليل البيانات وإعداد التقارير والإحصائيات',
    descriptionEn: 'Data analysis, reporting and statistics',
    icon: 'line-chart',
    order: 6,
    isActive: false,
    projectCount: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01'),
  },
];

export default function ServicesPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [services, setServices] = useState<Service[]>(mockServices);

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
        const IconComponent = iconMap[value as string] || Code;
        return (
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <IconComponent className="text-primary size-5" />
          </div>
        );
      },
    },
    {
      id: 'title',
      headerAr: 'الخدمة',
      headerEn: 'Service',
      accessor: row => (isArabic ? row.titleAr : row.titleEn),
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-muted-foreground line-clamp-1 text-sm">
            {isArabic ? row.descriptionAr : row.descriptionEn}
          </div>
        </div>
      ),
    },
    {
      id: 'projectCount',
      headerAr: 'المشاريع',
      headerEn: 'Projects',
      accessor: 'projectCount',
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
  const actions: DataTableAction<Service>[] = [
    tableActions.view(service => {
      console.log('View service:', service.id);
    }),
    tableActions.edit(service => {
      console.log('Edit service:', service.id);
    }),
    {
      id: 'toggle-status',
      labelAr: 'تبديل الحالة',
      labelEn: 'Toggle Status',
      icon: <Eye className="size-4" />,
      onClick: service => {
        setServices(prev =>
          prev.map(s => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
        );
      },
    },
    {
      id: 'move-up',
      labelAr: 'تحريك لأعلى',
      labelEn: 'Move Up',
      icon: <GripVertical className="size-4" />,
      onClick: service => {
        const currentIndex = services.findIndex(s => s.id === service.id);
        if (currentIndex > 0) {
          const newServices = [...services];
          const temp = newServices[currentIndex].order;
          newServices[currentIndex].order = newServices[currentIndex - 1].order;
          newServices[currentIndex - 1].order = temp;
          newServices.sort((a, b) => a.order - b.order);
          setServices(newServices);
        }
      },
    },
    tableActions.delete(service => {
      if (
        confirm(
          isArabic
            ? 'هل أنت متأكد من حذف هذه الخدمة؟'
            : 'Are you sure you want to delete this service?'
        )
      ) {
        setServices(prev => prev.filter(s => s.id !== service.id));
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
              ? `هل أنت متأكد من حذف ${selectedIds.length} خدمة؟`
              : `Are you sure you want to delete ${selectedIds.length} services?`
          )
        ) {
          setServices(prev => prev.filter(s => !selectedIds.includes(s.id)));
        }
      },
    },
    {
      id: 'activate',
      labelAr: 'تفعيل المحدد',
      labelEn: 'Activate Selected',
      icon: <Eye className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setServices(prev =>
          prev.map(s => (selectedIds.includes(s.id) ? { ...s, isActive: true } : s))
        );
      },
    },
    {
      id: 'deactivate',
      labelAr: 'تعطيل المحدد',
      labelEn: 'Deactivate Selected',
      icon: <EyeOff className="size-4" />,
      onClick: (selectedIds: string[]) => {
        setServices(prev =>
          prev.map(s => (selectedIds.includes(s.id) ? { ...s, isActive: false } : s))
        );
      },
    },
  ];

  const activeCount = services.filter(s => s.isActive).length;
  const inactiveCount = services.filter(s => !s.isActive).length;

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
        <Link
          href="/admin/services/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="size-5" />
          <span>{isArabic ? 'خدمة جديدة' : 'New Service'}</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold">{services.length}</div>
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

      {/* Info Box */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex items-start gap-3">
          <GripVertical className="mt-0.5 size-5 text-blue-600 dark:text-blue-400" />
          <div>
            <div className="font-medium text-blue-600 dark:text-blue-400">
              {isArabic ? 'نصيحة' : 'Tip'}
            </div>
            <div className="text-muted-foreground text-sm">
              {isArabic
                ? 'يمكنك إعادة ترتيب الخدمات بالسحب والإفلات أو باستخدام خيار "تحريك لأعلى" من قائمة الإجراءات'
                : 'You can reorder services by drag and drop or using "Move Up" option from the actions menu'}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={services}
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
        emptyStateAr="لا توجد خدمات"
        emptyStateEn="No services found"
      />
    </div>
  );
}
