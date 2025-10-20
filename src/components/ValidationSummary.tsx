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

  // Status styling
  const statusColor = isValid ? 'text-emerald-400' : 'text-red-400';
  const statusBg = isValid ? 'bg-emerald-500/20' : 'bg-red-500/20';
  const statusBorder = isValid ? 'border-emerald-500/40' : 'border-red-500/40';
  const StatusIcon = isValid ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${statusBg} ${statusBorder} border-2 rounded-xl p-4 md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <StatusIcon className={`w-6 h-6 md:w-7 md:h-7 flex-shrink-0 ${statusColor}`} />

        <div className="flex-1">
          {/* Main status text */}
          <div className="flex flex-wrap items-center gap-2 text-base md:text-lg font-semibold">
            <span className="text-slate-200">Gerekli kelime:</span>
            <span className={statusColor}>{requiredWords}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200">Mevcut:</span>
            <span className={statusColor}>
              {availableWords} {isValid ? '✓' : '✗'}
            </span>
          </div>

          {/* Detailed info */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-3 space-y-2"
            >
              {/* Valid state message */}
              {isValid ? (
                <p className="text-sm md:text-base text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Yeterli kelime mevcut. Oyunu başlatabilirsiniz!
                  </span>
                </p>
              ) : (
                <p className="text-sm md:text-base text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Yetersiz kelime. Bu modu oynamak için en az{' '}
                    <strong>{requiredWords - availableWords}</strong> kelime daha ekleyin.
                  </span>
                </p>
              )}

              {/* Info note */}
              <div className="flex items-start gap-2 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Her yarışmacı/takım için 14 kelime gereklidir.
                </span>
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
  const statusColor = isValid ? 'text-emerald-400' : 'text-red-400';
  const statusBg = isValid ? 'bg-emerald-500/20' : 'bg-red-500/20';
  const StatusIcon = isValid ? CheckCircle : AlertCircle;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
        ${statusBg} ${statusColor} text-sm font-medium
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
