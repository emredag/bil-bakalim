/**
 * GameScreen - Main Game Screen Layout
 * PRD Reference: Section 4.5 - Game Screen Layout
 * Design Reference: ui-ux-design.md#game-screen
 *
 * TV Show Quality Game Screen with:
 * - Header (120px): Timer, score, active player
 * - Word Area (500px): Letter tiles with 3D flip
 * - Hint Section (100px): Hint text with lightbulb icon
 * - Control Panel (280px): Action buttons, info bar, side controls
 * - Progress Bar (60px): Word progress and category description
 * - TV Effects: Confetti, light reflections, timer warnings
 *
 * Fully responsive and accessible design
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const skipWord = useGameStore((state) => state.skipWord);
  const nextWord = useGameStore((state) => state.nextWord);
  const setTransition = useGameStore((state) => state.setTransition);
  const endGame = useGameStore((state) => state.endGame);

  // Settings
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

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

  // Timer tick effect
  useEffect(() => {
    if (!session || session.isPaused || session.state !== 'playing') return;

    const interval = setInterval(() => {
      tick();

      // PRD 4.6: Play tick sound in last 10 seconds
      const activeParticipant = session.participants[session.activeParticipantIndex];
      const remaining =
        activeParticipant.totalTimeSeconds - activeParticipant.elapsedTimeSeconds - 1;
      if (remaining <= 10 && remaining > 0) {
        soundService.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, tick]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!session || session.isPaused || session.isInTransition) return;

      const activeParticipant = session.participants[session.activeParticipantIndex];
      const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

      // Guard: No current word
      if (!currentWord) return;

      switch (e.code) {
        case 'KeyH':
          if (!currentWord.hasMadeGuess) {
            handleRevealLetter();
          }
          break;
        case 'KeyD':
          handleGuess(true);
          break;
        case 'KeyY':
          handleGuess(false);
          break;
        case 'KeyP':
          setShowSkipModal(true);
          break;
        case 'KeyM':
          // Toggle sound (PRD 11.2)
          soundService.toggle();
          break;
        case 'Space':
          e.preventDefault();
          handlePause();
          break;
        case 'Escape':
          e.preventDefault();
          setShowHomeModal(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session]);

  // Skip Modal keyboard shortcuts (PRD 11.3)
  useEffect(() => {
    if (!showSkipModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSkipModal]);

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
    // Find all hidden letters
    const hiddenIndices = currentWord.letters
      .map((letter, index) => (letter.status === 'hidden' ? index : -1))
      .filter((index) => index !== -1);

    // Pick a random hidden letter
    if (hiddenIndices.length > 0 && !currentWord.hasMadeGuess) {
      const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      revealLetter(session.activeParticipantIndex, activeParticipant.currentWordIndex, randomIndex);

      // Play pop sound (PRD 4.6)
      soundService.playPop();
    }
  };

  const handleGuess = (isCorrect: boolean) => {
    // Guard: Prevent multiple guess submissions during transition
    if (session.isInTransition) {
      return;
    }

    const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

    // Guard: Prevent guess on invalid word
    if (!currentWord || currentWord.result !== null) {
      return;
    }

    submitGuess(session.activeParticipantIndex, activeParticipant.currentWordIndex, isCorrect);

    if (isCorrect) {
      // Correct answer: Show confetti, pause timer, wait 3s, move to next word
      setShowConfetti(true);
      setTransition(true); // Pause timer
      soundService.playSuccess();

      setTimeout(() => {
        setTransition(false); // Resume timer
        nextWord(); // Move to next word
      }, 3000); // 3 seconds to see confetti
    } else {
      // Wrong answer: Show animation
      setShowIncorrect(true);
      soundService.playError();

      // Check if this was the last guess
      const wasLastGuess = currentWord.remainingGuesses === 1; // Will become 0 after submitGuess

      setTimeout(() => {
        setShowIncorrect(false);
      }, 600);

      if (wasLastGuess) {
        // Last wrong guess: Auto-skip after showing word
        setTransition(true); // Pause timer
        setTimeout(() => {
          setTransition(false); // Resume timer
          nextWord(); // Move to next word
        }, 2000); // 2 seconds to see the revealed word
      }
      // If not last guess, don't transition - player can keep guessing
    }
  };

  const handleSkip = () => {
    // Guard: Prevent skip during transition
    if (session.isInTransition) {
      return;
    }

    const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];
    
    // Guard: Prevent skip on invalid word
    if (!currentWord || currentWord.result !== null) {
      return;
    }

    setShowSkipModal(false);
    skipWord(session.activeParticipantIndex, activeParticipant.currentWordIndex);
    soundService.playWhoosh();

    // Skip: Show revealed word, pause timer, wait 2s, move to next word
    setTransition(true); // Pause timer
    setTimeout(() => {
      setTransition(false); // Resume timer
      nextWord(); // Move to next word
    }, 2000); // 2 seconds to see the revealed word
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

  // Determine word status for visual feedback
  const wordStatus = showIncorrect
    ? 'incorrect'
    : currentWord.result === 'found'
      ? 'correct'
      : 'idle';

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col">
      {/* Floating Header - Dynamic height */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
        style={{ height: 'clamp(80px, 12vh, 120px)' }}
      >
        <div className="pt-4 md:pt-6">
          <GameHeader
            categoryName={session.categoryName}
            categoryEmoji={session.categoryEmoji}
            remainingSeconds={remainingSeconds}
            totalSeconds={session.totalTimeSeconds}
            currentScore={activeParticipant.score}
            wordsCompleted={activeParticipant.currentWordIndex + 1}
            totalWords={14}
            activeParticipantName={activeParticipant.name}
            activeParticipantType={activeParticipant.type}
            activeParticipantColor={undefined} // Optional: Team colors not yet implemented
            activeParticipantEmoji={undefined} // Optional: Team emojis not yet implemented
            gameMode={session.mode}
          />
        </div>
      </div>

      {/* Word Spotlight - Hero Area - Dynamic content area */}
      <main
        className="flex-1 flex items-center justify-center px-4"
        style={{
          paddingTop: 'clamp(80px, 12vh, 120px)',
          paddingBottom: 'clamp(180px, 25vh, 280px)',
        }}
      >
        <section className="w-full max-w-5xl mx-auto">
          {/* Word Area */}
          <WordArea letters={currentWord.letters} wordStatus={wordStatus} />

          {/* Hint Section */}
          <div
            className="mt-4 md:mt-6 lg:mt-8"
            style={{ maxHeight: 'clamp(60px, 10vh, 100px)' }}
          >
            <HintSection hint={currentWord.hint} />
          </div>
        </section>
      </main>

      {/* Floating Control Panel - Dynamic height */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4"
        style={{
          bottom: 'clamp(60px, 10vh, 80px)',
          height: 'clamp(100px, 15vh, 180px)',
        }}
      >
        <ControlPanel
          onRevealLetter={handleRevealLetter}
          onGuessCorrect={() => handleGuess(true)}
          onGuessWrong={() => handleGuess(false)}
          onSkip={() => setShowSkipModal(true)}
          onPause={handlePause}
          onToggleSound={handleToggleSound}
          onHome={handleHome}
          canRevealLetter={
            !currentWord.hasMadeGuess && currentWord.letters.some((l) => l.status === 'hidden')
          }
          canGuess={currentWord.remainingGuesses > 0}
          canSkip={true}
          isInTransition={session.isInTransition}
          soundEnabled={soundEnabled}
          remainingGuesses={currentWord.remainingGuesses}
          lettersRevealed={currentWord.lettersRevealed}
          remainingPoints={calculateRemainingPoints()}
        />
      </div>

      {/* Progress Bar - Bottom Edge - Dynamic height */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{ height: 'clamp(50px, 8vh, 70px)' }}
      >
        <ProgressBar
          currentWord={activeParticipant.currentWordIndex + 1}
          totalWords={activeParticipant.words.length}
          categoryDescription={session.categoryName}
        />
      </div>

      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Pause Overlay */}
      <AnimatePresence>
        {session.isPaused && <PauseOverlay onResume={handleResume} onHome={confirmHome} />}
      </AnimatePresence>

      {/* Skip Modal */}
      <Modal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        title="Kelimeyi Pas Geç"
      >
        <div className="space-y-6">
          <p className="text-lg text-neutral-300 text-center">
            Bu kelimeyi geçmek istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-neutral-400 text-center">Kelimeyi geçerseniz puan alamazsınız</p>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleSkip} variant="destructive" size="lg" className="h-16">
              Evet, Geç
            </Button>
            <Button
              onClick={() => setShowSkipModal(false)}
              variant="secondary"
              size="lg"
              className="h-16"
            >
              İptal
            </Button>
          </div>
        </div>
      </Modal>

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
