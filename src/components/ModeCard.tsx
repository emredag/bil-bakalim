/**
 * Mode Card Component - Design System v2.0
 * Task 10: Game Mode Selection
 * PRD Reference: Section 4.3 - Mode Selection
 * Migration 4: Enhanced with mode-specific theme colors
 *
 * Large visual card for game mode selection with:
 * - Mode icon and name (with colored background)
 * - Mode-specific theme color (blue/purple/amber)
 * - Description
 * - Visual requirement indicator
 * - Enabled/disabled states
 */

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

// Mode-specific theme configuration with Design System v2.0 colors
const modeConfig = {
  single: {
    icon: User,
    title: '👤 Tek Yarışmacı',
    description: 'Tek kişi oynar, 14 kelime ile yarışır, süre tutulur ve puan hesaplanır.',
    baseRequirement: 14,
    color: '#0ea5e9', // primary-500 (vibrant blue)
    colorName: 'primary',
  },
  multi: {
    icon: Users,
    title: '👥 Çoklu Yarışmacı',
    description:
      'Sırayla oynarlar. Her yarışmacıya farklı 14 kelime verilir. Puan sıralaması yapılır.',
    baseRequirement: 14, // per player
    color: '#a855f7', // secondary-500 (purple)
    colorName: 'secondary',
  },
  team: {
    icon: Trophy,
    title: '🏆 Takım Yarışması',
    description:
      'Takımlar sırayla oynar. Her takıma farklı 14 kelime verilir. Takım puanları toplanır.',
    baseRequirement: 14, // per team
    color: '#f59e0b', // accent-500 (amber)
    colorName: 'accent',
  },
};

/**
 * ModeCard - Large visual card for game mode selection
 * Design System v2.0: Mode-specific colors and enhanced visual identity
 *
 * Features:
 * - Large size and prominent display (TV-friendly)
 * - Icon + title + description with mode-specific colors
 * - Visual requirement indicator
 * - Enabled/disabled states (dimmed when disabled)
 * - Tooltip explaining requirements when disabled
 * - Hover animation and glow effects
 * - WCAG AA compliant (contrast, focus states, keyboard support)
 */
export function ModeCard({
  mode,
  enabled,
  requiredWords,
  availableWords,
  onSelect,
}: ModeCardProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;
  const themeColor = config.color;

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

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
        ${
          enabled
            ? 'cursor-pointer border-neutral-600 hover:ring-2'
            : 'opacity-50 cursor-not-allowed border-neutral-700/50'
        }
      `}
      style={
        enabled
          ? {
              borderColor: hexToRgba(themeColor, 0.3),
              boxShadow: `0 0 0 0 ${hexToRgba(themeColor, 0)}`,
            }
          : undefined
      }
      onMouseEnter={(e: any) => {
        if (enabled) {
          e.currentTarget.style.boxShadow = `0 0 30px ${hexToRgba(themeColor, 0.3)}`;
          e.currentTarget.style.borderColor = hexToRgba(themeColor, 0.6);
        }
      }}
      onMouseLeave={(e: any) => {
        if (enabled) {
          e.currentTarget.style.boxShadow = `0 0 0 0 ${hexToRgba(themeColor, 0)}`;
          e.currentTarget.style.borderColor = hexToRgba(themeColor, 0.3);
        }
      }}
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
          <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-warning-400" />
        </div>
      )}

      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <div
          className="p-3 md:p-4 rounded-xl transition-all duration-300"
          style={
            enabled
              ? {
                  backgroundColor: hexToRgba(themeColor, 0.15),
                  color: themeColor,
                  border: `1px solid ${hexToRgba(themeColor, 0.3)}`,
                }
              : {
                  backgroundColor: 'rgba(115, 115, 115, 0.2)',
                  color: '#737373',
                  border: '1px solid rgba(115, 115, 115, 0.3)',
                }
          }
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-50">
          {config.title}
        </h3>
      </div>

      {/* Description */}
      <p
        className={`
        text-base md:text-lg lg:text-xl mb-4 md:mb-6 leading-relaxed
        ${enabled ? 'text-neutral-300' : 'text-neutral-500'}
      `}
      >
        {config.description}
      </p>

      {/* Requirement Badge */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-700">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-medium"
          style={
            enabled
              ? {
                  backgroundColor: hexToRgba(themeColor, 0.15),
                  color: themeColor,
                  border: `1px solid ${hexToRgba(themeColor, 0.3)}`,
                }
              : {
                  backgroundColor: 'rgba(115, 115, 115, 0.2)',
                  color: '#a3a3a3',
                  border: '1px solid rgba(115, 115, 115, 0.3)',
                }
          }
        >
          <span>Gerekli:</span>
          <span className="font-bold tabular-nums">{requiredWords} kelime</span>
        </div>

        {/* Available/Not Available indicator */}
        <div
          className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${enabled ? 'bg-success-500/20 text-success-400 border border-success-500/30' : 'bg-error-500/20 text-error-400 border border-error-500/30'}
        `}
        >
          {enabled ? '✓ Kullanılabilir' : '✗ Yetersiz Kelime'}
        </div>
      </div>

      {/* Focus ring for accessibility */}
      {enabled && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-transparent focus-within:ring-opacity-100 transition-all duration-200"
          style={{ '--tw-ring-color': themeColor } as any}
        />
      )}
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
