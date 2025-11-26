/**
 * Action Card Component
 * Task 08: Main Menu Screen
 * Task 40: Performance Optimization - React.memo added
 * PRD Reference: Section 4.1 - Main Menu Action Cards
 *
 * TV Show Quality action card with:
 * - Large emoji icon
 * - Title and description
 * - Minimum 48×48px touch target
 * - Hover animations (scale 1.05)
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 * - Memoized for performance
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';

export interface ActionCardProps {
  /** Emoji displayed at the top of the card */
  emoji: string;
  /** Lucide icon (optional, for additional visual) */
  icon?: LucideIcon;
  /** Card title */
  title: string;
  /** Short description */
  description: string;
  /** Click handler */
  onClick: () => void;
  /** Custom className for additional styling */
  className?: string;
}

/**
 * ActionCard - Main Menu navigation card
 *
 * Features:
 * - Minimum 48×48px interaction area (PRD 8.5)
 * - Hover scale animation via Card component
 * - Keyboard accessible (Tab, Enter, Space)
 * - ARIA labels for screen readers
 * - Responsive typography (PRD 8.3)
 * - Memoized for better performance (Task 40)
 */
const ActionCardComponent = ({
  emoji,
  icon: Icon,
  title,
  description,
  onClick,
  className = '',
}: ActionCardProps) => {
  // Handle keyboard events (Enter/Space)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${description}`}
      className={`
        cursor-pointer
        focus:outline-none
        focus:ring-4
        focus:ring-accent-400/40
        focus:ring-offset-4
        focus:ring-offset-neutral-900
        hover:ring-2
        hover:ring-accent-400/30
        transition-all
        duration-300
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center gap-4 md:gap-5 lg:gap-6 min-h-[160px] md:min-h-[200px] lg:min-h-[240px] justify-center px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
        {/* Emoji Icon - Extra large and prominent */}
        <motion.div
          className="text-6xl md:text-7xl lg:text-8xl drop-shadow-glow"
          aria-hidden="true"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.03, rotate: 2 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {emoji}
        </motion.div>

        {/* Optional Lucide Icon */}
        {Icon && (
          <Icon
            className="w-10 h-10 md:w-12 md:h-12 text-info-400 drop-shadow-glow"
            aria-hidden="true"
          />
        )}

        {/* Title - Bold, large typography */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
          {title}
        </h2>

        {/* Description - Clear subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-neutral-300 leading-relaxed max-w-[280px]">
          {description}
        </p>
      </div>
    </Card>
  );
};

// Memoize component to prevent unnecessary re-renders (Task 40)
export const ActionCard = memo(ActionCardComponent);
