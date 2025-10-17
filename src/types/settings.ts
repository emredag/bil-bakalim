// Settings-related types

/**
 * Application settings stored in database
 * PRD Reference: Section 2.4 - settings table
 */
export interface Settings {
  sound_enabled: string; // "true" | "false"
  music_volume: string; // "0" to "100"
  sfx_volume: string; // "0" to "100"
  theme: string; // "dark" | "light" (currently only dark)
  language: string; // "tr" | "en"
  show_hints: string; // "true" | "false"
  show_tutorial: string; // "true" | "false" - first launch
}

/**
 * Parsed settings with proper types
 */
export interface ParsedSettings {
  soundEnabled: boolean;
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  theme: 'dark' | 'light';
  language: 'tr' | 'en';
  showHints: boolean;
  showTutorial: boolean;
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: ParsedSettings = {
  soundEnabled: true,
  musicVolume: 70,
  sfxVolume: 80,
  theme: 'dark',
  language: 'tr',
  showHints: true,
  showTutorial: true,
};
