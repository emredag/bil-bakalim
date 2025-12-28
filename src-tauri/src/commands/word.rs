//! Word management commands

use crate::db;
use crate::errors::AppError;
use crate::models::Word;

/// Get all words for a specific category
#[tauri::command]
pub fn get_words_by_category(category_id: i32) -> Result<Vec<Word>, AppError> {
    let conn = db::get_connection()?;

    let mut stmt = conn.prepare(
        "SELECT id, category_id, word, letter_count, hint, created_at
         FROM words
         WHERE category_id = ?1
         ORDER BY letter_count ASC, word ASC",
    )?;

    let words = stmt
        .query_map([category_id], |row| {
            Ok(Word {
                id: row.get(0)?,
                category_id: row.get(1)?,
                word: row.get(2)?,
                letter_count: row.get(3)?,
                hint: row.get(4)?,
                created_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(words)
}

/// Add a new word to a category
#[tauri::command]
pub fn add_word(category_id: i32, word: String, hint: String) -> Result<Word, AppError> {
    let conn = db::get_connection()?;

    // Convert word to uppercase and calculate letter count
    // Use chars().count() for proper Unicode character counting (Turkish: ş, ğ, ü, ö, ç, ı, İ)
    let word_upper = word.to_uppercase();
    let letter_count = word_upper.chars().count() as i32;

    // Validate letter count (4-10)
    if !(4..=10).contains(&letter_count) {
        return Err(AppError::ValidationError(
            "Kelime uzunluğu 4-10 harf arasında olmalıdır".to_string(),
        ));
    }

    // Insert the word
    conn.execute(
        "INSERT INTO words (category_id, word, letter_count, hint) VALUES (?1, ?2, ?3, ?4)",
        (category_id, &word_upper, letter_count, &hint),
    )?;

    let id = conn.last_insert_rowid() as i32;

    // Fetch and return the created word
    let word = conn.query_row(
        "SELECT id, category_id, word, letter_count, hint, created_at
         FROM words
         WHERE id = ?1",
        [id],
        |row| {
            Ok(Word {
                id: row.get(0)?,
                category_id: row.get(1)?,
                word: row.get(2)?,
                letter_count: row.get(3)?,
                hint: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    )?;

    Ok(word)
}

/// Update an existing word
#[tauri::command]
pub fn update_word(id: i32, word: String, hint: String) -> Result<Word, AppError> {
    let conn = db::get_connection()?;

    // Convert word to uppercase and calculate letter count
    // Use chars().count() for proper Unicode character counting (Turkish: ş, ğ, ü, ö, ç, ı, İ)
    let word_upper = word.to_uppercase();
    let letter_count = word_upper.chars().count() as i32;

    // Validate letter count (4-10)
    if !(4..=10).contains(&letter_count) {
        return Err(AppError::ValidationError(
            "Kelime uzunluğu 4-10 harf arasında olmalıdır".to_string(),
        ));
    }

    // Update the word
    let rows_affected = conn.execute(
        "UPDATE words
         SET word = ?1, letter_count = ?2, hint = ?3
         WHERE id = ?4",
        (&word_upper, letter_count, &hint, id),
    )?;

    if rows_affected == 0 {
        return Err(AppError::NotFoundError("Kelime bulunamadı".to_string()));
    }

    // Fetch and return the updated word
    let word = conn.query_row(
        "SELECT id, category_id, word, letter_count, hint, created_at
         FROM words
         WHERE id = ?1",
        [id],
        |row| {
            Ok(Word {
                id: row.get(0)?,
                category_id: row.get(1)?,
                word: row.get(2)?,
                letter_count: row.get(3)?,
                hint: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    )?;

    Ok(word)
}

/// Delete a word
#[tauri::command]
pub fn delete_word(id: i32) -> Result<(), AppError> {
    let conn = db::get_connection()?;

    let rows_affected = conn.execute("DELETE FROM words WHERE id = ?1", [id])?;

    if rows_affected == 0 {
        return Err(AppError::NotFoundError("Kelime bulunamadı".to_string()));
    }

    Ok(())
}

/// Get random words for game play
///
/// Selects exactly 2 words from each letter length (4-10) for a total of 14 words.
/// Excludes words with IDs in the exclude_ids list (used in multiplayer mode).
///
/// # Arguments
/// * `category_id` - Category to select words from
/// * `exclude_ids` - List of word IDs to exclude (already selected for other players)
///
/// # Returns
/// * Vector of exactly 14 random words (2 per letter length 4-10)
#[tauri::command]
pub fn get_random_words(category_id: i32, exclude_ids: Vec<i32>) -> Result<Vec<Word>, AppError> {
    let conn = db::get_connection()?;
    let mut selected_words = Vec::new();

    // For each letter length (4-10), select 2 random words
    for letter_count in 4..=10 {
        // Build exclude clause
        let exclude_clause = if exclude_ids.is_empty() {
            String::new()
        } else {
            let ids = exclude_ids
                .iter()
                .map(|id| id.to_string())
                .collect::<Vec<_>>()
                .join(",");
            format!("AND id NOT IN ({})", ids)
        };

        let query = format!(
            "SELECT id, category_id, word, letter_count, hint, created_at
             FROM words
             WHERE category_id = ?1 AND letter_count = ?2 {}
             ORDER BY RANDOM()
             LIMIT 2",
            exclude_clause
        );

        let mut stmt = conn.prepare(&query)?;
        let words: Vec<Word> = stmt
            .query_map([category_id, letter_count], |row| {
                Ok(Word {
                    id: row.get(0)?,
                    category_id: row.get(1)?,
                    word: row.get(2)?,
                    letter_count: row.get(3)?,
                    hint: row.get(4)?,
                    created_at: row.get(5)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        if words.len() < 2 {
            return Err(AppError::ValidationError(format!(
                "Kategori için yeterli {} harfli kelime yok (en az 2 gerekli, {} bulundu)",
                letter_count,
                words.len()
            )));
        }

        selected_words.extend(words);
    }

    // DO NOT shuffle! Words must be presented in order by length (4,4,5,5,6,6,7,7,8,8,9,9,10,10)
    // as per game rules: "Kelimeler artan zorlukta ilerler"
    // Each pair (2 words of same length) is already randomized by RANDOM() in SQL query

    Ok(selected_words)
}

/// Validate if a category has enough words for a specific game mode
///
/// # Arguments
/// * `category_id` - Category to validate
/// * `mode` - Game mode: "single", "multi", or "team"
/// * `participant_count` - Number of players or teams
///
/// # Returns
/// * true if category has enough words, false otherwise
#[tauri::command]
pub fn validate_category_for_mode(
    category_id: i32,
    _mode: String,
    participant_count: i32,
) -> Result<bool, AppError> {
    let conn = db::get_connection()?;

    // Calculate required words
    // Each participant needs 14 words (2 per letter length 4-10)
    let required_words_total = participant_count * 14;
    let required_words_per_length = participant_count * 2;

    // Check total word count
    let total_words: i32 = conn.query_row(
        "SELECT COUNT(*) FROM words WHERE category_id = ?1",
        [category_id],
        |row| row.get(0),
    )?;

    if total_words < required_words_total {
        return Ok(false);
    }

    // Check each letter length has enough words
    for letter_count in 4..=10 {
        let count: i32 = conn.query_row(
            "SELECT COUNT(*) FROM words WHERE category_id = ?1 AND letter_count = ?2",
            [category_id, letter_count],
            |row| row.get(0),
        )?;

        if count < required_words_per_length {
            return Ok(false);
        }
    }

    Ok(true)
}
