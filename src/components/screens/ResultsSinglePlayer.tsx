/**
 * Results Screen - Single Player
 * PRD Reference: Section 4.7 - Results Screen (Single Player)
 * UI/UX Reference: docs/ui-ux-design.md#results
 *
 * Features:
 * - 🎉 Celebration title
 * - Category info
 * - Player name
 * - Large total score
 * - Stats: words found, letters revealed, time elapsed, avg time/word
 * - Expandable word list (accordion)
 * - Action buttons: Home, Play Again, View History
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Home, RefreshCw, History } from 'lucide-react';
import type { GameSession } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ROUTES } from '../../routes/constants';
import { fadeVariant, pageTransition } from '../../animations/variants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';

// Global set to track saved session IDs (prevents duplicate saves in Strict Mode)
const savedSessionIds = new Set<string>();

interface ResultsSinglePlayerProps {
  session: GameSession;
  onPlayAgain?: () => void;
}

export function ResultsSinglePlayer({ session, onPlayAgain }: ResultsSinglePlayerProps) {
  const navigate = useNavigate();
  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());

  const participant = session.participants[0];
  const words = participant.words;

  // Save game to history on mount (ONCE ONLY per session)
  useEffect(() => {
    // Check if this session was already saved
    if (savedSessionIds.has(session.id)) {
      console.log('⏭️ Session already saved, skipping:', session.id);
      return;
    }
    
    // Mark as saved immediately
    savedSessionIds.add(session.id);

    console.log('🎮 Saving game to history...');
    console.log('Session:', session);

    const gameData: GameSessionData = {
      category_id: session.categoryId,
      category_name: session.categoryName,
      game_mode: session.mode,
      played_at: new Date().toISOString(),
      total_time_seconds: session.elapsedTimeSeconds,
      participants: [
        {
          name: participant.name,
          participant_type: participant.type,
          score: participant.score,
          words_found: participant.wordsFound,
          words_skipped: participant.wordsSkipped,
          letters_revealed: participant.lettersRevealed,
          rank: 1,
          word_results: participant.words.map((word) => ({
            word: word.word,
            word_hint: word.hint,
            result: word.result || 'skipped',
            points_earned: word.pointsEarned,
            letters_used: word.lettersRevealed,
          })),
        },
      ],
    };

    console.log('Game data to save:', gameData);

    saveGameToHistory(gameData)
      .then((gameId) => {
        console.log('✅ Game saved successfully! ID:', gameId);
      })
      .catch((err) => {
        console.error('❌ Failed to save game to history:', err);
        // Remove from set on error so it can be retried
        savedSessionIds.delete(session.id);
      });
  }, []); // Empty dependency array - run ONCE

  // Calculate stats
  const totalWords = words.length;
  const wordsFound = participant.wordsFound;
  const wordsSkipped = participant.wordsSkipped;
  const lettersRevealed = participant.lettersRevealed;
  const elapsedSeconds = session.elapsedTimeSeconds;
  const avgTimePerWord = totalWords > 0 ? elapsedSeconds / totalWords : 0;

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle word expansion
  const toggleWord = (index: number) => {
    setExpandedWords((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Expand all
  const expandAll = () => {
    setExpandedWords(new Set(words.map((_, i) => i)));
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedWords(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header - Celebration */}
        <motion.div
          variants={fadeVariant}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-4">
            🎉 Tebrikler!
          </h1>
          <p className="text-xl md:text-2xl text-slate-300">
            {session.categoryEmoji} {session.categoryName}
          </p>
          <p className="text-lg md:text-xl text-slate-400 mt-2">
            {participant.name}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div variants={pageTransition} initial="initial" animate="animate">
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-blue-900/30 to-violet-900/30 border-2 border-amber-400/50">
            <p className="text-lg md:text-xl text-slate-400 mb-2">Toplam Puan</p>
            <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-amber-400 tabular-nums">
              {participant.score}
            </p>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Words Found */}
          <Card className="p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2 tabular-nums">
              {wordsFound}/{totalWords}
            </p>
            <p className="text-sm md:text-base text-slate-400">Bulunan Kelime</p>
          </Card>

          {/* Words Skipped */}
          <Card className="p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 tabular-nums">
              {wordsSkipped}
            </p>
            <p className="text-sm md:text-base text-slate-400">Pas Geçilen</p>
          </Card>

          {/* Letters Revealed */}
          <Card className="p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 tabular-nums">
              {lettersRevealed}
            </p>
            <p className="text-sm md:text-base text-slate-400">Alınan Harf</p>
          </Card>

          {/* Elapsed Time */}
          <Card className="p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-violet-400 mb-2 tabular-nums">
              {formatTime(elapsedSeconds)}
            </p>
            <p className="text-sm md:text-base text-slate-400">Geçen Süre</p>
          </Card>
        </motion.div>

        {/* Average Time Per Word */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-blue-300 mb-2 tabular-nums">
              {formatTime(avgTimePerWord)} / kelime
            </p>
            <p className="text-sm md:text-base text-slate-400">Ortalama Süre</p>
          </Card>
        </motion.div>

        {/* Word List - Expandable */}
        <motion.div
          variants={pageTransition}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 md:p-8">
            {/* Header with Expand/Collapse buttons */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                📝 Kelime Detayları
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={expandAll}
                  className="text-xs md:text-sm"
                >
                  Tümünü Aç
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={collapseAll}
                  className="text-xs md:text-sm"
                >
                  Tümünü Kapat
                </Button>
              </div>
            </div>

            {/* Word Accordion List */}
            <div className="space-y-3">
              {words.map((word, index) => {
                const isExpanded = expandedWords.has(index);
                const statusIcon = word.result === 'found' ? '✅' : word.result === 'skipped' ? '⏭' : '⏱️';
                const statusText = word.result === 'found' ? 'Bulundu' : word.result === 'skipped' ? 'Pas' : 'Süre Doldu';
                const statusColor = word.result === 'found' ? 'text-emerald-400' : word.result === 'skipped' ? 'text-amber-400' : 'text-red-400';

                return (
                  <div
                    key={index}
                    className="bg-slate-700/50 rounded-lg overflow-hidden"
                  >
                    {/* Word Header - Clickable */}
                    <button
                      onClick={() => toggleWord(index)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl md:text-2xl font-mono font-bold text-white">
                          {index + 1}.
                        </span>
                        <div className="text-left">
                          <p className="text-lg md:text-xl font-bold text-white">
                            {word.word} <span className="text-slate-400 text-sm">({word.letterCount} harf)</span>
                          </p>
                          <p className={`text-sm md:text-base font-medium ${statusColor}`}>
                            {statusIcon} {statusText} | {word.pointsEarned} puan
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      </motion.div>
                    </button>

                    {/* Word Details - Expandable */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-slate-600/50 space-y-3">
                        {/* Hint */}
                        <div>
                          <p className="text-sm text-slate-400 mb-1">İpucu:</p>
                          <p className="text-base md:text-lg text-slate-300">{word.hint}</p>
                        </div>

                        {/* Letters Revealed */}
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Kullanılan Harf:</p>
                          <p className="text-base md:text-lg text-blue-300 font-semibold">
                            {word.lettersRevealed} harf
                          </p>
                        </div>

                        {/* Letter Grid */}
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Harfler:</p>
                          <div className="flex flex-wrap gap-2">
                            {word.letters.map((letter, letterIndex) => (
                              <div
                                key={letterIndex}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold ${
                                  letter.status === 'revealed'
                                    ? 'bg-blue-500/30 text-white border-2 border-blue-400'
                                    : 'bg-slate-600/30 text-slate-500'
                                }`}
                              >
                                {letter.status === 'revealed' ? letter.char : '•'}
                              </div>
                            ))}
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
          transition={{ delay: 0.4 }}
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
