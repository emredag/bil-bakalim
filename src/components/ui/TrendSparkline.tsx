import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface TrendSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showTrendIcon?: boolean;
  className?: string;
}

/**
 * TrendSparkline Component
 *
 * Lightweight SVG-based sparkline chart for showing trends.
 * Part of Design System v2.0 - Analytics Dashboard pattern.
 *
 * @example
 * <TrendSparkline
 *   data={[100, 120, 110, 130, 125]}
 *   color="#0ea5e9"
 *   showTrendIcon
 * />
 */
export const TrendSparkline: React.FC<TrendSparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = '#0ea5e9',
  showTrendIcon = true,
  className = '',
}) => {
  const { path, trend } = useMemo(() => {
    if (data.length < 2) {
      return { path: '', trend: 'flat' as const };
    }

    // Calculate min/max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    // Generate SVG path
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((value, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return `${x},${y}`;
    });

    const svgPath = `M ${points.join(' L ')}`;

    // Calculate trend
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const change = lastValue - firstValue;
    const percentage = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    let trendDirection: 'up' | 'down' | 'flat' = 'flat';
    if (Math.abs(percentage) < 2) {
      trendDirection = 'flat';
    } else if (change > 0) {
      trendDirection = 'up';
    } else {
      trendDirection = 'down';
    }

    return {
      path: svgPath,
      trend: trendDirection,
    };
  }, [data, width, height]);

  const trendIcon = useMemo(() => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error-500" />;
      default:
        return <Minus className="w-4 h-4 text-neutral-400" />;
    }
  }, [trend]);

  const trendColor = useMemo(() => {
    switch (trend) {
      case 'up':
        return '#22c55e'; // success-500
      case 'down':
        return '#ef4444'; // error-500
      default:
        return '#a3a3a3'; // neutral-400
    }
  }, [trend]);

  if (data.length < 2) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showTrendIcon && <Minus className="w-4 h-4 text-neutral-400" />}
        <span className="text-xs text-neutral-500">Veri yok</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ minWidth: width }}
      >
        {/* Gradient for line */}
        <defs>
          <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Animated path */}
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#gradient-${trend})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.8, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Data points */}
        {data.map((value, index) => {
          const min = Math.min(...data);
          const max = Math.max(...data);
          const range = max - min || 1;
          const padding = 2;
          const chartWidth = width - padding * 2;
          const chartHeight = height - padding * 2;
          const stepX = chartWidth / (data.length - 1);
          const x = padding + index * stepX;
          const y = padding + chartHeight - ((value - min) / range) * chartHeight;

          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={trendColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.8 + index * 0.05,
                duration: 0.2,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </svg>

      {showTrendIcon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.4,
            ease: [0.68, -0.55, 0.265, 1.55], // bounce
          }}
        >
          {trendIcon}
        </motion.div>
      )}
    </div>
  );
};

/**
 * Helper function to generate sample trend data
 * Useful for testing and previewing
 */
export const generateTrendData = (
  length: number = 7,
  trend: 'up' | 'down' | 'flat' = 'up',
  baseValue: number = 100,
  variance: number = 20
): number[] => {
  const data: number[] = [];
  let current = baseValue;

  for (let i = 0; i < length; i++) {
    data.push(Math.round(current));

    // Apply trend
    if (trend === 'up') {
      current += (variance / length) + (Math.random() * variance * 0.3 - variance * 0.15);
    } else if (trend === 'down') {
      current -= (variance / length) + (Math.random() * variance * 0.3 - variance * 0.15);
    } else {
      current += Math.random() * variance * 0.4 - variance * 0.2;
    }
  }

  return data;
};
