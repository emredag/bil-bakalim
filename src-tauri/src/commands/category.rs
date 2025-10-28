//! Category management commands

use crate::db;
use crate::errors::AppError;
use crate::models::{Category, ValidationResult, WordCountByLength, CategoryExportData, CategoryExportInfo, WordExportInfo, ImportResult};

/// Get all categories from database
#[tauri::command]
pub fn get_all_categories() -> Result<Vec<Category>, AppError> {
    let conn = db::get_connection()?;

    let mut stmt = conn.prepare(
        "SELECT id, name, emoji, description, is_default, created_at, updated_at
         FROM categories
         ORDER BY is_default DESC, name ASC"
    )?;

    let categories = stmt
        .query_map([], |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                emoji: row.get(2)?,
                description: row.get(3)?,
                is_default: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(categories)
}

/// Get a single category by ID
#[tauri::command]
pub fn get_category_by_id(id: i32) -> Result<Category, AppError> {
    let conn = db::get_connection()?;

    let category = conn.query_row(
        "SELECT id, name, emoji, description, is_default, created_at, updated_at
         FROM categories
         WHERE id = ?1",
        [id],
        |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                emoji: row.get(2)?,
                description: row.get(3)?,
                is_default: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        },
    )?;

    Ok(category)
}

/// Create a new category
#[tauri::command]
pub fn create_category(
    name: String,
    emoji: String,
    description: Option<String>,
) -> Result<Category, AppError> {
    let conn = db::get_connection()?;

    // Insert the category
    conn.execute(
        "INSERT INTO categories (name, emoji, description) VALUES (?1, ?2, ?3)",
        (&name, &emoji, &description),
    )?;

    let id = conn.last_insert_rowid() as i32;

    // Fetch and return the created category
    get_category_by_id(id)
}

/// Update an existing category
#[tauri::command]
pub fn update_category(
    id: i32,
    name: String,
    emoji: String,
    description: Option<String>,
) -> Result<Category, AppError> {
    let conn = db::get_connection()?;

    // Check if category exists
    let _ = get_category_by_id(id)?;

    // Update the category
    conn.execute(
        "UPDATE categories
         SET name = ?1, emoji = ?2, description = ?3, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?4",
        (&name, &emoji, &description, id),
    )?;

    // Fetch and return the updated category
    get_category_by_id(id)
}

/// Delete a category
///
/// Prevents deletion of default category
#[tauri::command]
pub fn delete_category(id: i32) -> Result<(), AppError> {
    let conn = db::get_connection()?;

    // Check if it's the default category
    let category = get_category_by_id(id)?;
    if category.is_default {
        return Err(AppError::ValidationError(
            "Varsayılan kategori silinemez".to_string(),
        ));
    }

    // Delete the category (CASCADE will delete related words)
    let rows_affected = conn.execute("DELETE FROM categories WHERE id = ?1", [id])?;

    if rows_affected == 0 {
        return Err(AppError::NotFoundError("Kategori bulunamadı".to_string()));
    }

    Ok(())
}

/// Validate if a category is playable for a given mode and participant count
///
/// Returns detailed validation information including:
/// - Total word count
/// - Words per letter length
/// - Maximum supported players/teams
#[tauri::command]
pub fn validate_category(id: i32) -> Result<ValidationResult, AppError> {
    let conn = db::get_connection()?;

    // Check if category exists
    let _ = get_category_by_id(id)?;

    // Get total word count
    let total_words: i32 = conn.query_row(
        "SELECT COUNT(*) FROM words WHERE category_id = ?1",
        [id],
        |row| row.get(0),
    )?;

    // Get word count by letter length (4-10)
    let mut words_by_length = Vec::new();
    let mut min_words_per_length = i32::MAX;

    for letter_count in 4..=10 {
        let count: i32 = conn.query_row(
            "SELECT COUNT(*) FROM words WHERE category_id = ?1 AND letter_count = ?2",
            [id, letter_count],
            |row| row.get(0),
        )?;

        words_by_length.push(WordCountByLength {
            letter_count,
            count,
        });

        if count < min_words_per_length {
            min_words_per_length = count;
        }
    }

    // Calculate max supported players/teams
    // Each player needs 2 words per letter length (14 total)
    // So max players = min_words_per_length / 2
    let max_players_multi = if min_words_per_length >= 2 {
        min_words_per_length / 2
    } else {
        0
    };

    let max_teams = max_players_multi; // Same logic for teams

    // Check if valid for single player (needs 14 words minimum)
    let is_valid = total_words >= 14 && min_words_per_length >= 2;

    // Generate message
    let message = if !is_valid {
        if total_words < 14 {
            format!(
                "❌ Oynanamaz: En az 14 kelime gerekli (mevcut: {})",
                total_words
            )
        } else {
            format!(
                "❌ Oynanamaz: Her harf uzunluğundan en az 2 kelime gerekli (en az: {})",
                min_words_per_length
            )
        }
    } else if max_players_multi == 1 {
        format!("✅ Sadece tek yarışmacı modu için oynanabilir ({} kelime)", total_words)
    } else {
        format!(
            "✅ {} yarışmacıya/takıma kadar oynanabilir ({} kelime)",
            max_players_multi, total_words
        )
    };

    Ok(ValidationResult {
        is_valid,
        total_words,
        words_by_length,
        max_players_single: if is_valid { 1 } else { 0 },
        max_players_multi,
        max_teams,
        message,
    })
}

/// Export category and its words as JSON
///
/// Returns a JSON-serializable structure containing category info and all words
#[tauri::command]
pub fn export_category_json(category_id: i32) -> Result<CategoryExportData, AppError> {
    let conn = db::get_connection()?;

    // Get category info
    let category = get_category_by_id(category_id)?;

    // Get all words for this category
    let mut stmt = conn.prepare(
        "SELECT word, letter_count, hint
         FROM words
         WHERE category_id = ?1
         ORDER BY letter_count ASC, word ASC"
    )?;

    let words = stmt
        .query_map([category_id], |row| {
            Ok(WordExportInfo {
                word: row.get(0)?,
                letter_count: row.get(1)?,
                hint: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(CategoryExportData {
        category: CategoryExportInfo {
            name: category.name,
            emoji: category.emoji,
            description: category.description,
        },
        words,
    })
}

/// Import words from JSON data into a category
///
/// Validates the JSON structure and word format, then adds words to the category.
/// Skips duplicate words (same word text) and returns statistics.
#[tauri::command]
pub fn import_category_json(
    category_id: i32,
    json_data: CategoryExportData,
) -> Result<ImportResult, AppError> {
    let conn = db::get_connection()?;

    // Verify category exists
    let _ = get_category_by_id(category_id)?;

    let mut words_added = 0;
    let mut words_skipped = 0;

    // Process each word
    for word_info in json_data.words {
        // Validate word format (A-Z only, 4-10 letters)
        let word_upper = word_info.word.to_uppercase();

        // Check if valid characters (A-Z only)
        if !word_upper.chars().all(|c| c.is_ascii_alphabetic()) {
            words_skipped += 1;
            continue;
        }

        // Check length
        let letter_count = word_upper.len() as i32;
        if !(4..=10).contains(&letter_count) {
            words_skipped += 1;
            continue;
        }

        // Validate letter_count matches actual length
        if letter_count != word_info.letter_count {
            words_skipped += 1;
            continue;
        }

        // Check if word already exists in this category
        let exists: i32 = conn
            .query_row(
                "SELECT COUNT(*) FROM words WHERE category_id = ?1 AND word = ?2",
                (category_id, word_upper.as_str()),
                |row| row.get(0),
            )?;

        if exists > 0 {
            words_skipped += 1;
            continue;
        }

        // Insert the word
        match conn.execute(
            "INSERT INTO words (category_id, word, letter_count, hint) VALUES (?1, ?2, ?3, ?4)",
            (category_id, &word_upper, letter_count, &word_info.hint),
        ) {
            Ok(_) => words_added += 1,
            Err(_) => words_skipped += 1,
        }
    }

    let message = if words_added > 0 && words_skipped > 0 {
        format!("{} kelime eklendi, {} kelime zaten vardı veya geçersizdi", words_added, words_skipped)
    } else if words_added > 0 {
        format!("{} kelime başarıyla eklendi", words_added)
    } else {
        format!("Hiç kelime eklenmedi, {} kelime zaten vardı veya geçersizdi", words_skipped)
    };

    Ok(ImportResult {
        words_added,
        words_skipped,
        message,
    })
}
