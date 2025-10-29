/**
 * GameHeader Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * TV Show Quality Game Header (120px height)
 *
 * Layout:
 * - Left: Category name + emoji
 * - Center: LARGE timer (dominant focal point, tabular-nums)
 * - Right: Score + progress indicator + active player badge
 *
 * Features:
 * - Fully responsive (adapts to all viewport sizes)
 * - Timer pulse animations (last 30s/10s)
 * - Active player/team badge with color/emoji
 * - Score count-up animation
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, User, Users } from 'lucide-react';
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
  gameMode,
}) => {
  // Format timer as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer warning states
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 10;
  const isCritical = remainingSeconds <= 10;

  // Timer color and animation
  const timerColor = isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-100';

  return (
    <header className="h-[120px] bg-slate-800/90 backdrop-blur-sm border-b-2 border-slate-700 px-4 md:px-6 lg:px-8">
      <div className="h-full max-w-[2000px] mx-auto flex items-center justify-between gap-4">
        {/* LEFT: Category */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-3xl md:text-4xl lg:text-5xl shrink-0" aria-hidden="true">
            {categoryEmoji}
          </span>
          <div className="min-w-0">
            <h2 className="text-base md:text-lg lg:text-xl font-bold text-slate-100 truncate">
              {categoryName}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 truncate">Kelime Oyunu</p>
          </div>
        </div>

        {/* CENTER: Timer (DOMINANT) */}
        <div className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[180px] lg:min-w-[220px]">
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={
                isCritical ? { scale: [1, 1.1, 1] } : isWarning ? { scale: [1, 1.05, 1] } : {}
              }
              transition={
                isCritical
                  ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                  : isWarning
                    ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                    : {}
              }
            >
              <Clock className={`w-5 h-5 md:w-6 md:h-6 ${timerColor}`} aria-hidden="true" />
            </motion.div>
            <span className="text-xs md:text-sm text-slate-400 uppercase tracking-wide">Süre</span>
          </div>
          <motion.div
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tabular-nums ${timerColor}`}
            role="timer"
            aria-label={`Kalan süre ${formatTime(remainingSeconds)}`}
            aria-live="polite"
            animate={isCritical ? { opacity: [1, 0.5, 1] } : {}}
            transition={isCritical ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } : {}}
          >
            {formatTime(remainingSeconds)}
          </motion.div>
          {/* Progress ring visual indicator */}
          <div className="mt-2 w-full max-w-[150px] h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              initial={{ width: '100%' }}
              animate={{
                width: `${(remainingSeconds / totalSeconds) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* RIGHT: Score, Progress, Active Player */}
        <div className="flex flex-col items-end gap-2 min-w-0 flex-1">
          {/* Score */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" aria-hidden="true" />
            <div className="text-right">
              <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide">Puan</div>
              <motion.div
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-400 tabular-nums"
                key={currentScore}
                initial={{ scale: 1.2, color: '#fbbf24' }}
                animate={{ scale: 1, color: '#34d399' }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
                aria-label={`Puan: ${currentScore}`}
              >
                {currentScore}
              </motion.div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-xs md:text-sm text-slate-400">Kelime İlerlemesi</div>
            <div className="text-base md:text-lg lg:text-xl font-bold text-slate-100 tabular-nums">
              {wordsCompleted}/{totalWords}
            </div>
          </div>

          {/* Active Player Badge */}
          {gameMode !== 'single' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeParticipantName}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full
                  ${
                    activeParticipantType === 'team' && activeParticipantColor
                      ? `bg-${activeParticipantColor}-500/20 border-2 border-${activeParticipantColor}-500`
                      : 'bg-blue-500/20 border-2 border-blue-500'
                  }
                `}
              >
                {activeParticipantType === 'team' ? (
                  <Users className="w-4 h-4 text-slate-100" aria-hidden="true" />
                ) : (
                  <User className="w-4 h-4 text-slate-100" aria-hidden="true" />
                )}
                {activeParticipantEmoji && (
                  <span className="text-lg" aria-hidden="true">
                    {activeParticipantEmoji}
                  </span>
                )}
                <span className="text-xs md:text-sm font-bold text-slate-100 truncate max-w-[120px]">
                  {activeParticipantName}
                </span>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </header>
  );
};
