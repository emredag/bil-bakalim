import { describe, it, expect } from 'vitest';
import {
  calculateRequiredWords,
  calculateRequiredWordsPerLength,
  validateForMode,
  getMaxParticipantsForMode,
  getInsufficientLengths,
  generateModeMessages,
  enrichValidationResult,
  canSupportSetup,
  getPlayableModes,
  formatInsufficientLengths,
} from './categoryValidation';
import type { ValidationResult } from '../types/database';
import type { GameMode } from '../types/game';

describe('categoryValidation', () => {
  describe('calculateRequiredWords', () => {
    it('should return 14 for single player mode', () => {
      expect(calculateRequiredWords('single', 1)).toBe(14);
    });

    it('should return 28 for 2 players in multi mode', () => {
      expect(calculateRequiredWords('multi', 2)).toBe(28);
    });

    it('should return 42 for 3 players in multi mode', () => {
      expect(calculateRequiredWords('multi', 3)).toBe(42);
    });

    it('should return 84 for 6 players in multi mode', () => {
      expect(calculateRequiredWords('multi', 6)).toBe(84);
    });

    it('should return 28 for 2 teams in team mode', () => {
      expect(calculateRequiredWords('team', 2)).toBe(28);
    });

    it('should return 56 for 4 teams in team mode', () => {
      expect(calculateRequiredWords('team', 4)).toBe(56);
    });
  });

  describe('calculateRequiredWordsPerLength', () => {
    it('should return 2 for single player mode', () => {
      expect(calculateRequiredWordsPerLength('single', 1)).toBe(2);
    });

    it('should return 4 for 2 players in multi mode', () => {
      expect(calculateRequiredWordsPerLength('multi', 2)).toBe(4);
    });

    it('should return 6 for 3 players in multi mode', () => {
      expect(calculateRequiredWordsPerLength('multi', 3)).toBe(6);
    });

    it('should return 12 for 6 players in multi mode', () => {
      expect(calculateRequiredWordsPerLength('multi', 6)).toBe(12);
    });
  });

  describe('validateForMode', () => {
    const createMockValidation = (
      totalWords: number,
      wordsPerLength: number[] = [2, 2, 2, 2, 2, 2, 2]
    ): ValidationResult => ({
      is_valid: true,
      total_words: totalWords,
      words_by_length: wordsPerLength.map((count, index) => ({
        letter_count: index + 4,
        count,
      })),
      max_players_single: 1,
      max_players_multi: 6,
      max_teams: 4,
      message: 'Valid',
    });

    it('should validate single mode with 14 words', () => {
      const validation = createMockValidation(14);
      const result = validateForMode(validation, 'single', 1);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('✅');
    });

    it('should fail validation with less than 14 words for single mode', () => {
      const validation = createMockValidation(13);
      const result = validateForMode(validation, 'single', 1);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('❌');
      expect(result.message).toContain('14 kelime gerekli');
    });

    it('should validate multi mode with 28 words for 2 players', () => {
      const validation = createMockValidation(28, [4, 4, 4, 4, 4, 4, 4]);
      const result = validateForMode(validation, 'multi', 2);
      expect(result.isValid).toBe(true);
    });

    it('should fail validation when insufficient words per length', () => {
      const validation = createMockValidation(28, [1, 4, 4, 4, 4, 4, 4]);
      const result = validateForMode(validation, 'multi', 2);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('4 harf');
    });

    it('should validate team mode with 56 words for 4 teams', () => {
      const validation = createMockValidation(56, [8, 8, 8, 8, 8, 8, 8]);
      const result = validateForMode(validation, 'team', 4);
      expect(result.isValid).toBe(true);
    });
  });

  describe('getMaxParticipantsForMode', () => {
    it('should return 1 for valid single mode', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 14,
        words_by_length: [],
        max_players_single: 1,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Valid',
      };
      expect(getMaxParticipantsForMode(validation, 'single')).toBe(1);
    });

    it('should return 0 for invalid single mode', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 10,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      expect(getMaxParticipantsForMode(validation, 'single')).toBe(0);
    });

    it('should return max 6 for multi mode', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 100,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 20 })),
        max_players_single: 1,
        max_players_multi: 6,
        max_teams: 4,
        message: 'Valid',
      };
      expect(getMaxParticipantsForMode(validation, 'multi')).toBe(6);
    });

    it('should return max 4 for team mode', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 100,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 20 })),
        max_players_single: 1,
        max_players_multi: 6,
        max_teams: 4,
        message: 'Valid',
      };
      expect(getMaxParticipantsForMode(validation, 'team')).toBe(4);
    });

    it('should limit participants based on minimum words per length', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 50,
        words_by_length: [
          { letter_count: 4, count: 6 },
          { letter_count: 5, count: 6 },
          { letter_count: 6, count: 6 },
          { letter_count: 7, count: 6 },
          { letter_count: 8, count: 6 },
          { letter_count: 9, count: 6 },
          { letter_count: 10, count: 6 },
        ],
        max_players_single: 1,
        max_players_multi: 3,
        max_teams: 3,
        message: 'Valid',
      };
      // 6 words per length / 2 = 3 max participants
      expect(getMaxParticipantsForMode(validation, 'multi')).toBe(3);
    });
  });

  describe('getInsufficientLengths', () => {
    it('should return empty array when all lengths have enough words', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 20,
        words_by_length: [
          { letter_count: 4, count: 2 },
          { letter_count: 5, count: 3 },
          { letter_count: 6, count: 4 },
        ],
        max_players_single: 1,
        max_players_multi: 1,
        max_teams: 1,
        message: 'Valid',
      };
      expect(getInsufficientLengths(validation, 2)).toEqual([]);
    });

    it('should return lengths with insufficient words', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 10,
        words_by_length: [
          { letter_count: 4, count: 1 },
          { letter_count: 5, count: 2 },
          { letter_count: 6, count: 1 },
        ],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      expect(getInsufficientLengths(validation, 2)).toEqual([4, 6]);
    });
  });

  describe('generateModeMessages', () => {
    it('should generate messages for valid category', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 56,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 8 })),
        max_players_single: 1,
        max_players_multi: 4,
        max_teams: 4,
        message: 'Valid',
      };
      const messages = generateModeMessages(validation);
      expect(messages.single).toContain('✅');
      expect(messages.multi).toContain('✅');
      expect(messages.team).toContain('✅');
    });

    it('should generate error messages for invalid category', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 10,
        words_by_length: [{ letter_count: 4, count: 1 }],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      const messages = generateModeMessages(validation);
      expect(messages.single).toContain('❌');
      expect(messages.multi).toContain('❌');
      expect(messages.team).toContain('❌');
    });
  });

  describe('enrichValidationResult', () => {
    it('should enrich validation result with additional info', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 50,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 7 })),
        max_players_single: 1,
        max_players_multi: 3,
        max_teams: 3,
        message: 'Valid',
      };
      const enriched = enrichValidationResult(validation);
      expect(enriched.isValid).toBe(true);
      expect(enriched.totalWords).toBe(50);
      expect(enriched.indicatorType).toBe('success');
      expect(enriched.badgeLabel).toBe('Oynanabilir');
      expect(enriched.modeMessages).toBeDefined();
    });

    it('should mark as error for invalid category', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 10,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      const enriched = enrichValidationResult(validation);
      expect(enriched.isValid).toBe(false);
      expect(enriched.indicatorType).toBe('error');
      expect(enriched.badgeLabel).toBe('Oynanamaz');
    });

    it('should mark as warning for limited category', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 14,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 2 })),
        max_players_single: 1,
        max_players_multi: 1,
        max_teams: 1,
        message: 'Valid',
      };
      const enriched = enrichValidationResult(validation);
      expect(enriched.isValid).toBe(true);
      expect(enriched.indicatorType).toBe('warning');
      expect(enriched.badgeLabel).toBe('Sınırlı');
    });
  });

  describe('canSupportSetup', () => {
    const validation: ValidationResult = {
      is_valid: true,
      total_words: 56,
      words_by_length: Array(7)
        .fill(0)
        .map((_, i) => ({ letter_count: i + 4, count: 8 })),
      max_players_single: 1,
      max_players_multi: 4,
      max_teams: 4,
      message: 'Valid',
    };

    it('should return true for supported single mode', () => {
      expect(canSupportSetup(validation, 'single', 1)).toBe(true);
    });

    it('should return true for supported multi mode', () => {
      expect(canSupportSetup(validation, 'multi', 4)).toBe(true);
    });

    it('should return false for unsupported participant count', () => {
      expect(canSupportSetup(validation, 'multi', 5)).toBe(false);
    });

    it('should return true for supported team mode', () => {
      expect(canSupportSetup(validation, 'team', 4)).toBe(true);
    });
  });

  describe('getPlayableModes', () => {
    it('should return all modes for rich category', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 100,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 15 })),
        max_players_single: 1,
        max_players_multi: 6,
        max_teams: 4,
        message: 'Valid',
      };
      const modes = getPlayableModes(validation);
      expect(modes).toContain('single');
      expect(modes).toContain('multi');
      expect(modes).toContain('team');
    });

    it('should return only single mode for limited category', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 14,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 2 })),
        max_players_single: 1,
        max_players_multi: 1,
        max_teams: 1,
        message: 'Valid',
      };
      const modes = getPlayableModes(validation);
      expect(modes).toContain('single');
      expect(modes).not.toContain('multi');
      expect(modes).not.toContain('team');
    });

    it('should return empty array for invalid category', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 10,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      const modes = getPlayableModes(validation);
      expect(modes).toEqual([]);
    });
  });

  describe('formatInsufficientLengths', () => {
    it('should return empty string for no insufficient lengths', () => {
      expect(formatInsufficientLengths([])).toBe('');
    });

    it('should format single insufficient length', () => {
      expect(formatInsufficientLengths([5])).toBe('5 harfli kelime yetersiz');
    });

    it('should format multiple insufficient lengths', () => {
      expect(formatInsufficientLengths([4, 6, 8])).toBe('4, 6, 8 harfli kelimeler yetersiz');
    });
  });

  describe('Edge Cases - PRD Section 16.7', () => {
    it('should handle category with exactly 14 words (minimum for single)', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 14,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 2 })),
        max_players_single: 1,
        max_players_multi: 1,
        max_teams: 1,
        message: 'Valid',
      };
      expect(canSupportSetup(validation, 'single', 1)).toBe(true);
      expect(canSupportSetup(validation, 'multi', 2)).toBe(false);
    });

    it('should handle category with 13 words (unplayable)', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 13,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      expect(canSupportSetup(validation, 'single', 1)).toBe(false);
    });

    it('should handle category with 100 words (calculate max participants)', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 100,
        words_by_length: Array(7)
          .fill(0)
          .map((_, i) => ({ letter_count: i + 4, count: 14 })),
        max_players_single: 1,
        max_players_multi: 6,
        max_teams: 4,
        message: 'Valid',
      };
      // 14 words per length / 2 = 7, but max is 6 for multi
      expect(getMaxParticipantsForMode(validation, 'multi')).toBe(6);
      // max is 4 for team
      expect(getMaxParticipantsForMode(validation, 'team')).toBe(4);
    });

    it('should handle unbalanced word distribution (5-letter: 3, 6-letter: 1)', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 14,
        words_by_length: [
          { letter_count: 4, count: 2 },
          { letter_count: 5, count: 3 },
          { letter_count: 6, count: 1 }, // Insufficient
          { letter_count: 7, count: 2 },
          { letter_count: 8, count: 2 },
          { letter_count: 9, count: 2 },
          { letter_count: 10, count: 2 },
        ],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      const insufficient = getInsufficientLengths(validation, 2);
      expect(insufficient).toContain(6);
      expect(canSupportSetup(validation, 'single', 1)).toBe(false);
    });
  });
});
