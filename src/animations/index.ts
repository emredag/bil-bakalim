/**
 * Animations Module - Task 06
 * PRD 8.4 & ui-ux-design.md#motion
 *
 * Central export for all animation components and utilities
 */

// Animation variants
export * from './variants';

// Hooks
export { useReducedMotion, getMotionVariants, getMotionDuration } from './useReducedMotion';

// Components
export { Confetti } from './Confetti';
export type { ConfettiProps } from './Confetti';

export {
  PageTransition,
  FadeTransition,
  ScaleTransition,
  SlideUpTransition,
} from './PageTransition';
export type {
  PageTransitionProps,
  FadeTransitionProps,
  ScaleTransitionProps,
  SlideUpTransitionProps,
} from './PageTransition';

export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonGrid,
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
} from './SkeletonLoader';
export type {
  SkeletonProps,
  SkeletonTableProps,
  SkeletonGridProps,
  SkeletonTextProps,
  SkeletonButtonProps,
  SkeletonAvatarProps,
} from './SkeletonLoader';
