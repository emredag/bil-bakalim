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
import { motion } from 'framer-motion';
import { ChevronDown, Home, RefreshCw, History, Trophy, Users } from 'lucide-react';
import type { GameSession, Team } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TeamChip } from '../ui/TeamChip';
import { ROUTES } from '../../routes/constants';
import { fadeVariant, pageTransition } from '../../animations/variants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';

// Global set to track saved session IDs (prevents duplicate saves in Strict Mode)
const savedSessionIds = new Set<string>();

interface ResultsTeamModeProps {
  session: GameSession;
  teams: Team[]; // Full team info with emoji, color, members
  onPlayAgain?: () => void;
}

export function ResultsTeamMode({ session, teams, onPlayAgain }: ResultsTeamModeProps) {
  const navigate = useNavigate();
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());

  // Sort teams by score (descending), then by words found (tiebreaker)
  const rankedParticipants = [...session.participants].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // Higher score wins
    }
    // Tiebreaker: More words found wins
    return b.wordsFound - a.wordsFound;
  });

  // Assign ranks (handle ties) - two-pass algorithm
  const participantsWithRank = rankedParticipants.map((participant, index) => ({
    ...participant,
    rank: index + 1, // Temporary rank, will be adjusted for ties
    originalIndex: index,
  }));

  // Second pass: Adjust ranks for ties
  for (let i = 1; i < participantsWithRank.length; i++) {
    const current = participantsWithRank[i];
    const prev = participantsWithRank[i - 1];

    if (current.score === prev.score && current.wordsFound === prev.wordsFound) {
      // Tie detected - use previous rank
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
        words_skipped: p.wordsSkipped,
        letters_revealed: p.lettersRevealed,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header - Trophy & Winner Highlight */}
        <motion.div
          variants={fadeVariant}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Kazanan Takım</h1>
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400" />
          </div>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            {session.categoryEmoji} {session.categoryName}
          </p>
          <p className="text-base md:text-lg text-slate-400">{session.participants.length} Takım</p>
        </motion.div>

        {/* Winner Team Card */}
        <motion.div variants={pageTransition} initial="initial" animate="animate">
          <Card className="p-6 md:p-8 text-center bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-2 border-amber-400/60 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              {/* Team Chip */}
              {winnerTeamInfo && (
                <TeamChip
                  name={winnerTeam.name}
                  emoji={winnerTeamInfo.emoji}
                  color={winnerTeamInfo.color}
                  size="lg"
                  score={winnerTeam.score}
                  showScore={false}
                />
              )}

              {/* Score */}
              <div>
                <p className="text-lg md:text-xl text-amber-200 mb-2">🥇 Toplam Puan</p>
                <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-amber-400 tabular-nums">
                  {winnerTeam.score}
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm md:text-base">
                <div>
                  <span className="text-emerald-400 font-bold">{winnerTeam.wordsFound}</span>
                  <span className="text-slate-300"> kelime buldu</span>
                </div>
                <div className="text-slate-500">•</div>
                <div>
                  <span className="text-amber-400 font-bold">{winnerTeam.wordsSkipped}</span>
                  <span className="text-slate-300"> pas geçildi</span>
                </div>
                <div className="text-slate-500">•</div>
                <div>
                  <span className="text-blue-400 font-bold">{winnerTeam.lettersRevealed}</span>
                  <span className="text-slate-300"> harf alındı</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Team Rankings */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Takım Sıralaması</h2>

            <div className="space-y-4">
              {participantsWithRank.map((participant, index) => {
                const isExpanded = expandedTeams.has(index);
                const teamInfo = getTeamInfo(participant.name);
                const isTied =
                  index > 0 && participantsWithRank[index - 1].score === participant.score;

                return (
                  <div
                    key={index}
                    className={`rounded-lg overflow-hidden transition-all ${
                      participant.rank === 1
                        ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/40 border-2 border-amber-400/50'
                        : 'bg-slate-700/50 border border-slate-600'
                    }`}
                  >
                    {/* Team Header - Clickable */}
                    <button
                      onClick={() => toggleTeam(index)}
                      className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-slate-600/20 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Rank & Medal */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-2xl md:text-3xl font-bold text-slate-300 tabular-nums">
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
                            <span className="hidden md:inline text-xs md:text-sm text-amber-300 bg-amber-900/30 px-2 py-1 rounded">
                              🏅 Eşitlik: {participant.wordsFound} kelime buldu
                            </span>
                          )}

                          {/* Quick stats (hidden on mobile) */}
                          <div className="hidden lg:flex items-center gap-4 text-sm text-slate-400">
                            <span>
                              Bulunan:{' '}
                              <span className="text-emerald-400">{participant.wordsFound}</span>
                            </span>
                            <span>
                              Pas:{' '}
                              <span className="text-amber-400">{participant.wordsSkipped}</span>
                            </span>
                            <span>
                              Harf:{' '}
                              <span className="text-blue-400">{participant.lettersRevealed}</span>
                            </span>
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400 tabular-nums">
                              {participant.score}
                            </p>
                            <p className="text-xs text-slate-400">puan</p>
                          </div>
                        </div>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 flex-shrink-0"
                      >
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      </motion.div>
                    </button>

                    {/* Team Details - Expandable */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-6 pt-0 border-t border-slate-600/50">
                        {/* Team Members */}
                        {teamInfo && teamInfo.members && teamInfo.members.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-slate-400" />
                              <h3 className="text-lg font-bold text-white">Takım Üyeleri</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {teamInfo.members
                                .sort((a, b) => a.order - b.order)
                                .map((member) => (
                                  <div
                                    key={member.order}
                                    className="bg-slate-800/30 p-3 rounded-lg flex items-center gap-2"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold">
                                      {member.order}
                                    </div>
                                    <span className="text-slate-300">{member.name}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                              {participant.wordsFound}/{participant.words.length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Bulunan Kelime</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-amber-400 tabular-nums">
                              {participant.wordsSkipped}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Pas Geçilen</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-400 tabular-nums">
                              {participant.lettersRevealed}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Alınan Harf</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-violet-400 tabular-nums">
                              {(() => {
                                const mins = Math.floor(participant.elapsedTimeSeconds / 60);
                                const secs = Math.floor(participant.elapsedTimeSeconds % 60);
                                return `${mins}:${secs.toString().padStart(2, '0')}`;
                              })()}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Geçen Süre</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-cyan-400 tabular-nums">
                              {(() => {
                                const avgSeconds =
                                  participant.words.length > 0
                                    ? participant.elapsedTimeSeconds / participant.words.length
                                    : 0;
                                const mins = Math.floor(avgSeconds / 60);
                                const secs = Math.floor(avgSeconds % 60);
                                return `${mins}:${secs.toString().padStart(2, '0')}`;
                              })()}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Ort. Süre/Kelime</p>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-slate-400 tabular-nums">
                              {participant.words.length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Toplam Kelime</p>
                          </div>
                        </div>

                        {/* Word List */}
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">Kelime Detayları</h3>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {participant.words.map((word, wordIndex) => {
                              const statusIcon =
                                word.result === 'found'
                                  ? '✅'
                                  : word.result === 'skipped'
                                    ? '⏭'
                                    : '⏱️';
                              const statusColor =
                                word.result === 'found'
                                  ? 'text-emerald-400'
                                  : word.result === 'skipped'
                                    ? 'text-amber-400'
                                    : 'text-red-400';

                              return (
                                <div
                                  key={wordIndex}
                                  className="bg-slate-800/30 p-3 rounded-lg flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-400 font-mono text-sm">
                                      {wordIndex + 1}.
                                    </span>
                                    <div>
                                      <p className="text-white font-semibold">
                                        {word.word}{' '}
                                        <span className="text-slate-400 text-xs">
                                          ({word.letterCount} harf)
                                        </span>
                                      </p>
                                      <p className={`text-sm ${statusColor}`}>
                                        {statusIcon}{' '}
                                        {word.result === 'found'
                                          ? 'Bulundu'
                                          : word.result === 'skipped'
                                            ? 'Pas'
                                            : 'Süre Doldu'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-amber-400 tabular-nums">
                                      {word.pointsEarned}
                                    </p>
                                    <p className="text-xs text-slate-400">puan</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Menü
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (onPlayAgain) {
                onPlayAgain();
              } else {
                navigate(ROUTES.CATEGORY_SELECT);
              }
            }}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Oyna
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.HISTORY)}
            className="w-full flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            Geçmiş Yarışmalar
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
