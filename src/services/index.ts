/**
 * Services Module Exports
 */

export { isFirstLaunch, markFirstLaunchCompleted, resetFirstLaunch } from './firstLaunch';

export {
  getWordsByCategory,
  addWord,
  updateWord,
  deleteWord,
  getRandomWords,
  validateCategoryForMode,
  selectWordsForGame,
} from './wordService';

export { soundService } from './soundService';

export {
  checkForUpdates,
  checkForUpdatesIfNotDismissed,
  dismissVersion,
  clearDismissedVersion,
  getCurrentVersion,
  compareVersions,
  isVersionDismissed,
  detectPlatform,
  type ReleaseInfo,
  type VersionCheckResult,
  type DownloadAsset,
  type Platform,
} from './versionService';
