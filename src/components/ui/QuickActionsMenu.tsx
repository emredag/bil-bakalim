import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

export interface QuickActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface QuickActionsMenuProps {
  actions: QuickActionItem[];
  className?: string;
}

/**
 * QuickActionsMenu Component - Design System v2.0
 *
 * Dropdown menu for quick actions (⋮ icon menu)
 *
 * Features:
 * - Click outside to close
 * - Keyboard navigation (ESC to close)
 * - Animated open/close
 * - Destructive action styling
 * - Icon support
 */
export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ actions, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // ESC to close
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const handleActionClick = (action: QuickActionItem) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-2 rounded-lg
          text-neutral-400 hover:text-neutral-200
          hover:bg-neutral-700/50
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500
        "
        aria-label="Quick actions"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="
              absolute right-0 mt-2 w-48
              bg-neutral-800 border border-neutral-700
              rounded-xl shadow-xl
              py-2
              z-50
            "
            role="menu"
            aria-orientation="vertical"
          >
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                className={`
                  w-full px-4 py-2.5
                  flex items-center gap-3
                  text-left text-sm font-medium
                  transition-colors duration-150
                  ${
                    action.variant === 'destructive'
                      ? 'text-error-400 hover:bg-error-500/10'
                      : 'text-neutral-200 hover:bg-neutral-700/50'
                  }
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:bg-neutral-700/50
                `}
                role="menuitem"
              >
                {action.icon && (
                  <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                    {action.icon}
                  </span>
                )}
                <span>{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

QuickActionsMenu.displayName = 'QuickActionsMenu';
