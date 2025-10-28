/**
 * Game History API - Tauri Command Wrappers
 * PRD Reference: Section 4.8 - Game History Screen
 */
import { invoke } from '@tauri-apps/api/core';

// ===== Types =====

export interface GameHistory {
  id: number;
  category_id: number;
  category_name: string;
  game_mode: string;
  played_at: string;
  total_time_seconds: number;
  created_at: string;
}

export interface GameParticipant {
  id: number;
  game_history_id: number;
  participant_name: string;
  participant_type: string;
  score: number;
  words_found: number;
  words_skipped: number;
  letters_revealed: number;
  rank: number;
}

export interface GameWordResult {
  id: number;
  game_history_id: number;
  participant_id: number;
  word: string;
  word_hint: string;
  result: string;
  points_earned: number;
  letters_used: number;
}

export interface GameHistoryStats {
  total_games: number;
  most_played_category: string | null;
  highest_score: number;
  total_play_time_seconds: number;
}

export interface GameSessionData {
  category_id: number;
  category_name: string;
  game_mode: string;
  played_at: string;
  total_time_seconds?: number;
  participants: ParticipantData[];
}

export interface ParticipantData {
  name: string;
  participant_type: string;
  score: number;
  words_found: number;
  words_skipped: number;
  letters_revealed: number;
  rank?: number;
  word_results: WordResultData[];
}

export interface WordResultData {
  word: string;
  word_hint?: string;
  result: string;
  points_earned: number;
  letters_used: number;
}

// ===== Query Options =====

export interface GameHistoryQueryOptions {
  category_id?: number;
  game_mode?: string;
  start_date?: string; // ISO date string
  end_date?: string;   // ISO date string
  sort_by?: 'date_desc' | 'date_asc' | 'score_desc';
  limit?: number;
  offset?: number;
}

// ===== API Functions =====

/**
 * Get all game history entries with optional filters
 * PRD: Section 4.8 - Filters include date range, category, game mode
 */
export async function getAllGameHistory(
  options: GameHistoryQueryOptions = {}
): Promise<GameHistory[]> {
  // Convert options to Record<string, unknown> for Tauri invoke
  const invokeOptions: Record<string, unknown> = {};
  if (options.category_id !== undefined) invokeOptions.categoryId = options.category_id;
  if (options.game_mode !== undefined) invokeOptions.gameMode = options.game_mode;
  if (options.start_date !== undefined) invokeOptions.startDate = options.start_date;
  if (options.end_date !== undefined) invokeOptions.endDate = options.end_date;
  if (options.sort_by !== undefined) invokeOptions.sortBy = options.sort_by;
  if (options.limit !== undefined) invokeOptions.limit = options.limit;
  if (options.offset !== undefined) invokeOptions.offset = options.offset;
  
  return invoke<GameHistory[]>('get_all_game_history', invokeOptions);
}

/**
 * Get a specific game history entry by ID
 */
export async function getGameHistoryById(id: number): Promise<GameHistory> {
  return invoke<GameHistory>('get_game_history_by_id', { id });
}

/**
 * Get all participants for a specific game
 */
export async function getGameParticipants(gameHistoryId: number): Promise<GameParticipant[]> {
  return invoke<GameParticipant[]>('get_game_participants', {
    gameHistoryId,
  });
}

/**
 * Get word results for a specific participant in a game
 */
export async function getParticipantWordResults(
  gameHistoryId: number,
  participantId: number
): Promise<GameWordResult[]> {
  return invoke<GameWordResult[]>('get_participant_word_results', {
    gameHistoryId,
    participantId,
  });
}

/**
 * Get game history statistics
 * PRD: Section 4.8 - Statistics Summary showing total games, most played category, etc.
 */
export async function getGameHistoryStats(): Promise<GameHistoryStats> {
  return invoke<GameHistoryStats>('get_game_history_stats');
}

/**
 * Delete a specific game history entry
 * PRD: Section 4.8 - Delete functionality with confirmation
 */
export async function deleteGameHistory(id: number): Promise<void> {
  return invoke<void>('delete_game_history', { id });
}

/**
 * Delete all game history entries
 * PRD: Section 4.8 - Delete All functionality with confirmation
 */
export async function deleteAllGameHistory(): Promise<void> {
  return invoke<void>('delete_all_game_history');
}

/**
 * Save a complete game session to history
 * This is called after a game ends to persist the results
 */
export async function saveGameToHistory(gameData: GameSessionData): Promise<number> {
  return invoke<number>('save_game_to_history', { session: gameData });
}

// ===== Helper Functions =====

/**
 * Format total play time seconds to human readable string
 * Example: 3665 seconds -> "1h 1m 5s"
 */
export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}sa`);
  if (minutes > 0) parts.push(`${minutes}dk`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}sn`);

  return parts.join(' ');
}

/**
 * Format game mode for display
 */
export function formatGameMode(mode: string): string {
  const modeMap: Record<string, string> = {
    single: 'Tek Oyuncu',
    multi: 'Çok Oyuncu',
    team: 'Takım',
  };
  return modeMap[mode] || mode;
}

/**
 * Export game history to JSON file
 * PRD: Section 4.8 - Export functionality
 */
export async function exportGameHistoryToJson(games: GameHistory[]): Promise<void> {
  // Get detailed data for each game
  const detailedGames = await Promise.all(
    games.map(async (game) => {
      const participants = await getGameParticipants(game.id);
      const participantsWithResults = await Promise.all(
        participants.map(async (participant) => {
          const wordResults = await getParticipantWordResults(game.id, participant.id);
          return { ...participant, word_results: wordResults };
        })
      );
      return { ...game, participants: participantsWithResults };
    })
  );

  // Create JSON blob
  const jsonStr = JSON.stringify(detailedGames, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oyun-gecmisi-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
