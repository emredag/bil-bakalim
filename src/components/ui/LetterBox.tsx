import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { soundService } from '../../services';

export interface LetterBoxProps {
  letter?: string;
  isRevealed?: boolean;
  status?: 'idle' | 'correct' | 'incorrect';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LetterBox Component - PRD 8.3 (Harf Kutuları)
 *
 * TV Show Quality letter tile for the word game.
 *
 * States:
 * - Closed: slate background with "?" icon
 * - Open: amber background with letter visible
 * - Correct: green glow effect
 * - Incorrect: red flash effect
 *
 * Features:
 * - Responsive sizing (PRD 8.3): w-12 h-14 md:w-14 md:h-16 lg:w-16 lg:h-20
 * - 3D flip animation (PRD 8.4): rotateY 0→180deg, 0.6s
 * - Status glow effects (ui-ux-design.md)
 * - Font size scales with container
 */
export const LetterBox: React.FC<LetterBoxProps> = ({
  letter,
  isRevealed = false,
  status = 'idle',
  size = 'md',
  className = '',
}) => {
  // Track previous revealed state to only play sound on transitions
  const prevRevealedRef = useRef(isRevealed);

  // Play sound when letter is revealed
  useEffect(() => {
    if (isRevealed && !prevRevealedRef.current) {
      soundService.playPop();
    }
    prevRevealedRef.current = isRevealed;
  }, [isRevealed]);

  // Size variants (responsive - PRD 8.3)
  const sizeStyles = {
    sm: 'w-10 h-12 md:w-12 md:h-14 text-xl md:text-2xl',
    md: 'w-12 h-14 md:w-14 md:h-16 lg:w-16 lg:h-20 text-2xl md:text-3xl lg:text-4xl',
    lg: 'w-14 h-16 md:w-16 md:h-20 lg:w-20 lg:h-24 text-3xl md:text-4xl lg:text-5xl',
  };

  // Base styles for both states
  const baseStyles = `
    rounded-lg
    flex items-center justify-center
    font-extrabold
    transition-all duration-200
    ${sizeStyles[size]}
  `;

  // Closed state styles (PRD 8.3)
  const closedStyles = `
    bg-slate-700 border-2 border-slate-600
    text-slate-400
  `;

  // Open state styles (PRD 8.3)
  const openStyles = `
    bg-amber-400 border-2 border-amber-500
    text-slate-900
  `;

  // Status glow effects (ui-ux-design.md)
  const glowStyles = {
    idle: '',
    correct: 'glow-success',
    incorrect: 'glow-error',
  };

  // 3D Flip animation variants (PRD 8.4)
  const flipVariants = {
    closed: {
      rotateY: 0,
      scale: 1,
    },
    open: {
      rotateY: 180,
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1], // easeInOut as cubic bezier
      },
    },
  };

  // Flash animation for incorrect guess
  const incorrectVariants = {
    idle: { x: 0 },
    shake: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`
        ${baseStyles}
        ${isRevealed ? openStyles : closedStyles}
        ${glowStyles[status]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      variants={flipVariants as any}
      initial="closed"
      animate={isRevealed ? 'open' : 'closed'}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front face (closed) */}
      {!isRevealed && (
        <motion.div
          className="flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <HelpCircle className="w-1/2 h-1/2" strokeWidth={2.5} />
        </motion.div>
      )}

      {/* Back face (open) */}
      {isRevealed && (
        <motion.div
          className="flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          variants={status === 'incorrect' ? incorrectVariants : undefined}
          animate={status === 'incorrect' ? 'shake' : 'idle'}
        >
          {letter?.toUpperCase() || '?'}
        </motion.div>
      )}
    </motion.div>
  );
};

LetterBox.displayName = 'LetterBox';

/**
 * LetterBoxRow - Container for multiple letter boxes (word display)
 */
export interface LetterBoxRowProps {
  word: string;
  revealedIndices?: number[];
  status?: 'idle' | 'correct' | 'incorrect';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LetterBoxRow: React.FC<LetterBoxRowProps> = ({
  word,
  revealedIndices = [],
  status = 'idle',
  size = 'md',
  className = '',
}) => {
  const letters = word.split('');

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4 ${className}`}>
      {letters.map((letter, index) => (
        <LetterBox
          key={index}
          letter={letter}
          isRevealed={revealedIndices.includes(index)}
          status={status}
          size={size}
        />
      ))}
    </div>
  );
};

LetterBoxRow.displayName = 'LetterBoxRow';
