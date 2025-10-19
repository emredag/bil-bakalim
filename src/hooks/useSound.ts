/**
 * useSound Hook
 * PRD Section 10 - Sound System
 *
 * React hook for easy sound playback throughout the app
 *
 * Usage:
 * ```tsx
 * const { play, volume, setVolume, muted, toggleMute } = useSound();
 *
 * // Play a sound
 * play('letterReveal');
 *
 * // Change volume
 * setVolume(0.5); // 50%
 *
 * // Toggle mute
 * toggleMute();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { soundManager } from '../services/audio/SoundManager';
import type { SoundType } from '../services/audio/types';

export interface UseSoundReturn {
  /** Play a sound effect */
  play: (soundType: SoundType) => Promise<void>;
  /** Current volume (0-1) */
  volume: number;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Current muted state */
  muted: boolean;
  /** Set muted state */
  setMuted: (muted: boolean) => void;
  /** Toggle mute on/off */
  toggleMute: () => void;
  /** Whether sound system is initialized */
  initialized: boolean;
}

/**
 * Hook for sound playback and control
 */
export function useSound(): UseSoundReturn {
  const [volume, setVolumeState] = useState(() => soundManager.getVolume());
  const [muted, setMutedState] = useState(() => soundManager.isMuted());
  const [initialized, setInitialized] = useState(false);

  // Initialize sound system on first user interaction
  useEffect(() => {
    const initialize = async () => {
      try {
        await soundManager.initialize();
        setInitialized(true);
      } catch (error) {
        console.error('[useSound] Failed to initialize:', error);
      }
    };

    // Initialize on first mount
    initialize();
  }, []);

  /**
   * Play a sound
   */
  const play = useCallback(async (soundType: SoundType) => {
    await soundManager.play(soundType);
  }, []);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    soundManager.setVolume(clamped);
    setVolumeState(clamped);
  }, []);

  /**
   * Set muted state
   */
  const setMuted = useCallback((newMuted: boolean) => {
    soundManager.setMuted(newMuted);
    setMutedState(newMuted);
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setMutedState(newMuted);
  }, []);

  return {
    play,
    volume,
    setVolume,
    muted,
    setMuted,
    toggleMute,
    initialized,
  };
}
