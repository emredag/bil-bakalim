import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  zebra?: boolean;
  stickyHeader?: boolean;
  responsive?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Table Component - ui-ux-design.md
 *
 * TV Show Quality table for history and word lists.
 *
 * Features:
 * - Zebra striping (alternating row colors)
 * - Sticky header
 * - Responsive (stacks on mobile < md)
 * - Sort indicators
 * - Empty state
 * - Dark theme optimized
 */
export function Table<T>({
  data,
  columns,
  keyExtractor,
  onSort,
  sortKey,
  sortDirection,
  zebra = true,
  stickyHeader = true,
  responsive = true,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  // Empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`
        overflow-x-auto scrollbar-dark
        ${responsive ? 'w-full' : ''}
        ${className}
      `}
    >
      <table className="w-full border-collapse">
        {/* Header */}
        <thead
          className={`
            bg-slate-800 border-b-2 border-slate-700
            ${stickyHeader ? 'sticky top-0 z-10' : ''}
          `}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left
                  text-sm md:text-base font-semibold text-text-primary
                  ${column.width ? column.width : ''}
                  ${column.sortable ? 'cursor-pointer hover:bg-slate-700 transition-colors' : ''}
                `}
                onClick={
                  column.sortable ? () => handleSort(column.key) : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span>{column.header}</span>

                  {/* Sort indicator */}
                  {column.sortable && (
                    <span className="text-text-tertiary">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, index) => (
            <tr
              key={keyExtractor(row, index)}
              className={`
                border-b border-slate-700
                hover:bg-slate-800/50 transition-colors
                ${zebra && index % 2 === 1 ? 'bg-slate-800/30' : ''}
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm md:text-base text-text-secondary"
                >
                  {column.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = 'Table';

/**
 * ResponsiveTable - Mobile-optimized table that stacks on small screens
 */
export interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No data available',
  className = '',
}: ResponsiveTableProps<T>) {
  // Empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop view (md and up) */}
      <div className="hidden md:block">
        <Table
          data={data}
          columns={columns}
          keyExtractor={keyExtractor}
          emptyMessage={emptyMessage}
        />
      </div>

      {/* Mobile view (< md) - Stacked cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, index) => (
          <div
            key={keyExtractor(row, index)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700"
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between py-2">
                <span className="font-semibold text-text-primary text-sm">
                  {column.header}
                </span>
                <span className="text-text-secondary text-sm">
                  {column.accessor(row)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

ResponsiveTable.displayName = 'ResponsiveTable';
