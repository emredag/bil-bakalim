/**
 * useGameHistory Hook
 * Design System v2.0 - Main Menu Migration
 *
 * Fetches game history statistics and last played game
 * Used for Quick Stats and Recent Activity sections
 */

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  GameHistoryStats,
  LastGameSummary,
  GameHistory,
  GameParticipant,
  Category,
} from '../types/database';

export interface UseGameHistoryResult {
  stats: GameHistoryStats | null;
  lastGame: LastGameSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useGameHistory - Fetch game history data for main menu
 *
 * Features:
 * - Fetches overall statistics (total games, high score, most played, total time)
 * - Fetches last played game with winner info
 * - Loading and error states
 * - Manual refetch capability
 *
 * @returns Game history data and utility functions
 */
export function useGameHistory(): UseGameHistoryResult {
  const [stats, setStats] = useState<GameHistoryStats | null>(null);
  const [lastGame, setLastGame] = useState<LastGameSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics and last game in parallel
      const [fetchedStats, lastGameHistory] = await Promise.all([
        fetchStats(),
        fetchLastGame(),
      ]);

      setStats(fetchedStats);
      setLastGame(lastGameHistory);
    } catch (err) {
      console.error('Failed to fetch game history:', err);
      setError(err instanceof Error ? err.message : 'Oyun geçmişi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch overall statistics
   */
  const fetchStats = async (): Promise<GameHistoryStats> => {
    try {
      // Get all game history entries
      const allGames = await invoke<GameHistory[]>('get_all_game_history', {
        limit: 1000, // Get all games for stats
        offset: 0,
      });

      if (allGames.length === 0) {
        return {
          totalGames: 0,
          highScore: null,
          mostPlayedCategory: null,
          totalTime: 0,
        };
      }

      // Calculate total games
      const totalGames = allGames.length;

      // Calculate total time
      const totalTime = allGames.reduce(
        (sum, game) => sum + (game.total_time_seconds || 0),
        0
      );

      // Find high score across all games
      let highScore: GameHistoryStats['highScore'] = null;
      for (const game of allGames) {
        const participants = await invoke<GameParticipant[]>('get_game_participants', {
          gameHistoryId: game.id,
        });

        if (participants.length > 0) {
          // Find the winner (rank 1 or highest score if no rank)
          const winner = participants.sort((a, b) => {
            if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
            return b.score - a.score;
          })[0];

          if (!highScore || winner.score > highScore.score) {
            highScore = {
              score: winner.score,
              player: winner.participant_name,
              date: game.played_at,
            };
          }
        }
      }

      // Find most played category
      const categoryCount = new Map<number, { count: number; name: string; emoji: string }>();
      for (const game of allGames) {
        const existing = categoryCount.get(game.category_id);
        if (existing) {
          existing.count++;
        } else {
          // Try to get category emoji, fallback to game's category_name
          let emoji = '📝'; // Default emoji
          try {
            const category = await invoke<Category>('get_category_by_id', {
              id: game.category_id,
            });
            emoji = category.emoji || '📝';
          } catch {
            // If category fetch fails, use default
          }

          categoryCount.set(game.category_id, {
            count: 1,
            name: game.category_name,
            emoji,
          });
        }
      }

      let mostPlayedCategory: GameHistoryStats['mostPlayedCategory'] = null;
      let maxCount = 0;
      for (const [, data] of categoryCount) {
        if (data.count > maxCount) {
          maxCount = data.count;
          mostPlayedCategory = {
            name: data.name,
            emoji: data.emoji,
            count: data.count,
          };
        }
      }

      return {
        totalGames,
        highScore,
        mostPlayedCategory,
        totalTime,
      };
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      throw err;
    }
  };

  /**
   * Fetch last played game
   */
  const fetchLastGame = async (): Promise<LastGameSummary | null> => {
    try {
      // Get the most recent game (limit 1)
      const recentGames = await invoke<GameHistory[]>('get_all_game_history', {
        sortBy: 'date_desc',
        limit: 1,
        offset: 0,
      });

      if (recentGames.length === 0) {
        return null;
      }

      const game = recentGames[0];

      // Get participants to find the winner
      const participants = await invoke<GameParticipant[]>('get_game_participants', {
        gameHistoryId: game.id,
      });

      if (participants.length === 0) {
        return null;
      }

      // Find the winner (rank 1 or highest score if no rank)
      const winner = participants.sort((a, b) => {
        if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
        return b.score - a.score;
      })[0];

      // Get category emoji
      let categoryEmoji = '📝';
      try {
        const category = await invoke<Category>('get_category_by_id', {
          id: game.category_id,
        });
        categoryEmoji = category.emoji || '📝';
      } catch {
        // Use default emoji if category fetch fails
      }

      return {
        id: game.id,
        categoryId: game.category_id,
        categoryName: game.category_name,
        categoryEmoji,
        gameMode: game.game_mode as 'single' | 'multi' | 'team',
        playedAt: game.played_at,
        winner: {
          name: winner.participant_name,
          score: winner.score,
        },
        participantCount: participants.length,
      };
    } catch (err) {
      console.error('Failed to fetch last game:', err);
      // Don't throw - last game is optional
      return null;
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  return {
    stats,
    lastGame,
    loading,
    error,
    refetch: fetchGameHistory,
  };
}
