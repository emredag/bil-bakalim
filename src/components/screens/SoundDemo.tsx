/**
 * Sound Demo Screen - Task 07 Testing
 *
 * Demonstrates all sounds implemented in Task 07:
 * - 7 synthesized sound effects
 * - Volume control (0-100%)
 * - Mute toggle
 * - localStorage persistence
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Volume2 } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { SOUND_DESCRIPTIONS } from '../../services/audio/sounds';
import type { SoundType } from '../../services/audio/types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { VolumeControl } from '../ui/VolumeControl';
import { MuteToggle } from '../ui/MuteToggle';

export const SoundDemo: React.FC = () => {
  const navigate = useNavigate();
  const { play, volume, setVolume, muted, toggleMute, initialized } = useSound();

  // Sound types to test
  const soundTests: Array<{
    type: SoundType;
    label: string;
    emoji: string;
    description: string;
    spec: string;
  }> = [
    {
      type: 'letterReveal',
      label: 'Letter Reveal',
      emoji: '📜',
      description: SOUND_DESCRIPTIONS.letterReveal,
      spec: '440Hz sine, 0.1s, pop',
    },
    {
      type: 'correctAnswer',
      label: 'Correct Answer',
      emoji: '✅',
      description: SOUND_DESCRIPTIONS.correctAnswer,
      spec: 'C5-E5-G5-C6 square wave, 1s',
    },
    {
      type: 'wrongAnswer',
      label: 'Wrong Answer',
      emoji: '❌',
      description: SOUND_DESCRIPTIONS.wrongAnswer,
      spec: '200Hz sawtooth, 0.3s',
    },
    {
      type: 'skip',
      label: 'Skip/Pass',
      emoji: '⏭️',
      description: SOUND_DESCRIPTIONS.skip,
      spec: 'White noise + filter sweep, 0.2s',
    },
    {
      type: 'timeWarning',
      label: 'Time Warning',
      emoji: '⏰',
      description: SOUND_DESCRIPTIONS.timeWarning,
      spec: '880Hz square, 0.05s',
    },
    {
      type: 'win',
      label: 'Win Fanfare',
      emoji: '🏆',
      description: SOUND_DESCRIPTIONS.win,
      spec: 'C4-E4-G4-C5-E5-G5 triangle, 1.5s',
    },
    {
      type: 'buttonClick',
      label: 'Button Click',
      emoji: '🔘',
      description: SOUND_DESCRIPTIONS.buttonClick,
      spec: '1000Hz sine, 0.05s',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-container max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
              🎵 Sound System Demo
            </h1>
            <p className="text-sm md:text-base text-text-secondary">
              Task 07 - All 7 synthesized sounds (Web Audio API)
              {!initialized && (
                <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-sm rounded">
                  ⚠️ Initializing...
                </span>
              )}
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>

        {/* Audio Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎛️ Audio Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Volume Control */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Master Volume
                </label>
                <VolumeControl
                  volume={volume}
                  onVolumeChange={setVolume}
                  muted={muted}
                  showLabel
                />
              </div>

              {/* Mute Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div>
                  <p className="font-medium text-text-primary">Mute All Sounds</p>
                  <p className="text-sm text-text-tertiary">
                    Toggle to mute/unmute all game sounds
                  </p>
                </div>
                <MuteToggle muted={muted} onToggle={toggleMute} showTooltip={false} />
              </div>

              {/* Persistence Info */}
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-text-tertiary">
                  💾 Volume and mute settings are automatically saved to localStorage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sound Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {soundTests.map((sound) => (
            <Card key={sound.type} className="hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Icon & Label */}
                  <div className="text-center">
                    <div className="text-5xl mb-3">{sound.emoji}</div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {sound.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-sm text-text-secondary">{sound.description}</p>
                    <p className="text-xs text-text-tertiary font-mono bg-slate-900 p-2 rounded">
                      {sound.spec}
                    </p>
                  </div>

                  {/* Play Button */}
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Play className="w-4 h-4" />}
                    onClick={() => play(sound.type)}
                    className="w-full"
                    disabled={!initialized}
                  >
                    Play Sound
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Footer */}
        <Card className="mt-8 bg-slate-800/50 border-2 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text-primary mb-2">
                  Testing Instructions
                </h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• <strong>All Sounds:</strong> Click "Play Sound" on each card to test</li>
                  <li>• <strong>Volume Control:</strong> Drag slider to adjust (0-100%)</li>
                  <li>• <strong>Mute Toggle:</strong> Use button to mute/unmute all sounds</li>
                  <li>
                    • <strong>Persistence:</strong> Reload page to verify settings are saved
                  </li>
                  <li>
                    • <strong>No Audio Files:</strong> All sounds synthesized with Web Audio API
                  </li>
                  <li>
                    • <strong>Browser Support:</strong> Modern browsers only (Chrome, Firefox,
                    Safari, Edge)
                  </li>
                </ul>

                <div className="pt-3 border-t border-slate-700">
                  <h4 className="font-medium text-text-primary mb-2">Technical Details:</h4>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• <strong>Web Audio API:</strong> AudioContext + OscillatorNode</li>
                    <li>• <strong>Waveforms:</strong> Sine, Square, Sawtooth, Triangle, White Noise</li>
                    <li>• <strong>ADSR Envelope:</strong> Natural volume curves</li>
                    <li>• <strong>Latency:</strong> &lt;50ms (optimized for gameplay)</li>
                    <li>• <strong>localStorage:</strong> Volume and mute persistence</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sound System Status */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
            <Volume2 className="w-5 h-5 text-accent-primary" />
            <span className="text-sm text-text-secondary">
              Sound System:{' '}
              <span
                className={`font-medium ${initialized ? 'text-status-success' : 'text-status-warning'}`}
              >
                {initialized ? 'Active' : 'Initializing...'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

SoundDemo.displayName = 'SoundDemo';
