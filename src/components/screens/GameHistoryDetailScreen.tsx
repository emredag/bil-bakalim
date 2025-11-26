/**
 * Game History Detail Screen
 * PRD Reference: Section 4.9 - Yarışma Detay Ekranı
 * UI/UX Reference: docs/ui-ux-design.md#history
 *
 * Features:
 * - Game header info (date, category, mode, duration)
 * - Participant ranking table with medals
 * - Expandable word results per participant
 * - Action buttons: Play Again, Home, Back
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Trophy, ChevronDown, Home, RefreshCw } from 'lucide-react';
import {
  getGameHistoryById,
  getGameParticipants,
  getParticipantWordResults,
  formatPlayTime,
  formatGameMode,
  type GameHistory,
  type GameParticipant,
  type GameWordResult,
} from '../../api/gameHistory';
import { getCategoryById } from '../../api/category';
import type { Category } from '../../types/database';
import { useCategoryStore } from '../../store/categoryStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ROUTES } from '../../routes/constants';
import { fadeVariant } from '../../animations/variants';

export function GameHistoryDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setSelectedCategory } = useCategoryStore();

  // State
  const [game, setGame] = useState<GameHistory | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [wordResultsMap, setWordResultsMap] = useState<Record<number, GameWordResult[]>>({});
  const [expandedParticipants, setExpandedParticipants] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load game detail
  useEffect(() => {
    if (!id) {
      setError('Geçersiz oyun ID');
      setLoading(false);
      return;
    }

    const loadGameDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const gameId = parseInt(id, 10);
        if (isNaN(gameId)) {
          throw new Error('Geçersiz oyun ID');
        }

        // Load game info and participants
        const [gameData, participantsData] = await Promise.all([
          getGameHistoryById(gameId),
          getGameParticipants(gameId),
        ]);

        setGame(gameData);

        // Sort participants by rank
        const sortedParticipants = [...participantsData].sort((a, b) => a.rank - b.rank);
        setParticipants(sortedParticipants);

        // Load word results for each participant
        const wordResults: Record<number, GameWordResult[]> = {};
        for (const participant of sortedParticipants) {
          try {
            const results = await getParticipantWordResults(gameId, participant.id);
            wordResults[participant.id] = results;
          } catch (err) {
            console.error(`Failed to load word results for participant ${participant.id}:`, err);
            wordResults[participant.id] = [];
          }
        }
        setWordResultsMap(wordResults);
      } catch (err) {
        console.error('Failed to load game detail:', err);
        setError('Oyun detayları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadGameDetail();
  }, [id]);

  // Toggle participant expansion
  const toggleParticipant = (participantId: number) => {
    setExpandedParticipants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(participantId)) {
        newSet.delete(participantId);
      } else {
        newSet.add(participantId);
      }
      return newSet;
    });
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  // Get result badge
  const getResultBadge = (result: string) => {
    switch (result) {
      case 'found':
        return (
          <span className="px-2 py-1 bg-success-600/30 text-success-300 rounded text-xs font-medium">
            ✓ Buldu
          </span>
        );
      case 'skipped':
        return (
          <span className="px-2 py-1 bg-warning-600/30 text-warning-300 rounded text-xs font-medium">
            → Geçti
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-error-600/30 text-error-300 rounded text-xs font-medium">
            ⏱ Süre Doldu
          </span>
        );
    }
  };

  // Handle play again
  const handlePlayAgain = async () => {
    if (game) {
      try {
        // Load and select the same category
        const category = (await getCategoryById(game.category_id)) as unknown as Category;
        setSelectedCategory(category);

        // Navigate to mode selection
        navigate(ROUTES.MODE_SELECT);
      } catch (err) {
        console.error('Failed to load category:', err);
        // Fallback to category select
        navigate(ROUTES.CATEGORY_SELECT);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
        <Card className="p-8">
          <p className="text-neutral-400">Yükleniyor...</p>
        </Card>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-error-400 mb-4">{error || 'Oyun bulunamadı'}</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.HISTORY)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeVariant}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => navigate(ROUTES.HISTORY)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Yarışma Detayları</h1>
          <div className="w-24" /> {/* Spacer for center alignment */}
        </div>

        {/* Game Info Card */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-info-400" />
              <div>
                <p className="text-xs text-neutral-400">Tarih</p>
                <p className="text-sm font-semibold text-white">{formatDate(game.played_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-accent-400" />
              <div>
                <p className="text-xs text-neutral-400">Kategori</p>
                <p className="text-sm font-semibold text-white">{game.category_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div>
                <p className="text-xs text-neutral-400">Mod</p>
                <p className="text-sm font-semibold text-white">{formatGameMode(game.game_mode)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-success-400" />
              <div>
                <p className="text-xs text-neutral-400">Süre</p>
                <p className="text-sm font-semibold text-white">
                  {formatPlayTime(game.total_time_seconds || 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Ranking Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Sıralama</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Sıra</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">İsim</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-400">
                    Puan
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-400">
                    Bulunan
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-400">
                    Pas
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-400">
                    Harf
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-400">
                    Detay
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => {
                  const isExpanded = expandedParticipants.has(participant.id);
                  const wordResults = wordResultsMap[participant.id] || [];

                  return (
                    <React.Fragment key={participant.id}>
                      <tr className="border-b border-neutral-700/50 hover:bg-neutral-800/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getMedal(participant.rank)}</span>
                            <span className="text-white font-semibold">{participant.rank}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">
                            {participant.participant_name}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-accent-400 font-bold text-lg">
                            {participant.score}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-success-400 font-semibold">
                            {participant.words_found}/14
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-warning-400 font-semibold">
                            {participant.words_skipped}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-info-400 font-semibold">
                            {participant.letters_revealed}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => toggleParticipant(participant.id)}
                            className="text-info-400 hover:text-info-300 transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </motion.div>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Word Results */}
                      {isExpanded && wordResults.length > 0 && (
                        <tr>
                          <td colSpan={7} className="py-4 px-4 bg-neutral-800/30">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-2"
                            >
                              <h4 className="text-sm font-semibold text-neutral-300 mb-3">
                                Kelime Detayları ({wordResults.length} kelime)
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {wordResults.map((word, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-700"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <span className="text-white font-semibold">
                                          {word.word}
                                        </span>
                                        <span className="text-neutral-400 text-sm ml-2">
                                          ({word.word.length} harf)
                                        </span>
                                      </div>
                                      {getResultBadge(word.result)}
                                    </div>
                                    {word.word_hint && (
                                      <p className="text-neutral-400 text-sm mb-2">
                                        💡 {word.word_hint}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs">
                                      <span className="text-neutral-400">
                                        Puan:{' '}
                                        <span className="text-accent-400 font-semibold">
                                          {word.points_earned}
                                        </span>
                                      </span>
                                      <span className="text-neutral-400">
                                        Harf:{' '}
                                        <span className="text-info-400 font-semibold">
                                          {word.letters_used}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" onClick={handlePlayAgain}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Bu Kategoride Tekrar Oyna
            </Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
              <Home className="w-5 h-5 mr-2" />
              Ana Menü
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// Add React import for Fragment
import React from 'react';
