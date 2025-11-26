import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { GameHistory, GameParticipant } from '../../api/gameHistory';
import type { Category } from '../../types/database';
import { GameCardThumbnail } from './GameCardThumbnail';
import { getCategoryThemeColor } from '../../utils/categoryColors';

export interface TimelineViewProps {
  games: GameHistory[];
  categories: Category[];
  participantsMap: Map<number, GameParticipant[]>;
  onGameClick?: (gameId: number) => void;
  onGameSelect?: (gameId: number, selected: boolean) => void;
  selectedGameIds?: Set<number>;
  showCheckboxes?: boolean;
  className?: string;
}

interface TimelineGroup {
  label: string;
  games: GameHistory[];
}

/**
 * TimelineView Component
 *
 * Chronological timeline layout for game history.
 * Part of Design System v2.0 - GameHistoryScreen migration.
 *
 * Features:
 * - Groups games by date (Today, Yesterday, This Week, etc.)
 * - Vertical timeline with category-colored dots
 * - GameCardThumbnail integration
 * - Stagger animations
 *
 * @example
 * <TimelineView
 *   games={games}
 *   categories={categories}
 *   participantsMap={participantsMap}
 *   onGameClick={(id) => navigate(`/game-history/${id}`)}
 * />
 */
export const TimelineView: React.FC<TimelineViewProps> = ({
  games,
  categories,
  participantsMap,
  onGameClick,
  onGameSelect,
  selectedGameIds = new Set(),
  showCheckboxes = false,
  className = '',
}) => {
  // Group games by date
  const timelineGroups = useMemo(() => {
    const groups: TimelineGroup[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date(today);
    thisMonth.setDate(thisMonth.getDate() - 30);

    const todayGames: GameHistory[] = [];
    const yesterdayGames: GameHistory[] = [];
    const thisWeekGames: GameHistory[] = [];
    const thisMonthGames: GameHistory[] = [];
    const olderGames: GameHistory[] = [];

    games.forEach((game) => {
      const gameDate = new Date(game.played_at);
      if (gameDate >= today) {
        todayGames.push(game);
      } else if (gameDate >= yesterday) {
        yesterdayGames.push(game);
      } else if (gameDate >= thisWeek) {
        thisWeekGames.push(game);
      } else if (gameDate >= thisMonth) {
        thisMonthGames.push(game);
      } else {
        olderGames.push(game);
      }
    });

    if (todayGames.length > 0) {
      groups.push({ label: 'Today', games: todayGames });
    }
    if (yesterdayGames.length > 0) {
      groups.push({ label: 'Yesterday', games: yesterdayGames });
    }
    if (thisWeekGames.length > 0) {
      groups.push({ label: 'This Week', games: thisWeekGames });
    }
    if (thisMonthGames.length > 0) {
      groups.push({ label: 'This Month', games: thisMonthGames });
    }
    if (olderGames.length > 0) {
      groups.push({ label: 'Older', games: olderGames });
    }

    return groups;
  }, [games]);

  // Create category map for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  if (games.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <p className="text-neutral-400">No games found</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line (vertical) */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-800" />

        {/* Timeline Groups */}
        <div className="space-y-8">
          {timelineGroups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="relative"
            >
              {/* Date Label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative z-10 bg-neutral-950 pr-4">
                  <h3 className="text-lg font-bold text-neutral-50">{group.label}</h3>
                  <div className="h-0.5 w-12 bg-primary-500 mt-1" />
                </div>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              {/* Games in this group */}
              <div className="space-y-4 pl-4">
                {group.games.map((game, gameIndex) => {
                  const category = categoryMap.get(game.category_id);
                  const participants = participantsMap.get(game.id) || [];
                  const categoryColor = category
                    ? getCategoryThemeColor(category.emoji)
                    : '#a3a3a3';

                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: groupIndex * 0.1 + gameIndex * 0.05,
                        duration: 0.25,
                      }}
                      className="relative flex gap-4"
                    >
                      {/* Timeline Dot */}
                      <div className="relative flex items-center justify-center shrink-0">
                        {/* Connecting Line to dot */}
                        <div
                          className="absolute left-1/2 top-1/2 w-4 h-0.5"
                          style={{
                            background: `linear-gradient(to right, ${categoryColor}, transparent)`,
                            transform: 'translateY(-50%)',
                          }}
                        />
                        {/* Dot */}
                        <div
                          className="relative z-10 w-3 h-3 rounded-full border-2 border-neutral-950 shadow-lg"
                          style={{
                            backgroundColor: categoryColor,
                            boxShadow: `0 0 12px ${categoryColor}40`,
                          }}
                        />
                      </div>

                      {/* Game Card */}
                      <div className="flex-1">
                        <GameCardThumbnail
                          game={game}
                          category={category}
                          participants={participants}
                          onClick={() => onGameClick?.(game.id)}
                          onCheckboxChange={(checked) =>
                            onGameSelect?.(game.id, checked)
                          }
                          isSelected={selectedGameIds.has(game.id)}
                          showCheckbox={showCheckboxes}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
