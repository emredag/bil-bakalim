/**
 * Validation Badge Component
 * Task 09: Category Selection Screen
 * PRD Reference: Section 3.3 - Category Validation
 *
 * Displays playability status for categories:
 * - ✅ Green: Fully playable (70+ words, all modes)
 * - ⚠️ Yellow: Limited playability (14-69 words, restricted modes)
 * - ❌ Red: Not playable (<14 words)
 */

import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { ValidationResult } from '../types/database';

export interface ValidationBadgeProps {
  validation: ValidationResult;
  /** Show full message or compact version */
  compact?: boolean;
}

/**
 * ValidationBadge - Playability indicator for categories
 *
 * Features:
 * - Color-coded status (green/yellow/red)
 * - Tooltip with detailed validation message
 * - Responsive text sizing
 */
export function ValidationBadge({ validation, compact = false }: ValidationBadgeProps) {
  // Determine badge variant and icon
  const getBadgeInfo = () => {
    if (!validation.is_valid) {
      // Not playable at all
      return {
        variant: 'error' as const,
        icon: '❌',
        label: 'Oynanamaz',
      };
    } else if (validation.max_players_multi === 1) {
      // Only single player mode
      return {
        variant: 'warning' as const,
        icon: '⚠️',
        label: 'Sınırlı',
      };
    } else {
      // Fully playable
      return {
        variant: 'success' as const,
        icon: '✅',
        label: 'Oynanabilir',
      };
    }
  };

  const { variant, icon, label } = getBadgeInfo();

  const badgeContent = (
    <Badge variant={variant} className="text-sm md:text-base font-semibold">
      <span className="mr-1">{icon}</span>
      {!compact && <span>{label}</span>}
    </Badge>
  );

  // Wrap in tooltip for detailed message
  return (
    <Tooltip content={validation.message}>
      {badgeContent}
    </Tooltip>
  );
}
