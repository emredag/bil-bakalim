/**
 * ResultsActions Component
 * Design System v2.0 - Results Screens Migration
 *
 * Modern action buttons with glassmorphism design
 */

import { motion } from 'framer-motion';
import { Home, RefreshCw, History, LucideIcon } from 'lucide-react';

export interface ResultsActionsProps {
  onHome: () => void;
  onPlayAgain: () => void;
  onHistory: () => void;
}

/**
 * Stagger animation for actions container
 */
const actionsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual action card animation
 */
const actionCardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

interface Action {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

export function ResultsActions({ onHome, onPlayAgain, onHistory }: ResultsActionsProps) {
  const actions: Action[] = [
    {
      icon: Home,
      title: 'Ana Menü',
      description: 'Başlangıç ekranına dön',
      onClick: onHome,
      variant: 'default',
    },
    {
      icon: RefreshCw,
      title: 'Tekrar Oyna',
      description: 'Yeni bir oyun başlat',
      onClick: onPlayAgain,
      variant: 'primary',
    },
    {
      icon: History,
      title: 'Geçmiş Yarışmalar',
      description: 'Önceki oyunları gör',
      onClick: onHistory,
      variant: 'default',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      variants={actionsContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          icon={action.icon}
          title={action.title}
          description={action.description}
          onClick={action.onClick}
          variant={action.variant}
          variants={actionCardVariants}
        />
      ))}
    </motion.div>
  );
}

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
  variants: any;
}

function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  variant = 'default',
  variants,
}: ActionCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={`
        glass-card rounded-xl p-6 flex flex-col items-center text-center gap-3 min-h-[120px]
        cursor-pointer transition-all duration-200
        ${
          isPrimary
            ? 'border-primary-500/50 bg-gradient-to-br from-primary-900/30 to-primary-800/20 hover:from-primary-800/40 hover:to-primary-700/30'
            : 'hover:bg-neutral-700/60 hover:border-neutral-600/50'
        }
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
      `}
      variants={variants}
      onClick={onClick}
    >
      {/* Icon */}
      <Icon
        size={36}
        className={`transition-all duration-200 ${
          isPrimary ? 'text-primary-400' : 'text-neutral-300'
        }`}
      />

      {/* Title */}
      <div
        className={`text-lg font-semibold ${isPrimary ? 'text-primary-50' : 'text-neutral-50'}`}
      >
        {title}
      </div>

      {/* Description */}
      <div className="text-xs text-neutral-400">{description}</div>
    </motion.button>
  );
}
