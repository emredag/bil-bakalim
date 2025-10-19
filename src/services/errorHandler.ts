/**
 * Error Handler Service
 * PRD Section 14.2 - Error Handling
 *
 * Central error handling service for the application
 *
 * Features:
 * - Centralized error logging
 * - User-friendly error messages
 * - Error classification
 * - Toast notification integration
 */

import type {
  ErrorContext,
  ErrorHandlerResult,
  ErrorSeverity,
} from '../types/errors';
import {
  AppError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  DuplicateError,
  FileSystemError,
  NetworkError,
  UnknownError,
} from '../types/errors';

/**
 * Error Handler Class
 */
class ErrorHandler {
  private static instance: ErrorHandler | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error
   *
   * @param error - Error to handle
   * @param context - Error context
   * @returns Error handler result
   */
  public handle(error: unknown, context?: ErrorContext): ErrorHandlerResult {
    // Log error to console (production: send to logging service)
    this.logError(error, context);

    // Classify error
    const appError = this.classifyError(error);

    // Get user message
    const userMessage = context?.userMessage || appError.userMessage;

    // Determine toast variant
    const severity = context?.severity || this.getSeverity(appError);
    const toastVariant = this.severityToToastVariant(severity);

    // Determine if should show toast
    const shouldShowToast = context?.showToUser !== false;

    return {
      handled: true,
      message: userMessage,
      shouldShowToast,
      toastVariant,
    };
  }

  /**
   * Classify error into AppError type
   */
  private classifyError(error: unknown): AppError {
    // Already an AppError
    if (error instanceof AppError) {
      return error;
    }

    // Standard Error
    if (error instanceof Error) {
      // Check error message for common patterns
      const message = error.message.toLowerCase();

      if (message.includes('database') || message.includes('sql')) {
        return new DatabaseError(error.message);
      }

      if (message.includes('validation') || message.includes('invalid')) {
        return new ValidationError(error.message);
      }

      if (message.includes('not found') || message.includes('404')) {
        return new NotFoundError(error.message);
      }

      if (message.includes('duplicate') || message.includes('already exists')) {
        return new DuplicateError(error.message);
      }

      if (message.includes('file') || message.includes('filesystem')) {
        return new FileSystemError(error.message);
      }

      if (message.includes('network') || message.includes('fetch')) {
        return new NetworkError(error.message);
      }

      // Unknown error
      return new UnknownError(error.message);
    }

    // String error
    if (typeof error === 'string') {
      return new UnknownError(error);
    }

    // Unknown type
    return new UnknownError('Bilinmeyen bir hata oluştu');
  }

  /**
   * Get error severity
   */
  private getSeverity(error: AppError): ErrorSeverity {
    if (error instanceof DatabaseError) return 'critical' as ErrorSeverity;
    if (error instanceof ValidationError) return 'warning' as ErrorSeverity;
    if (error instanceof NotFoundError) return 'info' as ErrorSeverity;
    if (error instanceof DuplicateError) return 'warning' as ErrorSeverity;
    if (error instanceof FileSystemError) return 'error' as ErrorSeverity;
    if (error instanceof NetworkError) return 'error' as ErrorSeverity;
    return 'error' as ErrorSeverity;
  }

  /**
   * Convert severity to toast variant
   */
  private severityToToastVariant(
    severity: ErrorSeverity
  ): 'info' | 'success' | 'warning' | 'error' {
    switch (severity) {
      case 'info' as ErrorSeverity:
        return 'info';
      case 'warning' as ErrorSeverity:
        return 'warning';
      case 'error' as ErrorSeverity:
      case 'critical' as ErrorSeverity:
        return 'error';
      default:
        return 'error';
    }
  }

  /**
   * Log error to console
   */
  private logError(error: unknown, context?: ErrorContext): void {
    const timestamp = new Date().toISOString();
    const location = context?.location || 'Unknown';

    console.group(`[ERROR] ${timestamp} - ${location}`);
    console.error('Error:', error);
    if (context?.data) {
      console.error('Context:', context.data);
    }
    console.groupEnd();
  }

  /**
   * Create a user-friendly error message
   */
  public getUserMessage(error: unknown): string {
    const appError = this.classifyError(error);
    return appError.userMessage;
  }

  /**
   * Check if error is critical
   */
  public isCritical(error: unknown): boolean {
    const appError = this.classifyError(error);
    const severity = this.getSeverity(appError);
    return severity === ('critical' as ErrorSeverity);
  }
}

/**
 * Export singleton instance
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * Utility function to handle errors with toast
 *
 * Usage:
 * ```ts
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   handleErrorWithToast(error, {
 *     location: 'CategoryManagement.deleteCategory',
 *     userMessage: 'Kategori silinirken bir hata oluştu'
 *   });
 * }
 * ```
 */
export function handleErrorWithToast(
  error: unknown,
  context?: ErrorContext
): ErrorHandlerResult {
  return errorHandler.handle(error, context);
}

/**
 * Utility to create a validation error
 */
export function createValidationError(message: string): ValidationError {
  return new ValidationError(message);
}

/**
 * Utility to create a not found error
 */
export function createNotFoundError(resource: string): NotFoundError {
  return new NotFoundError(
    `${resource} not found`,
    `${resource} bulunamadı`
  );
}

/**
 * Utility to create a duplicate error
 */
export function createDuplicateError(resource: string): DuplicateError {
  return new DuplicateError(
    `${resource} already exists`,
    `Bu ${resource} zaten mevcut`
  );
}
