//! Settings management commands

use crate::db;
use crate::errors::AppError;
use crate::models::Settings;

/// Get all application settings
#[tauri::command]
pub fn get_settings() -> Result<Settings, AppError> {
    let conn = db::get_connection()?;

    let mut stmt = conn.prepare("SELECT key, value FROM settings")?;

    let settings: Settings = stmt
        .query_map([], |row| {
            let key: String = row.get(0)?;
            let value: String = row.get(1)?;
            Ok((key, value))
        })?
        .collect::<Result<_, _>>()?;

    Ok(settings)
}

/// Update a single setting value
///
/// If the setting doesn't exist, it will be created
#[tauri::command]
pub fn update_setting(key: String, value: String) -> Result<(), AppError> {
    let conn = db::get_connection()?;

    // Use INSERT OR REPLACE to handle both insert and update
    conn.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
        (&key, &value),
    )?;

    Ok(())
}
