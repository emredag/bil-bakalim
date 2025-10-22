/**
 * Validation Badge Component
 * Task 29: Category Validation
 * PRD Reference: Section 3.3 - Category Validation
 *
 * Displays playability status for categories:
 * - ✅ Green: Fully playable (multi-mode support)
 * - ⚠️ Yellow: Limited playability (single player only)
 * - ❌ Red: Not playable (insufficient words)
 */

import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { ValidationResult } from '../types/database';
import { getValidationTooltip, enrichValidationResult } from '../utils/categoryValidation';

export interface ValidationBadgeProps {
  validation: ValidationResult;
  /** Show full message or compact version */
  compact?: boolean;
  /** Show detailed tooltip (default: true) */
  showTooltip?: boolean;
}

/**
 * ValidationBadge - Playability indicator for categories
 *
 * Features:
 * - Color-coded status (green/yellow/red)
 * - Tooltip with detailed validation message
 * - Responsive text sizing
 * - Shows word distribution per letter length
 * - Indicates supported game modes
 */
export function ValidationBadge({ 
  validation, 
  compact = false, 
  showTooltip = true 
}: ValidationBadgeProps) {
  // Enrich validation with detailed info
  const enriched = enrichValidationResult(validation);
  
  // Get badge display info
  const getBadgeInfo = () => {
    if (!validation.is_valid) {
      // Not playable at all
      return {
        variant: 'error' as const,
        icon: '❌',
        label: enriched.badgeLabel,
        fullText: validation.message,
      };
    } else if (validation.max_players_multi === 1) {
      // Only single player mode
      return {
        variant: 'warning' as const,
        icon: '⚠️',
        label: enriched.badgeLabel,
        fullText: validation.message,
      };
    } else {
      // Fully playable
      return {
        variant: 'success' as const,
        icon: '✅',
        label: enriched.badgeLabel,
        fullText: validation.message,
      };
    }
  };

  const { variant, icon, label } = getBadgeInfo();

  const badgeContent = (
    <Badge variant={variant} className="text-sm md:text-base font-semibold">
      <span className="mr-1.5" aria-hidden="true">{icon}</span>
      {!compact && <span>{label}</span>}
    </Badge>
  );

  // Wrap in tooltip if enabled
  if (showTooltip) {
    const tooltipContent = getValidationTooltip(validation);
    return (
      <Tooltip content={tooltipContent}>
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
}
