/**
 * Placeholder Screens
 * These will be implemented in their respective tasks
 */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useGameStore } from '../../store/gameStore';
import { useCategoryStore } from '../../store/categoryStore';
import { ResultsSinglePlayer } from './ResultsSinglePlayer';
import { ResultsMultiplayer } from './ResultsMultiplayer';
import { ResultsTeamMode } from './ResultsTeamMode';
import { ROUTES } from '../../routes/constants';
import type { TeamModeSetup } from '../../types';

interface PlaceholderScreenProps {
  title: string;
  description: string;
  taskNumber?: string;
}

function PlaceholderScreen({ title, description, taskNumber }: PlaceholderScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>

        <Card className="p-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-slate-400 mb-8">{description}</p>
          {taskNumber && (
            <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg">
              {taskNumber} ile implement edilecek
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Category Selection - Task 09
export function CategorySelectScreen() {
  return (
    <PlaceholderScreen
      title="📚 Kategori Seçimi"
      description="Yarışma için bir kategori seçin"
      taskNumber="Task 09"
    />
  );
}

// Mode Selection - Task 10
export function ModeSelectScreen() {
  return (
    <PlaceholderScreen
      title="🎮 Oyun Modu Seçimi"
      description="Tek yarışmacı, çoklu yarışmacı veya takım modu seçin"
      taskNumber="Task 10"
    />
  );
}

// Results Screen - Task 20-22
export function ResultsScreen() {
  const session = useGameStore((state) => state.session);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameSetup = useCategoryStore((state) => state.gameSetup);
  const navigate = useNavigate();

  // If there's an active session that's finished, show results
  if (session && session.state === 'finished') {
    // Single player mode
    if (session.mode === 'single') {
      const handlePlayAgain = () => {
        resetGame();
        navigate(ROUTES.CATEGORY_SELECT);
      };

      return <ResultsSinglePlayer session={session} onPlayAgain={handlePlayAgain} />;
    }

    // Multiplayer mode
    if (session.mode === 'multi') {
      const handlePlayAgain = () => {
        resetGame();
        navigate(ROUTES.CATEGORY_SELECT);
      };

      return <ResultsMultiplayer session={session} onPlayAgain={handlePlayAgain} />;
    }

    // Team mode
    if (session.mode === 'team') {
      const handlePlayAgain = () => {
        resetGame();
        navigate(ROUTES.CATEGORY_SELECT);
      };

      // Get team info from gameSetup
      const teams = (gameSetup as TeamModeSetup)?.teams || [];

      return (
        <ResultsTeamMode
          session={session}
          teams={teams}
          onPlayAgain={handlePlayAgain}
        />
      );
    }
  }

  // No session - show placeholder
  return (
    <PlaceholderScreen
      title="🏆 Sonuçlar"
      description="Yarışma sonuçları ve istatistikler"
      taskNumber="Task 20-22"
    />
  );
}

// History List - Task 23
// History Screen - Task 23 - IMPLEMENTED (see GameHistoryScreen.tsx)

// History Detail - Task 24
export function HistoryDetailScreen() {
  const { id } = useParams();
  return (
    <PlaceholderScreen
      title={`📊 Yarışma Detayı #${id}`}
      description="Yarışma detayları ve istatistikler"
      taskNumber="Task 24"
    />
  );
}

// Category Management - Task 25
// MOVED TO: src/components/screens/CategoryManagementScreen.tsx

// Word Management - Task 27
export function WordManagementScreen() {
  const { categoryId } = useParams();
  return (
    <PlaceholderScreen
      title={`📝 Kelime Yönetimi (Kategori #${categoryId})`}
      description="Kategorideki kelimeleri yönet"
      taskNumber="Task 27"
    />
  );
}

// Settings - Task 31
export function SettingsScreen() {
  return (
    <PlaceholderScreen
      title="⚙️ Ayarlar"
      description="Uygulama ayarları: ses, tema, dil"
      taskNumber="Task 31"
    />
  );
}

// How to Play - Task 32
export function HowToPlayScreen() {
  return (
    <PlaceholderScreen
      title="ℹ️ Nasıl Oynanır?"
      description="Oyun kuralları ve kullanım kılavuzu"
      taskNumber="Task 32"
    />
  );
}
