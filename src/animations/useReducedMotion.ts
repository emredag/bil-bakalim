/**
 * useReducedMotion Hook
 * ui-ux-design.md#a11y - Reduce Motion Support
 *
 * Detects the user's "prefers-reduced-motion" system preference
 * and returns a boolean to conditionally disable/simplify animations.
 *
 * Usage:
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={shouldReduceMotion ? {} : { scale: 1.05 }}
 * />
 * ```
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect prefers-reduced-motion media query
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is available (browser support)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setShouldReduceMotion(mediaQuery.matches);

    // Update on change
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    // Listen for changes
    // Use addEventListener for modern browsers, addListener for legacy support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - Legacy browser support
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - Legacy browser support
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Utility function to get simplified animation variants when reduced motion is preferred
 *
 * @param normalVariants - Normal animation variants
 * @param reducedVariants - Simplified variants (optional, defaults to no animation)
 * @returns Appropriate variants based on user preference
 */
export function getMotionVariants<T>(normalVariants: T, reducedVariants?: Partial<T>): T {
  // This is meant to be used with the hook
  // For static usage, check window.matchMedia directly
  if (typeof window !== 'undefined' && window.matchMedia) {
    const shouldReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldReduce) {
      return (reducedVariants || {}) as T;
    }
  }

  return normalVariants;
}

/**
 * Utility function to get animation duration based on reduced motion preference
 *
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Reduced duration (optional, defaults to 0.01)
 * @returns Appropriate duration
 */
export function getMotionDuration(normalDuration: number, reducedDuration: number = 0.01): number {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const shouldReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return shouldReduce ? reducedDuration : normalDuration;
  }

  return normalDuration;
}
