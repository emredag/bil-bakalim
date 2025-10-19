/**
 * Animation Demo Screen - Task 06 Testing
 *
 * Demonstrates all animations implemented in Task 06:
 * - Page transitions
 * - Confetti particle system
 * - Timer pulse animations
 * - Letter flip 3D
 * - Card hover effects
 * - Button animations
 * - Skeleton loaders
 * - Shake, scale, fade effects
 * - CountUp animation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Sparkles,
  Grid3x3,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

// Animation components
import { Confetti } from '../../animations/Confetti';
import {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonTable,
} from '../../animations/SkeletonLoader';
import {
  shakeVariant,
  pulseVariant,
  scaleVariant,
  fadeVariant,
} from '../../animations/variants';
import { useReducedMotion } from '../../animations/useReducedMotion';

// UI components
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LetterBoxRow } from '../ui/LetterBox';
import { Timer, CountUp, ProgressBar } from '../ui/Progress';

export const AnimationDemo: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // State for demos
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [revealedLetters, setRevealedLetters] = useState<number[]>([]);
  const [shakeActive, setShakeActive] = useState(false);
  const [letterStatus, setLetterStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [countUpValue, setCountUpValue] = useState(0);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const demoWord = 'ANIMATION';

  // Trigger confetti
  const handleConfetti = () => {
    setShowConfetti(true);
  };

  // Timer controls
  const setTimerToWarning = () => setTimerSeconds(25);
  const setTimerToCritical = () => setTimerSeconds(8);
  const resetTimer = () => setTimerSeconds(300);

  // Letter reveal
  const revealNextLetter = () => {
    if (revealedLetters.length < demoWord.length) {
      setRevealedLetters([...revealedLetters, revealedLetters.length]);
    }
  };

  const revealAllLetters = () => {
    setRevealedLetters(Array.from({ length: demoWord.length }, (_, i) => i));
  };

  const resetLetters = () => {
    setRevealedLetters([]);
    setLetterStatus('idle');
  };

  // Shake animation
  const triggerShake = () => {
    setShakeActive(true);
    setTimeout(() => setShakeActive(false), 300);
  };

  // Letter status
  const triggerCorrect = () => {
    setLetterStatus('correct');

    // PRD 8.4: Correct Answer Sequence
    // 1. Green glow (immediate)
    // 2. Pulse animation (handled by LetterBox)
    // 3. Confetti explosion (after 300ms)
    setTimeout(() => {
      setShowConfetti(true);
    }, 300);

    // 4. Count-up animation (after 400ms)
    setTimeout(() => {
      setCountUpValue((prev) => prev + 500);
    }, 400);

    // Reset letter status
    setTimeout(() => setLetterStatus('idle'), 1500);
  };

  const triggerIncorrect = () => {
    setLetterStatus('incorrect');
    triggerShake();
    setTimeout(() => setLetterStatus('idle'), 1000);
  };

  // CountUp
  const triggerCountUp = () => {
    setCountUpValue((prev) => prev + 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Confetti overlay */}
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        particleCount={150}
      />

      <div className="safe-container max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              🎬 Animation Demo
            </h1>
            <p className="text-text-secondary">
              Task 06 - All animations in one place
              {shouldReduceMotion && (
                <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-sm rounded">
                  ⚠️ Reduced Motion Active
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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Confetti Demo */}
          <Card>
            <CardHeader>
              <CardTitle>🎉 Confetti Particle System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4">
                Canvas-based particle system for correct answers
              </p>
              <Button
                variant="primary"
                icon={<Sparkles className="w-5 h-5" />}
                onClick={handleConfetti}
              >
                Trigger Confetti
              </Button>
            </CardContent>
          </Card>

          {/* 2. Timer Pulse Demo */}
          <Card>
            <CardHeader>
              <CardTitle>⏱️ Timer Pulse Animations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Timer seconds={timerSeconds} totalSeconds={300} size={120} />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={resetTimer}>
                    Reset (5:00)
                  </Button>
                  <Button size="sm" onClick={setTimerToWarning} variant="secondary">
                    Warning (25s)
                  </Button>
                  <Button size="sm" onClick={setTimerToCritical} variant="destructive">
                    Critical (8s)
                  </Button>
                </div>
                <p className="text-xs text-text-tertiary text-center">
                  30s: Soft pulse | 10s: Fast pulse + red
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Letter Box 3D Flip */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>🔤 Letter Box 3D Flip Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <LetterBoxRow
                  word={demoWord}
                  revealedIndices={revealedLetters}
                  status={letterStatus}
                  size="md"
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={revealNextLetter} icon={<Play />}>
                    Reveal Next
                  </Button>
                  <Button size="sm" onClick={revealAllLetters} variant="secondary">
                    Reveal All
                  </Button>
                  <Button size="sm" onClick={resetLetters} variant="secondary">
                    Reset
                  </Button>
                  <div className="w-px h-8 bg-slate-700" />
                  <Button
                    size="sm"
                    onClick={triggerCorrect}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    ✓ Correct
                  </Button>
                  <Button size="sm" onClick={triggerIncorrect} variant="destructive">
                    ✗ Incorrect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Card Hover Effects */}
          <Card>
            <CardHeader>
              <CardTitle>🎴 Card Hover Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Card variant="gradient" hoverable>
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </Card>
                <Card variant="bordered" hoverable>
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-2xl">🎪</span>
                  </div>
                </Card>
              </div>
              <p className="text-xs text-text-tertiary mt-3">
                Hover: scale 1→1.05, shadow-xl→2xl
              </p>
            </CardContent>
          </Card>

          {/* 5. Button Animations */}
          <Card>
            <CardHeader>
              <CardTitle>🔘 Button Hover & Loading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Primary Button
                </Button>
                <Button variant="secondary" className="w-full">
                  Secondary Button
                </Button>
                <Button variant="destructive" className="w-full">
                  Destructive Button
                </Button>
                <Button variant="primary" loading className="w-full">
                  Loading State
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 6. Shake Animation */}
          <Card>
            <CardHeader>
              <CardTitle>💥 Shake Animation (Wrong Answer)</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={shakeVariant}
                animate={shakeActive ? 'shake' : 'idle'}
                className="mb-4"
              >
                <Card variant="gradient" className="border-2 border-red-500">
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-4xl">❌</span>
                  </div>
                </Card>
              </motion.div>
              <Button variant="destructive" onClick={triggerShake} className="w-full">
                Trigger Shake
              </Button>
            </CardContent>
          </Card>

          {/* 7. CountUp Animation */}
          <Card>
            <CardHeader>
              <CardTitle>🔢 CountUp Animation (Score)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-accent-primary">
                  <CountUp value={countUpValue} duration={1} />
                </div>
                <Button variant="primary" onClick={triggerCountUp} className="w-full">
                  Add +500 Points
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 8. Skeleton Loaders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>💀 Skeleton Loaders (Loading States)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    onClick={() => setShowSkeletons(!showSkeletons)}
                    icon={showSkeletons ? <Grid3x3 /> : <Loader2 />}
                  >
                    {showSkeletons ? 'Show Content' : 'Show Skeletons'}
                  </Button>
                </div>

                {showSkeletons ? (
                  <div className="space-y-6">
                    {/* Card Skeletons */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-secondary mb-3">
                        Card Skeleton
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                      </div>
                    </div>

                    {/* Text Skeletons */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-secondary mb-3">
                        Text Skeleton
                      </h4>
                      <SkeletonText lines={4} />
                    </div>

                    {/* Table Skeleton */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-secondary mb-3">
                        Table Skeleton
                      </h4>
                      <SkeletonTable rows={3} columns={4} />
                    </div>

                    {/* Mixed Skeletons */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-secondary mb-3">
                        Mixed Skeletons
                      </h4>
                      <div className="flex items-center gap-4">
                        <Skeleton variant="circle" width="w-16" height="h-16" />
                        <div className="flex-1 space-y-2">
                          <Skeleton variant="text" width="w-3/4" />
                          <Skeleton variant="text" width="w-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card variant="gradient">
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-2xl">
                            ✨
                          </div>
                          <div>
                            <h4 className="font-semibold text-text-primary">
                              Actual Content
                            </h4>
                            <p className="text-text-secondary text-sm">
                              This is what shows when loading is complete
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 9. Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Progress Bar Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProgressBar value={75} max={100} variant="default" showLabel />
                <ProgressBar value={60} max={100} variant="success" showLabel />
                <ProgressBar value={40} max={100} variant="warning" showLabel />
                <ProgressBar value={20} max={100} variant="error" showLabel />
              </div>
            </CardContent>
          </Card>

          {/* 10. Scale & Fade Transitions */}
          <Card>
            <CardHeader>
              <CardTitle>🎭 Scale & Fade Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div
                  variants={scaleVariant}
                  initial="initial"
                  whileInView="animate"
                  className="p-4 bg-accent-primary/20 rounded-lg text-center"
                >
                  Scale Transition
                </motion.div>
                <motion.div
                  variants={fadeVariant}
                  initial="initial"
                  whileInView="animate"
                  className="p-4 bg-accent-secondary/20 rounded-lg text-center"
                >
                  Fade Transition
                </motion.div>
                <motion.div
                  variants={pulseVariant}
                  whileInView="pulse"
                  className="p-4 bg-status-success/20 rounded-lg text-center"
                >
                  Pulse Animation
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <Card className="mt-8 bg-slate-800/50 border-2 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">
                  Testing Instructions
                </h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>
                    • <strong>Page Transitions:</strong> Navigate to different pages to see
                    fade + slide
                  </li>
                  <li>
                    • <strong>Performance:</strong> All animations use transform/opacity for
                    60 FPS
                  </li>
                  <li>
                    • <strong>Reduce Motion:</strong> Enable in system settings to test
                    accessibility
                  </li>
                  <li>
                    • <strong>Chrome DevTools:</strong> Performance tab → Record to verify 60
                    FPS
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

AnimationDemo.displayName = 'AnimationDemo';
