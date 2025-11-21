import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundService } from '../../services';

export interface LetterBoxProps {
  letter?: string;
  isRevealed?: boolean;
  status?: 'idle' | 'correct' | 'incorrect';
  totalLetters?: number; // For dynamic sizing
  className?: string;
}

/**
 * LetterBox Component - Design System v2.0
 * Fully responsive letter tile with smooth animations
 * Dynamically sizes based on number of letters in word
 */
export const LetterBox: React.FC<LetterBoxProps> = ({
  letter,
  isRevealed = false,
  status = 'idle',
  totalLetters = 5,
  className = '',
}) => {
  const prevRevealedRef = useRef(isRevealed);

  useEffect(() => {
    if (isRevealed && !prevRevealedRef.current) {
      soundService.playPop();
    }
    prevRevealedRef.current = isRevealed;
  }, [isRevealed]);

  // Dynamic sizing based on number of letters
  // Uses CSS clamp for responsive sizing that adapts to viewport
  const getDynamicSize = () => {
    if (totalLetters <= 4) {
      return {
        width: 'clamp(4rem, 12vw, 10rem)',
        height: 'clamp(5rem, 16vw, 13rem)',
        fontSize: 'clamp(2rem, 8vw, 5rem)',
      };
    } else if (totalLetters <= 6) {
      return {
        width: 'clamp(3.5rem, 10vw, 8rem)',
        height: 'clamp(4.5rem, 13vw, 10.5rem)',
        fontSize: 'clamp(1.75rem, 6.5vw, 4rem)',
      };
    } else if (totalLetters <= 8) {
      return {
        width: 'clamp(3rem, 8.5vw, 7rem)',
        height: 'clamp(4rem, 11vw, 9rem)',
        fontSize: 'clamp(1.5rem, 5.5vw, 3.5rem)',
      };
    } else {
      return {
        width: 'clamp(2.5rem, 7vw, 6rem)',
        height: 'clamp(3.5rem, 9.5vw, 8rem)',
        fontSize: 'clamp(1.25rem, 4.5vw, 3rem)',
      };
    }
  };

  const dynamicSize = getDynamicSize();

  return (
    <motion.div
      className={`
        rounded-xl
        flex items-center justify-center
        font-extrabold uppercase
        border-2 shadow-lg
        transition-colors duration-300
        ${
          isRevealed
            ? 'bg-gradient-to-br from-primary-600 to-primary-500 border-primary-400 text-white'
            : 'bg-gradient-to-br from-neutral-800 to-neutral-700 border-white/10 text-neutral-500'
        }
        ${status === 'correct' ? 'shadow-success-500/50' : ''}
        ${status === 'incorrect' ? 'shadow-error-500/50' : ''}
        ${className}
      `}
      style={{
        width: dynamicSize.width,
        height: dynamicSize.height,
        fontSize: dynamicSize.fontSize,
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={
        isRevealed
          ? {
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 1],
            }
          : { scale: 1, opacity: 1 }
      }
      whileHover={!isRevealed ? { scale: 1.05, y: -4 } : {}}
      whileTap={!isRevealed ? { scale: 0.95 } : {}}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
      }}
    >
      {isRevealed ? <span>{letter}</span> : <span>?</span>}
    </motion.div>
  );
};
