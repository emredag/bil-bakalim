/**
 * ControlPanel Component - Game Control Panel
 *
 * Two-mode control panel for the word guessing game:
 * 
 * Normal Mode (isGuessing=false):
 * - Shows "Harf Aç" button only (when showButtons=true)
 * - "Tahmin Et" button is rendered separately in GameScreen
 *
 * Guess Mode (isGuessing=true):
 * - Shows countdown timer prominently
 * - Shows Doğru/Yanlış buttons (when showButtons=true)
 *
 * Features:
 * - showButtons toggle for projection mode (keyboard shortcuts only)
 * - Glassmorphism design optimized for projection
 * - Minimum 48×48px touch targets
 * - Keyboard shortcuts displayed
 * - Fully responsive layout
 */

import React from 'react';
import { Eye, Check, X, Lightbulb, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface ControlPanelProps {
  // Actions
  onRevealLetter: () => void;
  onGuessCorrect: () => void;
  onGuessWrong: () => void;
  onPause: () => void;
  onToggleSound: () => void;
  onHome: () => void;

  // States
  canRevealLetter: boolean;
  isInTransition: boolean;
  isGuessing: boolean;
  guessTimeRemaining: number;
  soundEnabled: boolean;
  showButtons: boolean; // If false, only show info (keyboard shortcuts / projection mode)

  // Info
  lettersRevealed: number;
  remainingPoints: number;

  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onRevealLetter,
  onGuessCorrect,
  onGuessWrong,
  onPause: _onPause,
  onToggleSound: _onToggleSound,
  onHome: _onHome,
  canRevealLetter,
  isInTransition,
  isGuessing,
  guessTimeRemaining,
  soundEnabled: _soundEnabled,
  showButtons,
  lettersRevealed,
  remainingPoints,
  className = '',
}) => {
  // Format time for display
  const formatTime = (seconds: number) => {
    return seconds.toString();
  };

  // Determine if guess timer is in warning state (last 10 seconds)
  const isTimerWarning = guessTimeRemaining <= 10 && guessTimeRemaining > 0;

  return (
    <div className={`w-full ${className}`} role="region" aria-label="Kontrol paneli">
      {/* Single row layout with all elements */}
      <div
        className="flex items-center justify-center gap-4 lg:gap-6 px-4 md:px-6 py-3 md:py-4
                   bg-neutral-900/80 backdrop-blur-xl
                   border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Info Section - Always visible */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 md:w-5 md:h-5 text-accent-400" aria-hidden="true" />
            <span className="text-sm md:text-base text-neutral-300 tabular-nums">
              <span className="font-bold text-neutral-50">{lettersRevealed}</span> harf
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-success-400" aria-hidden="true" />
            <span className="text-sm md:text-base text-neutral-300 tabular-nums">
              <span className="font-bold text-accent-400">{remainingPoints}</span> puan
            </span>
          </div>
        </div>

        {/* Guess Timer - Always visible when in guess mode */}
        {isGuessing && (
          <>
            <div className="w-px h-8 bg-white/10" aria-hidden="true" />
            <div
              className={`flex items-center justify-center min-w-[80px] md:min-w-[100px] h-12 md:h-14 px-3 md:px-4
                         rounded-xl border-2 transition-colors
                         ${isTimerWarning 
                           ? 'bg-error-500/30 border-error-500 animate-pulse' 
                           : 'bg-accent-500/20 border-accent-500/50'}`}
            >
              <Clock className={`w-5 h-5 md:w-6 md:h-6 mr-2 ${isTimerWarning ? 'text-error-400' : 'text-accent-400'}`} />
              <span className={`font-mono text-2xl md:text-3xl font-bold tabular-nums
                               ${isTimerWarning ? 'text-error-400' : 'text-accent-100'}`}>
                {formatTime(guessTimeRemaining)}
              </span>
            </div>
          </>
        )}

        {/* Separator before buttons */}
        {showButtons && (
          <div className="w-px h-8 bg-white/10" aria-hidden="true" />
        )}

        {/* Action Buttons - Only when showButtons is true */}
        {showButtons && !isGuessing && (
          <Button
            onClick={onRevealLetter}
            disabled={!canRevealLetter || isInTransition}
            variant="secondary"
            size="lg"
            className="min-w-[120px] md:min-w-[140px] h-12 md:h-14 text-sm md:text-base font-semibold"
            aria-label="Harf aç, klavye kısayolu H"
          >
            <Lightbulb className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            Harf Aç
            <kbd className="ml-2 px-1.5 py-0.5 bg-neutral-700/50 rounded text-xs">H</kbd>
          </Button>
        )}

        {/* Guess Mode Buttons - Only when showButtons is true and in guess mode */}
        {showButtons && isGuessing && (
          <>
            <Button
              onClick={onGuessCorrect}
              disabled={isInTransition}
              variant="primary"
              size="lg"
              className="min-w-[110px] md:min-w-[130px] h-12 md:h-14 text-sm md:text-base font-semibold
                         bg-success-500/20 hover:bg-success-500/30
                         border-2 border-success-500/50 hover:border-success-500
                         text-success-100"
              aria-label="Kelimeyi doğru bildiniz, klavye kısayolu D"
            >
              <Check className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
              Doğru
              <kbd className="ml-2 px-1.5 py-0.5 bg-success-700/50 rounded text-xs">D</kbd>
            </Button>

            <Button
              onClick={onGuessWrong}
              disabled={isInTransition}
              variant="destructive"
              size="lg"
              className="min-w-[110px] md:min-w-[130px] h-12 md:h-14 text-sm md:text-base font-semibold
                         bg-error-500/20 hover:bg-error-500/30
                         border-2 border-error-500/50 hover:border-error-500
                         text-error-100"
              aria-label="Kelimeyi yanlış bildiniz, klavye kısayolu Y"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
              Yanlış
              <kbd className="ml-2 px-1.5 py-0.5 bg-error-700/50 rounded text-xs">Y</kbd>
            </Button>
          </>
        )}

        {/* Keyboard shortcuts hint when buttons are hidden */}
        {!showButtons && (
          <div className="text-xs text-neutral-500">
            {isGuessing ? 'D: Doğru • Y: Yanlış' : 'H: Harf Aç • T: Tahmin Et'}
          </div>
        )}
      </div>
    </div>
  );
};
