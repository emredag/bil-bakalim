/**
 * Animation Configuration System
 * Task 31: Settings Screen - Animation Speed Control
 *
 * Provides centralized animation duration management:
 * - Respects user's animation speed preference from settings
 * - Honors prefers-reduced-motion system preference
 * - Applies only to game-specific animations (not UI/menu animations)
 *
 * Speed Multipliers:
 * - slow: 1.5x slower (more time to see animations)
 * - normal: 1.0x (default speed)
 * - fast: 0.5x faster (snappier gameplay)
 */

import { useSettingsStore } from '../store/settingsStore';
import { prefersReducedMotion } from '../utils/a11y';

/**
 * Speed multipliers for animation durations
 */
const SPEED_MULTIPLIERS = {
  slow: 1.5,
  normal: 1.0,
  fast: 0.5,
} as const;

/**
 * Get the current animation speed multiplier
 * @returns multiplier value (0.5 for fast, 1.0 for normal, 1.5 for slow)
 */
export function getSpeedMultiplier(): number {
  const speed = useSettingsStore.getState().animationSpeed;
  return SPEED_MULTIPLIERS[speed];
}

/**
 * Calculate duration based on base duration and user preferences
 *
 * @param baseDuration - Base animation duration in seconds
 * @param options - Optional configuration
 * @returns Adjusted duration in seconds
 *
 * @example
 * // Card flip animation (game-specific)
 * const duration = getDuration(0.6); // Returns 0.6, 0.9, or 0.3 based on speed
 *
 * @example
 * // Menu animation (non-game, ignore speed setting)
 * const duration = getDuration(0.3, { isGameAnimation: false }); // Always returns 0.3 or 0.01
 */
export function getDuration(
  baseDuration: number,
  options?: {
    isGameAnimation?: boolean; // If false, speed multiplier is ignored
  }
): number {
  const { isGameAnimation = true } = options || {};

  // Check reduced motion preference first (applies to all animations)
  if (prefersReducedMotion()) {
    return 0.01; // Near-instant for reduced motion
  }

  // Apply speed multiplier only to game animations
  if (isGameAnimation) {
    const multiplier = getSpeedMultiplier();
    return baseDuration * multiplier;
  }

  // Return base duration for non-game animations (menus, modals, etc.)
  return baseDuration;
}

/**
 * Animation duration presets for common game animations
 * These use the getDuration function and respect user settings
 */
export const GAME_DURATIONS = {
  // Letter box animations
  letterFlip: () => getDuration(0.6), // 3D card flip
  letterReveal: () => getDuration(0.3), // Letter appearing
  letterShake: () => getDuration(0.3), // Incorrect shake

  // Word area animations
  wordSlide: () => getDuration(0.5), // Word sliding in/out
  wordPulse: () => getDuration(0.6), // Word emphasis

  // UI feedback (these are game-specific, so they use speed settings)
  scoreUpdate: () => getDuration(0.8), // Score counting up
  timerWarning: () => getDuration(0.5), // Timer flashing
  confetti: () => getDuration(1.5), // Confetti celebration

  // Transitions
  turnTransition: () => getDuration(1.0), // Player turn transition
  gameStart: () => getDuration(0.8), // Game starting animation
} as const;

/**
 * Non-game animation durations (menus, modals, etc.)
 * These DO NOT use speed multiplier but still respect reduced motion
 */
export const UI_DURATIONS = {
  // Modal & overlay animations
  modalFade: () => getDuration(0.3, { isGameAnimation: false }),
  overlayFade: () => getDuration(0.2, { isGameAnimation: false }),

  // Menu animations
  cardHover: () => getDuration(0.2, { isGameAnimation: false }),
  buttonPress: () => getDuration(0.15, { isGameAnimation: false }),

  // Page transitions
  pageSlide: () => getDuration(0.3, { isGameAnimation: false }),
  fadeInOut: () => getDuration(0.2, { isGameAnimation: false }),
} as const;

/**
 * Hook to get current animation speed setting
 * Useful for components that need to react to speed changes
 */
export function useAnimationSpeed() {
  const animationSpeed = useSettingsStore((state) => state.animationSpeed);
  const multiplier = SPEED_MULTIPLIERS[animationSpeed];

  return {
    speed: animationSpeed,
    multiplier,
    isReduced: prefersReducedMotion(),
  };
}
