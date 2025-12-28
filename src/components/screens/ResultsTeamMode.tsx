/**
 * Results Screen - Team Mode
 * PRD Reference: Section 4.7 - Results Screen (Team Mode)
 * UI/UX Reference: docs/ui-ux-design.md#results
 *
 * Features:
 * - 🏆 Winner team highlight with team colors/emoji
 * - Team ranking table
 * - Total points per team
 * - Expandable team details with:
 *   - Team member list
 *   - Stats grid
 *   - Word list
 * - Action buttons: Home, Play Again, View History
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, BarChart3, Clock, Target, Zap } from 'lucide-react';
import type { GameSession, Team } from '../../types';
import { TeamChip } from '../ui/TeamChip';
import { ROUTES } from '../../routes/constants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';
import CelebrationHero from '../results/CelebrationHero';
import PodiumDisplay from '../results/PodiumDisplay';
import WordResultsGrid from '../results/WordResultsGrid';
import { ResultsActions } from '../results/ResultsActions';
import {
  cleanupOldSessions,
  isSessionSaved,
  markSessionSaved,
  unmarkSessionSaved,
} from '../../utils/sessionTracker';

interface ResultsTeamModeProps {
  session: GameSession;
  teams: Team[]; // Full team info with emoji, color, members
  onPlayAgain?: () => void;
}

export function ResultsTeamMode({ session, teams, onPlayAgain }: ResultsTeamModeProps) {
  const navigate = useNavigate();
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());

  // Sort teams by official game rules:
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
    // Cleanup old sessions periodically
    cleanupOldSessions();

    // Check if this session was already saved
    if (isSessionSaved(session.id)) {
      return;
    }

    // Mark as saved immediately
    markSessionSaved(session.id);

    // Calculate total elapsed time from all teams
    const totalElapsedTime = participantsWithRank.reduce(
      (sum, p) => sum + p.elapsedTimeSeconds,
      0
    );

    const gameData: GameSessionData = {
      category_id: session.categoryId,
      category_name: session.categoryName,
      game_mode: session.mode,
      played_at: new Date().toISOString(),
      // Use sum of all teams' elapsed time
      total_time_seconds: totalElapsedTime,
      participants: participantsWithRank.map((p) => ({
        name: p.name,
        participant_type: p.type,
        score: p.score,
        words_found: p.wordsFound,
        words_wrong: p.wordsWrong,
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
        unmarkSessionSaved(session.id);
      });
  }, []); // Empty dependency array - run ONCE

  // Get team info by team name
  const getTeamInfo = (teamName: string): Team | undefined => {
    return teams.find((t) => t.name === teamName);
  };

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

  // Toggle team expansion
  const toggleTeam = (index: number) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Winner team (rank 1)
  const winnerTeam = participantsWithRank[0];
  const winnerTeamInfo = getTeamInfo(winnerTeam.name);

  // Add team info (emoji, color) to participants for podium display
  const rankedTeamsWithInfo = participantsWithRank.map((p) => {
    const teamInfo = getTeamInfo(p.name);
    return {
      ...p,
      emoji: teamInfo?.emoji || '👥',
      color: teamInfo?.color || '#3b82f6',
    };
  });

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
            playerName={`${winnerTeamInfo?.emoji || '🏆'} ${winnerTeam.name}`}
            score={winnerTeam.score}
            mode={session.mode}
            categoryEmoji={session.categoryEmoji}
            categoryName={session.categoryName}
          />
        </motion.div>

        {/* Team Podium Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PodiumDisplay rankings={rankedTeamsWithInfo} mode="team" />
        </motion.div>

        {/* Detailed Team Rankings */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-neutral-50 md:text-3xl">
            📊 Takım Detayları
          </h2>

          <div className="space-y-4">
              {participantsWithRank.map((participant, index) => {
                const isExpanded = expandedTeams.has(index);
                const teamInfo = getTeamInfo(participant.name);
                const isTied =
                  index > 0 && participantsWithRank[index - 1].score === participant.score;

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
                    {/* Team Header - Clickable */}
                    <button
                      onClick={() => toggleTeam(index)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-700/30 md:p-6"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                        {/* Rank & Medal */}
                        <div className="flex flex-shrink-0 items-center gap-2">
                          <span className="text-2xl font-bold tabular-nums text-neutral-300 md:text-3xl">
                            {participant.rank}
                          </span>
                          {getMedal(participant.rank) && (
                            <span className="text-2xl md:text-3xl">
                              {getMedal(participant.rank)}
                            </span>
                          )}
                        </div>

                        {/* Team Chip */}
                        {teamInfo && (
                          <div className="flex-shrink-0">
                            <TeamChip
                              name={participant.name}
                              emoji={teamInfo.emoji}
                              color={teamInfo.color}
                              size="md"
                            />
                          </div>
                        )}

                        {/* Score */}
                        <div className="ml-auto flex items-center gap-4">
                          {/* Tiebreaker badge (only on large screens) */}
                          {isTied && (
                            <span className="hidden rounded bg-warning-900/30 px-2 py-1 text-xs text-warning-300 md:inline md:text-sm">
                              🏅 Beraberlik
                            </span>
                          )}

                          {/* Quick stats (hidden on mobile) */}
                          <div className="hidden items-center gap-4 text-sm text-neutral-400 lg:flex">
                            <span>
                              Bulunan:{' '}
                              <span className="text-success-400">{participant.wordsFound}</span>
                            </span>
                            <span>
                              Pas:{' '}
                              <span className="text-warning-400">{participant.wordsSkipped}</span>
                            </span>
                            <span>
                              Harf:{' '}
                              <span className="text-primary-400">{participant.lettersRevealed}</span>
                            </span>
                            <span>
                              Süre:{' '}
                              <span className="text-neutral-300">
                                {(() => {
                                  const mins = Math.floor(participant.elapsedTimeSeconds / 60);
                                  const secs = Math.floor(participant.elapsedTimeSeconds % 60);
                                  return `${mins}:${secs.toString().padStart(2, '0')}`;
                                })()}
                              </span>
                            </span>
                          </div>

                          {/* Score */}
                          <div className="flex-shrink-0 text-right">
                            <p className="font-mono text-2xl font-bold tabular-nums text-accent-400 md:text-3xl lg:text-4xl">
                              {participant.score.toLocaleString('tr-TR')}
                            </p>
                            <p className="text-xs text-neutral-400">puan</p>
                          </div>
                        </div>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 flex-shrink-0"
                      >
                        <ChevronDown className="h-6 w-6 text-neutral-400" />
                      </motion.div>
                    </button>

                    {/* Team Details - Expandable */}
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
                            {/* Team Members */}
                            {teamInfo && teamInfo.members && teamInfo.members.length > 0 && (
                              <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2">
                                  <Users className="h-5 w-5 text-neutral-400" />
                                  <h3 className="text-lg font-bold text-neutral-50">
                                    Takım Üyeleri
                                  </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                  {teamInfo.members
                                    .sort((a, b) => a.order - b.order)
                                    .map((member) => (
                                      <div
                                        key={member.order}
                                        className="flex items-center gap-2 rounded-lg bg-neutral-800/30 p-3"
                                      >
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-neutral-300">
                                          {member.order}
                                        </div>
                                        <span className="text-neutral-300">{member.name}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

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
