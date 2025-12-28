/**
 * HeroSection Component
 * Design System v2.0 - Main Menu Migration
 *
 * Hero section with prominent CTA and optional last game link
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export interface HeroSectionProps {
  onStartGame: () => void;
}

/**
 * Hero animation variants
 * Subtle fade + slight rise animation
 */
const heroVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const, // cubic-bezier for smooth feel
    },
  },
};

export function HeroSection({ onStartGame }: HeroSectionProps) {

  return (
    <motion.section
      className="hero-section relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 lg:p-16 text-center"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      style={{
        boxShadow: '0 20px 60px rgba(14, 165, 233, 0.2)',
      }}
    >
      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background: `
            radial-gradient(at 40% 20%, var(--primary-500) 0px, transparent 50%),
            radial-gradient(at 80% 0%, var(--accent-500) 0px, transparent 50%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Title */}
        <h1
          className="font-display font-extrabold text-white leading-tight tracking-tight flex items-center gap-4"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '-0.025em',
          }}
        >
          <Logo size={64} /> Bil Bakalım
        </h1>

        {/* Description */}
        <p
          className="font-medium text-white/80 max-w-2xl"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          Eğlenceli Kelime Tahmin Yarışması
        </p>

        {/* Primary CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={onStartGame}
          icon={<Sparkles size={24} />}
          className="mt-2 shadow-2xl hover:shadow-glow-primary transform hover:scale-102 active:scale-100"
        >
          Yeni Yarışma Başlat
        </Button>
      </div>
    </motion.section>
  );
}
