/**
 * QuickActions Component
 * Design System v2.0 - Main Menu Migration
 *
 * Displays 4 secondary action cards for quick navigation
 */

import { motion } from 'framer-motion';
import { BookOpen, History, Settings, Info, LucideIcon } from 'lucide-react';

export interface QuickActionsProps {
  onNavigate: (route: string) => void;
}

/**
 * Stagger animation for actions container
 */
const actionsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
};

/**
 * Individual action card animation - subtle fade + rise
 */
const actionCardVariants = {
  hidden: { opacity: 0, y: 8 },
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
  route: string;
}

const actions: Action[] = [
  {
    icon: BookOpen,
    title: 'Kategori Yönetimi',
    description: 'Kategorileri düzenle',
    route: '/category-management',
  },
  {
    icon: History,
    title: 'Geçmiş Yarışmalar',
    description: 'Önceki oyunları gör',
    route: '/history',
  },
  {
    icon: Settings,
    title: 'Ayarlar',
    description: 'Uygulamayı yapılandır',
    route: '/settings',
  },
  {
    icon: Info,
    title: 'Nasıl Oynanır?',
    description: 'Kuralları öğren',
    route: '/how-to-play',
  },
];

export function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <section className="quick-actions" aria-label="Hızlı Erişim">
      <h2 className="text-2xl font-bold text-white mb-6">Hızlı Erişim</h2>

      <motion.div
        className="actions-grid"
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
            onClick={() => onNavigate(action.route)}
            variants={actionCardVariants}
          />
        ))}
      </motion.div>
    </section>
  );
}

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variants: any;
}

function ActionCard({ icon: Icon, title, description, onClick, variants }: ActionCardProps) {
  return (
    <motion.button
      className="glass-card-subtle rounded-xl p-5 flex flex-col items-center text-center gap-3 min-h-[140px] cursor-pointer transition-all duration-200 hover:bg-neutral-700/60 hover:border-neutral-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      variants={variants}
      onClick={onClick}
    >
      {/* Icon */}
      <Icon
        size={32}
        className="text-primary-400 opacity-80 transition-all duration-200"
      />

      {/* Title */}
      <div className="text-base font-semibold text-white">
        {title}
      </div>

      {/* Description */}
      <div className="text-xs text-neutral-500">
        {description}
      </div>
    </motion.button>
  );
}
