/**
 * ADSR Envelope Generator
 * PRD Section 10.1 - Sound Effects
 *
 * Creates Attack-Decay-Sustain-Release envelopes for natural-sounding audio
 *
 * ADSR Envelope:
 * - Attack: Time to reach peak volume from 0
 * - Decay: Time to fall from peak to sustain level
 * - Sustain: Level maintained during the note
 * - Release: Time to fade to 0 after note ends
 */

import type { EnvelopeParams } from './types';

/**
 * Apply ADSR envelope to a gain node
 *
 * This creates a natural volume curve for synthesized sounds
 *
 * @param gainNode - GainNode to apply envelope to
 * @param envelope - ADSR parameters
 * @param startTime - When to start the envelope (AudioContext time)
 * @param duration - Total duration of the sound
 * @param masterVolume - Master volume multiplier (0-1)
 */
export function applyEnvelope(
  gainNode: GainNode,
  envelope: EnvelopeParams,
  startTime: number,
  duration: number,
  masterVolume: number = 1
): void {
  const { attack, decay, sustain, release } = envelope;
  const param = gainNode.gain;

  // Start at 0
  param.setValueAtTime(0, startTime);

  // Attack: 0 to peak (1.0 * masterVolume)
  const attackEnd = startTime + attack;
  param.linearRampToValueAtTime(masterVolume, attackEnd);

  // Decay: peak to sustain level
  const decayEnd = attackEnd + decay;
  param.linearRampToValueAtTime(masterVolume * sustain, decayEnd);

  // Sustain: hold at sustain level until release starts
  const sustainEnd = startTime + duration - release;
  param.setValueAtTime(masterVolume * sustain, sustainEnd);

  // Release: sustain to 0
  const releaseEnd = sustainEnd + release;
  param.linearRampToValueAtTime(0, releaseEnd);
}

/**
 * Preset envelopes for common sound types
 */
export const ENVELOPE_PRESETS: Record<string, EnvelopeParams> = {
  /** Quick pop sound (letter reveal) */
  pop: {
    attack: 0.01,
    decay: 0.05,
    sustain: 0.3,
    release: 0.04,
  },

  /** Musical note with medium sustain (correct answer jingle) */
  musical: {
    attack: 0.05,
    decay: 0.1,
    sustain: 0.7,
    release: 0.3,
  },

  /** Sharp error sound (wrong answer) */
  error: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.15,
  },

  /** Smooth whoosh (skip) */
  whoosh: {
    attack: 0.02,
    decay: 0.05,
    sustain: 0.6,
    release: 0.1,
  },

  /** Very short click (button, time tick) */
  click: {
    attack: 0.005,
    decay: 0.01,
    sustain: 0.2,
    release: 0.02,
  },

  /** Triumphant fanfare (win) */
  fanfare: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.8,
    release: 0.5,
  },
};

/**
 * Create a custom envelope with validation
 *
 * @param params - Partial envelope parameters (will be merged with defaults)
 * @returns Complete EnvelopeParams
 */
export function createEnvelope(params: Partial<EnvelopeParams>): EnvelopeParams {
  const defaults: EnvelopeParams = {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.7,
    release: 0.1,
  };

  return {
    ...defaults,
    ...params,
  };
}
