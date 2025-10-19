/**
 * MuteToggle Component
 * PRD Section 10.1 - Sound System
 *
 * Toggle button for muting/unmuting all sounds
 *
 * Features:
 * - Visual feedback (icon changes)
 * - Tooltip hint
 * - Keyboard accessible
 * - Button variant support
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

export interface MuteToggleProps {
  /** Whether sound is muted */
  muted: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show tooltip */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mute/Unmute Toggle Button
 *
 * Usage:
 * ```tsx
 * const { muted, toggleMute } = useSound();
 *
 * <MuteToggle
 *   muted={muted}
 *   onToggle={toggleMute}
 *   showTooltip
 * />
 * ```
 */
export const MuteToggle: React.FC<MuteToggleProps> = ({
  muted,
  onToggle,
  size = 'md',
  showTooltip = true,
  className = '',
}) => {
  const icon = muted ? (
    <VolumeX className="w-5 h-5" />
  ) : (
    <Volume2 className="w-5 h-5" />
  );

  const tooltipText = muted ? 'Unmute sounds' : 'Mute sounds';

  const button = (
    <Button
      variant={muted ? 'destructive' : 'secondary'}
      size={size}
      icon={icon}
      onClick={onToggle}
      className={className}
      aria-label={tooltipText}
      aria-pressed={muted}
    >
      {muted ? 'Muted' : 'Sound On'}
    </Button>
  );

  if (showTooltip) {
    return (
      <Tooltip content={tooltipText} position="bottom">
        {button}
      </Tooltip>
    );
  }

  return button;
};

MuteToggle.displayName = 'MuteToggle';

/**
 * Compact mute toggle (icon only)
 */
export interface MuteToggleIconProps {
  /** Whether sound is muted */
  muted: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Icon size */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

export const MuteToggleIcon: React.FC<MuteToggleIconProps> = ({
  muted,
  onToggle,
  size = 24,
  className = '',
}) => {
  const Icon = muted ? VolumeX : Volume2;

  return (
    <button
      onClick={onToggle}
      className={`
        touch-target
        p-2 rounded-lg
        transition-all duration-200
        hover:bg-slate-700
        focus-visible:ring-2 focus-visible:ring-accent-primary
        ${muted ? 'text-red-500' : 'text-text-secondary'}
        ${className}
      `}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      aria-pressed={muted}
    >
      <Icon size={size} />
    </button>
  );
};

MuteToggleIcon.displayName = 'MuteToggleIcon';
