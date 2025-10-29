/**
 * Confetti Component - PRD 8.4 (Correct Answer Animation)
 * ui-ux-design.md#motion - TV Show Quality confetti
 *
 * Canvas-based particle system for celebratory confetti effect.
 * Optimized for 60 FPS performance using requestAnimationFrame.
 *
 * Features:
 * - Physics-based particle motion (gravity, rotation)
 * - Multiple colors (gold, blue, violet, emerald)
 * - Configurable particle count and duration
 * - Automatic cleanup
 * - Respects reduce motion preference
 */

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ConfettiProps {
  /** Number of confetti particles (default: 100) */
  particleCount?: number;
  /** Duration in milliseconds (default: 3000) */
  duration?: number;
  /** Trigger confetti (set to true to fire) */
  active?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Origin point (default: center) */
  origin?: { x: number; y: number };
  /** Spread angle in degrees (default: 60) */
  spread?: number;
  /** Z-index for canvas (default: 30) */
  zIndex?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
}

// TV Show Quality colors (PRD 8.1)
const CONFETTI_COLORS = [
  '#fbbf24', // gold/amber-400
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#6366f1', // indigo-500
];

/**
 * Confetti Component
 *
 * Usage:
 * ```tsx
 * const [showConfetti, setShowConfetti] = useState(false);
 *
 * <Confetti
 *   active={showConfetti}
 *   onComplete={() => setShowConfetti(false)}
 * />
 * ```
 */
export const Confetti: React.FC<ConfettiProps> = ({
  particleCount = 100,
  duration = 3000,
  active = false,
  onComplete,
  origin = { x: 0.5, y: 0.5 },
  spread = 60,
  zIndex = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || shouldReduceMotion) {
      // Don't show confetti if reduce motion is enabled
      if (shouldReduceMotion && onComplete) {
        onComplete();
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Handle resize
    window.addEventListener('resize', setCanvasSize);

    // Create particles
    const particles: Particle[] = [];
    const originX = canvas.width * origin.x;
    const originY = canvas.height * origin.y;
    const spreadRad = (spread * Math.PI) / 180;

    for (let i = 0; i < particleCount; i++) {
      // Random angle within spread
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad;
      const velocity = 5 + Math.random() * 10;

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        width: 8 + Math.random() * 6,
        height: 8 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        opacity: 1,
      });
    }

    particlesRef.current = particles;
    startTimeRef.current = Date.now();

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      const elapsed = Date.now() - (startTimeRef.current || 0);
      const progress = Math.min(elapsed / duration, 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Physics
        particle.vy += 0.3; // gravity
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Fade out near end
        particle.opacity = 1 - Math.pow(progress, 2);

        // Draw
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        ctx.restore();
      });

      // Continue animation or complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, particleCount, duration, onComplete, origin, spread, shouldReduceMotion]);

  // Don't render if reduce motion
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
};

Confetti.displayName = 'Confetti';

/**
 * Utility function to trigger confetti programmatically
 *
 * Usage:
 * ```tsx
 * import { triggerConfetti } from './Confetti';
 *
 * triggerConfetti({ particleCount: 150 });
 * ```
 */
export function triggerConfetti(_options: Omit<ConfettiProps, 'active'> = {}): void {
  // This would need a global confetti instance
  // For now, use the component directly with state
  console.log('Use <Confetti active={true} /> component instead');
}
