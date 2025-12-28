/**
 * Session Tracker Utility
 * Prevents duplicate saves in React Strict Mode with automatic cleanup
 * to prevent memory leaks from accumulating session IDs
 */

// Session ID tracking with automatic cleanup
const savedSessionIds = new Map<string, number>();
const MAX_SAVED_SESSIONS = 100;
const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Clean up old sessions to prevent memory leaks
 */
export function cleanupOldSessions(): void {
  const now = Date.now();
  
  // Remove expired sessions
  for (const [id, timestamp] of savedSessionIds.entries()) {
    if (now - timestamp > SESSION_EXPIRY_MS) {
      savedSessionIds.delete(id);
    }
  }
  
  // If still too many, remove oldest entries
  if (savedSessionIds.size > MAX_SAVED_SESSIONS) {
    const entries = Array.from(savedSessionIds.entries());
    entries.sort((a, b) => a[1] - b[1]);
    const toRemove = entries.slice(0, entries.length - MAX_SAVED_SESSIONS);
    toRemove.forEach(([id]) => savedSessionIds.delete(id));
  }
}

/**
 * Check if a session has already been saved
 */
export function isSessionSaved(sessionId: string): boolean {
  return savedSessionIds.has(sessionId);
}

/**
 * Mark a session as saved with current timestamp
 */
export function markSessionSaved(sessionId: string): void {
  savedSessionIds.set(sessionId, Date.now());
}

/**
 * Remove a session from saved list (e.g., on save error)
 */
export function unmarkSessionSaved(sessionId: string): void {
  savedSessionIds.delete(sessionId);
}
