/**
 * SinglePlayerForm Component
 * Task 11: Participant/Team Setup - Single Player Mode
 * PRD Reference: Section 4.4 - Single Player Mode
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Simple form for single player name input
 * Minimum 14 words required (1 player × 14 words)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Input } from '../ui/Input';
import type { SinglePlayerSetup } from '../../types';
import {
  validateSinglePlayerSetup,
  type ValidationResult,
} from '../../utils/participantValidation';

export interface SinglePlayerFormProps {
  /** Initial setup data */
  initialSetup?: SinglePlayerSetup;
  /** Available word count in category */
  availableWords: number;
  /** Callback when setup changes */
  onChange: (setup: SinglePlayerSetup, validation: ValidationResult) => void;
  /** Custom className */
  className?: string;
}

/**
 * SinglePlayerForm Component
 *
 * Features:
 * - Name input field
 * - Real-time validation
 * - Responsive design
 * - Accessible form
 */
export const SinglePlayerForm: React.FC<SinglePlayerFormProps> = ({
  initialSetup,
  availableWords,
  onChange,
  className = '',
}) => {
  const [playerName, setPlayerName] = useState(initialSetup?.playerName || '');

  // Validate and notify parent on change
  useEffect(() => {
    const setup: SinglePlayerSetup = { playerName };
    const validation = validateSinglePlayerSetup(setup, availableWords);
    onChange(setup, validation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName, availableWords]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card rounded-2xl p-8 md:p-10 space-y-8 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-4 bg-primary-500/20 rounded-2xl ring-2 ring-primary-500/30">
            <User className="w-8 h-8 md:w-10 md:h-10 text-primary-400" />
          </div>
        </motion.div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Tek Yarışmacı</h3>
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
            Adınızı girin ve oyuna başlayın
          </p>
        </div>
      </div>

      {/* Name Input */}
      <div className="max-w-md mx-auto">
        <Input
          label="Yarışmacı Adı"
          placeholder="Örn: Ali Veli"
          value={playerName}
          onChange={handleNameChange}
          icon={<User className="w-5 h-5" />}
          fullWidth
          required
          autoFocus
          aria-label="Yarışmacı adı"
        />
        {playerName && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-success-400 mt-2 flex items-center gap-1"
          >
            <span>✓</span> İsim girildi
          </motion.p>
        )}
      </div>

      {/* Info text */}
      <div className="text-center bg-neutral-900/40 rounded-xl p-4 border border-white/5">
        <p className="text-sm text-neutral-300 leading-relaxed">
          Oyun başladığında <strong className="text-primary-400">14 kelime</strong> tahmin edeceksiniz
        </p>
      </div>
    </motion.div>
  );
};
