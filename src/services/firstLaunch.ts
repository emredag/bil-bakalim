/**
 * First Launch Service
 * PRD Reference: Section 13.1 - İlk Kurulum Akışı
 *
 * Handles first launch detection and database initialization check
 */

const FIRST_LAUNCH_KEY = 'kelime-oyunu-first-launch-completed';

/**
 * Check if this is the first launch of the application
 * Uses localStorage to persist the launch state
 */
export function isFirstLaunch(): boolean {
  const completed = localStorage.getItem(FIRST_LAUNCH_KEY);
  return completed !== 'true';
}

/**
 * Mark the first launch experience as completed
 * This should be called after the user dismisses the welcome screen
 */
export function markFirstLaunchCompleted(): void {
  localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
}

/**
 * Reset first launch state (for testing purposes)
 * This will make the app show the welcome screen again
 */
export function resetFirstLaunch(): void {
  localStorage.removeItem(FIRST_LAUNCH_KEY);
}
