/**
 * Sound Manager
 * PRD Section 10 - Sound System
 *
 * Central sound management using Web Audio API
 * Handles all game sounds with synthesized audio (no external files)
 *
 * Features:
 * - AudioContext management
 * - Volume control (0-100%)
 * - Mute toggle
 * - localStorage persistence
 * - Low latency playback
 * - Sound pooling for performance
 */

import type { SoundType, SoundDefinition, SoundManagerConfig, Note } from './types';
import { STORAGE_KEYS, DEFAULT_SOUND_SETTINGS } from './types';
import { SOUND_DEFINITIONS } from './sounds';
import { createOscillator, createWhiteNoise, createFilter, createGainNode } from './oscillators';
import { applyEnvelope } from './envelopes';

/**
 * Main Sound Manager Class
 * Singleton pattern - only one instance should exist
 */
export class SoundManager {
  private static instance: SoundManager | null = null;
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private config: SoundManagerConfig;
  private initialized: boolean = false;

  private constructor() {
    // Load settings from localStorage
    this.config = this.loadSettings();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Initialize AudioContext
   * Must be called after user interaction (browser requirement)
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Create AudioContext
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        throw new Error('Web Audio API is not supported in this browser');
      }
      this.audioContext = new AudioContextConstructor();

      // Create master gain node for volume control
      this.masterGainNode = createGainNode(
        this.audioContext,
        this.config.muted ? 0 : this.config.masterVolume
      );
      this.masterGainNode.connect(this.audioContext.destination);

      this.initialized = true;
      console.log('[SoundManager] Initialized successfully');
    } catch (error) {
      console.error('[SoundManager] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Play a sound effect
   *
   * @param soundType - Type of sound to play
   */
  public async play(soundType: SoundType): Promise<void> {
    // Initialize if needed
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.audioContext || !this.masterGainNode) {
      console.warn('[SoundManager] AudioContext not available');
      return;
    }

    // Don't play if muted
    if (this.config.muted) {
      return;
    }

    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const definition = SOUND_DEFINITIONS[soundType];
    if (!definition) {
      console.warn(`[SoundManager] Unknown sound type: ${soundType}`);
      return;
    }

    try {
      this.playSound(definition);
    } catch (error) {
      console.error(`[SoundManager] Error playing ${soundType}:`, error);
    }
  }

  /**
   * Play a sound based on its definition
   */
  private playSound(definition: SoundDefinition): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Handle noise-based sounds (skip/whoosh)
    if (definition.useNoise && definition.filter) {
      this.playNoiseSound(definition, now);
      return;
    }

    // Handle single-frequency sounds
    if (typeof definition.frequency === 'number') {
      this.playSingleNote(definition, now);
      return;
    }

    // Handle multi-note melodies (correct answer, win fanfare)
    this.playMelody(definition, definition.frequency, now);
  }

  /**
   * Play a single note
   */
  private playSingleNote(definition: SoundDefinition, startTime: number): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const ctx = this.audioContext;
    const freq = definition.frequency as number;

    // Create oscillator
    const oscillator = createOscillator(ctx, definition.waveform, freq);

    // Create gain node for envelope
    const gainNode = createGainNode(ctx, 0);

    // Apply ADSR envelope
    applyEnvelope(
      gainNode,
      definition.envelope,
      startTime,
      definition.duration,
      this.config.masterVolume
    );

    // Connect: oscillator -> gain -> master -> destination
    if (!this.masterGainNode) return;
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    // Play
    oscillator.start(startTime);
    oscillator.stop(startTime + definition.duration);

    // Cleanup
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Play a melody (sequence of notes)
   */
  private playMelody(definition: SoundDefinition, notes: Note[], startTime: number): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const ctx = this.audioContext;

    notes.forEach((note) => {
      const noteStartTime = startTime + (note.delay || 0);

      // Create oscillator for this note
      const oscillator = createOscillator(ctx, definition.waveform, note.frequency);

      // Create gain node for envelope
      const gainNode = createGainNode(ctx, 0);

      // Apply ADSR envelope
      applyEnvelope(
        gainNode,
        definition.envelope,
        noteStartTime,
        note.duration,
        this.config.masterVolume
      );

      // Connect
      if (!this.masterGainNode) return;
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGainNode);

      // Play
      oscillator.start(noteStartTime);
      oscillator.stop(noteStartTime + note.duration);

      // Cleanup
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  /**
   * Play a noise-based sound with filter sweep
   */
  private playNoiseSound(definition: SoundDefinition, startTime: number): void {
    if (!this.audioContext || !this.masterGainNode || !definition.filter) return;

    const ctx = this.audioContext;

    // Create white noise
    const noise = createWhiteNoise(ctx, definition.duration);

    // Create filter
    const filter = createFilter(
      ctx,
      definition.filter.type,
      definition.filter.startFrequency,
      definition.filter.q || 1
    );

    // Create gain node for envelope
    const gainNode = createGainNode(ctx, 0);

    // Apply ADSR envelope
    applyEnvelope(
      gainNode,
      definition.envelope,
      startTime,
      definition.duration,
      this.config.masterVolume
    );

    // Sweep filter frequency for "whoosh" effect
    if (definition.filter.endFrequency) {
      filter.frequency.setValueAtTime(definition.filter.startFrequency, startTime);
      filter.frequency.exponentialRampToValueAtTime(
        definition.filter.endFrequency,
        startTime + definition.duration
      );
    }

    // Connect: noise -> filter -> gain -> master -> destination
    if (!this.masterGainNode) return;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    // Play
    noise.start(startTime);
    noise.stop(startTime + definition.duration);

    // Cleanup
    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Set master volume (0-1)
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.config.masterVolume = clampedVolume;

    if (this.masterGainNode && !this.config.muted) {
      this.masterGainNode.gain.value = clampedVolume;
    }

    this.saveSettings();
  }

  /**
   * Get current volume (0-1)
   */
  public getVolume(): number {
    return this.config.masterVolume;
  }

  /**
   * Set muted state
   */
  public setMuted(muted: boolean): void {
    this.config.muted = muted;

    if (this.masterGainNode) {
      this.masterGainNode.gain.value = muted ? 0 : this.config.masterVolume;
    }

    this.saveSettings();
  }

  /**
   * Get muted state
   */
  public isMuted(): boolean {
    return this.config.muted;
  }

  /**
   * Toggle mute
   */
  public toggleMute(): boolean {
    this.setMuted(!this.config.muted);
    return this.config.muted;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, this.config.masterVolume.toString());
      localStorage.setItem(STORAGE_KEYS.MUTED, this.config.muted.toString());
    } catch (error) {
      console.error('[SoundManager] Failed to save settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): SoundManagerConfig {
    try {
      const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
      const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);

      return {
        masterVolume: savedVolume ? parseFloat(savedVolume) : DEFAULT_SOUND_SETTINGS.masterVolume,
        muted: savedMuted ? savedMuted === 'true' : DEFAULT_SOUND_SETTINGS.muted,
      };
    } catch (error) {
      console.error('[SoundManager] Failed to load settings:', error);
      return DEFAULT_SOUND_SETTINGS;
    }
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.masterGainNode = null;
    this.initialized = false;
  }
}

/**
 * Export singleton instance
 */
export const soundManager = SoundManager.getInstance();
