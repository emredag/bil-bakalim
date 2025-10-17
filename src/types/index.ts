// Type definitions based on PRD Section 2.4 and Tauri models

// Database types
export type {
  Category,
  Word,
  ValidationResult,
  WordCountByLength,
  GameHistory,
  GameParticipant,
  GameWordResult,
} from './database.js';

// Game types
export type {
  GameMode,
  GameState,
  ParticipantType,
  LetterStatus,
  WordResult,
  SinglePlayerSetup,
  MultiPlayerSetup,
  TeamModeSetup,
  Team,
  TeamMember,
  Letter,
  GameWord,
  ActiveParticipant,
  GameSession,
  GameConfig,
  ParticipantResult,
  GameResults,
} from './game.js';

// Settings types
export type {
  Settings,
  ParsedSettings,
} from './settings.js';

export { DEFAULT_SETTINGS } from './settings.js';
