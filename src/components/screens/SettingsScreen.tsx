/**
 * Settings Screen - Application Settings Management
 * Task 31: Settings Screen
 * PRD Reference: Section 6 - Settings Screen
 *
 * Features:
 * - General Settings (sound, language)
 * - Game Settings (time, guesses, animation speed)
 * - Data Management (backup, restore, reset)
 * - About Section (version, license, links)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Database,
  Info,
  Download,
  Upload,
  Trash2,
  Clock,
  Target,
  Github,
  FileCode,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { soundService } from '../../services';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Toggle,
  Select,
  Modal,
  useToast,
} from '../ui';
import {
  backupDatabase,
  restoreDatabase,
  resetAllData,
  getDatabaseSize,
  formatBytes,
} from '../../api/database';
import { ROUTES } from '../../routes/constants';
import { useKeyboardShortcuts } from '../../hooks';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Global keyboard shortcuts (PRD Section 11.1)
  useKeyboardShortcuts();

  // Settings from store
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const effectsVolume = useSettingsStore((state) => state.effectsVolume);
  const animationSpeed = useSettingsStore((state) => state.animationSpeed);

  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setEffectsVolume = useSettingsStore((state) => state.setEffectsVolume);
  const setAnimationSpeed = useSettingsStore((state) => state.setAnimationSpeed);

  // Local state
  const [dbSize, setDbSize] = useState<number>(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load database size on mount
  useEffect(() => {
    loadDatabaseSize();
  }, []);

  const loadDatabaseSize = async () => {
    try {
      const size = await getDatabaseSize();
      setDbSize(size);
    } catch (error) {
      console.error('Failed to get database size:', error);
    }
  };

  // Handlers
  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) {
      soundService.playPop(); // Test sound
    }
    toast.showToast(enabled ? 'Sesler açıldı' : 'Sesler kapatıldı', 'success');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);
    setEffectsVolume(volume);

    // Play test sound at new volume
    if (soundEnabled) {
      soundService.playClick();
    }
  };

  const handleAnimationSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    setAnimationSpeed(speed);
    toast.showToast(
      `Animasyon hızı: ${speed === 'slow' ? 'Yavaş' : speed === 'normal' ? 'Normal' : 'Hızlı'}`,
      'success'
    );
  };

  const handleBackup = async () => {
    setIsProcessing(true);
    try {
      await backupDatabase();
      toast.showToast('Veritabanı başarıyla yedeklendi', 'success');
      loadDatabaseSize();
    } catch (error: any) {
      if (error.message !== 'Backup cancelled') {
        toast.showToast('Yedekleme başarısız oldu', 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      await restoreDatabase();
      toast.showToast('Veritabanı geri yüklendi. Uygulama yeniden başlatılıyor...', 'success');

      // Reload the app after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      if (error.message !== 'Restore cancelled') {
        toast.showToast('Geri yükleme başarısız oldu', 'error');
      }
      setIsProcessing(false);
    }
  };

  const handleResetConfirm = async () => {
    setIsProcessing(true);
    try {
      await resetAllData();
      setShowResetConfirm(false);
      toast.showToast('Tüm veriler sıfırlandı', 'success');

      // Navigate to home after reset
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (error) {
      toast.showToast('Sıfırlama başarısız oldu', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleBack}
            aria-label="Ana menüye dön"
          >
            Geri
          </Button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-100">⚙️ Ayarlar</h1>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Genel Ayarlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sound Toggle */}
            <Toggle
              checked={soundEnabled}
              onChange={handleSoundToggle}
              label="Ses Efektleri"
              description="Oyun seslerini aç/kapat"
            />

            {/* Volume Slider */}
            {soundEnabled && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-neutral-100">
                  {effectsVolume > 0 ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                  Ses Seviyesi: {effectsVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effectsVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-3 bg-neutral-700 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary-600
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary-600
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            )}

            {/* Language (static) */}
            <div className="space-y-2">
              <label className="block text-base md:text-lg font-semibold text-neutral-100">Dil</label>
              <div className="px-4 py-3 bg-neutral-700/50 border-2 border-neutral-600 rounded-lg text-neutral-300">
                🇹🇷 Türkçe
              </div>
              <p className="text-sm text-neutral-400">Şu anda sadece Türkçe dil desteği mevcuttur</p>
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Oyun Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Time (read-only) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-neutral-100">
                <Clock className="w-5 h-5" />
                Varsayılan Süre
              </label>
              <div className="px-4 py-3 bg-neutral-700/50 border-2 border-neutral-600 rounded-lg text-neutral-300">
                5 dakika (300 saniye)
              </div>
              <p className="text-sm text-neutral-400">Oyun kuralları gereği değiştirilemez</p>
            </div>

            {/* Default Guesses (read-only) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-neutral-100">
                <Target className="w-5 h-5" />
                Varsayılan Tahmin Hakkı
              </label>
              <div className="px-4 py-3 bg-neutral-700/50 border-2 border-neutral-600 rounded-lg text-neutral-300">
                3 tahmin hakkı
              </div>
              <p className="text-sm text-neutral-400">Oyun kuralları gereği değiştirilemez</p>
            </div>

            {/* Animation Speed */}
            <Select
              value={animationSpeed}
              onChange={(value) => handleAnimationSpeedChange(value as any)}
              options={[
                { value: 'slow', label: 'Yavaş' },
                { value: 'normal', label: 'Normal' },
                { value: 'fast', label: 'Hızlı' },
              ]}
              label="Animasyon Hızı"
              description="Oyun içi animasyonların hızını ayarlayın"
            />
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6" />
                Veri Yönetimi
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Database Size */}
            <div className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg">
              <span className="text-neutral-300">Veritabanı Boyutu:</span>
              <span className="text-neutral-100 font-semibold">{formatBytes(dbSize)}</span>
            </div>

            {/* Backup Button */}
            <Button
              variant="secondary"
              onClick={handleBackup}
              disabled={isProcessing}
              icon={<Download className="w-5 h-5" />}
              className="w-full"
            >
              Veritabanını Yedekle
            </Button>

            {/* Restore Button */}
            <Button
              variant="secondary"
              onClick={handleRestore}
              disabled={isProcessing}
              icon={<Upload className="w-5 h-5" />}
              className="w-full"
            >
              Veritabanını Geri Yükle
            </Button>

            {/* Reset Button */}
            <Button
              variant="destructive"
              onClick={() => setShowResetConfirm(true)}
              disabled={isProcessing}
              icon={<Trash2 className="w-5 h-5" />}
              className="w-full"
            >
              Tüm Verileri Sıfırla
            </Button>

            <p className="text-sm text-neutral-400">
              ⚠️ Sıfırlama işlemi geri alınamaz. Yedek almayı unutmayın!
            </p>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6" />
                Hakkında
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-100">Bil Bakalım</h3>
              <p className="text-neutral-300">Versiyon: 1.0.0</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-neutral-100">Açık Kaynak</h4>
              <p className="text-sm text-neutral-400">
                Bu proje MIT lisansı altında açık kaynak olarak geliştirilmiştir.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="secondary"
                onClick={() => window.open('https://github.com/anthropics/claude-code', '_blank')}
                icon={<Github className="w-5 h-5" />}
                className="w-full"
              >
                GitHub Repository
              </Button>

              <Button
                variant="secondary"
                onClick={() => window.open('https://opensource.org/licenses/MIT', '_blank')}
                icon={<FileCode className="w-5 h-5" />}
                className="w-full"
              >
                MIT License
              </Button>
            </div>

            <div className="mt-4 p-4 bg-neutral-700/30 rounded-lg">
              <p className="text-sm text-neutral-400 text-center">
                Tauri + React + TypeScript ile geliştirilmiştir
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Tüm Verileri Sıfırla"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-300">
            Bu işlem <strong className="text-error-400">tüm verilerinizi</strong> silecektir:
          </p>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
            <li>Tüm kategoriler (varsayılan kategori hariç)</li>
            <li>Tüm kelimeler</li>
            <li>Tüm oyun geçmişi</li>
            <li>Ayarlar varsayılana döner</li>
          </ul>
          <p className="text-error-400 font-semibold">⚠️ Bu işlem geri alınamaz!</p>
          <p className="text-neutral-400">Devam etmek istediğinizden emin misiniz?</p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowResetConfirm(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetConfirm}
              loading={isProcessing}
              className="flex-1"
            >
              Evet, Sıfırla
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
