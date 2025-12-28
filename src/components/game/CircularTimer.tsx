import { motion } from 'framer-motion';

interface CircularTimerProps {
  seconds: number;
  total: number;
  warning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  paused?: boolean;
  accentColor?: 'primary' | 'amber' | 'error';
}

// Size configurations
const sizeConfig = {
  sm: {
    container: 'w-16 h-16 md:w-20 md:h-20',
    viewBox: '0 0 80 80',
    cx: 40,
    cy: 40,
    radius: 32,
    strokeWidth: 6,
    textClass: 'text-xs md:text-sm font-semibold',
  },
  md: {
    container: 'w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36',
    viewBox: '0 0 112 112',
    cx: 56,
    cy: 56,
    radius: 48,
    strokeWidth: 8,
    textClass: 'text-base md:text-xl lg:text-2xl font-semibold',
  },
  lg: {
    container: 'w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44',
    viewBox: '0 0 128 128',
    cx: 64,
    cy: 64,
    radius: 54,
    strokeWidth: 10,
    textClass: 'text-xl md:text-2xl lg:text-3xl font-bold',
  },
};

// Color configurations
const colorConfig = {
  primary: {
    normal: 'rgb(14, 165, 233)', // sky-500
    warning: 'rgb(239, 68, 68)', // red-500
    warningPulse: 'rgb(248, 113, 113)', // red-400
    text: 'text-neutral-50',
    warningText: 'text-error-400',
  },
  amber: {
    normal: 'rgb(245, 158, 11)', // amber-500
    warning: 'rgb(239, 68, 68)', // red-500
    warningPulse: 'rgb(248, 113, 113)', // red-400
    text: 'text-amber-400',
    warningText: 'text-error-400',
  },
  error: {
    normal: 'rgb(239, 68, 68)', // red-500
    warning: 'rgb(239, 68, 68)',
    warningPulse: 'rgb(248, 113, 113)',
    text: 'text-error-400',
    warningText: 'text-error-400',
  },
};

/**
 * Circular timer with SVG progress indicator
 * Shows remaining time as a circular progress bar with center text display
 * Optimized for projection/smart board visibility
 * 
 * Features:
 * - Multiple sizes (sm, md, lg) for different contexts
 * - Pause state with reduced opacity
 * - Accent colors for different timer types (global vs guess timer)
 * - Warning state with pulsing animation
 */
export function CircularTimer({ 
  seconds, 
  total, 
  warning = false,
  size = 'md',
  paused = false,
  accentColor = 'primary',
}: CircularTimerProps) {
  const progress = (seconds / total) * 100;
  const config = sizeConfig[size];
  const colors = colorConfig[accentColor];

  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference * (1 - progress / 100);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Determine stroke color
  const strokeColor = warning ? colors.warning : colors.normal;
  const textColorClass = warning ? colors.warningText : colors.text;

  return (
    <div className={`relative ${config.container} ${paused ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={config.viewBox}
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={config.cx}
          cy={config.cy}
          r={config.radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={config.strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={config.cx}
          cy={config.cy}
          r={config.radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={warning ? {
            stroke: [colors.warning, colors.warningPulse, colors.warning]
          } : {}}
          transition={warning ? {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          } : {
            duration: 0.3,
            ease: 'easeInOut'
          }}
        />
      </svg>

      {/* Center time display */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={`font-mono ${config.textClass} ${textColorClass}`}>
          {minutes}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
