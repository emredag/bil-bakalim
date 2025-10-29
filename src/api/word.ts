/**
 * Word API - Tauri Command Wrappers
 * PRD Reference: Section 5.3 - Word Management
 */
import { invoke } from '@tauri-apps/api/core';
import { Word } from '../types/database';

/**
 * Get all words for a specific category
 * PRD Reference: Section 5.3
 */
export async function getWordsByCategory(categoryId: number): Promise<Word[]> {
  return invoke<Word[]>('get_words_by_category', { categoryId });
}

/**
 * Add a new word to a category
 * PRD Reference: Section 5.4
 */
export async function addWord(categoryId: number, word: string, hint: string): Promise<Word> {
  return invoke<Word>('add_word', { categoryId, word, hint });
}

/**
 * Update an existing word
 * PRD Reference: Section 5.5
 */
export async function updateWord(id: number, word: string, hint: string): Promise<Word> {
  return invoke<Word>('update_word', { id, word, hint });
}

/**
 * Delete a word
 * PRD Reference: Section 5.6
 */
export async function deleteWord(id: number): Promise<void> {
  return invoke<void>('delete_word', { id });
}
