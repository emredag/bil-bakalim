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
import { useGameStore } from '../../store/gameStore';
import { soundService } from '../../services';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const session = useGameStore((state) => state.session);
  const tick = useGameStore((state) => state.tick);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const revealLetter = useGameStore((state) => state.revealLetter);
  const submitGuess = useGameStore((state) => state.submitGuess);
  const skipWord = useGameStore((state) => state.skipWord);
  const endGame = useGameStore((state) => state.endGame);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);

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
      const remaining = session.totalTimeSeconds - session.elapsedTimeSeconds - 1;
      if (remaining <= 10 && remaining > 0) {
        soundService.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, tick]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!session || session.isPaused) return;

      const activeParticipant = session.participants[session.activeParticipantIndex];
      const currentWord = activeParticipant.words[activeParticipant.currentWordIndex];

      switch (e.code) {
        case 'KeyH':
          if (!currentWord.hasMadeGuess) {
            handleRevealLetter();
          }
          break;
        case 'KeyT':
          setShowGuessModal(true);
          break;
        case 'KeyP':
          setShowSkipModal(true);
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

  const remainingSeconds = session.totalTimeSeconds - session.elapsedTimeSeconds;

  // Calculate remaining points for current word
  const calculateRemainingPoints = (): number => {
    const basePoints = currentWord.letterCount * 1000;
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
    setShowGuessModal(false);
    submitGuess(session.activeParticipantIndex, activeParticipant.currentWordIndex, isCorrect);
    
    if (isCorrect) {
      setShowConfetti(true);
      // Play success sound (PRD 4.6)
      soundService.playSuccess();
    } else {
      // Play error sound (PRD 4.6)
      soundService.playError();
    }
  };

  const handleSkip = () => {
    setShowSkipModal(false);
    skipWord(session.activeParticipantIndex, activeParticipant.currentWordIndex);
    // Play whoosh sound (PRD 4.6)
    soundService.playWhoosh();
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleResume = () => {
    resumeGame();
  };

  const handleToggleSound = () => {
    toggleSound();
  };

  const handleHome = () => {
    setShowHomeModal(true);
  };

  const confirmHome = () => {
    endGame();
    navigate('/');
  };

  // Determine word status for visual feedback
  const wordStatus = currentWord.result === 'found' ? 'correct' : 'idle';

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <GameHeader
        categoryName={session.categoryName}
        categoryEmoji={session.categoryEmoji}
        remainingSeconds={remainingSeconds}
        totalSeconds={session.totalTimeSeconds}
        currentScore={activeParticipant.score}
        wordsCompleted={activeParticipant.currentWordIndex}
        totalWords={14}
        activeParticipantName={activeParticipant.name}
        activeParticipantType={activeParticipant.type}
        activeParticipantColor={undefined} // TODO: Get from team data
        activeParticipantEmoji={undefined} // TODO: Get from team data
        gameMode={session.mode}
      />

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        {/* Word Area */}
        <WordArea letters={currentWord.letters} wordStatus={wordStatus} />

        {/* Hint Section */}
        <div className="px-4 md:px-6 lg:px-8 py-2">
          <HintSection hint={currentWord.hint} />
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        onRevealLetter={handleRevealLetter}
        onGuess={() => setShowGuessModal(true)}
        onSkip={() => setShowSkipModal(true)}
        onPause={handlePause}
        onToggleSound={handleToggleSound}
        onHome={handleHome}
        canRevealLetter={!currentWord.hasMadeGuess && currentWord.letters.some((l) => l.status === 'hidden')}
        canGuess={currentWord.remainingGuesses > 0}
        canSkip={true}
        soundEnabled={session.soundEnabled}
        remainingGuesses={currentWord.remainingGuesses}
        lettersRevealed={currentWord.lettersRevealed}
        remainingPoints={calculateRemainingPoints()}
      />

      {/* Progress Bar */}
      <ProgressBar
        currentWord={activeParticipant.currentWordIndex + 1}
        totalWords={14}
        categoryDescription={session.categoryName}
      />

      {/* Confetti Effect */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Pause Overlay */}
      <AnimatePresence>
        {session.isPaused && <PauseOverlay onResume={handleResume} onHome={confirmHome} />}
      </AnimatePresence>

      {/* Guess Modal */}
      <Modal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
        title="Tahmininiz Doğru mu?"
      >
        <div className="space-y-6">
          <p className="text-lg text-slate-300 text-center">
            Kelimeyi doğru bildiğinizden emin misiniz?
          </p>
          <p className="text-sm text-amber-400 text-center">
            ⚠️ Yanlış tahmin yaparsanız 1 hak kaybedersiniz
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleGuess(true)}
              variant="primary"
              size="lg"
              className="h-16"
            >
              ✓ Doğru
            </Button>
            <Button
              onClick={() => handleGuess(false)}
              variant="destructive"
              size="lg"
              className="h-16"
            >
              ✗ Yanlış
            </Button>
          </div>
          <Button
            onClick={() => setShowGuessModal(false)}
            variant="secondary"
            size="md"
            className="w-full"
          >
            İptal
          </Button>
        </div>
      </Modal>

      {/* Skip Modal */}
      <Modal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        title="Kelimeyi Pas Geç"
      >
        <div className="space-y-6">
          <p className="text-lg text-slate-300 text-center">
            Bu kelimeyi geçmek istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-slate-400 text-center">
            Kelimeyi geçerseniz puan alamazsınız
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleSkip}
              variant="destructive"
              size="lg"
              className="h-16"
            >
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
      <Modal
        isOpen={showHomeModal}
        onClose={() => setShowHomeModal(false)}
        title="Ana Menüye Dön"
      >
        <div className="space-y-6">
          <p className="text-lg text-slate-300 text-center">
            Ana menüye dönmek istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-red-400 text-center">
            ⚠️ Oyun ilerlemesi kaydedilmeyecek
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={confirmHome}
              variant="destructive"
              size="lg"
              className="h-16"
            >
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
