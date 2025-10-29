import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Badge Component - ui-ux-design.md
 *
 * TV Show Quality badge/label component for status and categories.
 *
 * Variants:
 * - default: Blue accent
 * - success: Green
 * - error: Red
 * - warning: Amber
 * - info: Blue
 * - neutral: Slate
 *
 * Features:
 * - Multiple sizes
 * - Icon support
 * - Status colors from design system
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', icon, className = '' }, ref) => {
    // Base styles
    const baseStyles = `
    inline-flex items-center justify-center gap-1.5
    font-medium rounded-full
    transition-colors duration-200
  `;

    // Variant styles (using PRD status colors)
    const variantStyles = {
      default: 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30',
      success: 'bg-status-success/20 text-status-success border border-status-success/30',
      error: 'bg-status-error/20 text-status-error border border-status-error/30',
      warning: 'bg-status-warning/20 text-status-warning border border-status-warning/30',
      info: 'bg-status-info/20 text-status-info border border-status-info/30',
      neutral: 'bg-slate-700/50 text-text-secondary border border-slate-600',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    // Icon size
    const iconSizeStyles = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <span ref={ref} className={combinedClassName}>
        {icon && (
          <span className={iconSizeStyles[size]} aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * StatusBadge - Pre-configured badge for common status use cases
 */
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'neutral' as const, label: 'Inactive' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    completed: { variant: 'success' as const, label: 'Completed' },
    failed: { variant: 'error' as const, label: 'Failed' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';

/**
 * CountBadge - Badge displaying a count/number (e.g., word count, notification count)
 */
export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'default',
  className = '',
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant={variant} size="sm" className={`tabular-nums ${className}`}>
      {displayCount}
    </Badge>
  );
};

CountBadge.displayName = 'CountBadge';
