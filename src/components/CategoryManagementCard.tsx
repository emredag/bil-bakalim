/**
 * CategoryManagementCard Component
 * Task 25: Category Management Screen
 * PRD Reference: Section 5.1 - Category Management Card Design
 *
 * Displays a category card with:
 * - Emoji and name
 * - Word count
 * - Playability status badge
 * - Action buttons (View Words, Edit, Delete)
 */

import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ValidationBadge } from './ValidationBadge';
import { Category, ValidationResult } from '../types/database';

export interface CategoryManagementCardProps {
  category: Category;
  validation: ValidationResult;
  onViewWords: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * CategoryManagementCard - Category card for management screen
 *
 * Features:
 * - Large emoji display
 * - Category name and description
 * - Word count display
 * - Validation status badge
 * - Action buttons (View, Edit, Delete)
 * - Disabled delete for default categories
 * - Responsive sizing
 */
export function CategoryManagementCard({
  category,
  validation,
  onViewWords,
  onEdit,
  onDelete,
}: CategoryManagementCardProps) {
  const isDefault = category.is_default;

  return (
    <Card hoverable className="flex flex-col justify-between h-full min-h-[320px] md:min-h-[360px]">
      {/* Category Info */}
      <div className="flex flex-col space-y-4 md:space-y-5">
        {/* Emoji Icon */}
        <motion.div
          className="text-5xl md:text-6xl lg:text-7xl text-center"
          aria-hidden="true"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.03, rotate: 2 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {category.emoji}
        </motion.div>

        {/* Category Name */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            {category.name}
          </h3>
          {isDefault && (
            <span className="inline-block mt-2 px-3 py-1 bg-warning-500/20 text-warning-400 text-xs md:text-sm font-semibold rounded-full">
              Varsayılan Kategori
            </span>
          )}
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-sm md:text-base text-neutral-400 text-center line-clamp-2 px-2">
            {category.description}
          </p>
        )}

        {/* Word Count */}
        <p className="text-base md:text-lg text-neutral-300 font-medium text-center">
          {validation.total_words} kelime
        </p>

        {/* Validation Badge */}
        <div className="flex justify-center">
          <ValidationBadge validation={validation} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        {/* View Words Button */}
        <Button
          variant="secondary"
          onClick={onViewWords}
          className="w-full"
          aria-label={`${category.name} kategorisinin kelimelerini gör`}
        >
          <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="text-sm md:text-base font-semibold">Kelimeleri Gör</span>
        </Button>

        {/* Edit and Delete Buttons - Side by Side */}
        <div className="grid grid-cols-2 gap-2">
          {/* Edit Button */}
          <Button
            variant="secondary"
            onClick={onEdit}
            className="w-full"
            aria-label={`${category.name} kategorisini düzenle`}
          >
            <Edit2 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span className="text-sm md:text-base font-semibold">Düzenle</span>
          </Button>

          {/* Delete Button - Disabled for default categories */}
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDefault}
            className="w-full"
            aria-label={
              isDefault ? 'Varsayılan kategori silinemez' : `${category.name} kategorisini sil`
            }
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span className="text-sm md:text-base font-semibold">Sil</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
