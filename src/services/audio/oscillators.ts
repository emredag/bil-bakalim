/**
 * Oscillator Factory
 * PRD Section 10.1 - Sound Effects
 *
 * Creates and configures oscillators for synthesized sounds
 */

import type { WaveformType } from './types';

/**
 * Create an oscillator node with specified waveform and frequency
 *
 * @param ctx - AudioContext
 * @param waveform - Waveform type (sine, square, sawtooth, triangle)
 * @param frequency - Frequency in Hz
 * @returns OscillatorNode configured but not started
 */
export function createOscillator(
  ctx: AudioContext,
  waveform: WaveformType,
  frequency: number
): OscillatorNode {
  const oscillator = ctx.createOscillator();
  oscillator.type = waveform;
  oscillator.frequency.value = frequency;
  return oscillator;
}

/**
 * Create a white noise generator using AudioBufferSourceNode
 *
 * White noise is used for "whoosh" effects (skip sound)
 *
 * @param ctx - AudioContext
 * @param duration - Duration in seconds
 * @returns AudioBufferSourceNode with white noise
 */
export function createWhiteNoise(
  ctx: AudioContext,
  duration: number
): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  // Generate white noise (random values between -1 and 1)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

/**
 * Create a bandpass filter for noise shaping
 *
 * Used for creating "whoosh" effects with frequency sweeps
 *
 * @param ctx - AudioContext
 * @param type - Filter type
 * @param frequency - Center frequency in Hz
 * @param q - Q factor (resonance)
 * @returns BiquadFilterNode
 */
export function createFilter(
  ctx: AudioContext,
  type: BiquadFilterType,
  frequency: number,
  q: number = 1
): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  return filter;
}

/**
 * Create a gain node for volume control
 *
 * @param ctx - AudioContext
 * @param initialGain - Initial gain value (0-1)
 * @returns GainNode
 */
export function createGainNode(
  ctx: AudioContext,
  initialGain: number = 1
): GainNode {
  const gain = ctx.createGain();
  gain.gain.value = initialGain;
  return gain;
}

/**
 * Musical note frequencies (Equal temperament, A4 = 440Hz)
 */
export const NOTE_FREQUENCIES = {
  // Octave 4
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,

  // Octave 5
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,

  // Octave 6
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
} as const;
