/**
 * Word Selection Test Runner Component
 * This component provides a UI to run word selection algorithm tests
 */

import { useState } from 'react';
import { runWordSelectionTests } from '../tests/wordSelectionTests';

export default function WordSelectionTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [categoryId, setCategoryId] = useState(1);

  const handleRunTests = async () => {
    setIsRunning(true);
    console.clear();
    
    console.log('🚀 Starting Word Selection Algorithm Tests...\n');
    console.log(`Using Category ID: ${categoryId}\n`);
    
    try {
      await runWordSelectionTests(categoryId);
    } catch (error) {
      console.error('Test execution failed:', error);
    }
    
    console.log('\n✨ Tests completed! Check the console for detailed results.\n');
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Word Selection Algorithm Tests
          </h1>
          <p className="text-gray-600 mb-6">
            Task 13 - PRD Reference: Section 4.6
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category ID to Test
              </label>
              <input
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                disabled={isRunning}
              />
              <p className="text-sm text-gray-500 mt-1">
                Make sure this category has enough words (minimum 14, each length 4-10 needs at least 2 words)
              </p>
            </div>

            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isRunning ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Running Tests...
                </span>
              ) : (
                '▶️ Run Tests'
              )}
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Test Coverage:
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 1:</strong> Single player - 14 words, 2 per length (4-10)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 2:</strong> Multi player - unique words per player, no duplicates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 3:</strong> Team mode - unique words per team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 4:</strong> Category validation for different modes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 5:</strong> Error handling for insufficient words</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span><strong>Test 6:</strong> Word randomization</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>📋 Note:</strong> Open the browser console (F12) to see detailed test results with color-coded output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
