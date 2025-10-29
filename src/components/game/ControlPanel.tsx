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
import { Eye, CheckCircle, SkipForward, Pause, Volume2, VolumeX, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface ControlPanelProps {
  // Actions
  onRevealLetter: () => void;
  onGuess: () => void;
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
  onGuess,
  onSkip,
  onPause,
  onToggleSound,
  onHome,
  canRevealLetter,
  canGuess,
  canSkip,
  soundEnabled,
  remainingGuesses,
  lettersRevealed,
  remainingPoints,
  className = '',
}) => {
  return (
    <div
      className={`
        shrink-0
        bg-slate-800/50 backdrop-blur-sm
        border-t-2 border-slate-700
        px-4 md:px-6 lg:px-8 py-3 md:py-4
        ${className}
      `}
      role="region"
      aria-label="Kontrol paneli"
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Reveal Letter Button */}
          <Button
            onClick={onRevealLetter}
            disabled={!canRevealLetter}
            variant="secondary"
            size="lg"
            className="h-14 md:h-16 text-base md:text-lg"
            aria-label="Harf aç, klavye kısayolu H"
          >
            <Eye className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            <span>Harf Aç</span>
            <kbd className="ml-2 px-2 py-1 bg-slate-700 rounded text-sm">H</kbd>
          </Button>

          {/* Guess Button */}
          <Button
            onClick={onGuess}
            disabled={!canGuess}
            variant="primary"
            size="lg"
            className="h-14 md:h-16 text-base md:text-lg"
            aria-label="Tahmin et, klavye kısayolu T"
          >
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            <span>Tahmin Et</span>
            <kbd className="ml-2 px-2 py-1 bg-blue-800 rounded text-sm">T</kbd>
          </Button>

          {/* Skip Button */}
          <Button
            onClick={onSkip}
            disabled={!canSkip}
            variant="secondary"
            size="lg"
            className="h-14 md:h-16 text-base md:text-lg"
            aria-label="Pas geç, klavye kısayolu P"
          >
            <SkipForward className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            <span>Pas Geç</span>
            <kbd className="ml-2 px-2 py-1 bg-slate-700 rounded text-sm">P</kbd>
          </Button>
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/50 rounded-lg p-2">
            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide mb-1">
              Kalan Tahmin
            </div>
            <div className="text-xl md:text-2xl font-bold text-blue-400 tabular-nums">
              {remainingGuesses}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2">
            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide mb-1">
              Açılan Harf
            </div>
            <div className="text-xl md:text-2xl font-bold text-amber-400 tabular-nums">
              {lettersRevealed}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2">
            <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide mb-1">
              Kalan Puan
            </div>
            <div className="text-xl md:text-2xl font-bold text-emerald-400 tabular-nums">
              {remainingPoints}
            </div>
          </div>
        </div>

        {/* Side Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={onPause}
            variant="secondary"
            size="md"
            aria-label="Oyunu duraklat, klavye kısayolu Space"
          >
            <Pause className="w-5 h-5" aria-hidden="true" />
            <span className="ml-2">Duraklat</span>
            <kbd className="ml-2 px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd>
          </Button>

          <Button
            onClick={onToggleSound}
            variant="secondary"
            size="md"
            aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            ) : (
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            )}
            <span className="ml-2">{soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}</span>
          </Button>

          <Button onClick={onHome} variant="secondary" size="md" aria-label="Ana menüye dön">
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="ml-2">Ana Menü</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
