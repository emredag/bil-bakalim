// Settings-related types

/**
 * Application settings stored in database
 * PRD Reference: Section 2.4 - settings table
 */
export interface Settings {
  sound_enabled: string; // "true" | "false"
  effects_volume: string; // "0" to "100" - sound effects volume
  theme: string; // "dark" | "light" (currently only dark)
  language: string; // "tr" | "en"
  animation_speed: string; // "slow" | "normal" | "fast"
  show_hints: string; // "true" | "false"
  show_tutorial: string; // "true" | "false" - first launch
}

/**
 * Parsed settings with proper types
 */
export interface ParsedSettings {
  soundEnabled: boolean;
  effectsVolume: number; // 0-100 - sound effects volume
  theme: 'dark' | 'light';
  language: 'tr' | 'en';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showHints: boolean;
  showTutorial: boolean;
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: ParsedSettings = {
  soundEnabled: true,
  effectsVolume: 80,
  theme: 'dark',
  language: 'tr',
  animationSpeed: 'normal',
  showHints: true,
  showTutorial: true,
};
