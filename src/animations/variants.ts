/**
 * Animation Variants - PRD 8.4 & ui-ux-design.md#motion
 *
 * Centralized Framer Motion animation variants for consistent
 * TV Show Quality animations throughout the application.
 *
 * All animations use transform/opacity for 60 FPS performance.
 */

import { Variants } from 'framer-motion';

/**
 * Page Transition Variants
 * PRD 8.4: Fade (0→1, 0.3s) + Slide (x: 20→0, 0.3s easeOut)
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Fade Only Variant (for overlays/modals)
 */
export const fadeVariant: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * Scale + Fade Variant (for modals/dialogs)
 */
export const scaleVariant: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Shake Animation (Wrong Answer)
 * PRD 8.4: x: 0→-10→10→0, 0.3s
 */
export const shakeVariant: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Pulse Animation Variants
 * PRD 8.4: Used for correct answer and time warnings
 */
export const pulseVariant: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1, 1.1, 1, 1.1, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Soft Pulse (30 second warning)
 * ui-ux-design.md: scale 1→1.05, yumuşak
 */
export const softPulseVariant: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Fast Pulse (10 second critical warning)
 * ui-ux-design.md: hızlı pulse + renk kırmızıya
 */
export const fastPulseVariant: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Stagger Children Container
 * For lists/grids that animate in sequence
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger Item (child of staggerContainer)
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide Up Variant (bottom sheets, notifications)
 */
export const slideUpVariant: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Glow Animation (for correct answers)
 * Coordinates with CSS .glow-success class
 */
export const glowVariant: Variants = {
  idle: { opacity: 0 },
  glow: {
    opacity: [0, 1, 0.8, 1, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Flash Overlay (for wrong answers)
 * Red flash effect
 */
export const flashOverlayVariant: Variants = {
  idle: { opacity: 0 },
  flash: {
    opacity: [0, 0.3, 0, 0.3, 0],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Hover Scale (for cards/buttons)
 * ui-ux-design.md: scale 1→1.05, 0.2s
 */
export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

/**
 * 3D Flip (Letter Reveal)
 * PRD 8.4: rotateY 0→180deg, scale 1→1.1→1, 0.6s spring
 */
export const flipVariant: Variants = {
  closed: {
    rotateY: 0,
    scale: 1,
  },
  open: {
    rotateY: 180,
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Skeleton Loading Pulse
 * Uses Tailwind's animate-pulse, but can be enhanced
 */
export const skeletonPulse: Variants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Spring Config Presets
 * For physics-based animations - tuned for subtle, professional feel
 */
export const springConfig = {
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 20,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 35,
  },
};

/**
 * Transition Presets
 * Common easing curves
 */
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
};
