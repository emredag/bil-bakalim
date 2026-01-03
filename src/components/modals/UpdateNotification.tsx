/**
 * Update Notification Modal
 * 
 * Shows when a new version is available on GitHub
 */

import { openUrl } from '@tauri-apps/plugin-opener';
import { Download, Sparkles, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ReleaseInfo, detectPlatform, Platform } from '../../services/versionService';

interface UpdateNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  releaseInfo: ReleaseInfo;
}

/**
 * Get platform display name
 */
function getPlatformName(platform: Platform): string {
  switch (platform) {
    case 'windows': return 'Windows';
    case 'macos': return 'macOS';
    case 'linux': return 'Linux';
    default: return 'Bilinmeyen';
  }
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UpdateNotification({
  isOpen,
  onClose,
  currentVersion,
  releaseInfo,
}: UpdateNotificationProps) {
  const platform = detectPlatform();
  const hasDirectDownload = !!releaseInfo.downloadUrl;

  const handleDirectDownload = () => {
    if (releaseInfo.downloadUrl) {
      openUrl(releaseInfo.downloadUrl);
      onClose();
    }
  };

  const handleGoToReleases = () => {
    openUrl(releaseInfo.releaseUrl);
    onClose();
  };

  const handleLater = () => {
    // Just close for this session - will show again on next app start
    onClose();
  };

  // Parse release notes for display (first 500 chars)
  const truncatedNotes = releaseInfo.releaseNotes.length > 500
    ? releaseInfo.releaseNotes.substring(0, 500) + '...'
    : releaseInfo.releaseNotes;

  // Format date
  const publishDate = new Date(releaseInfo.publishedAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get current platform's download asset for showing file size
  const currentPlatformAsset = releaseInfo.downloadAssets.find(
    a => a.platform === platform
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleLater}
      title=""
      size="md"
    >
      <div className="space-y-5">
        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-500/20 rounded-xl">
            <Sparkles className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-100">Yeni Sürüm Mevcut!</h2>
            <p className="text-sm text-neutral-400">
              {releaseInfo.releaseName} • {publishDate}
            </p>
          </div>
        </div>

        {/* Version comparison */}
        <div className="flex items-center justify-center gap-4 p-4 bg-neutral-800/50 rounded-xl">
          <div className="text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Mevcut</p>
            <p className="text-lg font-mono font-semibold text-neutral-400">v{currentVersion}</p>
          </div>
          <div className="text-2xl text-neutral-600">→</div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Yeni</p>
            <p className="text-lg font-mono font-semibold text-primary-400">v{releaseInfo.version}</p>
          </div>
        </div>

        {/* Release notes */}
        {truncatedNotes && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-300">Yenilikler:</h3>
            <div className="max-h-32 overflow-y-auto p-3 bg-neutral-800/30 rounded-lg text-sm text-neutral-400 whitespace-pre-wrap">
              {truncatedNotes}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          {hasDirectDownload ? (
            <Button
              variant="primary"
              onClick={handleDirectDownload}
              icon={<Download className="w-5 h-5" />}
              className="w-full"
            >
              {getPlatformName(platform)} için İndir
              {currentPlatformAsset && (
                <span className="ml-2 text-xs opacity-70">
                  ({formatFileSize(currentPlatformAsset.size)})
                </span>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleGoToReleases}
              icon={<ExternalLink className="w-5 h-5" />}
              className="w-full"
            >
              GitHub'dan İndir
            </Button>
          )}

          {hasDirectDownload && (
            <Button
              variant="secondary"
              onClick={handleGoToReleases}
              icon={<ExternalLink className="w-4 h-4" />}
              className="w-full"
            >
              Tüm İndirme Seçenekleri
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={handleLater}
            className="w-full"
          >
            Sonra Hatırlat
          </Button>
        </div>

        <p className="text-xs text-neutral-500 text-center">
          Güncellemeleri kontrol etmek için Ayarlar → Yeni Versiyonlar'a gidin
        </p>
      </div>
    </Modal>
  );
}
