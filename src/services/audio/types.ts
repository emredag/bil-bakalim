/**
 * Audio System Types
 * PRD Section 10 - Sound System
 *
 * Type definitions for Web Audio API sound system
 */

/**
 * Waveform types supported by oscillators
 */
export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

/**
 * ADSR Envelope parameters
 * Attack, Decay, Sustain, Release
 */
export interface EnvelopeParams {
  /** Attack time in seconds (0 to peak volume) */
  attack: number;
  /** Decay time in seconds (peak to sustain level) */
  decay: number;
  /** Sustain level (0-1, fraction of peak volume) */
  sustain: number;
  /** Release time in seconds (sustain to 0) */
  release: number;
}

/**
 * Musical note definition
 */
export interface Note {
  /** Frequency in Hz */
  frequency: number;
  /** Duration in seconds */
  duration: number;
  /** Delay before playing in seconds */
  delay?: number;
}

/**
 * Sound effect definition
 */
export interface SoundDefinition {
  /** Waveform type */
  waveform: WaveformType;
  /** Frequency in Hz (or array of notes for melodies) */
  frequency: number | Note[];
  /** Total duration in seconds */
  duration: number;
  /** ADSR envelope parameters */
  envelope: EnvelopeParams;
  /** Use noise generator instead of oscillator */
  useNoise?: boolean;
  /** Filter configuration for noise-based sounds */
  filter?: FilterConfig;
}

/**
 * Filter configuration for audio processing
 */
export interface FilterConfig {
  /** Filter type */
  type: BiquadFilterType;
  /** Starting frequency in Hz */
  startFrequency: number;
  /** Ending frequency in Hz (for sweeps) */
  endFrequency?: number;
  /** Filter Q factor (resonance) */
  q?: number;
}

/**
 * Sound types available in the game
 */
export type SoundType =
  | 'letterReveal'
  | 'correctAnswer'
  | 'wrongAnswer'
  | 'skip'
  | 'timeWarning'
  | 'win'
  | 'buttonClick';

/**
 * Sound manager configuration
 */
export interface SoundManagerConfig {
  /** Master volume (0-1) */
  masterVolume: number;
  /** Muted state */
  muted: boolean;
}

/**
 * localStorage keys for sound settings
 */
export const STORAGE_KEYS = {
  VOLUME: 'kelime-oyunu-volume',
  MUTED: 'kelime-oyunu-muted',
} as const;

/**
 * Default sound settings
 */
export const DEFAULT_SOUND_SETTINGS: SoundManagerConfig = {
  masterVolume: 0.7, // 70% default volume
  muted: false,
};
