/**
 * EmojiPicker Component
 * Task 11: Participant/Team Setup
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Simple emoji picker for team identification
 * Shows a grid of common emojis for quick selection
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * Common emojis for team selection
 * Sports, colors, animals, symbols
 */
export const TEAM_EMOJI_OPTIONS = [
  '🔴', '🔵', '🟢', '🟡', '🟠', '🟣',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
  '🦁', '🐯', '🐻', '🦅', '🐺', '🦊',
  '⭐', '💎', '🔥', '⚡', '🌟', '💫',
  '🚀', '🎯', '🏆', '👑', '🎪', '🎨',
  '🌈', '☀️', '🌙', '⛰️', '🌊', '🌸',
];

export interface EmojiPickerProps {
  /** Currently selected emoji */
  selectedEmoji?: string;
  /** Callback when emoji is selected */
  onSelect: (emoji: string) => void;
  /** Callback when picker is closed */
  onClose?: () => void;
  /** Show as modal (full overlay) or inline */
  variant?: 'modal' | 'inline';
  /** Custom className */
  className?: string;
}

/**
 * EmojiPicker Component
 *
 * Features:
 * - Grid of common emojis
 * - Click to select
 * - Modal or inline display
 * - Keyboard navigation (Tab, Enter)
 * - Responsive sizing
 */
export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  selectedEmoji,
  onSelect,
  onClose,
  variant = 'modal',
  className = '',
}) => {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, emoji: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(emoji);
    }
  };

  // Picker content
  const pickerContent = (
    <div className={`bg-slate-800 rounded-2xl p-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          Takım Emoji Seç
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-6 gap-2 md:gap-3 max-w-md mx-auto">
        {TEAM_EMOJI_OPTIONS.map((emoji) => {
          const isSelected = emoji === selectedEmoji;
          const isHovered = emoji === hoveredEmoji;

          return (
            <motion.button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              onKeyDown={(e) => handleKeyDown(e, emoji)}
              onMouseEnter={() => setHoveredEmoji(emoji)}
              onMouseLeave={() => setHoveredEmoji(null)}
              className={`
                relative aspect-square flex items-center justify-center
                text-3xl md:text-4xl rounded-xl transition-all
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isSelected ? 'bg-blue-600 scale-110' : 'bg-slate-700 hover:bg-slate-600'}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select ${emoji}`}
              aria-pressed={isSelected}
            >
              {emoji}

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-blue-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Hover effect */}
              {isHovered && !isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="text-sm text-slate-400 mt-6 text-center">
        Takımınızı temsil edecek bir emoji seçin
      </p>
    </div>
  );

  // Modal variant: show with overlay
  if (variant === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full"
          >
            {pickerContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline variant: just show the picker
  return pickerContent;
};

/**
 * Emoji Button - Trigger button for emoji picker
 */
export interface EmojiButtonProps {
  /** Currently selected emoji */
  emoji?: string;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export const EmojiButton: React.FC<EmojiButtonProps> = ({
  emoji,
  onClick,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={`
        ${sizeStyles[size]}
        p-0 flex items-center justify-center
        ${!emoji ? 'text-slate-400' : ''}
        ${className}
      `}
      aria-label={emoji ? `Seçili emoji: ${emoji}` : 'Emoji seç'}
    >
      {emoji || '➕'}
    </Button>
  );
};
