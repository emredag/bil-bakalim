import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'gradient' | 'bordered';
  hoverable?: boolean;
  children: React.ReactNode;
}

/**
 * Card Component - PRD 8.3
 *
 * TV Show Quality card with hover animations.
 *
 * Variants:
 * - default: Solid neutral background
 * - gradient: Gradient background (from-neutral-800 to-neutral-700)
 * - bordered: With border accent
 *
 * Features:
 * - Hover scale animation (1 → 1.05) per ui-ux-design.md
 * - Shadow transitions
 * - Responsive padding
 * - Customizable via className
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = true, children, className = '', ...props }, ref) => {
    // Base styles (Design System v2.0)
    const baseStyles = `
      rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl border
      transition-all duration-200
      will-change-transform
    `;

    // Variant styles (Design System v2.0 colors)
    const variantStyles = {
      default: 'bg-neutral-800 border-neutral-700',
      gradient: 'bg-gradient-to-b from-neutral-800 to-neutral-700 border-neutral-700/50',
      bordered: 'bg-neutral-800 border-2 border-neutral-600',
    };

    // Hover styles (conditional)
    const hoverStyles = hoverable ? 'hover:shadow-2xl cursor-pointer' : '';

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${hoverStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    // Animation variants - subtle hover (standardized)
    const animationVariants = {
      rest: { scale: 1 },
      hover: hoverable ? { scale: 1.02 } : { scale: 1 },
    };

    return (
      <motion.div
        ref={ref}
        className={combinedClassName}
        initial="rest"
        whileHover="hover"
        variants={animationVariants}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader - Optional card header component
 */
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Optional card title component
 */
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl md:text-2xl font-semibold text-neutral-50 ${className}`}>
      {children}
    </h3>
  );
};

CardTitle.displayName = 'CardTitle';

/**
 * CardContent - Optional card content wrapper
 */
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`text-neutral-400 ${className}`}>{children}</div>;
};

CardContent.displayName = 'CardContent';

/**
 * CardFooter - Optional card footer component
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 pt-4 border-t border-neutral-700 ${className}`}>{children}</div>;
};

CardFooter.displayName = 'CardFooter';
