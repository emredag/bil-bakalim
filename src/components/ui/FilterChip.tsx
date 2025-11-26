import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * FilterChip Component - Design System v2.0
 *
 * Removable chip for displaying active filters
 *
 * Features:
 * - Click X to remove
 * - Icon support
 * - Animated entrance/exit
 * - Hover states
 */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  onRemove,
  icon,
  className = '',
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center gap-2
        bg-primary-500/20 border border-primary-500/30
        text-primary-400
        rounded-full
        px-3 py-1.5
        text-sm font-medium
        group
        hover:bg-primary-500/30
        transition-colors duration-150
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <span className="w-4 h-4 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Label and Value */}
      <span className="flex items-center gap-1.5">
        <span className="text-primary-300">{label}:</span>
        <span className="font-semibold">{value}</span>
      </span>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="
          flex-shrink-0
          p-0.5 rounded-full
          text-primary-400
          hover:text-primary-300
          hover:bg-primary-500/30
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500
        "
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

FilterChip.displayName = 'FilterChip';

/**
 * FilterChipGroup - Container for multiple filter chips
 */
export interface FilterChipGroupProps {
  children: React.ReactNode;
  onClearAll?: () => void;
  className?: string;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
  children,
  onClearAll,
  className = '',
}) => {
  const hasChildren = React.Children.count(children) > 0;

  if (!hasChildren) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-neutral-400 font-medium">Aktif Filtreler:</span>
      {children}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="
            text-sm font-medium
            text-neutral-400 hover:text-neutral-200
            underline
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
          "
        >
          Tümünü temizle
        </button>
      )}
    </div>
  );
};

FilterChipGroup.displayName = 'FilterChipGroup';
