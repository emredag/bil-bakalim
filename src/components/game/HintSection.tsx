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
        py-6 md:py-7 lg:py-8 px-6 md:px-8 lg:px-12
        bg-gradient-to-r from-amber-900/20 to-amber-800/10
        border-2 border-amber-700/30 rounded-2xl
        backdrop-blur-sm
        flex items-start gap-4 lg:gap-5
        w-full max-w-4xl mx-auto
        ${className}
      `}
      role="region"
      aria-label="İpucu bölümü"
    >
      {/* Lightbulb Icon (Optimized for projection) */}
      <Lightbulb className="w-7 h-7 lg:w-8 lg:h-8 text-amber-400 flex-shrink-0 mt-1" aria-hidden="true" />

      {/* Hint Text (Optimized for projection) */}
      <p className="text-xl md:text-2xl lg:text-3xl text-neutral-100 flex-1 font-medium" aria-live="polite">
        {hint}
      </p>
    </div>
  );
};
