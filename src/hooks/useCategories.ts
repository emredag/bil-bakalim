/**
 * useCategories Hook
 * Task 09: Category Selection Screen
 * PRD Reference: Section 4.2 - Category Selection
 *
 * Fetches categories from Tauri backend and validates each one
 */

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Category, ValidationResult } from '../types/database';

export interface CategoryWithValidation {
  category: Category;
  validation: ValidationResult;
}

export interface UseCategoriesResult {
  categories: CategoryWithValidation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useCategories - Fetch and validate all categories
 *
 * Features:
 * - Fetches categories from backend
 * - Validates each category for playability
 * - Loading and error states
 * - Manual refetch capability
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoryWithValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all categories
      const fetchedCategories = await invoke<Category[]>('get_all_categories');

      // Validate each category
      const categoriesWithValidation = await Promise.all(
        fetchedCategories.map(async (category) => {
          try {
            const validation = await invoke<ValidationResult>('validate_category', {
              id: category.id,
            });

            return {
              category,
              validation,
            };
          } catch (err) {
            console.error(`Failed to validate category ${category.id}:`, err);
            // Return with a default "invalid" validation if validation fails
            return {
              category,
              validation: {
                is_valid: false,
                total_words: 0,
                words_by_length: [],
                max_players_single: 0,
                max_players_multi: 0,
                max_teams: 0,
                message: 'Validation hatası',
              },
            };
          }
        })
      );

      setCategories(categoriesWithValidation);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err instanceof Error ? err.message : 'Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
