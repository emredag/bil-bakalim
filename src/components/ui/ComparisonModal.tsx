import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock, Target, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { GameHistory, GameParticipant } from '../../api/gameHistory';
import type { Category } from '../../types/database';
import { formatPlayTime, formatGameMode } from '../../api/gameHistory';
import { getCategoryThemeColor, getCategoryColorWithOpacity } from '../../utils/categoryColors';
import { Button } from './Button';
import { Badge } from './Badge';

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: [GameHistory, GameHistory];
  categories: [Category | undefined, Category | undefined];
  participantsData: [GameParticipant[], GameParticipant[]];
}

/**
 * ComparisonModal Component
 *
 * Side-by-side comparison of two games.
 * Part of Design System v2.0 - GameHistoryScreen migration.
 *
 * Features:
 * - 2 game side-by-side comparison
 * - Visual difference indicators (↗ ↘ =)
 * - Category-colored accents
 * - Glassmorphism design
 * - Key stats comparison
 *
 * @example
 * <ComparisonModal
 *   isOpen={showComparison}
 *   onClose={() => setShowComparison(false)}
 *   games={[game1, game2]}
 *   categories={[cat1, cat2]}
 *   participantsData={[participants1, participants2]}
 * />
 */
export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  games,
  categories,
  participantsData,
}) => {
  const [game1, game2] = games;
  const [cat1, cat2] = categories;
  const [participants1, participants2] = participantsData;

  // Get winners
  const winner1 = participants1.find((p) => p.rank === 1);
  const winner2 = participants2.find((p) => p.rank === 1);

  // Get category colors
  const color1 = cat1 ? getCategoryThemeColor(cat1.emoji) : '#a3a3a3';
  const color2 = cat2 ? getCategoryThemeColor(cat2.emoji) : '#a3a3a3';

  // Comparison stats
  const stats = [
    {
      label: 'Kazanan Skoru',
      value1: winner1?.score ?? 0,
      value2: winner2?.score ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: Trophy,
    },
    {
      label: 'Oyun Süresi',
      value1: game1.total_time_seconds,
      value2: game2.total_time_seconds,
      format: (v: number) => formatPlayTime(v),
      icon: Clock,
      inverse: true, // Lower is better
    },
    {
      label: 'Toplam Bulunan Kelime',
      value1: participants1.reduce((sum, p) => sum + p.words_found, 0),
      value2: participants2.reduce((sum, p) => sum + p.words_found, 0),
      format: (v: number) => v.toString(),
      icon: Target,
    },
    {
      label: 'Oyuncu Başına Ort. Kelime',
      value1:
        participants1.length > 0
          ? participants1.reduce((sum, p) => sum + p.words_found, 0) / participants1.length
          : 0,
      value2:
        participants2.length > 0
          ? participants2.reduce((sum, p) => sum + p.words_found, 0) / participants2.length
          : 0,
      format: (v: number) => v.toFixed(1),
      icon: Zap,
    },
    {
      label: 'Oyuncu Sayısı',
      value1: participants1.length,
      value2: participants2.length,
      format: (v: number) => v.toString(),
      icon: null,
    },
  ];

  const getComparisonIcon = (val1: number, val2: number, inverse = false) => {
    const diff = Math.abs(val1 - val2);
    const threshold = Math.max(val1, val2) * 0.05; // 5% threshold

    if (diff < threshold) {
      return <Minus className="w-4 h-4 text-neutral-400" />;
    }

    const better1 = inverse ? val1 < val2 : val1 > val2;
    const better2 = inverse ? val2 < val1 : val2 > val1;

    if (better1) {
      return (
        <>
          <TrendingUp className="w-4 h-4 text-success-500" />
          <TrendingDown className="w-4 h-4 text-error-500" />
        </>
      );
    }
    if (better2) {
      return (
        <>
          <TrendingDown className="w-4 h-4 text-error-500" />
          <TrendingUp className="w-4 h-4 text-success-500" />
        </>
      );
    }

    return (
      <>
        <Minus className="w-4 h-4 text-neutral-400" />
        <Minus className="w-4 h-4 text-neutral-400" />
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Container - Centered with Flexbox */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
            <div className="bg-neutral-900 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700 bg-neutral-800/50">
                <h2 className="text-xl font-bold text-neutral-50">Oyun Karşılaştırma</h2>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Game Headers */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Game 1 */}
                  <div
                    className="p-4 rounded-xl border-2"
                    style={{
                      borderColor: color1,
                      background: getCategoryColorWithOpacity(cat1?.emoji || '📝', 0.05),
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{cat1?.emoji || '📝'}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-50">
                          {game1.category_name}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {new Date(game1.played_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {formatGameMode(game1.game_mode)}
                    </Badge>
                  </div>

                  {/* Game 2 */}
                  <div
                    className="p-4 rounded-xl border-2"
                    style={{
                      borderColor: color2,
                      background: getCategoryColorWithOpacity(cat2?.emoji || '📝', 0.05),
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{cat2?.emoji || '📝'}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-50">
                          {game2.category_name}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {new Date(game2.played_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {formatGameMode(game2.game_mode)}
                    </Badge>
                  </div>
                </div>

                {/* Stats Comparison Table */}
                <div className="space-y-3">
                  {stats.map((stat, index) => {
                    const icons = getComparisonIcon(
                      stat.value1,
                      stat.value2,
                      stat.inverse
                    );
                    const IconComponent = stat.icon;

                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center p-4 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/60 transition-colors"
                      >
                        {/* Game 1 Value */}
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-lg font-semibold text-neutral-50">
                            {stat.format(stat.value1)}
                          </span>
                          {Array.isArray(icons) && icons[0]}
                        </div>

                        {/* Label (Center) */}
                        <div className="flex items-center gap-2 px-4 min-w-[200px] justify-center">
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 text-neutral-400" />
                          )}
                          <span className="text-sm font-medium text-neutral-400">
                            {stat.label}
                          </span>
                        </div>

                        {/* Game 2 Value */}
                        <div className="flex items-center gap-2">
                          {Array.isArray(icons) && icons[1]}
                          <span className="text-lg font-semibold text-neutral-50">
                            {stat.format(stat.value2)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Participants */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Game 1 Participants */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-400 mb-3">
                      KATILIMCILAR
                    </h4>
                    <div className="space-y-2">
                      {participants1
                        .sort((a, b) => a.rank - b.rank)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded bg-neutral-800/40"
                          >
                            <div className="flex items-center gap-2">
                              {p.rank === 1 && (
                                <Trophy className="w-4 h-4 text-accent-500" />
                              )}
                              <span className="text-sm text-neutral-50">
                                {p.participant_name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-neutral-300">
                              {p.score.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Game 2 Participants */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-400 mb-3">
                      KATILIMCILAR
                    </h4>
                    <div className="space-y-2">
                      {participants2
                        .sort((a, b) => a.rank - b.rank)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded bg-neutral-800/40"
                          >
                            <div className="flex items-center gap-2">
                              {p.rank === 1 && (
                                <Trophy className="w-4 h-4 text-accent-500" />
                              )}
                              <span className="text-sm text-neutral-50">
                                {p.participant_name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-neutral-300">
                              {p.score.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
