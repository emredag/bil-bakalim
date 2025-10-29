/**
 * Confetti Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * Canvas-based confetti animation for correct answers
 *
 * Features:
 * - Canvas-based particle system (z-30 layer)
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
}

const COLORS = ['#fbbf24', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#ec4899'];

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

    // Initialize particles
    const particleCount = 100;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    particlesRef.current = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;
      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5, // Bias upward
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        gravity: 0.3 + Math.random() * 0.2,
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
          // Draw particle (simple square)
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
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
