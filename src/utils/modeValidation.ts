/**
 * Mode Validation Utilities
 * Task 10: Game Mode Selection
 * PRD Reference: Section 4.3 - Mode Selection Validation
 *
 * Validates game modes based on category word count:
 * - Single Player: 14 words minimum
 * - Multiplayer: (participants × 14) words minimum
 * - Team: (teams × 14) words minimum
 */

import type { GameMode, ValidationResult } from '../types';

export interface ModeValidation {
  mode: GameMode;
  enabled: boolean;
  requiredWords: number;
  availableWords: number;
  participantCount?: number; // For multi/team modes
}

/**
 * Calculate required words for a game mode
 *
 * @param mode - Game mode (single, multi, team)
 * @param participantCount - Number of participants/teams (for multi/team modes)
 * @returns Required word count
 */
export function calculateRequiredWords(mode: GameMode, participantCount: number = 1): number {
  const wordsPerParticipant = 14; // PRD: Each participant/team gets 14 words

  switch (mode) {
    case 'single':
      return wordsPerParticipant; // 14 words
    case 'multi':
    case 'team':
      return participantCount * wordsPerParticipant;
    default:
      return wordsPerParticipant;
  }
}

/**
 * Validate if a mode is playable with available words
 *
 * @param mode - Game mode to validate
 * @param availableWords - Number of words in the category
 * @param participantCount - Number of participants/teams (default: min for mode)
 * @returns ModeValidation object
 */
export function validateMode(
  mode: GameMode,
  availableWords: number,
  participantCount?: number
): ModeValidation {
  // Determine default participant count if not provided
  let count = participantCount;
  if (count === undefined) {
    switch (mode) {
      case 'single':
        count = 1;
        break;
      case 'multi':
        count = 2; // Minimum 2 players for multiplayer
        break;
      case 'team':
        count = 2; // Minimum 2 teams for team mode
        break;
    }
  }

  const requiredWords = calculateRequiredWords(mode, count);
  const enabled = availableWords >= requiredWords;

  return {
    mode,
    enabled,
    requiredWords,
    availableWords,
    participantCount: count,
  };
}

/**
 * Validate all game modes for a category
 *
 * @param availableWords - Number of words in the category
 * @returns Array of ModeValidation for each mode
 */
export function validateAllModes(availableWords: number): ModeValidation[] {
  return [
    validateMode('single', availableWords, 1),
    validateMode('multi', availableWords, 2), // Minimum participants
    validateMode('team', availableWords, 2), // Minimum teams
  ];
}

/**
 * Get maximum participants/teams for a mode based on available words
 *
 * @param mode - Game mode
 * @param availableWords - Number of words in the category
 * @returns Maximum number of participants/teams
 */
export function getMaxParticipants(mode: GameMode, availableWords: number): number {
  const wordsPerParticipant = 14;

  switch (mode) {
    case 'single':
      return 1; // Always 1 for single player
    case 'multi':
      // PRD: 2-6 players
      return Math.min(6, Math.floor(availableWords / wordsPerParticipant));
    case 'team':
      // PRD: 2-4 teams
      return Math.min(4, Math.floor(availableWords / wordsPerParticipant));
    default:
      return 1;
  }
}

/**
 * Check if a category is playable (has at least 14 words for single player)
 *
 * @param validation - ValidationResult from backend
 * @returns true if category is playable
 */
export function isCategoryPlayable(validation: ValidationResult): boolean {
  return validation.is_valid && validation.total_words >= 14;
}

/**
 * Get playable modes for a category
 *
 * @param availableWords - Number of words in the category
 * @returns Array of playable GameMode values
 */
export function getPlayableModes(availableWords: number): GameMode[] {
  const modes = validateAllModes(availableWords);
  return modes.filter((m) => m.enabled).map((m) => m.mode);
}
