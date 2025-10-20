/**
 * Particle Background Component
 * Task 08: Main Menu Screen - Subtle particle/parıltı layer
 *
 * Performance-optimized CSS-based particle effect for TV show quality
 * Respects 'prefers-reduced-motion' accessibility setting
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../animations/useReducedMotion';

/**
 * ParticleBackground - Subtle animated particles for TV show atmosphere
 *
 * Features:
 * - CSS-based animation (no canvas overhead)
 * - Performance-friendly (transform/opacity only)
 * - Respects reduced motion preference
 * - Multiple particle sizes and speeds for depth
 */
export function ParticleBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Don't render if user prefers reduced motion
  if (shouldReduceMotion) {
    return null;
  }

  // Create particles with varied sizes and speeds
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2, // 2-6px
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 15, // 15-35s
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/40 blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
