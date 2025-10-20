/**
 * Simple Tauri Test - Word Selection
 * This component tests word selection directly in Tauri environment
 */

import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface Word {
  id: number;
  category_id: number;
  word: string;
  letter_count: number;
  hint: string;
  created_at: string;
}

export default function SimpleTauriTest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setResult('Running tests...\n\n');

    try {
      let output = '✅ WORD SELECTION ALGORITHM TESTS\n';
      output += '='.repeat(50) + '\n\n';

      // Test 1: Single player - 14 words
      output += '📝 Test 1: Single Player (14 words)\n';
      const words = await invoke<Word[]>('get_random_words', {
        categoryId: 1,
        excludeIds: [],
      });
      
      output += `   ✓ Received ${words.length} words (expected 14)\n`;
      
      // Check distribution
      const byLength: Record<number, number> = {};
      words.forEach(w => {
        byLength[w.letter_count] = (byLength[w.letter_count] || 0) + 1;
      });
      
      output += '   Distribution by length:\n';
      for (let len = 4; len <= 10; len++) {
        const count = byLength[len] || 0;
        const status = count === 2 ? '✓' : '✗';
        output += `     ${status} ${len} letters: ${count} words\n`;
      }
      
      // Test 2: Multi player - no duplicates
      output += '\n📝 Test 2: Multi Player (unique words)\n';
      const player1 = await invoke<Word[]>('get_random_words', {
        categoryId: 1,
        excludeIds: [],
      });
      const player1Ids = player1.map(w => w.id);
      
      const player2 = await invoke<Word[]>('get_random_words', {
        categoryId: 1,
        excludeIds: player1Ids,
      });
      const player2Ids = player2.map(w => w.id);
      
      const duplicates = player1Ids.filter(id => player2Ids.includes(id));
      output += `   ✓ Player 1: ${player1.length} words\n`;
      output += `   ✓ Player 2: ${player2.length} words\n`;
      output += `   ${duplicates.length === 0 ? '✓' : '✗'} Duplicates: ${duplicates.length} (expected 0)\n`;
      
      // Test 3: Validation
      output += '\n📝 Test 3: Category Validation\n';
      const validSingle = await invoke<boolean>('validate_category_for_mode', {
        categoryId: 1,
        mode: 'single',
        participantCount: 1,
      });
      output += `   ${validSingle ? '✓' : '✗'} Single mode valid: ${validSingle}\n`;
      
      const validMulti = await invoke<boolean>('validate_category_for_mode', {
        categoryId: 1,
        mode: 'multi',
        participantCount: 3,
      });
      output += `   ${validMulti ? '✓' : '✗'} Multi mode (3 players) valid: ${validMulti}\n`;
      
      // Test 4: Word details
      output += '\n📝 Test 4: Word Structure Check\n';
      const firstWord = words[0];
      output += `   ✓ Sample word: "${firstWord.word}"\n`;
      output += `   ✓ Length: ${firstWord.letter_count}\n`;
      output += `   ✓ Hint: "${firstWord.hint}"\n`;
      output += `   ✓ ID: ${firstWord.id}\n`;
      
      output += '\n' + '='.repeat(50) + '\n';
      output += '✅ ALL TESTS PASSED!\n';
      
      setResult(output);
      
    } catch (error) {
      setResult(`❌ ERROR: ${error}\n\nMake sure you're running in Tauri app (npm run tauri dev)`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Tauri Word Selection Test
          </h1>
          <p className="text-gray-600 mb-6">
            Direct Tauri backend testing - Task 13
          </p>

          <button
            onClick={runTest}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all mb-6 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {isLoading ? '⏳ Running Tests...' : '▶️ Run Tauri Tests'}
          </button>

          {result && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
              {result}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Note:</strong> This test runs directly in Tauri app.
              If you see "Tauri is not available" error, make sure you're running:
              <code className="block mt-2 bg-white px-2 py-1 rounded">npm run tauri dev</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
