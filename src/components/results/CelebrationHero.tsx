import { motion } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';
import type { GameMode } from '../../types/game';

interface CelebrationHeroProps {
  playerName?: string;
  score: number;
  mode: GameMode;
  categoryEmoji?: string;
  categoryName?: string;
}

/**
 * Get celebration message based on score and mode
 */
function getCelebrationMessage(score: number, mode: GameMode): string {
  // Maximum possible score is 9,800 (all words with 0 hints)
  const percentage = (score / 9800) * 100;

  if (percentage >= 90) {
    return mode === 'single' ? 'Mükemmel Performans!' : 'Şampiyonluk Performansı!';
  } else if (percentage >= 75) {
    return mode === 'single' ? 'Harika Oyun!' : 'Muhteşem Bir Yarış!';
  } else if (percentage >= 50) {
    return 'İyi Oyun!';
  } else {
    return 'Oyun Bitti!';
  }
}

export default function CelebrationHero({
  playerName,
  score,
  mode,
  categoryEmoji,
  categoryName,
}: CelebrationHeroProps) {
  const message = getCelebrationMessage(score, mode);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl px-8 py-12 text-center"
      style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #581c87 100%)', // primary-900 → secondary-900
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgb(245, 158, 11) 0px, transparent 50%)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Animated celebration icon */}
        <motion.div
          className="mb-6 text-6xl"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          🎉
        </motion.div>

        {/* Celebration message */}
        <motion.h1
          className="mb-2 font-display text-4xl font-extrabold tracking-tight text-neutral-50 md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h1>

        {/* Category info (if provided) */}
        {categoryEmoji && categoryName && (
          <motion.p
            className="mb-8 text-lg text-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {categoryEmoji} {categoryName}
          </motion.p>
        )}

        {/* Animated score display */}
        <motion.div
          className="mx-auto mb-6 inline-block rounded-xl bg-black/20 px-8 py-6 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Toplam Puan
          </div>
          <div
            className="font-mono text-6xl font-bold md:text-7xl"
            style={{
              color: 'rgb(251, 191, 36)', // accent-400
              textShadow: '0 4px 20px rgba(245, 158, 11, 0.5)',
            }}
          >
            <AnimatedNumber value={score} duration={2000} />
          </div>
        </motion.div>

        {/* Player name (for single player mode) */}
        {mode === 'single' && playerName && (
          <motion.p
            className="text-xl font-semibold text-neutral-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {playerName}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
