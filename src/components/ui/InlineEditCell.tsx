import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export interface InlineEditCellProps {
  value: string;
  onSave: (newValue: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  validation?: (value: string) => string | null; // Returns error message or null
  maxLength?: number;
  className?: string;
}

/**
 * InlineEditCell Component - Design System v2.0
 *
 * Editable table cell with inline editing
 *
 * Features:
 * - Double-click to edit
 * - Enter to save, ESC to cancel
 * - Validation support
 * - Character counter
 * - Focus trap while editing
 */
export const InlineEditCell: React.FC<InlineEditCellProps> = ({
  value: initialValue,
  onSave,
  onCancel,
  placeholder = 'Enter value...',
  validation,
  maxLength,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setValue(initialValue); // Reset to initial value when starting edit
    setError(null);
  };

  const handleSave = () => {
    // Validate
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Save if value changed
    if (value !== initialValue) {
      onSave(value);
    }

    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setValue(initialValue); // Revert to initial value
    setIsEditing(false);
    setError(null);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Auto-save on blur if no error
    if (!error) {
      handleSave();
    }
  };

  if (!isEditing) {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={`
          px-2 py-1 rounded cursor-pointer
          hover:bg-neutral-700/30
          transition-colors duration-150
          ${className}
        `}
        title="Double-click to edit"
      >
        {initialValue || <span className="text-neutral-500 italic">{placeholder}</span>}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            flex-1
            bg-neutral-900 border-2 rounded-lg
            px-3 py-1.5
            text-neutral-50 placeholder-neutral-500
            text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${error ? 'border-error-500' : 'border-primary-500'}
          `}
        />

        {/* Action Buttons */}
        <button
          type="button"
          onClick={handleSave}
          className="
            p-1.5 rounded-lg
            bg-success-500/20 text-success-400
            hover:bg-success-500/30
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-success-500
          "
          aria-label="Save"
        >
          <Check className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="
            p-1.5 rounded-lg
            bg-error-500/20 text-error-400
            hover:bg-error-500/30
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-error-500
          "
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Character Counter */}
      {maxLength && (
        <div className="mt-1 text-xs text-neutral-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-xs text-error-400" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

InlineEditCell.displayName = 'InlineEditCell';
