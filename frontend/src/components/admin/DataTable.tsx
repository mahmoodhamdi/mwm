/**
 * DataTable Component
 * مكون جدول البيانات القابل للتخصيص
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';

export interface Column<T> {
  id: string;
  headerAr: string;
  headerEn: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  id: string;
  labelAr: string;
  labelEn: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
}

export interface PaginationConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: DataTableAction<T>[];
  keyField: keyof T;
  searchable?: boolean;
  searchPlaceholderAr?: string;
  searchPlaceholderEn?: string;
  searchFields?: (keyof T)[];
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onRowClick?: (row: T) => void;
  pagination?: boolean | PaginationConfig;
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  emptyMessageAr?: string;
  emptyMessageEn?: string;
  emptyStateAr?: string;
  emptyStateEn?: string;
  bulkActions?: Array<{
    id: string;
    labelAr: string;
    labelEn: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger' | 'destructive';
    onClick: (selectedIds: string[]) => void;
  }>;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  data,
  columns,
  actions,
  keyField,
  searchable = true,
  searchPlaceholderAr = 'بحث...',
  searchPlaceholderEn = 'Search...',
  searchFields,
  selectable = false,
  onSelectionChange,
  onRowClick,
  pagination = true,
  pageSize: propPageSize,
  pageSizeOptions: propPageSizeOptions,
  loading = false,
  emptyMessageAr = 'لا توجد بيانات',
  emptyMessageEn = 'No data available',
  emptyStateAr,
  emptyStateEn,
  bulkActions,
}: DataTableProps<T>) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Handle pagination config
  const isPaginationEnabled = pagination !== false;
  const paginationConfig = typeof pagination === 'object' ? pagination : {};
  const initialPageSize = paginationConfig.pageSize ?? propPageSize ?? 10;
  const pageSizeOptions = paginationConfig.pageSizeOptions ??
    propPageSizeOptions ?? [5, 10, 20, 50];

  // Use emptyState props if provided, fallback to emptyMessage
  const emptyTextAr = emptyStateAr ?? emptyMessageAr;
  const emptyTextEn = emptyStateEn ?? emptyMessageEn;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    const fields = searchFields || (columns.map(c => c.id) as (keyof T)[]);

    return data.filter(row => {
      return fields.some(field => {
        const value = row[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    const column = columns.find(c => c.id === sortColumn);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: unknown;
      let bValue: unknown;

      if (typeof column.accessor === 'function') {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else {
        aValue = a[column.accessor];
        bValue = b[column.accessor];
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!isPaginationEnabled) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, isPaginationEnabled]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const ids = paginatedData.map(row => String(row[keyField]));
      setSelectedIds(ids);
      onSelectionChange?.(ids);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const newSelection = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  // Sort handler
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="size-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="size-4" />
    ) : (
      <ChevronDown className="size-4" />
    );
  };

  // Get cell value
  const getCellValue = (row: T, column: Column<T>): React.ReactNode => {
    let value: unknown;

    if (typeof column.accessor === 'function') {
      value = column.accessor(row);
    } else {
      value = row[column.accessor];
    }

    if (column.render) {
      return column.render(value, row);
    }

    if (value == null) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  if (loading) {
    return (
      <div className="bg-card border-border rounded-xl border">
        <div className="animate-pulse p-4">
          <div className="bg-muted mb-4 h-10 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-muted h-12 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border rounded-xl border">
      {/* Header: Search and Bulk Actions */}
      {(searchable || (selectable && bulkActions && selectedIds.length > 0)) && (
        <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b p-4">
          {searchable && (
            <div className="bg-accent/50 flex w-full items-center gap-2 rounded-lg px-3 py-2 sm:w-auto sm:min-w-[300px]">
              <Search className="text-muted-foreground size-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={isRTL ? searchPlaceholderAr : searchPlaceholderEn}
                className="placeholder:text-muted-foreground w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          )}

          {selectable && bulkActions && selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {selectedIds.length} {isRTL ? 'عنصر محدد' : 'selected'}
              </span>
              {bulkActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => action.onClick(selectedIds)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    action.variant === 'danger'
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {action.icon}
                  <span>{isRTL ? action.labelAr : action.labelEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 && selectedIds.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                    className="size-4 rounded"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.id}
                  className={`text-muted-foreground p-4 text-sm font-medium ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-end'
                        : 'text-start'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.id)}
                      className="hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <span>{isRTL ? column.headerAr : column.headerEn}</span>
                      {renderSortIcon(column.id)}
                    </button>
                  ) : (
                    <span>{isRTL ? column.headerAr : column.headerEn}</span>
                  )}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="text-muted-foreground w-20 p-4 text-sm font-medium">
                  {isRTL ? 'الإجراءات' : 'Actions'}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="text-muted-foreground p-8 text-center"
                >
                  {isRTL ? emptyTextAr : emptyTextEn}
                </td>
              </tr>
            ) : (
              paginatedData.map(row => {
                const rowId = String(row[keyField]);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    className={`border-border hover:bg-accent/50 border-b transition-colors ${
                      isSelected ? 'bg-primary/5' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="size-4 rounded"
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.id}
                        className={`p-4 text-sm ${
                          column.align === 'center'
                            ? 'text-center'
                            : column.align === 'right'
                              ? 'text-end'
                              : 'text-start'
                        }`}
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenActionMenu(openActionMenu === rowId ? null : rowId)
                            }
                            className="hover:bg-accent rounded-lg p-2 transition-colors"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                          {openActionMenu === rowId && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenActionMenu(null)}
                              />
                              <div
                                className={`bg-card border-border absolute ${isRTL ? 'left-0' : 'right-0'} top-full z-50 mt-1 min-w-[150px] rounded-lg border py-1 shadow-lg`}
                              >
                                {actions
                                  .filter(action => !action.hidden?.(row))
                                  .map(action => (
                                    <button
                                      key={action.id}
                                      onClick={() => {
                                        action.onClick(row);
                                        setOpenActionMenu(null);
                                      }}
                                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                        action.variant === 'danger'
                                          ? 'text-destructive hover:bg-destructive/10'
                                          : 'hover:bg-accent'
                                      }`}
                                    >
                                      {action.icon}
                                      <span>{isRTL ? action.labelAr : action.labelEn}</span>
                                    </button>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {isPaginationEnabled && totalPages > 0 && (
        <div className="border-border flex flex-wrap items-center justify-between gap-4 border-t p-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{isRTL ? 'عرض' : 'Show'}</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-accent border-border rounded-lg border px-2 py-1 text-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground text-sm">
              {isRTL ? `من ${sortedData.length} عنصر` : `of ${sortedData.length} items`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="hover:bg-accent rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className={`size-4 ${isRTL ? '' : 'rotate-180'}`} />
              <ChevronLeft className={`-ml-2 size-4 ${isRTL ? '' : 'rotate-180'}`} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="hover:bg-accent rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className={`size-4 ${isRTL ? '' : 'rotate-180'}`} />
            </button>

            <span className="text-muted-foreground px-4 text-sm">
              {isRTL
                ? `صفحة ${currentPage} من ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="hover:bg-accent rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronRight className={`size-4 ${isRTL ? '' : 'rotate-180'}`} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="hover:bg-accent rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronRight className={`size-4 ${isRTL ? '' : 'rotate-180'}`} />
              <ChevronRight className={`-ml-2 size-4 ${isRTL ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-built action factory functions
export const tableActions = {
  view: <T,>(onClick: (row: T) => void): DataTableAction<T> => ({
    id: 'view',
    labelAr: 'عرض',
    labelEn: 'View',
    icon: <Eye className="size-4" />,
    onClick,
  }),
  edit: <T,>(onClick: (row: T) => void): DataTableAction<T> => ({
    id: 'edit',
    labelAr: 'تعديل',
    labelEn: 'Edit',
    icon: <Edit className="size-4" />,
    onClick,
  }),
  delete: <T,>(onClick: (row: T) => void): DataTableAction<T> => ({
    id: 'delete',
    labelAr: 'حذف',
    labelEn: 'Delete',
    icon: <Trash2 className="size-4" />,
    variant: 'danger' as const,
    onClick,
  }),
};

export default DataTable;
