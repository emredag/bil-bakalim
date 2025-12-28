import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T, index: number) => string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  // Bulk selection props
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
  // Row click handler
  onRowClick?: (row: T) => void;
  // Other props
  zebra?: boolean;
  stickyHeader?: boolean;
  responsive?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * DataTable Component - Design System v2.0
 *
 * Enhanced table with bulk selection support
 *
 * Features:
 * - Checkbox selection (single + select all)
 * - Sortable columns
 * - Zebra striping
 * - Sticky header
 * - Responsive design
 * - Empty state
 * - Animated rows
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onSort,
  sortKey,
  sortDirection,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onRowClick,
  zebra = true,
  stickyHeader = true,
  responsive = true,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const [localSelectedKeys, setLocalSelectedKeys] = useState<string[]>(selectedKeys);

  // Sync with prop changes
  useEffect(() => {
    setLocalSelectedKeys(selectedKeys);
  }, [selectedKeys]);

  const handleSort = (columnKey: string) => {
    if (!onSort) return;
    const newDirection = sortKey === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? data.map((row, index) => keyExtractor(row, index)) : [];
    setLocalSelectedKeys(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    const newSelected = checked
      ? [...localSelectedKeys, key]
      : localSelectedKeys.filter((k) => k !== key);
    setLocalSelectedKeys(newSelected);
    onSelectionChange?.(newSelected);
  };

  const allSelected = data.length > 0 && localSelectedKeys.length === data.length;
  const someSelected = localSelectedKeys.length > 0 && !allSelected;

  // Empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`
        overflow-x-auto overflow-y-visible scrollbar-dark
        ${responsive ? 'w-full' : ''}
        ${className}
      `}
    >
      <table className="w-full border-collapse">
        {/* Header */}
        <thead
          className={`
            bg-neutral-800 border-b-2 border-neutral-700
            ${stickyHeader ? 'sticky top-0 z-10' : ''}
          `}
        >
          <tr>
            {/* Select All Checkbox */}
            {selectable && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="
                    w-5 h-5 rounded
                    bg-neutral-900 border-2 border-neutral-600
                    text-primary-500
                    focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
                    cursor-pointer
                    transition-colors duration-150
                  "
                  aria-label="Select all rows"
                />
              </th>
            )}

            {/* Column Headers */}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left
                  text-sm md:text-base font-semibold text-neutral-50
                  ${column.width ? column.width : ''}
                  ${column.sortable ? 'cursor-pointer hover:bg-neutral-700 transition-colors' : ''}
                `}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  <span>{column.header}</span>

                  {/* Sort indicator */}
                  {column.sortable && (
                    <span className="text-neutral-500">
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
          {data.map((row, index) => {
            const rowKey = keyExtractor(row, index);
            const isSelected = localSelectedKeys.includes(rowKey);

            return (
              <motion.tr
                key={rowKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-neutral-700
                  hover:bg-neutral-800/50 transition-colors
                  ${zebra && index % 2 === 1 ? 'bg-neutral-800/30' : ''}
                  ${isSelected ? 'bg-primary-500/10' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {/* Row Checkbox */}
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                      className="
                        w-5 h-5 rounded
                        bg-neutral-900 border-2 border-neutral-600
                        text-primary-500
                        focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
                        cursor-pointer
                        transition-colors duration-150
                      "
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}

                {/* Row Data */}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm md:text-base text-neutral-300"
                    onClick={column.key === 'actions' ? (e) => e.stopPropagation() : undefined}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

DataTable.displayName = 'DataTable';
