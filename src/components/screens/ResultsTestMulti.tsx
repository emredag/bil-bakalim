import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ResultsMultiplayer } from './ResultsMultiplayer';
import type { GameSession } from '../../types/game';

/**
 * Test page for multiplayer results screen
 */
export default function ResultsTestMulti() {
  const navigate = useNavigate();

  // Mock session with 5 players, including tie scenarios
  // Using simplified word data with type assertion for testing
  const mockSession: GameSession = {
    id: 'test-multi-123',
    categoryId: 1,
    categoryName: 'Hayvanlar',
    categoryEmoji: '🐾',
    mode: 'multi',
    state: 'finished',
    participants: [
      {
        id: 'p1',
        name: 'Ahmet',
        score: 180,
        wordsFound: 9,
        wordsSkipped: 1,
        words: [
          { word: 'KEDİ', result: 'found', letterCount: 4 },
          { word: 'KÖPEK', result: 'found', letterCount: 5 },
          { word: 'ASLAN', result: 'found', letterCount: 5 },
          { word: 'KAPLAN', result: 'found', letterCount: 6 },
          { word: 'FİL', result: 'found', letterCount: 3 },
          { word: 'ZEBRa', result: 'found', letterCount: 5 },
          { word: 'ZÜRAFFA', result: 'timeout', letterCount: 7 },
          { word: 'TIMSAH', result: 'found', letterCount: 6 },
          { word: 'YILAN', result: 'found', letterCount: 5 },
          { word: 'KAPLUMBAĞA', result: 'found', letterCount: 10 },
          { word: 'KARTAL', result: 'skipped', letterCount: 6 },
        ] as any,
      },
      {
        id: 'p2',
        name: 'Zeynep',
        score: 160,
        wordsFound: 8,
        wordsSkipped: 2,
        words: [
          { word: 'AYI', result: 'found', letterCount: 3 },
          { word: 'KIRPI', result: 'found', letterCount: 5 },
          { word: 'SINCAP', result: 'found', letterCount: 6 },
          { word: 'TAVŞAN', result: 'found', letterCount: 6 },
          { word: 'KUZU', result: 'found', letterCount: 4 },
          { word: 'KOYUN', result: 'found', letterCount: 5 },
          { word: 'AT', result: 'found', letterCount: 2 },
          { word: 'INEK', result: 'found', letterCount: 4 },
          { word: 'DOMUZ', result: 'skipped', letterCount: 5 },
          { word: 'TAVUK', result: 'skipped', letterCount: 5 },
        ] as any,
      },
      {
        id: 'p3',
        name: 'Mehmet',
        score: 160,
        wordsFound: 8,
        wordsSkipped: 1,
        words: [
          { word: 'BALIK', result: 'found', letterCount: 5 },
          { word: 'KÖPEKbalığı', result: 'found', letterCount: 11 },
          { word: 'YUNUS', result: 'found', letterCount: 5 },
          { word: 'VALİNA', result: 'timeout', letterCount: 6 },
          { word: 'AHTAPOT', result: 'found', letterCount: 7 },
          { word: 'YENGEÇ', result: 'found', letterCount: 6 },
          { word: 'İSTAKOZ', result: 'found', letterCount: 7 },
          { word: 'MİDYE', result: 'found', letterCount: 5 },
          { word: 'KARIDES', result: 'found', letterCount: 7 },
          { word: 'ORFOZ', result: 'skipped', letterCount: 5 },
        ] as any,
      },
      {
        id: 'p4',
        name: 'Ayşe',
        score: 140,
        wordsFound: 7,
        wordsSkipped: 2,
        words: [
          { word: 'KELEBEK', result: 'found', letterCount: 7 },
          { word: 'ARI', result: 'found', letterCount: 3 },
          { word: 'SİNEK', result: 'found', letterCount: 5 },
          { word: 'KARINCA', result: 'found', letterCount: 7 },
          { word: 'ÇEKIRGE', result: 'found', letterCount: 7 },
          { word: 'BÖCEK', result: 'found', letterCount: 5 },
          { word: 'UĞURBÖCEĞI', result: 'found', letterCount: 10 },
          { word: 'YUSUFcuk', result: 'skipped', letterCount: 8 },
          { word: 'ATEŞBÖCEĞI', result: 'skipped', letterCount: 10 },
        ] as any,
      },
      {
        id: 'p5',
        name: 'Fatma',
        score: 120,
        wordsFound: 6,
        wordsSkipped: 3,
        words: [
          { word: 'KARGA', result: 'found', letterCount: 5 },
          { word: 'GÜVERCIN', result: 'found', letterCount: 8 },
          { word: 'SERÇE', result: 'found', letterCount: 5 },
          { word: 'MARTı', result: 'found', letterCount: 5 },
          { word: 'PAPAĞAN', result: 'found', letterCount: 7 },
          { word: 'MUHABBET', result: 'found', letterCount: 8 },
          { word: 'BAYKUŞ', result: 'skipped', letterCount: 6 },
          { word: 'KUZGUN', result: 'skipped', letterCount: 6 },
          { word: 'ŞAHİN', result: 'skipped', letterCount: 5 },
        ] as any,
      },
    ] as any,
    activeParticipantIndex: 0,
    totalTimeSeconds: 120,
    elapsedTimeSeconds: 240,
    isPaused: false,
    soundEnabled: true,
    startedAt: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
    finishedAt: new Date().toISOString(),
  };

  const handlePlayAgain = () => {
    console.log('Play again clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
          Çoklu Yarışmacı Sonuçları - Test
        </h1>
        <p className="text-white/60 mt-2">
          Test senaryosu: 5 yarışmacı, 1. sıra Ahmet (180 puan, 9 kelime), 2-3. sırada beraberlik (Zeynep vs Mehmet, 160 puan ama farklı kelime sayısı)
        </p>
      </div>

      {/* Results Component */}
      <div className="max-w-7xl mx-auto">
        <ResultsMultiplayer session={mockSession} onPlayAgain={handlePlayAgain} />
      </div>
    </div>
  );
}
