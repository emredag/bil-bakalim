import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Users, User } from 'lucide-react';
import { formatPlayTime, formatGameMode } from '../../api/gameHistory';
import type { GameHistory, GameParticipant } from '../../api/gameHistory';
import type { Category } from '../../types/database';
import { getCategoryColorWithOpacity, getCategoryThemeColor } from '../../utils/categoryColors';
import { Badge } from './Badge';

export interface GameCardThumbnailProps {
  game: GameHistory;
  category?: Category;
  participants?: GameParticipant[];
  onClick?: () => void;
  onCheckboxChange?: (checked: boolean) => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  className?: string;
}

/**
 * GameCardThumbnail Component
 *
 * Visual game preview card with category-colored gradient.
 * Part of Design System v2.0 - GameHistoryScreen migration.
 *
 * Features:
 * - Category emoji + color theme
 * - Winner/top scorer display
 * - Key stats (score, time, mode)
 * - Hover lift animation
 * - Optional selection checkbox for comparison
 *
 * @example
 * <GameCardThumbnail
 *   game={gameData}
 *   category={categoryData}
 *   participants={participantsData}
 *   onClick={() => navigate(`/game-history/${game.id}`)}
 * />
 */
export const GameCardThumbnail: React.FC<GameCardThumbnailProps> = ({
  game,
  category,
  participants = [],
  onClick,
  onCheckboxChange,
  isSelected = false,
  showCheckbox = false,
  className = '',
}) => {
  // Get winner (participant with rank 1)
  const winner = participants.find((p) => p.rank === 1);
  const topScore = winner?.score ?? 0;

  // Get category color
  const categoryEmoji = category?.emoji || '📝';
  const categoryColor = getCategoryThemeColor(categoryEmoji);
  const gradientStart = getCategoryColorWithOpacity(categoryEmoji, 0.1);
  const gradientEnd = getCategoryColorWithOpacity(categoryEmoji, 0.05);

  // Format time ago
  const timeAgo = getTimeAgo(game.played_at);

  // Format game mode
  const gameModeFormatted = formatGameMode(game.game_mode);

  // Determine game mode icon
  const GameModeIcon = game.game_mode === 'team' ? Users : User;

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.15 },
      }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div
          className="absolute top-3 left-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onCheckboxChange?.(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-neutral-600 bg-neutral-800 checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-colors duration-150"
          />
        </div>
      )}

      {/* Card Container */}
      <div
        className="relative overflow-hidden rounded-xl border border-neutral-700 transition-all duration-150"
        style={{
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        }}
      >
        {/* Category Color Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: categoryColor }}
        />

        {/* Content */}
        <div className="p-4 pt-5">
          {/* Header: Emoji + Category + Time */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Category Emoji Badge */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg"
                style={{
                  backgroundColor: getCategoryColorWithOpacity(categoryEmoji, 0.2),
                  border: `2px solid ${categoryColor}`,
                }}
              >
                {categoryEmoji}
              </div>

              {/* Category Name & Time */}
              <div>
                <h3 className="text-base font-semibold text-neutral-50">
                  {game.category_name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{timeAgo}</p>
              </div>
            </div>

            {/* Game Mode Badge */}
            <Badge variant="neutral" size="sm" className="shrink-0">
              <GameModeIcon className="w-3 h-3" />
              {gameModeFormatted}
            </Badge>
          </div>

          {/* Winner / Top Scorer */}
          {winner && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-neutral-800/40">
              <Trophy className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-neutral-50">
                {winner.participant_name}
              </span>
              <span className="text-sm text-neutral-400">kazandı</span>
              <span className="text-sm font-bold text-accent-500 ml-auto">
                {topScore.toLocaleString()} puan
              </span>
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            {/* Play Time */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatPlayTime(game.total_time_seconds)}</span>
            </div>

            {/* Participants Count */}
            <div className="flex items-center gap-1.5">
              <GameModeIcon className="w-3.5 h-3.5" />
              <span>
                {participants.length} {participants.length === 1 ? 'oyuncu' : 'oyuncu'}
              </span>
            </div>
          </div>

          {/* View Details Hint */}
          <div className="mt-3 pt-3 border-t border-neutral-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <span className="text-xs text-primary-400 font-medium">
              Detayları görmek için tıkla →
            </span>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getCategoryColorWithOpacity(categoryEmoji, 0.15)} 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Helper function to format time ago
 */
function getTimeAgo(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  if (diffWeek < 4) return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonth < 12) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
}
