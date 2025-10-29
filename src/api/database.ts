/**
 * Database API - Wrapper for Tauri database commands
 * Task 31: Settings Screen - Data Management
 *
 * Provides TypeScript interface for:
 * - Database backup/restore
 * - Data reset
 * - Database statistics
 */

import { invoke } from '@tauri-apps/api/core';
import { save, open } from '@tauri-apps/plugin-dialog';

/**
 * Backup database to a user-selected file
 * Opens a save dialog and exports the database
 *
 * @returns Success message or throws error
 */
export async function backupDatabase(): Promise<string> {
  // Generate timestamp-based filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Remove milliseconds and 'Z'

  const defaultFilename = `word-game-backup-${timestamp}.db`;

  // Open save dialog
  const filePath = await save({
    defaultPath: defaultFilename,
    filters: [
      {
        name: 'Database',
        extensions: ['db'],
      },
    ],
  });

  if (!filePath) {
    throw new Error('Backup cancelled');
  }

  // Call Tauri command
  const result = await invoke<string>('backup_database', {
    backupPath: filePath,
  });

  return result;
}

/**
 * Restore database from a user-selected file
 * Opens an open dialog and imports the database
 *
 * IMPORTANT: This will overwrite all current data!
 * Application restart is required after restore.
 *
 * @returns Success message or throws error
 */
export async function restoreDatabase(): Promise<string> {
  // Open file dialog
  const filePath = await open({
    multiple: false,
    filters: [
      {
        name: 'Database',
        extensions: ['db'],
      },
    ],
  });

  if (!filePath) {
    throw new Error('Restore cancelled');
  }

  // Call Tauri command
  const result = await invoke<string>('restore_database', {
    restorePath: filePath,
  });

  return result;
}

/**
 * Reset all data to defaults
 * Deletes all user data and reinitializes with default category
 *
 * IMPORTANT: This cannot be undone!
 *
 * @returns Success message or throws error
 */
export async function resetAllData(): Promise<string> {
  const result = await invoke<string>('reset_all_data');
  return result;
}

/**
 * Get database file size
 * Useful for displaying storage information in settings
 *
 * @returns Database size in bytes
 */
export async function getDatabaseSize(): Promise<number> {
  const size = await invoke<number>('get_database_size');
  return size;
}

/**
 * Format bytes to human-readable string
 * Helper function for displaying database size
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
