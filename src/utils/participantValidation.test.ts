import { describe, it, expect } from 'vitest';
import {
  validatePlayerName,
  validateSinglePlayerSetup,
  validateMultiPlayerSetup,
  validateTeam,
  validateTeamModeSetup,
  calculateRequiredWords,
  canStartGame,
  WORDS_PER_PARTICIPANT,
  CONSTRAINTS,
} from './participantValidation';
import type { SinglePlayerSetup, MultiPlayerSetup, TeamModeSetup, Team } from '../types';

describe('participantValidation', () => {
  describe('validatePlayerName', () => {
    it('should return true for valid name', () => {
      expect(validatePlayerName('John')).toBe(true);
      expect(validatePlayerName('Alice')).toBe(true);
      expect(validatePlayerName('Player 1')).toBe(true);
    });

    it('should return false for empty or whitespace name', () => {
      expect(validatePlayerName('')).toBe(false);
      expect(validatePlayerName('   ')).toBe(false);
      expect(validatePlayerName('  \t  ')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validatePlayerName(null)).toBe(false);
      expect(validatePlayerName(undefined)).toBe(false);
    });
  });

  describe('validateSinglePlayerSetup', () => {
    it('should validate correct single player setup', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      const result = validateSinglePlayerSetup(setup, 14);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.requiredWords).toBe(14);
    });

    it('should fail for null setup', () => {
      const result = validateSinglePlayerSetup(null, 14);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Geçersiz oyuncu yapılandırması');
    });

    it('should fail for empty player name', () => {
      const setup: SinglePlayerSetup = {
        playerName: '',
      };
      const result = validateSinglePlayerSetup(setup, 14);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Oyuncu adı boş olamaz');
    });

    it('should fail for insufficient words', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      const result = validateSinglePlayerSetup(setup, 13);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('14 kelime gereklidir'))).toBe(true);
    });

    it('should succeed with exactly 14 words', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      const result = validateSinglePlayerSetup(setup, 14);
      expect(result.isValid).toBe(true);
    });

    it('should succeed with more than 14 words', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      const result = validateSinglePlayerSetup(setup, 50);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMultiPlayerSetup', () => {
    it('should validate correct 2-player setup', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', 'Bob'],
      };
      const result = validateMultiPlayerSetup(setup, 28);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.requiredWords).toBe(28);
    });

    it('should fail for null setup', () => {
      const result = validateMultiPlayerSetup(null, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Geçersiz oyuncu yapılandırması');
    });

    it('should fail for less than 2 players', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice'],
      };
      const result = validateMultiPlayerSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En az 2 oyuncu gereklidir');
    });

    it('should fail for more than 6 players', () => {
      const setup: MultiPlayerSetup = {
        players: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
      };
      const result = validateMultiPlayerSetup(setup, 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En fazla 6 oyuncu olabilir');
    });

    it('should fail for empty player names', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', ''],
      };
      const result = validateMultiPlayerSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tüm oyuncu adları doldurulmalıdır');
    });

    it('should fail for duplicate names', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', 'alice'], // Case-insensitive duplicate
      };
      const result = validateMultiPlayerSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Oyuncu adları benzersiz olmalıdır');
    });

    it('should fail for insufficient words', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', 'Bob', 'Charlie'],
      };
      const result = validateMultiPlayerSetup(setup, 41); // Need 42 for 3 players
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('42 kelime gereklidir'))).toBe(true);
    });

    it('should validate 6 players with sufficient words', () => {
      const setup: MultiPlayerSetup = {
        players: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
      };
      const result = validateMultiPlayerSetup(setup, 84);
      expect(result.isValid).toBe(true);
      expect(result.requiredWords).toBe(84);
    });

    it('should handle null/undefined players in array', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', null as unknown as string, 'Bob'],
      };
      const result = validateMultiPlayerSetup(setup, 42);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tüm oyuncu adları doldurulmalıdır');
    });
  });

  describe('validateTeam', () => {
    it('should validate correct team', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: 'red',
        members: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors).toHaveLength(0);
    });

    it('should fail for empty team name', () => {
      const team: Team = {
        name: '',
        emoji: '🔥',
        color: 'red',
        members: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('Takım adı boş olamaz'))).toBe(true);
    });

    it('should fail for missing emoji', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '',
        color: 'red',
        members: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('Takım emoji seçilmelidir'))).toBe(true);
    });

    it('should fail for missing color', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: '',
        members: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('Takım rengi seçilmelidir'))).toBe(true);
    });

    it('should fail for less than 2 members', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: 'red',
        members: [{ name: 'Alice' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('En az 2 oyuncu gereklidir'))).toBe(true);
    });

    it('should fail for more than 4 members', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: 'red',
        members: [
          { name: 'P1' },
          { name: 'P2' },
          { name: 'P3' },
          { name: 'P4' },
          { name: 'P5' },
        ],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('En fazla 4 oyuncu olabilir'))).toBe(true);
    });

    it('should fail for empty member names', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: 'red',
        members: [{ name: 'Alice' }, { name: '' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('Tüm oyuncu adları doldurulmalıdır'))).toBe(true);
    });

    it('should fail for duplicate member names', () => {
      const team: Team = {
        name: 'Team A',
        emoji: '🔥',
        color: 'red',
        members: [{ name: 'Alice' }, { name: 'alice' }],
      };
      const errors = validateTeam(team, 0);
      expect(errors.some((e) => e.includes('Oyuncu adları benzersiz olmalıdır'))).toBe(true);
    });
  });

  describe('validateTeamModeSetup', () => {
    it('should validate correct 2-team setup', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }, { name: 'Bob' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'Charlie' }, { name: 'David' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 28);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.requiredWords).toBe(28);
    });

    it('should fail for null setup', () => {
      const result = validateTeamModeSetup(null, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Geçersiz takım yapılandırması');
    });

    it('should fail for less than 2 teams', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }, { name: 'Bob' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En az 2 takım gereklidir');
    });

    it('should fail for more than 4 teams', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'A1' }, { name: 'A2' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'B1' }, { name: 'B2' }],
          },
          {
            name: 'Team C',
            emoji: '💎',
            color: 'green',
            members: [{ name: 'C1' }, { name: 'C2' }],
          },
          {
            name: 'Team D',
            emoji: '🌟',
            color: 'yellow',
            members: [{ name: 'D1' }, { name: 'D2' }],
          },
          {
            name: 'Team E',
            emoji: '🎯',
            color: 'purple',
            members: [{ name: 'E1' }, { name: 'E2' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En fazla 4 takım olabilir');
    });

    it('should fail for duplicate team names', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }, { name: 'Bob' }],
          },
          {
            name: 'team a', // Case-insensitive duplicate
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'Charlie' }, { name: 'David' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Takım adları benzersiz olmalıdır');
    });

    it('should fail for insufficient words', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }, { name: 'Bob' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'Charlie' }, { name: 'David' }],
          },
          {
            name: 'Team C',
            emoji: '💎',
            color: 'green',
            members: [{ name: 'Eve' }, { name: 'Frank' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 41); // Need 42 for 3 teams
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('42 kelime gereklidir'))).toBe(true);
    });

    it('should accumulate errors from multiple teams', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: '',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }], // Not enough members
          },
          {
            name: 'Team B',
            emoji: '',
            color: 'blue',
            members: [{ name: 'Charlie' }, { name: 'David' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 28);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('calculateRequiredWords', () => {
    it('should return 14 for single player', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      expect(calculateRequiredWords('single', setup)).toBe(14);
    });

    it('should return 28 for 2 players in multi mode', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', 'Bob'],
      };
      expect(calculateRequiredWords('multi', setup)).toBe(28);
    });

    it('should return 56 for 4 teams', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'A1' }, { name: 'A2' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'B1' }, { name: 'B2' }],
          },
          {
            name: 'Team C',
            emoji: '💎',
            color: 'green',
            members: [{ name: 'C1' }, { name: 'C2' }],
          },
          {
            name: 'Team D',
            emoji: '🌟',
            color: 'yellow',
            members: [{ name: 'D1' }, { name: 'D2' }],
          },
        ],
      };
      expect(calculateRequiredWords('team', setup)).toBe(56);
    });

    it('should return 0 for null setup', () => {
      expect(calculateRequiredWords('single', null)).toBe(0);
      expect(calculateRequiredWords('multi', null)).toBe(0);
      expect(calculateRequiredWords('team', null)).toBe(0);
    });
  });

  describe('canStartGame', () => {
    it('should return true for valid single player setup', () => {
      const setup: SinglePlayerSetup = {
        playerName: 'John',
      };
      expect(canStartGame('single', setup, 14)).toBe(true);
    });

    it('should return false for invalid single player setup', () => {
      const setup: SinglePlayerSetup = {
        playerName: '',
      };
      expect(canStartGame('single', setup, 14)).toBe(false);
    });

    it('should return true for valid multi player setup', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice', 'Bob'],
      };
      expect(canStartGame('multi', setup, 28)).toBe(true);
    });

    it('should return false for invalid multi player setup', () => {
      const setup: MultiPlayerSetup = {
        players: ['Alice'],
      };
      expect(canStartGame('multi', setup, 28)).toBe(false);
    });

    it('should return true for valid team mode setup', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }, { name: 'Bob' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'Charlie' }, { name: 'David' }],
          },
        ],
      };
      expect(canStartGame('team', setup, 28)).toBe(true);
    });

    it('should return false for invalid team mode setup', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'Alice' }], // Not enough members
          },
        ],
      };
      expect(canStartGame('team', setup, 28)).toBe(false);
    });

    it('should return false for null setup', () => {
      expect(canStartGame('single', null, 14)).toBe(false);
      expect(canStartGame('multi', null, 28)).toBe(false);
      expect(canStartGame('team', null, 28)).toBe(false);
    });
  });

  describe('Constants - PRD Requirements', () => {
    it('should have correct words per participant', () => {
      expect(WORDS_PER_PARTICIPANT).toBe(14);
    });

    it('should have correct multi mode constraints', () => {
      expect(CONSTRAINTS.MULTI.MIN_PLAYERS).toBe(2);
      expect(CONSTRAINTS.MULTI.MAX_PLAYERS).toBe(6);
    });

    it('should have correct team mode constraints', () => {
      expect(CONSTRAINTS.TEAM.MIN_TEAMS).toBe(2);
      expect(CONSTRAINTS.TEAM.MAX_TEAMS).toBe(4);
      expect(CONSTRAINTS.TEAM.MIN_PLAYERS_PER_TEAM).toBe(2);
      expect(CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM).toBe(4);
    });
  });

  describe('Edge Cases - PRD Section 16.7', () => {
    it('should handle participant with whitespace in name', () => {
      const setup: SinglePlayerSetup = {
        playerName: '  John  ',
      };
      const result = validateSinglePlayerSetup(setup, 14);
      // Should be valid because trimmed length > 0
      expect(result.isValid).toBe(true);
    });

    it('should handle case-insensitive duplicate detection', () => {
      const setup: MultiPlayerSetup = {
        players: ['ALICE', 'alice', 'Alice'],
      };
      const result = validateMultiPlayerSetup(setup, 42);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Oyuncu adları benzersiz olmalıdır');
    });

    it('should handle maximum 6 players exactly', () => {
      const setup: MultiPlayerSetup = {
        players: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
      };
      const result = validateMultiPlayerSetup(setup, 84);
      expect(result.isValid).toBe(true);
    });

    it('should handle maximum 4 teams exactly', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'T1',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'A' }, { name: 'B' }],
          },
          {
            name: 'T2',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'C' }, { name: 'D' }],
          },
          {
            name: 'T3',
            emoji: '💎',
            color: 'green',
            members: [{ name: 'E' }, { name: 'F' }],
          },
          {
            name: 'T4',
            emoji: '🌟',
            color: 'yellow',
            members: [{ name: 'G' }, { name: 'H' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 56);
      expect(result.isValid).toBe(true);
    });

    it('should handle team with maximum 4 players per team', () => {
      const setup: TeamModeSetup = {
        teams: [
          {
            name: 'Team A',
            emoji: '🔥',
            color: 'red',
            members: [{ name: 'P1' }, { name: 'P2' }, { name: 'P3' }, { name: 'P4' }],
          },
          {
            name: 'Team B',
            emoji: '⚡',
            color: 'blue',
            members: [{ name: 'P5' }, { name: 'P6' }, { name: 'P7' }, { name: 'P8' }],
          },
        ],
      };
      const result = validateTeamModeSetup(setup, 28);
      expect(result.isValid).toBe(true);
    });
  });
});
