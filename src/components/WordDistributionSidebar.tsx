/**
 * Word Distribution Sidebar Component
 * Task 27: Word Management Screen
 * PRD Reference: Section 5.3 - Word Distribution Display
 *
 * Displays word distribution by letter count (4-10 letters)
 * Shows playability status and validation info
 */

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { ValidationResult } from '../types/database';

export interface WordDistributionSidebarProps {
  validation: ValidationResult;
}

/**
 * WordDistributionSidebar - Right sidebar showing word distribution
 *
 * Features:
 * - Word count for each letter length (4-10)
 * - Visual indicators (checkmark/X)
 * - Color coding (green = sufficient, red = insufficient)
 * - Total word count
 * - Playability status badge (large)
 * - Responsive: full width on mobile, sidebar on desktop
 */
export function WordDistributionSidebar({ validation }: WordDistributionSidebarProps) {
  // Create a map of letter counts
  const letterCountMap = new Map<number, number>();
  validation.words_by_length.forEach((item) => {
    letterCountMap.set(item.letter_count, item.count);
  });

  // All letter lengths from 4 to 10
  const allLetterLengths = [4, 5, 6, 7, 8, 9, 10];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="
        w-full lg:w-80 xl:w-96
        bg-neutral-800 border-t lg:border-t-0 lg:border-l border-neutral-700
        p-4 md:p-6
        overflow-y-auto
      "
      aria-label="Kelime dağılımı ve oynanabilirlik durumu"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Dağılım Kontrolü</h2>
        <p className="text-sm text-neutral-400">Her harf uzunluğu için kelime sayısı</p>
      </div>

      {/* Word Distribution List */}
      <div className="space-y-3 mb-6">
        {allLetterLengths.map((length) => {
          const count = letterCountMap.get(length) || 0;
          const isMinimumMet = count >= 2; // PRD: minimum 2 words per length for single player

          return (
            <motion.div
              key={length}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + length * 0.05 }}
              className={`
                flex items-center justify-between
                p-3 rounded-lg border-2
                ${
                  isMinimumMet
                    ? 'bg-success-500/10 border-success-500/30'
                    : count > 0
                      ? 'bg-warning-500/10 border-warning-500/30'
                      : 'bg-error-500/10 border-error-500/30'
                }
              `}
            >
              {/* Letter count label */}
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-semibold text-white">
                  {length} harf:
                </span>
                <span
                  className={`
                    text-xl md:text-2xl font-bold
                    ${
                      isMinimumMet
                        ? 'text-success-400'
                        : count > 0
                          ? 'text-warning-400'
                          : 'text-error-400'
                    }
                  `}
                >
                  {count}
                </span>
              </div>

              {/* Status icon */}
              <div>
                {isMinimumMet ? (
                  <CheckCircle className="w-6 h-6 text-success-400" aria-label="Yeterli" />
                ) : count > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-warning-400" aria-label="Yetersiz" />
                ) : (
                  <XCircle className="w-6 h-6 text-error-400" aria-label="Kelime yok" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Word Count */}
      <Card className="mb-6 bg-neutral-700/50">
        <div className="text-center p-4">
          <p className="text-sm text-neutral-400 mb-1">Toplam Kelime</p>
          <p className="text-4xl font-bold text-white">{validation.total_words}</p>
        </div>
      </Card>

      {/* Playability Status - Large Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {/* Main status badge */}
        <div
          className={`
            p-6 rounded-xl text-center border-2
            ${
              validation.is_valid
                ? 'bg-success-500/20 border-success-500/50'
                : 'bg-error-500/20 border-error-500/50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            {validation.is_valid ? (
              <CheckCircle className="w-8 h-8 text-success-400" />
            ) : (
              <XCircle className="w-8 h-8 text-error-400" />
            )}
            <h3
              className={`
                text-xl md:text-2xl font-bold
                ${validation.is_valid ? 'text-success-400' : 'text-error-400'}
              `}
            >
              {validation.is_valid ? 'Oynanabilir' : 'Yetersiz'}
            </h3>
          </div>
          <p className="text-sm text-neutral-300">{validation.message}</p>
        </div>

        {/* Playability details */}
        {validation.is_valid && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-neutral-700/30 rounded">
              <span className="text-neutral-400">Maksimum Oyuncu (Tek):</span>
              <Badge variant="info" size="sm">
                {validation.max_players_single}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-700/30 rounded">
              <span className="text-neutral-400">Maksimum Oyuncu (Çoklu):</span>
              <Badge variant="info" size="sm">
                {validation.max_players_multi}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-neutral-700/30 rounded">
              <span className="text-neutral-400">Maksimum Takım:</span>
              <Badge variant="info" size="sm">
                {validation.max_teams}
              </Badge>
            </div>
          </div>
        )}
      </motion.div>

      {/* Help text */}
      <div className="mt-6 p-4 bg-neutral-700/30 rounded-lg">
        <p className="text-xs text-neutral-400 leading-relaxed">
          <strong className="text-neutral-300">Not:</strong> Oynanabilir bir kategori için her harf
          uzunluğundan (4-10) en az 2'şer kelime gereklidir. Çoklu yarışmacı modları için daha fazla
          kelimeye ihtiyaç vardır.
        </p>
      </div>
    </motion.aside>
  );
}
