import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameWord } from '../../types/game';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface WordResultsGridProps {
  words: GameWord[];
}

/**
 * Word Details Modal Component
 */
function WordDetailsModal({ word, onClose }: { word: GameWord; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="">
      <div className="p-6">
        {/* Word Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 font-mono text-3xl font-bold text-neutral-50">{word.word}</h2>
          <p className="text-sm text-neutral-400">{word.letterCount} harf</p>
        </div>

        {/* Hint */}
        <div className="mb-6 rounded-lg bg-neutral-800/50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            💡 İpucu
          </p>
          <p className="text-base text-neutral-200">{word.hint}</p>
        </div>

        {/* Letters Grid */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Harfler
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {word.letters.map((letter, index) => (
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-xl font-bold ${
                  letter.status === 'revealed'
                    ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-500'
                }`}
              >
                {letter.status === 'revealed' ? letter.char : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
            <p className="mb-1 text-xs text-neutral-400">Açılan Harf</p>
            <p className="font-mono text-2xl font-bold text-neutral-50">{word.lettersRevealed}</p>
          </div>
          <div className="rounded-lg bg-neutral-800/50 p-3 text-center">
            <p className="mb-1 text-xs text-neutral-400">Kazanılan Puan</p>
            <p className="font-mono text-2xl font-bold text-accent-400">{word.pointsEarned}</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Word Results Grid - Grid layout to replace accordion
 */
export default function WordResultsGrid({ words }: WordResultsGridProps) {
  const [selectedWord, setSelectedWord] = useState<GameWord | null>(null);

  return (
    <div className="word-results-section">
      <h2 className="mb-6 text-2xl font-bold text-neutral-50 md:text-3xl">📝 Kelime Detayları</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {words.map((word, index) => {
          const statusIcon =
            word.result === 'found' ? '✅' : word.result === 'skipped' ? '⏭️' : '⏰';

          // Status-based styling
          let borderColor = 'border-neutral-700';
          let bgColor = 'bg-neutral-800/30';
          let opacity = 'opacity-100';

          if (word.result === 'found') {
            borderColor = 'border-success-500';
            bgColor = 'bg-success-500/10';
          } else if (word.result === 'skipped') {
            borderColor = 'border-neutral-600';
            bgColor = 'bg-neutral-700/10';
            opacity = 'opacity-60';
          } else if (word.result === 'timeout') {
            borderColor = 'border-error-500';
            bgColor = 'bg-error-500/10';
            opacity = 'opacity-60';
          }

          return (
            <motion.button
              key={index}
              className={`${borderColor} ${bgColor} ${opacity} group relative rounded-xl border-2 p-4 text-center transition-all hover:scale-105 hover:border-opacity-100 hover:bg-opacity-20`}
              onClick={() => setSelectedWord(word)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Result Icon */}
              <div className="mb-2 text-2xl">{statusIcon}</div>

              {/* Word */}
              <div className="mb-2 font-mono text-lg font-bold text-neutral-50">{word.word}</div>

              {/* Points */}
              <div className="font-mono text-sm font-semibold text-accent-400">
                {word.pointsEarned > 0 ? `+${word.pointsEarned}` : '0'}
              </div>

              {/* Hover indicator */}
              <div className="mt-2 text-xs text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100">
                Detaylar için tıkla
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Word Details Modal */}
      <AnimatePresence>
        {selectedWord && (
          <WordDetailsModal word={selectedWord} onClose={() => setSelectedWord(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
