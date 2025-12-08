/**
 * DataTable Component Tests
 * اختبارات مكون جدول البيانات
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, tableActions } from '../DataTable';
import type { Column, DataTableAction } from '../DataTable';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

interface TestItem {
  id: string;
  name: string;
  email: string;
  status: string;
  count: number;
  [key: string]: unknown;
}

const mockData: TestItem[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', count: 10 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', count: 5 },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'active', count: 15 },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'pending', count: 3 },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', status: 'active', count: 20 },
];

const columns: Column<TestItem>[] = [
  { id: 'name', headerAr: 'الاسم', headerEn: 'Name', accessor: 'name', sortable: true },
  { id: 'email', headerAr: 'البريد', headerEn: 'Email', accessor: 'email' },
  { id: 'status', headerAr: 'الحالة', headerEn: 'Status', accessor: 'status', sortable: true },
  { id: 'count', headerAr: 'العدد', headerEn: 'Count', accessor: 'count', sortable: true },
];

describe('DataTable', () => {
  describe('Rendering', () => {
    it('should render table with data', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render column headers in English', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Count')).toBeInTheDocument();
    });

    it('should render empty state when no data', () => {
      render(<DataTable data={[]} columns={columns} keyField="id" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should render custom empty message', () => {
      render(
        <DataTable data={[]} columns={columns} keyField="id" emptyMessageEn="No items found" />
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      const { container } = render(
        <DataTable data={mockData} columns={columns} keyField="id" loading={true} />
      );

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('should render search input when searchable is true', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" searchable />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should not render search input when searchable is false', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" searchable={false} />);

      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('should filter data based on search query', async () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" searchable />);

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'john');

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('should render custom search placeholder', () => {
      render(
        <DataTable
          data={mockData}
          columns={columns}
          keyField="id"
          searchable
          searchPlaceholderEn="Find items..."
        />
      );

      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort data when clicking sortable column header', async () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination={false} />);

      const nameHeader = screen.getByText('Name');
      await userEvent.click(nameHeader);

      // After sorting ascending, Alice should be first
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Alice Brown')).toBeInTheDocument();
    });

    it('should toggle sort direction on second click', async () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination={false} />);

      const nameHeader = screen.getByText('Name');
      await userEvent.click(nameHeader); // First click - asc
      await userEvent.click(nameHeader); // Second click - desc

      // After sorting descending, John should be first
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('John Doe')).toBeInTheDocument();
    });

    it('should sort numbers correctly', async () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination={false} />);

      const countHeader = screen.getByText('Count');
      await userEvent.click(countHeader);

      // After sorting ascending by count, Alice (3) should be first
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Alice Brown')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should render checkboxes when selectable is true', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" selectable />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(mockData.length + 1); // +1 for select all
    });

    it('should not render checkboxes when selectable is false', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" selectable={false} />);

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should select row when clicking checkbox', async () => {
      const onSelectionChange = jest.fn();
      render(
        <DataTable
          data={mockData}
          columns={columns}
          keyField="id"
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[1]); // First row checkbox

      expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('should select all when clicking header checkbox', async () => {
      const onSelectionChange = jest.fn();
      render(
        <DataTable
          data={mockData.slice(0, 3)}
          columns={columns}
          keyField="id"
          selectable
          onSelectionChange={onSelectionChange}
          pagination={false}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[0]); // Header checkbox

      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });

  describe('Pagination', () => {
    it('should show pagination controls when pagination is true', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination pageSize={2} />);

      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('should not show pagination when pagination is false', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination={false} />);

      expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
    });

    it('should limit displayed rows to page size', () => {
      render(<DataTable data={mockData} columns={columns} keyField="id" pagination pageSize={2} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
    });

    it('should show page size selector', () => {
      render(
        <DataTable
          data={mockData}
          columns={columns}
          keyField="id"
          pagination
          pageSizeOptions={[5, 10, 20]}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render actions column when actions are provided', () => {
      const actions: DataTableAction<TestItem>[] = [
        tableActions.view(() => {}),
        tableActions.edit(() => {}),
      ];

      render(<DataTable data={mockData} columns={columns} keyField="id" actions={actions} />);

      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render action menu buttons for each row', () => {
      const viewFn = jest.fn();
      const actions: DataTableAction<TestItem>[] = [tableActions.view(viewFn)];

      render(<DataTable data={mockData} columns={columns} keyField="id" actions={actions} />);

      // Check that action buttons are rendered (one per row)
      const actionButtons = screen.getAllByRole('button');
      // Should have at least 5 action buttons (one per row) plus pagination buttons
      expect(actionButtons.length).toBeGreaterThanOrEqual(5);
    });

    it('should have correct action labels in factory functions', () => {
      const viewFn = jest.fn();
      const action = tableActions.view(viewFn);

      expect(action.labelEn).toBe('View');
      expect(action.labelAr).toBe('عرض');
    });
  });

  describe('Bulk Actions', () => {
    it('should show bulk actions when items are selected', async () => {
      const bulkActions = [
        {
          id: 'delete',
          labelAr: 'حذف',
          labelEn: 'Delete',
          onClick: jest.fn(),
        },
      ];

      render(
        <DataTable
          data={mockData}
          columns={columns}
          keyField="id"
          selectable
          bulkActions={bulkActions}
        />
      );

      // Select a row
      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[1]);

      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should call bulk action with selected ids', async () => {
      const deleteFn = jest.fn();
      const bulkActions = [
        {
          id: 'delete',
          labelAr: 'حذف',
          labelEn: 'Delete',
          onClick: deleteFn,
        },
      ];

      render(
        <DataTable
          data={mockData}
          columns={columns}
          keyField="id"
          selectable
          bulkActions={bulkActions}
        />
      );

      // Select rows
      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[1]);
      await userEvent.click(checkboxes[2]);

      // Click bulk delete
      const deleteButton = screen.getByText('Delete');
      await userEvent.click(deleteButton);

      expect(deleteFn).toHaveBeenCalledWith(['1', '2']);
    });
  });

  describe('Row Click', () => {
    it('should call onRowClick when row is clicked', async () => {
      const onRowClick = jest.fn();

      render(<DataTable data={mockData} columns={columns} keyField="id" onRowClick={onRowClick} />);

      const row = screen.getByText('John Doe').closest('tr');
      if (row) {
        await userEvent.click(row);
        expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
      }
    });
  });

  describe('Custom Render', () => {
    it('should use custom render function for column', () => {
      const customColumns: Column<TestItem>[] = [
        {
          id: 'name',
          headerAr: 'الاسم',
          headerEn: 'Name',
          accessor: 'name',
          render: value => <strong data-testid="custom-name">{value as string}</strong>,
        },
      ];

      render(<DataTable data={mockData} columns={customColumns} keyField="id" />);

      const customNames = screen.getAllByTestId('custom-name');
      expect(customNames.length).toBeGreaterThan(0);
      expect(customNames[0]).toHaveTextContent('John Doe');
    });
  });

  describe('tableActions factory', () => {
    it('should create view action with correct properties', () => {
      const onClick = jest.fn();
      const action = tableActions.view(onClick);

      expect(action.id).toBe('view');
      expect(action.labelEn).toBe('View');
      expect(action.labelAr).toBe('عرض');
      expect(action.onClick).toBe(onClick);
    });

    it('should create edit action with correct properties', () => {
      const onClick = jest.fn();
      const action = tableActions.edit(onClick);

      expect(action.id).toBe('edit');
      expect(action.labelEn).toBe('Edit');
      expect(action.labelAr).toBe('تعديل');
      expect(action.onClick).toBe(onClick);
    });

    it('should create delete action with danger variant', () => {
      const onClick = jest.fn();
      const action = tableActions.delete(onClick);

      expect(action.id).toBe('delete');
      expect(action.labelEn).toBe('Delete');
      expect(action.labelAr).toBe('حذف');
      expect(action.variant).toBe('danger');
      expect(action.onClick).toBe(onClick);
    });
  });
});
