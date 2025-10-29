import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Toast Component - ui-ux-design.md
 *
 * TV Show Quality toast notification.
 *
 * Features:
 * - 4s auto-dismiss (configurable)
 * - Success/error/warning/info variants with color strips
 * - Slide-in animation from right
 * - Close button
 * - Icon support
 * - Z-index: toast layer (40)
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) => {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  // Type configurations
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-slate-800',
      borderColor: 'border-l-status-success',
      iconColor: 'text-status-success',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-slate-800',
      borderColor: 'border-l-status-error',
      iconColor: 'text-status-error',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-slate-800',
      borderColor: 'border-l-status-warning',
      iconColor: 'text-status-warning',
    },
    info: {
      icon: Info,
      bgColor: 'bg-slate-800',
      borderColor: 'border-l-status-info',
      iconColor: 'text-status-info',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  // Animation variants (ui-ux-design.md: slide-in from right)
  const toastVariants = {
    initial: { opacity: 0, x: 100, scale: 0.95 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // easeOut as cubic bezier
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.95,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // easeIn as cubic bezier
    },
  };

  return (
    <motion.div
      className={`
        ${config.bgColor}
        ${config.borderColor}
        border-l-4 rounded-lg shadow-2xl
        p-4 pr-12
        min-w-[300px] max-w-md
        relative
      `}
      variants={toastVariants as any}
      initial="initial"
      animate="animate"
      exit="exit"
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={`${config.iconColor} flex-shrink-0 w-5 h-5 mt-0.5`} />

        {/* Message */}
        <p className="text-text-primary text-sm md:text-base flex-1">{message}</p>

        {/* Close button */}
        <button
          onClick={() => onClose(id)}
          className="
            absolute top-3 right-3
            text-text-tertiary hover:text-text-primary
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
          "
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar (optional visual for auto-dismiss) */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${config.borderColor.replace('border-l-', 'bg-')} rounded-bl-lg`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

Toast.displayName = 'Toast';

/**
 * ToastContainer - Container component to manage multiple toasts
 */
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
}) => {
  // Position styles
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`
        fixed ${positionStyles[position]}
        z-toast
        flex flex-col gap-3
        pointer-events-none
      `}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';

/**
 * useToast Hook - Helper hook for managing toasts
 */
export interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
  closeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const showToast = React.useCallback(
    (message: string, type: ToastProps['type'] = 'info', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastProps = {
        id,
        message,
        type,
        duration,
        onClose: (toastId) => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        },
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const closeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, showToast, closeToast, clearAll };
};
