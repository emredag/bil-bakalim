/**
 * Results Screen - Multiplayer
 * PRD Reference: Section 4.7 - Results Screen (Multiplayer)
 * UI/UX Reference: docs/ui-ux-design.md#results
 *
 * Features:
 * - 🏆 Ranking table with medals (🥇🥈🥉)
 * - Podium display for top 3
 * - Expandable participant details
 * - Tiebreaker display (if scores equal)
 * - Action buttons: Home, Play Again, View History
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3, Clock, Target, Zap } from 'lucide-react';
import type { GameSession } from '../../types';
import { ROUTES } from '../../routes/constants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';
import CelebrationHero from '../results/CelebrationHero';
import PodiumDisplay from '../results/PodiumDisplay';
import WordResultsGrid from '../results/WordResultsGrid';
import { ResultsActions } from '../results/ResultsActions';

// Global set to track saved session IDs (prevents duplicate saves in Strict Mode)
const savedSessionIds = new Set<string>();

interface ResultsMultiplayerProps {
  session: GameSession;
  onPlayAgain?: () => void;
}

export function ResultsMultiplayer({ session, onPlayAgain }: ResultsMultiplayerProps) {
  const navigate = useNavigate();
  const [expandedParticipants, setExpandedParticipants] = useState<Set<number>>(new Set());

  // Sort participants by official game rules:
  // 1. Higher score wins
  // 2. Fewer letters revealed wins (tiebreaker)
  // 3. Less time wins (tiebreaker)
  const rankedParticipants = [...session.participants].sort((a, b) => {
    // 1. Higher score wins
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // 2. Fewer letters revealed wins (inverse)
    if (a.lettersRevealed !== b.lettersRevealed) {
      return a.lettersRevealed - b.lettersRevealed;
    }

    // 3. Less time wins (inverse)
    return a.elapsedTimeSeconds - b.elapsedTimeSeconds;
  });

  // Assign ranks (handle ties) - two-pass algorithm
  const participantsWithRank = rankedParticipants.map((participant, index) => ({
    ...participant,
    rank: index + 1, // Temporary rank, will be adjusted for ties
    originalIndex: index,
  }));

  // Second pass: Adjust ranks for ties (score + letters + time all equal)
  for (let i = 1; i < participantsWithRank.length; i++) {
    const current = participantsWithRank[i];
    const prev = participantsWithRank[i - 1];

    if (
      current.score === prev.score &&
      current.lettersRevealed === prev.lettersRevealed &&
      current.elapsedTimeSeconds === prev.elapsedTimeSeconds
    ) {
      // True tie detected - use previous rank
      current.rank = prev.rank;
    }
  }

  // Save game to history on mount (ONCE ONLY per session)
  useEffect(() => {
    // Check if this session was already saved
    if (savedSessionIds.has(session.id)) {
      return;
    }

    // Mark as saved immediately
    savedSessionIds.add(session.id);

    // Calculate total elapsed time from all participants
    const totalElapsedTime = participantsWithRank.reduce(
      (sum, p) => sum + p.elapsedTimeSeconds,
      0
    );

    const gameData: GameSessionData = {
      category_id: session.categoryId,
      category_name: session.categoryName,
      game_mode: session.mode,
      played_at: new Date().toISOString(),
      // Use sum of all participants' elapsed time
      total_time_seconds: totalElapsedTime,
      participants: participantsWithRank.map((p) => ({
        name: p.name,
        participant_type: p.type,
        score: p.score,
        words_found: p.wordsFound,
        words_skipped: p.wordsSkipped,
        letters_revealed: p.lettersRevealed,
        elapsed_time_seconds: p.elapsedTimeSeconds,
        rank: p.rank,
        word_results: p.words.map((word) => ({
          word: word.word,
          word_hint: word.hint,
          result: word.result || 'skipped',
          points_earned: word.pointsEarned,
          letters_used: word.lettersRevealed,
        })),
      })),
    };

    saveGameToHistory(gameData)
      .catch((err) => {
        console.error('❌ Failed to save game to history:', err);
        // Remove from set on error so it can be retried
        savedSessionIds.delete(session.id);
      });
  }, []); // Empty dependency array - run ONCE

  // Get medal emoji
  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  // Toggle participant expansion
  const toggleParticipant = (index: number) => {
    setExpandedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Get winner
  const winner = participantsWithRank[0];

  return (
    <div className="relative min-h-screen overflow-y-auto bg-neutral-950 p-4 md:p-6 lg:p-8">
      {/* Mesh Gradient Background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          background: `
            radial-gradient(at 40% 20%, rgb(14, 165, 233) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgb(245, 158, 11) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgb(168, 85, 247) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgb(14, 165, 233) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgb(245, 158, 11) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgb(168, 85, 247) 0px, transparent 50%)
          `,
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        {/* Winner Celebration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CelebrationHero
            playerName={winner.name}
            score={winner.score}
            mode={session.mode}
            categoryEmoji={session.categoryEmoji}
            categoryName={session.categoryName}
          />
        </motion.div>

        {/* Podium Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PodiumDisplay rankings={participantsWithRank} mode="multi" />
        </motion.div>

        {/* Detailed Rankings */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-neutral-50 md:text-3xl">
            📊 Detaylı Sıralama
          </h2>
          <div className="space-y-4">
              {participantsWithRank.map((participant, index) => {
                const isExpanded = expandedParticipants.has(index);
                const medal = getMedal(participant.rank);
                const isTied =
                  index > 0 && participantsWithRank[index - 1].score === participant.score;

                // Rank color
                let rankColor = 'text-neutral-400';
                if (participant.rank === 1) rankColor = 'text-accent-400';
                else if (participant.rank === 2) rankColor = 'text-neutral-300';
                else if (participant.rank === 3) rankColor = 'text-accent-600';

                // Winner highlight
                const isWinner = participant.rank === 1;

                return (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-xl transition-all ${
                      isWinner
                        ? 'border-2 border-accent-500/50 bg-gradient-to-r from-accent-900/40 to-accent-800/40'
                        : 'border border-neutral-700/50 bg-neutral-800/30'
                    }`}
                  >
                    {/* Participant Header - Clickable */}
                    <button
                      onClick={() => toggleParticipant(index)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-neutral-700/30 md:p-6"
                    >
                      <div className="flex flex-1 items-center gap-3 md:gap-6">
                        {/* Rank & Medal */}
                        <div className="flex min-w-[80px] items-center gap-2 md:min-w-[100px]">
                          <span className={`text-2xl font-bold md:text-3xl ${rankColor}`}>
                            {participant.rank}.
                          </span>
                          {medal && <span className="text-3xl md:text-4xl">{medal}</span>}
                        </div>

                        {/* Name & Score */}
                        <div className="flex-1 text-left">
                          <p className="text-xl font-bold text-neutral-50 md:text-2xl">
                            {participant.name}
                          </p>
                          <div className="mt-1 flex items-center gap-4">
                            <p className="font-mono text-2xl font-bold tabular-nums text-accent-400 md:text-3xl">
                              {participant.score.toLocaleString('tr-TR')}
                            </p>
                            {isTied && (
                              <span className="rounded bg-warning-900/30 px-2 py-1 text-xs text-warning-300 md:text-sm">
                                🏅 Beraberlik
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden items-center gap-6 text-sm lg:flex">
                          <div className="text-center">
                            <p className="font-semibold tabular-nums text-success-400">
                              {participant.wordsFound}/{participant.words.length}
                            </p>
                            <p className="text-xs text-neutral-400">Bulunan</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold tabular-nums text-warning-400">
                              {participant.wordsSkipped}
                            </p>
                            <p className="text-xs text-neutral-400">Pas</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold tabular-nums text-primary-400">
                              {participant.lettersRevealed}
                            </p>
                            <p className="text-xs text-neutral-400">Harf</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold tabular-nums text-neutral-300">
                              {(() => {
                                const mins = Math.floor(participant.elapsedTimeSeconds / 60);
                                const secs = Math.floor(participant.elapsedTimeSeconds % 60);
                                return `${mins}:${secs.toString().padStart(2, '0')}`;
                              })()}
                            </p>
                            <p className="text-xs text-neutral-400">Süre</p>
                          </div>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4"
                      >
                        <ChevronDown className="h-6 w-6 text-neutral-400" />
                      </motion.div>
                    </button>

                    {/* Participant Details - Expandable */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-neutral-700/50 p-4 pt-6 md:p-6">
                            {/* Stats Grid */}
                            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                              <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
                                <div className="mb-2 flex justify-center">
                                  <Target className="h-5 w-5 text-success-400" />
                                </div>
                                <p className="font-mono text-xl font-bold tabular-nums text-success-400">
                                  {participant.wordsFound}/{participant.words.length}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">Bulunan</p>
                              </div>
                              <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
                                <div className="mb-2 flex justify-center">
                                  <Zap className="h-5 w-5 text-warning-400" />
                                </div>
                                <p className="font-mono text-xl font-bold tabular-nums text-warning-400">
                                  {participant.wordsSkipped}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">Pas</p>
                              </div>
                              <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
                                <div className="mb-2 flex justify-center">
                                  <BarChart3 className="h-5 w-5 text-primary-400" />
                                </div>
                                <p className="font-mono text-xl font-bold tabular-nums text-primary-400">
                                  {participant.lettersRevealed}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">Harf</p>
                              </div>
                              <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
                                <div className="mb-2 flex justify-center">
                                  <Clock className="h-5 w-5 text-secondary-400" />
                                </div>
                                <p className="font-mono text-xl font-bold tabular-nums text-secondary-400">
                                  {(() => {
                                    const mins = Math.floor(participant.elapsedTimeSeconds / 60);
                                    const secs = Math.floor(participant.elapsedTimeSeconds % 60);
                                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                                  })()}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">Süre</p>
                              </div>
                            </div>

                            {/* Word Results */}
                            <WordResultsGrid words={participant.words} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
        </motion.div>

        {/* Action Buttons */}
        <ResultsActions
          onHome={() => navigate(ROUTES.HOME)}
          onPlayAgain={() => {
            if (onPlayAgain) {
              onPlayAgain();
            } else {
              navigate(ROUTES.CATEGORY_SELECT);
            }
          }}
          onHistory={() => navigate(ROUTES.HISTORY)}
        />
      </div>
    </div>
  );
}
