/**
 * Database Management Commands
 * Task 31: Settings Screen - Data Management
 *
 * Provides commands for:
 * - Backup database to file
 * - Restore database from file
 * - Reset all data to defaults
 */

use crate::db;
use crate::errors::AppError;
use std::fs;
use std::path::Path;

/**
 * Backup database to a file
 * Exports the SQLite database to a user-specified location
 *
 * @param backup_path - Full path where backup should be saved
 * @returns Success message or error
 */
#[tauri::command]
pub fn backup_database(backup_path: String) -> Result<String, AppError> {
    // Get the current database path
    let db_path = db::get_db_path()
        .map_err(|e| AppError::DatabaseError(format!("Failed to get database path: {}", e)))?;

    // Check if database exists
    if !db_path.exists() {
        return Err(AppError::DatabaseError(
            "Database file not found".to_string(),
        ));
    }

    // Copy database file to backup location
    fs::copy(&db_path, &backup_path).map_err(|e| {
        AppError::DatabaseError(format!("Failed to backup database: {}", e))
    })?;

    Ok(format!("Database backed up successfully to: {}", backup_path))
}

/**
 * Restore database from a backup file
 * Replaces current database with the backup
 *
 * IMPORTANT: This will overwrite all current data!
 *
 * @param restore_path - Full path to the backup file
 * @returns Success message or error
 */
#[tauri::command]
pub fn restore_database(restore_path: String) -> Result<String, AppError> {
    // Check if backup file exists
    let backup_path = Path::new(&restore_path);
    if !backup_path.exists() {
        return Err(AppError::DatabaseError(
            "Backup file not found".to_string(),
        ));
    }

    // Get the current database path
    let db_path = db::get_db_path()
        .map_err(|e| AppError::DatabaseError(format!("Failed to get database path: {}", e)))?;

    // Create backup of current database before restoring (safety measure)
    if db_path.exists() {
        if let Some(parent) = db_path.parent() {
            let safety_backup = parent.join("word-game_pre_restore.db");
            fs::copy(&db_path, &safety_backup).ok(); // Don't fail if this doesn't work
        }
    }

    // Copy backup file to database location
    fs::copy(&backup_path, &db_path).map_err(|e| {
        AppError::DatabaseError(format!("Failed to restore database: {}", e))
    })?;

    Ok("Database restored successfully. Please restart the application.".to_string())
}

/**
 * Reset all data to defaults
 * Deletes all user data and re-initializes with default category
 *
 * IMPORTANT: This cannot be undone!
 *
 * @returns Success message or error
 */
#[tauri::command]
pub fn reset_all_data() -> Result<String, AppError> {
    let conn = db::get_connection()?;

    // Delete all data from tables (in reverse dependency order)
    conn.execute("DELETE FROM game_history_words", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete game history words: {}", e)))?;

    conn.execute("DELETE FROM game_history_participants", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete game history participants: {}", e)))?;

    conn.execute("DELETE FROM game_history", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete game history: {}", e)))?;

    conn.execute("DELETE FROM words", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete words: {}", e)))?;

    conn.execute("DELETE FROM categories WHERE id != 1", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete categories: {}", e)))?;

    // Reset settings to defaults
    conn.execute("DELETE FROM settings", [])
        .map_err(|e| AppError::DatabaseError(format!("Failed to delete settings: {}", e)))?;

    // Re-insert default settings
    conn.execute(
        "INSERT INTO settings (key, value) VALUES
         ('sound_enabled', 'true'),
         ('effects_volume', '80'),
         ('animation_speed', 'normal'),
         ('theme', 'dark'),
         ('language', 'tr'),
         ('show_hints', 'true'),
         ('show_tutorial', 'true')",
        [],
    )
    .map_err(|e| AppError::DatabaseError(format!("Failed to reset settings: {}", e)))?;

    // Ensure default category exists with proper name
    conn.execute(
        "UPDATE categories SET name = 'Genel', emoji = '📚', description = 'Genel kelimeler' WHERE id = 1",
        [],
    )
    .map_err(|e| AppError::DatabaseError(format!("Failed to reset default category: {}", e)))?;

    Ok("All data has been reset to defaults. The default 'Genel' category is ready for new words.".to_string())
}

/**
 * Get database file size for displaying in settings
 *
 * @returns Database file size in bytes, or error
 */
#[tauri::command]
pub fn get_database_size() -> Result<u64, AppError> {
    let db_path = db::get_db_path()
        .map_err(|e| AppError::DatabaseError(format!("Failed to get database path: {}", e)))?;

    if !db_path.exists() {
        return Ok(0);
    }

    let metadata = fs::metadata(&db_path).map_err(|e| {
        AppError::DatabaseError(format!("Failed to get database size: {}", e))
    })?;

    Ok(metadata.len())
}
