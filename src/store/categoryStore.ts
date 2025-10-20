/**
 * Category Store - Category and word data cache using Zustand
 * PRD Reference: Section 2.1 - State Management, Section 3 - Category System
 * 
 * Manages categories and words with caching to reduce backend calls
 * Data is fetched from Tauri backend and cached in memory
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Category, Word, ValidationResult, SinglePlayerSetup, MultiPlayerSetup, TeamModeSetup } from '../types';

interface CategoryStore {
  // Cache state
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;

  // Selected category and its words
  selectedCategory: Category | null;
  selectedCategoryId: number | null;
  selectedCategoryWords: Word[];
  wordsLoading: boolean;
  wordsError: string | null;

  // Validation cache
  validationCache: Map<number, ValidationResult>;

  // Game setup flow (Task 10: Mode Selection, Task 11: Participant Setup)
  selectedMode: 'single' | 'multi' | 'team' | null;
  gameSetup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null;
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: number) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setCategoriesError: (error: string | null) => void;
  
  // Actions - Selection
  setSelectedCategory: (category: Category | null) => void;
  selectCategory: (categoryId: number) => void;

  // Actions - Words
  setWords: (words: Word[]) => void;
  addWord: (word: Word) => void;
  updateWord: (word: Word) => void;
  removeWord: (wordId: number) => void;
  setWordsLoading: (loading: boolean) => void;
  setWordsError: (error: string | null) => void;
  
  // Actions - Validation
  setValidation: (categoryId: number, validation: ValidationResult) => void;
  getValidation: (categoryId: number) => ValidationResult | undefined;

  // Actions - Mode Selection (Task 10)
  setSelectedMode: (mode: 'single' | 'multi' | 'team' | null) => void;

  // Actions - Game Setup (Task 11: Participant Setup)
  setGameSetup: (setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null) => void;
  clearGameSetup: () => void;

  // Utility
  clearCache: () => void;
  reset: () => void;
}

const initialState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  selectedCategory: null,
  selectedCategoryId: null,
  selectedCategoryWords: [],
  wordsLoading: false,
  wordsError: null,
  validationCache: new Map<number, ValidationResult>(),
  selectedMode: null,
  gameSetup: null,
};

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCategories: (categories: Category[]) => {
        set({ categories, categoriesError: null });
      },

      addCategory: (category: Category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      updateCategory: (category: Category) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === category.id ? category : c
          ),
        }));
      },

      removeCategory: (categoryId: number) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
          // Clear validation cache for removed category
          validationCache: (() => {
            const newCache = new Map(state.validationCache);
            newCache.delete(categoryId);
            return newCache;
          })(),
          // Clear selected category if it was removed
          selectedCategory:
            state.selectedCategoryId === categoryId
              ? null
              : state.selectedCategory,
          selectedCategoryId:
            state.selectedCategoryId === categoryId
              ? null
              : state.selectedCategoryId,
          selectedCategoryWords:
            state.selectedCategoryId === categoryId
              ? []
              : state.selectedCategoryWords,
        }));
      },

      setCategoriesLoading: (loading: boolean) => {
        set({ categoriesLoading: loading });
      },

      setCategoriesError: (error: string | null) => {
        set({ categoriesError: error });
      },

      setSelectedCategory: (category: Category | null) => {
        set({
          selectedCategory: category,
          selectedCategoryId: category?.id || null,
          selectedCategoryWords: [],
          wordsError: null,
        });
      },

      selectCategory: (categoryId: number) => {
        const category = get().categories.find((c) => c.id === categoryId);
        set({
          selectedCategory: category || null,
          selectedCategoryId: categoryId,
          selectedCategoryWords: [],
          wordsError: null,
        });
      },

      setWords: (words: Word[]) => {
        set({ selectedCategoryWords: words, wordsError: null });
      },

      addWord: (word: Word) => {
        set((state) => ({
          selectedCategoryWords: [...state.selectedCategoryWords, word],
          // Invalidate validation cache for this category
          validationCache: (() => {
            const newCache = new Map(state.validationCache);
            newCache.delete(word.category_id);
            return newCache;
          })(),
        }));
      },

      updateWord: (word: Word) => {
        set((state) => ({
          selectedCategoryWords: state.selectedCategoryWords.map((w) =>
            w.id === word.id ? word : w
          ),
          // Invalidate validation cache
          validationCache: (() => {
            const newCache = new Map(state.validationCache);
            newCache.delete(word.category_id);
            return newCache;
          })(),
        }));
      },

      removeWord: (wordId: number) => {
        set((state) => {
          const removedWord = state.selectedCategoryWords.find(
            (w) => w.id === wordId
          );
          return {
            selectedCategoryWords: state.selectedCategoryWords.filter(
              (w) => w.id !== wordId
            ),
            // Invalidate validation cache
            validationCache: removedWord
              ? (() => {
                  const newCache = new Map(state.validationCache);
                  newCache.delete(removedWord.category_id);
                  return newCache;
                })()
              : state.validationCache,
          };
        });
      },

      setWordsLoading: (loading: boolean) => {
        set({ wordsLoading: loading });
      },

      setWordsError: (error: string | null) => {
        set({ wordsError: error });
      },

      setValidation: (categoryId: number, validation: ValidationResult) => {
        set((state) => {
          const newCache = new Map(state.validationCache);
          newCache.set(categoryId, validation);
          return { validationCache: newCache };
        });
      },

      getValidation: (categoryId: number) => {
        return get().validationCache.get(categoryId);
      },

      setSelectedMode: (mode: 'single' | 'multi' | 'team' | null) => {
        set({ selectedMode: mode });
      },

      setGameSetup: (setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null) => {
        set({ gameSetup: setup });
      },

      clearGameSetup: () => {
        set({ gameSetup: null });
      },

      clearCache: () => {
        set({
          validationCache: new Map<number, ValidationResult>(),
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: 'CategoryStore' }
  )
);
