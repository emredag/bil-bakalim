import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { TeamChip } from '../ui/TeamChip';
import type { ActiveParticipant } from '../../types/game';

interface PodiumDisplayProps {
  rankings: (ActiveParticipant & { rank: number })[];
  mode?: 'multi' | 'team';
}

/**
 * 3D Podium Display for Multiplayer/Team Results
 */
export default function PodiumDisplay({ rankings, mode = 'multi' }: PodiumDisplayProps) {
  const [first, second, third] = rankings.slice(0, 3);

  if (!first) {
    return null; // No rankings to display
  }

  return (
    <div className="podium-container py-12 px-4">
      <div className="podium-platforms mx-auto flex max-w-4xl items-end justify-center gap-8">
        {/* Second Place (Left) */}
        {second && (
          <motion.div
            className="podium-platform flex flex-col items-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{ order: 1 }}
          >
            {/* Player/Team Info */}
            <div className="podium-player mb-4 text-center">
              {mode === 'multi' ? (
                <Avatar name={second.name} size="md" className="mx-auto mb-2" />
              ) : (
                <div className="mb-2 flex justify-center">
                  <TeamChip
                    name={second.name}
                    emoji={(second as any).emoji || '👥'}
                    color={(second as any).color || '#3b82f6'}
                    size="md"
                  />
                </div>
              )}
              <div className="player-name mb-1 font-semibold text-neutral-200">
                {mode === 'multi' ? second.name : ''}
              </div>
              <div className="player-score font-mono text-2xl font-bold text-neutral-100">
                {second.score.toLocaleString('tr-TR')}
              </div>
            </div>

            {/* Platform */}
            <div
              className="podium-base flex h-36 w-40 items-center justify-center rounded-t-lg text-xl font-bold text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #d4d4d4, #a3a3a3)',
              }}
            >
              🥈 2.
            </div>
          </motion.div>
        )}

        {/* First Place (Center, Tallest) */}
        {first && (
          <motion.div
            className="podium-platform flex flex-col items-center"
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            style={{ order: 2 }}
          >
            {/* Crown */}
            <motion.div
              className="crown mb-2 text-5xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              👑
            </motion.div>

            {/* Player/Team Info */}
            <div className="podium-player mb-4 text-center">
              {mode === 'multi' ? (
                <Avatar name={first.name} size="lg" className="mx-auto mb-2" />
              ) : (
                <div className="mb-2 flex justify-center">
                  <TeamChip
                    name={first.name}
                    emoji={(first as any).emoji || '🏆'}
                    color={(first as any).color || '#f59e0b'}
                    size="lg"
                  />
                </div>
              )}
              <div className="player-name mb-1 text-lg font-bold text-neutral-50">
                {mode === 'multi' ? first.name : ''}
              </div>
              <div className="player-score font-mono text-3xl font-bold text-accent-400">
                {first.score.toLocaleString('tr-TR')}
              </div>
            </div>

            {/* Platform */}
            <div
              className="podium-base flex h-48 w-44 items-center justify-center rounded-t-lg text-2xl font-bold text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              }}
            >
              🥇 1.
            </div>
          </motion.div>
        )}

        {/* Third Place (Right) */}
        {third && (
          <motion.div
            className="podium-platform flex flex-col items-center"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ order: 3 }}
          >
            {/* Player/Team Info */}
            <div className="podium-player mb-4 text-center">
              {mode === 'multi' ? (
                <Avatar name={third.name} size="md" className="mx-auto mb-2" />
              ) : (
                <div className="mb-2 flex justify-center">
                  <TeamChip
                    name={third.name}
                    emoji={(third as any).emoji || '👥'}
                    color={(third as any).color || '#a855f7'}
                    size="md"
                  />
                </div>
              )}
              <div className="player-name mb-1 font-semibold text-neutral-200">
                {mode === 'multi' ? third.name : ''}
              </div>
              <div className="player-score font-mono text-2xl font-bold text-neutral-100">
                {third.score.toLocaleString('tr-TR')}
              </div>
            </div>

            {/* Platform */}
            <div
              className="podium-base flex h-28 w-36 items-center justify-center rounded-t-lg text-xl font-bold text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
              }}
            >
              🥉 3.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
