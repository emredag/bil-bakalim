/**
 * HintSection Component - PRD 4.5, ui-ux-design.md#game-screen
 *
 * TV Show Quality Hint Display (100px target height)
 *
 * Features:
 * - Large readable hint text
 * - Lightbulb icon (💡)
 * - Framed container with border/background for visibility
 * - Fully responsive typography
 */

import React from 'react';
import { Lightbulb } from 'lucide-react';

interface HintSectionProps {
  hint: string;
  className?: string;
}

export const HintSection: React.FC<HintSectionProps> = ({ hint, className = '' }) => {
  return (
    <div
      className={`
        py-4 md:py-6
        bg-gradient-to-r from-amber-900/20 to-amber-800/10
        border-2 border-amber-700/50
        rounded-xl
        px-6 md:px-8 lg:px-12
        flex items-center justify-center gap-4
        ${className}
      `}
      role="region"
      aria-label="İpucu bölümü"
    >
      {/* Lightbulb Icon */}
      <div className="shrink-0">
        <Lightbulb
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-amber-400"
          aria-hidden="true"
        />
      </div>

      {/* Hint Text */}
      <p
        className="text-base md:text-lg lg:text-xl xl:text-2xl text-slate-100 font-medium text-center"
        aria-live="polite"
      >
        {hint}
      </p>
    </div>
  );
};
