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
 * - default: Solid slate background
 * - gradient: Gradient background (from-slate-800 to-slate-700)
 * - bordered: With border accent
 *
 * Features:
 * - Hover scale animation (1 → 1.05) per ui-ux-design.md
 * - Shadow transitions
 * - Responsive padding
 * - Customizable via className
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = true,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles (PRD 8.3)
    const baseStyles = `
      rounded-2xl p-6 shadow-xl border border-slate-700
      transition-all duration-200
      will-change-transform
    `;

    // Variant styles
    const variantStyles = {
      default: 'bg-slate-800',
      gradient: 'bg-gradient-to-b from-slate-800 to-slate-700',
      bordered: 'bg-slate-800 border-2 border-slate-600',
    };

    // Hover styles (conditional)
    const hoverStyles = hoverable
      ? 'hover:shadow-2xl cursor-pointer'
      : '';

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${hoverStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Animation variants (ui-ux-design.md)
    const animationVariants = {
      rest: { scale: 1 },
      hover: hoverable ? { scale: 1.05 } : { scale: 1 },
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

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle - Optional card title component
 */
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-xl md:text-2xl font-semibold text-text-primary ${className}`}>
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

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`text-text-secondary ${className}`}>
      {children}
    </div>
  );
};

CardContent.displayName = 'CardContent';

/**
 * CardFooter - Optional card footer component
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-700 ${className}`}>
      {children}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';
