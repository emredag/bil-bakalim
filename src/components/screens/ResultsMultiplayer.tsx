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
import { motion } from 'framer-motion';
import { ChevronDown, Home, RefreshCw, History, Trophy } from 'lucide-react';
import type { GameSession } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ROUTES } from '../../routes/constants';
import { fadeVariant, pageTransition } from '../../animations/variants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';

// Global set to track saved session IDs (prevents duplicate saves in Strict Mode)
const savedSessionIds = new Set<string>();

interface ResultsMultiplayerProps {
  session: GameSession;
  onPlayAgain?: () => void;
}

export function ResultsMultiplayer({ session, onPlayAgain }: ResultsMultiplayerProps) {
  const navigate = useNavigate();
  const [expandedParticipants, setExpandedParticipants] = useState<Set<number>>(new Set());

  // Sort participants by score (descending), then by words found (tiebreaker)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header - Trophy */}
        <motion.div
          variants={fadeVariant}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Sıralama</h1>
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400" />
          </div>
          <p className="text-xl md:text-2xl text-slate-300">
            {session.categoryEmoji} {session.categoryName}
          </p>
          <p className="text-base md:text-lg text-slate-400 mt-2">
            {session.participants.length} Yarışmacı
          </p>
        </motion.div>

        {/* Ranking Table */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 md:p-8">
            <div className="space-y-3">
              {participantsWithRank.map((participant, index) => {
                const isExpanded = expandedParticipants.has(index);
                const medal = getMedal(participant.rank);
                const isTied =
                  index > 0 && participantsWithRank[index - 1].score === participant.score;

                // Medal color for top 3
                let rankColor = 'text-slate-400';
                if (participant.rank === 1) rankColor = 'text-amber-400';
                else if (participant.rank === 2) rankColor = 'text-slate-300';
                else if (participant.rank === 3) rankColor = 'text-amber-600';

                return (
                  <div
                    key={index}
                    className={`rounded-lg overflow-hidden ${
                      participant.rank === 1
                        ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/40 border-2 border-amber-400/50'
                        : 'bg-slate-700/50'
                    }`}
                  >
                    {/* Participant Header - Clickable */}
                    <button
                      onClick={() => toggleParticipant(index)}
                      className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-6 flex-1">
                        {/* Rank & Medal */}
                        <div className="flex items-center gap-2 min-w-[80px] md:min-w-[100px]">
                          <span className={`text-2xl md:text-3xl font-bold ${rankColor}`}>
                            {participant.rank}.
                          </span>
                          {medal && <span className="text-3xl md:text-4xl">{medal}</span>}
                        </div>

                        {/* Name & Score */}
                        <div className="flex-1 text-left">
                          <p className="text-xl md:text-2xl font-bold text-white">
                            {participant.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-2xl md:text-3xl font-bold text-amber-400 tabular-nums">
                              {participant.score} puan
                            </p>
                            {isTied && (
                              <span className="text-xs md:text-sm text-amber-300 bg-amber-900/30 px-2 py-1 rounded">
                                🏅 Eşitlik: {participant.wordsFound} kelime buldu
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-emerald-400 font-semibold tabular-nums">
                              {participant.wordsFound}/{participant.words.length}
                            </p>
                            <p className="text-slate-400 text-xs">Bulunan</p>
                          </div>
                          <div className="text-center">
                            <p className="text-amber-400 font-semibold tabular-nums">
                              {participant.wordsSkipped}
                            </p>
                            <p className="text-slate-400 text-xs">Pas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 font-semibold tabular-nums">
                              {participant.lettersRevealed}
                            </p>
                            <p className="text-slate-400 text-xs">Harf</p>
                          </div>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4"
                      >
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      </motion.div>
                    </button>

                    {/* Participant Details - Expandable */}
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
                                        {statusIcon} {word.result === 'found' ? 'Bulundu' : 'Pas'}
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
          {/* Home */}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Ana Menü
          </Button>

          {/* Play Again */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (onPlayAgain) {
                onPlayAgain();
              } else {
                navigate(ROUTES.CATEGORY_SELECT);
              }
            }}
            className="w-full"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Tekrar Oyna
          </Button>

          {/* History */}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(ROUTES.HISTORY)}
            className="w-full"
          >
            <History className="w-5 h-5 mr-2" />
            Geçmiş Yarışmalar
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
