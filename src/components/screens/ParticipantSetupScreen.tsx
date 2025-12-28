/**
 * ParticipantSetupScreen
 * Task 11: Participant/Team Setup
 * PRD Reference: Section 4.4 - Participant/Team Configuration
 * Design Reference: ui-ux-design.md#participant-team-setup
 *
 * Main screen for configuring participants based on selected game mode:
 * - Single Player: Name input
 * - Multiplayer: 2-6 players with add/remove and reordering
 * - Team: 2-4 teams with members and team configuration
 *
 * Shows word count validation and enables Start button only when valid
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCategoryStore } from '../../store/categoryStore';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { selectWordsForGame } from '../../services';
import { ROUTES } from '../../routes/constants';
import { SinglePlayerForm } from '../forms/SinglePlayerForm';
import { MultiPlayerForm } from '../forms/MultiPlayerForm';
import { TeamForm } from '../forms/TeamForm';
import { ValidationSummary } from '../ValidationSummary';
import type { SinglePlayerSetup, MultiPlayerSetup, TeamModeSetup } from '../../types';
import type { ValidationResult } from '../../utils/participantValidation';
import { canStartGame } from '../../utils/participantValidation';

/**
 * ParticipantSetupScreen Component
 *
 * Features:
 * - Mode-based form rendering (single/multi/team)
 * - Real-time validation
 * - Word count requirement display
 * - Start button (enabled only when valid)
 * - Back navigation to mode selection
 * - Responsive layout
 * - Accessible navigation
 */
export function ParticipantSetupScreen() {
  const navigate = useNavigate();

  // Store state
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const selectedMode = useCategoryStore((state) => state.selectedMode);
  const setGameSetup = useCategoryStore((state) => state.setGameSetup);
  const clearGameSetup = useCategoryStore((state) => state.clearGameSetup);
  const setSelectedMode = useCategoryStore((state) => state.setSelectedMode);
  const startGame = useGameStore((state) => state.startGame);
  const getValidation = useCategoryStore((state) => state.getValidation);

  // Initialize default setup based on mode
  const initializeSetup = (): SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null => {
    if (!selectedMode) return null;

    // Always start fresh - don't use previous gameSetup
    // Return default setup for each mode
    switch (selectedMode) {
      case 'single':
        return { playerName: '' } as SinglePlayerSetup;
      case 'multi':
        return { players: ['', ''] } as MultiPlayerSetup;
      case 'team':
        return {
          teams: [
            {
              name: '',
              emoji: '🔴',
              color: '#ef4444',
              members: [
                { name: '', order: 1 },
                { name: '', order: 2 },
              ],
            },
            {
              name: '',
              emoji: '🔵',
              color: '#3b82f6',
              members: [
                { name: '', order: 1 },
                { name: '', order: 2 },
              ],
            },
          ],
        } as TeamModeSetup;
      default:
        return null;
    }
  };

  // Local validation state
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [currentSetup, setCurrentSetup] = useState<
    SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup | null
  >(initializeSetup);

  // Redirect if no category or mode selected
  useEffect(() => {
    if (!selectedCategory) {
      console.warn('No category selected, redirecting to category selection');
      navigate(ROUTES.CATEGORY_SELECT);
      return;
    }

    if (!selectedMode) {
      console.warn('No mode selected, redirecting to mode selection');
      navigate(ROUTES.MODE_SELECT);
      return;
    }
  }, [selectedCategory, selectedMode, navigate]);

  // Get available word count
  const availableWords = useMemo(() => {
    if (!selectedCategory) return 0;
    const categoryValidation = getValidation(selectedCategory.id);
    return categoryValidation?.total_words || 0;
  }, [selectedCategory, getValidation]);

  // Handle form changes (memoized to prevent infinite loops)
  const handleSetupChange = useCallback(
    (
      setup: SinglePlayerSetup | MultiPlayerSetup | TeamModeSetup,
      newValidation: ValidationResult
    ) => {
      setCurrentSetup(setup);
      setValidation(newValidation);
      setGameSetup(setup);
    },
    [setGameSetup]
  );

  // Handle back navigation
  const handleBack = () => {
    clearGameSetup(); // Clear form data when going back
    setSelectedMode(null);
    navigate(ROUTES.MODE_SELECT);
  };

  // Handle start game
  const handleStartGame = async () => {
    if (!selectedCategory || !selectedMode || !currentSetup) {
      console.error('Missing required data for starting game');
      return;
    }

    // Final validation check
    if (!canStartGame(selectedMode, currentSetup, availableWords)) {
      console.error('Cannot start game: validation failed');
      return;
    }

    try {
      // Calculate participant count based on mode
      const participantCount =
        selectedMode === 'single'
          ? 1
          : selectedMode === 'multi'
            ? (currentSetup as MultiPlayerSetup).players.length
            : (currentSetup as TeamModeSetup).teams.length;

      // Select words for the game (Task 13)
      const wordSets = await selectWordsForGame(
        selectedCategory.id,
        selectedMode,
        participantCount
      );

      // Transform words to GameWord format for gameStore
      const gameWords = wordSets.map((wordSet) =>
        wordSet.map((word) => ({
          id: word.id,
          word: word.word,
          letterCount: word.letterCount,
          hint: word.hint,
          letters: word.word.split('').map((char, index) => ({
            char,
            index,
            status: 'hidden' as const,
          })),
          lettersRevealed: 0,
          hasMadeGuess: false,
          result: null,
          pointsEarned: 0,
        }))
      );

      // Create game config with all required data
      const gameConfig = {
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        categoryEmoji: selectedCategory.emoji,
        mode: selectedMode,
        setup: currentSetup,
        gameDuration: useSettingsStore.getState().gameDuration,
      };

      // Start game in gameStore
      startGame(gameConfig, gameWords);

      // Save setup and navigate to game screen
      setGameSetup(currentSetup);
      navigate(ROUTES.GAME);
    } catch (error: any) {
      console.error('Failed to start game:', error);
      // Show detailed error to the user for debugging (will include Tauri invoke errors)
      const message = error?.message || String(error) || 'Bilinmeyen hata';
      alert(`Oyun başlatılamadı: ${message}`);
    }
  };

  // Check if can start
  const isValid = useMemo(() => {
    if (!selectedMode || !currentSetup || !validation) return false;
    return validation.isValid && canStartGame(selectedMode, currentSetup, availableWords);
  }, [selectedMode, currentSetup, availableWords, validation]);

  // Don't render if missing required data
  if (!selectedCategory || !selectedMode) {
    return null;
  }

  // Mode title mapping
  const modeTitles = {
    single: 'Tek Yarışmacı',
    multi: 'Çoklu Yarışmacı',
    team: 'Takım Modu',
  };

  return (
    <div className="relative min-h-screen overflow-y-auto bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 hero-mesh-overlay opacity-20 pointer-events-none" />

      <div className="relative safe-container max-w-[1400px] mx-auto flex flex-col py-6 md:py-8 z-10">
        {/* Header */}
        <header className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                icon={<ArrowLeft className="w-5 h-5" />}
                aria-label="Mod seçimine dön"
              >
                <span className="hidden md:inline">Geri</span>
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                  Yarışmacı Ayarları
                </h1>
                <p className="text-lg md:text-xl text-neutral-400 mt-2 flex items-center gap-2">
                  <span className="text-2xl">{selectedCategory.emoji}</span>
                  <span>{selectedCategory.name}</span>
                  <span className="text-neutral-600">•</span>
                  <span>{modeTitles[selectedMode]}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-base md:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            Yarışmacı bilgilerini girin. Tüm bilgiler doğru girildikten sonra oyunu
            başlatabilirsiniz.
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Render appropriate form based on mode */}
              {selectedMode === 'single' && (
                <SinglePlayerForm
                  initialSetup={currentSetup as SinglePlayerSetup}
                  availableWords={availableWords}
                  onChange={handleSetupChange}
                />
              )}

              {selectedMode === 'multi' && (
                <MultiPlayerForm
                  initialSetup={currentSetup as MultiPlayerSetup}
                  availableWords={availableWords}
                  onChange={handleSetupChange}
                />
              )}

              {selectedMode === 'team' && (
                <TeamForm
                  initialSetup={currentSetup as TeamModeSetup}
                  availableWords={availableWords}
                  onChange={handleSetupChange}
                />
              )}
            </motion.div>
          </div>

          {/* Right: Validation Summary & Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-6 lg:sticky lg:top-8"
            >
              {/* Validation Summary */}
              {validation && (
                <ValidationSummary
                  requiredWords={validation.requiredWords}
                  availableWords={validation.availableWords}
                  showDetails
                />
              )}

              {/* Error Messages */}
              {validation && validation.errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error-500/15 border-2 border-error-500/30 rounded-xl p-5 backdrop-blur-sm"
                >
                  <h4 className="text-error-300 font-semibold mb-3 text-base">
                    Düzeltilmesi Gerekenler:
                  </h4>
                  <ul className="space-y-2 text-sm text-error-200">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-error-400 mt-0.5">•</span>
                        <span className="leading-relaxed">{error}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Start Button */}
              <Button
                variant="primary"
                onClick={handleStartGame}
                disabled={!isValid}
                icon={<Play className="w-6 h-6" />}
                className="w-full !py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Oyunu başlat"
              >
                Oyunu Başlat
              </Button>

              {/* Help Text */}
              {!isValid && (
                <p className="text-sm text-neutral-400 text-center leading-relaxed">
                  Oyunu başlatmak için tüm bilgileri eksiksiz doldurun
                </p>
              )}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-6 md:mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <p>Bilgileri girin veya geri dönün</p>
            <p className="hidden md:block">
              Klavye: <kbd className="px-2 py-1 bg-neutral-800/50 rounded border border-neutral-700">Tab</kbd> ile gezin
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
