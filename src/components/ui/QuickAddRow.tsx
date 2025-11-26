import React, { useState, useRef, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface QuickAddRowProps {
  fields: {
    name: string;
    placeholder: string;
    type?: 'text' | 'number';
    maxLength?: number;
    required?: boolean;
  }[];
  onAdd: (values: Record<string, string>) => Promise<void> | void;
  validation?: (values: Record<string, string>) => string | null;
  addButtonText?: string;
  className?: string;
}

/**
 * QuickAddRow Component - Design System v2.0
 *
 * Always-visible quick add form row for tables
 *
 * Features:
 * - Multiple input fields
 * - Enter to submit, ESC to clear
 * - Loading state during submit
 * - Validation support
 * - Auto-focus on first field
 * - Keyboard navigation
 */
export const QuickAddRow: React.FC<QuickAddRowProps> = ({
  fields,
  onAdd,
  validation,
  addButtonText = 'Ekle',
  className = '',
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize values
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      initialValues[field.name] = '';
    });
    setValues(initialValues);
  }, [fields]);

  const handleChange = (fieldName: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setError(null);
  };

  const handleClear = () => {
    const clearedValues: Record<string, string> = {};
    fields.forEach((field) => {
      clearedValues[field.name] = '';
    });
    setValues(clearedValues);
    setError(null);
    firstInputRef.current?.focus();
  };

  const handleSubmit = async () => {
    // Validate required fields
    const hasEmptyRequired = fields.some(
      (field) => field.required && !values[field.name]?.trim()
    );
    if (hasEmptyRequired) {
      setError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    // Custom validation
    if (validation) {
      const validationError = validation(values);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd(values);
      handleClear(); // Clear form on success
    } catch (err) {
      console.error('Quick add failed:', err);
      setError(err instanceof Error ? err.message : 'Ekleme başarısız oldu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={`bg-neutral-800/50 border-b-2 border-primary-500/30 ${className}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Input Fields */}
        {fields.map((field, index) => (
          <input
            key={field.name}
            ref={index === 0 ? firstInputRef : undefined}
            type={field.type || 'text'}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={isSubmitting}
            className={`
              flex-1
              bg-neutral-900 border-2 rounded-lg
              px-3 py-2
              text-neutral-50 placeholder-neutral-500
              text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-150
              ${error ? 'border-error-500' : 'border-neutral-700 focus:border-primary-500'}
            `}
          />
        ))}

        {/* Add Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        >
          {addButtonText}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-3">
          <p className="text-sm text-error-400" role="alert">
            {error}
          </p>
        </div>
      )}

      {/* Helper Text */}
      <div className="px-4 pb-3">
        <p className="text-xs text-neutral-500">
          Hızlı eklemek için alanları doldurup Enter'a basın • ESC ile temizleyin
        </p>
      </div>
    </div>
  );
};

QuickAddRow.displayName = 'QuickAddRow';
