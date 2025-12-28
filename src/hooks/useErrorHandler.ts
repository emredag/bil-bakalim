/**
 * useErrorHandler Hook
 * PRD Section 14.2 - Error Handling
 *
 * React hook for error handling with toast notifications
 *
 * Usage:
 * ```tsx
 * const { handleError, showError, toasts } = useErrorHandler();
 *
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleError(error, { location: 'MyComponent' });
 * }
 *
 * // In JSX: <ToastContainer toasts={toasts} />
 * ```
 */

import { useCallback } from 'react';
import { errorHandler } from '../services/errorHandler';
import { useToast } from '../components/ui/Toast';
import type { ErrorContext } from '../types/errors';
import type { ToastProps } from '../components/ui/Toast';

export interface UseErrorHandlerReturn {
  /**
   * Handle an error with automatic toast notification
   */
  handleError: (error: unknown, context?: ErrorContext) => void;

  /**
   * Show a custom error message
   */
  showError: (message: string, variant?: 'info' | 'warning' | 'error') => void;

  /**
   * Get user-friendly error message
   */
  getUserMessage: (error: unknown) => string;

  /**
   * Check if error is critical
   */
  isCritical: (error: unknown) => boolean;

  /**
   * Active toasts for ToastContainer
   */
  toasts: ToastProps[];
}

/**
 * Hook for error handling with integrated toast notifications
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const { toasts, showToast } = useToast();

  /**
   * Map error handler toast variant to Toast component type
   */
  const mapVariantToToastType = (
    variant: 'info' | 'success' | 'warning' | 'error'
  ): ToastProps['type'] => {
    return variant;
  };

  /**
   * Handle error with automatic logging and toast notification
   */
  const handleError = useCallback(
    (error: unknown, context?: ErrorContext) => {
      const result = errorHandler.handle(error, context);

      if (result.shouldShowToast) {
        showToast(result.message, mapVariantToToastType(result.toastVariant));
      }
    },
    [showToast]
  );

  /**
   * Show a custom error message via toast
   */
  const showError = useCallback(
    (message: string, variant: 'info' | 'warning' | 'error' = 'error') => {
      showToast(message, mapVariantToToastType(variant));
    },
    [showToast]
  );

  /**
   * Get user-friendly error message
   */
  const getUserMessage = useCallback((error: unknown): string => {
    return errorHandler.getUserMessage(error);
  }, []);

  /**
   * Check if error is critical
   */
  const isCritical = useCallback((error: unknown): boolean => {
    return errorHandler.isCritical(error);
  }, []);

  return {
    handleError,
    showError,
    getUserMessage,
    isCritical,
    toasts,
  };
}
