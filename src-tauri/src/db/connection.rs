//! Database connection management
//!
//! Handles database file location and connection initialization

use rusqlite::{Connection, Result};
use std::path::PathBuf;

/// Get the database file path in the user's application data directory
///
/// Platform-specific locations:
/// - Windows: `%APPDATA%\com.bilbakalim.app\word-game.db`
/// - macOS: `~/Library/Application Support/com.bilbakalim.app/word-game.db`
/// - Linux: `~/.local/share/com.bilbakalim.app/word-game.db`
pub fn get_db_path() -> Result<PathBuf, String> {
    let app_dir =
        dirs::data_dir().ok_or_else(|| "Could not determine user data directory".to_string())?;

    let db_dir = app_dir.join("com.bilbakalim.app");

    // Create directory if it doesn't exist
    std::fs::create_dir_all(&db_dir)
        .map_err(|e| format!("Failed to create database directory: {}", e))?;

    Ok(db_dir.join("word-game.db"))
}

/// Get a database connection with foreign keys enabled
///
/// This function:
/// 1. Determines the platform-specific database path
/// 2. Opens or creates the database file
/// 3. Enables foreign key constraints (PRAGMA foreign_keys = ON)
pub fn get_connection() -> Result<Connection> {
    let db_path = get_db_path().map_err(|e| rusqlite::Error::InvalidPath(PathBuf::from(e)))?;

    let conn = Connection::open(&db_path)?;

    // Enable foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON", [])?;

    Ok(conn)
}

/// Initialize the database by running all migrations and seeding
///
/// This function should be called on application startup to ensure:
/// 1. The database schema is created and up-to-date
/// 2. Default data is seeded (only on first launch)
pub fn init_database() -> Result<()> {
    let conn = get_connection()?;
    super::schema::run_migrations(&conn)?;
    super::seed::seed_database(&conn)?;
    Ok(())
}
