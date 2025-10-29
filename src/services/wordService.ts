/**
 * Word Service - Word management and selection logic
 * PRD Reference: Section 4.6 - Word Selection Algorithm
 *
 * Handles:
 * - Random word selection for games
 * - Word validation
 * - Category validation for different game modes
 */

import { invoke } from '@tauri-apps/api/core';
import type { Word } from '../types';
import type { GameWord } from '../types/game';

/**
 * Safe invoke wrapper that checks if Tauri is available
 */
async function safeInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    return invoke<T>(cmd, args);
  }
  throw new Error('Tauri is not available. Please run in Tauri app mode (npm run tauri dev)');
}

/**
 * Get all words for a category
 * PRD Reference: Section 14.1 - Tauri Commands
 */
export async function getWordsByCategory(categoryId: number): Promise<Word[]> {
  try {
    return await safeInvoke<Word[]>('get_words_by_category', { categoryId });
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
}

/**
 * Add a new word to a category
 * PRD Reference: Section 14.1 - Tauri Commands
 */
export async function addWord(categoryId: number, word: string, hint: string): Promise<Word> {
  try {
    return await safeInvoke<Word>('add_word', { categoryId, word, hint });
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
}

/**
 * Update an existing word
 * PRD Reference: Section 14.1 - Tauri Commands
 */
export async function updateWord(id: number, word: string, hint: string): Promise<Word> {
  try {
    return await safeInvoke<Word>('update_word', { id, word, hint });
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
}

/**
 * Delete a word
 * PRD Reference: Section 14.1 - Tauri Commands
 */
export async function deleteWord(id: number): Promise<void> {
  try {
    await safeInvoke<void>('delete_word', { id });
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
}

/**
 * Get random words for game play
 * PRD Reference: Section 4.6 - Word Selection Algorithm
 *
 * Selects exactly 14 words: 2 from each letter length (4-10)
 * In multiplayer/team mode, uses exclude_ids to prevent duplicates
 *
 * @param categoryId - Category to select words from
 * @param excludeIds - List of word IDs already selected for other players (optional)
 * @returns Array of 14 random words
 */
export async function getRandomWords(
  categoryId: number,
  excludeIds: number[] = []
): Promise<Word[]> {
  try {
    console.debug('[wordService] getRandomWords called', { categoryId, excludeIds });
    return await safeInvoke<Word[]>('get_random_words', {
      categoryId,
      excludeIds,
    });
  } catch (error) {
    console.error('[wordService] Error getting random words:', { categoryId, excludeIds, error });
    throw error;
  }
}

/**
 * Validate if category has enough words for a game mode
 * PRD Reference: Section 4.6 - Category Validation
 *
 * @param categoryId - Category to validate
 * @param mode - Game mode: 'single', 'multi', or 'team'
 * @param participantCount - Number of players or teams
 * @returns true if category has enough words
 */
export async function validateCategoryForMode(
  categoryId: number,
  mode: string,
  participantCount: number
): Promise<boolean> {
  try {
    console.debug('[wordService] validateCategoryForMode called', {
      categoryId,
      mode,
      participantCount,
    });
    return await safeInvoke<boolean>('validate_category_for_mode', {
      categoryId,
      mode,
      participantCount,
    });
  } catch (error) {
    console.error('[wordService] Error validating category:', {
      categoryId,
      mode,
      participantCount,
      error,
    });
    throw error;
  }
}

/**
 * Select words for all participants in a game
 * PRD Reference: Section 4.6 - Word Selection Algorithm
 *
 * SINGLE MODE:
 * - Selects 14 random words (2 per length 4-10)
 * - Returns array with single word set
 *
 * MULTI MODE:
 * - Each player gets unique 14 words
 * - No word duplication across players
 * - Returns array of word sets (one per player)
 *
 * TEAM MODE:
 * - Each team gets unique 14 words
 * - Team members share the same word set
 * - Returns array of word sets (one per team)
 *
 * @param categoryId - Category to select from
 * @param mode - Game mode
 * @param participantCount - Number of players or teams
 * @returns Array of GameWord arrays (one per participant)
 */
export async function selectWordsForGame(
  categoryId: number,
  mode: 'single' | 'multi' | 'team',
  participantCount: number
): Promise<GameWord[][]> {
  try {
    console.debug('[wordService] selectWordsForGame called', {
      categoryId,
      mode,
      participantCount,
    });

    // Validate category first
    const isValid = await validateCategoryForMode(categoryId, mode, participantCount);

    if (!isValid) {
      throw new Error(
        `Kategori bu mod için yeterli kelimeye sahip değil. ${
          participantCount
        } ${mode === 'team' ? 'takım' : 'yarışmacı'} için toplam ${
          participantCount * 14
        } kelime gerekiyor (her uzunluktan ${participantCount * 2} adet).`
      );
    }

    const allWordSets: GameWord[][] = [];
    const usedWordIds: number[] = [];

    // Select words for each participant
    for (let i = 0; i < participantCount; i++) {
      // Get random words, excluding already used ones
      const words = await getRandomWords(categoryId, usedWordIds);

      console.debug('[wordService] getRandomWords returned', {
        participantIndex: i,
        count: words.length,
      });

      // Track used word IDs for next iteration
      words.forEach((word) => usedWordIds.push(word.id));

      // Convert Word[] to GameWord[]
      const gameWords: GameWord[] = words.map((word) => ({
        id: word.id,
        word: word.word,
        hint: word.hint,
        letterCount: word.letter_count,
        letters: word.word.split('').map((char, index) => ({
          char,
          index,
          status: 'hidden' as const,
        })),
        lettersRevealed: 0,
        remainingGuesses: 3, // PRD: max 3 guesses per word
        hasMadeGuess: false,
        result: null,
        pointsEarned: 0,
      }));

      allWordSets.push(gameWords);
    }

    console.debug('[wordService] selectWordsForGame result', { totalSets: allWordSets.length });
    return allWordSets;
  } catch (error) {
    console.error('[wordService] Error selecting words for game:', {
      categoryId,
      mode,
      participantCount,
      error,
    });
    // Re-throw so upper layers (UI) can surface the message
    throw error;
  }
}
