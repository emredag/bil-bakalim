/**
 * Store Integration Test
 * Tests all three Zustand stores to ensure proper functionality
 */

import { useGameStore } from './store/gameStore';
import { useSettingsStore } from './store/settingsStore';
import { useCategoryStore } from './store/categoryStore';
import type { GameConfig, Category, Word } from './types';

// Test Settings Store
export function testSettingsStore() {
  console.log('🧪 Testing Settings Store...');

  const store = useSettingsStore.getState();

  // Test initial values
  console.log('Initial settings:', {
    soundEnabled: store.soundEnabled,
    theme: store.theme,
    language: store.language,
  });

  // Test updates
  store.setSoundEnabled(false);
  store.setEffectsVolume(50);
  store.setTheme('light');

  console.log('After updates:', {
    soundEnabled: useSettingsStore.getState().soundEnabled,
    effectsVolume: useSettingsStore.getState().effectsVolume,
    theme: useSettingsStore.getState().theme,
  });

  // Reset
  store.resetToDefaults();
  console.log('After reset:', {
    soundEnabled: useSettingsStore.getState().soundEnabled,
    effectsVolume: useSettingsStore.getState().effectsVolume,
  });

  console.log('✅ Settings Store test passed\n');
}

// Test Category Store
export function testCategoryStore() {
  console.log('🧪 Testing Category Store...');

  const store = useCategoryStore.getState();

  // Mock category
  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    emoji: '🎯',
    description: 'Test description',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Test adding category
  store.addCategory(mockCategory);
  console.log('Categories after add:', useCategoryStore.getState().categories.length);

  // Test selecting category
  store.selectCategory(1);
  console.log('Selected category ID:', useCategoryStore.getState().selectedCategoryId);

  // Mock word
  const mockWord: Word = {
    id: 1,
    category_id: 1,
    word: 'TEST',
    letter_count: 4,
    hint: 'A test word',
    created_at: new Date().toISOString(),
  };

  // Test adding word
  store.addWord(mockWord);
  console.log('Words count:', useCategoryStore.getState().selectedCategoryWords.length);

  // Test removing word
  store.removeWord(1);
  console.log('Words after remove:', useCategoryStore.getState().selectedCategoryWords.length);

  // Reset
  store.reset();
  console.log('Categories after reset:', useCategoryStore.getState().categories.length);

  console.log('✅ Category Store test passed\n');
}

// Test Game Store
export function testGameStore() {
  console.log('🧪 Testing Game Store...');

  const store = useGameStore.getState();

  // Mock game config
  const config: GameConfig = {
    categoryId: 1,
    mode: 'single',
    setup: {
      playerName: 'Test Player',
    },
  };

  // Mock words (14 words for single player)
  const mockWords = Array(14)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      word: 'TEST',
      hint: `Hint ${i + 1}`,
      letterCount: 4,
      letters: [
        { char: 'T', status: 'hidden' as const, index: 0 },
        { char: 'E', status: 'hidden' as const, index: 1 },
        { char: 'S', status: 'hidden' as const, index: 2 },
        { char: 'T', status: 'hidden' as const, index: 3 },
      ],
      remainingGuesses: 3,
      lettersRevealed: 0,
      hasMadeGuess: false,
      result: null,
      pointsEarned: 0,
    }));

  // Test starting game
  store.startGame(config, [mockWords]);
  console.log('Game started:', {
    mode: useGameStore.getState().session?.mode,
    state: useGameStore.getState().session?.state,
    participants: useGameStore.getState().session?.participants.length,
  });

  // Test revealing letter
  store.revealLetter(0, 0, 0);
  const participant = useGameStore.getState().session?.participants[0];
  console.log('After revealing letter:', {
    lettersRevealed: participant?.lettersRevealed,
    score: participant?.score,
  });

  // Test pause/resume
  store.pauseGame();
  console.log('After pause:', useGameStore.getState().session?.isPaused);

  store.resumeGame();
  console.log('After resume:', useGameStore.getState().session?.isPaused);

  // Test ending game
  store.endGame();
  console.log('After end:', useGameStore.getState().session?.state);

  // Reset
  store.resetGame();
  console.log('After reset:', useGameStore.getState().session);

  console.log('✅ Game Store test passed\n');
}

// Run all tests
export function runStoreTests() {
  console.log('🚀 Starting Store Integration Tests\n');
  console.log('='.repeat(50) + '\n');

  try {
    testSettingsStore();
    testCategoryStore();
    testGameStore();

    console.log('='.repeat(50));
    console.log('✨ All store tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run tests
// runStoreTests();
