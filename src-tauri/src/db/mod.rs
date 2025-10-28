//! Database module for Kelime Oyunu
//! 
//! This module handles all SQLite database operations including:
//! - Database initialization and migrations
//! - Connection management
//! - Schema definitions
//! 
//! Database Schema:
//! - categories: Word categories with emoji and metadata
//! - words: Words associated with categories (4-10 letters)
//! - settings: Key-value application settings
//! - game_history: Historical game sessions
//! - game_participants: Players/teams in each game
//! - game_word_results: Detailed word-by-word game results

pub mod connection;
pub mod schema;
pub mod seed;

pub use connection::{get_connection, get_db_path, init_database};
