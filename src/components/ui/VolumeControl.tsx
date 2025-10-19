/**
 * VolumeControl Component
 * PRD Section 10.1 - Sound System
 *
 * Volume slider control for master volume (0-100%)
 *
 * Features:
 * - Responsive slider
 * - Real-time volume adjustment
 * - Visual feedback (volume icon changes)
 * - Keyboard accessible
 */

import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export interface VolumeControlProps {
  /** Current volume (0-1) */
  volume: number;
  /** Volume change callback */
  onVolumeChange: (volume: number) => void;
  /** Whether sound is muted */
  muted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Show percentage label */
  showLabel?: boolean;
}

/**
 * Volume Control Slider
 *
 * Usage:
 * ```tsx
 * const { volume, setVolume, muted } = useSound();
 *
 * <VolumeControl
 *   volume={volume}
 *   onVolumeChange={setVolume}
 *   muted={muted}
 *   showLabel
 * />
 * ```
 */
export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  muted = false,
  className = '',
  showLabel = true,
}) => {
  const percentage = Math.round(volume * 100);

  // Get appropriate icon based on volume level
  const getVolumeIcon = () => {
    if (muted || volume === 0) {
      return <VolumeX className="w-5 h-5 text-text-tertiary" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-5 h-5 text-text-secondary" />;
    }
    return <Volume2 className="w-5 h-5 text-accent-primary" />;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Volume Icon */}
      <div className="flex-shrink-0">{getVolumeIcon()}</div>

      {/* Slider */}
      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleChange}
          className="
            w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-accent-primary
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-accent-primary
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-accent-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:hover:scale-110
          "
          aria-label="Volume control"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          disabled={muted}
        />

        {/* Percentage Label */}
        {showLabel && (
          <div className="flex-shrink-0 w-12 text-right">
            <span className="text-sm font-medium text-text-secondary tabular-nums">
              {muted ? '0%' : `${percentage}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

VolumeControl.displayName = 'VolumeControl';
