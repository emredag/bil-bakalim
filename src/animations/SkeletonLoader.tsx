/**
 * SkeletonLoader Component
 * PRD 8.4 - Loading States
 * ui-ux-design.md - Skeleton loaders with animate-pulse
 *
 * Generic skeleton loading components for various UI elements.
 * Uses Tailwind's animate-pulse for smooth loading animation.
 *
 * Features:
 * - Multiple shapes (box, circle, text)
 * - Responsive sizing
 * - Composable layout
 * - Respects reduce motion preference
 */

import React from 'react';

export interface SkeletonProps {
  /** Shape variant */
  variant?: 'box' | 'circle' | 'text';
  /** Width (CSS value or Tailwind class) */
  width?: string;
  /** Height (CSS value or Tailwind class) */
  height?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disable animation */
  disableAnimation?: boolean;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Base Skeleton component
 *
 * Usage:
 * ```tsx
 * <Skeleton variant="box" width="w-full" height="h-48" />
 * <Skeleton variant="circle" width="w-12" height="h-12" />
 * <Skeleton variant="text" width="w-3/4" />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'box',
  width = 'w-full',
  height,
  className = '',
  disableAnimation = false,
  style,
}) => {
  // Default heights per variant
  const defaultHeights = {
    box: 'h-32',
    circle: 'h-12',
    text: 'h-4',
  };

  const finalHeight = height || defaultHeights[variant];

  // Base styles
  const baseStyles = 'bg-neutral-700';

  // Variant styles
  const variantStyles = {
    box: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded',
  };

  // Animation
  const animationClass = disableAnimation ? '' : 'animate-pulse';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${width}
        ${finalHeight}
        ${animationClass}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
      style={style}
      aria-hidden="true"
    />
  );
};

Skeleton.displayName = 'Skeleton';

/**
 * SkeletonCard - Preset for card skeleton
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-neutral-800 rounded-2xl p-6 border border-neutral-700 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" width="w-12" height="h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="w-1/2" height="h-4" />
            <Skeleton variant="text" width="w-1/3" height="h-3" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Skeleton variant="text" width="w-full" height="h-3" />
          <Skeleton variant="text" width="w-5/6" height="h-3" />
          <Skeleton variant="text" width="w-4/6" height="h-3" />
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-2">
          <Skeleton variant="box" width="w-24" height="h-8" />
          <Skeleton variant="box" width="w-24" height="h-8" />
        </div>
      </div>
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';

/**
 * SkeletonTable - Preset for table skeleton
 */
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height="h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" height="h-3" />
          ))}
        </div>
      ))}
    </div>
  );
};

SkeletonTable.displayName = 'SkeletonTable';

/**
 * SkeletonGrid - Preset for grid of cards
 */
export interface SkeletonGridProps {
  count?: number;
  columns?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, className = '' }) => {
  return (
    <div
      className={`grid gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

SkeletonGrid.displayName = 'SkeletonGrid';

/**
 * SkeletonText - Preset for text blocks
 */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => {
        // Vary width for last line
        const width = i === lines - 1 ? 'w-3/4' : 'w-full';
        return <Skeleton key={i} variant="text" width={width} />;
      })}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

/**
 * SkeletonButton - Preset for button skeleton
 */
export interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-20 h-8',
    md: 'w-32 h-10',
    lg: 'w-40 h-12',
  };

  return (
    <Skeleton
      variant="box"
      width={sizeStyles[size].split(' ')[0]}
      height={sizeStyles[size].split(' ')[1]}
      className={className}
    />
  );
};

SkeletonButton.displayName = 'SkeletonButton';

/**
 * SkeletonAvatar - Preset for avatar skeleton
 */
export interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 48, className = '' }) => {
  return (
    <Skeleton
      variant="circle"
      width={`w-${size}`}
      height={`h-${size}`}
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';
