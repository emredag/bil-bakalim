/**
 * Participant Validation Utilities
 * PRD Reference: Section 4.4 - Participant/Team Configuration
 * Task 11: Participant/Team Setup
 *
 * Validates participant and team setups based on game mode requirements:
 * - Single: 1 player, minimum 14 words (1 × 14)
 * - Multi: 2-6 players, minimum 28-84 words (players × 14)
 * - Team: 2-4 teams, 2-4 players per team, minimum 28-56 words (teams × 14)
 */

import type { SinglePlayerSetup, MultiPlayerSetup, TeamModeSetup, Team } from '../types';

/**
 * Word count requirements per mode
 * PRD: Each participant/team gets 14 words
 */
export const WORDS_PER_PARTICIPANT = 14;

/**
 * Player count constraints
 */
export const CONSTRAINTS = {
  MULTI: {
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 6,
  },
  TEAM: {
    MIN_TEAMS: 2,
    MAX_TEAMS: 4,
    MIN_PLAYERS_PER_TEAM: 2,
    MAX_PLAYERS_PER_TEAM: 4,
  },
} as const;

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  requiredWords: number;
  availableWords: number;
}

/**
 * Validate a single player name (non-empty, trimmed)
 */
export function validatePlayerName(name?: string | null): boolean {
  return Boolean(name && typeof name === 'string' && name.trim().length > 0);
}

/**
 * Validate single player mode setup
 */
export function validateSinglePlayerSetup(
  setup: SinglePlayerSetup | null | undefined,
  availableWords: number
): ValidationResult {
  const errors: string[] = [];
  const requiredWords = WORDS_PER_PARTICIPANT;

  // Check if setup exists
  if (!setup) {
    return {
      isValid: false,
      errors: ['Geçersiz oyuncu yapılandırması'],
      requiredWords,
      availableWords,
    };
  }

  // Check player name
  if (!validatePlayerName(setup.playerName)) {
    errors.push('Oyuncu adı boş olamaz');
  }

  // Check word count
  if (availableWords < requiredWords) {
    errors.push(`Bu mod için en az ${requiredWords} kelime gereklidir (mevcut: ${availableWords})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    requiredWords,
    availableWords,
  };
}

/**
 * Validate multiplayer mode setup
 */
export function validateMultiPlayerSetup(
  setup: MultiPlayerSetup | null | undefined,
  availableWords: number
): ValidationResult {
  const errors: string[] = [];

  // Check if setup and players array exist
  if (!setup || !setup.players || !Array.isArray(setup.players)) {
    return {
      isValid: false,
      errors: ['Geçersiz oyuncu yapılandırması'],
      requiredWords: CONSTRAINTS.MULTI.MIN_PLAYERS * WORDS_PER_PARTICIPANT,
      availableWords,
    };
  }

  const playerCount = setup.players.length;
  const requiredWords = playerCount * WORDS_PER_PARTICIPANT;

  // Check player count
  if (playerCount < CONSTRAINTS.MULTI.MIN_PLAYERS) {
    errors.push(`En az ${CONSTRAINTS.MULTI.MIN_PLAYERS} oyuncu gereklidir`);
  }

  if (playerCount > CONSTRAINTS.MULTI.MAX_PLAYERS) {
    errors.push(`En fazla ${CONSTRAINTS.MULTI.MAX_PLAYERS} oyuncu olabilir`);
  }

  // Check player names - filter out undefined/null values first
  const validPlayers = setup.players.filter((name): name is string => 
    name !== null && name !== undefined
  );
  
  const emptyNames = validPlayers.filter((name) => !validatePlayerName(name));
  if (emptyNames.length > 0 || validPlayers.length !== setup.players.length) {
    errors.push('Tüm oyuncu adları doldurulmalıdır');
  }

  // Check duplicate names
  if (validPlayers.length > 0) {
    const uniqueNames = new Set(validPlayers.map((name) => name.trim().toLowerCase()));
    if (uniqueNames.size !== validPlayers.length) {
      errors.push('Oyuncu adları benzersiz olmalıdır');
    }
  }

  // Check word count
  if (availableWords < requiredWords) {
    errors.push(`Bu mod için en az ${requiredWords} kelime gereklidir (mevcut: ${availableWords})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    requiredWords,
    availableWords,
  };
}

/**
 * Validate a single team
 */
export function validateTeam(team: Team, teamIndex: number): string[] {
  const errors: string[] = [];
  const teamLabel = `Takım ${teamIndex + 1}`;

  // Check team name
  if (!validatePlayerName(team.name)) {
    errors.push(`${teamLabel}: Takım adı boş olamaz`);
  }

  // Check team emoji
  if (!team.emoji || team.emoji.trim().length === 0) {
    errors.push(`${teamLabel}: Takım emoji seçilmelidir`);
  }

  // Check team color
  if (!team.color || team.color.trim().length === 0) {
    errors.push(`${teamLabel}: Takım rengi seçilmelidir`);
  }

  // Check member count
  const memberCount = team.members.length;
  if (memberCount < CONSTRAINTS.TEAM.MIN_PLAYERS_PER_TEAM) {
    errors.push(`${teamLabel}: En az ${CONSTRAINTS.TEAM.MIN_PLAYERS_PER_TEAM} oyuncu gereklidir`);
  }

  if (memberCount > CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM) {
    errors.push(`${teamLabel}: En fazla ${CONSTRAINTS.TEAM.MAX_PLAYERS_PER_TEAM} oyuncu olabilir`);
  }

  // Check member names - filter valid members first
  const validMembers = team.members.filter((member) => 
    member && member.name !== null && member.name !== undefined
  );
  
  const emptyMemberNames = validMembers.filter((member) => !validatePlayerName(member.name));
  if (emptyMemberNames.length > 0 || validMembers.length !== team.members.length) {
    errors.push(`${teamLabel}: Tüm oyuncu adları doldurulmalıdır`);
  }

  // Check duplicate member names within team
  if (validMembers.length > 0) {
    const uniqueMemberNames = new Set(
      validMembers.map((member) => member.name.trim().toLowerCase())
    );
    if (uniqueMemberNames.size !== validMembers.length) {
      errors.push(`${teamLabel}: Oyuncu adları benzersiz olmalıdır`);
    }
  }

  return errors;
}

/**
 * Validate team mode setup
 */
export function validateTeamModeSetup(
  setup: TeamModeSetup | null | undefined,
  availableWords: number
): ValidationResult {
  const errors: string[] = [];

  // Check if setup and teams array exist
  if (!setup || !setup.teams || !Array.isArray(setup.teams)) {
    return {
      isValid: false,
      errors: ['Geçersiz takım yapılandırması'],
      requiredWords: CONSTRAINTS.TEAM.MIN_TEAMS * WORDS_PER_PARTICIPANT,
      availableWords,
    };
  }

  const teamCount = setup.teams.length;
  const requiredWords = teamCount * WORDS_PER_PARTICIPANT;

  // Check team count
  if (teamCount < CONSTRAINTS.TEAM.MIN_TEAMS) {
    errors.push(`En az ${CONSTRAINTS.TEAM.MIN_TEAMS} takım gereklidir`);
  }

  if (teamCount > CONSTRAINTS.TEAM.MAX_TEAMS) {
    errors.push(`En fazla ${CONSTRAINTS.TEAM.MAX_TEAMS} takım olabilir`);
  }

  // Validate each team
  setup.teams.forEach((team, index) => {
    const teamErrors = validateTeam(team, index);
    errors.push(...teamErrors);
  });

  // Check duplicate team names
  const uniqueTeamNames = new Set(setup.teams.map((team) => team.name.trim().toLowerCase()));
  if (uniqueTeamNames.size !== setup.teams.length) {
    errors.push('Takım adları benzersiz olmalıdır');
  }

  // Check word count
  if (availableWords < requiredWords) {
    errors.push(`Bu mod için en az ${requiredWords} kelime gereklidir (mevcut: ${availableWords})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    requiredWords,
    availableWords,
  };
}

/**
 * Calculate required word count based on mode and current setup
 */
export function calculateRequiredWords(
  mode: 'single' | 'multi' | 'team',
  setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null
): number {
  if (!setup) return 0;

  switch (mode) {
    case 'single':
      return WORDS_PER_PARTICIPANT;

    case 'multi':
      return (setup as MultiPlayerSetup).players.length * WORDS_PER_PARTICIPANT;

    case 'team':
      return (setup as TeamModeSetup).teams.length * WORDS_PER_PARTICIPANT;

    default:
      return 0;
  }
}

/**
 * Check if setup is sufficient to start game (quick check, no detailed errors)
 */
export function canStartGame(
  mode: 'single' | 'multi' | 'team',
  setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null,
  availableWords: number
): boolean {
  if (!setup) return false;

  let validation: ValidationResult;

  switch (mode) {
    case 'single':
      validation = validateSinglePlayerSetup(setup as SinglePlayerSetup, availableWords);
      break;

    case 'multi':
      validation = validateMultiPlayerSetup(setup as MultiPlayerSetup, availableWords);
      break;

    case 'team':
      validation = validateTeamModeSetup(setup as TeamModeSetup, availableWords);
      break;

    default:
      return false;
  }

  return validation.isValid;
}
