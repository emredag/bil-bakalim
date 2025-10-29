/**
 * usePerformance Hook - Task 40
 * PRD Section 2.3 - Performance Monitoring
 *
 * React hook for monitoring component performance
 *
 * Usage:
 * ```tsx
 * const { logRender, metrics } = usePerformance('MyComponent');
 *
 * useEffect(() => {
 *   logRender();
 * });
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  avgRenderTime: number;
  lastRenderTime: number;
  slowRenders: number; // renders > 16ms (60fps threshold)
}

export interface UsePerformanceReturn {
  /** Log a render */
  logRender: () => void;
  /** Current performance metrics */
  metrics: PerformanceMetrics;
  /** Reset metrics */
  reset: () => void;
}

/**
 * Hook for monitoring component render performance
 */
export function usePerformance(componentName: string): UsePerformanceReturn {
  const renderStartTime = useRef<number>(performance.now());
  const renderTimes = useRef<number[]>([]);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    componentName,
    renderCount: 0,
    avgRenderTime: 0,
    lastRenderTime: 0,
    slowRenders: 0,
  });

  const logRender = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - renderStartTime.current;

    // Store render time
    renderTimes.current.push(renderTime);

    // Keep only last 50 renders
    if (renderTimes.current.length > 50) {
      renderTimes.current.shift();
    }

    // Calculate metrics
    const renderCount = renderTimes.current.length;
    const avgRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderCount;
    const slowRenders = renderTimes.current.filter((time) => time > 16).length;

    // Warn if render is slow
    if (renderTime > 16) {
      console.warn(`[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }

    // Update metrics
    setMetrics({
      componentName,
      renderCount,
      avgRenderTime: Number(avgRenderTime.toFixed(2)),
      lastRenderTime: Number(renderTime.toFixed(2)),
      slowRenders,
    });

    // Reset start time for next render
    renderStartTime.current = performance.now();
  }, [componentName]);

  const reset = useCallback(() => {
    renderTimes.current = [];
    setMetrics({
      componentName,
      renderCount: 0,
      avgRenderTime: 0,
      lastRenderTime: 0,
      slowRenders: 0,
    });
  }, [componentName]);

  // Track component mount/unmount
  useEffect(() => {
    console.log(`[Performance] ${componentName} mounted`);

    return () => {
      const finalMetrics = metrics;
      if (finalMetrics.renderCount > 0) {
        console.log(`[Performance] ${componentName} unmounted`, {
          'Total Renders': finalMetrics.renderCount,
          'Avg Render Time': `${finalMetrics.avgRenderTime}ms`,
          'Slow Renders': finalMetrics.slowRenders,
          'Slow Render %': `${((finalMetrics.slowRenders / finalMetrics.renderCount) * 100).toFixed(1)}%`,
        });
      }
    };
  }, [componentName]); // Only run on mount/unmount

  return {
    logRender,
    metrics,
    reset,
  };
}

/**
 * useRenderCount - Simple hook to track render count
 */
export function useRenderCount(componentName: string): number {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    if (renderCount.current > 10) {
      console.warn(`[Performance] ${componentName} has rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
}

/**
 * useWhyDidYouUpdate - Debug hook to see which props changed
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>): void {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[Performance] ${componentName} re-rendered because:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}
