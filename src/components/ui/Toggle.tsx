/**
 * Toggle Component - ON/OFF Switch
 * Task 31: Settings Screen
 *
 * Accessible toggle switch for boolean settings
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Toggle Switch Component
 *
 * Features:
 * - Smooth animation
 * - Keyboard accessible (Space/Enter)
 * - Touch-friendly (min 48x48px)
 * - Clear visual states
 * - Optional label and description
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Toggle Switch */}
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle'}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-12 w-20 shrink-0 cursor-pointer
          rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-slate-900
          ${checked ? 'bg-blue-600' : 'bg-slate-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}
        `}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <motion.span
          animate={{
            x: checked ? 36 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
          className={`
            pointer-events-none inline-block h-10 w-10
            transform rounded-full bg-white shadow-lg ring-0
            transition duration-200 ease-in-out
          `}
        />
      </button>

      {/* Label & Description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              className={`
                block text-base md:text-lg font-semibold text-slate-100
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={`
                mt-1 text-sm md:text-base text-slate-400
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

Toggle.displayName = 'Toggle';
