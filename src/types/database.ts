// Database-related types matching Rust models and PRD Section 2.4

/**
 * Category model from database
 * PRD Reference: Section 2.4 - categories table
 */
export interface Category {
  id: number;
  name: string;
  emoji: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Word model from database
 * PRD Reference: Section 2.4 - words table
 */
export interface Word {
  id: number;
  category_id: number;
  word: string;
  letter_count: number;
  hint: string;
  created_at: string;
}

/**
 * Word count grouped by letter length
 * Used in category validation
 */
export interface WordCountByLength {
  letter_count: number;
  count: number;
}

/**
 * Category validation result
 * PRD Reference: Section 3.3 - Category Validation
 */
export interface ValidationResult {
  is_valid: boolean;
  total_words: number;
  words_by_length: WordCountByLength[];
  max_players_single: number;
  max_players_multi: number;
  max_teams: number;
  message: string;
}

/**
 * Game history entry from database
 * PRD Reference: Section 2.4 - game_history table
 */
export interface GameHistory {
  id: number;
  category_id: number;
  category_name: string;
  game_mode: string;
  played_at: string;
  total_time_seconds: number | null;
  created_at: string;
}

/**
 * Game participant/team from database
 * PRD Reference: Section 2.4 - game_participants table
 */
export interface GameParticipant {
  id: number;
  game_history_id: number;
  participant_name: string;
  participant_type: 'player' | 'team';
  score: number;
  words_found: number;
  words_skipped: number;
  letters_revealed: number;
  rank: number | null;
  created_at: string;
}

/**
 * Word result from a game
 * PRD Reference: Section 2.4 - game_word_results table
 */
export interface GameWordResult {
  id: number;
  game_history_id: number;
  participant_id: number;
  word: string;
  word_hint: string | null;
  result: 'found' | 'skipped' | 'timeout';
  points_earned: number;
  letters_used: number;
  created_at: string;
}

/**
 * JSON Import/Export types
 * PRD Reference: Section 5.7 - JSON Import/Export
 */

/**
 * Category information for export (without DB-specific fields)
 */
export interface CategoryExportInfo {
  name: string;
  emoji: string;
  description: string | null;
}

/**
 * Word information for export (without DB-specific fields)
 */
export interface WordExportInfo {
  word: string;
  letter_count: number;
  hint: string;
}

/**
 * Complete category export data
 */
export interface CategoryExportData {
  category: CategoryExportInfo;
  words: WordExportInfo[];
}

/**
 * Import result statistics
 */
export interface ImportResult {
  words_added: number;
  words_skipped: number;
  message: string;
}

/**
 * Game history statistics summary
 * Used in main menu quick stats
 */
export interface GameHistoryStats {
  totalGames: number;
  highScore: {
    score: number;
    player: string;
    date: string;
  } | null;
  mostPlayedCategory: {
    name: string;
    emoji: string;
    count: number;
  } | null;
  totalTime: number; // Total time in seconds
}

/**
 * Last game summary for main menu
 * Includes game info and winner details
 */
export interface LastGameSummary {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryEmoji: string;
  gameMode: 'single' | 'multi' | 'team';
  playedAt: string;
  winner: {
    name: string;
    score: number;
  };
  participantCount: number;
}
