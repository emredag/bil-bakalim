/**
 * Category Card Component - Design System v2.0
 * Task 09: Category Selection Screen
 * PRD Reference: Section 4.2 - Category Selection
 * Migration 4: Enhanced with rich preview and category-specific themes
 *
 * Displays a category with:
 * - Emoji icon (large)
 * - Category name
 * - Word count distribution
 * - Playability badge (top-right)
 * - Category-specific theme color
 * - Play button (enhanced gradient)
 */

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ValidationBadge } from './ValidationBadge';
import { Category, ValidationResult } from '../types/database';
import { getCategoryThemeColor, getCategoryColorWithOpacity } from '../utils/categoryColors';

export interface CategoryCardProps {
  category: Category;
  validation: ValidationResult;
  onPlay: () => void;
}

/**
 * CategoryCard - Interactive category selection card
 * Design System v2.0: Rich preview with category-specific themes
 *
 * Features:
 * - Large emoji display with hover animation
 * - Category-specific accent color (border-left)
 * - Glassmorphism subtle background
 * - Validation status badge (top-right corner)
 * - Word count with inline stats
 * - Enhanced Play button with gradient
 * - Hover glow effect with category color
 * - TV-optimized sizing
 */
export function CategoryCard({ category, validation, onPlay }: CategoryCardProps) {
  const isPlayable = validation.is_valid;
  const themeColor = getCategoryThemeColor(category.emoji);
  const themeBgColor = getCategoryColorWithOpacity(category.emoji, 0.05);

  return (
    <Card
      hoverable={isPlayable}
      className="relative overflow-hidden flex flex-col justify-between h-full min-h-[280px] md:min-h-[320px] lg:min-h-[360px]"
      style={{
        borderLeft: `4px solid ${themeColor}`,
        background: `linear-gradient(135deg, ${themeBgColor}, transparent)`,
      }}
    >
      {/* Validation Badge - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <ValidationBadge validation={validation} compact showTooltip />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center text-center space-y-3 md:space-y-4 lg:space-y-5 pt-2">
        {/* Emoji Icon - Large and centered */}
        <motion.div
          className="text-6xl md:text-7xl lg:text-8xl"
          aria-hidden="true"
          initial={{ scale: 1 }}
          whileHover={isPlayable ? { scale: 1.03, rotate: 2 } : {}}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          {category.emoji}
        </motion.div>

        {/* Category Name */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-50 leading-tight">
          {category.name}
        </h3>

        {/* Description (if exists) */}
        {category.description && (
          <p className="text-sm md:text-base text-neutral-400 line-clamp-2 px-2">
            {category.description}
          </p>
        )}

        {/* Word Count - Enhanced with Stats */}
        <div className="flex flex-col items-center gap-2 w-full px-4">
          <div className="flex items-center gap-2">
            <span
              className="text-base md:text-lg font-semibold tabular-nums"
              style={{ color: themeColor }}
            >
              {validation.total_words}
            </span>
            <span className="text-sm md:text-base text-neutral-400">kelime</span>
          </div>

          {/* Word Distribution Bar (Simplified) */}
          {validation.total_words > 0 && (
            <div className="w-full max-w-[200px]">
              <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}CC)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Play Button - Enhanced */}
      <div className="mt-4 md:mt-6">
        <Button
          variant="primary"
          onClick={onPlay}
          disabled={!isPlayable}
          icon={<Play className="w-5 h-5 md:w-6 md:h-6" />}
          className="w-full relative overflow-hidden group text-lg md:text-xl font-bold"
          style={
            isPlayable
              ? {
                  background: `linear-gradient(135deg, ${themeColor}DD, ${themeColor}BB)`,
                  boxShadow: `0 4px 14px ${getCategoryColorWithOpacity(category.emoji, 0.3)}`,
                }
              : undefined
          }
          aria-label={`${category.name} kategorisini oyna`}
        >
          {/* Hover glow effect */}
          {isPlayable && (
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-0"
              style={{
                background: `radial-gradient(circle at center, ${getCategoryColorWithOpacity(category.emoji, 0.4)}, transparent)`,
              }}
            />
          )}
          <span className="relative z-10">Oyna</span>
        </Button>
      </div>
    </Card>
  );
}
