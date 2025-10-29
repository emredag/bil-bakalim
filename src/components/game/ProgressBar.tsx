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
  categoryDescription = '',
  className = '',
}) => {
  const progressPercent = (currentWord / totalWords) * 100;

  return (
    <div
      className={`
        shrink-0
        h-[50px] md:h-[60px]
        bg-slate-800/80 backdrop-blur-sm
        border-t border-slate-700
        px-4 md:px-6 lg:px-8
        flex items-center justify-between gap-4
        ${className}
      `}
      role="region"
      aria-label="İlerleme çubuğu"
    >
      {/* Progress Text */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xs md:text-sm text-slate-400 uppercase tracking-wide">
            İlerleme:
          </span>
          <span
            className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-400 tabular-nums"
            aria-live="polite"
            aria-label={`${currentWord} / ${totalWords} kelime tamamlandı`}
          >
            {currentWord}/{totalWords}
          </span>
        </div>

        {/* Category Description */}
        {categoryDescription && (
          <span className="text-sm md:text-base text-slate-300 hidden md:inline-block max-w-md truncate">
            {categoryDescription}
          </span>
        )}
      </div>

      {/* Visual Progress Bar */}
      <div className="flex-1 max-w-md h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={currentWord}
          aria-valuemin={0}
          aria-valuemax={totalWords}
          aria-label={`Kelime ilerlemesi: ${currentWord} / ${totalWords}`}
        />
      </div>
    </div>
  );
};
