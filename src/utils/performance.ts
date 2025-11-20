/**
 * Performance Utilities - Task 40
 * PRD Section 2.3 - Performance Optimization
 *
 * Utilities for performance monitoring and optimization
 */

/**
 * Measure and log component render time
 */
export function measureRenderTime(componentName: string, startTime: number): void {
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (renderTime > 16) {
    // Log if slower than 60fps (16ms per frame)
    console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`);
  }
}

/**
 * Debounce function to limit execution frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Check if device has sufficient performance capabilities
 */
export function checkDevicePerformance(): {
  isHighPerformance: boolean;
  cpuCores: number;
  memory: number | null;
} {
  const cpuCores = navigator.hardwareConcurrency || 2;
  // @ts-ignore - deviceMemory is not in all browsers
  const memory = navigator.deviceMemory || null;

  // Consider high performance if 4+ cores or 4GB+ RAM
  const isHighPerformance = cpuCores >= 4 || (memory !== null && memory >= 4);

  return {
    isHighPerformance,
    cpuCores,
    memory,
  };
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Preload critical resources
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Memory usage monitoring (if available)
 */
export function getMemoryUsage(): {
  usedJSHeapSize: number | null;
  totalJSHeapSize: number | null;
  jsHeapSizeLimit: number | null;
} {
  // @ts-ignore - performance.memory is Chrome-specific
  const memory = performance.memory;

  if (memory) {
    return {
      usedJSHeapSize: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
      totalJSHeapSize: memory.totalJSHeapSize / (1024 * 1024),
      jsHeapSizeLimit: memory.jsHeapSizeLimit / (1024 * 1024),
    };
  }

  return {
    usedJSHeapSize: null,
    totalJSHeapSize: null,
    jsHeapSizeLimit: null,
  };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics(): void {
  // Performance logging disabled in production
}

/**
 * Batch state updates to prevent multiple re-renders
 */
export function batchUpdates(updates: (() => void)[]): void {
  // In React 18, updates are automatically batched
  // This is a utility for explicit batching if needed
  updates.forEach((update) => update());
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    }
  );
}

/**
 * Virtual scroll helper - calculate visible items
 */
export function calculateVisibleItems(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan = 3
): {
  startIndex: number;
  endIndex: number;
  offsetY: number;
} {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
  };
}
