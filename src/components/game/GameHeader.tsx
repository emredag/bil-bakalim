/**
 * GameHeader Component - Design System v2.0
 *
 * Floating Glassmorphism Game Header
 *
 * Layout:
 * - Horizontal flex: Timer | Score | Player | Category
 * - Circular progress timer (SVG-based)
 * - Glassmorphism background with backdrop blur
 * - Animated score updates
 *
 * Features:
 * - Fully responsive
 * - Warning states (≤10s critical pulse)
 * - Active player/team badge
 * - Score count-up animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import type { GameMode, ParticipantType } from '../../types';

interface GameHeaderProps {
  // Category info
  categoryName: string;
  categoryEmoji: string;

  // Timer
  remainingSeconds: number;
  totalSeconds: number;

  // Score & Progress
  currentScore: number;
  wordsCompleted: number;
  totalWords: number;

  // Active participant
  activeParticipantName: string;
  activeParticipantType: ParticipantType;
  activeParticipantColor?: string; // For team mode
  activeParticipantEmoji?: string; // For team mode
  gameMode: GameMode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  categoryName,
  categoryEmoji,
  remainingSeconds,
  totalSeconds,
  currentScore,
  wordsCompleted,
  totalWords,
  activeParticipantName,
  activeParticipantType,
  activeParticipantColor,
  activeParticipantEmoji,
  gameMode: _gameMode, // Not currently used but kept for future team mode features
}) => {
  const isCritical = remainingSeconds <= 10;

  return (
    <header className="w-full">
      <div
        className="flex items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-4
                   bg-neutral-900/70 backdrop-blur-xl
                   border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Circular Timer */}
        <div className="flex-shrink-0">
          <CircularTimer seconds={remainingSeconds} total={totalSeconds} warning={isCritical} />
        </div>

        {/* Score - Animated (Optimized for projection) */}
        <motion.div
          key={currentScore}
          initial={{ scale: 1.2, color: 'rgb(245, 158, 11)' }}
          animate={{ scale: 1, color: 'rgb(250, 250, 250)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center min-w-[100px] lg:min-w-[140px]"
        >
          <span className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-50 tabular-nums">
            {currentScore}
          </span>
          <span className="text-sm lg:text-base text-neutral-400">puan</span>
        </motion.div>

        {/* Player/Team Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              activeParticipantType === 'team' && activeParticipantColor
                ? `bg-${activeParticipantColor}-500/20 border border-${activeParticipantColor}-500/50`
                : 'bg-primary-500/20 border border-primary-500/50'
            }`}
          >
            {activeParticipantType === 'team' ? (
              <Users className="w-4 h-4 text-neutral-50" aria-hidden="true" />
            ) : (
              <User className="w-4 h-4 text-neutral-50" aria-hidden="true" />
            )}
            {activeParticipantEmoji && (
              <span className="text-lg lg:text-xl" aria-hidden="true">
                {activeParticipantEmoji}
              </span>
            )}
            <span className="text-base lg:text-lg font-medium text-neutral-50 truncate max-w-[150px] lg:max-w-[200px]">
              {activeParticipantName}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 border border-white/10">
          <span className="text-xl lg:text-2xl" aria-hidden="true">
            {categoryEmoji}
          </span>
          <span className="text-base lg:text-lg font-medium text-neutral-100 truncate max-w-[180px] lg:max-w-[220px]">
            {categoryName}
          </span>
        </div>

        {/* Progress (mobile hidden, tablet+) */}
        <div className="hidden lg:flex flex-col items-end min-w-[80px]">
          <span className="text-lg lg:text-xl font-bold text-neutral-50 tabular-nums">
            {wordsCompleted}/{totalWords}
          </span>
          <span className="text-sm lg:text-base text-neutral-400">kelime</span>
        </div>
      </div>
    </header>
  );
};
