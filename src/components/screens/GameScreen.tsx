/**
 * GameScreen - Main Game Screen Layout
 * 
 * Two-mode game flow:
 * 1. Normal Mode: Reveal letters, press "Tahmin Et" to enter guess mode
 * 2. Guess Mode: 30-second timer, host marks correct/wrong
 *
 * Features:
 * - Header: Timer (global or guess), score, active player
 * - Word Area: Letter tiles with animations
 * - Tahmin Et Button: Below word, enters guess mode
 * - Control Panel: Context-aware buttons
 * - Progress Bar: Word progress
 * - Timeout overlay when guess timer expires
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { GameHeader } from '../game/GameHeader';
import { WordArea } from '../game/WordArea';
import { HintSection } from '../game/HintSection';
import { ControlPanel } from '../game/ControlPanel';
import { ProgressBar } from '../game/ProgressBar';
import { Confetti } from '../game/Confetti';
import { PauseOverlay } from '../game/PauseOverlay';
import { TurnTransition } from './TurnTransition';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { soundService } from '../../services';
import { ROUTES } from '../../routes/constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const session = useGameStore((state) => state.session);
  const tick = useGameStore((state) => state.tick);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const revealLetter = useGameStore((state) => state.revealLetter);
  const submitGuess = useGameStore((state) => state.submitGuess);
  const nextWord = useGameStore((state) => state.nextWord);
  const setTransition = useGameStore((state) => state.setTransition);
  const endGame = useGameStore((state) => state.endGame);
  
  // Guess mode actions
  const startGuess = useGameStore((state) => state.startGuess);
  const guessTimerTick = useGameStore((state) => state.guessTimerTick);
  const handleGuessTimeout = useGameStore((state) => state.handleGuessTimeout);
  const endGuessMode = useGameStore((state) => state.endGuessMode);

  // Settings
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const showGameButtons = useSettingsStore((state) => state.showGameButtons);
  const guessTimerDuration = useSettingsStore((state) => state.guessTimerDuration);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  
  // Ref to track if timeout was just handled (prevent double execution)
  const timeoutHandledRef = useRef(false);
  
  // Ref to store current session for use in intervals (avoids stale closures)
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Ref to track if we're in transition (to stop timer sounds immediately)
  const isInTransitionRef = useRef(false);
  useEffect(() => {
    isInTransitionRef.current = session?.isInTransition ?? false;
  }, [session?.isInTransition]);

  // Cleanup: Reset transition on unmount
  useEffect(() => {
    return () => {
      setTransition(false);
    };
  }, [setTransition]);

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  // Reset confetti when word changes
  useEffect(() => {
    if (session) {
      setShowConfetti(false);
    }
  }, [session?.participants[session?.activeParticipantIndex]?.currentWordIndex]);

  // Timer tick effect - Global timer (only when not in guess mode)
  // Uses specific session properties to avoid unnecessary re-renders
  const isPaused = session?.isPaused ?? true;
  const gameState = session?.state ?? 'setup';
  const isGuessing = session?.isGuessing ?? false;
  const isInTransition = session?.isInTransition ?? false;
  
  useEffect(() => {
    if (!session || isPaused || gameState !== 'playing' || isGuessing) return;

    const interval = setInterval(() => {
      // Check refs for immediate status (avoids stale closure)
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.isGuessing || isInTransitionRef.current) return;
      
      tick();

      // Use ref for fresh session data to avoid stale closure
      if (currentSession) {
        const activeParticipant = currentSession.participants[currentSession.activeParticipantIndex];
        const remaining =
          activeParticipant.totalTimeSeconds - activeParticipant.elapsedTimeSeconds - 1;
        if (remaining <= 10 && remaining > 0) {
          soundService.playTick();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, gameState, isGuessing, tick, session]);

  // Guess timer tick effect - Only when in guess mode
  const guessTimeRemaining = session?.guessTimeRemaining ?? 0;
  
  useEffect(() => {
    if (!session || isPaused || !isGuessing || isInTransition) return;

    const interval = setInterval(() => {
      // Check ref for immediate transition status (avoids stale closure)
      if (isInTransitionRef.current) return;
      
      // Use ref for fresh session data to get current guessTimeRemaining
      const currentSession = sessionRef.current;
      
      // Don't play sound if guess mode ended
      if (!currentSession?.isGuessing) return;
      
      const currentRemaining = currentSession?.guessTimeRemaining ?? 0;
      
      // Play tick sound in last 10 seconds of guess timer
      if (currentRemaining <= 11 && currentRemaining > 1) {
        soundService.playTick();
      }
      
      guessTimerTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isGuessing, isPaused, isInTransition, guessTimerTick, session]);

  // Handle guess timeout - when timer reaches 0
  useEffect(() => {
    if (!session || !isGuessing || guessTimeRemaining > 0) {
      timeoutHandledRef.current = false;
      return;
    }
    
    // Prevent double execution
    if (timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;

    // Timer reached 0 - handle timeout
    handleGuessTimeout();
    soundService.playError();
    setShowTimeout(true);
    setTransition(true);

    // Show timeout overlay, then move to next word
    setTimeout(() => {
      setShowTimeout(false);
      setTransition(false);
      nextWord();
    }, 2000);
  }, [isGuessing, guessTimeRemaining, handleGuessTimeout, nextWord, setTransition]);

  // Check if all letters revealed - auto skip
  useEffect(() => {
    if (!session) return;
    
    const activeParticipant = session.participants[session.activeParticipantIndex];
    const currentWord = activeParticipant?.words[activeParticipant.currentWordIndex];
    
    if (!currentWord || currentWord.result !== null || session.isGuessing || session.isInTransition) return;
    
    // Check if all letters are revealed
    const allRevealed = currentWord.letters.every(l => l.status === 'revealed');
    
    if (allRevealed && currentWord.result === 'skipped') {
      // Word was auto-skipped by store, transition to next
      setTransition(true);
      setTimeout(() => {
        setTransition(false);
        nextWord();
      }, 2000);
    }
  }, [session, nextWord, setTransition]);

  // Store refs for handlers to use in keyboard shortcuts (avoids stale closures)
  const handlersRef = useRef<{
    revealLetter: () => void;
    startGuess: () => void;
    guess: (isCorrect: boolean) => void;
    pause: () => void;
  } | null>(null);

  // Keyboard shortcuts - Use refs to avoid stale closures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use ref for fresh session data
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.isInTransition) return;

      const activeParticipant = currentSession.participants[currentSession.activeParticipantIndex];
      const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

      // Guard: No current word
      if (!currentWord) return;

      // Allow pause even during guess mode
      if (e.code === 'Space') {
        e.preventDefault();
        handlersRef.current?.pause();
        return;
      }

      // Block other shortcuts if paused
      if (currentSession.isPaused) return;

      switch (e.code) {
        case 'KeyH':
          // Reveal letter - only in normal mode
          if (!currentSession.isGuessing && !currentWord.hasMadeGuess) {
            handlersRef.current?.revealLetter();
          }
          break;
        case 'KeyT':
          // Start guess mode - only in normal mode
          if (!currentSession.isGuessing && !currentWord.hasMadeGuess && currentWord.result === null) {
            handlersRef.current?.startGuess();
          }
          break;
        case 'KeyD':
          // Correct guess - only in guess mode
          if (currentSession.isGuessing) {
            handlersRef.current?.guess(true);
          }
          break;
        case 'KeyY':
          // Wrong guess - only in guess mode
          if (currentSession.isGuessing) {
            handlersRef.current?.guess(false);
          }
          break;
        case 'KeyM':
          soundService.toggle();
          break;
        case 'Escape':
          e.preventDefault();
          setShowHomeModal(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps - uses refs for fresh data

  // Home Modal keyboard shortcuts (PRD 11.3)
  useEffect(() => {
    if (!showHomeModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        navigate(ROUTES.HOME);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHomeModal, navigate]);

  // Check if game finished
  useEffect(() => {
    if (session?.state === 'finished') {
      // Navigate to results screen
      navigate('/results');
    }
  }, [session?.state, navigate]);

  if (!session) {
    return null;
  }

  // Show turn transition screen if waiting for next turn
  if (session.state === 'waiting_next_turn') {
    return <TurnTransition />;
  }

  // If game is finished, don't render (will redirect to results)
  if (session.state === 'finished') {
    return null;
  }

  const activeParticipant = session.participants[session.activeParticipantIndex];
  const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

  // If no current word (all words completed), don't render
  if (!currentWord) {
    return null;
  }

  // Get active participant's remaining time
  const remainingSeconds =
    activeParticipant.totalTimeSeconds - activeParticipant.elapsedTimeSeconds;

  // Calculate remaining points for current word
  const calculateRemainingPoints = (): number => {
    const basePoints = currentWord.letterCount * 100;
    const revealedPenalty = currentWord.lettersRevealed * 100;
    return Math.max(0, basePoints - revealedPenalty);
  };

  // Handlers
  const handleRevealLetter = () => {
    if (!session || session.isGuessing) return;
    
    const activeParticipant = session.participants[session.activeParticipantIndex];
    const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];
    
    // Find all hidden letters
    const hiddenIndices = currentWord.letters
      .map((letter, index) => (letter.status === 'hidden' ? index : -1))
      .filter((index) => index !== -1);

    // Pick a random hidden letter
    if (hiddenIndices.length > 0 && !currentWord.hasMadeGuess) {
      const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      revealLetter(session.activeParticipantIndex, activeParticipant.currentWordIndex, randomIndex);
      soundService.playPop();
    }
  };

  const handleStartGuess = () => {
    if (!session || session.isGuessing || session.isInTransition) return;
    
    const activeParticipant = session.participants[session.activeParticipantIndex];
    const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];
    
    if (currentWord.hasMadeGuess || currentWord.result !== null) return;
    
    startGuess(guessTimerDuration);
    soundService.playClick(); // Guess mode entry sound
  };

  const handleGuess = (isCorrect: boolean) => {
    if (!session || session.isInTransition || !session.isGuessing) return;

    const activeParticipant = session.participants[session.activeParticipantIndex];
    const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

    if (!currentWord || currentWord.result !== null) return;

    // End guess mode first
    endGuessMode();
    
    // Submit the guess
    submitGuess(session.activeParticipantIndex, activeParticipant.currentWordIndex, isCorrect);

    if (isCorrect) {
      // Correct answer: Show confetti, wait, move to next word
      setShowConfetti(true);
      setTransition(true);
      soundService.playSuccess();

      setTimeout(() => {
        setTransition(false);
        nextWord();
      }, 3000);
    } else {
      // Wrong answer: Show animation, reveal word, move to next
      setShowIncorrect(true);
      soundService.playError();

      setTimeout(() => {
        setShowIncorrect(false);
      }, 600);

      setTransition(true);
      setTimeout(() => {
        setTransition(false);
        nextWord();
      }, 2000);
    }
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleResume = () => {
    resumeGame();
  };

  const handleToggleSound = () => {
    soundService.toggle();
  };

  const handleHome = () => {
    setShowHomeModal(true);
  };

  const confirmHome = () => {
    endGame();
    navigate('/');
  };

  // Update handlers ref for keyboard shortcuts (sync, not in useEffect to avoid hooks order issues)
  handlersRef.current = {
    revealLetter: handleRevealLetter,
    startGuess: handleStartGuess,
    guess: handleGuess,
    pause: handlePause,
  };

  // Determine word status for visual feedback
  const wordStatus = showIncorrect
    ? 'incorrect'
    : currentWord.result === 'found'
      ? 'correct'
      : 'idle';

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:pt-6">
        <div className="max-w-4xl mx-auto">
          <GameHeader
            categoryName={session.categoryName}
            categoryEmoji={session.categoryEmoji}
            remainingSeconds={remainingSeconds}
            totalSeconds={session.totalTimeSeconds}
            isGuessing={session.isGuessing}
            currentScore={activeParticipant.score}
            wordsCompleted={activeParticipant.currentWordIndex + 1}
            totalWords={14}
            activeParticipantName={activeParticipant.name}
            activeParticipantType={activeParticipant.type}
            activeParticipantColor={undefined}
            activeParticipantEmoji={undefined}
            gameMode={session.mode}
          />
        </div>
      </header>

      {/* Main Content Area - Word and Hint always centered */}
      <main className="flex-1 flex flex-col pt-28 md:pt-32 pb-48 md:pb-56 px-4 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          {/* Word Area */}
          <WordArea letters={currentWord.letters} wordStatus={wordStatus} />

          {/* Hint Section */}
          <div className="mt-4 md:mt-6 lg:mt-8 w-full">
            <HintSection hint={currentWord.hint} />
          </div>

          {/* Tahmin Et Button Container - Fixed height to prevent layout shift */}
          <div className="mt-6 md:mt-8 h-16 md:h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showGameButtons && !session.isGuessing && !currentWord.hasMadeGuess && currentWord.result === null && !session.isInTransition && (
                <motion.button
                  onClick={handleStartGuess}
                  disabled={session.isInTransition}
                  className="group relative flex items-center gap-4 h-16 md:h-20 px-10 md:px-14 
                             bg-gradient-to-r from-accent-500 to-accent-600 
                             hover:from-accent-400 hover:to-accent-500
                             text-white font-bold text-xl md:text-2xl
                             rounded-2xl shadow-xl shadow-accent-500/40
                             border-2 border-accent-400/30
                             transition-all duration-200
                             hover:scale-105 hover:shadow-2xl hover:shadow-accent-500/50
                             active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-accent-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Target className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                  <span className="relative z-10">Tahmin Et</span>
                  <kbd className="relative z-10 ml-2 px-2.5 py-1 text-sm md:text-base bg-accent-700/50 rounded-lg border border-accent-400/30">T</kbd>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Section - Layered properly */}
      {/* Layer 1: Progress Bar (z-30) - at very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <ProgressBar
          currentWord={activeParticipant.currentWordIndex + 1}
          totalWords={activeParticipant.words.length}
          categoryDescription={session.categoryName}
        />
      </div>

      {/* Layer 2: Control Panel (z-40) - above progress bar */}
      <div className="fixed bottom-14 left-0 right-0 z-40 px-4 pb-2">
        <div className="max-w-4xl mx-auto">
          <ControlPanel
            onRevealLetter={handleRevealLetter}
            onGuessCorrect={() => handleGuess(true)}
            onGuessWrong={() => handleGuess(false)}
            onPause={handlePause}
            onToggleSound={handleToggleSound}
            onHome={handleHome}
            canRevealLetter={
              !currentWord.hasMadeGuess && 
              !session.isGuessing && 
              currentWord.letters.some((l) => l.status === 'hidden')
            }
            isGuessing={session.isGuessing}
            guessTimeRemaining={session.guessTimeRemaining}
            isInTransition={session.isInTransition}
            soundEnabled={soundEnabled}
            showButtons={showGameButtons}
            lettersRevealed={currentWord.lettersRevealed}
            remainingPoints={calculateRemainingPoints()}
          />
        </div>
      </div>

      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Pause Overlay */}
      <AnimatePresence>
        {session.isPaused && <PauseOverlay onResume={handleResume} onHome={confirmHome} />}
      </AnimatePresence>

      {/* Timeout Overlay - Glassmorphism Design */}
      <AnimatePresence>
        {showTimeout && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="assertive"
          >
            <motion.div
              className="relative bg-neutral-800/95 backdrop-blur-xl rounded-3xl p-10 md:p-14 
                         shadow-2xl border-2 border-error-500/30 max-w-md mx-4
                         overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-error-500/10 to-transparent rounded-3xl" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-error-500/20 rounded-full blur-3xl" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-5">
                {/* Timer Icon with animation */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-error-500/20 border-4 border-error-500/50 
                             flex items-center justify-center"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <svg 
                    className="w-12 h-12 text-error-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </motion.div>
                
                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-error-400 text-center">
                  Süre Doldu!
                </h2>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-neutral-300 text-center">
                  Tahmin süresi bitti
                </p>
                
                {/* Score penalty */}
                <div className="mt-2 px-6 py-3 bg-error-500/20 rounded-xl border border-error-500/30">
                  <p className="text-xl md:text-2xl font-bold text-error-400 tabular-nums">
                    -{currentWord.letterCount * 100} puan
                  </p>
                </div>
                
                {/* Progress indicator */}
                <motion.div 
                  className="mt-4 w-full h-1 bg-neutral-700 rounded-full overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-error-500"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </motion.div>
                <p className="text-sm text-neutral-500">Sonraki kelimeye geçiliyor...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Confirmation Modal */}
      <Modal isOpen={showHomeModal} onClose={() => setShowHomeModal(false)} title="Ana Menüye Dön">
        <div className="space-y-6">
          <p className="text-lg text-neutral-300 text-center">
            Ana menüye dönmek istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-error-400 text-center">⚠️ Oyun ilerlemesi kaydedilmeyecek</p>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={confirmHome} variant="destructive" size="lg" className="h-16">
              Evet, Çık
            </Button>
            <Button
              onClick={() => setShowHomeModal(false)}
              variant="secondary"
              size="lg"
              className="h-16"
            >
              İptal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
