/**
 * useErrorHandler Hook
 * PRD Section 14.2 - Error Handling
 *
 * React hook for error handling with toast notifications
 *
 * Usage:
 * ```tsx
 * const { handleError, showError } = useErrorHandler();
 *
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleError(error, { location: 'MyComponent' });
 * }
 * ```
 */

import { useCallback } from 'react';
import { errorHandler } from '../services/errorHandler';
import type { ErrorContext } from '../types/errors';

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
}

/**
 * Hook for error handling
 *
 * Note: This hook handles errors but doesn't display toasts directly.
 * For toast display, use the toast system separately or integrate it here.
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  /**
   * Handle error with automatic logging and classification
   */
  const handleError = useCallback((error: unknown, context?: ErrorContext) => {
    const result = errorHandler.handle(error, context);

    // Here you would integrate with your toast system
    if (result.shouldShowToast) {
      // TODO: Integrate with actual toast system when available
      // toast[result.toastVariant](result.message);
    }
  }, []);

  /**
   * Show a custom error message
   */
  const showError = useCallback(
    (_message: string, _variant: 'info' | 'warning' | 'error' = 'error') => {
      // TODO: Integrate with actual toast system
      // toast[variant](message);
    },
    []
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
  };
}
