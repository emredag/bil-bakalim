/**
 * Placeholder Screens
 * These will be implemented in their respective tasks
 */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

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

// Game Screen - Task 12
export function GameScreen() {
  return (
    <PlaceholderScreen
      title="🎯 Oyun Ekranı"
      description="Kelime tahmin oyunu burada oynanacak"
      taskNumber="Task 12"
    />
  );
}

// Results Screen - Task 20-22
export function ResultsScreen() {
  return (
    <PlaceholderScreen
      title="🏆 Sonuçlar"
      description="Yarışma sonuçları ve istatistikler"
      taskNumber="Task 20-22"
    />
  );
}

// History List - Task 23
export function HistoryScreen() {
  return (
    <PlaceholderScreen
      title="📊 Geçmiş Yarışmalar"
      description="Önceki yarışmaların listesi"
      taskNumber="Task 23"
    />
  );
}

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
export function CategoryManagementScreen() {
  return (
    <PlaceholderScreen
      title="📚 Kategori Yönetimi"
      description="Kategorileri ekle, düzenle, sil"
      taskNumber="Task 25"
    />
  );
}

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
