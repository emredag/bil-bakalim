import { motion } from 'framer-motion';

interface CircularTimerProps {
  seconds: number;
  total: number;
  warning?: boolean;
}

/**
 * Circular timer with SVG progress indicator
 * Shows remaining time as a circular progress bar with center text display
 * Optimized for projection/smart board visibility
 */
export function CircularTimer({ seconds, total, warning = false }: CircularTimerProps) {
  const progress = (seconds / total) * 100;

  // Responsive sizing for better visibility on projection
  const radius = 48; // Increased from 35
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36">
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 112 112"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />

        {/* Progress circle */}
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={warning ? 'rgb(239, 68, 68)' : 'rgb(14, 165, 233)'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={warning ? {
            stroke: ['rgb(239, 68, 68)', 'rgb(248, 113, 113)', 'rgb(239, 68, 68)']
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
        <span className={`font-mono text-base md:text-xl lg:text-2xl font-semibold ${warning ? 'text-error-400' : 'text-neutral-50'}`}>
          {minutes}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
