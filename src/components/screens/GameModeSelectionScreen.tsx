/**
 * Game Mode Selection Screen
 * Task 10: Game Mode Selection
 * PRD Reference: Section 4.3 - Mode Selection
 * Design Reference: ui-ux-design.md#game-mode-selection
 *
 * Allows users to select a game mode after choosing a category:
 * - 3 large mode cards: Single Player, Multiplayer, Team
 * - Mode validation based on category word count
 * - Disabled modes shown with tooltip explaining requirements
 * - Back button to category selection
 * - Forward navigation to participant setup
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { ModeCard } from '../ModeCard';
import { useCategoryStore } from '../../store/categoryStore';
import { ROUTES } from '../../routes/constants';
import { validateAllModes } from '../../utils/modeValidation';
import type { GameMode } from '../../types';

/**
 * GameModeSelectionScreen - Mode selection page
 *
 * Features:
 * - Display 3 large mode cards (Single, Multi, Team)
 * - Validate each mode against category word count
 * - Disable modes with insufficient words
 * - Show warning tooltips for disabled modes
 * - Back button to category selection
 * - Stagger entrance animation
 * - Redirect if no category selected
 */
export function GameModeSelectionScreen() {
  const navigate = useNavigate();
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedMode = useCategoryStore((state) => state.setSelectedMode);

  // Redirect if no category selected
  useEffect(() => {
    if (!selectedCategory) {
      console.warn('No category selected, redirecting to category selection');
      navigate(ROUTES.CATEGORY_SELECT);
    }
  }, [selectedCategory, navigate]);

  // Get validation data from store
  const getValidation = useCategoryStore((state) => state.getValidation);

  // Validate all modes based on category word count
  const modeValidations = useMemo(() => {
    if (!selectedCategory) return [];

    // Get validation data for selected category
    const validation = getValidation(selectedCategory.id);
    const wordCount = validation?.total_words || 0;

    return validateAllModes(wordCount);
  }, [selectedCategory, getValidation]);

  // Handle mode selection
  const handleModeSelect = (mode: GameMode) => {
    const validation = modeValidations.find((v) => v.mode === mode);
    if (validation && validation.enabled) {
      setSelectedMode(mode);
      navigate(ROUTES.PARTICIPANT_SETUP);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    setSelectedMode(null);
    navigate(ROUTES.CATEGORY_SELECT);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Don't render if no category (will redirect)
  if (!selectedCategory) {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-container max-w-[1600px] mx-auto h-full flex flex-col py-6 md:py-8">
        {/* Header */}
        <header className="space-y-6 md:space-y-8 mb-8 md:mb-12">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex items-center gap-2"
                aria-label="Kategori seçimine dön"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">Geri</span>
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                  Oyun Modu Seçin
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mt-2">
                  {selectedCategory.emoji} {selectedCategory.name}
                </p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-base md:text-lg text-slate-300 max-w-3xl">
            Oyun modunu seçin. Her mod için minimum kelime sayısı gereklidir. Yetersiz kelimeleri olan
            modlar devre dışı bırakılmıştır.
          </p>
        </header>

        {/* Main Content - Mode Cards */}
        <main className="flex-1 flex items-start">
          <motion.div
            className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {modeValidations.map((validation) => (
              <motion.div
                key={validation.mode}
                variants={cardVariants}
                className="flex"
              >
                <ModeCard
                  mode={validation.mode}
                  enabled={validation.enabled}
                  requiredWords={validation.requiredWords}
                  availableWords={validation.availableWords}
                  onSelect={() => handleModeSelect(validation.mode)}
                />
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* Footer - Navigation Help */}
        <footer className="mt-8 md:mt-12 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>Bir mod seçin veya geri dönün</p>
            <p className="hidden md:block">
              Klavye: <kbd className="px-2 py-1 bg-slate-800 rounded">Tab</kbd> ile gezin,
              <kbd className="px-2 py-1 bg-slate-800 rounded ml-2">Enter</kbd> ile seçin
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
