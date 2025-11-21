/**
 * HeroSection Component
 * Design System v2.0 - Main Menu Migration
 *
 * Hero section with prominent CTA and optional last game link
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { LastGameSummary } from '../../types/database';

export interface HeroSectionProps {
  onStartGame: () => void;
  lastGame?: LastGameSummary | null;
  onResumeGame?: (gameId: number) => void;
}

/**
 * Hero animation variants
 * Spring-based animation with scale + fade
 */
const heroVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      delay: 0.1,
    },
  },
};

export function HeroSection({ onStartGame, lastGame, onResumeGame }: HeroSectionProps) {
  const handleResumeClick = () => {
    if (lastGame && onResumeGame) {
      onResumeGame(lastGame.id);
    }
  };

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
          className="font-display font-extrabold text-white leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '-0.025em',
          }}
        >
          🎯 Kelime Oyunu
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
          className="mt-2 shadow-2xl hover:shadow-glow-primary transform hover:scale-105 active:scale-100"
        >
          Yeni Yarışma Başlat
        </Button>

        {/* Optional: Continue last game link */}
        {lastGame && onResumeGame && (
          <p className="text-sm text-white/60 mt-2">
            veya{' '}
            <button
              className="text-accent-400 hover:text-accent-300 underline font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded px-1"
              onClick={handleResumeClick}
            >
              son oyununa devam et
            </button>
          </p>
        )}
      </div>
    </motion.section>
  );
}
