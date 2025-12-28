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
  SinglePlayerSetup,
  MultiPlayerSetup,
  TeamModeSetup,
} from '../types/game';

// Type guards for proper type narrowing
function isSinglePlayerSetup(setup: GameConfig['setup']): setup is SinglePlayerSetup {
  return 'playerName' in setup;
}

function isMultiPlayerSetup(setup: GameConfig['setup']): setup is MultiPlayerSetup {
  return 'players' in setup && Array.isArray((setup as MultiPlayerSetup).players);
}

function isTeamModeSetup(setup: GameConfig['setup']): setup is TeamModeSetup {
  return 'teams' in setup && Array.isArray((setup as TeamModeSetup).teams);
}

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
  tick: () => void; // Called every second for global timer

  // Guess mode actions
  startGuess: (guessTimerDuration: number) => void; // Enter guess mode, pause global timer
  guessTimerTick: () => void; // Called every second for guess timer
  endGuessMode: () => void; // Exit guess mode, resume global timer
  handleGuessTimeout: () => void; // Called when guess timer reaches 0

  // Word actions
  revealLetter: (participantIndex: number, wordIndex: number, letterIndex: number) => void;
  submitGuess: (participantIndex: number, wordIndex: number, isCorrect: boolean) => void;
  markWordAsSkipped: (participantIndex: number, wordIndex: number) => void; // When all letters revealed
  nextWord: () => void; // Move to next word (after delay)

  // Transition actions
  setTransition: (isInTransition: boolean) => void; // Pause timer during transitions

  // Participant actions
  nextParticipant: () => void;
  updateScore: (participantIndex: number, points: number) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      session: null,

      startGame: (config: GameConfig, words: GameWord[][]) => {
        // Use gameDuration from config (passed from caller who gets it from settings)
        // This removes direct dependency on settingsStore within this store
        const gameDuration = config.gameDuration;
        
        const participants: ActiveParticipant[] = [];

        // Create participants based on mode with proper type guards
        if (config.mode === 'single' && isSinglePlayerSetup(config.setup)) {
          participants.push({
            name: config.setup.playerName,
            type: 'player',
            score: 0,
            wordsFound: 0,
            wordsWrong: 0,
            wordsSkipped: 0,
            lettersRevealed: 0,
            currentWordIndex: 0,
            words: words[0],
            isActive: true,
            elapsedTimeSeconds: 0,
            totalTimeSeconds: gameDuration,
          });
        } else if (config.mode === 'multi' && isMultiPlayerSetup(config.setup)) {
          config.setup.players.forEach((playerName: string, index: number) => {
            participants.push({
              name: playerName,
              type: 'player',
              score: 0,
              wordsFound: 0,
              wordsWrong: 0,
              wordsSkipped: 0,
              lettersRevealed: 0,
              currentWordIndex: 0,
              words: words[index],
              isActive: index === 0,
              elapsedTimeSeconds: 0,
              totalTimeSeconds: gameDuration,
            });
          });
        } else if (config.mode === 'team' && isTeamModeSetup(config.setup)) {
          config.setup.teams.forEach((team, index: number) => {
            participants.push({
              name: team.name,
              type: 'team',
              score: 0,
              wordsFound: 0,
              wordsWrong: 0,
              wordsSkipped: 0,
              lettersRevealed: 0,
              currentWordIndex: 0,
              words: words[index],
              isActive: index === 0,
              elapsedTimeSeconds: 0,
              totalTimeSeconds: gameDuration,
            });
          });
        }

        const session: GameSession = {
          id: crypto.randomUUID(),
          categoryId: config.categoryId,
          categoryName: config.categoryName,
          categoryEmoji: config.categoryEmoji,
          mode: config.mode,
          state: 'playing',
          participants,
          activeParticipantIndex: 0,
          totalTimeSeconds: gameDuration,
          elapsedTimeSeconds: 0,
          isPaused: false,
          isInTransition: false,
          isGuessing: false,
          guessTimeRemaining: 0,
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
          // Don't tick if paused, in transition, or in guess mode
          if (!state.session || state.session.isPaused || state.session.isInTransition || state.session.isGuessing) return state;

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

      // Enter guess mode - pause global timer, start guess countdown
      startGuess: (guessTimerDuration: number) => {
        set((state) => {
          if (!state.session || state.session.isGuessing) return state;
          
          return {
            session: {
              ...state.session,
              isGuessing: true,
              guessTimeRemaining: guessTimerDuration,
            },
          };
        });
      },

      // Tick the guess timer
      guessTimerTick: () => {
        set((state) => {
          if (!state.session || !state.session.isGuessing || state.session.isPaused) return state;
          
          const newTimeRemaining = state.session.guessTimeRemaining - 1;
          
          return {
            session: {
              ...state.session,
              guessTimeRemaining: Math.max(0, newTimeRemaining),
            },
          };
        });
      },

      // Exit guess mode
      endGuessMode: () => {
        set((state) => {
          if (!state.session) return state;
          
          return {
            session: {
              ...state.session,
              isGuessing: false,
              guessTimeRemaining: 0,
            },
          };
        });
      },

      // Handle guess timeout - treat as wrong answer
      handleGuessTimeout: () => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          const activeIndex = state.session.activeParticipantIndex;
          const participant = { ...participants[activeIndex] };
          const words = [...participant.words];
          const wordIndex = participant.currentWordIndex;
          const word = { ...words[wordIndex] };

          // Mark as timeout
          word.hasMadeGuess = true;
          word.result = 'timeout';

          // Calculate penalty: remaining points as negative
          const basePoints = word.letterCount * 100;
          const revealedPenalty = word.lettersRevealed * 100;
          const penaltyPoints = -(basePoints - revealedPenalty);

          word.pointsEarned = penaltyPoints;
          participant.score += penaltyPoints; // Can go negative
          participant.wordsWrong += 1;

          // Reveal all letters
          word.letters = word.letters.map((letter: Letter) => ({
            ...letter,
            status: 'revealed' as const,
          }));

          words[wordIndex] = word;
          participant.words = words;
          participants[activeIndex] = participant;

          return {
            session: {
              ...state.session,
              participants,
              isGuessing: false,
              guessTimeRemaining: 0,
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

          // Cannot reveal letters in guess mode or after guess made
          if (state.session.isGuessing || word.hasMadeGuess) {
            console.warn('Cannot reveal letters in guess mode or after guess');
            return state;
          }

          // Reveal the letter
          const letters = [...word.letters];
          letters[letterIndex] = { ...letters[letterIndex], status: 'revealed' };

          word.letters = letters;
          word.lettersRevealed += 1;

          // Track letters revealed for statistics
          participant.lettersRevealed += 1;

          // Check if all letters are now revealed
          const allRevealed = word.letters.every((l, i) => 
            i === letterIndex ? true : l.status === 'revealed'
          );
          
          if (allRevealed) {
            // Mark as skipped when all letters revealed (no points, no penalty)
            word.result = 'skipped';
            word.pointsEarned = 0;
            participant.wordsSkipped += 1;
          }

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

          // Calculate points based on letters revealed
          const basePoints = word.letterCount * 100;
          const revealedPenalty = word.lettersRevealed * 100;
          const currentValue = basePoints - revealedPenalty;

          if (isCorrect) {
            // Correct guess: add points
            word.result = 'found';
            word.pointsEarned = currentValue;
            participant.score += currentValue;
            participant.wordsFound += 1;

            // Reveal all letters
            word.letters = word.letters.map((letter: Letter) => ({
              ...letter,
              status: 'revealed' as const,
            }));
          } else {
            // Wrong guess: subtract points (can go negative)
            word.result = 'wrong';
            word.pointsEarned = -currentValue;
            participant.score -= currentValue;
            participant.wordsWrong += 1;

            // Reveal all letters
            word.letters = word.letters.map((letter: Letter) => ({
              ...letter,
              status: 'revealed' as const,
            }));
          }

          words[wordIndex] = word;
          participant.words = words;
          participants[participantIndex] = participant;

          return {
            session: {
              ...state.session,
              participants,
              isGuessing: false,
              guessTimeRemaining: 0,
            },
          };
        });
      },

      // Mark word as skipped (when all letters revealed)
      markWordAsSkipped: (participantIndex: number, wordIndex: number) => {
        set((state) => {
          if (!state.session) return state;

          const participants = [...state.session.participants];
          const participant = { ...participants[participantIndex] };
          const words = [...participant.words];
          const word = { ...words[wordIndex] };

          // Already has a result, don't override
          if (word.result !== null) return state;

          word.result = 'skipped';
          word.pointsEarned = 0;
          participant.wordsSkipped += 1;

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

      setTransition: (isInTransition: boolean) => {
        set((state) => {
          if (!state.session) return state;
          return {
            session: {
              ...state.session,
              isInTransition,
            },
          };
        });
      },

      nextWord: () => {
        set((state) => {
          if (!state.session) return state;

          // IMPORTANT: Get FRESH state from current session
          const participants = [...state.session.participants];
          const participant = { ...participants[state.session.activeParticipantIndex] };

          // Move to next word
          participant.currentWordIndex += 1;
          participants[state.session.activeParticipantIndex] = participant;

          // Check if current participant completed all words (using UPDATED participants array)
          const participantCompleted = participants[state.session.activeParticipantIndex].words.every((w) => w.result !== null);

          // Check if ALL participants completed their words (using UPDATED participants array)
          const allParticipantsCompleted = participants.every((p) =>
            p.words.every((w) => w.result !== null)
          );

          // Determine next state
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
            updatedParticipants[state.session.activeParticipantIndex] = {
              ...updatedParticipants[state.session.activeParticipantIndex],
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
    }),
    { name: 'GameStore' }
  )
);
