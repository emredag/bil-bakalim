//! Data models for the application

use serde::{Deserialize, Serialize};

/// Category model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub emoji: String,
    pub description: Option<String>,
    pub is_default: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Word model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Word {
    pub id: i32,
    pub category_id: i32,
    pub word: String,
    pub letter_count: i32,
    pub hint: String,
    pub created_at: String,
}

/// Category validation result
#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub total_words: i32,
    pub words_by_length: Vec<WordCountByLength>,
    pub max_players_single: i32,
    pub max_players_multi: i32,
    pub max_teams: i32,
    pub message: String,
}

/// Word count grouped by letter length
#[derive(Debug, Serialize, Deserialize)]
pub struct WordCountByLength {
    pub letter_count: i32,
    pub count: i32,
}

/// Settings map (key-value pairs)
pub type Settings = std::collections::HashMap<String, String>;
