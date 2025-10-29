/**
 * Category Validation Demo
 * Task 29: Category Validation
 *
 * Interactive demo to test category validation logic and UI
 */

import { useState } from 'react';
import { ValidationResult } from '../types/database';
import { CategoryValidationPanel } from '../components/CategoryValidationPanel';
import { ValidationBadge } from '../components/ValidationBadge';
import { Button } from '../components/ui/Button';
import {
  enrichValidationResult,
  formatValidationMessage,
  canSupportSetup,
  getPlayableModes,
} from '../utils/categoryValidation';

// Test data samples
const testCategories: { name: string; validation: ValidationResult }[] = [
  {
    name: 'Tam Geçerli (140 kelime)',
    validation: {
      is_valid: true,
      total_words: 140,
      words_by_length: [
        { letter_count: 4, count: 20 },
        { letter_count: 5, count: 20 },
        { letter_count: 6, count: 20 },
        { letter_count: 7, count: 20 },
        { letter_count: 8, count: 20 },
        { letter_count: 9, count: 20 },
        { letter_count: 10, count: 20 },
      ],
      max_players_single: 1,
      max_players_multi: 10,
      max_teams: 10,
      message: '✅ 10 yarışmacıya/takıma kadar oynanabilir (140 kelime)',
    },
  },
  {
    name: 'Sınırlı (14 kelime)',
    validation: {
      is_valid: true,
      total_words: 14,
      words_by_length: [
        { letter_count: 4, count: 2 },
        { letter_count: 5, count: 2 },
        { letter_count: 6, count: 2 },
        { letter_count: 7, count: 2 },
        { letter_count: 8, count: 2 },
        { letter_count: 9, count: 2 },
        { letter_count: 10, count: 2 },
      ],
      max_players_single: 1,
      max_players_multi: 1,
      max_teams: 1,
      message: '✅ Sadece tek yarışmacı modu için oynanabilir (14 kelime)',
    },
  },
  {
    name: 'Geçersiz (10 kelime)',
    validation: {
      is_valid: false,
      total_words: 10,
      words_by_length: [
        { letter_count: 4, count: 2 },
        { letter_count: 5, count: 2 },
        { letter_count: 6, count: 2 },
        { letter_count: 7, count: 2 },
        { letter_count: 8, count: 1 },
        { letter_count: 9, count: 1 },
        { letter_count: 10, count: 0 },
      ],
      max_players_single: 0,
      max_players_multi: 0,
      max_teams: 0,
      message: '❌ Oynanamaz: En az 14 kelime gerekli (mevcut: 10)',
    },
  },
  {
    name: '3 Kişilik (42 kelime)',
    validation: {
      is_valid: true,
      total_words: 42,
      words_by_length: [
        { letter_count: 4, count: 6 },
        { letter_count: 5, count: 6 },
        { letter_count: 6, count: 6 },
        { letter_count: 7, count: 6 },
        { letter_count: 8, count: 6 },
        { letter_count: 9, count: 6 },
        { letter_count: 10, count: 6 },
      ],
      max_players_single: 1,
      max_players_multi: 3,
      max_teams: 3,
      message: '✅ 3 yarışmacıya/takıma kadar oynanabilir (42 kelime)',
    },
  },
];

export function CategoryValidationDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(true);

  const current = testCategories[selectedIndex];
  const enriched = enrichValidationResult(current.validation);
  const playableModes = getPlayableModes(current.validation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Kategori Validasyon Demo</h1>
          <p className="text-lg text-slate-300">Task 29: Category Validation - Test & Preview</p>
        </div>

        {/* Category Selector */}
        <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Kategorisi Seç</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testCategories.map((cat, index) => (
              <Button
                key={index}
                variant={selectedIndex === index ? 'primary' : 'secondary'}
                onClick={() => setSelectedIndex(index)}
                className="h-auto py-4 text-center"
              >
                <span className="text-sm font-medium">{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-4">
          <span className="text-white font-medium">Detayları Göster</span>
          <Button
            variant={showDetails ? 'primary' : 'secondary'}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Gizle' : 'Göster'}
          </Button>
        </div>

        {/* Demo Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Validation Panel */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Validation Panel</h2>
            <CategoryValidationPanel
              validation={current.validation}
              showModeDetails={showDetails}
            />
          </div>

          {/* Right: Info & Tests */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Validation Info</h2>

            {/* Badge Preview */}
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Badge Preview</h3>
              <div className="flex gap-4">
                <ValidationBadge validation={current.validation} />
                <ValidationBadge validation={current.validation} compact />
              </div>
            </div>

            {/* Enriched Data */}
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Enriched Data</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Indicator Type:</span>
                  <span
                    className={`
                    font-bold
                    ${enriched.indicatorType === 'success' ? 'text-emerald-400' : ''}
                    ${enriched.indicatorType === 'warning' ? 'text-yellow-400' : ''}
                    ${enriched.indicatorType === 'error' ? 'text-red-400' : ''}
                  `}
                  >
                    {enriched.indicatorType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Badge Label:</span>
                  <span className="text-white">{enriched.badgeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Words:</span>
                  <span className="text-white">{enriched.totalWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Insufficient Lengths:</span>
                  <span className="text-white">
                    {enriched.insufficientLengths.length > 0
                      ? enriched.insufficientLengths.join(', ')
                      : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Playable Modes */}
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Playable Modes</h3>
              <div className="flex flex-wrap gap-2">
                {playableModes.length > 0 ? (
                  playableModes.map((mode) => (
                    <span
                      key={mode}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-sm font-medium"
                    >
                      {mode === 'single' ? '👤 Tek' : mode === 'multi' ? '👥 Çoklu' : '🏆 Takım'}
                    </span>
                  ))
                ) : (
                  <span className="text-red-400 text-sm">Oynanabilir mod yok</span>
                )}
              </div>
            </div>

            {/* Function Tests */}
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Function Tests</h3>
              <div className="space-y-2 text-sm">
                {/* Test canSupportSetup */}
                <div>
                  <p className="text-slate-400 mb-1">canSupportSetup:</p>
                  <div className="space-y-1 ml-4">
                    <p
                      className={
                        canSupportSetup(current.validation, 'single', 1)
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }
                    >
                      Single (1): {canSupportSetup(current.validation, 'single', 1) ? '✓' : '✗'}
                    </p>
                    <p
                      className={
                        canSupportSetup(current.validation, 'multi', 2)
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }
                    >
                      Multi (2): {canSupportSetup(current.validation, 'multi', 2) ? '✓' : '✗'}
                    </p>
                    <p
                      className={
                        canSupportSetup(current.validation, 'team', 2)
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }
                    >
                      Team (2): {canSupportSetup(current.validation, 'team', 2) ? '✓' : '✗'}
                    </p>
                  </div>
                </div>

                {/* Test formatValidationMessage */}
                <div>
                  <p className="text-slate-400 mb-1">formatValidationMessage:</p>
                  <div className="space-y-1 ml-4 text-slate-300">
                    <p>{formatValidationMessage(current.validation, 'single', 1)}</p>
                    <p>{formatValidationMessage(current.validation, 'multi', 3)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Messages */}
            <div className="bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Mode Messages</h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-semibold text-white">Single:</span>{' '}
                  {enriched.modeMessages.single}
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-white">Multi:</span>{' '}
                  {enriched.modeMessages.multi}
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-white">Team:</span>{' '}
                  {enriched.modeMessages.team}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
