/**
 * Sound Service - Web Audio API based sound system
 * PRD Reference: Section 10.1 - Sound System
 *
 * Generates sound effects using Web Audio API:
 * - Pop (letter reveal)
 * - Success jingle (correct guess)
 * - Error buzz (wrong guess)
 * - Whoosh (skip word)
 * - Tick (timer warning)
 * - Fanfare (game win)
 * - Click (button clicks)
 *
 * Features:
 * - Master volume control
 * - Mute/unmute toggle
 * - Low latency audio context
 * - Settings synced with settingsStore
 */

import { useSettingsStore } from '../store/settingsStore';

class SoundService {
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private isEnabled: boolean = true;
  private masterVolume: number = 0.8; // 0.0 to 1.0
  private initialized: boolean = false;

  constructor() {
    this.initAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  private initAudioContext(): void {
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        throw new Error('Web Audio API is not supported in this browser');
      }
      this.audioContext = new AudioContextConstructor();
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      this.masterGainNode.gain.value = this.masterVolume;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  /**
   * Initialize and sync with settingsStore
   * MUST be called on app startup (e.g., in App.tsx useEffect)
   */
  init(): void {
    if (this.initialized) return;

    try {
      // Get initial values from settings store
      const store = useSettingsStore.getState();
      this.isEnabled = store.soundEnabled;
      this.masterVolume = store.effectsVolume / 100; // Convert 0-100 to 0-1

      // Update audio context
      if (this.masterGainNode) {
        this.masterGainNode.gain.value = this.masterVolume;
      }

      // Subscribe to settings changes
      useSettingsStore.subscribe((state) => {
        this.isEnabled = state.soundEnabled;
        this.masterVolume = state.effectsVolume / 100;

        if (this.masterGainNode) {
          this.masterGainNode.gain.value = this.masterVolume;
        }
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize sound service:', error);
    }
  }

  /**
   * Create an oscillator node
   */
  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    return oscillator;
  }

  /**
   * Create a gain node for envelope shaping
   */
  private createEnvelope(
    attack: number = 0.01,
    decay: number = 0.1,
    sustain: number = 0.5
  ): GainNode {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }

    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    // ADS envelope (Attack, Decay, Sustain)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + attack);
    gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    gainNode.connect(this.masterGainNode);
    return gainNode;
  }

  /**
   * Play pop sound (letter reveal)
   * PRD: 440 Hz, 0.1s, Sine wave, Quick attack/decay
   */
  playPop(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const oscillator = this.createOscillator(440, 'sine');
      const gainNode = this.createEnvelope(0.01, 0.09, 0);

      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Failed to play pop sound:', error);
    }
  }

  /**
   * Play success jingle (correct guess)
   * PRD: C5-E5-G5-C6 notes, 1s, Square wave
   */
  playSuccess(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const noteDuration = 0.25; // 0.25s per note = 1s total

      notes.forEach((frequency, index) => {
        const oscillator = this.createOscillator(frequency, 'square');
        const gainNode = this.createEnvelope(0.05, 0.15, 0.5);

        const startTime = this.audioContext!.currentTime + index * noteDuration;
        oscillator.connect(gainNode);
        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
      });
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  /**
   * Play error buzz (wrong guess)
   * PRD: 200 Hz, 0.3s, Sawtooth, Sharp attack
   */
  playError(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const oscillator = this.createOscillator(200, 'sawtooth');
      const gainNode = this.createEnvelope(0.01, 0.2, 0.3);

      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Failed to play error sound:', error);
    }
  }

  /**
   * Play whoosh sound (skip word)
   * PRD: White noise sweep, 0.2s, Low-pass filter
   */
  playWhoosh(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      // Create white noise using buffer
      const bufferSize = this.audioContext.sampleRate * 0.2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      // Low-pass filter with sliding cutoff
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      filter.frequency.linearRampToValueAtTime(500, this.audioContext.currentTime + 0.2);

      const gainNode = this.createEnvelope(0.01, 0.19, 0);

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();
      noise.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Failed to play whoosh sound:', error);
    }
  }

  /**
   * Play tick sound (timer warning)
   * PRD: 880 Hz, 0.05s, Square wave
   */
  playTick(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const oscillator = this.createOscillator(880, 'square');
      const gainNode = this.createEnvelope(0.01, 0.04, 0);

      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.error('Failed to play tick sound:', error);
    }
  }

  /**
   * Play fanfare (game win)
   * PRD: C4-E4-G4-C5-E5-G5, 1.5s, Triangle wave
   */
  playFanfare(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      const noteDuration = 0.25;

      notes.forEach((frequency, index) => {
        const oscillator = this.createOscillator(frequency, 'triangle');
        const gainNode = this.createEnvelope(0.1, 0.1, 0.6);

        const startTime = this.audioContext!.currentTime + index * noteDuration;
        oscillator.connect(gainNode);
        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
      });
    } catch (error) {
      console.error('Failed to play fanfare sound:', error);
    }
  }

  /**
   * Play click sound (button clicks)
   * PRD: 1000 Hz, 0.05s, Sine wave
   */
  playClick(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const oscillator = this.createOscillator(1000, 'sine');
      const gainNode = this.createEnvelope(0.01, 0.04, 0);

      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.error('Failed to play click sound:', error);
    }
  }

  /**
   * Enable/disable sound
   * Updates settingsStore which will trigger sync via subscription
   */
  setEnabled(enabled: boolean): void {
    const store = useSettingsStore.getState();
    store.setSoundEnabled(enabled);
  }

  /**
   * Get current enabled state
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Toggle sound on/off
   */
  toggle(): void {
    this.setEnabled(!this.isEnabled);
  }

  /**
   * Set master volume (0-100)
   * Updates settingsStore which will trigger sync via subscription
   */
  setVolume(volume: number): void {
    const store = useSettingsStore.getState();
    const clampedVolume = Math.max(0, Math.min(100, volume));
    store.setEffectsVolume(clampedVolume);
  }

  /**
   * Get current volume (0-100)
   */
  getVolume(): number {
    return Math.round(this.masterVolume * 100);
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }
  }
}

// Export singleton instance
export const soundService = new SoundService();
