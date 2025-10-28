//! Tauri command modules
//!
//! All commands are exposed to the frontend via Tauri's invoke mechanism

pub mod category;
pub mod game_history;
pub mod settings;
pub mod word;

// Re-export all commands for easy registration
pub use category::*;
pub use game_history::*;
pub use settings::*;
pub use word::*;
