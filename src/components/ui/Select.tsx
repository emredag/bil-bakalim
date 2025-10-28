/**
 * Select Component - Dropdown Selection
 * Task 31: Settings Screen
 *
 * Accessible dropdown for selecting from multiple options
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Select Dropdown Component
 *
 * Features:
 * - Keyboard accessible
 * - Touch-friendly
 * - Clear visual states
 * - Optional label and description
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  label,
  description,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
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

      {/* Description */}
      {description && (
        <p
          className={`
            text-sm md:text-base text-slate-400
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {description}
        </p>
      )}

      {/* Select Dropdown */}
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full appearance-none
            px-4 py-3 pr-10
            text-base md:text-lg
            bg-slate-700 text-slate-100
            border-2 border-slate-600
            rounded-lg
            cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-blue-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500'}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div
          className={`
            absolute right-3 top-1/2 -translate-y-1/2
            pointer-events-none
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

Select.displayName = 'Select';
