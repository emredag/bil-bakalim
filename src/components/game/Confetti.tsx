/**
 * Confetti Component - PRD 4.5, DESIGN_SYSTEM.md
 *
 * Enhanced canvas-based confetti animation for correct answers
 *
 * Features:
 * - Canvas-based particle system (z-30 layer)
 * - Multiple particle shapes (square, circle, star)
 * - Design System color palette
 * - Triggered on correct answer
 * - Performance-optimized (60 FPS)
 * - Respects "reduce motion" preference
 * - Auto-cleanup after animation
 */

import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number; // in ms, default 3000
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  gravity: number;
  shape: 'square' | 'circle' | 'star';
}

// Design System colors (from DESIGN_SYSTEM.md#mesh-gradient-celebration)
const COLORS = [
  '#0ea5e9', // primary-500
  '#f59e0b', // accent-500
  '#a855f7', // secondary-500
  '#22c55e', // success-500
  '#ec4899', // pink-500
  '#38bdf8', // primary-400
  '#fbbf24', // accent-400
];

const SHAPES: Array<'square' | 'circle' | 'star'> = ['square', 'circle', 'star'];

// Draw a star shape
const drawStar = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string
) => {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size / 2;

  ctx.beginPath();
  ctx.fillStyle = color;

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
};

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 3000, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !active) {
      if (onComplete) onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles (Design System: 150 particles)
    const particleCount = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.5; // Slightly higher than center

    particlesRef.current = Array.from({ length: particleCount }, () => {
      // Wider spread for better coverage
      const angle = (Math.random() - 0.5) * Math.PI * 1.2; // 70 degree spread
      const velocity = 8 + Math.random() * 15;

      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 8, // Strong upward bias
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        gravity: 0.5 + Math.random() * 0.3,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      };
    });

    startTimeRef.current = Date.now();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const elapsed = Date.now() - (startTimeRef.current || 0);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if animation should end
      if (elapsed >= duration) {
        particlesRef.current = [];
        if (onComplete) onComplete();
        return;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update physics
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Keep particles that are still visible
        const isVisible = particle.y < canvas.height + 50;

        if (isVisible) {
          // Draw particle based on shape
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);

          if (particle.shape === 'square') {
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          } else if (particle.shape === 'circle') {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (particle.shape === 'star') {
            drawStar(ctx, particle.size / 2, particle.color);
          }

          ctx.restore();
        }

        return isVisible;
      });

      // Continue animation
      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      particlesRef.current = [];
    };
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30" aria-hidden="true" />
  );
};
