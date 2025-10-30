import { describe, it, expect } from 'vitest';
import {
  calculateRequiredWords,
  validateMode,
  validateAllModes,
  getMaxParticipants,
  isCategoryPlayable,
  getPlayableModes,
} from './modeValidation';
import type { ValidationResult } from '../types';

describe('modeValidation', () => {
  describe('calculateRequiredWords', () => {
    it('should return 14 for single player mode', () => {
      expect(calculateRequiredWords('single', 1)).toBe(14);
    });

    it('should return 28 for 2 players in multiplayer', () => {
      expect(calculateRequiredWords('multi', 2)).toBe(28);
    });

    it('should return 42 for 3 players in multiplayer', () => {
      expect(calculateRequiredWords('multi', 3)).toBe(42);
    });

    it('should return 56 for 4 players in multiplayer', () => {
      expect(calculateRequiredWords('multi', 4)).toBe(56);
    });

    it('should return 84 for 6 players (max)', () => {
      expect(calculateRequiredWords('multi', 6)).toBe(84);
    });

    it('should return 28 for 2 teams', () => {
      expect(calculateRequiredWords('team', 2)).toBe(28);
    });

    it('should return 56 for 4 teams (max)', () => {
      expect(calculateRequiredWords('team', 4)).toBe(56);
    });
  });

  describe('validateMode', () => {
    it('should enable single mode with 14 words', () => {
      const result = validateMode('single', 14);
      expect(result.enabled).toBe(true);
      expect(result.requiredWords).toBe(14);
      expect(result.participantCount).toBe(1);
    });

    it('should disable single mode with 13 words', () => {
      const result = validateMode('single', 13);
      expect(result.enabled).toBe(false);
      expect(result.requiredWords).toBe(14);
    });

    it('should enable multi mode with 28 words for 2 players', () => {
      const result = validateMode('multi', 28, 2);
      expect(result.enabled).toBe(true);
      expect(result.requiredWords).toBe(28);
      expect(result.participantCount).toBe(2);
    });

    it('should disable multi mode with 27 words for 2 players', () => {
      const result = validateMode('multi', 27, 2);
      expect(result.enabled).toBe(false);
    });

    it('should use default 2 participants for multi mode if not specified', () => {
      const result = validateMode('multi', 28);
      expect(result.enabled).toBe(true);
      expect(result.participantCount).toBe(2);
    });

    it('should enable team mode with 56 words for 4 teams', () => {
      const result = validateMode('team', 56, 4);
      expect(result.enabled).toBe(true);
      expect(result.requiredWords).toBe(56);
      expect(result.participantCount).toBe(4);
    });

    it('should disable team mode with 55 words for 4 teams', () => {
      const result = validateMode('team', 55, 4);
      expect(result.enabled).toBe(false);
    });

    it('should use default 2 teams for team mode if not specified', () => {
      const result = validateMode('team', 28);
      expect(result.enabled).toBe(true);
      expect(result.participantCount).toBe(2);
    });
  });

  describe('validateAllModes', () => {
    it('should enable all modes with 56 words', () => {
      const results = validateAllModes(56);
      expect(results).toHaveLength(3);

      const single = results.find((r) => r.mode === 'single');
      const multi = results.find((r) => r.mode === 'multi');
      const team = results.find((r) => r.mode === 'team');

      expect(single?.enabled).toBe(true);
      expect(multi?.enabled).toBe(true);
      expect(team?.enabled).toBe(true);
    });

    it('should only enable single mode with 14 words', () => {
      const results = validateAllModes(14);
      const single = results.find((r) => r.mode === 'single');
      const multi = results.find((r) => r.mode === 'multi');
      const team = results.find((r) => r.mode === 'team');

      expect(single?.enabled).toBe(true);
      expect(multi?.enabled).toBe(false); // Needs 28 for 2 players
      expect(team?.enabled).toBe(false); // Needs 28 for 2 teams
    });

    it('should enable single and multi modes with 28 words', () => {
      const results = validateAllModes(28);
      const single = results.find((r) => r.mode === 'single');
      const multi = results.find((r) => r.mode === 'multi');
      const team = results.find((r) => r.mode === 'team');

      expect(single?.enabled).toBe(true);
      expect(multi?.enabled).toBe(true); // Exactly 28 for 2 players
      expect(team?.enabled).toBe(true); // Exactly 28 for 2 teams
    });

    it('should disable all modes with 13 words', () => {
      const results = validateAllModes(13);
      const single = results.find((r) => r.mode === 'single');
      const multi = results.find((r) => r.mode === 'multi');
      const team = results.find((r) => r.mode === 'team');

      expect(single?.enabled).toBe(false);
      expect(multi?.enabled).toBe(false);
      expect(team?.enabled).toBe(false);
    });
  });

  describe('getMaxParticipants', () => {
    it('should always return 1 for single mode', () => {
      expect(getMaxParticipants('single', 14)).toBe(1);
      expect(getMaxParticipants('single', 100)).toBe(1);
      expect(getMaxParticipants('single', 200)).toBe(1);
    });

    it('should return 2 for multi mode with 28 words', () => {
      expect(getMaxParticipants('multi', 28)).toBe(2);
    });

    it('should return 3 for multi mode with 42 words', () => {
      expect(getMaxParticipants('multi', 42)).toBe(3);
    });

    it('should return max 6 for multi mode with 100+ words', () => {
      expect(getMaxParticipants('multi', 100)).toBe(6); // Max is 6
      expect(getMaxParticipants('multi', 200)).toBe(6); // Still capped at 6
    });

    it('should return 1 for multi mode with 20 words (insufficient)', () => {
      expect(getMaxParticipants('multi', 20)).toBe(1);
    });

    it('should return 2 for team mode with 28 words', () => {
      expect(getMaxParticipants('team', 28)).toBe(2);
    });

    it('should return 3 for team mode with 42 words', () => {
      expect(getMaxParticipants('team', 42)).toBe(3);
    });

    it('should return max 4 for team mode with 100+ words', () => {
      expect(getMaxParticipants('team', 100)).toBe(4); // Max is 4
      expect(getMaxParticipants('team', 200)).toBe(4); // Still capped at 4
    });

    it('should return 1 for team mode with 20 words (insufficient)', () => {
      expect(getMaxParticipants('team', 20)).toBe(1);
    });
  });

  describe('isCategoryPlayable', () => {
    it('should return true for valid category with 14+ words', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 14,
        words_by_length: [],
        max_players_single: 1,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Valid',
      };
      expect(isCategoryPlayable(validation)).toBe(true);
    });

    it('should return false for invalid category', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 14,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      expect(isCategoryPlayable(validation)).toBe(false);
    });

    it('should return false for category with less than 14 words', () => {
      const validation: ValidationResult = {
        is_valid: false,
        total_words: 13,
        words_by_length: [],
        max_players_single: 0,
        max_players_multi: 0,
        max_teams: 0,
        message: 'Invalid',
      };
      expect(isCategoryPlayable(validation)).toBe(false);
    });

    it('should return true for category with 100 words', () => {
      const validation: ValidationResult = {
        is_valid: true,
        total_words: 100,
        words_by_length: [],
        max_players_single: 1,
        max_players_multi: 6,
        max_teams: 4,
        message: 'Valid',
      };
      expect(isCategoryPlayable(validation)).toBe(true);
    });
  });

  describe('getPlayableModes', () => {
    it('should return all modes for 56+ words', () => {
      const modes = getPlayableModes(56);
      expect(modes).toContain('single');
      expect(modes).toContain('multi');
      expect(modes).toContain('team');
      expect(modes).toHaveLength(3);
    });

    it('should return only single mode for 14 words', () => {
      const modes = getPlayableModes(14);
      expect(modes).toContain('single');
      expect(modes).not.toContain('multi');
      expect(modes).not.toContain('team');
      expect(modes).toHaveLength(1);
    });

    it('should return single and multi modes for 28 words', () => {
      const modes = getPlayableModes(28);
      expect(modes).toContain('single');
      expect(modes).toContain('multi');
      expect(modes).toContain('team');
      expect(modes).toHaveLength(3);
    });

    it('should return empty array for 13 words', () => {
      const modes = getPlayableModes(13);
      expect(modes).toHaveLength(0);
    });

    it('should return all modes for 100 words', () => {
      const modes = getPlayableModes(100);
      expect(modes).toContain('single');
      expect(modes).toContain('multi');
      expect(modes).toContain('team');
    });
  });

  describe('Edge Cases - PRD Section 16.7', () => {
    it('should handle exactly 14 words (minimum playable)', () => {
      const modes = getPlayableModes(14);
      expect(modes).toContain('single');
      expect(modes).not.toContain('multi');
    });

    it('should handle 13 words (unplayable)', () => {
      const modes = getPlayableModes(13);
      expect(modes).toHaveLength(0);
      expect(validateMode('single', 13).enabled).toBe(false);
    });

    it('should handle 20 words (single only, not enough for 2 players)', () => {
      const modes = getPlayableModes(20);
      expect(modes).toContain('single');
      expect(modes).not.toContain('multi');
      expect(modes).not.toContain('team');
    });

    it('should handle 50 words (max 3 players)', () => {
      // 50 / 14 = 3.57, so max 3 players
      expect(getMaxParticipants('multi', 50)).toBe(3);
      expect(getMaxParticipants('team', 50)).toBe(3);
    });

    it('should handle 84 words (exactly 6 players)', () => {
      expect(getMaxParticipants('multi', 84)).toBe(6);
      expect(validateMode('multi', 84, 6).enabled).toBe(true);
    });

    it('should handle 85 words (still max 6 players)', () => {
      // 85 / 14 = 6.07, but max is 6
      expect(getMaxParticipants('multi', 85)).toBe(6);
    });

    it('should handle 56 words (exactly 4 teams)', () => {
      expect(getMaxParticipants('team', 56)).toBe(4);
      expect(validateMode('team', 56, 4).enabled).toBe(true);
    });

    it('should handle 57 words (still max 4 teams)', () => {
      // 57 / 14 = 4.07, but max is 4
      expect(getMaxParticipants('team', 57)).toBe(4);
    });
  });
});
