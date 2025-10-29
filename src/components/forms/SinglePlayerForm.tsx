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
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <User className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white">Tek Yarışmacı</h3>
        <p className="text-sm md:text-base text-slate-400">Adınızı girin ve oyuna başlayın</p>
      </div>

      {/* Name Input */}
      <div className="max-w-md mx-auto">
        <Input
          label="Yarışmacı Adı"
          placeholder="Adınızı girin"
          value={playerName}
          onChange={handleNameChange}
          icon={<User className="w-5 h-5" />}
          fullWidth
          required
          autoFocus
          aria-label="Yarışmacı adı"
        />
      </div>

      {/* Info text */}
      <div className="text-center">
        <p className="text-sm text-slate-400">Oyun başladığında 14 kelime tahmin edeceksiniz</p>
      </div>
    </motion.div>
  );
};
