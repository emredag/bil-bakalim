/**
 * Mode Card Component
 * Task 10: Game Mode Selection
 * PRD Reference: Section 4.3 - Mode Selection
 * Design Reference: ui-ux-design.md#game-mode-selection
 *
 * Large visual card for game mode selection with:
 * - Mode icon and name
 * - Description
 * - Word requirement label
 * - Enabled/disabled states based on category word count
 */

import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Tooltip } from './ui/Tooltip';
import { User, Users, Trophy, AlertCircle } from 'lucide-react';
import type { GameMode } from '../types';

export interface ModeCardProps {
  mode: GameMode;
  enabled: boolean;
  requiredWords: number;
  availableWords: number;
  onSelect: () => void;
}

const modeConfig = {
  single: {
    icon: User,
    title: '👤 Tek Yarışmacı',
    description: 'Tek kişi oynar, 14 kelime ile yarışır, süre tutulur ve puan hesaplanır.',
    baseRequirement: 14,
  },
  multi: {
    icon: Users,
    title: '👥 Çoklu Yarışmacı',
    description: 'Sırayla oynarlar. Her yarışmacıya farklı 14 kelime verilir. Puan sıralaması yapılır.',
    baseRequirement: 14, // per player
  },
  team: {
    icon: Trophy,
    title: '🏆 Takım Yarışması',
    description: 'Takımlar sırayla oynar. Her takıma farklı 14 kelime verilir. Takım puanları toplanır.',
    baseRequirement: 14, // per team
  },
};

/**
 * ModeCard - Large visual card for game mode selection
 *
 * Features:
 * - Large size and prominent display (TV-friendly)
 * - Icon + title + description
 * - Word requirement badge
 * - Enabled/disabled states (dimmed when disabled)
 * - Tooltip explaining requirements when disabled
 * - Hover animation when enabled
 * - WCAG AA compliant (contrast, focus states, keyboard support)
 */
export function ModeCard({ mode, enabled, requiredWords, availableWords, onSelect }: ModeCardProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  // Warning message for disabled modes
  const warningMessage = `Bu mod için en az ${requiredWords} kelime gerekli. Mevcut: ${availableWords} kelime.`;

  // Card content
  const cardContent = (
    <Card
      variant="gradient"
      hoverable={enabled}
      onClick={enabled ? onSelect : undefined}
      className={`
        relative overflow-hidden
        transition-all duration-300
        ${enabled
          ? 'cursor-pointer border-slate-600 hover:border-blue-500/50 hover:ring-2 hover:ring-blue-500/20'
          : 'opacity-60 cursor-not-allowed border-slate-700/50'
        }
      `}
      role="button"
      tabIndex={enabled ? 0 : -1}
      aria-disabled={!enabled}
      aria-label={`${config.title} - ${enabled ? 'Kullanılabilir' : 'Kullanılamıyor'}`}
      onKeyDown={(e) => {
        if (enabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Disabled overlay with warning icon */}
      {!enabled && (
        <div className="absolute top-4 right-4 z-10">
          <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
        </div>
      )}

      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <div className={`
          p-3 md:p-4 rounded-xl
          ${enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}
          transition-colors duration-300
        `}>
          <Icon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          {config.title}
        </h3>
      </div>

      {/* Description */}
      <p className={`
        text-base md:text-lg lg:text-xl mb-4 md:mb-6
        ${enabled ? 'text-slate-300' : 'text-slate-500'}
        leading-relaxed
      `}>
        {config.description}
      </p>

      {/* Requirement Badge */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700">
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-medium
          ${enabled
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
          }
        `}>
          <span>Gerekli:</span>
          <span className="font-bold">{requiredWords} kelime</span>
        </div>

        {/* Available/Not Available indicator */}
        <div className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${enabled
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
          }
        `}>
          {enabled ? '✓ Kullanılabilir' : '✗ Yetersiz Kelime'}
        </div>
      </div>

      {/* Focus ring for accessibility */}
      <div className={`
        absolute inset-0 rounded-2xl pointer-events-none
        ${enabled ? 'ring-2 ring-transparent focus-within:ring-blue-500' : ''}
        transition-all duration-200
      `} />
    </Card>
  );

  // Wrap with tooltip if disabled
  if (!enabled) {
    return (
      <Tooltip content={warningMessage} position="top">
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
}
