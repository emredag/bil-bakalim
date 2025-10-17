/**
 * Category Store - Category and word data cache using Zustand
 * PRD Reference: Section 2.1 - State Management, Section 3 - Category System
 * 
 * Manages categories and words with caching to reduce backend calls
 * Data is fetched from Tauri backend and cached in memory
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Category, Word, ValidationResult } from '../types';

interface CategoryStore {
  // Cache state
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // Selected category and its words
  selectedCategoryId: number | null;
  selectedCategoryWords: Word[];
  wordsLoading: boolean;
  wordsError: string | null;
  
  // Validation cache
  validationCache: Map<number, ValidationResult>;
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: number) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setCategoriesError: (error: string | null) => void;
  
  // Actions - Words
  selectCategory: (categoryId: number) => void;
  setWords: (words: Word[]) => void;
  addWord: (word: Word) => void;
  updateWord: (word: Word) => void;
  removeWord: (wordId: number) => void;
  setWordsLoading: (loading: boolean) => void;
  setWordsError: (error: string | null) => void;
  
  // Actions - Validation
  setValidation: (categoryId: number, validation: ValidationResult) => void;
  getValidation: (categoryId: number) => ValidationResult | undefined;
  
  // Utility
  clearCache: () => void;
  reset: () => void;
}

const initialState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  selectedCategoryId: null,
  selectedCategoryWords: [],
  wordsLoading: false,
  wordsError: null,
  validationCache: new Map<number, ValidationResult>(),
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

      selectCategory: (categoryId: number) => {
        set({
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
