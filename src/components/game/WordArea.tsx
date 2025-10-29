/**
 * WordArea Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * TV Show Quality Word Display Area (500px target height)
 *
 * Features:
 * - Dynamic letter tile grid with responsive spacing
 * - Letter tiles with 3D flip animations
 * - Status glow effects (correct = green, wrong = red flash)
 * - Closed state: Slate bg with "?" icon
 * - Open state: Amber bg with letter (extrabold)
 * - Fully responsive tile sizing
 *
 * Uses the existing LetterBox component
 */

import React from 'react';
import { motion } from 'framer-motion';
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
  // Determine grid columns based on word length
  const getGridColumns = (length: number): string => {
    if (length <= 4) return 'grid-cols-4';
    if (length <= 6) return 'grid-cols-6';
    if (length <= 8) return 'grid-cols-8';
    return 'grid-cols-10';
  };

  // Responsive gap spacing
  const gapClass = 'gap-2 md:gap-3 lg:gap-4';

  return (
    <motion.div
      className={`
        flex-1 min-h-0
        flex items-center justify-center
        px-4 md:px-6 lg:px-8 py-4
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`
          grid
          ${getGridColumns(letters.length)}
          ${gapClass}
          max-w-7xl
        `}
        role="region"
        aria-label="Kelime alanı"
      >
        {letters.map((letter, index) => (
          <LetterBox
            key={`${index}-${letter.char}`}
            letter={letter.char}
            isRevealed={letter.status === 'revealed'}
            status={wordStatus}
            size="md"
          />
        ))}
      </div>
    </motion.div>
  );
};
