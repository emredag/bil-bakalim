/**
 * Manual Word Selection Algorithm Tests - Direct Tauri Command Testing
 * This script can be run in Tauri dev console or via Node
 */

// Test script for manual verification
console.log(`
===========================================
MANUAL TEST INSTRUCTIONS
===========================================

1. Open Tauri app Developer Console (Cmd+Option+I on Mac)
2. Navigate to: http://localhost:1420/word-selection-test
3. Click "Run Tests" button
4. Check console for detailed results

OR

Run these commands directly in Tauri console:

// Test 1: Get random words for single player
const { invoke } = window.__TAURI__.core;
const words = await invoke('get_random_words', { categoryId: 1, excludeIds: [] });
console.log('Single player words:', words.length, 'words');

// Test 2: Validate category
const isValid = await invoke('validate_category_for_mode', { 
  categoryId: 1, 
  mode: 'single', 
  participantCount: 1 
});
console.log('Category valid for single mode:', isValid);

// Test 3: Multi player (check no duplicates)
const player1Words = await invoke('get_random_words', { categoryId: 1, excludeIds: [] });
const player1Ids = player1Words.map(w => w.id);
const player2Words = await invoke('get_random_words', { categoryId: 1, excludeIds: player1Ids });
const player2Ids = player2Words.map(w => w.id);
const duplicates = player1Ids.filter(id => player2Ids.includes(id));
console.log('Duplicates between players:', duplicates.length, '(should be 0)');

===========================================
`);

export {};
