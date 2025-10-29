/**
 * Game History Screen
 * PRD Reference: Section 4.8 - Game History Screen
 * UI/UX Reference: docs/ui-ux-design.md#history
 *
 * Features:
 * - 📊 Statistics summary (total games, most played category, highest score, total time)
 * - 🔍 Filters (date range, category, game mode)
 * - 📋 Sortable game list
 * - 📄 Pagination
 * - 🗑️ Delete functionality (single & all)
 * - 📥 Export to JSON
 * - 💀 Empty state
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Clock,
  Users,
  Download,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
} from 'lucide-react';
import {
  getAllGameHistory,
  getGameHistoryStats,
  deleteGameHistory,
  deleteAllGameHistory,
  exportGameHistoryToJson,
  formatPlayTime,
  formatGameMode,
  getGameParticipants,
  getParticipantWordResults,
  type GameHistory,
  type GameHistoryStats,
  type GameHistoryQueryOptions,
  type GameParticipant,
  type GameWordResult,
} from '../../api/gameHistory';
import { getAllCategories } from '../../api/category';
import { Category } from '../../types/database';
import { useKeyboardShortcuts } from '../../hooks';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { ROUTES } from '../../routes/constants';
import { fadeVariant, staggerContainer, staggerItem } from '../../animations/variants';

const ITEMS_PER_PAGE = 10;
const GAME_MODES = ['single', 'multi', 'team'];

export function GameHistoryScreen() {
  const navigate = useNavigate();

  // Global keyboard shortcuts (PRD Section 11.1)
  useKeyboardShortcuts();

  // State
  const [games, setGames] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState<GameHistoryStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantsMap, setParticipantsMap] = useState<Record<number, GameParticipant[]>>({});
  const [wordResultsMap, setWordResultsMap] = useState<Record<number, GameWordResult[]>>({});
  const [expandedParticipants, setExpandedParticipants] = useState<Set<string>>(new Set());

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc'>('date_desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // Modals
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
    loadCategories();
  }, [selectedCategoryId, selectedGameMode, startDate, endDate, sortBy, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query options
      const options: GameHistoryQueryOptions = {
        limit: ITEMS_PER_PAGE,
        offset: currentPage * ITEMS_PER_PAGE,
        sort_by: sortBy,
      };

      if (selectedCategoryId) options.category_id = selectedCategoryId;
      if (selectedGameMode) options.game_mode = selectedGameMode;
      if (startDate) options.start_date = startDate;
      if (endDate) options.end_date = endDate;

      const [gamesData, statsData] = await Promise.all([
        getAllGameHistory(options),
        getGameHistoryStats(),
      ]);

      setGames(gamesData);
      setStats(statsData);
      setTotalGames(statsData.total_games);

      // Load participants for each game
      const participantsData: Record<number, GameParticipant[]> = {};
      const wordResultsData: Record<number, GameWordResult[]> = {};

      for (const game of gamesData) {
        try {
          const participants = await getGameParticipants(game.id);
          participantsData[game.id] = participants;

          // Load word results for each participant
          for (const participant of participants) {
            try {
              const wordResults = await getParticipantWordResults(game.id, participant.id);
              wordResultsData[participant.id] = wordResults;
            } catch (err) {
              console.error(`Failed to load word results for participant ${participant.id}:`, err);
              wordResultsData[participant.id] = [];
            }
          }
        } catch (err) {
          console.error(`Failed to load participants for game ${game.id}:`, err);
          participantsData[game.id] = [];
        }
      }

      setParticipantsMap(participantsData);
      setWordResultsMap(wordResultsData);
    } catch (err) {
      console.error('Failed to load game history:', err);
      setError('Oyun geçmişi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Actions
  const handleDelete = async (id: number) => {
    try {
      await deleteGameHistory(id);
      setDeleteConfirmId(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete game:', err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllGameHistory();
      setShowDeleteAllConfirm(false);
      loadData();
    } catch (err) {
      console.error('Failed to delete all games:', err);
    }
  };

  const handleExport = async () => {
    try {
      // Get all games without pagination for export
      const allGames = await getAllGameHistory({});
      await exportGameHistoryToJson(allGames);
    } catch (err) {
      console.error('Failed to export games:', err);
    }
  };

  const handleViewDetail = (gameId: number) => {
    navigate(`/history/${gameId}`);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedGameMode(null);
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  // Pagination
  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Empty state
  if (
    !loading &&
    games.length === 0 &&
    !selectedCategoryId &&
    !selectedGameMode &&
    !startDate &&
    !endDate
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400">
              Oyun Geçmişi
            </h1>
          </div>

          {/* Empty state */}
          <motion.div
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-16 md:py-24"
          >
            <div className="text-9xl mb-8">📊</div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-4">
              Henüz Oyun Geçmişi Yok
            </h2>
            <p className="text-lg text-slate-400 mb-8 text-center max-w-md">
              İlk oyununuzu oynamaya başladığınızda, oyun geçmişiniz burada görünecek.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.CATEGORY_SELECT)}>
              İlk Oyunu Başlat
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400">
              Oyun Geçmişi
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowFilters(true)} title="Filtreler">
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              title="JSON Olarak İndir"
              disabled={games.length === 0}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllConfirm(true)}
              title="Tümünü Sil"
              disabled={games.length === 0}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Statistics Summary */}
        {stats && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={staggerItem}>
              <Card className="p-4 md:p-6 text-center bg-gradient-to-br from-blue-900/30 to-violet-900/30">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_games}</p>
                <p className="text-sm text-slate-400">Toplam Oyun</p>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="p-4 md:p-6 text-center bg-gradient-to-br from-green-900/30 to-emerald-900/30">
                <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {stats.most_played_category || '-'}
                </p>
                <p className="text-sm text-slate-400">En Çok Oynanan</p>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="p-4 md:p-6 text-center bg-gradient-to-br from-amber-900/30 to-yellow-900/30">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.highest_score}</p>
                <p className="text-sm text-slate-400">En Yüksek Skor</p>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="p-4 md:p-6 text-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                <Clock className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {formatPlayTime(stats.total_play_time_seconds)}
                </p>
                <p className="text-sm text-slate-400">Toplam Süre</p>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(selectedCategoryId || selectedGameMode || startDate || endDate) && (
          <Card className="p-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {selectedCategoryId && (
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                  Kategori: {categories.find((c) => c.id === selectedCategoryId)?.name}
                </span>
              )}
              {selectedGameMode && (
                <span className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-sm">
                  Mod: {formatGameMode(selectedGameMode)}
                </span>
              )}
              {startDate && (
                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">
                  Başlangıç: {new Date(startDate).toLocaleDateString('tr-TR')}
                </span>
              )}
              {endDate && (
                <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">
                  Bitiş: {new Date(endDate).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Temizle
            </Button>
          </Card>
        )}

        {/* Game List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-400">{error}</p>
          </Card>
        ) : games.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-400">Filtre kriterlerine uygun oyun bulunamadı.</p>
            <Button variant="secondary" onClick={clearFilters} className="mt-4">
              Filtreleri Temizle
            </Button>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {games.map((game) => {
              const participants = participantsMap[game.id] || [];
              const sortedParticipants = [...participants].sort((a, b) => a.rank - b.rank);

              return (
                <motion.div key={game.id} variants={staggerItem}>
                  <Card className="p-4 md:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{game.category_name}</h3>
                            <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                              {formatGameMode(game.game_mode)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(game.played_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatPlayTime(game.total_time_seconds)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewDetail(game.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detay
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirmId(game.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Participants */}
                      {participants.length > 0 && (
                        <div className="border-t border-slate-700 pt-4">
                          <div className="space-y-3">
                            {sortedParticipants.map((participant) => {
                              const participantKey = `${game.id}-${participant.id}`;
                              const isExpanded = expandedParticipants.has(participantKey);
                              const wordResults = wordResultsMap[participant.id] || [];

                              return (
                                <div
                                  key={participant.id}
                                  className={`rounded-lg overflow-hidden ${
                                    participant.rank === 1
                                      ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-600/30'
                                      : 'bg-slate-800/50 border border-slate-700'
                                  }`}
                                >
                                  {/* Participant Header - Clickable */}
                                  <button
                                    onClick={() => {
                                      setExpandedParticipants((prev) => {
                                        const newSet = new Set(prev);
                                        if (isExpanded) {
                                          newSet.delete(participantKey);
                                        } else {
                                          newSet.add(participantKey);
                                        }
                                        return newSet;
                                      });
                                    }}
                                    className="w-full p-3 text-left hover:bg-white/5 transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white">
                                          {participant.participant_name}
                                        </span>
                                        {participant.rank === 1 && (
                                          <span className="text-yellow-500 text-lg">👑</span>
                                        )}
                                      </div>
                                      <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                      </motion.div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                      <div>
                                        <span className="text-slate-400">Skor:</span>
                                        <span className="ml-1 text-white font-semibold">
                                          {participant.score}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Sıra:</span>
                                        <span className="ml-1 text-white font-semibold">
                                          #{participant.rank}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Bulunan:</span>
                                        <span className="ml-1 text-green-400 font-semibold">
                                          {participant.words_found}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Atlanan:</span>
                                        <span className="ml-1 text-orange-400 font-semibold">
                                          {participant.words_skipped}
                                        </span>
                                      </div>
                                    </div>
                                  </button>

                                  {/* Word Results - Expandable */}
                                  {isExpanded && wordResults.length > 0 && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border-t border-slate-600/50"
                                    >
                                      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                                        <h4 className="text-xs font-semibold text-slate-400 mb-2">
                                          Kelime Detayları ({wordResults.length} kelime)
                                        </h4>
                                        {wordResults.map((wordResult, idx) => (
                                          <div
                                            key={idx}
                                            className={`p-2 rounded text-xs ${
                                              wordResult.result === 'found'
                                                ? 'bg-green-900/20 border border-green-700/30'
                                                : wordResult.result === 'skipped'
                                                  ? 'bg-orange-900/20 border border-orange-700/30'
                                                  : 'bg-red-900/20 border border-red-700/30'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-semibold text-white">
                                                {wordResult.word}
                                              </span>
                                              <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                  wordResult.result === 'found'
                                                    ? 'bg-green-600/30 text-green-300'
                                                    : wordResult.result === 'skipped'
                                                      ? 'bg-orange-600/30 text-orange-300'
                                                      : 'bg-red-600/30 text-red-300'
                                                }`}
                                              >
                                                {wordResult.result === 'found'
                                                  ? '✓ Buldu'
                                                  : wordResult.result === 'skipped'
                                                    ? '→ Geçti'
                                                    : '✗ Bulamadı'}
                                              </span>
                                            </div>
                                            {wordResult.word_hint && (
                                              <p className="text-slate-400 text-xs mb-1">
                                                💡 {wordResult.word_hint}
                                              </p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs">
                                              <span className="text-slate-400">
                                                Puan:{' '}
                                                <span className="text-white font-semibold">
                                                  {wordResult.points_earned}
                                                </span>
                                              </span>
                                              <span className="text-slate-400">
                                                Harf Açılımı:{' '}
                                                <span className="text-white font-semibold">
                                                  {wordResult.letters_used}
                                                </span>
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!canGoPrev}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Önceki
              </Button>
              <span className="text-slate-400">
                Sayfa {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!canGoNext}
              >
                Sonraki
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Filter Modal */}
      <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filtreler">
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
            <select
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100"
              value={selectedCategoryId || ''}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Tümü</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Game Mode Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Oyun Modu</label>
            <select
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100"
              value={selectedGameMode || ''}
              onChange={(e) => setSelectedGameMode(e.target.value || null)}
            >
              <option value="">Tümü</option>
              {GAME_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {formatGameMode(mode)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bitiş Tarihi</label>
            <input
              type="date"
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sıralama</label>
            <select
              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2 text-slate-100"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date_desc' | 'date_asc' | 'score_desc')}
            >
              <option value="date_desc">Tarih (Yeni → Eski)</option>
              <option value="date_asc">Tarih (Eski → Yeni)</option>
              <option value="score_desc">Skor (Yüksek → Düşük)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                clearFilters();
                setShowFilters(false);
              }}
            >
              Temizle
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setCurrentPage(0);
                setShowFilters(false);
              }}
            >
              Uygula
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Oyunu Sil"
      >
        <p className="text-slate-300 mb-6">
          Bu oyun kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
            İptal
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            Sil
          </Button>
        </div>
      </Modal>

      {/* Delete All Confirm Modal */}
      <Modal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        title="Tüm Oyunları Sil"
      >
        <p className="text-slate-300 mb-6">
          Tüm oyun geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve{' '}
          <strong className="text-red-400">{stats?.total_games || 0}</strong> oyun kaydı
          silinecektir.
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setShowDeleteAllConfirm(false)}
          >
            İptal
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleDeleteAll}>
            Tümünü Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
