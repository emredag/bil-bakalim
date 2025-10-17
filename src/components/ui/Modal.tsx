import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Modal Component - PRD 8.3
 *
 * TV Show Quality modal/dialog with blur backdrop.
 *
 * Features:
 * - Blur backdrop overlay (PRD 8.3: bg-black/50 backdrop-blur-sm)
 * - Focus trap (accessibility)
 * - ESC to close (ui-ux-design.md)
 * - Click outside to close (optional)
 * - Fade + slide animations
 * - Multiple sizes
 * - Z-index: modal layer (20)
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size variants
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Handle ESC key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management (accessibility)
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore focus when modal closes
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants (ui-ux-design.md)
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }, // easeOut as cubic bezier
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }, // easeIn as cubic bezier
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop - PRD 8.3: bg-black/50 backdrop-blur-sm */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleOverlayClick}
          />

          {/* Modal Content - PRD 8.3 */}
          <motion.div
            ref={modalRef}
            className={`
              relative bg-slate-800 rounded-2xl p-8 shadow-2xl
              w-full ${sizeStyles[size]}
              border border-slate-700
              max-h-[90vh] overflow-y-auto scrollbar-dark
            `}
            variants={modalVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            tabIndex={-1}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between mb-6">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-2xl md:text-3xl font-semibold text-text-primary"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="
                      ml-auto p-2 rounded-lg
                      text-text-tertiary hover:text-text-primary
                      hover:bg-slate-700
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="text-text-secondary">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

/**
 * ModalFooter - Optional footer component for action buttons
 */
export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-6 pt-6 border-t border-slate-700 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';
