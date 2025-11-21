// Game-related types based on PRD Section 4

/**
 * Game modes
 * PRD Reference: Section 4.3 - Mode Selection
 */
export type GameMode = 'single' | 'multi' | 'team';

/**
 * Participant type in game
 */
export type ParticipantType = 'player' | 'team';

/**
 * Game state phases
 */
export type GameState =
  | 'setup' // Selecting category, mode, participants
  | 'playing' // Active game
  | 'paused' // Game paused
  | 'waiting_next_turn' // Waiting for host to start next participant's turn
  | 'finished'; // Game completed

/**
 * Word reveal status
 */
export type LetterStatus = 'hidden' | 'revealed';

/**
 * Word result type
 */
export type WordResult = 'found' | 'skipped' | 'timeout';

/**
 * Single player setup
 * PRD Reference: Section 4.4 - Single Player Mode
 */
export interface SinglePlayerSetup {
  playerName: string;
}

/**
 * Multi-player setup
 * PRD Reference: Section 4.4 - Multi Player Mode (2-6 players)
 */
export interface MultiPlayerSetup {
  players: string[]; // 2-6 player names
}

/**
 * Team member
 */
export interface TeamMember {
  name: string;
  order: number; // Playing order within team
}

/**
 * Team definition
 * PRD Reference: Section 4.4 - Team Mode
 */
export interface Team {
  name: string;
  emoji: string; // Team identifier
  color: string; // Team color (for UI)
  members: TeamMember[]; // 2-4 members per team
}

/**
 * Team mode setup
 * PRD Reference: Section 4.4 - Team Mode (2-4 teams)
 */
export interface TeamModeSetup {
  teams: Team[]; // 2-4 teams
}

/**
 * Letter in a word
 */
export interface Letter {
  char: string;
  status: LetterStatus;
  index: number;
}

/**
 * Word being played
 * PRD Reference: Section 4.6 - Word Selection Algorithm
 */
export interface GameWord {
  id: number;
  word: string;
  hint: string;
  letterCount: number;
  letters: Letter[];
  remainingGuesses: number; // Max 3 per word
  lettersRevealed: number;
  hasMadeGuess: boolean; // IMPORTANT: Cannot reveal letters after guess (PRD rule)
  result: WordResult | null;
  pointsEarned: number;
}

/**
 * Active participant/team in game
 */
export interface ActiveParticipant {
  name: string;
  type: ParticipantType;
  score: number;
  wordsFound: number;
  wordsSkipped: number;
  lettersRevealed: number;
  currentWordIndex: number;
  words: GameWord[]; // 14 words per participant/team
  isActive: boolean; // Currently playing
  // Multi/Team mode: Each participant gets their OWN 5-minute timer
  elapsedTimeSeconds: number; // Participant's individual time
  totalTimeSeconds: number; // Always 300 (5 minutes per participant)
}

/**
 * Complete game session state
 * PRD Reference: Section 4.5 & 4.6
 */
export interface GameSession {
  // Game metadata
  id: string; // Session UUID
  categoryId: number;
  categoryName: string;
  categoryEmoji: string;
  mode: GameMode;
  state: GameState;

  // Participants
  participants: ActiveParticipant[];
  activeParticipantIndex: number;

  // Timing - PRD: 5 minutes (300 seconds) total for all 14 words
  totalTimeSeconds: number; // 300
  elapsedTimeSeconds: number;
  isPaused: boolean;
  isInTransition: boolean; // Pause timer during word transitions (confetti, reveal)

  // Timestamps
  startedAt: string | null;
  finishedAt: string | null;
}

/**
 * Game configuration before starting
 */
export interface GameConfig {
  categoryId: number;
  mode: GameMode;
  setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup;
}

/**
 * Final game results for one participant/team
 */
export interface ParticipantResult {
  name: string;
  type: ParticipantType;
  score: number;
  wordsFound: number;
  wordsSkipped: number;
  lettersRevealed: number;
  rank: number;
  timeSeconds: number;
}

/**
 * Complete game results
 */
export interface GameResults {
  gameId: string;
  categoryName: string;
  mode: GameMode;
  participants: ParticipantResult[];
  totalTimeSeconds: number;
  playedAt: string;
}
