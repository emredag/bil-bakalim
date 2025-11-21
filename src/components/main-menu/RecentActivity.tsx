/**
 * RecentActivity Component
 * Design System v2.0 - Main Menu Migration
 *
 * Displays the last played game with quick action buttons
 */

import { motion } from 'framer-motion';
import { Eye, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { LastGameSummary } from '../../types/database';

export interface RecentActivityProps {
  lastGame: LastGameSummary | null;
  loading?: boolean;
  onViewDetails?: (gameId: number) => void;
  onPlayAgain?: (game: LastGameSummary) => void;
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} gün önce`;
  } else if (diffHours > 0) {
    return `${diffHours} saat önce`;
  } else if (diffMins > 0) {
    return `${diffMins} dakika önce`;
  } else {
    return 'Az önce';
  }
}

/**
 * Get mode badge text
 */
function getModeBadge(mode: 'single' | 'multi' | 'team'): string {
  const badges = {
    single: 'Tek Oyuncu',
    multi: 'Çok Oyunculu',
    team: 'Takım Modu',
  };
  return badges[mode];
}

export function RecentActivity({
  lastGame,
  loading,
  onViewDetails,
  onPlayAgain,
}: RecentActivityProps) {
  if (loading) {
    return (
      <section className="recent-activity" aria-label="Son Aktivite">
        <h2 className="text-2xl font-bold text-white mb-6">Son Aktivite</h2>
        <div className="bg-neutral-800 border border-neutral-700/50 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-neutral-700 rounded w-32" />
            <div className="h-4 bg-neutral-700 rounded w-24" />
          </div>
          <div className="h-5 bg-neutral-700 rounded w-48 mb-4" />
          <div className="flex gap-3">
            <div className="h-10 bg-neutral-700 rounded flex-1" />
            <div className="h-10 bg-neutral-700 rounded flex-1" />
          </div>
        </div>
      </section>
    );
  }

  if (!lastGame) {
    return (
      <section className="recent-activity" aria-label="Son Aktivite">
        <h2 className="text-2xl font-bold text-white mb-6">Son Aktivite</h2>
        <div className="bg-neutral-800/40 border border-dashed border-neutral-700/30 rounded-2xl p-12 text-center">
          <p className="text-neutral-500 text-lg">
            Henüz oyun oynamadınız. İlk oyununuzu başlatın!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-activity" aria-label="Son Aktivite">
      <h2 className="text-2xl font-bold text-white mb-6">Son Aktivite</h2>

      <motion.div
        className="bg-neutral-800 border border-neutral-700/50 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:border-neutral-600/70 hover:shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Header: Category + Timestamp */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          {/* Category Badge */}
          <span className="category-badge">
            {lastGame.categoryEmoji} {lastGame.categoryName}
          </span>

          {/* Timestamp */}
          <span className="text-xs text-neutral-500">
            {formatRelativeTime(lastGame.playedAt)}
          </span>
        </div>

        {/* Body: Winner Info */}
        <div className="mb-4">
          <p className="text-base font-semibold text-white mb-1">
            🏆 {lastGame.winner.name} kazandı - {lastGame.winner.score.toLocaleString('tr-TR')} puan
          </p>
          {lastGame.gameMode !== 'single' && (
            <p className="text-sm text-neutral-400">
              {lastGame.participantCount} oyuncu • {getModeBadge(lastGame.gameMode)}
            </p>
          )}
        </div>

        {/* Footer: Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          {onViewDetails && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(lastGame.id)}
              icon={<Eye size={16} />}
              className="flex-1 min-w-[140px]"
            >
              Detayları Gör
            </Button>
          )}
          {onPlayAgain && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPlayAgain(lastGame)}
              icon={<RotateCcw size={16} />}
              className="flex-1 min-w-[140px]"
            >
              Tekrar Oyna
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
