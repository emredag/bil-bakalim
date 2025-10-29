/**
 * Test Page for ResultsTeamMode Component
 *
 * Mock data with 3 teams:
 * - Winner: Mavi Takım (180 points, 9 words found)
 * - 2nd: Kırmızı Takım (160 points, 8 words found)
 * - 3rd: Yeşil Takım (140 points, 7 words found)
 *
 * Test route: /results-test-team
 */

import { useNavigate } from 'react-router-dom';
import { ResultsTeamMode } from './ResultsTeamMode';
import type { GameSession, Team, GameWord } from '../../types';
import { TEAM_COLORS } from '../ui/TeamChip';

export function ResultsTestTeam() {
  const navigate = useNavigate();

  // Mock words for each team (14 words per team)
  const createMockWords = (foundCount: number, skippedCount: number): GameWord[] => {
    const words: GameWord[] = [];
    const wordTemplates = [
      { word: 'KEDI', letterCount: 4, hint: 'Miyavlayan hayvan' },
      { word: 'KÖPEK', letterCount: 5, hint: 'Sadık dost' },
      { word: 'BALINA', letterCount: 6, hint: 'Denizin en büyüğü' },
      { word: 'FİL', letterCount: 3, hint: 'Hortumlu hayvan' },
      { word: 'ASLAN', letterCount: 5, hint: 'Ormanın kralı' },
      { word: 'KARTAL', letterCount: 6, hint: 'Gökyüzünün efendisi' },
      { word: 'BAYKUŞ', letterCount: 6, hint: 'Gece uçan kuş' },
      { word: 'KELEBEK', letterCount: 7, hint: 'Renkli kanatlı böcek' },
      { word: 'PENGUEN', letterCount: 7, hint: 'Buzullarda yaşar' },
      { word: 'ZÜRAFa', letterCount: 6, hint: 'Uzun boyunlu' },
      { word: 'TAVŞAN', letterCount: 6, hint: 'Havuç sever' },
      { word: 'KIRPI', letterCount: 5, hint: 'Dikenli hayvan' },
      { word: 'SİNCaP', letterCount: 6, hint: 'Ağaçlarda yaşar' },
      { word: 'FARE', letterCount: 4, hint: 'Küçük kemirgen' },
    ];

    for (let i = 0; i < 14; i++) {
      const template = wordTemplates[i] || wordTemplates[0];
      const isFound = i < foundCount;
      const isSkipped = !isFound && i < foundCount + skippedCount;

      words.push({
        id: i + 1,
        word: template.word,
        hint: template.hint,
        letterCount: template.letterCount,
        letters: Array.from(template.word).map((char, idx) => ({
          char,
          status: isFound || idx < 2 ? 'revealed' : 'hidden',
          index: idx,
        })),
        remainingGuesses: isFound ? 0 : 3,
        lettersRevealed: isFound ? 0 : 2,
        hasMadeGuess: isFound,
        result: isFound ? 'found' : isSkipped ? 'skipped' : null,
        pointsEarned: isFound ? 500 - template.letterCount * 100 : 0,
      });
    }

    return words;
  };

  // Mock teams data
  const mockTeams: Team[] = [
    {
      name: 'Mavi Takım',
      emoji: '🔵',
      color: TEAM_COLORS[0], // Blue
      members: [
        { name: 'Ahmet', order: 1 },
        { name: 'Mehmet', order: 2 },
        { name: 'Ali', order: 3 },
      ],
    },
    {
      name: 'Kırmızı Takım',
      emoji: '🔴',
      color: TEAM_COLORS[4], // Red
      members: [
        { name: 'Ayşe', order: 1 },
        { name: 'Fatma', order: 2 },
      ],
    },
    {
      name: 'Yeşil Takım',
      emoji: '🟢',
      color: TEAM_COLORS[2], // Emerald
      members: [
        { name: 'Zeynep', order: 1 },
        { name: 'Veli', order: 2 },
        { name: 'Can', order: 3 },
      ],
    },
  ];

  // Mock game session
  const mockSession: GameSession = {
    id: 'mock-team-session-001',
    categoryId: 1,
    categoryName: 'Hayvanlar',
    categoryEmoji: '🐾',
    mode: 'team',
    state: 'finished',
    participants: [
      {
        name: 'Mavi Takım',
        type: 'team',
        score: 1800, // 9 words × 200 avg
        wordsFound: 9,
        wordsSkipped: 3,
        lettersRevealed: 12,
        currentWordIndex: 14,
        words: createMockWords(9, 3),
        isActive: false,
        elapsedTimeSeconds: 280,
        totalTimeSeconds: 300,
      },
      {
        name: 'Kırmızı Takım',
        type: 'team',
        score: 1600, // 8 words × 200 avg
        wordsFound: 8,
        wordsSkipped: 4,
        lettersRevealed: 16,
        currentWordIndex: 14,
        words: createMockWords(8, 4),
        isActive: false,
        elapsedTimeSeconds: 290,
        totalTimeSeconds: 300,
      },
      {
        name: 'Yeşil Takım',
        type: 'team',
        score: 1400, // 7 words × 200 avg
        wordsFound: 7,
        wordsSkipped: 5,
        lettersRevealed: 20,
        currentWordIndex: 14,
        words: createMockWords(7, 5),
        isActive: false,
        elapsedTimeSeconds: 295,
        totalTimeSeconds: 300,
      },
    ],
    activeParticipantIndex: 0,
    totalTimeSeconds: 300,
    elapsedTimeSeconds: 280,
    isPaused: false,
    startedAt: new Date(Date.now() - 280000).toISOString(),
    finishedAt: new Date().toISOString(),
  };

  const handlePlayAgain = () => {
    console.log('[ResultsTestTeam] Play again clicked');
    navigate('/category-select');
  };

  return (
    <div>
      {/* Debug info (only in dev) */}
      <div className="fixed top-2 right-2 bg-black/80 text-white text-xs p-2 rounded z-50">
        <div>Test: Team Results</div>
        <div>Teams: {mockSession.participants.length}</div>
        <div>Winner: {mockSession.participants[0].name}</div>
      </div>

      <ResultsTeamMode session={mockSession} teams={mockTeams} onPlayAgain={handlePlayAgain} />
    </div>
  );
}
