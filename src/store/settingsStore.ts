/**
 * Settings Store - Application settings management using Zustand
 * PRD Reference: Section 2.1 - State Management, Section 2.4 - settings table
 * 
 * Manages application settings with persistence via Tauri backend
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ParsedSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

interface SettingsStore {
  // Settings state
  soundEnabled: boolean;
  effectsVolume: number; // 0-100
  theme: 'dark' | 'light';
  language: 'tr' | 'en';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showHints: boolean;
  showTutorial: boolean;

  // Actions
  setSoundEnabled: (enabled: boolean) => void;
  setEffectsVolume: (volume: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (language: 'tr' | 'en') => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  setShowHints: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  resetToDefaults: () => void;

  // Batch update
  updateSettings: (settings: Partial<ParsedSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state from defaults
        ...DEFAULT_SETTINGS,

        setSoundEnabled: (enabled: boolean) => {
          set({ soundEnabled: enabled });
        },

        setEffectsVolume: (volume: number) => {
          set({ effectsVolume: Math.max(0, Math.min(100, volume)) });
        },

        setTheme: (theme: 'dark' | 'light') => {
          set({ theme });
        },

        setLanguage: (language: 'tr' | 'en') => {
          set({ language });
        },

        setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => {
          set({ animationSpeed: speed });
        },

        setShowHints: (show: boolean) => {
          set({ showHints: show });
        },

        setShowTutorial: (show: boolean) => {
          set({ showTutorial: show });
        },

        resetToDefaults: () => {
          set(DEFAULT_SETTINGS);
        },

        updateSettings: (settings: Partial<ParsedSettings>) => {
          set((state) => ({ ...state, ...settings }));
        },
      }),
      {
        name: 'settings-storage', // LocalStorage key
      }
    ),
    { name: 'SettingsStore' }
  )
);
