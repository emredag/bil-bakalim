/**
 * Error Type Definitions
 * PRD Section 14.2 - Error Handling
 *
 * Defines all error types used throughout the application
 */

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Database Error
 * PRD 14.2: Veritabanı hataları
 */
export class DatabaseError extends AppError {
  constructor(message: string, userMessage: string = 'Veritabanı hatası oluştu') {
    super(message, 'DATABASE_ERROR', userMessage);
    this.name = 'DatabaseError';
  }
}

/**
 * Validation Error
 * PRD 14.2: Validasyon hataları
 */
export class ValidationError extends AppError {
  constructor(message: string, userMessage: string = 'Geçersiz veri girişi') {
    super(message, 'VALIDATION_ERROR', userMessage);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error
 * PRD 14.2: Kayıt bulunamadı
 */
export class NotFoundError extends AppError {
  constructor(message: string, userMessage: string = 'İstenen kayıt bulunamadı') {
    super(message, 'NOT_FOUND_ERROR', userMessage);
    this.name = 'NotFoundError';
  }
}

/**
 * Duplicate Error
 * PRD 14.2: Tekrar kayıt
 */
export class DuplicateError extends AppError {
  constructor(message: string, userMessage: string = 'Bu kayıt zaten mevcut') {
    super(message, 'DUPLICATE_ERROR', userMessage);
    this.name = 'DuplicateError';
  }
}

/**
 * File System Error
 * PRD 14.2: Dosya işlem hataları
 */
export class FileSystemError extends AppError {
  constructor(message: string, userMessage: string = 'Dosya işlemi başarısız') {
    super(message, 'FILESYSTEM_ERROR', userMessage);
    this.name = 'FileSystemError';
  }
}

/**
 * Network Error (for future online features)
 */
export class NetworkError extends AppError {
  constructor(message: string, userMessage: string = 'Bağlantı hatası') {
    super(message, 'NETWORK_ERROR', userMessage);
    this.name = 'NetworkError';
  }
}

/**
 * Unknown Error
 */
export class UnknownError extends AppError {
  constructor(message: string, userMessage: string = 'Beklenmeyen bir hata oluştu') {
    super(message, 'UNKNOWN_ERROR', userMessage);
    this.name = 'UnknownError';
  }
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error context for logging
 */
export interface ErrorContext {
  /** Where the error occurred */
  location: string;
  /** Additional context data */
  data?: Record<string, any>;
  /** Error severity */
  severity?: ErrorSeverity;
  /** Whether to show to user */
  showToUser?: boolean;
  /** Custom user message */
  userMessage?: string;
}

/**
 * Error handler result
 */
export interface ErrorHandlerResult {
  /** Whether error was handled */
  handled: boolean;
  /** User-friendly message */
  message: string;
  /** Whether to show toast */
  shouldShowToast: boolean;
  /** Toast variant */
  toastVariant: 'info' | 'success' | 'warning' | 'error';
}
