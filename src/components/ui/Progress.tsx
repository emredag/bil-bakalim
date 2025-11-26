import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

/**
 * ProgressBar Component - ui-ux-design.md
 *
 * TV Show Quality linear progress bar.
 *
 * Features:
 * - Animated progress
 * - Multiple variants (colors)
 * - Size variants
 * - Optional label
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Variant colors
  const variantColors = {
    default: 'bg-accent-primary',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm text-text-secondary">
          <span>{label || 'Progress'}</span>
          <span className="tabular-nums">{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Progress bar */}
      <div className={`w-full bg-neutral-700 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          className={`${variantColors[variant]} ${sizeStyles[size]} rounded-full`}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

/**
 * ProgressRing Component - ui-ux-design.md
 *
 * Circular progress ring (for timer).
 *
 * Features:
 * - Circular SVG progress
 * - Animated stroke
 * - Center content slot
 * - Multiple sizes
 */
export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  children,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Variant colors
  const variantColors = {
    default: 'stroke-accent-primary',
    success: 'stroke-status-success',
    warning: 'stroke-status-warning',
    error: 'stroke-status-error',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-700"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={variantColors[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
};

ProgressRing.displayName = 'ProgressRing';

/**
 * CountUp Component - ui-ux-design.md
 *
 * Animated number counter (for score count-up).
 *
 * Features:
 * - Smooth count-up animation
 * - Tabular nums for clean alignment
 * - Customizable duration
 */
export interface CountUpProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    spring.set(value);

    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [value, spring, display]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

CountUp.displayName = 'CountUp';

/**
 * Timer Component - Specialized progress ring for game timer
 *
 * Features:
 * - Shows time remaining
 * - Color changes based on urgency
 * - Warning state when time is low
 * - Pulse animations (PRD 8.4):
 *   - Last 30s: Soft pulse (scale 1→1.05)
 *   - Last 10s: Fast pulse (scale 1→1.08) + color red
 */
export interface TimerProps {
  seconds: number;
  totalSeconds: number;
  size?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  seconds,
  totalSeconds,
  size = 120,
  warningThreshold = 30,
  criticalThreshold = 10,
  className = '',
}) => {
  // Determine variant based on remaining time
  const getVariant = (): 'default' | 'warning' | 'error' => {
    if (seconds <= criticalThreshold) return 'error';
    if (seconds <= warningThreshold) return 'warning';
    return 'default';
  };

  // Format time as MM:SS
  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine pulse animation state
  const getPulseState = (): 'idle' | 'soft' | 'fast' => {
    if (seconds <= criticalThreshold) return 'fast';
    if (seconds <= warningThreshold) return 'soft';
    return 'idle';
  };

  return (
    <motion.div
      animate={
        getPulseState() === 'fast'
          ? {
              scale: [1, 1.08, 1],
              transition: {
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
            }
          : getPulseState() === 'soft'
            ? {
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                },
              }
            : { scale: 1 }
      }
      style={{ display: 'inline-flex' }}
    >
      <ProgressRing
        value={seconds}
        max={totalSeconds}
        size={size}
        strokeWidth={8}
        variant={getVariant()}
        className={className}
      >
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-text-primary tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="text-xs text-text-tertiary uppercase tracking-wide">Time</div>
        </div>
      </ProgressRing>
    </motion.div>
  );
};

Timer.displayName = 'Timer';
