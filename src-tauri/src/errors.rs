//! Error types for Tauri commands
//!
//! All errors are serializable to JSON for frontend consumption

use serde::Serialize;

/// Main application error type
#[derive(Debug, Serialize)]
pub enum AppError {
    /// Database operation errors
    DatabaseError(String),
    /// Validation errors (business logic)
    ValidationError(String),
    /// Resource not found errors
    NotFoundError(String),
    /// Duplicate entry errors
    DuplicateError(String),
    /// File system operation errors
    FileSystemError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
            AppError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            AppError::NotFoundError(msg) => write!(f, "Not found: {}", msg),
            AppError::DuplicateError(msg) => write!(f, "Duplicate entry: {}", msg),
            AppError::FileSystemError(msg) => write!(f, "File system error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

/// Convert rusqlite errors to AppError
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        match err {
            rusqlite::Error::QueryReturnedNoRows => {
                AppError::NotFoundError("Kayıt bulunamadı".to_string())
            }
            rusqlite::Error::SqliteFailure(error, Some(msg)) => {
                // Check for UNIQUE constraint violation
                if error.code == rusqlite::ErrorCode::ConstraintViolation {
                    AppError::DuplicateError(format!("Bu kayıt zaten mevcut: {}", msg))
                } else {
                    AppError::DatabaseError(format!("Veritabanı hatası: {}", msg))
                }
            }
            _ => AppError::DatabaseError(format!("Veritabanı hatası: {}", err)),
        }
    }
}

/// Convert std::io errors to AppError
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::FileSystemError(format!("Dosya işlem hatası: {}", err))
    }
}

/// Convert serde_json errors to AppError
impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::FileSystemError(format!("JSON işlem hatası: {}", err))
    }
}
