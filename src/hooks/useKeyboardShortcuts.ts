/**
 * useKeyboardShortcuts Hook
 * Task 33: Keyboard Shortcuts
 * PRD Reference: Section 11 - Klavye Kısayolları
 *
 * Global keyboard shortcuts hook that handles:
 * - F11: Fullscreen toggle
 * - Ctrl/Cmd + Q: Quit application
 * - Ctrl/Cmd + ,: Settings
 * - Ctrl/Cmd + N: New item (context-aware)
 * - Ctrl/Cmd + S: Save (context-aware)
 * - Ctrl/Cmd + F: Focus search (context-aware)
 * - M: Toggle sound (global)
 *
 * Usage:
 * ```tsx
 * useKeyboardShortcuts({
 *   onNew: () => createItem(),
 *   onSave: () => saveForm(),
 *   onSearch: () => searchInputRef.current?.focus(),
 * });
 * ```
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { ROUTES } from '../routes/constants';
import { soundService } from '../services';

export interface KeyboardShortcutHandlers {
  /** Handler for Ctrl/Cmd + N (New item) */
  onNew?: () => void;
  /** Handler for Ctrl/Cmd + S (Save) */
  onSave?: () => void;
  /** Handler for Ctrl/Cmd + F (Focus search) */
  onSearch?: () => void;
  /** Disable global shortcuts (e.g., during game) */
  disableGlobal?: boolean;
  /** Disable navigation shortcuts */
  disableNavigation?: boolean;
}

/**
 * Detect if we're on macOS
 */
const isMac = () => {
  return typeof window !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
};

/**
 * Check if modifier key is pressed (Ctrl on Windows/Linux, Cmd on macOS)
 */
const isModifierPressed = (e: KeyboardEvent): boolean => {
  return isMac() ? e.metaKey : e.ctrlKey;
};

/**
 * Global keyboard shortcuts hook
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers = {}) {
  const navigate = useNavigate();
  const { 
    onNew, 
    onSave, 
    onSearch, 
    disableGlobal = false,
    disableNavigation = false,
  } = handlers;

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      const window = getCurrentWindow();
      const isFullscreen = await window.isFullscreen();
      await window.setFullscreen(!isFullscreen);
    } catch (error) {
      console.error('[useKeyboardShortcuts] Failed to toggle fullscreen:', error);
    }
  }, []);

  // Handle quit application
  const quitApplication = useCallback(async () => {
    try {
      const window = getCurrentWindow();
      await window.close();
    } catch (error) {
      console.error('[useKeyboardShortcuts] Failed to quit application:', error);
    }
  }, []);

  // Handle settings navigation
  const openSettings = useCallback(() => {
    if (!disableNavigation) {
      navigate(ROUTES.SETTINGS);
    }
  }, [navigate, disableNavigation]);

  // Handle sound toggle
  const toggleSound = useCallback(() => {
    soundService.toggle();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;

      // F11 - Fullscreen (works everywhere)
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // M - Toggle sound (works everywhere except inputs)
      if (e.key === 'm' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleSound();
        return;
      }

      // Ctrl/Cmd + Q - Quit (works everywhere)
      if (isModifierPressed(e) && e.key === 'q') {
        e.preventDefault();
        quitApplication();
        return;
      }

      // Skip other shortcuts if disabled
      if (disableGlobal) {
        return;
      }

      // Ctrl/Cmd + , (Comma) - Settings
      if (isModifierPressed(e) && e.key === ',') {
        e.preventDefault();
        openSettings();
        return;
      }

      // Context-aware shortcuts (don't trigger in inputs except search)
      
      // Ctrl/Cmd + N - New item
      if (isModifierPressed(e) && e.key === 'n' && !isInput) {
        e.preventDefault();
        if (onNew) {
          onNew();
        }
        return;
      }

      // Ctrl/Cmd + S - Save
      if (isModifierPressed(e) && e.key === 's') {
        e.preventDefault();
        if (onSave) {
          onSave();
        }
        return;
      }

      // Ctrl/Cmd + F - Focus search
      if (isModifierPressed(e) && e.key === 'f') {
        e.preventDefault();
        if (onSearch) {
          onSearch();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleFullscreen,
    quitApplication,
    openSettings,
    toggleSound,
    onNew,
    onSave,
    onSearch,
    disableGlobal,
  ]);
}
