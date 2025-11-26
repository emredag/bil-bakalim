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
   * Play pop sound (letter reveal)
   * Soft, pleasant click - like a bubble pop
   */
  playPop(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Softer, higher pitched pop with quick decay
      const oscillator = this.createOscillator(600, 'sine');
      const gainNode = this.audioContext.createGain();
      
      // Quick, soft envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      
      gainNode.connect(this.masterGainNode);
      oscillator.connect(gainNode);
      oscillator.start(now);
      oscillator.stop(now + 0.08);
    } catch (error) {
      console.error('Failed to play pop sound:', error);
    }
  }

  /**
   * Play success sound (correct guess)
   * Pleasant, soft chime - two gentle notes
   */
  playSuccess(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Two-note soft chime (G5 -> C6) - simple and pleasant
      const notes = [
        { freq: 784, time: 0, duration: 0.15 },      // G5
        { freq: 1047, time: 0.12, duration: 0.25 },  // C6
      ];
      
      notes.forEach(({ freq, time, duration }) => {
        const osc = this.createOscillator(freq, 'sine');
        const gain = this.audioContext!.createGain();
        
        const startTime = now + time;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        gain.connect(this.masterGainNode!);
        osc.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  /**
   * Play error sound (wrong guess)
   * Soft, low thud - not harsh or alarming
   */
  playError(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Low, soft thud instead of harsh buzz
      const oscillator = this.createOscillator(150, 'sine');
      const gainNode = this.audioContext.createGain();
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      // Pitch drops slightly for "thud" effect
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      
      gainNode.connect(this.masterGainNode);
      oscillator.connect(gainNode);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    } catch (error) {
      console.error('Failed to play error sound:', error);
    }
  }

  /**
   * Play whoosh sound (skip word)
   * Soft swoosh - gentle transition sound
   */
  playWhoosh(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Softer, shorter white noise swoosh
      const bufferSize = Math.floor(this.audioContext.sampleRate * 0.12);
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5; // Reduced amplitude
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for softer sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
      filter.Q.value = 1;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGainNode);
      noise.start(now);
      noise.stop(now + 0.12);
    } catch (error) {
      console.error('Failed to play whoosh sound:', error);
    }
  }

  /**
   * Play tick sound (timer warning)
   * Soft, subtle tick - not alarming
   */
  playTick(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Softer, lower tick sound
      const oscillator = this.createOscillator(660, 'sine');
      const gainNode = this.audioContext.createGain();
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      gainNode.connect(this.masterGainNode);
      oscillator.connect(gainNode);
      oscillator.start(now);
      oscillator.stop(now + 0.04);
    } catch (error) {
      console.error('Failed to play tick sound:', error);
    }
  }

  /**
   * Play fanfare (game win)
   * Pleasant ascending chime - celebratory but not overwhelming
   */
  playFanfare(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      // Three pleasant ascending notes with overlap
      const notes = [
        { freq: 523, time: 0, duration: 0.3 },      // C5
        { freq: 659, time: 0.15, duration: 0.3 },   // E5
        { freq: 784, time: 0.3, duration: 0.4 },    // G5
      ];
      
      notes.forEach(({ freq, time, duration }) => {
        const osc = this.createOscillator(freq, 'sine');
        const gain = this.audioContext!.createGain();
        
        const startTime = now + time;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.setValueAtTime(0.2, startTime + duration * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        gain.connect(this.masterGainNode!);
        osc.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (error) {
      console.error('Failed to play fanfare sound:', error);
    }
  }

  /**
   * Play click sound (button clicks)
   * Very soft, subtle click
   */
  playClick(): void {
    if (!this.isEnabled || !this.audioContext || !this.masterGainNode) return;

    try {
      const now = this.audioContext.currentTime;
      
      const oscillator = this.createOscillator(800, 'sine');
      const gainNode = this.audioContext.createGain();
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      gainNode.connect(this.masterGainNode);
      oscillator.connect(gainNode);
      oscillator.start(now);
      oscillator.stop(now + 0.03);
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
