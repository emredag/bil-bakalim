/**
 * Turn Transition Screen
 * Shows between participant turns in multi/team modes
 * Host manually triggers start of next participant's turn
 */

import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export const TurnTransition = () => {
  const { session, nextParticipant: startNextTurn } = useGameStore();

  if (!session || session.state !== 'waiting_next_turn') {
    return null;
  }

  const currentIndex = session.activeParticipantIndex;
  const nextIndex = (currentIndex + 1) % session.participants.length;
  const completedParticipant = session.participants[currentIndex];
  const upcomingParticipant = session.participants[nextIndex];

  const handleStartNextTurn = () => {
    startNextTurn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Completed Participant Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {completedParticipant.name} Turunu Tamamladı!
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold text-yellow-400">{completedParticipant.score}</div>
              <div className="text-sm text-white/70 mt-1">Puan</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold text-green-400">
                {completedParticipant.wordsFound}
              </div>
              <div className="text-sm text-white/70 mt-1">Bulunan</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold text-blue-400">
                {Math.floor(completedParticipant.elapsedTimeSeconds / 60)}:
                {String(completedParticipant.elapsedTimeSeconds % 60).padStart(2, '0')}
              </div>
              <div className="text-sm text-white/70 mt-1">Süre</div>
            </div>
          </div>
        </motion.div>

        {/* Next Participant Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-white mb-2">Sırada</h3>
          <div className="text-5xl font-bold text-white mb-6">{upcomingParticipant.name}</div>
          <div className="bg-white/10 rounded-xl p-4 inline-block">
            <div className="text-lg text-white/90">
              <span className="font-bold text-yellow-400">14 Kelime</span>
              {' • '}
              <span className="font-bold text-blue-400">5 Dakika</span>
            </div>
          </div>
        </motion.div>

        {/* Host Control Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleStartNextTurn}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-2xl py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">▶️</span>
            <span>Başlat</span>
          </div>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/60 text-sm"
        >
          Sunucu bu butona basarak sıradaki yarışmacının turunu başlatır
        </motion.p>
      </motion.div>
    </div>
  );
};
