/**
 * ControlPanel Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * TV Show Quality Control Panel (280px target height)
 *
 * Features:
 * - 3 main action buttons: Harf Aç (H), Tahmin Et (T), Pas Geç (P)
 * - Info bar: Remaining guesses, letters revealed, remaining points
 * - Side controls: Pause, Sound toggle, Home (with confirmation)
 * - Minimum 48×48px touch targets
 * - Keyboard shortcuts displayed
 * - Fully responsive layout
 */

import React from 'react';
import { Eye, Check, X, SkipForward, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface ControlPanelProps {
  // Actions
  onRevealLetter: () => void;
  onGuessCorrect: () => void;
  onGuessWrong: () => void;
  onSkip: () => void;
  onPause: () => void;
  onToggleSound: () => void;
  onHome: () => void;

  // States
  canRevealLetter: boolean;
  canGuess: boolean;
  canSkip: boolean;
  soundEnabled: boolean;

  // Info
  remainingGuesses: number;
  lettersRevealed: number;
  remainingPoints: number;

  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onRevealLetter,
  onGuessCorrect,
  onGuessWrong,
  onSkip,
  onPause: _onPause, // Side controls to be added in future update
  onToggleSound: _onToggleSound, // Side controls to be added in future update
  onHome: _onHome, // Side controls to be added in future update
  canRevealLetter,
  canGuess,
  canSkip,
  soundEnabled: _soundEnabled, // Used with sound toggle control
  remainingGuesses,
  lettersRevealed,
  remainingPoints,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} role="region" aria-label="Kontrol paneli">
      <div className="flex flex-col items-center gap-4">
        {/* Action Buttons - Floating Glassmorphism Container (Optimized for projection) */}
        <div
          className="flex items-center justify-center gap-3 lg:gap-4 px-6 py-4
                     bg-neutral-900/70 backdrop-blur-xl
                     border border-white/10 rounded-2xl shadow-2xl
                     flex-wrap"
        >
          {/* Harf Aç Button */}
          <Button
            onClick={onRevealLetter}
            disabled={!canRevealLetter}
            variant="secondary"
            size="lg"
            className="min-w-[120px] lg:min-w-[140px] h-16 lg:h-18 text-base lg:text-lg font-semibold"
            aria-label="Harf aç, klavye kısayolu H"
          >
            <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" />
            <span>Harf Aç</span>
            <kbd className="ml-2 px-2 py-0.5 bg-neutral-700 rounded text-xs lg:text-sm">H</kbd>
          </Button>

          {/* Doğru Button - Inline (replaces modal) */}
          <Button
            onClick={onGuessCorrect}
            disabled={!canGuess}
            variant="primary"
            size="lg"
            className="min-w-[140px] lg:min-w-[160px] h-16 lg:h-18 text-base lg:text-lg font-semibold
                       bg-success-500/20 hover:bg-success-500/30
                       border-2 border-success-500/50 hover:border-success-500
                       text-success-100"
            aria-label="Kelimeyi doğru bildiniz, klavye kısayolu D"
          >
            <Check className="w-6 h-6 lg:w-7 lg:h-7" aria-hidden="true" />
            <span>Doğru</span>
            <kbd className="ml-2 px-2 py-0.5 bg-success-700 rounded text-xs lg:text-sm">D</kbd>
          </Button>

          {/* Yanlış Button - Inline (replaces modal) */}
          <Button
            onClick={onGuessWrong}
            disabled={!canGuess}
            variant="destructive"
            size="lg"
            className="min-w-[140px] lg:min-w-[160px] h-16 lg:h-18 text-base lg:text-lg font-semibold
                       bg-error-500/20 hover:bg-error-500/30
                       border-2 border-error-500/50 hover:border-error-500
                       text-error-100"
            aria-label="Kelimeyi yanlış bildiniz, klavye kısayolu Y"
          >
            <X className="w-6 h-6 lg:w-7 lg:h-7" aria-hidden="true" />
            <span>Yanlış</span>
            <kbd className="ml-2 px-2 py-0.5 bg-error-700 rounded text-xs lg:text-sm">Y</kbd>
          </Button>

          {/* Atla Button */}
          <Button
            onClick={onSkip}
            disabled={!canSkip}
            variant="secondary"
            size="lg"
            className="min-w-[120px] lg:min-w-[140px] h-16 lg:h-18 text-base lg:text-lg font-semibold"
            aria-label="Pas geç, klavye kısayolu P"
          >
            <SkipForward className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" />
            <span>Atla</span>
            <kbd className="ml-2 px-2 py-0.5 bg-neutral-700 rounded text-xs lg:text-sm">P</kbd>
          </Button>
        </div>

        {/* Info Bar - Compact Glassmorphism (Optimized for projection) */}
        <div
          className="flex items-center justify-center gap-6 lg:gap-8 px-8 py-4 lg:px-10 lg:py-5
                     bg-neutral-900/50 backdrop-blur-md
                     border border-white/8 rounded-xl"
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <Target className="w-5 h-5 lg:w-6 lg:h-6 text-primary-400" aria-hidden="true" />
            <span className="text-base lg:text-lg text-neutral-300">
              <span className="font-bold text-neutral-50">{remainingGuesses}</span> tahmin
            </span>
          </div>

          <div className="w-px h-5 lg:h-6 bg-white/10" aria-hidden="true" />

          <div className="flex items-center gap-2 lg:gap-3">
            <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-accent-400" aria-hidden="true" />
            <span className="text-base lg:text-lg text-neutral-300">
              <span className="font-bold text-neutral-50">{lettersRevealed}</span> harf
            </span>
          </div>

          <div className="w-px h-5 lg:h-6 bg-white/10" aria-hidden="true" />

          <div className="flex items-center gap-2 lg:gap-3">
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-success-400" aria-hidden="true" />
            <span className="text-base lg:text-lg text-neutral-300">
              <span className="font-bold text-accent-400">+{remainingPoints}</span> puan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
