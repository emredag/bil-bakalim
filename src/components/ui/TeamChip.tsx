import React from 'react';

export interface TeamChipProps {
  name: string;
  color?: string;
  emoji?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  score?: number;
  showScore?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * TeamChip Component - ui-ux-design.md
 *
 * TV Show Quality team identifier chip.
 *
 * Features:
 * - Color/emoji team identity
 * - Rounded-full styling
 * - Multiple sizes
 * - Active state
 * - Optional score display
 * - Clickable
 */
export const TeamChip: React.FC<TeamChipProps> = ({
  name,
  color = '#3b82f6',
  emoji,
  size = 'md',
  active = false,
  score,
  showScore = false,
  onClick,
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-5 py-2.5 text-lg gap-2.5',
  };

  // Emoji size
  const emojiSizeStyles = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  // Convert hex color to RGB for background opacity
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '59, 130, 246'; // Default to blue-500

    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  };

  const rgbColor = hexToRgb(color);

  return (
    <div
      className={`
        inline-flex items-center justify-center
        rounded-full font-semibold
        transition-all duration-200
        ${sizeStyles[size]}
        ${onClick ? 'cursor-pointer hover:scale-102' : ''}
        ${active ? 'ring-2 ring-offset-2 ring-offset-background-primary' : ''}
        ${className}
      `}
      style={{
        backgroundColor: `rgba(${rgbColor}, 0.2)`,
        borderColor: color,
        borderWidth: '2px',
        color: color,
        ...(active && { ringColor: color }),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Emoji */}
      {emoji && (
        <span className={emojiSizeStyles[size]} role="img" aria-label="team icon">
          {emoji}
        </span>
      )}

      {/* Team name */}
      <span>{name}</span>

      {/* Score badge */}
      {showScore && score !== undefined && (
        <span
          className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold tabular-nums"
          style={{
            backgroundColor: color,
            color: 'white',
          }}
        >
          {score}
        </span>
      )}
    </div>
  );
};

TeamChip.displayName = 'TeamChip';

/**
 * TeamChipList - Container for multiple team chips
 */
export interface TeamChipListProps {
  teams: Array<{
    id: string;
    name: string;
    color?: string;
    emoji?: string;
    score?: number;
  }>;
  activeTeamId?: string;
  onTeamClick?: (teamId: string) => void;
  showScores?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamChipList: React.FC<TeamChipListProps> = ({
  teams,
  activeTeamId,
  onTeamClick,
  showScores = false,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 md:gap-3 ${className}`}>
      {teams.map((team) => (
        <TeamChip
          key={team.id}
          name={team.name}
          color={team.color}
          emoji={team.emoji}
          score={team.score}
          showScore={showScores}
          size={size}
          active={team.id === activeTeamId}
          onClick={onTeamClick ? () => onTeamClick(team.id) : undefined}
        />
      ))}
    </div>
  );
};

TeamChipList.displayName = 'TeamChipList';

/**
 * Predefined team colors (TV show quality palette)
 */
export const TEAM_COLORS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16', // Lime
] as const;

/**
 * Predefined team emojis
 */
export const TEAM_EMOJIS = ['🔵', '🟣', '🟢', '🟡', '🔴', '🔷', '🩷', '🟩'] as const;
