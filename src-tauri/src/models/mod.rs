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

/// Game history entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameHistory {
    pub id: i32,
    pub category_id: i32,
    pub category_name: String,
    pub game_mode: String,
    pub played_at: String,
    pub total_time_seconds: Option<i32>,
    pub created_at: String,
}

/// Game participant/team
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameParticipant {
    pub id: i32,
    pub game_history_id: i32,
    pub participant_name: String,
    pub participant_type: String, // 'player' or 'team'
    pub score: i32,
    pub words_found: i32,
    pub words_skipped: i32,
    pub letters_revealed: i32,
    pub rank: Option<i32>,
    pub created_at: String,
}

/// Word result from a game
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameWordResult {
    pub id: i32,
    pub game_history_id: i32,
    pub participant_id: i32,
    pub word: String,
    pub word_hint: Option<String>,
    pub result: String, // 'found', 'skipped', or 'timeout'
    pub points_earned: i32,
    pub letters_used: i32,
    pub created_at: String,
}

/// Settings map (key-value pairs)
pub type Settings = std::collections::HashMap<String, String>;
