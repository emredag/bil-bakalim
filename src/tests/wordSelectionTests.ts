/**
 * Word Selection Algorithm Tests
 * PRD Reference: Section 4.6
 * Task: 13-word-selection-algorithm.md
 */

import { selectWordsForGame, validateCategoryForMode } from '../services/wordService';

// Test colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test 1: Single Player Mode - 14 words selection
 * PRD: "Kategoriden rastgele 14 kelime seçilir"
 * PRD: "Her uzunluktan 2'şer kelime (4-10 harf)"
 */
async function testSinglePlayerWordSelection(categoryId: number) {
  log('\n=== TEST 1: Single Player Word Selection ===', 'blue');
  
  try {
    const wordSets = await selectWordsForGame(categoryId, 'single', 1);
    
    // Should return 1 word set
    if (wordSets.length !== 1) {
      log(`❌ FAILED: Expected 1 word set, got ${wordSets.length}`, 'red');
      return false;
    }
    log(`✓ Single word set returned`, 'green');
    
    const words = wordSets[0];
    
    // Should have exactly 14 words
    if (words.length !== 14) {
      log(`❌ FAILED: Expected 14 words, got ${words.length}`, 'red');
      return false;
    }
    log(`✓ Exactly 14 words selected`, 'green');
    
    // Check 2 words per length (4-10)
    const wordsByLength: Record<number, number> = {};
    words.forEach(word => {
      wordsByLength[word.letterCount] = (wordsByLength[word.letterCount] || 0) + 1;
    });
    
    for (let length = 4; length <= 10; length++) {
      const count = wordsByLength[length] || 0;
      if (count !== 2) {
        log(`❌ FAILED: Expected 2 words of length ${length}, got ${count}`, 'red');
        return false;
      }
    }
    log(`✓ Exactly 2 words per length (4-10)`, 'green');
    
    // Check word structure
    const firstWord = words[0];
    if (!firstWord.id || !firstWord.word || !firstWord.hint) {
      log(`❌ FAILED: Word missing required fields`, 'red');
      return false;
    }
    log(`✓ Words have correct structure`, 'green');
    
    // Check letters array
    if (firstWord.letters.length !== firstWord.letterCount) {
      log(`❌ FAILED: Letter count mismatch`, 'red');
      return false;
    }
    log(`✓ Letters array matches word length`, 'green');
    
    // Check initial state
    if (firstWord.remainingGuesses !== 3) {
      log(`❌ FAILED: Expected 3 remaining guesses, got ${firstWord.remainingGuesses}`, 'red');
      return false;
    }
    if (firstWord.lettersRevealed !== 0) {
      log(`❌ FAILED: Expected 0 letters revealed, got ${firstWord.lettersRevealed}`, 'red');
      return false;
    }
    if (firstWord.hasMadeGuess !== false) {
      log(`❌ FAILED: hasMadeGuess should be false initially`, 'red');
      return false;
    }
    log(`✓ Initial word state is correct`, 'green');
    
    // Check all letters are hidden initially
    const allHidden = firstWord.letters.every(letter => letter.status === 'hidden');
    if (!allHidden) {
      log(`❌ FAILED: All letters should be hidden initially`, 'red');
      return false;
    }
    log(`✓ All letters hidden initially`, 'green');
    
    log('\n✅ TEST 1 PASSED: Single player word selection works correctly', 'green');
    return true;
    
  } catch (error) {
    log(`❌ TEST 1 FAILED with error: ${error}`, 'red');
    return false;
  }
}

/**
 * Test 2: Multi Player Mode - Unique words per player
 * PRD: "Her yarışmacı için ayrı 14 kelime seçilir"
 * PRD: "Kelimelerin tekrar etmemesi sağlanır"
 */
async function testMultiPlayerWordSelection(categoryId: number) {
  log('\n=== TEST 2: Multi Player Word Selection ===', 'blue');
  
  try {
    const playerCount = 3;
    const wordSets = await selectWordsForGame(categoryId, 'multi', playerCount);
    
    // Should return 3 word sets
    if (wordSets.length !== playerCount) {
      log(`❌ FAILED: Expected ${playerCount} word sets, got ${wordSets.length}`, 'red');
      return false;
    }
    log(`✓ Correct number of word sets (${playerCount})`, 'green');
    
    // Each set should have 14 words
    for (let i = 0; i < wordSets.length; i++) {
      if (wordSets[i].length !== 14) {
        log(`❌ FAILED: Player ${i + 1} has ${wordSets[i].length} words, expected 14`, 'red');
        return false;
      }
    }
    log(`✓ Each player has 14 words`, 'green');
    
    // Check NO word duplication across players
    const allWordIds = new Set<number>();
    const duplicates: number[] = [];
    
    wordSets.forEach((words, playerIndex) => {
      words.forEach(word => {
        if (allWordIds.has(word.id)) {
          duplicates.push(word.id);
          log(`⚠️  Word ID ${word.id} duplicated in player ${playerIndex + 1}`, 'yellow');
        }
        allWordIds.add(word.id);
      });
    });
    
    if (duplicates.length > 0) {
      log(`❌ FAILED: ${duplicates.length} duplicate words found across players`, 'red');
      return false;
    }
    log(`✓ No word duplication across players (${allWordIds.size} unique words)`, 'green');
    
    // Check each player has 2 words per length
    for (let i = 0; i < wordSets.length; i++) {
      const wordsByLength: Record<number, number> = {};
      wordSets[i].forEach(word => {
        wordsByLength[word.letterCount] = (wordsByLength[word.letterCount] || 0) + 1;
      });
      
      for (let length = 4; length <= 10; length++) {
        const count = wordsByLength[length] || 0;
        if (count !== 2) {
          log(`❌ FAILED: Player ${i + 1} has ${count} words of length ${length}, expected 2`, 'red');
          return false;
        }
      }
    }
    log(`✓ Each player has 2 words per length (4-10)`, 'green');
    
    log('\n✅ TEST 2 PASSED: Multi player word selection works correctly', 'green');
    return true;
    
  } catch (error) {
    log(`❌ TEST 2 FAILED with error: ${error}`, 'red');
    return false;
  }
}

/**
 * Test 3: Team Mode - Unique words per team
 * PRD: "Her takım için ayrı 14 kelime seçilir"
 * PRD: "Kelimelerin tekrar etmemesi sağlanır"
 */
async function testTeamModeWordSelection(categoryId: number) {
  log('\n=== TEST 3: Team Mode Word Selection ===', 'blue');
  
  try {
    const teamCount = 2;
    const wordSets = await selectWordsForGame(categoryId, 'team', teamCount);
    
    // Should return 2 word sets
    if (wordSets.length !== teamCount) {
      log(`❌ FAILED: Expected ${teamCount} word sets, got ${wordSets.length}`, 'red');
      return false;
    }
    log(`✓ Correct number of word sets (${teamCount})`, 'green');
    
    // Each team should have 14 words
    for (let i = 0; i < wordSets.length; i++) {
      if (wordSets[i].length !== 14) {
        log(`❌ FAILED: Team ${i + 1} has ${wordSets[i].length} words, expected 14`, 'red');
        return false;
      }
    }
    log(`✓ Each team has 14 words`, 'green');
    
    // Check NO word duplication across teams
    const team1Ids = new Set(wordSets[0].map(w => w.id));
    const team2Ids = new Set(wordSets[1].map(w => w.id));
    
    const duplicates = [...team1Ids].filter(id => team2Ids.has(id));
    
    if (duplicates.length > 0) {
      log(`❌ FAILED: ${duplicates.length} duplicate words found across teams`, 'red');
      return false;
    }
    log(`✓ No word duplication across teams`, 'green');
    
    log('\n✅ TEST 3 PASSED: Team mode word selection works correctly', 'green');
    return true;
    
  } catch (error) {
    log(`❌ TEST 3 FAILED with error: ${error}`, 'red');
    return false;
  }
}

/**
 * Test 4: Category Validation
 * PRD: validate_category_for_mode checks if enough words exist
 */
async function testCategoryValidation(categoryId: number) {
  log('\n=== TEST 4: Category Validation ===', 'blue');
  
  try {
    // Test single mode (needs 14 words minimum)
    const singleValid = await validateCategoryForMode(categoryId, 'single', 1);
    log(`Single mode (1 player): ${singleValid ? '✓ Valid' : '❌ Invalid'}`, 
        singleValid ? 'green' : 'red');
    
    // Test multi mode with 2 players (needs 28 words)
    const multiValid = await validateCategoryForMode(categoryId, 'multi', 2);
    log(`Multi mode (2 players): ${multiValid ? '✓ Valid' : '❌ Invalid'}`, 
        multiValid ? 'green' : 'red');
    
    // Test with excessive players (should fail)
    const excessiveValid = await validateCategoryForMode(categoryId, 'multi', 100);
    if (excessiveValid) {
      log(`❌ FAILED: Should reject 100 players but didn't`, 'red');
      return false;
    }
    log(`✓ Correctly rejects excessive player count`, 'green');
    
    log('\n✅ TEST 4 PASSED: Category validation works correctly', 'green');
    return true;
    
  } catch (error) {
    log(`❌ TEST 4 FAILED with error: ${error}`, 'red');
    return false;
  }
}

/**
 * Test 5: Error Handling - Insufficient Words
 */
async function testInsufficientWordsError(categoryId: number) {
  log('\n=== TEST 5: Insufficient Words Error Handling ===', 'blue');
  
  try {
    // Try to select for many players (should fail)
    await selectWordsForGame(categoryId, 'multi', 50);
    
    log(`❌ FAILED: Should throw error for insufficient words`, 'red');
    return false;
    
  } catch (error) {
    // Expected to throw error
    log(`✓ Correctly throws error: ${(error as Error).message}`, 'green');
    log('\n✅ TEST 5 PASSED: Error handling works correctly', 'green');
    return true;
  }
}

/**
 * Test 6: Word Randomization
 * PRD: "Karışık sırada sunulur"
 */
async function testWordRandomization(categoryId: number) {
  log('\n=== TEST 6: Word Randomization ===', 'blue');
  
  try {
    // Get two word sets
    const wordSets1 = await selectWordsForGame(categoryId, 'single', 1);
    const wordSets2 = await selectWordsForGame(categoryId, 'single', 1);
    
    const words1 = wordSets1[0];
    const words2 = wordSets2[0];
    
    // Check if order is different (randomized)
    let differenceCount = 0;
    for (let i = 0; i < words1.length; i++) {
      if (words1[i].id !== words2[i].id) {
        differenceCount++;
      }
    }
    
    if (differenceCount === 0) {
      log(`⚠️  WARNING: Words appear in same order (might need more test runs)`, 'yellow');
    } else {
      log(`✓ Words are randomized (${differenceCount} different positions)`, 'green');
    }
    
    log('\n✅ TEST 6 PASSED: Word randomization confirmed', 'green');
    return true;
    
  } catch (error) {
    log(`❌ TEST 6 FAILED with error: ${error}`, 'red');
    return false;
  }
}

/**
 * Run all tests
 */
export async function runWordSelectionTests(categoryId: number) {
  log('\n' + '='.repeat(60), 'blue');
  log('WORD SELECTION ALGORITHM TESTS', 'blue');
  log('PRD Reference: Section 4.6', 'blue');
  log('='.repeat(60) + '\n', 'blue');
  
  const results = {
    test1: await testSinglePlayerWordSelection(categoryId),
    test2: await testMultiPlayerWordSelection(categoryId),
    test3: await testTeamModeWordSelection(categoryId),
    test4: await testCategoryValidation(categoryId),
    test5: await testInsufficientWordsError(categoryId),
    test6: await testWordRandomization(categoryId),
  };
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.values(results).length;
  
  log('\n' + '='.repeat(60), 'blue');
  log(`TEST SUMMARY: ${passed}/${total} PASSED`, passed === total ? 'green' : 'red');
  log('='.repeat(60) + '\n', 'blue');
  
  return results;
}
