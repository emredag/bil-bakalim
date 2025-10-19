/**
 * Sound Definitions
 * PRD Section 10.1 - Sound Effects
 *
 * Defines all 7 game sounds using synthesized audio (no external files)
 */

import type { SoundDefinition } from './types';
import { NOTE_FREQUENCIES } from './oscillators';
import { ENVELOPE_PRESETS } from './envelopes';

/**
 * All game sound definitions
 * PRD 10.1 - Complete sound palette
 */
export const SOUND_DEFINITIONS: Record<string, SoundDefinition> = {
  /**
   * Letter Reveal (Pop)
   * PRD 10.1: 440Hz sine, 0.1s, quick attack/decay
   */
  letterReveal: {
    waveform: 'sine',
    frequency: 440,
    duration: 0.1,
    envelope: ENVELOPE_PRESETS.pop,
  },

  /**
   * Correct Answer (Success Jingle)
   * PRD 10.1: C5-E5-G5-C6 square wave, 1s, medium attack/long release
   * Musical: C major arpeggio (happy sound!)
   */
  correctAnswer: {
    waveform: 'square',
    frequency: [
      { frequency: NOTE_FREQUENCIES.C5, duration: 0.25, delay: 0 },
      { frequency: NOTE_FREQUENCIES.E5, duration: 0.25, delay: 0.2 },
      { frequency: NOTE_FREQUENCIES.G5, duration: 0.25, delay: 0.4 },
      { frequency: NOTE_FREQUENCIES.C6, duration: 0.3, delay: 0.6 },
    ],
    duration: 1.0,
    envelope: ENVELOPE_PRESETS.musical,
  },

  /**
   * Wrong Answer (Error Buzz)
   * PRD 10.1: 200Hz sawtooth, 0.3s, sharp attack/medium decay
   */
  wrongAnswer: {
    waveform: 'sawtooth',
    frequency: 200,
    duration: 0.3,
    envelope: ENVELOPE_PRESETS.error,
  },

  /**
   * Skip/Pass (Whoosh)
   * PRD 10.1: White noise with low-pass filter sweep, 0.2s
   * Filter sweeps from 2000Hz to 200Hz for "whoosh" effect
   */
  skip: {
    waveform: 'sine', // Placeholder, will use white noise
    frequency: 0, // Not used for noise
    duration: 0.2,
    envelope: ENVELOPE_PRESETS.whoosh,
    useNoise: true,
    filter: {
      type: 'lowpass',
      startFrequency: 2000,
      endFrequency: 200,
      q: 1,
    },
  },

  /**
   * Time Warning (Tick)
   * PRD 10.1: 880Hz square, 0.05s, plays every 1s during last 10s
   */
  timeWarning: {
    waveform: 'square',
    frequency: 880,
    duration: 0.05,
    envelope: ENVELOPE_PRESETS.click,
  },

  /**
   * Win (Fanfare)
   * PRD 10.1: C4-E4-G4-C5-E5-G5 triangle, 1.5s, medium attack/long release
   * Musical: Ascending C major arpeggio (triumphant!)
   */
  win: {
    waveform: 'triangle',
    frequency: [
      { frequency: NOTE_FREQUENCIES.C4, duration: 0.25, delay: 0 },
      { frequency: NOTE_FREQUENCIES.E4, duration: 0.25, delay: 0.2 },
      { frequency: NOTE_FREQUENCIES.G4, duration: 0.25, delay: 0.4 },
      { frequency: NOTE_FREQUENCIES.C5, duration: 0.25, delay: 0.6 },
      { frequency: NOTE_FREQUENCIES.E5, duration: 0.25, delay: 0.8 },
      { frequency: NOTE_FREQUENCIES.G5, duration: 0.5, delay: 1.0 },
    ],
    duration: 1.5,
    envelope: ENVELOPE_PRESETS.fanfare,
  },

  /**
   * Button Click
   * PRD 10.1: 1000Hz sine, 0.05s
   */
  buttonClick: {
    waveform: 'sine',
    frequency: 1000,
    duration: 0.05,
    envelope: ENVELOPE_PRESETS.click,
  },
};

/**
 * Sound descriptions for UI display
 */
export const SOUND_DESCRIPTIONS: Record<string, string> = {
  letterReveal: 'Quick pop when revealing a letter',
  correctAnswer: 'Musical jingle for correct answers',
  wrongAnswer: 'Error buzz for wrong answers',
  skip: 'Whoosh sound when skipping a word',
  timeWarning: 'Tick sound during final 10 seconds',
  win: 'Triumphant fanfare when winning',
  buttonClick: 'Click feedback for all buttons',
};
