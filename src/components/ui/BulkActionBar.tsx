import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: BulkAction[];
  className?: string;
}

/**
 * BulkActionBar Component - Design System v2.0
 *
 * Floating action bar that appears when items are selected in a table
 *
 * Features:
 * - Animated slide-up entrance
 * - Selected count display
 * - Clear selection button
 * - Multiple action buttons
 * - Sticky positioning at bottom
 */
export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClear,
  actions,
  className = '',
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        bg-neutral-800 border-2 border-primary-500/50
        rounded-2xl shadow-2xl
        px-6 py-4
        flex items-center gap-4
        z-50
        ${className}
      `}
    >
      {/* Selected Count */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClear}
          className="
            p-1 rounded-lg
            text-neutral-400 hover:text-neutral-200
            hover:bg-neutral-700/50
            transition-colors duration-150
          "
          aria-label="Clear selection"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-neutral-200 font-semibold">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-neutral-600" />

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'secondary'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            icon={action.icon}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

BulkActionBar.displayName = 'BulkActionBar';
