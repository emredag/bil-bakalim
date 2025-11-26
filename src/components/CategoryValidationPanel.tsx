/**
 * CategoryValidationPanel Component
 * Task 29: Category Validation
 * PRD Reference: Section 3.3 - Category Validation
 * Design Reference: ui-ux-design.md#category-management
 *
 * Displays detailed validation information for category management screens:
 * - Total word count
 * - Words by letter length with status indicators
 * - Supported game modes
 * - Maximum participants/teams per mode
 * - Visual status indicators (green/yellow/red)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Users, UsersRound, Trophy } from 'lucide-react';
import { ValidationResult } from '../types/database';
import { enrichValidationResult, formatInsufficientLengths } from '../utils/categoryValidation';

export interface CategoryValidationPanelProps {
  validation: ValidationResult;
  /** Show mode details (default: true) */
  showModeDetails?: boolean;
  /** Compact mode for smaller displays */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * CategoryValidationPanel - Detailed validation information display
 *
 * Features:
 * - Visual word count distribution (4-10 letters)
 * - Color-coded status indicators
 * - Mode compatibility display
 * - Maximum participant counts
 * - Responsive layout
 * - Smooth animations
 */
export const CategoryValidationPanel: React.FC<CategoryValidationPanelProps> = ({
  validation,
  showModeDetails = true,
  compact = false,
  className = '',
}) => {
  const enriched = enrichValidationResult(validation);

  // Status colors
  const getStatusColor = (count: number, required: number = 2) => {
    if (count >= required) return 'text-success-400';
    if (count >= 1) return 'text-warning-400';
    return 'text-error-400';
  };

  const getStatusBg = (count: number, required: number = 2) => {
    if (count >= required) return 'bg-success-500/20 border-success-500/40';
    if (count >= 1) return 'bg-warning-500/20 border-warning-500/40';
    return 'bg-error-500/20 border-error-500/40';
  };

  const getStatusIcon = (count: number, required: number = 2) => {
    if (count >= required) return <CheckCircle className="w-5 h-5 text-success-400" />;
    if (count >= 1) return <AlertTriangle className="w-5 h-5 text-warning-400" />;
    return <XCircle className="w-5 h-5 text-error-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-neutral-800/60 backdrop-blur-sm border-2 border-neutral-700 
        rounded-xl p-6 md:p-8 space-y-6
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Kategori Durumu</h3>
          <p className="text-base md:text-lg text-neutral-300">{enriched.message}</p>
        </div>

        {/* Status Icon */}
        <div className={`p-3 rounded-lg ${getStatusBg(enriched.totalWords, 14)}`}>
          {enriched.indicatorType === 'success' && (
            <CheckCircle className="w-8 h-8 text-success-400" />
          )}
          {enriched.indicatorType === 'warning' && (
            <AlertTriangle className="w-8 h-8 text-warning-400" />
          )}
          {enriched.indicatorType === 'error' && <XCircle className="w-8 h-8 text-error-400" />}
        </div>
      </div>

      {/* Total Words */}
      <div className="bg-neutral-900/60 rounded-lg p-4 border border-neutral-700">
        <div className="flex items-center justify-between">
          <span className="text-base md:text-lg text-neutral-300">Toplam Kelime</span>
          <span
            className={`text-2xl md:text-3xl font-bold ${getStatusColor(enriched.totalWords, 14)}`}
          >
            {enriched.totalWords}
          </span>
        </div>
      </div>

      {/* Words by Length */}
      <div className="space-y-3">
        <h4 className="text-lg md:text-xl font-semibold text-white">
          Harf Uzunluğuna Göre Dağılım
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {enriched.wordsByLength.map((wbl) => {
            const isValid = wbl.count >= 2;
            const isPartial = wbl.count >= 1 && wbl.count < 2;

            return (
              <motion.div
                key={wbl.letter_count}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: wbl.letter_count * 0.05 }}
                className={`
                  flex items-center justify-between p-3 rounded-lg border-2
                  ${getStatusBg(wbl.count, 2)}
                `}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(wbl.count, 2)}
                  <span className="text-base md:text-lg font-medium text-white">
                    {wbl.letter_count} Harf
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-lg md:text-xl font-bold ${getStatusColor(wbl.count, 2)}`}>
                    {wbl.count}
                  </span>
                  <span className="text-sm text-neutral-400">
                    {isValid ? '/ 2 ✓' : isPartial ? '/ 2 ⚠' : '/ 2 ✗'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Insufficient Lengths Warning */}
        {enriched.insufficientLengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-error-500/20 border-2 border-error-500/40 rounded-lg p-4"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-error-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm md:text-base text-error-300 font-medium">Eksik Uzunluklar</p>
                <p className="text-sm text-error-200 mt-1">
                  {formatInsufficientLengths(enriched.insufficientLengths)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mode Support Details */}
      {showModeDetails && enriched.isValid && (
        <div className="space-y-3 pt-4 border-t border-neutral-700">
          <h4 className="text-lg md:text-xl font-semibold text-white">Desteklenen Modlar</h4>

          <div className="space-y-2">
            {/* Single Player */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-lg border border-neutral-700">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-success-400" />
                <span className="text-base text-neutral-200">Tek Yarışmacı</span>
              </div>
              <span className="text-success-400 font-semibold">
                {enriched.maxPlayersSingle > 0 ? '✓' : '✗'}
              </span>
            </div>

            {/* Multiplayer */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-lg border border-neutral-700">
              <div className="flex items-center gap-3">
                <UsersRound className="w-5 h-5 text-info-400" />
                <span className="text-base text-neutral-200">Çoklu Yarışmacı</span>
              </div>
              <span
                className={enriched.maxPlayersMulti > 1 ? 'text-success-400' : 'text-neutral-500'}
              >
                {enriched.maxPlayersMulti > 1 ? `${enriched.maxPlayersMulti} kişiye kadar` : '✗'}
              </span>
            </div>

            {/* Team Mode */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/60 rounded-lg border border-neutral-700">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-secondary-400" />
                <span className="text-base text-neutral-200">Takım Modu</span>
              </div>
              <span className={enriched.maxTeams > 1 ? 'text-success-400' : 'text-neutral-500'}>
                {enriched.maxTeams > 1 ? `${enriched.maxTeams} takıma kadar` : '✗'}
              </span>
            </div>
          </div>

          {/* Mode Messages */}
          {!compact && (
            <div className="bg-neutral-900/40 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-neutral-300">
                <span className="font-semibold">Tek:</span> {enriched.modeMessages.single}
              </p>
              <p className="text-neutral-300">
                <span className="font-semibold">Çoklu:</span> {enriched.modeMessages.multi}
              </p>
              <p className="text-neutral-300">
                <span className="font-semibold">Takım:</span> {enriched.modeMessages.team}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Not Valid Warning */}
      {!enriched.isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-error-500/20 border-2 border-error-500/40 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-error-400 flex-shrink-0" />
            <div>
              <h5 className="text-error-300 font-semibold mb-1">Kategori Oynanamaz</h5>
              <p className="text-sm text-error-200">
                Bu kategoriyle oyun başlatmak için en az 14 kelime ve her harf uzunluğundan en az 2
                kelime eklemelisiniz.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
