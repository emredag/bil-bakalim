/**
 * Error Boundary Component
 * PRD Section 14.2 - Error Handling
 *
 * React Error Boundary to catch JavaScript errors in component tree
 * Prevents entire app from crashing when a component throws an error
 *
 * Features:
 * - Catches unhandled errors in React components
 * - Shows fallback UI instead of crashing
 * - Logs errors for debugging
 * - Provides retry mechanism
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler } from '../services/errorHandler';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error
    errorHandler.handle(error, {
      location: 'ErrorBoundary',
      data: {
        componentStack: errorInfo.componentStack,
      },
      severity: 'critical' as any,
      showToUser: false, // Don't show toast, we have fallback UI
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} onReset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 */
interface DefaultErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps): JSX.Element {
  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-red-500/30">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-primary text-center mb-4">
            Bir Hata Oluştu
          </h1>

          {/* Message */}
          <p className="text-text-secondary text-center mb-6">
            Uygulama beklenmedik bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya ana
            menüye dönün.
          </p>

          {/* Error Details (Development only) */}
          {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-red-500/20">
              <p className="text-xs text-red-400 font-mono break-all">{error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-text-tertiary cursor-pointer hover:text-text-secondary">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-text-tertiary overflow-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onReset}
              className="
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                bg-gradient-to-b from-blue-600 to-blue-700
                text-white font-semibold
                hover:from-blue-500 hover:to-blue-600
                transition-all duration-200
                shadow-lg hover:shadow-xl
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              "
            >
              <RefreshCw className="w-5 h-5" />
              Tekrar Dene
            </button>

            <button
              onClick={goHome}
              className="
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                bg-slate-700 text-slate-100
                hover:bg-slate-600
                transition-all duration-200
                shadow-lg hover:shadow-xl
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500
              "
            >
              <Home className="w-5 h-5" />
              Ana Menü
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-text-tertiary text-center mt-6">
            Sorun devam ederse lütfen uygulamayı yeniden başlatın.
          </p>
        </div>
      </div>
    </div>
  );
}
