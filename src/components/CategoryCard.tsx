/**
 * Category Card Component
 * Task 09: Category Selection Screen
 * PRD Reference: Section 4.2 - Category Selection
 *
 * Displays a category with:
 * - Emoji icon (large)
 * - Category name
 * - Word count
 * - Playability badge
 * - Play button (enabled/disabled)
 */

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ValidationBadge } from './ValidationBadge';
import { Category, ValidationResult } from '../types/database';

export interface CategoryCardProps {
  category: Category;
  validation: ValidationResult;
  onPlay: () => void;
}

/**
 * CategoryCard - Interactive category selection card
 *
 * Features:
 * - Large emoji display
 * - Validation status badge
 * - Conditional Play button (disabled if not playable)
 * - Hover scale animation
 * - TV-optimized sizing
 */
export function CategoryCard({ category, validation, onPlay }: CategoryCardProps) {
  const isPlayable = validation.is_valid;

  return (
    <Card
      hoverable={isPlayable}
      className="flex flex-col justify-between h-full min-h-[280px] md:min-h-[320px] lg:min-h-[360px]"
    >
      {/* Emoji Icon - Large and centered */}
      <div className="flex flex-col items-center text-center space-y-4 md:space-y-5 lg:space-y-6">
        <motion.div
          className="text-6xl md:text-7xl lg:text-8xl"
          aria-hidden="true"
          initial={{ scale: 1 }}
          whileHover={isPlayable ? { scale: 1.1, rotate: 5 } : {}}
          transition={{ duration: 0.2 }}
        >
          {category.emoji}
        </motion.div>

        {/* Category Name */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
          {category.name}
        </h3>

        {/* Description (if exists) */}
        {category.description && (
          <p className="text-sm md:text-base text-slate-400 line-clamp-2">{category.description}</p>
        )}

        {/* Word Count */}
        <p className="text-base md:text-lg text-slate-300 font-medium">
          {validation.total_words} kelime
        </p>

        {/* Validation Badge */}
        <ValidationBadge validation={validation} />
      </div>

      {/* Play Button */}
      <div className="mt-4 md:mt-6">
        <Button
          variant="primary"
          onClick={onPlay}
          disabled={!isPlayable}
          className="w-full"
          aria-label={`${category.name} kategorisini oyna`}
        >
          <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          <span className="text-lg md:text-xl font-bold">Oyna</span>
        </Button>
      </div>
    </Card>
  );
}
