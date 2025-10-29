//! Game history management commands
//! PRD Reference: Section 4.8 - Game History Screen

use crate::db;
use crate::errors::AppError;
use crate::models::{GameHistory, GameParticipant, GameWordResult};
use rusqlite::params;
use serde::{Deserialize, Serialize};

/// Get all game history entries with optional filters
#[tauri::command]
pub fn get_all_game_history(
    category_id: Option<i32>,
    game_mode: Option<String>,
    start_date: Option<String>,
    end_date: Option<String>,
    sort_by: Option<String>, // "date_desc", "date_asc", "score_desc"
    limit: Option<i32>,
    offset: Option<i32>,
) -> Result<Vec<GameHistory>, AppError> {
    let conn = db::get_connection()?;

    // Build dynamic query
    let mut query = String::from(
        "SELECT gh.id, gh.category_id, c.name as category_name, gh.game_mode, 
                gh.played_at, gh.total_time_seconds, gh.created_at
         FROM game_history gh
         JOIN categories c ON gh.category_id = c.id
         WHERE 1=1",
    );

    // Add filters
    if category_id.is_some() {
        query.push_str(" AND gh.category_id = ?");
    }
    if game_mode.is_some() {
        query.push_str(" AND gh.game_mode = ?");
    }
    if start_date.is_some() {
        query.push_str(" AND date(gh.played_at) >= date(?)");
    }
    if end_date.is_some() {
        query.push_str(" AND date(gh.played_at) <= date(?)");
    }

    // Add sorting
    let sort_clause = match sort_by.as_deref() {
        Some("date_asc") => " ORDER BY gh.played_at ASC",
        Some("score_desc") => " ORDER BY (SELECT MAX(score) FROM game_participants WHERE game_history_id = gh.id) DESC",
        _ => " ORDER BY gh.played_at DESC", // default: date_desc
    };
    query.push_str(sort_clause);

    // Add pagination
    let limit_value = limit.unwrap_or(50);
    let offset_value = offset.unwrap_or(0);
    query.push_str(&format!(" LIMIT {} OFFSET {}", limit_value, offset_value));

    // Prepare statement and bind parameters
    let mut stmt = conn.prepare(&query)?;

    // Build params vector dynamically
    let mut param_values: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
    if let Some(cat_id) = category_id {
        param_values.push(Box::new(cat_id));
    }
    if let Some(mode) = game_mode {
        param_values.push(Box::new(mode));
    }
    if let Some(start) = start_date {
        param_values.push(Box::new(start));
    }
    if let Some(end) = end_date {
        param_values.push(Box::new(end));
    }

    let param_refs: Vec<&dyn rusqlite::ToSql> = param_values.iter().map(|b| b.as_ref()).collect();

    let histories = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(GameHistory {
                id: row.get(0)?,
                category_id: row.get(1)?,
                category_name: row.get(2)?,
                game_mode: row.get(3)?,
                played_at: row.get(4)?,
                total_time_seconds: row.get(5)?,
                created_at: row.get(6)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(histories)
}

/// Get a single game history entry by ID
#[tauri::command]
pub fn get_game_history_by_id(id: i32) -> Result<GameHistory, AppError> {
    let conn = db::get_connection()?;

    let history = conn.query_row(
        "SELECT gh.id, gh.category_id, c.name as category_name, gh.game_mode, 
                gh.played_at, gh.total_time_seconds, gh.created_at
         FROM game_history gh
         JOIN categories c ON gh.category_id = c.id
         WHERE gh.id = ?1",
        [id],
        |row| {
            Ok(GameHistory {
                id: row.get(0)?,
                category_id: row.get(1)?,
                category_name: row.get(2)?,
                game_mode: row.get(3)?,
                played_at: row.get(4)?,
                total_time_seconds: row.get(5)?,
                created_at: row.get(6)?,
            })
        },
    )?;

    Ok(history)
}

/// Get participants for a game
#[tauri::command]
pub fn get_game_participants(game_history_id: i32) -> Result<Vec<GameParticipant>, AppError> {
    let conn = db::get_connection()?;

    let mut stmt = conn.prepare(
        "SELECT id, game_history_id, participant_name, participant_type, 
                score, words_found, words_skipped, letters_revealed, rank, created_at
         FROM game_participants
         WHERE game_history_id = ?1
         ORDER BY rank ASC, score DESC",
    )?;

    let participants = stmt
        .query_map([game_history_id], |row| {
            Ok(GameParticipant {
                id: row.get(0)?,
                game_history_id: row.get(1)?,
                participant_name: row.get(2)?,
                participant_type: row.get(3)?,
                score: row.get(4)?,
                words_found: row.get(5)?,
                words_skipped: row.get(6)?,
                letters_revealed: row.get(7)?,
                rank: row.get(8)?,
                created_at: row.get(9)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(participants)
}

/// Get word results for a participant
#[tauri::command]
pub fn get_participant_word_results(participant_id: i32) -> Result<Vec<GameWordResult>, AppError> {
    let conn = db::get_connection()?;

    let mut stmt = conn.prepare(
        "SELECT id, game_history_id, participant_id, word, word_hint, 
                result, points_earned, letters_used, created_at
         FROM game_word_results
         WHERE participant_id = ?1
         ORDER BY id ASC",
    )?;

    let results = stmt
        .query_map([participant_id], |row| {
            Ok(GameWordResult {
                id: row.get(0)?,
                game_history_id: row.get(1)?,
                participant_id: row.get(2)?,
                word: row.get(3)?,
                word_hint: row.get(4)?,
                result: row.get(5)?,
                points_earned: row.get(6)?,
                letters_used: row.get(7)?,
                created_at: row.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(results)
}

/// Get game history statistics
#[tauri::command]
pub fn get_game_history_stats() -> Result<GameHistoryStats, AppError> {
    let conn = db::get_connection()?;

    // Total games
    let total_games: i32 =
        conn.query_row("SELECT COUNT(*) FROM game_history", [], |row| row.get(0))?;

    // Most played category
    let most_played_category = if total_games > 0 {
        conn.query_row(
            "SELECT c.name, c.emoji, COUNT(*) as play_count
             FROM game_history gh
             JOIN categories c ON gh.category_id = c.id
             GROUP BY gh.category_id
             ORDER BY play_count DESC
             LIMIT 1",
            [],
            |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
        )
        .ok()
    } else {
        None
    };

    // Highest score
    let highest_score: i32 = conn.query_row(
        "SELECT COALESCE(MAX(score), 0) FROM game_participants",
        [],
        |row| row.get(0),
    )?;

    // Total play time (in seconds)
    let total_play_time: i32 = conn.query_row(
        "SELECT COALESCE(SUM(total_time_seconds), 0) FROM game_history WHERE total_time_seconds IS NOT NULL",
        [],
        |row| row.get(0)
    )?;

    Ok(GameHistoryStats {
        total_games,
        most_played_category,
        highest_score,
        total_play_time_seconds: total_play_time,
    })
}

/// Delete a game history entry (with cascade)
#[tauri::command]
pub fn delete_game_history(id: i32) -> Result<(), AppError> {
    let conn = db::get_connection()?;

    // Check if exists
    let _ = get_game_history_by_id(id)?;

    // Delete (will cascade to participants and word_results)
    conn.execute("DELETE FROM game_history WHERE id = ?1", [id])?;

    Ok(())
}

/// Delete all game history
#[tauri::command]
pub fn delete_all_game_history() -> Result<(), AppError> {
    let conn = db::get_connection()?;

    conn.execute("DELETE FROM game_history", [])?;

    Ok(())
}

/// Save a complete game session to history
#[tauri::command]
pub fn save_game_to_history(session: GameSessionData) -> Result<i32, AppError> {
    let conn = db::get_connection()?;

    // Start transaction
    let tx = conn.unchecked_transaction()?;

    // Insert game_history
    tx.execute(
        "INSERT INTO game_history (category_id, category_name, game_mode, played_at, total_time_seconds)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            session.category_id,
            session.category_name,
            session.game_mode,
            session.played_at,
            session.total_time_seconds
        ],
    )?;

    let game_history_id = tx.last_insert_rowid() as i32;

    // Insert participants
    for participant in &session.participants {
        tx.execute(
            "INSERT INTO game_participants 
             (game_history_id, participant_name, participant_type, score, words_found, words_skipped, letters_revealed, rank)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                game_history_id,
                participant.name,
                participant.participant_type,
                participant.score,
                participant.words_found,
                participant.words_skipped,
                participant.letters_revealed,
                participant.rank
            ],
        )?;

        let participant_id = tx.last_insert_rowid() as i32;

        // Insert word results
        for word_result in &participant.word_results {
            tx.execute(
                "INSERT INTO game_word_results 
                 (game_history_id, participant_id, word, word_hint, result, points_earned, letters_used)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                params![
                    game_history_id,
                    participant_id,
                    word_result.word,
                    word_result.word_hint,
                    word_result.result,
                    word_result.points_earned,
                    word_result.letters_used
                ],
            )?;
        }
    }

    // Commit transaction
    tx.commit()?;

    Ok(game_history_id)
}

/// Statistics summary for game history
#[derive(Debug, Serialize, Deserialize)]
pub struct GameHistoryStats {
    pub total_games: i32,
    pub most_played_category: Option<(String, String)>, // (name, emoji)
    pub highest_score: i32,
    pub total_play_time_seconds: i32,
}

/// Data structure for saving a game session
#[derive(Debug, Deserialize)]
pub struct GameSessionData {
    pub category_id: i32,
    pub category_name: String,
    pub game_mode: String,
    pub played_at: String,
    pub total_time_seconds: Option<i32>,
    pub participants: Vec<ParticipantData>,
}

#[derive(Debug, Deserialize)]
pub struct ParticipantData {
    pub name: String,
    pub participant_type: String,
    pub score: i32,
    pub words_found: i32,
    pub words_skipped: i32,
    pub letters_revealed: i32,
    pub rank: Option<i32>,
    pub word_results: Vec<WordResultData>,
}

#[derive(Debug, Deserialize)]
pub struct WordResultData {
    pub word: String,
    pub word_hint: Option<String>,
    pub result: String,
    pub points_earned: i32,
    pub letters_used: i32,
}
