/**
 * ProgressBar Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * TV Show Quality Progress Bar (60px target height)
 *
 * Features:
 * - Word progress indicator "X/14"
 * - Short category description
 * - Visual progress bar
 * - Fully responsive typography
 */

import React from 'react';

interface ProgressBarProps {
  currentWord: number;
  totalWords: number;
  categoryDescription?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentWord,
  totalWords,
  categoryDescription: _categoryDescription = '', // Reserved for future use
  className = '',
}) => {
  const progressPercent = (currentWord / totalWords) * 100;

  return (
    <div
      className={`
        h-14 px-6
        bg-neutral-900/80 backdrop-blur-md
        border-t border-white/10
        flex items-center justify-between gap-6
        ${className}
      `}
      role="region"
      aria-label="İlerleme çubuğu"
    >
      {/* Visual Progress Bar */}
      <div className="flex-1 max-w-md h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={currentWord}
          aria-valuemin={0}
          aria-valuemax={totalWords}
        />
      </div>

      {/* Progress Text */}
      <span className="text-sm font-medium text-neutral-400 tabular-nums whitespace-nowrap" aria-live="polite">
        {currentWord}/{totalWords} kelime
      </span>
    </div>
  );
};
