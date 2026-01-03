/**
 * Version Service - GitHub Release Version Checker
 * 
 * Checks GitHub Releases API for new versions and notifies the user
 */

// Current app version (should match tauri.conf.json)
// TODO: Revert to '1.2.0' after testing
const CURRENT_VERSION = '1.3.0';

// GitHub API endpoint for releases
const GITHUB_RELEASES_API = 'https://api.github.com/repos/emredag/bil-bakalim/releases/latest';

// Local storage key for dismissed version
const DISMISSED_VERSION_KEY = 'dismissed_update_version';

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

export interface DownloadAsset {
  name: string;
  url: string;
  size: number;
  platform: Platform;
}

export interface ReleaseInfo {
  version: string;
  releaseUrl: string;
  releaseName: string;
  releaseNotes: string;
  publishedAt: string;
  downloadUrl: string | null; // Direct download URL for current platform
  downloadAssets: DownloadAsset[]; // All available downloads
}

export interface VersionCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string | null;
  releaseInfo: ReleaseInfo | null;
  error: string | null;
}

/**
 * Detect current platform
 */
export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) return 'windows';
  if (userAgent.includes('mac')) return 'macos';
  if (userAgent.includes('linux')) return 'linux';
  
  return 'unknown';
}

/**
 * Determine platform from asset filename
 */
function getAssetPlatform(filename: string): Platform {
  const lower = filename.toLowerCase();
  
  if (lower.includes('.exe') || lower.includes('.msi') || lower.includes('windows')) {
    return 'windows';
  }
  if (lower.includes('.dmg') || lower.includes('.app') || lower.includes('macos') || lower.includes('darwin')) {
    return 'macos';
  }
  if (lower.includes('.deb') || lower.includes('.appimage') || lower.includes('.rpm') || lower.includes('linux')) {
    return 'linux';
  }
  
  return 'unknown';
}

/**
 * Get the best download asset for current platform
 */
function getBestDownloadForPlatform(assets: DownloadAsset[], platform: Platform): string | null {
  // Filter assets for this platform
  const platformAssets = assets.filter(a => a.platform === platform);
  
  if (platformAssets.length === 0) return null;
  
  // Prefer certain file types
  const preferences: Record<Platform, string[]> = {
    windows: ['-setup.exe', '.exe', '.msi'],
    macos: ['.dmg', '.app.tar.gz'],
    linux: ['.AppImage', '.deb', '.rpm'],
    unknown: [],
  };
  
  const prefs = preferences[platform];
  
  for (const pref of prefs) {
    const match = platformAssets.find(a => a.name.toLowerCase().includes(pref.toLowerCase()));
    if (match) return match.url;
  }
  
  // Return first matching asset
  return platformAssets[0]?.url || null;
}

/**
 * Parse version string to comparable number
 * e.g., "1.2.3" -> 1002003
 */
function parseVersion(version: string): number {
  const cleaned = version.replace(/^v/, '');
  const parts = cleaned.split('.').map(p => parseInt(p, 10) || 0);
  return parts[0] * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}

/**
 * Compare two version strings
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const n1 = parseVersion(v1);
  const n2 = parseVersion(v2);
  if (n1 > n2) return 1;
  if (n1 < n2) return -1;
  return 0;
}

/**
 * Check if the user has dismissed this specific version update
 */
export function isVersionDismissed(version: string): boolean {
  try {
    const dismissed = localStorage.getItem(DISMISSED_VERSION_KEY);
    return dismissed === version;
  } catch {
    return false;
  }
}

/**
 * Mark a version as dismissed (user clicked "Sonra hatırlat" or similar)
 */
export function dismissVersion(version: string): void {
  try {
    localStorage.setItem(DISMISSED_VERSION_KEY, version);
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Clear dismissed version (show update notification again)
 */
export function clearDismissedVersion(): void {
  try {
    localStorage.removeItem(DISMISSED_VERSION_KEY);
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Get current app version
 */
export function getCurrentVersion(): string {
  return CURRENT_VERSION;
}

/**
 * Check GitHub Releases for new version
 */
export async function checkForUpdates(): Promise<VersionCheckResult> {
  try {
    const response = await fetch(GITHUB_RELEASES_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Bil-Bakalim-App',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as {
      tag_name: string;
      html_url: string;
      name: string;
      body: string;
      published_at: string;
      assets: Array<{
        name: string;
        browser_download_url: string;
        size: number;
      }>;
    };

    const latestVersion = data.tag_name.replace(/^v/, '');
    const hasUpdate = compareVersions(latestVersion, CURRENT_VERSION) > 0;

    // Parse download assets
    const downloadAssets: DownloadAsset[] = (data.assets || []).map(asset => ({
      name: asset.name,
      url: asset.browser_download_url,
      size: asset.size,
      platform: getAssetPlatform(asset.name),
    }));

    // Get best download URL for current platform
    const currentPlatform = detectPlatform();
    const downloadUrl = getBestDownloadForPlatform(downloadAssets, currentPlatform);

    return {
      hasUpdate,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      releaseInfo: {
        version: latestVersion,
        releaseUrl: data.html_url,
        releaseName: data.name || `v${latestVersion}`,
        releaseNotes: data.body || '',
        publishedAt: data.published_at,
        downloadUrl,
        downloadAssets,
      },
      error: null,
    };
  } catch (error) {
    return {
      hasUpdate: false,
      currentVersion: CURRENT_VERSION,
      latestVersion: null,
      releaseInfo: null,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Check for updates and return info only if not dismissed
 */
export async function checkForUpdatesIfNotDismissed(): Promise<VersionCheckResult> {
  const result = await checkForUpdates();
  
  if (result.hasUpdate && result.latestVersion && isVersionDismissed(result.latestVersion)) {
    return {
      ...result,
      hasUpdate: false, // Treat as no update since user dismissed it
    };
  }
  
  return result;
}
