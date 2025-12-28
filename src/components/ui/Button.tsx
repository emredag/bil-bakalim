import React from 'react';
import { motion } from 'framer-motion';
import { soundService } from '../../services';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Button Component - PRD 8.3
 *
 * TV Show Quality button with three variants:
 * - Primary: Blue gradient, main actions
 * - Secondary: Slate background, secondary actions
 * - Destructive: Red gradient, dangerous actions
 *
 * Features:
 * - Minimum 48×48px touch target (ui-ux-design.md)
 * - Hover/focus states with animations
 * - Loading state with spinner
 * - Icon support
 * - Fully accessible (keyboard, screen reader)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className = '',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // Handle click with sound
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        soundService.playClick();
      }
      onClick?.(e);
    };
    // Base styles (Design System v2.0 - Enhanced)
    const baseStyles = `
      touch-target
      inline-flex flex-row flex-nowrap items-center justify-center gap-3
      font-semibold rounded-xl
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      will-change-transform
      whitespace-nowrap
    `;

    // Variant styles (Design System v2.0)
    const variantStyles = {
      primary: `
        bg-gradient-to-b from-primary-600 to-primary-700
        text-white shadow-lg
        hover:shadow-xl hover:from-primary-500 hover:to-primary-600
        focus-visible:ring-primary-500
        active:scale-95
      `,
      secondary: `
        bg-neutral-700 text-neutral-100 shadow-lg
        hover:bg-neutral-600 hover:shadow-xl
        focus-visible:ring-neutral-500
        active:scale-95
      `,
      destructive: `
        bg-gradient-to-b from-error-600 to-error-700
        text-white shadow-lg
        hover:shadow-xl hover:from-error-500 hover:to-error-600
        focus-visible:ring-error-500
        active:scale-95
      `,
    };

    // Size styles (responsive, PRD 8.2)
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm md:text-base',
      md: 'px-6 py-3 text-base md:text-lg',
      lg: 'px-8 py-4 text-lg md:text-xl',
    };

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const motionProps = {
      whileHover: !disabled && !loading ? { scale: 1.02 } : undefined,
      whileTap: !disabled && !loading ? { scale: 0.98 } : undefined,
      transition: { duration: 0.15, ease: 'easeOut' },
    };

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        onClick={handleClick}
        {...motionProps}
        {...(props as any)}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
