/**
 * QuickStats Component
 * Design System v2.0 - Main Menu Migration
 *
 * Displays 3 key statistics cards with glassmorphism styling
 */

import { motion } from 'framer-motion';
import { BarChart3, Trophy, Clock } from 'lucide-react';
import { GameHistoryStats } from '../../types/database';

export interface QuickStatsProps {
  stats: GameHistoryStats | null;
  loading?: boolean;
}

/**
 * Stagger animation for stats container
 */
const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Individual stat card animation
 */
const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Format time from seconds to readable format
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}s ${minutes}d`;
  }
  return `${minutes} dakika`;
}

/**
 * Format date to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function QuickStats({ stats, loading }: QuickStatsProps) {
  if (loading) {
    return (
      <section className="quick-stats" aria-label="İstatistikler">
        <h2 className="text-2xl font-bold text-white mb-6">Hızlı İstatistikler</h2>
        <div className="stats-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-6 bg-neutral-700 rounded mb-3" />
              <div className="h-8 bg-neutral-700 rounded mb-2" />
              <div className="h-4 bg-neutral-700 rounded w-24" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Default values if no stats
  const totalGames = stats?.totalGames ?? 0;
  const highScore = stats?.highScore;
  const totalTime = stats?.totalTime ?? 0;

  return (
    <section className="quick-stats" aria-label="İstatistikler">
      <h2 className="text-2xl font-bold text-white mb-6">Hızlı İstatistikler</h2>

      <motion.div
        className="stats-grid"
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Games Card */}
        <StatCard
          icon={BarChart3}
          label="Toplam Oyun"
          value={totalGames.toString()}
          subtitle={stats?.totalGames ? `${stats.totalGames} oyun oynandı` : 'Henüz oyun yok'}
          variants={statCardVariants}
        />

        {/* High Score Card */}
        <StatCard
          icon={Trophy}
          label="En Yüksek Skor"
          value={highScore ? highScore.score.toLocaleString('tr-TR') : '0'}
          subtitle={highScore ? `${highScore.player} • ${formatDate(highScore.date)}` : 'Henüz skor yok'}
          variants={statCardVariants}
        />

        {/* Total Time Card */}
        <StatCard
          icon={Clock}
          label="Toplam Süre"
          value={formatTime(totalTime)}
          subtitle="tüm oyunlar"
          variants={statCardVariants}
        />
      </motion.div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  variants: any;
}

function StatCard({ icon: Icon, label, value, subtitle, trend, variants }: StatCardProps) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:bg-neutral-700/80 hover:-translate-y-1 hover:shadow-xl"
      variants={variants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <Icon size={24} className="stat-icon text-primary-400 opacity-80" />

      {/* Value */}
      <div className="stat-value text-3xl font-bold text-primary-400 font-mono tabular-nums">
        {value}
      </div>

      {/* Label */}
      <div className="stat-label text-sm font-medium text-neutral-400 uppercase tracking-wider">
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs text-neutral-500">
          {subtitle}
        </div>
      )}

      {/* Trend (optional) */}
      {trend && (
        <div className="text-xs text-success-400 font-semibold">
          {trend}
        </div>
      )}
    </motion.div>
  );
}
