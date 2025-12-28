import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input Component - PRD 8.3
 *
 * TV Show Quality input field with focus states.
 *
 * Features:
 * - Blue focus ring (PRD 8.3)
 * - Label and error message support
 * - Helper text
 * - Icon support (left side)
 * - Dark theme optimized
 * - Fully accessible (ARIA labels)
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, fullWidth = false, className = '', id, ...props }, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${React.useId()}`;

    // Base styles (Design System v2.0)
    const baseStyles = `
      bg-neutral-900 border-2 rounded-lg px-3 py-2 md:px-4 md:py-2.5
      text-neutral-50 placeholder-neutral-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500
      disabled:opacity-60 disabled:cursor-not-allowed
      text-sm md:text-base
    `;

    // Border color (error state)
    const borderStyles = error
      ? 'border-error-500 focus:border-error-500'
      : 'border-neutral-700 focus:border-primary-500';

    // Icon padding
    const iconPadding = icon ? 'pl-11 md:pl-12' : '';

    // Width
    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `
      ${baseStyles}
      ${borderStyles}
      ${iconPadding}
      ${widthStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm md:text-base font-medium text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-status-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper (for icon positioning) */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={combinedClassName}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-status-error flex items-center gap-2"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component - Similar to Input but for multi-line text
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = false, className = '', id, ...props }, ref) => {
    // Generate unique ID if not provided
    const textareaId = id || `textarea-${React.useId()}`;

    // Base styles (Design System v2.0)
    const baseStyles = `
      bg-neutral-900 border-2 rounded-lg px-4 py-2
      text-neutral-50 placeholder-neutral-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500
      disabled:opacity-60 disabled:cursor-not-allowed
      resize-y
    `;

    // Border color (error state)
    const borderStyles = error
      ? 'border-error-500 focus:border-error-500'
      : 'border-neutral-700 focus:border-primary-500';

    // Width
    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `
      ${baseStyles}
      ${borderStyles}
      ${widthStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-2 text-sm md:text-base font-medium text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-status-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea field */}
        <textarea
          ref={ref}
          id={textareaId}
          className={combinedClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-status-error flex items-center gap-2"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-2 text-sm text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
