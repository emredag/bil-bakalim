/**
 * ValidationSummary Component
 * Task 11: Participant/Team Setup
 * PRD Reference: Section 4.4 - Word count validation display
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Displays word count validation summary:
 * "Gerekli kelime: X | Mevcut: Y ✓"
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ValidationSummaryProps {
  /** Required word count for current setup */
  requiredWords: number;
  /** Available word count in category */
  availableWords: number;
  /** Show detailed info */
  showDetails?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * ValidationSummary Component
 *
 * Features:
 * - Shows required vs available words
 * - Visual indicator (check/warning)
 * - Color-coded status
 * - Responsive design
 * - Smooth animations
 */
export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  requiredWords,
  availableWords,
  showDetails = true,
  className = '',
}) => {
  const isValid = availableWords >= requiredWords;

  // Status styling with Design System colors
  const statusColor = isValid ? 'text-success-400' : 'text-error-400';
  const statusBg = isValid ? 'bg-success-500/15' : 'bg-error-500/15';
  const statusBorder = isValid ? 'border-success-500/30' : 'border-error-500/30';
  const statusRing = isValid ? 'ring-success-500/20' : 'ring-error-500/20';
  const StatusIcon = isValid ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card-subtle ${statusBg} ${statusBorder} border-2 rounded-xl p-5 md:p-6 backdrop-blur-sm ring-2 ${statusRing} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 ${statusBg} rounded-xl flex items-center justify-center ring-2 ${statusBorder}`}>
          <StatusIcon className={`w-6 h-6 md:w-7 md:h-7 ${statusColor}`} />
        </div>

        <div className="flex-1">
          {/* Main status text */}
          <div className="flex flex-wrap items-center gap-2 text-base md:text-lg font-semibold">
            <span className="text-neutral-200">Gerekli kelime:</span>
            <span className={statusColor}>{requiredWords}</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-200">Mevcut:</span>
            <span className={statusColor}>
              {availableWords} {isValid ? '✓' : '✗'}
            </span>
          </div>

          {/* Detailed info */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-4 space-y-3"
            >
              {/* Valid state message */}
              {isValid ? (
                <p className="text-sm md:text-base text-success-300 flex items-start gap-2 leading-relaxed">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span>Yeterli kelime mevcut. Oyunu başlatabilirsiniz!</span>
                </p>
              ) : (
                <p className="text-sm md:text-base text-error-300 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span>
                    Yetersiz kelime. Bu modu oynamak için en az{' '}
                    <strong className="text-error-200">{requiredWords - availableWords}</strong> kelime daha ekleyin.
                  </span>
                </p>
              )}

              {/* Info note */}
              <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-400 pt-3 border-t border-white/10">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Her yarışmacı/takım için 14 kelime gereklidir.</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Compact ValidationBadge - Smaller version for inline use
 */
export interface ValidationBadgeProps {
  /** Required word count */
  requiredWords: number;
  /** Available word count */
  availableWords: number;
  /** Custom className */
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  requiredWords,
  availableWords,
  className = '',
}) => {
  const isValid = availableWords >= requiredWords;
  const statusColor = isValid ? 'text-success-400' : 'text-error-400';
  const statusBg = isValid ? 'bg-success-500/20' : 'bg-error-500/20';
  const statusBorder = isValid ? 'border-success-500/30' : 'border-error-500/30';
  const StatusIcon = isValid ? CheckCircle : AlertCircle;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border
        ${statusBg} ${statusBorder} ${statusColor} text-sm font-medium
        ${className}
      `}
    >
      <StatusIcon className="w-4 h-4" />
      <span>
        {requiredWords}/{availableWords}
      </span>
    </div>
  );
};
