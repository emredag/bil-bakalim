/**
 * WordArea Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * Fully Responsive TV Show Quality Word Display Area
 *
 * Features:
 * - Dynamic letter tile grid with viewport-based sizing
 * - Letter tiles with smooth reveal animations
 * - Status glow effects (correct = green, wrong = red flash + shake)
 * - Closed state: Slate bg with "?" icon
 * - Open state: Amber bg with letter (extrabold)
 * - Automatically adapts to any number of letters
 * - Always fits on screen regardless of device
 * - Wrong answer shake animation (Design System)
 *
 * Uses the responsive LetterBox component
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterBox } from '../ui/LetterBox';
import type { Letter } from '../../types';

interface WordAreaProps {
  letters: Letter[];
  wordStatus?: 'idle' | 'correct' | 'incorrect';
  className?: string;
}

export const WordArea: React.FC<WordAreaProps> = ({
  letters,
  wordStatus = 'idle',
  className = '',
}) => {
  const letterCount = letters.length;

  // Dynamic gap based on number of letters
  const getGapClass = () => {
    if (letterCount <= 4) return 'gap-4 md:gap-6 lg:gap-8';
    if (letterCount <= 6) return 'gap-3 md:gap-4 lg:gap-6';
    if (letterCount <= 8) return 'gap-2 md:gap-3 lg:gap-4';
    return 'gap-2 md:gap-2.5 lg:gap-3';
  };

  return (
    <section
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{
        minHeight: 'clamp(200px, 30vh, 400px)',
      }}
    >
      {/* Animated Spotlight Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            wordStatus === 'incorrect'
              ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          opacity: wordStatus === 'incorrect' ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
          scale: wordStatus === 'incorrect' ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: wordStatus === 'incorrect' ? 0.5 : 4,
          repeat: wordStatus === 'incorrect' ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Word Container - Always centered, no wrapping */}
      <AnimatePresence mode="wait">
        <motion.div
          key={wordStatus}
          className={`
            relative z-10
            flex items-center justify-center
            ${getGapClass()}
            w-full px-4 md:px-8
          `}
          role="region"
          aria-label="Kelime alanı"
          animate={
            wordStatus === 'incorrect'
              ? {
                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                }
              : {}
          }
          transition={{
            duration: wordStatus === 'incorrect' ? 0.5 : 0,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {letters.map((letter, index) => (
            <LetterBox
              key={`${index}-${letter.char}`}
              letter={letter.char}
              isRevealed={letter.status === 'revealed'}
              status={wordStatus}
              totalLetters={letterCount}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
