//! Database schema definitions and migrations
//!
//! This module contains all SQL table definitions, indexes, and migration logic.
//!
//! Tables:
//! - categories: Word categories (4-10 letters per word)
//! - words: Individual words with hints
//! - settings: Application settings (key-value pairs)
//! - game_history: Historical game sessions
//! - game_participants: Players or teams in each game
//! - game_word_results: Word-by-word results for each participant

use rusqlite::{Connection, Result};

/// Run all database migrations in a transaction
///
/// This function creates all tables, indexes, and constraints.
/// It's idempotent - safe to run multiple times.
pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch("BEGIN TRANSACTION;")?;

    match create_all_tables(conn) {
        Ok(_) => {
            conn.execute_batch("COMMIT;")?;
            Ok(())
        }
        Err(e) => {
            conn.execute_batch("ROLLBACK;")?;
            Err(e)
        }
    }
}

/// Create all database tables and indexes
fn create_all_tables(conn: &Connection) -> Result<()> {
    create_categories_table(conn)?;
    create_words_table(conn)?;
    create_settings_table(conn)?;
    create_game_history_table(conn)?;
    create_game_participants_table(conn)?;
    create_game_word_results_table(conn)?;
    create_all_indexes(conn)?;
    Ok(())
}

/// Create the categories table
///
/// Stores word categories with metadata
fn create_categories_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            emoji TEXT,
            description TEXT,
            is_default BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;
    Ok(())
}

/// Create the words table with foreign key and CHECK constraint
///
/// Stores words associated with categories.
/// Constraint: letter_count must be between 4 and 10 (inclusive)
fn create_words_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            word TEXT NOT NULL,
            letter_count INTEGER NOT NULL CHECK (letter_count BETWEEN 4 AND 10),
            hint TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )",
        [],
    )?;
    Ok(())
}

/// Create the settings table
///
/// Key-value store for application settings
fn create_settings_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )",
        [],
    )?;
    Ok(())
}

/// Create the game_history table
///
/// Stores historical game sessions
/// game_mode: "single" | "multi" | "team"
fn create_game_history_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS game_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            category_name TEXT NOT NULL,
            game_mode TEXT NOT NULL,
            played_at DATETIME NOT NULL,
            total_time_seconds INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )",
        [],
    )?;
    Ok(())
}

/// Create the game_participants table
///
/// Stores individual players or teams in each game
/// participant_type: "player" | "team"
fn create_game_participants_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS game_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_history_id INTEGER NOT NULL,
            participant_name TEXT NOT NULL,
            participant_type TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            words_found INTEGER DEFAULT 0,
            words_skipped INTEGER DEFAULT 0,
            letters_revealed INTEGER DEFAULT 0,
            rank INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_history_id) REFERENCES game_history(id) ON DELETE CASCADE
        )",
        [],
    )?;
    Ok(())
}

/// Create the game_word_results table
///
/// Stores word-by-word results for each participant
/// result: "found" | "skipped" | "timeout"
fn create_game_word_results_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS game_word_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_history_id INTEGER NOT NULL,
            participant_id INTEGER,
            word TEXT NOT NULL,
            word_hint TEXT,
            result TEXT NOT NULL,
            points_earned INTEGER DEFAULT 0,
            letters_used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_history_id) REFERENCES game_history(id) ON DELETE CASCADE,
            FOREIGN KEY (participant_id) REFERENCES game_participants(id) ON DELETE SET NULL
        )",
        [],
    )?;
    Ok(())
}

/// Create all performance indexes
///
/// Indexes improve query performance for:
/// - Filtering words by category
/// - Filtering words by letter count
/// - Sorting game history by date
/// - Joining related tables
fn create_all_indexes(conn: &Connection) -> Result<()> {
    // Index for words filtered by category
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_words_category 
         ON words(category_id)",
        [],
    )?;

    // Index for words filtered by letter count
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_words_letter_count 
         ON words(letter_count)",
        [],
    )?;

    // Index for game history sorted by date
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_game_history_played_at 
         ON game_history(played_at)",
        [],
    )?;

    // Index for game history filtered by category
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_game_history_category 
         ON game_history(category_id)",
        [],
    )?;

    // Index for participants joined by game
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_game_participants_game 
         ON game_participants(game_history_id)",
        [],
    )?;

    // Index for word results joined by game
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_game_word_results_game 
         ON game_word_results(game_history_id)",
        [],
    )?;

    Ok(())
}
