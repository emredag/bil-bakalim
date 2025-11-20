/**
 * Game Store - Global game state management using Zustand
 * PRD Reference: Section 2.1 - State Management
 *
 * Manages active game session state including:
 * - Current game configuration and mode
 * - Participants and their progress
 * - Timer and scoring
 * - Word selection and reveal state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  GameSession,
  GameConfig,
  GameWord,
  ActiveParticipant,
  GameState,
  Letter,
  WordResult,
} from '../types/game';

interface GameStore {
  // Current game session (null when not playing)
  session: GameSession | null;

  // Actions
  startGame: (config: GameConfig, words: GameWord[][]) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Timer actions
  tick: () => void; // Called every second

  // Word actions
  revealLetter: (participantIndex: number, wordIndex: number, letterIndex: number) => void;
  submitGuess: (participantIndex: number, wordIndex: number, isCorrect: boolean) => void;
  skipWord: (participantIndex: number, wordIndex: number) => void;

  // Participant actions
  nextParticipant: () => void;
  updateScore: (participantIndex: number, points: number) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      session: null,

      startGame: (config: GameConfig, words: GameWord[][]) => {
        const participants: ActiveParticipant[] = [];

        // Create participants based on mode
        if (config.mode === 'single') {
          const setup = config.setup as any;
          participants.push({
            name: setup.playerName,
            type: 'player',
            score: 0,
            wordsFound: 0,
            wordsSkipped: 0,
            lettersRevealed: 0,
            currentWordIndex: 0,
            words: words[0],
            isActive: true,
            elapsedTimeSeconds: 0,
            totalTimeSeconds: 300,
          });
        } else if (config.mode === 'multi') {
          const setup = config.setup as any;
          setup.players.forEach((playerName: string, index: number) => {
            participants.push({
              name: playerName,
              type: 'player',
              score: 0,
              wordsFound: 0,
              wordsSkipped: 0,
              lettersRevealed: 0,
              currentWordIndex: 0,
              words: words[index],
              isActive: index === 0, // First player/team starts
              elapsedTimeSeconds: 0, // Each participant starts with 0
              totalTimeSeconds: 300, // Each participant gets 5 minutes
            });
          });
        } else if (config.mode === 'team') {
          const setup = config.setup as any;
          setup.teams.forEach((team: any, index: number) => {
            participants.push({
              name: team.name,
              type: 'team',
              score: 0,
              wordsFound: 0,
              wordsSkipped: 0,
              lettersRevealed: 0,
              currentWordIndex: 0,
              words: words[index],
              isActive: index === 0, // First team starts
              elapsedTimeSeconds: 0, // Each team starts with 0
              totalTimeSeconds: 300, // Each team gets 5 minutes
            });
          });
        }

        const session: GameSession = {
          id: crypto.randomUUID(),
          categoryId: config.categoryId,
          categoryName: '', // Will be set by caller
          categoryEmoji: '', // Will be set by caller
          mode: config.mode,
          state: 'playing',
          participants,
          activeParticipantIndex: 0,
          totalTimeSeconds: 300, // PRD: 5 minutes for all words
          elapsedTimeSeconds: 0,
          isPaused: false,
          startedAt: new Date().toISOString(),
          finishedAt: null,
        };

        set({ session });
      },

      pauseGame: () => {
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              isPaused: true,
              state: 'paused' as GameState,
            },
          };
        });
      },

      resumeGame: () => {
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              isPaused: false,
              state: 'playing' as GameState,
            },
          };
        });
      },

      endGame: () => {
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              state: 'finished' as GameState,
              finishedAt: new Date().toISOString(),
            },
          };
        });
      },

      resetGame: () => {
        set({ session: null });
      },

      tick: () => {
        set((state) => {
          if (!state.session || state.session.isPaused) return state;

          // Get active participant
          const participants = [...state.session.participants];
          const activeIndex = state.session.activeParticipantIndex;
          const activeParticipant = { ...participants[activeIndex] };

          // Update ACTIVE participant's timer
          activeParticipant.elapsedTimeSeconds += 1;

          // Check if ACTIVE participant's time is up
          if (activeParticipant.elapsedTimeSeconds >= activeParticipant.totalTimeSeconds) {
            // Mark all remaining words as timeout
            activeParticipant.words = activeParticipant.words.map((w) =>
              w.result === null ? { ...w, result: 'timeout' as WordResult } : w
            );

            participants[activeIndex] = activeParticipant;

            // Check if all participants finished
            const allParticipantsCompleted = participants.every((p) =>
              p.words.every((w) => w.result !== null)
            );

            if (allParticipantsCompleted) {
              // All done - end game
              return {
                session: {
                  ...state.session,
                  participants,
                  state: 'finished' as GameState,
                  finishedAt: new Date().toISOString(),
                },
              };
            } else if (state.session.mode === 'multi' || state.session.mode === 'team') {
              // Wait for host to start next participant
              participants[activeIndex] = { ...participants[activeIndex], isActive: false };

              return {
                session: {
                  ...state.session,
                  participants,
                  state: 'waiting_next_turn' as GameState,
                },
              };
            }
          }

          participants[activeIndex] = activeParticipant;

          return {
            session: {
              ...state.session,
              participants,
            },
          };
        });
      },

      revealLetter: (participantIndex: number, wordIndex: number, letterIndex: number) => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          const participant = { ...participants[participantIndex] };
          const words = [...participant.words];
          const word = { ...words[wordIndex] };

          // PRD Rule: Cannot reveal letters after making a guess
          if (word.hasMadeGuess) {
            console.warn('Cannot reveal letters after making a guess');
            return state;
          }

          // Reveal the letter
          const letters = [...word.letters];
          letters[letterIndex] = { ...letters[letterIndex], status: 'revealed' };

          word.letters = letters;
          word.lettersRevealed += 1;

          // Track letters revealed for statistics (penalty applied on correct guess)
          participant.lettersRevealed += 1;

          words[wordIndex] = word;
          participant.words = words;
          participants[participantIndex] = participant;

          return {
            session: {
              ...state.session,
              participants,
            },
          };
        });
      },

      submitGuess: (participantIndex: number, wordIndex: number, isCorrect: boolean) => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          const participant = { ...participants[participantIndex] };
          const words = [...participant.words];
          const word = { ...words[wordIndex] };

          // Mark that a guess has been made
          word.hasMadeGuess = true;
          word.remainingGuesses -= 1;

          if (isCorrect) {
            // Reveal all letters
            word.letters = word.letters.map((letter: Letter) => ({
              ...letter,
              status: 'revealed' as const,
            }));
            word.result = 'found';

            // Calculate points: Base points - (letters revealed × 100)
            const basePoints = word.letterCount * 100; // Example: 4 letter = 400 points
            const penalty = word.lettersRevealed * 100;
            const earnedPoints = Math.max(0, basePoints - penalty);

            word.pointsEarned = earnedPoints;
            participant.score += earnedPoints;
            participant.wordsFound += 1;

            // Move to next word
            participant.currentWordIndex += 1;
          } else {
            // Wrong guess
            if (word.remainingGuesses === 0) {
              // Auto-skip if no guesses left
              word.result = 'skipped';
              participant.wordsSkipped += 1;
              participant.currentWordIndex += 1;
            }
          }

          words[wordIndex] = word;
          participant.words = words;
          participants[participantIndex] = participant;

          // Check if current participant completed all words
          const participantCompleted = participant.words.every((w) => w.result !== null);

          // Check if ALL participants completed their words
          const allParticipantsCompleted = participants.every((p) =>
            p.words.every((w) => w.result !== null)
          );

          // Determine next state and actions
          let newState: GameState = state.session.state;
          const newActiveIndex = state.session.activeParticipantIndex;
          let finishedAt = state.session.finishedAt;
          let updatedParticipants = participants;

          if (allParticipantsCompleted) {
            // ALL participants finished → End game
            newState = 'finished';
            finishedAt = new Date().toISOString();
          } else if (
            participantCompleted &&
            (state.session.mode === 'multi' || state.session.mode === 'team')
          ) {
            // Current participant finished in multi/team mode → Wait for host to start next turn
            newState = 'waiting_next_turn';
            updatedParticipants = [...participants];
            updatedParticipants[participantIndex] = {
              ...updatedParticipants[participantIndex],
              isActive: false,
            };
          }

          return {
            session: {
              ...state.session,
              participants: updatedParticipants,
              activeParticipantIndex: newActiveIndex,
              state: newState,
              finishedAt,
            },
          };
        });
      },

      skipWord: (participantIndex: number, wordIndex: number) => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          const participant = { ...participants[participantIndex] };
          const words = [...participant.words];
          const word = { ...words[wordIndex] };

          word.result = 'skipped';
          word.pointsEarned = 0;
          participant.wordsSkipped += 1;
          participant.currentWordIndex += 1;

          words[wordIndex] = word;
          participant.words = words;
          participants[participantIndex] = participant;

          // Check if current participant completed all words
          const participantCompleted = participant.words.every((w) => w.result !== null);

          // Check if ALL participants completed their words
          const allParticipantsCompleted = participants.every((p) =>
            p.words.every((w) => w.result !== null)
          );

          // Determine next state and actions
          let newState: GameState = state.session.state;
          const newActiveIndex = state.session.activeParticipantIndex;
          let finishedAt = state.session.finishedAt;
          let updatedParticipants = participants;

          if (allParticipantsCompleted) {
            // ALL participants finished → End game
            newState = 'finished';
            finishedAt = new Date().toISOString();
          } else if (
            participantCompleted &&
            (state.session.mode === 'multi' || state.session.mode === 'team')
          ) {
            // Current participant finished in multi/team mode → Wait for host to start next turn
            newState = 'waiting_next_turn';
            updatedParticipants = [...participants];
            updatedParticipants[participantIndex] = {
              ...updatedParticipants[participantIndex],
              isActive: false,
            };
          }

          return {
            session: {
              ...state.session,
              participants: updatedParticipants,
              activeParticipantIndex: newActiveIndex,
              state: newState,
              finishedAt,
            },
          };
        });
      },

      nextParticipant: () => {
        set((state) => {
          if (!state.session || state.session.mode === 'single') return state;
          if (state.session.state !== 'waiting_next_turn') return state;

          const participants = [...state.session.participants];
          const currentIndex = state.session.activeParticipantIndex;
          const nextIndex = (currentIndex + 1) % participants.length;

          // Activate next participant
          participants[nextIndex] = { ...participants[nextIndex], isActive: true };

          return {
            session: {
              ...state.session,
              participants,
              activeParticipantIndex: nextIndex,
              state: 'playing', // Resume playing state
            },
          };
        });
      },

      updateScore: (participantIndex: number, points: number) => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          participants[participantIndex] = {
            ...participants[participantIndex],
            score: participants[participantIndex].score + points,
          };

          return {
            session: {
              ...state.session,
              participants,
            },
          };
        });
      },
    }),
    { name: 'GameStore' }
  )
);
