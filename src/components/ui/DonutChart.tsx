import React from 'react';
import { motion } from 'framer-motion';

export interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

export interface DonutChartProps {
  segments: DonutChartSegment[];
  size?: number;
  thickness?: number;
  centerText?: string;
  centerSubtext?: string;
  onSegmentClick?: (segment: DonutChartSegment) => void;
  className?: string;
}

/**
 * DonutChart Component - Design System v2.0
 *
 * Interactive donut chart visualization
 *
 * Features:
 * - Responsive sizing
 * - Click interactions
 * - Animated segments
 * - Hover effects
 * - Center text display
 * - Percentage labels
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  size = 240,
  thickness = 40,
  centerText,
  centerSubtext,
  onSegmentClick,
  className = '',
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate total value
  const totalValue = segments.reduce((sum, seg) => sum + seg.value, 0);

  // Calculate percentages and cumulative offsets
  let cumulativePercentage = 0;
  const processedSegments = segments.map((segment) => {
    const percentage = totalValue > 0 ? (segment.value / totalValue) * 100 : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const rotation = (cumulativePercentage / 100) * 360 - 90; // Start from top
    cumulativePercentage += percentage;

    return {
      ...segment,
      percentage,
      strokeDashoffset,
      rotation,
    };
  });

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(115, 115, 115, 0.2)"
          strokeWidth={thickness}
        />

        {/* Segments */}
        {processedSegments.map((segment, index) => {
          if (segment.value === 0) return null;

          return (
            <motion.circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={circumference}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: `rotate(${segment.rotation}deg)`,
                transformOrigin: 'center',
                transition: 'all 0.3s ease',
              }}
              className={onSegmentClick ? 'cursor-pointer hover:opacity-80' : ''}
              onClick={onSegmentClick ? () => onSegmentClick(segment) : undefined}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: segment.strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Center Text */}
      {(centerText || centerSubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerText && (
            <div className="text-2xl md:text-3xl font-bold text-neutral-50">{centerText}</div>
          )}
          {centerSubtext && (
            <div className="text-sm md:text-base text-neutral-400 mt-1">{centerSubtext}</div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {processedSegments.map((segment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className={`
              flex items-center justify-between gap-3 px-3 py-2 rounded-lg
              ${onSegmentClick ? 'cursor-pointer hover:bg-neutral-800/50 transition-colors' : ''}
            `}
            onClick={onSegmentClick ? () => onSegmentClick(segment) : undefined}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-neutral-300 truncate">{segment.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold text-neutral-50">{segment.value}</span>
              <span className="text-xs text-neutral-500">
                ({segment.percentage?.toFixed(1)}%)
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

DonutChart.displayName = 'DonutChart';
