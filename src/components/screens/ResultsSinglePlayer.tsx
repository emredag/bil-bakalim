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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, Zap } from 'lucide-react';
import type { GameSession } from '../../types';
import { ROUTES } from '../../routes/constants';
import { saveGameToHistory, type GameSessionData } from '../../api/gameHistory';
import CelebrationHero from '../results/CelebrationHero';
import WordResultsGrid from '../results/WordResultsGrid';
import { ResultsActions } from '../results/ResultsActions';

// Global set to track saved session IDs (prevents duplicate saves in Strict Mode)
const savedSessionIds = new Set<string>();

interface ResultsSinglePlayerProps {
  session: GameSession;
  onPlayAgain?: () => void;
}

export function ResultsSinglePlayer({ session, onPlayAgain }: ResultsSinglePlayerProps) {
  const navigate = useNavigate();

  const participant = session.participants[0];
  const words = participant.words;

  // Save game to history on mount (ONCE ONLY per session)
  useEffect(() => {
    // Check if this session was already saved
    if (savedSessionIds.has(session.id)) {
      return;
    }

    // Mark as saved immediately
    savedSessionIds.add(session.id);

    const gameData: GameSessionData = {
      category_id: session.categoryId,
      category_name: session.categoryName,
      game_mode: session.mode,
      played_at: new Date().toISOString(),
      // Use participant's elapsed time, not session's (which is not updated)
      total_time_seconds: participant.elapsedTimeSeconds,
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

    saveGameToHistory(gameData)
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
  // Use participant's elapsed time, not session's (which is not updated)
  const elapsedSeconds = participant.elapsedTimeSeconds;

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        {/* Celebration Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CelebrationHero
            playerName={participant.name}
            score={participant.score}
            mode={session.mode}
            categoryEmoji={session.categoryEmoji}
            categoryName={session.categoryName}
          />
        </motion.div>

        {/* Stats Grid - Glassmorphism Design */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {/* Words Found */}
          <motion.div
            className="glass-card group cursor-default rounded-xl p-6 text-center transition-all hover:scale-102"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-3 flex justify-center">
              <Target className="h-8 w-8 text-success-400" />
            </div>
            <p className="mb-2 font-mono text-3xl font-bold tabular-nums text-success-400 md:text-4xl">
              {wordsFound}/{totalWords}
            </p>
            <p className="text-sm text-neutral-400 md:text-base">Bulunan Kelime</p>
          </motion.div>

          {/* Words Skipped */}
          <motion.div
            className="glass-card group cursor-default rounded-xl p-6 text-center transition-all hover:scale-102"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-3 flex justify-center">
              <Zap className="h-8 w-8 text-warning-400" />
            </div>
            <p className="mb-2 font-mono text-3xl font-bold tabular-nums text-warning-400 md:text-4xl">
              {wordsSkipped}
            </p>
            <p className="text-sm text-neutral-400 md:text-base">Pas Geçilen</p>
          </motion.div>

          {/* Letters Revealed */}
          <motion.div
            className="glass-card group cursor-default rounded-xl p-6 text-center transition-all hover:scale-102"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-3 flex justify-center">
              <BarChart3 className="h-8 w-8 text-primary-400" />
            </div>
            <p className="mb-2 font-mono text-3xl font-bold tabular-nums text-primary-400 md:text-4xl">
              {lettersRevealed}
            </p>
            <p className="text-sm text-neutral-400 md:text-base">Alınan Harf</p>
          </motion.div>

          {/* Elapsed Time */}
          <motion.div
            className="glass-card group cursor-default rounded-xl p-6 text-center transition-all hover:scale-102"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="mb-3 flex justify-center">
              <Clock className="h-8 w-8 text-secondary-400" />
            </div>
            <p className="mb-2 font-mono text-3xl font-bold tabular-nums text-secondary-400 md:text-4xl">
              {formatTime(elapsedSeconds)}
            </p>
            <p className="text-sm text-neutral-400 md:text-base">Geçen Süre</p>
          </motion.div>
        </motion.div>

        {/* Word Results Grid */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <WordResultsGrid words={words} />
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
