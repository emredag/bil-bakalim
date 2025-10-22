/**
 * Category Validation Utilities
 * Task 29: Category Validation
 * PRD Reference: Section 3.3 - Category Validation
 *
 * Provides validation logic for categories based on word requirements for each game mode.
 * Includes detailed validation messages and playability indicators.
 */

import type { ValidationResult, WordCountByLength } from '../types/database';
import type { GameMode } from '../types/game';

/**
 * Detailed validation information for category UI
 */
export interface CategoryValidationInfo {
  /** Overall validity - can play at least single mode */
  isValid: boolean;
  
  /** Total words in category */
  totalWords: number;
  
  /** Words grouped by letter count (4-10) */
  wordsByLength: WordCountByLength[];
  
  /** Maximum supported single players (0 or 1) */
  maxPlayersSingle: number;
  
  /** Maximum supported multiplayer participants (0-6) */
  maxPlayersMulti: number;
  
  /** Maximum supported teams (0-4) */
  maxTeams: number;
  
  /** Primary validation message */
  message: string;
  
  /** Detailed validation messages by mode */
  modeMessages: {
    single: string;
    multi: string;
    team: string;
  };
  
  /** Insufficient letter lengths (< 2 words) */
  insufficientLengths: number[];
  
  /** Visual indicator type */
  indicatorType: 'success' | 'warning' | 'error';
  
  /** Short label for badge */
  badgeLabel: string;
}

/**
 * Calculate required words for a game mode and participant count
 */
export function calculateRequiredWords(
  mode: GameMode,
  participantCount: number = 1
): number {
  const WORDS_PER_PARTICIPANT = 14;
  
  if (mode === 'single') {
    return WORDS_PER_PARTICIPANT;
  }
  
  return participantCount * WORDS_PER_PARTICIPANT;
}

/**
 * Calculate required words per letter length for a game mode
 */
export function calculateRequiredWordsPerLength(
  mode: GameMode,
  participantCount: number = 1
): number {
  const WORDS_PER_LENGTH = 2; // Each length needs 2 words per participant
  
  if (mode === 'single') {
    return WORDS_PER_LENGTH;
  }
  
  return participantCount * WORDS_PER_LENGTH;
}

/**
 * Validate category for a specific mode and participant count
 */
export function validateForMode(
  validation: ValidationResult,
  mode: GameMode,
  participantCount: number = 1
): { isValid: boolean; message: string } {
  const requiredTotal = calculateRequiredWords(mode, participantCount);
  const requiredPerLength = calculateRequiredWordsPerLength(mode, participantCount);
  
  // Check total words
  if (validation.total_words < requiredTotal) {
    return {
      isValid: false,
      message: `❌ Yetersiz: ${requiredTotal} kelime gerekli (mevcut: ${validation.total_words})`
    };
  }
  
  // Check words per length
  const insufficientLengths = validation.words_by_length.filter(
    (wbl) => wbl.count < requiredPerLength
  );
  
  if (insufficientLengths.length > 0) {
    const lengthStr = insufficientLengths.map((wbl) => `${wbl.letter_count} harf`).join(', ');
    return {
      isValid: false,
      message: `❌ Yetersiz: ${lengthStr} kelime sayısı yetersiz (en az ${requiredPerLength} olmalı)`
    };
  }
  
  return {
    isValid: true,
    message: `✅ Oynanabilir (${validation.total_words} kelime)`
  };
}

/**
 * Get maximum supported participants for a mode
 */
export function getMaxParticipantsForMode(
  validation: ValidationResult,
  mode: GameMode
): number {
  if (mode === 'single') {
    return validation.is_valid ? 1 : 0;
  }
  
  // Find minimum words per length
  const minWordsPerLength = Math.min(
    ...validation.words_by_length.map((wbl) => wbl.count)
  );
  
  // Each participant needs 2 words per length
  const maxByLength = Math.floor(minWordsPerLength / 2);
  
  // Apply mode-specific limits
  if (mode === 'multi') {
    return Math.min(6, maxByLength); // Max 6 players for multiplayer
  } else if (mode === 'team') {
    return Math.min(4, maxByLength); // Max 4 teams
  }
  
  return 0;
}

/**
 * Get insufficient letter lengths (with less than required words)
 */
export function getInsufficientLengths(
  validation: ValidationResult,
  requiredPerLength: number = 2
): number[] {
  return validation.words_by_length
    .filter((wbl) => wbl.count < requiredPerLength)
    .map((wbl) => wbl.letter_count);
}

/**
 * Generate detailed validation messages for all modes
 */
export function generateModeMessages(validation: ValidationResult): {
  single: string;
  multi: string;
  team: string;
} {
  // Single player validation
  const singleValidation = validateForMode(validation, 'single', 1);
  
  // Multiplayer validation (check for 2-6 players)
  let multiMessage = '';
  const maxMulti = getMaxParticipantsForMode(validation, 'multi');
  if (maxMulti === 0) {
    multiMessage = '❌ Oynanamaz: En az 28 kelime gerekli (2 yarışmacı için)';
  } else if (maxMulti === 1) {
    multiMessage = '⚠️ Sadece tek yarışmacı modu için yeterli';
  } else {
    multiMessage = `✅ ${maxMulti} yarışmacıya kadar oynanabilir`;
  }
  
  // Team mode validation (check for 2-4 teams)
  let teamMessage = '';
  const maxTeams = getMaxParticipantsForMode(validation, 'team');
  if (maxTeams === 0) {
    teamMessage = '❌ Oynanamaz: En az 28 kelime gerekli (2 takım için)';
  } else if (maxTeams === 1) {
    teamMessage = '⚠️ Sadece tek yarışmacı modu için yeterli';
  } else {
    teamMessage = `✅ ${maxTeams} takıma kadar oynanabilir`;
  }
  
  return {
    single: singleValidation.message,
    multi: multiMessage,
    team: teamMessage,
  };
}

/**
 * Convert backend ValidationResult to detailed CategoryValidationInfo
 */
export function enrichValidationResult(
  validation: ValidationResult
): CategoryValidationInfo {
  const modeMessages = generateModeMessages(validation);
  const insufficientLengths = getInsufficientLengths(validation, 2);
  
  // Determine indicator type
  let indicatorType: 'success' | 'warning' | 'error' = 'success';
  let badgeLabel = 'Oynanabilir';
  
  if (!validation.is_valid) {
    indicatorType = 'error';
    badgeLabel = 'Oynanamaz';
  } else if (validation.max_players_multi === 1) {
    indicatorType = 'warning';
    badgeLabel = 'Sınırlı';
  }
  
  return {
    isValid: validation.is_valid,
    totalWords: validation.total_words,
    wordsByLength: validation.words_by_length,
    maxPlayersSingle: validation.max_players_single,
    maxPlayersMulti: validation.max_players_multi,
    maxTeams: validation.max_teams,
    message: validation.message,
    modeMessages,
    insufficientLengths,
    indicatorType,
    badgeLabel,
  };
}

/**
 * Format validation message with participant count
 * Used for dynamic validation in participant setup
 */
export function formatValidationMessage(
  validation: ValidationResult,
  mode: GameMode,
  participantCount: number
): string {
  const modeValidation = validateForMode(validation, mode, participantCount);
  return modeValidation.message;
}

/**
 * Check if category can support a specific setup
 */
export function canSupportSetup(
  validation: ValidationResult,
  mode: GameMode,
  participantCount: number
): boolean {
  const modeValidation = validateForMode(validation, mode, participantCount);
  return modeValidation.isValid;
}

/**
 * Get tooltip content for category validation
 */
export function getValidationTooltip(validation: ValidationResult): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`📊 Kategori Durumu: ${validation.message}`);
  lines.push('');
  
  // Total words
  lines.push(`Toplam kelime: ${validation.total_words}`);
  lines.push('');
  
  // Words by length
  lines.push('Harf uzunluğuna göre:');
  validation.words_by_length.forEach((wbl) => {
    const icon = wbl.count >= 2 ? '✓' : '✗';
    lines.push(`  ${icon} ${wbl.letter_count} harf: ${wbl.count} kelime`);
  });
  lines.push('');
  
  // Mode compatibility
  lines.push('Mod Uyumluluğu:');
  if (validation.max_players_single > 0) {
    lines.push('  ✓ Tek Yarışmacı');
  }
  if (validation.max_players_multi > 1) {
    lines.push(`  ✓ Çoklu Yarışmacı (${validation.max_players_multi} kişiye kadar)`);
  }
  if (validation.max_teams > 1) {
    lines.push(`  ✓ Takım Modu (${validation.max_teams} takıma kadar)`);
  }
  
  return lines.join('\n');
}

/**
 * Get playable modes array
 */
export function getPlayableModes(validation: ValidationResult): GameMode[] {
  const modes: GameMode[] = [];
  
  if (validation.max_players_single > 0) {
    modes.push('single');
  }
  if (validation.max_players_multi > 1) {
    modes.push('multi');
  }
  if (validation.max_teams > 1) {
    modes.push('team');
  }
  
  return modes;
}

/**
 * Format insufficient lengths for display
 */
export function formatInsufficientLengths(insufficientLengths: number[]): string {
  if (insufficientLengths.length === 0) {
    return '';
  }
  
  if (insufficientLengths.length === 1) {
    return `${insufficientLengths[0]} harfli kelime yetersiz`;
  }
  
  return `${insufficientLengths.join(', ')} harfli kelimeler yetersiz`;
}
