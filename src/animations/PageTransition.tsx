/**
 * PageTransition Component
 * PRD 8.4 - Page Transitions (Fade + Slide)
 *
 * Wrapper component for smooth page transitions using Framer Motion.
 * Uses AnimatePresence for enter/exit animations.
 *
 * Features:
 * - Fade in: opacity 0→1 (0.3s)
 * - Slide in: x: 20→0 (0.3s easeOut)
 * - Respects reduce motion preference
 * - Automatic layout shifting prevention
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransition } from './variants';
import { useReducedMotion } from './useReducedMotion';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition - Wraps page content with enter/exit animations
 *
 * Usage:
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // If reduce motion, skip animations
  const variants = shouldReduceMotion
    ? undefined
    : pageTransition;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? undefined : 'initial'}
        animate={shouldReduceMotion ? undefined : 'animate'}
        exit={shouldReduceMotion ? undefined : 'exit'}
        variants={variants}
        className={className}
        style={{
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

PageTransition.displayName = 'PageTransition';

/**
 * FadeTransition - Simple fade only (for overlays/modals)
 */
export interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  show,
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

FadeTransition.displayName = 'FadeTransition';

/**
 * ScaleTransition - Scale + Fade (for modals/dialogs)
 */
export interface ScaleTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ScaleTransition: React.FC<ScaleTransitionProps> = ({
  show,
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ScaleTransition.displayName = 'ScaleTransition';

/**
 * SlideUpTransition - Slide from bottom (for sheets/notifications)
 */
export interface SlideUpTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SlideUpTransition: React.FC<SlideUpTransitionProps> = ({
  show,
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 50 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SlideUpTransition.displayName = 'SlideUpTransition';
