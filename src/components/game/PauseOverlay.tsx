/**
 * PauseOverlay Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * Pause screen overlay
 *
 * Features:
 * - Blur backdrop
 * - "Duraklatıldı" message
 * - [Devam Et] and [Ana Menü] buttons
 * - Keyboard support (Space to resume, ESC for menu)
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface PauseOverlayProps {
  onResume: () => void;
  onHome: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onHome }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onResume();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-20 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="bg-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-neutral-700 max-w-md mx-4">
        <h2
          id="pause-title"
          className="text-3xl md:text-4xl font-bold text-neutral-100 text-center mb-8"
        >
          Oyun Duraklatıldı
        </h2>

        <div className="space-y-4">
          <Button
            onClick={onResume}
            variant="primary"
            size="lg"
            className="w-full h-16 text-lg"
            autoFocus
            aria-label="Oyuna devam et, klavye kısayolu Space"
          >
            <Play className="w-6 h-6" aria-hidden="true" />
            Devam Et
            <kbd className="ml-2 px-2 py-1 bg-primary-800 rounded text-sm">Space</kbd>
          </Button>

          <Button
            onClick={onHome}
            variant="secondary"
            size="lg"
            className="w-full h-16 text-lg"
            aria-label="Ana menüye dön"
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            Ana Menü
          </Button>
        </div>

        <p className="text-sm text-neutral-400 text-center mt-6">
          Oyuna devam etmek için Space tuşuna basın
        </p>
      </div>
    </motion.div>
  );
};
